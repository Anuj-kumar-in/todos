import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi'
import { parseEther, formatEther, toHex } from 'viem'
import { CONTRACT_ADDRESSES, TODO_ARENA_ABI } from '../config/contracts'
import toast from 'react-hot-toast'

export function useTodosArenaContract() {
  const { address, chain } = useAccount()
  const chainId = chain?.id || 31337

  // TodosArena is on the current chain for local/test, primary for mainnet
  const todoArenaAddress = CONTRACT_ADDRESSES[chainId]?.todosArena || CONTRACT_ADDRESSES.primary?.todosArena

  if (!todoArenaAddress) {
    console.error('TodosArena not deployed on primary network')
  }

  // ==================== MATCH READ FUNCTIONS ====================

  const { data: matchCounter, refetch: refetchCounter } = useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'matchCounter',
  })

  const {
    data: allMatches,
    refetch: refetchMatches,
    isLoading: isLoadingMatches,
  } = useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getAllMatches',
  })

  const { data: userMatches, refetch: refetchUserMatches } = useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getUserMatches',
    args: [address],
    query: { enabled: !!address },
  })

  // ==================== MATCH WRITE FUNCTIONS ====================
  // NOTE: These now submit actions to Relayer, not TodosArena directly

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
      // Get Relayer address for current chain
      const relayerAddress = CONTRACT_ADDRESSES[chainId]?.relayer

      if (!relayerAddress) {
        throw new Error('Relayer not available on this network')
      }

      // Encode action data
      const actionData = new TextEncoder().encode(
        JSON.stringify({
          title,
          description,
          gameType,
          entryStake,
          maxParticipants,
          votingDuration,
        })
      )

      // Submit to Relayer instead of TodosArena
      const tx = await createMatchWrite({
        address: relayerAddress,
        abi: [
          {
            name: 'submitAction',
            type: 'function',
            inputs: [
              { name: '_actionType', type: 'uint8' },
              { name: '_matchId', type: 'uint256' },
              { name: '_actionData', type: 'bytes' },
            ],
            outputs: [{ type: 'uint256' }],
          },
        ],
        functionName: 'submitAction',
        args: [0, 0, toHex(actionData)], // ActionType.CREATE_MATCH = 0, matchId = 0 for new match
      })

      toast.success('Match creation submitted! Backend processing...')

      // Refetch after delay to allow backend to process
      setTimeout(() => {
        refetchMatches()
        refetchCounter()
      }, 3000)

      return tx
    } catch (error) {
      console.error('Create match error:', error)
      toast.error(error.shortMessage || 'Failed to create match')
      throw error
    }
  }

  // ==================== CROSS-CHAIN STAKE FUNCTIONS ====================
  // DEPRECATED: Removed in new architecture

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
    console.warn('registerStakeVerification is deprecated - use Relayer.sendStake()')
    toast.error('This function is no longer available. Use "Join Match" button.')
    throw new Error('Deprecated function')
  }

  const {
    writeContractAsync: confirmStakeWrite,
    isPending: isConfirmingStake,
  } = useWriteContract()

  const confirmStakeAndJoinMatch = async (verificationId) => {
    console.warn('confirmStakeAndJoinMatch is deprecated - backend handles this')
    toast.error('This function is no longer available. Backend processes joins automatically.')
    throw new Error('Deprecated function')
  }

  // ==================== VOTING FUNCTIONS ====================

  const { writeContractAsync: submitVoteWrite, isPending: isVoting } =
    useWriteContract()

  const submitVote = async (matchId, winnerAddresses) => {
    try {
      // Get Relayer address for current chain
      const relayerAddress = CONTRACT_ADDRESSES[chainId]?.relayer

      if (!relayerAddress) {
        throw new Error('Relayer not available on this network')
      }

      // Encode winner addresses as action data
      const actionData = new TextEncoder().encode(
        JSON.stringify({ winners: winnerAddresses })
      )

      // Submit vote action to Relayer
      const tx = await submitVoteWrite({
        address: relayerAddress,
        abi: [
          {
            name: 'submitAction',
            type: 'function',
            inputs: [
              { name: '_actionType', type: 'uint8' },
              { name: '_matchId', type: 'uint256' },
              { name: '_actionData', type: 'bytes' },
            ],
            outputs: [{ type: 'uint256' }],
          },
        ],
        functionName: 'submitAction',
        args: [3, matchId, toHex(actionData)], // ActionType.SUBMIT_VOTE = 3
      })

      toast.success('Vote submitted! Backend processing...')
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
    console.warn('finalizeVoting should be called by backend/admin only')
    toast.error('Only admin can finalize voting')
    throw new Error('Admin-only function')
  }

  const useGetVotingSession = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODO_ARENA_ABI,
      functionName: 'getVotingSession',
      args: [matchId],
      query: { enabled: !!matchId },
    })
  }

  const useHasVoted = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODO_ARENA_ABI,
      functionName: 'hasVoted',
      args: [matchId, address],
      query: { enabled: !!matchId && !!address },
    })
  }

  const useFinalWinners = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODO_ARENA_ABI,
      functionName: 'getFinalWinners',
      args: [matchId],
      query: { enabled: !!matchId },
    })
  }

  // ==================== REWARD FUNCTIONS ====================

  const { data: rewardBalance, refetch: refetchRewardBalance } = useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getRewardBalance',
    args: [address],
    query: { enabled: !!address },
  })

  const { data: totalEarned, refetch: refetchTotalEarned } = useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getTotalEarned',
    args: [address],
    query: { enabled: !!address },
  })

  const { writeContractAsync: claimRewardsWrite, isPending: isClaimingRewards } =
    useWriteContract()

  const claimAllRewards = async () => {
    try {
      // Users can still claim rewards directly from TodosArena
      // Or submit claim action to Relayer for cross-chain rewards

      const relayerAddress = CONTRACT_ADDRESSES[chainId]?.relayer
      const isOnPrimaryNetwork = chainId === CONTRACT_ADDRESSES.primaryChainId

      if (isOnPrimaryNetwork) {
        // Direct claim from TodosArena
        const tx = await claimRewardsWrite({
          address: todoArenaAddress,
          abi: TODO_ARENA_ABI,
          functionName: 'claimAllRewards',
        })
        toast.success('Rewards claimed!')
        refetchRewardBalance()
        refetchTotalEarned()
        return tx
      } else {
        // Submit claim action to Relayer for bridging
        const actionData = new TextEncoder().encode(
          JSON.stringify({ claimAll: true })
        )

        const tx = await claimRewardsWrite({
          address: relayerAddress,
          abi: [
            {
              name: 'submitAction',
              type: 'function',
              inputs: [
                { name: '_actionType', type: 'uint8' },
                { name: '_matchId', type: 'uint256' },
                { name: '_actionData', type: 'bytes' },
              ],
              outputs: [{ type: 'uint256' }],
            },
          ],
          functionName: 'submitAction',
          args: [4, 0, toHex(actionData)], // ActionType.WITHDRAW_REWARDS = 4
        })

        toast.success('Claim request submitted! Backend will bridge rewards...')
        return tx
      }
    } catch (error) {
      console.error('Claim rewards error:', error)
      toast.error(error.shortMessage || 'Failed to claim rewards')
      throw error
    }
  }

  const claimMatchRewards = async (matchId) => {
    try {
      const relayerAddress = CONTRACT_ADDRESSES[chainId]?.relayer
      const isOnPrimaryNetwork = chainId === CONTRACT_ADDRESSES.primaryChainId

      if (isOnPrimaryNetwork) {
        // Direct claim from TodosArena
        const tx = await claimRewardsWrite({
          address: todoArenaAddress,
          abi: TODO_ARENA_ABI,
          functionName: 'claimRewards',
          args: [matchId],
        })
        toast.success('Match rewards claimed!')
        refetchRewardBalance()
        return tx
      } else {
        // Submit claim action to Relayer
        const actionData = new TextEncoder().encode(
          JSON.stringify({ matchId })
        )

        const tx = await claimRewardsWrite({
          address: relayerAddress,
          abi: [
            {
              name: 'submitAction',
              type: 'function',
              inputs: [
                { name: '_actionType', type: 'uint8' },
                { name: '_matchId', type: 'uint256' },
                { name: '_actionData', type: 'bytes' },
              ],
              outputs: [{ type: 'uint256' }],
            },
          ],
          functionName: 'submitAction',
          args: [4, matchId, toHex(actionData)], // ActionType.WITHDRAW_REWARDS = 4
        })

        toast.success('Claim request submitted! Backend will bridge rewards...')
        return tx
      }
    } catch (error) {
      console.error('Claim match rewards error:', error)
      toast.error(error.shortMessage || 'Failed to claim rewards')
      throw error
    }
  }

  const useGetRewardPool = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODO_ARENA_ABI,
      functionName: 'getRewardPool',
      args: [matchId],
      query: { enabled: !!matchId },
    })
  }

  // ==================== MATCH VIEW FUNCTIONS ====================

  const useGetMatch = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODO_ARENA_ABI,
      functionName: 'getMatch',
      args: [matchId],
      query: { enabled: !!matchId },
    })
  }

  const useGetMatchParticipants = (matchId) => {
    return useReadContract({
      address: todoArenaAddress,
      abi: TODO_ARENA_ABI,
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

    // Match functions (now route through Relayer)
    createMatch,
    isCreatingMatch,

    // Cross-chain stake functions (DEPRECATED)
    registerStakeVerification,
    isRegisteringStake,
    confirmStakeAndJoinMatch,
    isConfirmingStake,

    // Voting functions (route through Relayer)
    submitVote,
    isVoting,
    finalizeVoting, // Admin only
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
