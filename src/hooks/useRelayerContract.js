import { useReadContract, useWriteContract, useAccount, useGasPrice } from 'wagmi'
import { useState, useCallback } from 'react'
import { CONTRACT_ADDRESSES, RELAYER_ABI } from '../config/contracts'
import toast from 'react-hot-toast'

const NEW_USER_BONUS = 100n * 10n ** 18n

export function useRelayerContract() {
  const { address, chain } = useAccount()
  const chainId = chain?.id || 31337

  const relayerAddress = CONTRACT_ADDRESSES[chainId]?.relayer
  const isRelayerAvailable = relayerAddress && relayerAddress !== '0x0000000000000000000000000000000000000000'

  const [isRegistering, setIsRegistering] = useState(false)
  const [isStaking, setIsStaking] = useState(false)

  // Get current gas price for L2 networks with fluctuating fees
  const { data: gasPrice } = useGasPrice()

  const { writeContractAsync: registerUserWrite } = useWriteContract()
  const { writeContractAsync: stakeForMatchWrite } = useWriteContract()

  const { data: isUserRegistered, refetch: refetchRegistration } = useReadContract({
    address: relayerAddress,
    abi: RELAYER_ABI,
    functionName: 'isUserRegistered',
    args: [address],
    query: { enabled: isRelayerAvailable && !!address },
  })

  const { data: userBalance, refetch: refetchBalance } = useReadContract({
    address: relayerAddress,
    abi: RELAYER_ABI,
    functionName: 'getUserBalance',
    args: [address],
    query: { enabled: isRelayerAvailable && !!address },
  })

  const { data: deployerAddress } = useReadContract({
    address: relayerAddress,
    abi: RELAYER_ABI,
    functionName: 'deployer',
    query: { enabled: isRelayerAvailable },
  })

  // Get pool stats (virtual-only mode)
  const { data: poolStats, refetch: refetchPoolStats } = useReadContract({
    address: relayerAddress,
    abi: RELAYER_ABI,
    functionName: 'getPoolStats',
    query: { enabled: isRelayerAvailable },
  })


  // Helper to get gas config with buffer for L2 networks
  const getGasConfig = useCallback(() => {
    if (!gasPrice) return {}
    // Add 50% buffer to gas price for L2 networks with fluctuating base fees
    const bufferedGasPrice = (gasPrice * 150n) / 100n
    return {
      maxFeePerGas: bufferedGasPrice,
      maxPriorityFeePerGas: bufferedGasPrice / 10n, // 10% priority fee
    }
  }, [gasPrice])

  const registerUser = useCallback(async () => {
    if (!isRelayerAvailable) {
      toast.error('Relayer not available on this network')
      return false
    }

    if (isUserRegistered) {
      toast.error('User already registered')
      return false
    }

    setIsRegistering(true)
    try {
      const tx = await registerUserWrite({
        address: relayerAddress,
        abi: RELAYER_ABI,
        functionName: 'registerUser',
        ...getGasConfig(),
      })

      toast.success('Registration successful! You received 100 TODO tokens!')
      await refetchRegistration()
      await refetchBalance()
      return true
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.shortMessage || error.message || 'Failed to register')
      return false
    } finally {
      setIsRegistering(false)
    }
  }, [isRelayerAvailable, isUserRegistered, relayerAddress, registerUserWrite, refetchRegistration, refetchBalance, getGasConfig])

  const stakeForMatch = useCallback(async (matchId, amount) => {
    if (!isRelayerAvailable) {
      toast.error('Relayer not available on this network')
      return false
    }

    if (!isUserRegistered) {
      toast.error('Please register first')
      return false
    }

    const amountBigInt = typeof amount === 'bigint' ? amount : BigInt(amount)

    if (userBalance < amountBigInt) {
      toast.error('Insufficient TODO balance')
      return false
    }

    setIsStaking(true)
    try {
      const tx = await stakeForMatchWrite({
        address: relayerAddress,
        abi: RELAYER_ABI,
        functionName: 'stakeForMatch',
        args: [BigInt(matchId), amountBigInt],
        ...getGasConfig(),
      })

      toast.success('Stake successful!')
      await refetchBalance()
      return true
    } catch (error) {
      console.error('Stake error:', error)
      toast.error(error.shortMessage || error.message || 'Failed to stake')
      return false
    } finally {
      setIsStaking(false)
    }
  }, [isRelayerAvailable, isUserRegistered, userBalance, relayerAddress, stakeForMatchWrite, refetchBalance, getGasConfig])

  return {
    relayerAddress,
    isRelayerAvailable,
    isUserRegistered: !!isUserRegistered,
    userBalance: userBalance || 0n,
    userBalanceFormatted: userBalance ? Number(userBalance / 10n ** 18n) : 0,
    deployerAddress,
    currentChainId: chainId,
    // Pool stats (virtual-only mode)
    poolStats: poolStats ? {
      totalVirtualBalance: poolStats[0] || 0n,
      totalStaked: poolStats[1] || 0n,
      totalUsers: Number(poolStats[2] || 0),
    } : null,
    refetchPoolStats,
    // Actions
    registerUser,
    isRegistering,
    stakeForMatch,
    isStaking,
    refetchBalance,
    refetchRegistration,
    NEW_USER_BONUS,
  }

}

export default useRelayerContract

