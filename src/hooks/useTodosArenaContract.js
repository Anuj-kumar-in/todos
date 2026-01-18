import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESSES, TODOS_ARENA_ABI } from '../config/contracts'
import toast from 'react-hot-toast'

export function useTodosArenaContract() {
  const { address } = useAccount()
  
  // TodosArena is always on primary network
  const todoArenaAddress = CONTRACT_ADDRESSES.primary?.todosArena
  
  if (!todoArenaAddress) {
    console.error('TodosArena not deployed on primary network')
  }

  // ==================== MATCH READ FUNCTIONS ====================

  const { data: matchCounter, refetch: refetchCounter } = useReadContract({
    address: todoArenaAddress,
    abi: TODOS_ARENA_ABI,
    functionName: 'matchCounter',
  })

  const {
    data: allMatches,
    refetch: refetchMatches,
    isLoading: isLoadingMatches,
  } = useReadContract({
    address: todoArenaAddress,
    abi: TODOS_ARENA_ABI,
    functionName: 'getAllMatches',
  })

  const { data: userMatches, refetch: refetchUserMatches } = useReadContract({
    address: todoArenaAddress,
    abi: TODOS_ARENA_ABI,
    functionName: 'getUserMatches',
    args: [address],
    query: { enabled: !!address },
  })

  // ==================== MATCH WRITE FUNCTIONS ====================

  const { writeContractAsync: createMatchWrite, isPending: isCreatingMatch } =
    useWriteContract()

  const createMatch = async (
    title,
    description,
    gameType,
    entryStake,
    maxParticipants,
    votingDuration
  ) => {
    try {
      const tx = await createMatchWrite({
        address: todoArenaAddress,
        abi: TODOS_ARENA_ABI,
        functionName: 'createMatch',
        args: [
          title,
          description,
          gameType,
          parseEther(entryStake),
          maxParticipants,
          votingDuration,
        ],
      })
      toast.success('Match created!')
      refetchMatches()
      refetchCounter()
      return tx
    } catch (error) {
      console.error('Create match error:', error)
      toast.error(error.shortMessage || 'Failed to create match')
      throw error
    }
  }

  // ==================== CROSS-CHAIN STAKE FUNCTIONS ====================

  const {
    writeContractAsync: registerStakeWrite,
    isPending: isRegisteringStake,
  } = useWriteContract()

  const registerStakeVerification = async (
    user,
    matchId,
    amount,
    chainId,
    relayerStakeId
  ) => {
    try {
      const tx = await registerStakeWrite({
        address: todoArenaAddress,
        abi: TODOS_ARENA_ABI,
        functionName: 'registerStakeVerification',
        args: [user, matchId, parseEther(amount), chainId, relayerStakeId],
      })
      toast.success('Stake verification registered!')
      return tx
    } catch (error) {
      console.error('Register stake error:', error)
      toast.error(error.shortMessage || 'Failed to register stake')
      throw error
    }
  }

  const {
    writeContractAsync: confirmStakeWrite,
    isPending: isConfirmingStake,
  } = useWriteContract()

  const confirmStakeAndJoinMatch = async (verificationId) => {
    try {
      const tx = await confirmStakeWrite({
        address: todoArenaAddress,
        abi: TODOS_ARENA_ABI,
        functionName: 'confirmStakeAndJoinMatch',
        args: [verificationId],
      })
      toast.success('Stake confirmed! You joined the match!')
      refetchMatches()
      return tx
    } catch (error) {
      console.error('Confirm stake error:', error)
      toast.error(error.shortMessage || 'Failed to confirm stake')
      throw error
    }
  }

  // ==================== VOTING FUNCTIONS ====================

  const { writeContractAsync: submitVoteWrite, isPending: isVoting } =
    useWriteContract()

  const submitVote = async (matchId, winnerAddresses) => {
    try {
      const tx = await submitVoteWrite({
        address: todoArenaAddress,
        abi: TODOS_ARENA_ABI,
        functionName: 'submitVote',
        args: [matchId, winnerAddresses],
      })
      toast.success('Vote submitted!')
      return tx
    } catch (error) {
      console.error('Submit vote error:', error)
      toast.error(error.shortMessage || 'Failed to submit vote')
      throw error
    }
  }

  const { writeContractAsync: finalizeVotingWrite, isPending: isFinalizingVoting } =
    useWriteContract()

  const finalizeVoting = async (matchId) => {
    try {
      const tx = await finalizeVotingWrite({
        address: todoArenaAddress,
        abi: TODOS_ARENA_ABI,
        functionName: 'finalizeVoting',
        args: [matchId],
      })
      toast.success('Voting finalized!')
      return tx
    } catch (error) {
      console.error('Finalize voting error:', error)
      toast.error(error.shortMessage || 'Failed to finalize voting')
      throw error
    }
  }

  const useGetVotingSession = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODOS_ARENA_ABI,
      functionName: 'getVotingSession',
      args: [matchId],
      query: { enabled: !!matchId },
    })
  }

  const useHasVoted = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODOS_ARENA_ABI,
      functionName: 'hasVoted',
      args: [matchId, address],
      query: { enabled: !!matchId && !!address },
    })
  }

  const useFinalWinners = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODOS_ARENA_ABI,
      functionName: 'getFinalWinners',
      args: [matchId],
      query: { enabled: !!matchId },
    })
  }

  // ==================== REWARD FUNCTIONS ====================

  const { data: rewardBalance, refetch: refetchRewardBalance } = useReadContract({
    address: todoArenaAddress,
    abi: TODOS_ARENA_ABI,
    functionName: 'getRewardBalance',
    args: [address],
    query: { enabled: !!address },
  })

  const { data: totalEarned, refetch: refetchTotalEarned } = useReadContract({
    address: todoArenaAddress,
    abi: TODOS_ARENA_ABI,
    functionName: 'getTotalEarned',
    args: [address],
    query: { enabled: !!address },
  })

  const { writeContractAsync: claimRewardsWrite, isPending: isClaimingRewards } =
    useWriteContract()

  const claimAllRewards = async () => {
    try {
      const tx = await claimRewardsWrite({
        address: todoArenaAddress,
        abi: TODOS_ARENA_ABI,
        functionName: 'claimAllRewards',
      })
      toast.success('Rewards claimed!')
      refetchRewardBalance()
      refetchTotalEarned()
      return tx
    } catch (error) {
      console.error('Claim rewards error:', error)
      toast.error(error.shortMessage || 'Failed to claim rewards')
      throw error
    }
  }

  const claimMatchRewards = async (matchId) => {
    try {
      const tx = await claimRewardsWrite({
        address: todoArenaAddress,
        abi: TODOS_ARENA_ABI,
        functionName: 'claimRewards',
        args: [matchId],
      })
      toast.success('Match rewards claimed!')
      refetchRewardBalance()
      return tx
    } catch (error) {
      console.error('Claim match rewards error:', error)
      toast.error(error.shortMessage || 'Failed to claim rewards')
      throw error
    }
  }

  const useGetRewardPool = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODOS_ARENA_ABI,
      functionName: 'getRewardPool',
      args: [matchId],
      query: { enabled: !!matchId },
    })
  }

  // ==================== MATCH VIEW FUNCTIONS ====================

  const useGetMatch = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODOS_ARENA_ABI,
      functionName: 'getMatch',
      args: [matchId],
      query: { enabled: !!matchId },
    })
  }

  const useGetMatchParticipants = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODOS_ARENA_ABI,
      functionName: 'getMatchParticipants',
      args: [matchId],
      query: { enabled: !!matchId },
    })
  }

  return {
    // Match data
    matchCounter,
    allMatches,
    userMatches,
    isLoadingMatches,
    
    // Match functions
    createMatch,
    isCreatingMatch,
    
    // Cross-chain stake functions
    registerStakeVerification,
    isRegisteringStake,
    confirmStakeAndJoinMatch,
    isConfirmingStake,
    
    // Voting functions
    submitVote,
    isVoting,
    finalizeVoting,
    isFinalizingVoting,
    useGetVotingSession,
    useHasVoted,
    useFinalWinners,
    
    // Reward functions
    rewardBalance: rewardBalance ? formatEther(rewardBalance) : '0',
    totalEarned: totalEarned ? formatEther(totalEarned) : '0',
    claimAllRewards,
    claimMatchRewards,
    isClaimingRewards,
    useGetRewardPool,
    
    // View functions
    useGetMatch,
    useGetMatchParticipants,
    
    // Refetch functions
    refetchMatches,
    refetchUserMatches,
    refetchCounter,
    refetchRewardBalance,
    refetchTotalEarned,
    
    // Contract address
    todoArenaAddress,
  }
}

export default useTodosArenaContract