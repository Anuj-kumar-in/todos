// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ITodoToken {
    function mint(address to, uint256 amount, string memory reason) external;
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title RewardDistribution
 * @dev Handles reward calculation and token distribution
 */
contract RewardDistribution is AccessControl, ReentrancyGuard {
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    
    ITodoToken public todoToken;
    
    struct RewardPool {
        uint256 matchId;
        uint256 totalAmount;
        address[] winners;
        bool distributed;
        uint256 distributedAt;
    }
    
    // State variables
    mapping(uint256 => RewardPool) public rewardPools;
    mapping(address => uint256) public userRewardBalance;
    mapping(address => uint256) public totalEarned;
    
    uint256 public totalRewardsDistributed;
    
    // Events
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
    
    constructor(address _todoTokenAddress) {
        todoToken = ITodoToken(_todoTokenAddress);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);
    }
    
    /**
     * @dev Distribute rewards to match winners
     */
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
        
        todoToken.mint(address(this), tokenAmount, "Match winner rewards");
        
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
    
    /**
     * @dev Claim rewards for a specific match
     */
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
        
        bool success = todoToken.transfer(msg.sender, reward);
        require(success, "Token transfer failed");
        
        emit RewardsClaimed(msg.sender, _matchId, reward, block.timestamp);
    }
    
    /**
     * @dev Claim all accumulated rewards
     */
    function claimAllRewards() external nonReentrant {
        uint256 balance = userRewardBalance[msg.sender];
        require(balance > 0, "No rewards to claim");
        
        userRewardBalance[msg.sender] = 0;
        
        bool success = todoToken.transfer(msg.sender, balance);
        require(success, "Token transfer failed");
        
        emit RewardsClaimed(msg.sender, 0, balance, block.timestamp);
    }
    
    // View functions
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
}
