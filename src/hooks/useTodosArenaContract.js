import { useReadContract, useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useState, useCallback, useMemo } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES, TODO_ARENA_ABI, NETWORK_NAMES } from '../config/contracts'
import toast from 'react-hot-toast'

// Primary network chain ID (Sepolia) - where TodosArena is deployed
const PRIMARY_CHAIN_ID = 11155111

/**
 * useTodosArenaContract Hook
 * 
 * - READS: Always reads from the PRIMARY network (Sepolia) where TodosArena is deployed
 * - WRITES: Uses ethers.js with PRIVATE_KEY from .env to call TodosArena on primary network
 * - Network independence: Match data remains consistent regardless of user's connected network
 * - Only joinMatch captures user's network for storage in match details
 */
export function useTodosArenaContract() {
  const { address, chain } = useAccount()

  // User's current chain (for joinMatch network storage)
  const userChainId = chain?.id || 31337
  const userNetworkName = useMemo(() => {
    return chain?.name || NETWORK_NAMES[userChainId] || 'Unknown Network'
  }, [chain?.name, userChainId])

  // ALWAYS use the primary network (Sepolia) for TodosArena address
  // This ensures match data is consistent regardless of user's connected network
  const todoArenaAddress = CONTRACT_ADDRESSES[PRIMARY_CHAIN_ID]?.todosArena ||
    CONTRACT_ADDRESSES.primary?.todosArena

  // Loading states
  const [isCreatingMatch, setIsCreatingMatch] = useState(false)
  const [isJoiningMatch, setIsJoiningMatch] = useState(false)
  const [isStartingMatch, setIsStartingMatch] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [isFinalizingVoting, setIsFinalizingVoting] = useState(false)

  // ==================== ETHERS.JS CONTRACT INSTANCE ====================
  // Always connects to the PRIMARY network (Sepolia) RPC

  const getContract = useCallback(() => {
    const privateKey = import.meta.env.VITE_PRIVATE_KEY
    const rpcUrl = import.meta.env.VITE_RPC_URL // Should be Sepolia RPC

    if (!privateKey) {
      throw new Error('VITE_PRIVATE_KEY not set in .env')
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const wallet = new ethers.Wallet(privateKey, provider)
    return new ethers.Contract(todoArenaAddress, TODO_ARENA_ABI, wallet)
  }, [todoArenaAddress])

  // ==================== READ OPERATIONS (wagmi) ====================

  const { data: matchCounter, refetch: refetchCounter } = useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'matchCounter',
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
  })

  const {
    data: allMatches,
    refetch: refetchMatches,
    isLoading: isLoadingMatches,
  } = useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getAllMatches',
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
  })

  const { data: userMatches, refetch: refetchUserMatches } = useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getUserMatches',
    args: [address],
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
    query: { enabled: !!address },
  })

  const { data: rewardBalance, refetch: refetchRewardBalance } = useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getRewardBalance',
    args: [address],
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
    query: { enabled: !!address },
  })

  const { data: totalEarned, refetch: refetchTotalEarned } = useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getTotalEarned',
    args: [address],
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
    query: { enabled: !!address },
  })

  // ==================== WRITE OPERATIONS (ethers.js with PRIVATE_KEY) ====================

  const createMatch = useCallback(async (title, description, gameType, entryStake, maxParticipants, votingDuration) => {
    if (!address) {
      toast.error('Please connect your wallet')
      return
    }

    setIsCreatingMatch(true)
    try {
      const contract = getContract()
      const tx = await contract.createMatch(
        address,
        title,
        description,
        gameType,
        ethers.parseEther(entryStake.toString()),
        maxParticipants,
        votingDuration
      )
      await tx.wait()
      toast.success('Match created!')
      refetchMatches()
      refetchCounter()
    } catch (error) {
      console.error('Create match error:', error)
      toast.error(error.reason || error.message || 'Failed to create match')
      throw error
    } finally {
      setIsCreatingMatch(false)
    }
  }, [address, getContract, refetchMatches, refetchCounter])

  const joinMatch = useCallback(async (matchId, networkName = null) => {
    if (!address) {
      toast.error('Please connect your wallet')
      return
    }

    // Use provided network name or get from user's current connected chain
    // This captures which network the user joined from (stored in match details)
    const network = networkName || userNetworkName

    setIsJoiningMatch(true)
    try {
      const contract = getContract()
      const tx = await contract.joinMatch(matchId, address, network)
      await tx.wait()
      toast.success(`Joined match from ${network}!`)
      refetchMatches()
      refetchUserMatches()
    } catch (error) {
      console.error('Join match error:', error)
      toast.error(error.reason || error.message || 'Failed to join match')
      throw error
    } finally {
      setIsJoiningMatch(false)
    }
  }, [address, userNetworkName, getContract, refetchMatches, refetchUserMatches])

  const startVotingPhase = useCallback(async (matchId) => {
    setIsStartingMatch(true)
    try {
      const contract = getContract()
      const tx = await contract.startVotingPhase(matchId)
      await tx.wait()
      toast.success('Voting started!')
      refetchMatches()
    } catch (error) {
      console.error('Start voting error:', error)
      toast.error(error.reason || error.message || 'Failed to start voting')
      throw error
    } finally {
      setIsStartingMatch(false)
    }
  }, [getContract, refetchMatches])

  const startMatch = useCallback(async (matchId) => {
    setIsStartingMatch(true)
    try {
      const contract = getContract()
      const tx = await contract.startMatch(matchId)
      await tx.wait()
      toast.success('Match started!')
      refetchMatches()
    } catch (error) {
      console.error('Start match error:', error)
      toast.error(error.reason || error.message || 'Failed to start match')
      throw error
    } finally {
      setIsStartingMatch(false)
    }
  }, [getContract, refetchMatches])

  const submitVote = useCallback(async (matchId, winnerAddresses) => {
    if (!address) {
      toast.error('Please connect your wallet')
      return
    }

    setIsVoting(true)
    try {
      const contract = getContract()
      const tx = await contract.submitVote(matchId, address, winnerAddresses)
      await tx.wait()
      toast.success('Vote submitted!')
      refetchMatches()
    } catch (error) {
      console.error('Submit vote error:', error)
      toast.error(error.reason || error.message || 'Failed to submit vote')
      throw error
    } finally {
      setIsVoting(false)
    }
  }, [address, getContract, refetchMatches])

  const finalizeVoting = useCallback(async (matchId) => {
    setIsFinalizingVoting(true)
    try {
      const contract = getContract()
      const tx = await contract.finalizeVoting(matchId)
      await tx.wait()
      // After finalizing voting, complete the match
      const tx2 = await contract.completeMatch(matchId)
      await tx2.wait()
      toast.success('Voting finalized and match completed!')
      refetchMatches()
    } catch (error) {
      console.error('Finalize voting error:', error)
      toast.error(error.reason || error.message || 'Failed to finalize voting')
      throw error
    } finally {
      setIsFinalizingVoting(false)
    }
  }, [getContract, refetchMatches])

  const finalizeWithAI = useCallback(async (matchId, aiDeterminedWinners) => {
    setIsFinalizingVoting(true)
    try {
      const contract = getContract()
      // First distribute rewards based on AI decision
      const tx = await contract.distributeRewards(matchId, aiDeterminedWinners, ethers.parseEther('0.01'))
      await tx.wait()
      // Then complete the match
      const tx2 = await contract.completeMatch(matchId)
      await tx2.wait()
      toast.success('Match finalized with AI verification!')
      refetchMatches()
    } catch (error) {
      console.error('AI finalize error:', error)
      toast.error(error.reason || error.message || 'Failed to finalize with AI')
      throw error
    } finally {
      setIsFinalizingVoting(false)
    }
  }, [getContract, refetchMatches])

  // ==================== VIEW FUNCTION HOOKS ====================

  const useGetMatch = (matchId) => useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getMatch',
    args: [matchId],
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
    query: { enabled: !!matchId && matchId > 0 },
  })

  const useGetMatchParticipants = (matchId) => useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getMatchParticipants',
    args: [matchId],
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
    query: { enabled: !!matchId && matchId > 0 },
  })

  const useGetMatchParticipantsWithNetwork = (matchId) => useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getMatchParticipantsWithNetwork',
    args: [matchId],
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
    query: { enabled: !!matchId && matchId > 0 },
  })

  const useGetVotingSession = (matchId) => useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getVotingSession',
    args: [matchId],
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
    query: { enabled: !!matchId && matchId > 0 },
  })

  const useHasVoted = (matchId) => useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'hasVoted',
    args: [matchId, address],
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
    query: { enabled: !!matchId && !!address && matchId > 0 },
  })

  const useFinalWinners = (matchId) => useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getFinalWinners',
    args: [matchId],
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
    query: { enabled: !!matchId && matchId > 0 },
  })

  const useGetRewardPool = (matchId) => useReadContract({
    address: todoArenaAddress,
    abi: TODO_ARENA_ABI,
    functionName: 'getRewardPool',
    args: [matchId],
    chainId: PRIMARY_CHAIN_ID, // Always read from Sepolia
    query: { enabled: !!matchId && matchId > 0 },
  })

  return {
    // Data
    matchCounter: matchCounter ? Number(matchCounter) : 0,
    allMatches: allMatches || [],
    userMatches: userMatches || [],
    isLoadingMatches,
    rewardBalance: rewardBalance ? formatEther(rewardBalance) : '0',
    totalEarned: totalEarned ? formatEther(totalEarned) : '0',

    // Write functions
    createMatch,
    isCreatingMatch,
    joinMatch,
    isJoiningMatch,
    startMatch,
    startVotingPhase,
    isStartingMatch,
    isStartingVoting: isStartingMatch,
    submitVote,
    isVoting,
    finalizeVoting,
    finalizeWithAI,
    isFinalizingVoting,

    // View hooks
    useGetMatch,
    useGetMatchParticipants,
    useGetMatchParticipantsWithNetwork,
    useGetVotingSession,
    useHasVoted,
    useFinalWinners,
    useGetRewardPool,

    // Refetch
    refetchMatches,
    refetchUserMatches,
    refetchCounter,
    refetchRewardBalance,
    refetchTotalEarned,

    todoArenaAddress,
  }
}

export default useTodosArenaContract
