import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACT_ADDRESSES, RELAYER_ABI } from '../config/contracts'
import toast from 'react-hot-toast'

/**
 * useRelayerContract Hook
 * 
 * Simple hook for Relayer interactions - stake payments only.
 */
export function useRelayerContract() {
  const { address, chain } = useAccount()
  const chainId = chain?.id || 31337

  const relayerAddress = CONTRACT_ADDRESSES[chainId]?.relayer
  const isRelayerAvailable = relayerAddress && relayerAddress !== '0x0000000000000000000000000000000000000000'

  // Send stake
  const { writeContractAsync: sendStakeWrite, isPending: isSendingStake } = useWriteContract()

  const sendStake = async (matchId, amount) => {
    try {
      if (!isRelayerAvailable) throw new Error('Relayer not available')

      const tx = await sendStakeWrite({
        address: relayerAddress,
        abi: RELAYER_ABI,
        functionName: 'sendStake',
        args: [BigInt(matchId)],
        value: typeof amount === 'string' ? parseEther(amount) : BigInt(amount),
      })

      toast.success('Stake sent!')
      return tx
    } catch (error) {
      console.error('Send stake error:', error)
      toast.error(error.shortMessage || error.message || 'Failed to send stake')
      throw error
    }
  }

  // Read deployer address
  const { data: deployerAddress } = useReadContract({
    address: relayerAddress,
    abi: RELAYER_ABI,
    functionName: 'deployer',
    query: { enabled: isRelayerAvailable },
  })

  return {
    relayerAddress,
    isRelayerAvailable,
    sendStake,
    isSendingStake,
    deployerAddress,
    currentChainId: chainId,
  }
}

export default useRelayerContract
