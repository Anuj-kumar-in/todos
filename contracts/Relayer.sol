// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Relayer {
    
    address public deployer;
    address public backend;
    
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
    
    uint256 public actionCounter;
    
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
    
    modifier onlyDeployer() {
        require(msg.sender == deployer, "Only deployer can call this");
        _;
    }
    
    modifier onlyBackend() {
        require(msg.sender == backend, "Only backend can call this");
        _;
    }
    
    constructor(address _deployer, address _backend) {
        deployer = _deployer;
        backend = _backend;
    }
    
    /**
     * @dev User submits action - backend listens to event
     */
    function submitAction(
        ActionType _actionType,
        uint256 _matchId,
        bytes calldata _actionData
    ) external returns (uint256) {
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
    
    /**
     * @dev User sends stake to deployer for match entry
     * Deployer's account will bridge funds to TodosArena network
     */
    function sendStake(uint256 _matchId) external payable {
        require(msg.value > 0, "Stake amount must be positive");
        
        // Transfer to deployer
        (bool sent, ) = deployer.call{value: msg.value}("");
        require(sent, "Failed to send stake");
        
        emit StakeReceived(msg.sender, _matchId, msg.value, block.timestamp);
    }
    
    /**
     * @dev Backend marks action as processed after calling TodosArena
     */
    function markActionProcessed(uint256 _actionId, bool _success) external onlyBackend {
        UserAction storage userAction = actions[_actionId];
        require(!userAction.processed, "Action already processed");
        
        userAction.processed = true;
        
        emit ActionProcessed(_actionId, userAction.user, _success);
    }
    
    /**
     * @dev Deployer sends rewards to user (bridged from TodosArena network)
     */
    function sendReward(address _user, uint256 _amount) external onlyDeployer {
        require(_amount > 0, "Reward amount must be positive");
        
        (bool sent, ) = _user.call{value: _amount}("");
        require(sent, "Failed to send reward");
        
        emit RewardSent(_user, _amount, block.timestamp);
    }
    
    function getUserActions(address _user) external view returns (uint256[] memory) {
        return userActions[_user];
    }
    
    function getAction(uint256 _actionId) external view returns (UserAction memory) {
        return actions[_actionId];
    }
    
    function getCurrentChainId() external view returns (uint256) {
        return block.chainid;
    }
    
    // Admin management
    function setBackend(address _newBackend) external onlyDeployer {
        require(_newBackend != address(0), "Invalid backend address");
        backend = _newBackend;
    }
    
    function setDeployer(address _newDeployer) external onlyDeployer {
        require(_newDeployer != address(0), "Invalid deployer address");
        deployer = _newDeployer;
    }
    
    function withdrawBalance() external onlyDeployer {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool sent, ) = deployer.call{value: balance}("");
        require(sent, "Failed to withdraw");
    }
    
    receive() external payable {}
}
