// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VotingContract
 * @dev Handles voting on match results
 */
contract VotingContract is AccessControl, ReentrancyGuard {
    bytes32 public constant VOTING_MANAGER_ROLE = keccak256("VOTING_MANAGER_ROLE");
    
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
    
    // State variables
    mapping(uint256 => VotingSession) public votingSessions;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(uint256 => mapping(address => uint256)) public winnerVoteCounts;
    
    uint256 public constant CONSENSUS_THRESHOLD = 50;
    uint256 public constant VOTING_REWARD = 5 * 10**18;
    
    // Events
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
    
    // Modifiers
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
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VOTING_MANAGER_ROLE, msg.sender);
    }
    
    /**
     * @dev Create a voting session for a match
     */
    function createVotingSession(
        uint256 _matchId,
        address[] calldata _participants,
        uint256 _votingDuration
    ) external onlyRole(VOTING_MANAGER_ROLE) {
        require(_participants.length >= 2, "Need at least 2 participants");
        require(_votingDuration > 0, "Voting duration must be positive");
        
        VotingSession storage session = votingSessions[_matchId];
        session.matchId = _matchId;
        session.participants = _participants;
        session.votingEndTime = block.timestamp + _votingDuration;
        
        emit VotingSessionCreated(_matchId, _participants, session.votingEndTime);
    }
    
    /**
     * @dev Submit a vote for match winners
     */
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
    
    /**
     * @dev Finalize voting and determine winners
     */
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
    
    // View functions
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
    
    function getParticipants(uint256 _matchId) external view returns (address[] memory) {
        return votingSessions[_matchId].participants;
    }
}
