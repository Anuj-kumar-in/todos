import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACT_ADDRESSES, RELAYER_ABI } from '../config/contracts'
import toast from 'react-hot-toast'

export function useRelayerContract() {
  const { address, chain } = useAccount()
  const chainId = chain?.id || 31337

  // Get Relayer address for current chain
  const relayerAddress = CONTRACT_ADDRESSES[chainId]?.relayer

  if (!relayerAddress) {
    console.error(`Relayer not deployed on chain ${chainId}`)
  }

  // ==================== ACTION SUBMISSION ====================

  // Write: Submit action to relayer (backend will listen to events)
  const { writeContractAsync: signMessageWrite, isPending: isSigningMessage } =
    useWriteContract()

  // Keep function name but change implementation to submitAction
  const signMessage = async (actionType, matchId, actionData) => {
    try {
      // Convert old messageType to actionType enum
      // ActionType: CREATE_MATCH=0, JOIN_MATCH=1, START_VOTING=2, SUBMIT_VOTE=3, WITHDRAW_REWARDS=4

      const tx = await signMessageWrite({
        address: relayerAddress,
        abi: RELAYER_ABI,
        functionName: 'submitAction',
        args: [actionType, matchId, actionData],
      })
      toast.success('Action submitted! Backend processing...')
      return tx
    } catch (error) {
      console.error('Submit action error:', error)
      toast.error(error.shortMessage || 'Failed to submit action')
      throw error
    }
  }

  // ==================== STAKE MANAGEMENT ====================

  // Write: Send stake directly to deployer
  const { writeContractAsync: recordStakeWrite, isPending: isRecordingStake } =
    useWriteContract()

  // Keep function name but change to sendStake implementation
  const recordStake = async (matchId, amount) => {
    try {
      const tx = await recordStakeWrite({
        address: relayerAddress,
        abi: RELAYER_ABI,
        functionName: 'sendStake',
        args: [matchId],
        value: parseEther(amount.toString()),
      })
      toast.success('Stake sent! Joining match...')
      return tx
    } catch (error) {
      console.error('Send stake error:', error)
      toast.error(error.shortMessage || 'Failed to send stake')
      throw error
    }
  }

  // ==================== VIEW FUNCTIONS ====================

  // Read: Get user actions (renamed from getUserMessages)
  const useGetUserMessages = () => {
    return useReadContract({
      address: relayerAddress,
      abi: RELAYER_ABI,
      functionName: 'getUserActions',
      args: [address],
      query: { enabled: !!address && !!relayerAddress },
    })
  }

  // Read: Get single action (renamed from getMessage)
  const useGetMessage = (actionId) => {
    return useReadContract({
      address: relayerAddress,
      abi: RELAYER_ABI,
      functionName: 'getAction',
      args: [actionId],
      query: { enabled: !!actionId && !!relayerAddress },
    })
  }

  // Read: Get stake - DEPRECATED (returns null for backward compatibility)
  const useGetStake = (stakeId) => {
    console.warn('getStake is deprecated - stakes are tracked off-chain')
    return { data: null }
  }

  return {
    relayerAddress,
    signMessage, // Now calls submitAction internally
    isSigningMessage,
    recordStake, // Now calls sendStake internally
    isRecordingStake,
    useGetUserMessages, // Now returns actions
    useGetMessage, // Now returns action
    useGetStake, // Deprecated
    currentChainId: chainId,
  }
}

export default useRelayerContract
