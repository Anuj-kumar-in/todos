// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IVotingContract {
    function createVotingSession(uint256 _matchId, address[] calldata _participants, uint256 _votingDuration) external;
}

/**
 * @title MatchContract
 * @dev Manages match creation, joining, and lifecycle
 */
contract MatchContract is Ownable, ReentrancyGuard, AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    enum GameType {
        INDOOR,      // Basketball, Cricket, Table Tennis, etc.
        OUTDOOR,     // Athletics, Running, Jumping
        ONLINE,      // Video games, esports
        OFFLINE,     // No camera required
        HYBRID       // Combination
    }
    
    enum MatchStatus {
        CREATED,     // Match created, waiting for players
        ACTIVE,      // Match is ongoing
        VOTING,      // Waiting for voting results
        COMPLETED,   // Match completed, rewards distributed
        CANCELLED    // Match cancelled
    }
    
    struct Match {
        uint256 id;
        address creator;
        string title;
        string description;
        GameType gameType;
        MatchStatus status;
        uint256 entryStake;
        uint256 totalPrizePool;
        address[] participants;
        uint256 maxParticipants;
        uint256 createdAt;
        uint256 startedAt;
        uint256 votingStartTime;
        uint256 votingDuration;
        bytes32 aiReportHash;
        bool aiReportSubmitted;
    }
    
    struct MatchView {
        uint256 id;
        address creator;
        string title;
        string description;
        GameType gameType;
        MatchStatus status;
        uint256 entryStake;
        uint256 totalPrizePool;
        uint256 participantCount;
        uint256 maxParticipants;
        uint256 createdAt;
        uint256 startedAt;
        uint256 votingStartTime;
        uint256 votingDuration;
    }
    
    // State variables
    uint256 public matchCounter;
    mapping(uint256 => Match) public matches;
    mapping(address => uint256[]) public userMatches;

    address public escrowAddress;
    address public votingContract;
    uint256 public platformFeePercentage = 5;
    
    // Events
    event MatchCreated(
        uint256 indexed matchId,
        address indexed creator,
        string title,
        GameType gameType,
        uint256 entryStake,
        uint256 maxParticipants
    );
    
    event ParticipantJoined(
        uint256 indexed matchId,
        address indexed participant,
        uint256 entryStakePaid
    );
    
    event MatchStarted(
        uint256 indexed matchId,
        uint256 participantCount,
        uint256 totalPrizePool
    );
    
    event AIReportSubmitted(
        uint256 indexed matchId,
        bytes32 reportHash,
        uint256 timestamp
    );
    
    event MatchStatusChanged(
        uint256 indexed matchId,
        MatchStatus newStatus,
        uint256 timestamp
    );
    
    event MatchCancelled(
        uint256 indexed matchId,
        string reason
    );
    
    // Modifiers
    modifier matchExists(uint256 _matchId) {
        require(_matchId <= matchCounter && _matchId > 0, "Invalid match ID");
        _;
    }
    
    modifier onlyCreator(uint256 _matchId) {
        require(
            msg.sender == matches[_matchId].creator,
            "Only match creator can call this"
        );
        _;
    }
    
    modifier matchInStatus(uint256 _matchId, MatchStatus _status) {
        require(
            matches[_matchId].status == _status,
            "Invalid match status for this operation"
        );
        _;
    }
    
    constructor(address _escrow, address _votingContract) Ownable(msg.sender) {
        escrowAddress = _escrow;
        votingContract = _votingContract;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Create a new match
     */
    function createMatch(
        string memory _title,
        string memory _description,
        GameType _gameType,
        uint256 _entryStake,
        uint256 _maxParticipants,
        uint256 _votingDuration
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title required");
        require(_entryStake > 0, "Entry stake must be greater than 0");
        require(_maxParticipants >= 2, "Need at least 2 participants");
        require(_votingDuration > 0, "Voting duration must be greater than 0");
        
        matchCounter++;
        uint256 matchId = matchCounter;
        
        Match storage newMatch = matches[matchId];
        newMatch.id = matchId;
        newMatch.creator = msg.sender;
        newMatch.title = _title;
        newMatch.description = _description;
        newMatch.gameType = _gameType;
        newMatch.status = MatchStatus.CREATED;
        newMatch.entryStake = _entryStake;
        newMatch.maxParticipants = _maxParticipants;
        newMatch.createdAt = block.timestamp;
        newMatch.votingDuration = _votingDuration;
        
        userMatches[msg.sender].push(matchId);
        
        emit MatchCreated(
            matchId,
            msg.sender,
            _title,
            _gameType,
            _entryStake,
            _maxParticipants
        );
        
        return matchId;
    }
    
    /**
     * @dev Join an existing match
     */
    function joinMatch(uint256 _matchId)
        external
        payable
        nonReentrant
        matchExists(_matchId)
        matchInStatus(_matchId, MatchStatus.CREATED)
    {
        Match storage _match = matches[_matchId];
        
        require(msg.value == _match.entryStake, "Entry fee mismatch");
        require(_match.participants.length < _match.maxParticipants, "Match is full");
        
        for (uint256 i = 0; i < _match.participants.length; i++) {
            require(_match.participants[i] != msg.sender, "Already joined");
        }
        
        _match.participants.push(msg.sender);
        userMatches[msg.sender].push(_matchId);
        _match.totalPrizePool += msg.value;
        
        emit ParticipantJoined(_matchId, msg.sender, msg.value);
        
        if (_match.participants.length == _match.maxParticipants) {
            _startMatch(_matchId);
        }
    }
    
    function _startMatch(uint256 _matchId) internal {
        Match storage _match = matches[_matchId];
        _match.status = MatchStatus.ACTIVE;
        _match.startedAt = block.timestamp;
        
        emit MatchStarted(_matchId, _match.participants.length, _match.totalPrizePool);
        emit MatchStatusChanged(_matchId, MatchStatus.ACTIVE, block.timestamp);
    }
    
    /**
     * @dev Manually start the match
     */
    function startMatch(uint256 _matchId)
        external
        matchExists(_matchId)
        onlyCreator(_matchId)
        matchInStatus(_matchId, MatchStatus.CREATED)
    {
        require(matches[_matchId].participants.length >= 2, "Need at least 2 participants");
        _startMatch(_matchId);
    }
    
    /**
     * @dev Submit AI detection report
     */
    function submitAIReport(uint256 _matchId, bytes32 _reportHash)
        external
        onlyRole(ORACLE_ROLE)
        matchExists(_matchId)
        matchInStatus(_matchId, MatchStatus.ACTIVE)
    {
        Match storage _match = matches[_matchId];
        _match.aiReportHash = _reportHash;
        _match.aiReportSubmitted = true;
        
        emit AIReportSubmitted(_matchId, _reportHash, block.timestamp);
    }
    
    /**
     * @dev Transition match to voting phase
     */
    function startVotingPhase(uint256 _matchId)
        external
        onlyCreator(_matchId)
        matchExists(_matchId)
        matchInStatus(_matchId, MatchStatus.ACTIVE)
    {
        Match storage _match = matches[_matchId];
        _match.status = MatchStatus.VOTING;
        _match.votingStartTime = block.timestamp;

        // Create voting session in VotingContract
        IVotingContract(votingContract).createVotingSession(
            _matchId,
            _match.participants,
            _match.votingDuration
        );

        emit MatchStatusChanged(_matchId, MatchStatus.VOTING, block.timestamp);
    }
    
    /**
     * @dev Complete the match
     */
    function completeMatch(uint256 _matchId)
        external
        onlyRole(ORACLE_ROLE)
        matchExists(_matchId)
        matchInStatus(_matchId, MatchStatus.VOTING)
    {
        Match storage _match = matches[_matchId];
        _match.status = MatchStatus.COMPLETED;
        
        emit MatchStatusChanged(_matchId, MatchStatus.COMPLETED, block.timestamp);
    }
    
    /**
     * @dev Cancel the match and refund
     */
    function cancelMatch(uint256 _matchId, string memory _reason)
        external
        onlyCreator(_matchId)
        matchExists(_matchId)
        nonReentrant
    {
        Match storage _match = matches[_matchId];
        require(_match.status != MatchStatus.COMPLETED, "Cannot cancel completed match");
        
        _match.status = MatchStatus.CANCELLED;
        
        for (uint256 i = 0; i < _match.participants.length; i++) {
            (bool success, ) = payable(_match.participants[i]).call{
                value: _match.entryStake
            }("");
            require(success, "Refund failed");
        }
        
        emit MatchCancelled(_matchId, _reason);
    }
    
    // View functions
    function getMatch(uint256 _matchId) external view matchExists(_matchId) returns (MatchView memory) {
        Match storage _match = matches[_matchId];
        return MatchView({
            id: _match.id,
            creator: _match.creator,
            title: _match.title,
            description: _match.description,
            gameType: _match.gameType,
            status: _match.status,
            entryStake: _match.entryStake,
            totalPrizePool: _match.totalPrizePool,
            participantCount: _match.participants.length,
            maxParticipants: _match.maxParticipants,
            createdAt: _match.createdAt,
            startedAt: _match.startedAt,
            votingStartTime: _match.votingStartTime,
            votingDuration: _match.votingDuration
        });
    }
    
    function getMatchParticipants(uint256 _matchId) external view matchExists(_matchId) returns (address[] memory) {
        return matches[_matchId].participants;
    }
    
    function getUserMatches(address _user) external view returns (uint256[] memory) {
        return userMatches[_user];
    }
    
    function getMatchStatus(uint256 _matchId) external view matchExists(_matchId) returns (MatchStatus) {
        return matches[_matchId].status;
    }
    
    function getAllMatches() external view returns (MatchView[] memory) {
        MatchView[] memory allMatches = new MatchView[](matchCounter);
        for (uint256 i = 1; i <= matchCounter; i++) {
            Match storage _match = matches[i];
            allMatches[i - 1] = MatchView({
                id: _match.id,
                creator: _match.creator,
                title: _match.title,
                description: _match.description,
                gameType: _match.gameType,
                status: _match.status,
                entryStake: _match.entryStake,
                totalPrizePool: _match.totalPrizePool,
                participantCount: _match.participants.length,
                maxParticipants: _match.maxParticipants,
                createdAt: _match.createdAt,
                startedAt: _match.startedAt,
                votingStartTime: _match.votingStartTime,
                votingDuration: _match.votingDuration
            });
        }
        return allMatches;
    }
}
