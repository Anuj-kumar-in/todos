// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Relayer is ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    address public deployer;
    address public backend;
    IERC20 public todoToken;
    
    uint256 public constant NEW_USER_BONUS = 100 * 10**18;
    
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
    mapping(address => uint256) public userTodoBalance;
    
    uint256 public actionCounter;
    uint256 public totalUsersRegistered;
    
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
    
    event TokensDeposited(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    
    event TokensWithdrawn(
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
    
    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }
    
    constructor(address _deployer, address _backend, address _todoToken) {
        deployer = _deployer;
        backend = _backend;
        todoToken = IERC20(_todoToken);
    }
    
    function registerUser() external nonReentrant returns (bool) {
        require(!registeredUsers[msg.sender], "User already registered");
        
        registeredUsers[msg.sender] = true;
        userTodoBalance[msg.sender] = NEW_USER_BONUS;
        totalUsersRegistered++;
        
        emit UserRegistered(msg.sender, NEW_USER_BONUS, block.timestamp, block.chainid);
        
        return true;
    }
    
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
    
    function stakeForMatch(uint256 _matchId, uint256 _amount) external onlyRegistered nonReentrant {
        require(_amount > 0, "Stake amount must be positive");
        require(userTodoBalance[msg.sender] >= _amount, "Insufficient TODO balance");
        
        userTodoBalance[msg.sender] -= _amount;
        
        emit StakeReceived(msg.sender, _matchId, _amount, block.timestamp);
    }
    
    function depositTokens(uint256 _amount) external onlyRegistered nonReentrant {
        require(_amount > 0, "Amount must be positive");
        
        todoToken.safeTransferFrom(msg.sender, address(this), _amount);
        userTodoBalance[msg.sender] += _amount;
        
        emit TokensDeposited(msg.sender, _amount, block.timestamp);
    }
    
    function withdrawTokens(uint256 _amount) external onlyRegistered nonReentrant {
        require(_amount > 0, "Amount must be positive");
        require(userTodoBalance[msg.sender] >= _amount, "Insufficient balance");
        
        userTodoBalance[msg.sender] -= _amount;
        todoToken.safeTransfer(msg.sender, _amount);
        
        emit TokensWithdrawn(msg.sender, _amount, block.timestamp);
    }
    
    function markActionProcessed(uint256 _actionId, bool _success) external onlyBackend {
        UserAction storage userAction = actions[_actionId];
        require(!userAction.processed, "Action already processed");
        
        userAction.processed = true;
        
        emit ActionProcessed(_actionId, userAction.user, _success);
    }
    
    function addReward(address _user, uint256 _amount) external onlyBackend {
        require(_amount > 0, "Reward amount must be positive");
        require(registeredUsers[_user], "User not registered");
        
        userTodoBalance[_user] += _amount;
        
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
    
    function isUserRegistered(address _user) external view returns (bool) {
        return registeredUsers[_user];
    }
    
    function getUserBalance(address _user) external view returns (uint256) {
        return userTodoBalance[_user];
    }
    
    function setBackend(address _newBackend) external onlyDeployer {
        require(_newBackend != address(0), "Invalid backend address");
        backend = _newBackend;
    }
    
    function setDeployer(address _newDeployer) external onlyDeployer {
        require(_newDeployer != address(0), "Invalid deployer address");
        deployer = _newDeployer;
    }
    
    function setTodoToken(address _newToken) external onlyDeployer {
        require(_newToken != address(0), "Invalid token address");
        todoToken = IERC20(_newToken);
    }
    
    function withdrawContractTokens(uint256 _amount) external onlyDeployer {
        require(_amount > 0, "Amount must be positive");
        todoToken.safeTransfer(deployer, _amount);
    }
    
    receive() external payable {}
}
