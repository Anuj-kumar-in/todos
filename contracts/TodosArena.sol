// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title TodosArena
 * @dev Single network deployment - stores ALL user data, matches, and rewards
 * Only the deployer (owner) can call write functions
 */
contract TodosArena is Ownable, ReentrancyGuard, ERC20, ERC20Burnable {
    
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 Billion TODO

    // Enum for game and match types
    enum GameType {
        INDOOR,
        OUTDOOR,
        ONLINE,
        OFFLINE,
        HYBRID
    }

    enum MatchStatus {
        CREATED,
        ACTIVE,
        VOTING,
        COMPLETED,
        CANCELLED
    }

    // Participant info
    struct Participant {
        address addr;
        string networkName;
        uint256 joinedAt;
    }

    // Match struct
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

    // Voting structs
    struct Vote {
        address voter;
        address[] votedWinners;
        uint256 timestamp;
        bool verified;
    }

    struct VotingSession {
        uint256 matchId;
        address[] participants;
        uint256 votesReceived;
        uint256 votingEndTime;
        bool finalized;
        address[] finalWinners;
    }

    // Reward struct
    struct RewardPool {
        uint256 matchId;
        uint256 totalAmount;
        address[] winners;
        bool distributed;
        uint256 distributedAt;
    }

    // State variables
    uint256 public matchCounter;
    mapping(uint256 => Match) public matches;
    mapping(address => uint256[]) public userMatches;
    
    // Participant info per match
    mapping(uint256 => Participant[]) public matchParticipants;

    // Voting state
    mapping(uint256 => VotingSession) public votingSessions;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(uint256 => mapping(address => uint256)) public winnerVoteCounts;

    // Rewards state
    mapping(uint256 => RewardPool) public rewardPools;
    mapping(address => uint256) public userRewardBalance;
    mapping(address => uint256) public totalEarned;
    uint256 public totalRewardsDistributed;

    // Configuration
    address public platformFeeRecipient;
    uint256 public platformFeePercentage = 5;
    uint256 public constant CONSENSUS_THRESHOLD = 50;
    uint256 public constant VOTING_REWARD = 5 * 10**18;

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
        string networkName,
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

    event VotingSessionCreated(
        uint256 indexed matchId,
        address[] participants,
        uint256 votingEndTime
    );

    event VoteCasted(
        uint256 indexed matchId,
        address indexed voter,
        address[] votedWinners,
        uint256 timestamp
    );

    event VotingFinalized(
        uint256 indexed matchId,
        address[] winners,
        uint256 totalVotes,
        bool consensusReached
    );

    event RewardsMinted(
        uint256 indexed matchId,
        address[] winners,
        uint256 totalAmount,
        uint256 amountPerWinner
    );

    event RewardsClaimed(
        address indexed user,
        uint256 matchId,
        uint256 amount,
        uint256 timestamp
    );

    event RewardPoolCreated(
        uint256 indexed matchId,
        uint256 totalAmount,
        uint256 winnerCount
    );

    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount);

    // Modifiers
    modifier matchExists(uint256 _matchId) {
        require(_matchId <= matchCounter && _matchId > 0, "Invalid match ID");
        _;
    }

    modifier matchInStatus(uint256 _matchId, MatchStatus _status) {
        require(
            matches[_matchId].status == _status,
            "Invalid match status for this operation"
        );
        _;
    }

    modifier votingEnded(uint256 _matchId) {
        require(
            block.timestamp >= votingSessions[_matchId].votingEndTime,
            "Voting period is still active"
        );
        _;
    }

    constructor() ERC20("TODO Arena Token", "TODO") Ownable(msg.sender) {
        platformFeeRecipient = msg.sender;
    }

    // ==================== MATCH FUNCTIONS ====================

    /**
     * @dev Create match - only owner
     */
    function createMatch(
        address _creator,
        string memory _title,
        string memory _description,
        GameType _gameType,
        uint256 _entryStake,
        uint256 _maxParticipants,
        uint256 _votingDuration
    ) external onlyOwner returns (uint256) {
        require(bytes(_title).length > 0, "Title required");
        require(_entryStake > 0, "Entry stake must be greater than 0");
        require(_maxParticipants >= 2, "Need at least 2 participants");
        require(_votingDuration > 0, "Voting duration must be greater than 0");

        matchCounter++;
        uint256 matchId = matchCounter;

        Match storage newMatch = matches[matchId];
        newMatch.id = matchId;
        newMatch.creator = _creator;
        newMatch.title = _title;
        newMatch.description = _description;
        newMatch.gameType = _gameType;
        newMatch.status = MatchStatus.CREATED;
        newMatch.entryStake = _entryStake;
        newMatch.maxParticipants = _maxParticipants;
        newMatch.createdAt = block.timestamp;
        newMatch.votingDuration = _votingDuration;

        userMatches[_creator].push(matchId);

        emit MatchCreated(
            matchId,
            _creator,
            _title,
            _gameType,
            _entryStake,
            _maxParticipants
        );

        return matchId;
    }

    /**
     * @dev Join match - only owner
     */
    function joinMatch(uint256 _matchId, address _participant, string memory _networkName)
        external
        onlyOwner
        matchExists(_matchId)
        matchInStatus(_matchId, MatchStatus.CREATED)
    {
        Match storage _match = matches[_matchId];
        require(_match.participants.length < _match.maxParticipants, "Match is full");

        // Check if user already joined
        for (uint256 i = 0; i < _match.participants.length; i++) {
            require(_match.participants[i] != _participant, "Already joined");
        }

        _match.participants.push(_participant);
        _match.totalPrizePool += _match.entryStake;
        userMatches[_participant].push(_matchId);
        
        // Store participant info with network
        matchParticipants[_matchId].push(Participant({
            addr: _participant,
            networkName: _networkName,
            joinedAt: block.timestamp
        }));

        emit ParticipantJoined(_matchId, _participant, _networkName, _match.entryStake);

        // Auto-start if full
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

    function startMatch(uint256 _matchId)
        external
        onlyOwner
        matchExists(_matchId)
        matchInStatus(_matchId, MatchStatus.CREATED)
    {
        require(matches[_matchId].participants.length >= 2, "Need at least 2 participants");
        _startMatch(_matchId);
    }

    function submitAIReport(uint256 _matchId, bytes32 _reportHash)
        external
        onlyOwner
        matchExists(_matchId)
        matchInStatus(_matchId, MatchStatus.ACTIVE)
    {
        Match storage _match = matches[_matchId];
        _match.aiReportHash = _reportHash;
        _match.aiReportSubmitted = true;

        emit AIReportSubmitted(_matchId, _reportHash, block.timestamp);
    }

    function startVotingPhase(uint256 _matchId)
        external
        onlyOwner
        matchExists(_matchId)
        matchInStatus(_matchId, MatchStatus.ACTIVE)
    {
        Match storage _match = matches[_matchId];
        _match.status = MatchStatus.VOTING;
        _match.votingStartTime = block.timestamp;

        VotingSession storage session = votingSessions[_matchId];
        session.matchId = _matchId;
        session.participants = _match.participants;
        session.votingEndTime = block.timestamp + _match.votingDuration;

        emit MatchStatusChanged(_matchId, MatchStatus.VOTING, block.timestamp);
        emit VotingSessionCreated(_matchId, _match.participants, session.votingEndTime);
    }

    function completeMatch(uint256 _matchId)
        external
        onlyOwner
        matchExists(_matchId)
        matchInStatus(_matchId, MatchStatus.VOTING)
    {
        Match storage _match = matches[_matchId];
        _match.status = MatchStatus.COMPLETED;

        emit MatchStatusChanged(_matchId, MatchStatus.COMPLETED, block.timestamp);
    }

    function cancelMatch(uint256 _matchId, string memory _reason)
        external
        onlyOwner
        matchExists(_matchId)
        nonReentrant
    {
        Match storage _match = matches[_matchId];
        require(_match.status != MatchStatus.COMPLETED, "Cannot cancel completed match");

        _match.status = MatchStatus.CANCELLED;

        emit MatchCancelled(_matchId, _reason);
    }

    // ==================== VIEW FUNCTIONS ====================

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

    function getMatchParticipantsWithNetwork(uint256 _matchId) external view matchExists(_matchId) returns (Participant[] memory) {
        return matchParticipants[_matchId];
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

    // ==================== VOTING FUNCTIONS ====================

    function submitVote(uint256 _matchId, address _voter, address[] calldata _winnerAddresses)
        external
        onlyOwner
        nonReentrant
    {
        VotingSession storage session = votingSessions[_matchId];
        require(block.timestamp < session.votingEndTime, "Voting period has ended");

        bool isParticipant = false;
        for (uint256 i = 0; i < session.participants.length; i++) {
            if (session.participants[i] == _voter) {
                isParticipant = true;
                break;
            }
        }
        require(isParticipant, "Voter is not a participant");
        require(votes[_matchId][_voter].voter == address(0), "Already voted");
        require(_winnerAddresses.length > 0, "Must vote for at least 1 winner");

        for (uint256 i = 0; i < _winnerAddresses.length; i++) {
            bool validWinner = false;
            for (uint256 j = 0; j < session.participants.length; j++) {
                if (session.participants[j] == _winnerAddresses[i]) {
                    validWinner = true;
                    break;
                }
            }
            require(validWinner, "Invalid winner address");
        }

        votes[_matchId][_voter] = Vote({
            voter: _voter,
            votedWinners: _winnerAddresses,
            timestamp: block.timestamp,
            verified: true
        });

        for (uint256 i = 0; i < _winnerAddresses.length; i++) {
            winnerVoteCounts[_matchId][_winnerAddresses[i]]++;
        }

        session.votesReceived++;

        emit VoteCasted(_matchId, _voter, _winnerAddresses, block.timestamp);
    }

    function finalizeVoting(uint256 _matchId)
        external
        onlyOwner
        votingEnded(_matchId)
        nonReentrant
    {
        VotingSession storage session = votingSessions[_matchId];
        require(!session.finalized, "Voting already finalized");

        session.finalized = true;

        address[] memory potentialWinners = session.participants;
        address[] memory consensusWinners = new address[](potentialWinners.length);
        uint256 winnerCount = 0;

        uint256 requiredVotes = (session.participants.length / 2) + 1;

        for (uint256 i = 0; i < potentialWinners.length; i++) {
            if (winnerVoteCounts[_matchId][potentialWinners[i]] >= requiredVotes) {
                consensusWinners[winnerCount] = potentialWinners[i];
                winnerCount++;
            }
        }

        address[] memory finalWinners = new address[](winnerCount);
        for (uint256 i = 0; i < winnerCount; i++) {
            finalWinners[i] = consensusWinners[i];
        }

        session.finalWinners = finalWinners;

        emit VotingFinalized(_matchId, finalWinners, session.votesReceived, winnerCount > 0);
    }

    function getVotingSession(uint256 _matchId)
        external
        view
        returns (
            uint256 matchId,
            uint256 totalVoters,
            uint256 votesReceived,
            uint256 votingEndTime,
            bool finalized
        )
    {
        VotingSession storage session = votingSessions[_matchId];
        return (
            session.matchId,
            session.participants.length,
            session.votesReceived,
            session.votingEndTime,
            session.finalized
        );
    }

    function hasVoted(uint256 _matchId, address _voter) external view returns (bool) {
        return votes[_matchId][_voter].voter != address(0);
    }

    function getWinnerVoteCount(uint256 _matchId, address _winner) external view returns (uint256) {
        return winnerVoteCounts[_matchId][_winner];
    }

    function getFinalWinners(uint256 _matchId) external view returns (address[] memory) {
        return votingSessions[_matchId].finalWinners;
    }

    // ==================== REWARD FUNCTIONS ====================

    function distributeRewards(
        uint256 _matchId,
        address[] calldata _winners,
        uint256 _totalPrizePool
    ) external onlyOwner nonReentrant {
        require(_winners.length > 0, "No winners provided");
        require(_totalPrizePool > 0, "Prize pool must be positive");

        RewardPool storage pool = rewardPools[_matchId];
        require(!pool.distributed, "Rewards already distributed");

        uint256 rewardPerWinner = _totalPrizePool / _winners.length;
        uint256 totalReward = rewardPerWinner * _winners.length;
        uint256 tokenAmount = totalReward / 10**15;

        _mint(address(this), tokenAmount);

        uint256 tokensPerWinner = tokenAmount / _winners.length;

        for (uint256 i = 0; i < _winners.length; i++) {
            userRewardBalance[_winners[i]] += tokensPerWinner;
            totalEarned[_winners[i]] += tokensPerWinner;
        }

        pool.matchId = _matchId;
        pool.totalAmount = tokenAmount;
        pool.winners = _winners;
        pool.distributed = true;
        pool.distributedAt = block.timestamp;

        totalRewardsDistributed += tokenAmount;

        emit RewardsMinted(_matchId, _winners, tokenAmount, tokensPerWinner);
        emit RewardPoolCreated(_matchId, tokenAmount, _winners.length);
    }

    function claimRewards(uint256 _matchId) external nonReentrant {
        RewardPool storage pool = rewardPools[_matchId];
        require(pool.distributed, "Rewards not yet distributed");

        bool isWinner = false;
        for (uint256 i = 0; i < pool.winners.length; i++) {
            if (pool.winners[i] == msg.sender) {
                isWinner = true;
                break;
            }
        }
        require(isWinner, "Not a winner of this match");

        uint256 reward = pool.totalAmount / pool.winners.length;
        require(userRewardBalance[msg.sender] >= reward, "Insufficient balance");

        userRewardBalance[msg.sender] -= reward;

        _transfer(address(this), msg.sender, reward);

        emit RewardsClaimed(msg.sender, _matchId, reward, block.timestamp);
    }

    function claimAllRewards() external nonReentrant {
        uint256 balance = userRewardBalance[msg.sender];
        require(balance > 0, "No rewards to claim");

        userRewardBalance[msg.sender] = 0;

        _transfer(address(this), msg.sender, balance);

        emit RewardsClaimed(msg.sender, 0, balance, block.timestamp);
    }

    function getRewardBalance(address _user) external view returns (uint256) {
        return userRewardBalance[_user];
    }

    function getTotalEarned(address _user) external view returns (uint256) {
        return totalEarned[_user];
    }

    function getRewardPool(uint256 _matchId) external view returns (
        uint256 matchId,
        uint256 totalAmount,
        bool distributed,
        uint256 distributedAt,
        uint256 winnerCount
    ) {
        RewardPool storage pool = rewardPools[_matchId];
        return (
            pool.matchId,
            pool.totalAmount,
            pool.distributed,
            pool.distributedAt,
            pool.winners.length
        );
    }

    function getTotalRewardsDistributed() external view returns (uint256) {
        return totalRewardsDistributed;
    }

    // ==================== TOKEN FUNCTIONS ====================

    function mint(address to, uint256 amount, string memory reason) public onlyOwner {
        require(
            totalSupply() + amount <= TOTAL_SUPPLY,
            "TodoToken: exceeds max supply"
        );
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    function burnTokens(uint256 amount) public onlyOwner {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    // ==================== ADMIN FUNCTIONS ====================

    function setPlatformFeeRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid recipient");
        platformFeeRecipient = _newRecipient;
    }

    function setPlatformFeePercentage(uint256 _newPercentage) external onlyOwner {
        require(_newPercentage <= 100, "Invalid percentage");
        platformFeePercentage = _newPercentage;
    }
}
