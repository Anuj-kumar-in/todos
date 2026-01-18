import { useReadContract, useWriteContract, useAccount } from 'wagmi'
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

  // Write: Sign message on Relayer
  const { writeContractAsync: signMessageWrite, isPending: isSigningMessage } =
    useWriteContract()

  const signMessage = async (messageType, matchId, messageData, signature) => {
    try {
      const tx = await signMessageWrite({
        address: relayerAddress,
        abi: RELAYER_ABI,
        functionName: 'signMessage',
        args: [messageType, matchId, messageData, signature],
      })
      toast.success('Message signed on Relayer!')
      return tx
    } catch (error) {
      console.error('Sign message error:', error)
      toast.error(error.shortMessage || 'Failed to sign message')
      throw error
    }
  }

  // Write: Record stake sent to deployer
  const { writeContractAsync: recordStakeWrite, isPending: isRecordingStake } =
    useWriteContract()

  const recordStake = async (user, matchId, amount) => {
    try {
      const tx = await recordStakeWrite({
        address: relayerAddress,
        abi: RELAYER_ABI,
        functionName: 'recordStake',
        args: [user, matchId, amount],
      })
      toast.success('Stake recorded on Relayer!')
      return tx
    } catch (error) {
      console.error('Record stake error:', error)
      toast.error(error.shortMessage || 'Failed to record stake')
      throw error
    }
  }

  // Read: Get user messages
  const useGetUserMessages = () => {
    return useReadContract({
      address: relayerAddress,
      abi: RELAYER_ABI,
      functionName: 'getUserMessages',
      args: [address],
      query: { enabled: !!address && !!relayerAddress },
    })
  }

  // Read: Get single message
  const useGetMessage = (messageId) => {
    return useReadContract({
      address: relayerAddress,
      abi: RELAYER_ABI,
      functionName: 'getMessage',
      args: [messageId],
      query: { enabled: !!messageId && !!relayerAddress },
    })
  }

  // Read: Get stake record
  const useGetStake = (stakeId) => {
    return useReadContract({
      address: relayerAddress,
      abi: RELAYER_ABI,
      functionName: 'getStake',
      args: [stakeId],
      query: { enabled: !!stakeId && !!relayerAddress },
    })
  }

  return {
    relayerAddress,
    signMessage,
    isSigningMessage,
    recordStake,
    isRecordingStake,
    useGetUserMessages,
    useGetMessage,
    useGetStake,
    currentChainId: chainId,
  }
}

export default useRelayerContract