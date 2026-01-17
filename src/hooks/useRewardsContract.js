    import { useReadContract, useWriteContract, useAccount } from 'wagmi'
    import { formatEther } from 'viem'
    import { CONTRACT_ADDRESSES, TODO_ARENA_ABI } from '../config/contracts'
    import toast from 'react-hot-toast'

    export function useRewardsContract() {
    const { address, chain } = useAccount()
    const chainId = chain?.id || 31337
    const addresses = CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[31337]

    // Read: Get reward balance
    const { data: rewardBalance, refetch: refetchBalance } = useReadContract({
        address: addresses.rewardDistribution,
        abi: TODO_ARENA_ABI,
        functionName: 'getRewardBalance',
        args: [address],
        query: { enabled: !!address },
    })

    // Read: Get total earned
    const { data: totalEarned, refetch: refetchEarned } = useReadContract({
        address: addresses.rewardDistribution,
        abi: TODO_ARENA_ABI,
        functionName: 'getTotalEarned',
        args: [address],
        query: { enabled: !!address },
    })

    // Read: Token balance
    const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
        address: addresses.todoToken,
        abi: TODO_ARENA_ABI,
        functionName: 'balanceOf',
        args: [address],
        query: { enabled: !!address },
    })

    // Write: Claim rewards
    const { writeContractAsync: claimWrite, isPending: isClaiming } =
        useWriteContract()

    const claimAllRewards = async () => {
        try {
        const tx = await claimWrite({
            address: addresses.rewardDistribution,
            abi: TODO_ARENA_ABI,
            functionName: 'claimAllRewards',
        })
        toast.success('Rewards claimed successfully!')
        refetchBalance()
        refetchTokenBalance()
        return tx
        } catch (error) {
        console.error('Claim rewards error:', error)
        toast.error(error.shortMessage || 'Failed to claim rewards')
        throw error
        }
    }

    // Write: Claim specific match rewards
    const claimMatchRewards = async (matchId) => {
        try {
        const tx = await claimWrite({
            address: addresses.rewardDistribution,
            abi: TODO_ARENA_ABI,
            functionName: 'claimRewards',
            args: [matchId],
        })
        toast.success('Match rewards claimed!')
        refetchBalance()
        refetchTokenBalance()
        return tx
        } catch (error) {
        console.error('Claim match rewards error:', error)
        toast.error(error.shortMessage || 'Failed to claim rewards')
        throw error
        }
    }

    return {
        rewardBalance: rewardBalance ? formatEther(rewardBalance) : '0',
        totalEarned: totalEarned ? formatEther(totalEarned) : '0',
        tokenBalance: tokenBalance ? formatEther(tokenBalance) : '0',
        claimAllRewards,
        claimMatchRewards,
        isClaiming,
        refetchBalance,
        refetchTokenBalance,
        tokenAddress: addresses.todoToken,
        rewardAddress: addresses.rewardDistribution,
    }
    }

    export default useRewardsContract
