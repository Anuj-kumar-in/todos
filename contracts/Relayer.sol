// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Relayer
 * @dev Manages user virtual balances, staking, and rewards on L2 networks
 * Works in VIRTUAL-ONLY mode - no actual token transfers required
 * Each network has its own Relayer with independent virtual balances
 */
contract Relayer is ReentrancyGuard {
    
    address public deployer;
    address public backend;
    
    uint256 public constant NEW_USER_BONUS = 100 * 10**18;
    
    // Virtual balance tracking
    uint256 public totalStakedAmount;      // Total tokens currently staked in matches
    uint256 public totalVirtualBalance;    // Total of all user virtual balances
    
    // Match staking tracking
    mapping(uint256 => uint256) public matchStakePool;          // matchId => total staked for this match
    mapping(uint256 => mapping(address => uint256)) public userMatchStake; // matchId => user => stake amount
    mapping(uint256 => bool) public matchStakeDistributed;      // matchId => whether stakes have been distributed
    
    enum ActionType {
        CREATE_MATCH,
        JOIN_MATCH,
        START_VOTING,
        SUBMIT_VOTE,
        WITHDRAW_REWARDS
    }
    
    struct UserAction {
        uint256 actionId;
        address user;
        ActionType actionType;
        uint256 matchId;
        bytes actionData;
        uint256 timestamp;
        uint256 chainId;
        bool processed;
    }
    
    mapping(uint256 => UserAction) public actions;
    mapping(address => uint256[]) public userActions;
    mapping(address => bool) public registeredUsers;
    mapping(address => uint256) public userTodoBalance;  // Virtual balance
    
    uint256 public actionCounter;
    uint256 public totalUsersRegistered;
    
    // Events
    event ActionSubmitted(
        uint256 indexed actionId,
        address indexed user,
        ActionType actionType,
        uint256 indexed matchId,
        uint256 timestamp,
        uint256 chainId
    );
    
    event ActionProcessed(
        uint256 indexed actionId,
        address indexed user,
        bool success
    );
    
    event UserRegistered(
        address indexed user,
        uint256 bonusAmount,
        uint256 timestamp,
        uint256 chainId
    );
    
    event StakeReceived(
        address indexed user,
        uint256 indexed matchId,
        uint256 amount,
        uint256 timestamp
    );
    
    event RewardSent(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    
    event MatchRewardsDistributed(
        uint256 indexed matchId,
        address[] winners,
        uint256 totalReward,
        uint256 rewardPerWinner,
        uint256 timestamp
    );
    
    event StakeRefunded(
        uint256 indexed matchId,
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyDeployer() {
        require(msg.sender == deployer, "Only deployer can call this");
        _;
    }
    
    modifier onlyBackend() {
        require(msg.sender == backend || msg.sender == deployer, "Only backend/deployer can call this");
        _;
    }
    
    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }
    
    constructor(address _deployer, address _backend, address /* _todoToken - unused in virtual mode */) {
        deployer = _deployer;
        backend = _backend;
    }
    
    // ==================== User Registration ====================
    
    /**
     * @dev Register user and give them bonus virtual tokens
     */
    function registerUser() external nonReentrant returns (bool) {
        require(!registeredUsers[msg.sender], "User already registered");
        
        registeredUsers[msg.sender] = true;
        userTodoBalance[msg.sender] = NEW_USER_BONUS;
        totalVirtualBalance += NEW_USER_BONUS;
        totalUsersRegistered++;
        
        emit UserRegistered(msg.sender, NEW_USER_BONUS, block.timestamp, block.chainid);
        
        return true;
    }
    
    // ==================== Staking ====================
    
    /**
     * @dev Stake virtual tokens for a match - deducts from user balance and adds to match pool
     */
    function stakeForMatch(uint256 _matchId, uint256 _amount) external onlyRegistered nonReentrant {
        require(_amount > 0, "Stake amount must be positive");
        require(userTodoBalance[msg.sender] >= _amount, "Insufficient TODO balance");
        require(userMatchStake[_matchId][msg.sender] == 0, "Already staked for this match");
        
        // Deduct from user balance
        userTodoBalance[msg.sender] -= _amount;
        totalVirtualBalance -= _amount;
        
        // Add to match stake pool
        matchStakePool[_matchId] += _amount;
        userMatchStake[_matchId][msg.sender] = _amount;
        totalStakedAmount += _amount;
        
        emit StakeReceived(msg.sender, _matchId, _amount, block.timestamp);
    }
    
    /**
     * @dev Get user's stake for a specific match
     */
    function getUserMatchStake(uint256 _matchId, address _user) external view returns (uint256) {
        return userMatchStake[_matchId][_user];
    }
    
    /**
     * @dev Get total stake pool for a match
     */
    function getMatchStakePool(uint256 _matchId) external view returns (uint256) {
        return matchStakePool[_matchId];
    }
    
    // ==================== Reward Distribution ====================
    
    /**
     * @dev Distribute match rewards to winners - called by backend/deployer after match ends
     * Winners receive their share of the total stake pool
     */
    function distributeMatchRewards(
        uint256 _matchId,
        address[] calldata _winners
    ) external onlyBackend nonReentrant {
        require(!matchStakeDistributed[_matchId], "Rewards already distributed for this match");
        require(_winners.length > 0, "Must have at least one winner");
        require(matchStakePool[_matchId] > 0, "No stakes for this match");
        
        uint256 totalReward = matchStakePool[_matchId];
        uint256 rewardPerWinner = totalReward / _winners.length;
        
        // Distribute to winners
        for (uint256 i = 0; i < _winners.length; i++) {
            require(registeredUsers[_winners[i]], "Winner not registered");
            userTodoBalance[_winners[i]] += rewardPerWinner;
            totalVirtualBalance += rewardPerWinner;
        }
        
        // Mark as distributed and update tracking
        matchStakeDistributed[_matchId] = true;
        totalStakedAmount -= totalReward;
        
        emit MatchRewardsDistributed(_matchId, _winners, totalReward, rewardPerWinner, block.timestamp);
    }
    
    /**
     * @dev Refund stakes for a cancelled match
     */
    function refundMatchStakes(
        uint256 _matchId,
        address[] calldata _participants
    ) external onlyBackend nonReentrant {
        require(!matchStakeDistributed[_matchId], "Stakes already distributed");
        
        for (uint256 i = 0; i < _participants.length; i++) {
            uint256 stakeAmount = userMatchStake[_matchId][_participants[i]];
            if (stakeAmount > 0) {
                userTodoBalance[_participants[i]] += stakeAmount;
                totalVirtualBalance += stakeAmount;
                userMatchStake[_matchId][_participants[i]] = 0;
                
                emit StakeRefunded(_matchId, _participants[i], stakeAmount, block.timestamp);
            }
        }
        
        totalStakedAmount -= matchStakePool[_matchId];
        matchStakePool[_matchId] = 0;
        matchStakeDistributed[_matchId] = true;
    }
    
    /**
     * @dev Add reward to user (called by backend for bonus rewards, voting rewards, etc.)
     */
    function addReward(address _user, uint256 _amount) external onlyBackend {
        require(_amount > 0, "Reward amount must be positive");
        require(registeredUsers[_user], "User not registered");
        
        userTodoBalance[_user] += _amount;
        totalVirtualBalance += _amount;
        
        emit RewardSent(_user, _amount, block.timestamp);
    }
    
    // ==================== Action Tracking ====================
    
    function submitAction(
        ActionType _actionType,
        uint256 _matchId,
        bytes calldata _actionData
    ) external onlyRegistered returns (uint256) {
        actionCounter++;
        uint256 actionId = actionCounter;
        
        UserAction storage userAction = actions[actionId];
        userAction.actionId = actionId;
        userAction.user = msg.sender;
        userAction.actionType = _actionType;
        userAction.matchId = _matchId;
        userAction.actionData = _actionData;
        userAction.timestamp = block.timestamp;
        userAction.chainId = block.chainid;
        userAction.processed = false;
        
        userActions[msg.sender].push(actionId);
        
        emit ActionSubmitted(
            actionId,
            msg.sender,
            _actionType,
            _matchId,
            block.timestamp,
            block.chainid
        );
        
        return actionId;
    }
    
    function markActionProcessed(uint256 _actionId, bool _success) external onlyBackend {
        UserAction storage userAction = actions[_actionId];
        require(!userAction.processed, "Action already processed");
        
        userAction.processed = true;
        
        emit ActionProcessed(_actionId, userAction.user, _success);
    }
    
    // ==================== View Functions ====================
    
    function getUserActions(address _user) external view returns (uint256[] memory) {
        return userActions[_user];
    }
    
    function getAction(uint256 _actionId) external view returns (UserAction memory) {
        return actions[_actionId];
    }
    
    function getCurrentChainId() external view returns (uint256) {
        return block.chainid;
    }
    
    function isUserRegistered(address _user) external view returns (bool) {
        return registeredUsers[_user];
    }
    
    function getUserBalance(address _user) external view returns (uint256) {
        return userTodoBalance[_user];
    }
    
    function getPoolStats() external view returns (
        uint256 totalVirtual,
        uint256 totalStaked,
        uint256 totalUsers
    ) {
        return (
            totalVirtualBalance,
            totalStakedAmount,
            totalUsersRegistered
        );
    }
    
    // ==================== Admin Functions ====================
    
    function setBackend(address _newBackend) external onlyDeployer {
        require(_newBackend != address(0), "Invalid backend address");
        backend = _newBackend;
    }
    
    function setDeployer(address _newDeployer) external onlyDeployer {
        require(_newDeployer != address(0), "Invalid deployer address");
        deployer = _newDeployer;
    }
    
    /**
     * @dev Mint virtual tokens to a user (for airdrops, promotions, etc.)
     */
    function mintVirtualTokens(address _user, uint256 _amount) external onlyDeployer {
        require(_user != address(0), "Invalid user address");
        require(_amount > 0, "Amount must be positive");
        
        if (!registeredUsers[_user]) {
            registeredUsers[_user] = true;
            totalUsersRegistered++;
        }
        
        userTodoBalance[_user] += _amount;
        totalVirtualBalance += _amount;
        
        emit RewardSent(_user, _amount, block.timestamp);
    }
    
    receive() external payable {}
}
