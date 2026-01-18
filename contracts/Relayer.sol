// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Relayer
 * @dev Deployed on every network. Signs user messages and stores local transaction references.
 * Users interact with this contract on their preferred network.
 */
contract Relayer {
    
    address public admin;
    address public deployer; // Account that receives stakes
    
    // Enum for message types
    enum MessageType {
        CREATE_MATCH,
        JOIN_MATCH,
        START_VOTING,
        SUBMIT_VOTE,
        CLAIM_REWARDS
    }
    
    // User message struct
    struct UserMessage {
        uint256 messageId;
        address user;
        MessageType messageType;
        uint256 matchId;
        bytes messageData; // Encoded data for the action
        bytes signature; // User's signature
        uint256 timestamp;
        uint256 chainId; // Network where user initiated
        bool executed; // Whether admin has processed this on TodosArena
    }
    
    // Stake tracking for this network
    struct StakeRecord {
        address user;
        uint256 matchId;
        uint256 amount;
        uint256 timestamp;
        bool verified; // Verified that funds were received by deployer
    }
    
    mapping(uint256 => UserMessage) public messages;
    mapping(address => uint256[]) public userMessages;
    mapping(uint256 => StakeRecord) public stakes;
    
    uint256 public messageCounter;
    uint256 public stakeCounter;
    
    event MessageSigned(
        uint256 indexed messageId,
        address indexed user,
        MessageType messageType,
        uint256 indexed matchId,
        uint256 timestamp
    );
    
    event StakeRecorded(
        uint256 indexed stakeId,
        address indexed user,
        uint256 indexed matchId,
        uint256 amount,
        uint256 timestamp
    );
    
    event StakeVerified(
        uint256 indexed stakeId,
        address indexed user,
        uint256 indexed matchId,
        bool verified
    );
    
    event MessageExecuted(
        uint256 indexed messageId,
        address indexed user,
        bool success
    );
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
    
    modifier onlyDeployer() {
        require(msg.sender == deployer, "Only deployer can call this");
        _;
    }
    
    constructor(address _admin, address _deployer) {
        admin = _admin;
        deployer = _deployer;
    }
    
    /**
     * @dev User signs and creates a message on their network
     * User will sign this message using their wallet (MetaMask, etc.)
     */
    function signMessage(
        MessageType _messageType,
        uint256 _matchId,
        bytes calldata _messageData,
        bytes calldata _signature
    ) external returns (uint256) {
        require(_messageData.length > 0, "Message data required");
        
        messageCounter++;
        uint256 messageId = messageCounter;
        
        UserMessage storage userMessage = messages[messageId];
        userMessage.messageId = messageId;
        userMessage.user = msg.sender;
        userMessage.messageType = _messageType;
        userMessage.matchId = _matchId;
        userMessage.messageData = _messageData;
        userMessage.signature = _signature;
        userMessage.timestamp = block.timestamp;
        userMessage.chainId = block.chainid;
        userMessage.executed = false;
        
        userMessages[msg.sender].push(messageId);
        
        emit MessageSigned(
            messageId,
            msg.sender,
            _messageType,
            _matchId,
            block.timestamp
        );
        
        return messageId;
    }
    
    /**
     * @dev Record stake sent by user to deployer's account
     * User must have already sent funds directly to deployer before calling this
     * Admin will verify that funds were actually received
     */
    function recordStake(
        address _user,
        uint256 _matchId,
        uint256 _amount
    ) external onlyDeployer returns (uint256) {
        require(_amount > 0, "Stake amount must be positive");
        
        stakeCounter++;
        uint256 stakeId = stakeCounter;
        
        StakeRecord storage stake = stakes[stakeId];
        stake.user = _user;
        stake.matchId = _matchId;
        stake.amount = _amount;
        stake.timestamp = block.timestamp;
        stake.verified = false;
        
        emit StakeRecorded(stakeId, _user, _matchId, _amount, block.timestamp);
        
        return stakeId;
    }
    
    /**
     * @dev Admin verifies that stake was received on deployer's account
     * Admin calls this after confirming the blockchain transaction
     */
    function verifyStake(uint256 _stakeId) external onlyAdmin {
        StakeRecord storage stake = stakes[_stakeId];
        require(!stake.verified, "Stake already verified");
        
        stake.verified = true;
        
        emit StakeVerified(_stakeId, stake.user, stake.matchId, true);
    }
    
    /**
     * @dev Mark message as executed on TodosArena by admin
     */
    function markMessageExecuted(uint256 _messageId, bool _success) external onlyAdmin {
        UserMessage storage userMessage = messages[_messageId];
        require(!userMessage.executed, "Message already executed");

        userMessage.executed = true;

        emit MessageExecuted(_messageId, userMessage.user, _success);
    }
    
    // View functions
    function getUserMessages(address _user) external view returns (uint256[] memory) {
        return userMessages[_user];
    }
    
    function getMessage(uint256 _messageId) external view returns (UserMessage memory) {
        return messages[_messageId];
    }
    
    function getStake(uint256 _stakeId) external view returns (StakeRecord memory) {
        return stakes[_stakeId];
    }
    
    function getCurrentChainId() external view returns (uint256) {
        return block.chainid;
    }
    
    // Admin management
    function setAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        admin = _newAdmin;
    }
    
    function setDeployer(address _newDeployer) external onlyAdmin {
        require(_newDeployer != address(0), "Invalid deployer address");
        deployer = _newDeployer;
    }
}
