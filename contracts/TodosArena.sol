// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title TodosArena
 * @dev Single contract deployed on primary network (e.g., Ethereum Mainnet)
 * Stores ALL match data, voting sessions, and rewards
 * Receives cross-chain actions from Relayer contracts via admin
 */
contract TodosArena is Ownable, ReentrancyGuard, AccessControl, ERC20, ERC20Burnable {
    
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant VOTING_MANAGER_ROLE = keccak256("VOTING_MANAGER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE"); // Admin account that bridges from Relayers

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

    // Match struct with cross-chain references
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
        // Cross-chain tracking
        uint256 creatorNetworkChainId;
        mapping(address => uint256) participantChainId; // Track which network each participant is from
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
        uint256 creatorNetworkChainId;
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

    // Stake verification struct for cross-chain stakes
    struct StakeVerification {
        address user;
        uint256 matchId;
        uint256 amount;
        uint256 chainId;
        uint256 relayerStakeId;
        bool verified;
    }

    // State variables
    uint256 public matchCounter;
    mapping(uint256 => Match) public matches;
    mapping(address => uint256[]) public userMatches;

    // Voting state
    mapping(uint256 => VotingSession) public votingSessions;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(uint256 => mapping(address => uint256)) public winnerVoteCounts;

    // Rewards state
    mapping(uint256 => RewardPool) public rewardPools;
    mapping(address => uint256) public userRewardBalance;
    mapping(address => uint256) public totalEarned;
    uint256 public totalRewardsDistributed;

    // Cross-chain stake tracking
    mapping(uint256 => StakeVerification) public stakeVerifications;
    uint256 public stakeVerificationCounter;

    // Configuration
    address public platformFeeRecipient;
    uint256 public platformFeePercentage = 5;
    uint256 public constant CONSENSUS_THRESHOLD = 50;
    uint256 public constant VOTING_REWARD = 5 * 10**18;

    // Events for matches
    event MatchCreated(
        uint256 indexed matchId,
        address indexed creator,
        string title,
        GameType gameType,
        uint256 entryStake,
        uint256 maxParticipants,
        uint256 creatorChainId
    );

    event ParticipantJoined(
        uint256 indexed matchId,
        address indexed participant,
        uint256 entryStakePaid,
        uint256 participantChainId
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

    // Events for voting
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

    // Events for rewards
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

    // Cross-chain events
    event StakeVerificationCreated(
        uint256 indexed verificationId,
        address indexed user,
        uint256 indexed matchId,
        uint256 amount,
        uint256 chainId,
        uint256 relayerStakeId
    );

    event StakeVerificationConfirmed(
        uint256 indexed verificationId,
        address indexed user,
        uint256 indexed matchId
    );

    // Token events
    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount);

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

    modifier votingActive(uint256 _matchId) {
        require(
            block.timestamp < votingSessions[_matchId].votingEndTime,
            "Voting period has ended"
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
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);
        _grantRole(VOTING_MANAGER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(BRIDGE_ROLE, msg.sender); // Admin that bridges from Relayers
        platformFeeRecipient = msg.sender;
    }

    // ==================== MATCH FUNCTIONS ====================

    /**
     * @dev Create a new match
     * Can be called directly by user or by admin from Relayer bridge
     */
    function createMatch(
        string memory _title,
        string memory _description,
        GameType _gameType,
        uint256 _entryStake,
        uint256 _maxParticipants,
        uint256 _votingDuration
    ) external returns (uint256) {
        return _createMatchInternal(
            msg.sender,
            _title,
            _description,
            _gameType,
            _entryStake,
            _maxParticipants,
            _votingDuration,
            block.chainid
        );
    }

    /**
     * @dev Create match from cross-chain Relayer
     * Only admin can bridge matches from other networks
     */
    function createMatchFromRelay(
        address _creator,
        string memory _title,
        string memory _description,
        GameType _gameType,
        uint256 _entryStake,
        uint256 _maxParticipants,
        uint256 _votingDuration,
        uint256 _creatorChainId
    ) external onlyRole(BRIDGE_ROLE) returns (uint256) {
        return _createMatchInternal(
            _creator,
            _title,
            _description,
            _gameType,
            _entryStake,
            _maxParticipants,
            _votingDuration,
            _creatorChainId
        );
    }

    function _createMatchInternal(
        address _creator,
        string memory _title,
        string memory _description,
        GameType _gameType,
        uint256 _entryStake,
        uint256 _maxParticipants,
        uint256 _votingDuration,
        uint256 _chainId
    ) internal returns (uint256) {
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
        newMatch.creatorNetworkChainId = _chainId;

        userMatches[_creator].push(matchId);

        emit MatchCreated(
            matchId,
            _creator,
            _title,
            _gameType,
            _entryStake,
            _maxParticipants,
            _chainId
        );

        return matchId;
    }

    /**
     * @dev Register stake verification
     * User calls recordStake on Relayer, admin then calls this to register verification
     */
    function registerStakeVerification(
        address _user,
        uint256 _matchId,
        uint256 _amount,
        uint256 _chainId,
        uint256 _relayerStakeId
    ) external onlyRole(BRIDGE_ROLE) returns (uint256) {
        require(_amount > 0, "Amount must be positive");
        
        stakeVerificationCounter++;
        uint256 verificationId = stakeVerificationCounter;
        
        StakeVerification storage verification = stakeVerifications[verificationId];
        verification.user = _user;
        verification.matchId = _matchId;
        verification.amount = _amount;
        verification.chainId = _chainId;
        verification.relayerStakeId = _relayerStakeId;
        verification.verified = false;
        
        emit StakeVerificationCreated(
            verificationId,
            _user,
            _matchId,
            _amount,
            _chainId,
            _relayerStakeId
        );
        
        return verificationId;
    }

    /**
     * @dev Confirm stake was received and add participant to match
     */
    function confirmStakeAndJoinMatch(uint256 _verificationId)
        external
        onlyRole(BRIDGE_ROLE)
        matchExists(stakeVerifications[_verificationId].matchId)
    {
        StakeVerification storage verification = stakeVerifications[_verificationId];
        require(!verification.verified, "Stake already verified");

        Match storage _match = matches[verification.matchId];
        require(_match.status == MatchStatus.CREATED, "Match not in created status");
        require(_match.participants.length < _match.maxParticipants, "Match is full");

        // Check if user already joined
        for (uint256 i = 0; i < _match.participants.length; i++) {
            require(_match.participants[i] != verification.user, "Already joined");
        }

        // Verify amount matches
        require(verification.amount == _match.entryStake, "Entry stake mismatch");

        // Add participant
        _match.participants.push(verification.user);
        _match.participantChainId[verification.user] = verification.chainId;
        _match.totalPrizePool += verification.amount;
        userMatches[verification.user].push(verification.matchId);

        verification.verified = true;

        emit StakeVerificationConfirmed(
            _verificationId,
            verification.user,
            verification.matchId
        );

        emit ParticipantJoined(
            verification.matchId,
            verification.user,
            verification.amount,
            verification.chainId
        );

        // Auto-start if full
        if (_match.participants.length == _match.maxParticipants) {
            _startMatch(verification.matchId);
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
        matchExists(_matchId)
        onlyCreator(_matchId)
        matchInStatus(_matchId, MatchStatus.CREATED)
    {
        require(matches[_matchId].participants.length >= 2, "Need at least 2 participants");
        _startMatch(_matchId);
    }

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

    function startVotingPhase(uint256 _matchId)
        external
        onlyCreator(_matchId)
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
        onlyRole(ORACLE_ROLE)
        matchExists(_matchId)
        matchInStatus(_matchId, MatchStatus.VOTING)
    {
        Match storage _match = matches[_matchId];
        _match.status = MatchStatus.COMPLETED;

        emit MatchStatusChanged(_matchId, MatchStatus.COMPLETED, block.timestamp);
    }

    function cancelMatch(uint256 _matchId, string memory _reason)
        external
        onlyCreator(_matchId)
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
            votingDuration: _match.votingDuration,
            creatorNetworkChainId: _match.creatorNetworkChainId
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
                votingDuration: _match.votingDuration,
                creatorNetworkChainId: _match.creatorNetworkChainId
            });
        }
        return allMatches;
    }

    // ==================== VOTING FUNCTIONS ====================

    function submitVote(uint256 _matchId, address[] calldata _winnerAddresses)
        external
        votingActive(_matchId)
        nonReentrant
    {
        VotingSession storage session = votingSessions[_matchId];

        bool isParticipant = false;
        for (uint256 i = 0; i < session.participants.length; i++) {
            if (session.participants[i] == msg.sender) {
                isParticipant = true;
                break;
            }
        }
        require(isParticipant, "Voter is not a participant");
        require(votes[_matchId][msg.sender].voter == address(0), "Already voted");
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

        votes[_matchId][msg.sender] = Vote({
            voter: msg.sender,
            votedWinners: _winnerAddresses,
            timestamp: block.timestamp,
            verified: true
        });

        for (uint256 i = 0; i < _winnerAddresses.length; i++) {
            winnerVoteCounts[_matchId][_winnerAddresses[i]]++;
        }

        session.votesReceived++;

        emit VoteCasted(_matchId, msg.sender, _winnerAddresses, block.timestamp);
    }

    function finalizeVoting(uint256 _matchId)
        external
        onlyRole(VOTING_MANAGER_ROLE)
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
    ) external onlyRole(DISTRIBUTOR_ROLE) nonReentrant {
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

    function mint(
        address to,
        uint256 amount,
        string memory reason
    ) public onlyRole(MINTER_ROLE) {
        require(
            totalSupply() + amount <= TOTAL_SUPPLY,
            "TodoToken: exceeds max supply"
        );
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    function burnTokens(uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function isMinter(address account) public view returns (bool) {
        return hasRole(MINTER_ROLE, account);
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

    function grantBridgeRole(address _bridge) external onlyOwner {
        _grantRole(BRIDGE_ROLE, _bridge);
    }

    function revokeBridgeRole(address _bridge) external onlyOwner {
        _revokeRole(BRIDGE_ROLE, _bridge);
    }
}
