    import { useReadContract, useWriteContract, useAccount } from 'wagmi'
    import { CONTRACT_ADDRESSES, TODO_ARENA_ABI } from '../config/contracts'
    import toast from 'react-hot-toast'

    export function useVotingContract() {
    const { address, chain } = useAccount()
    const chainId = chain?.id || 31337
    const addresses = CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[31337]

    // Write: Submit vote
    const { writeContractAsync: submitVoteWrite, isPending: isVoting } =
        useWriteContract()

    const submitVote = async (matchId, winnerAddresses) => {
        try {
        const tx = await submitVoteWrite({
            address: addresses.votingContract,
            abi: TODO_ARENA_ABI,
            functionName: 'submitVote',
            args: [matchId, winnerAddresses],
        })
        toast.success('Vote submitted successfully!')
        return tx
        } catch (error) {
        console.error('Submit vote error:', error)
        toast.error(error.shortMessage || 'Failed to submit vote')
        throw error
        }
    }

    // Read: Check if user has voted
    const useHasVoted = (matchId) => {
        return useReadContract({
        address: addresses.votingContract,
        abi: TODO_ARENA_ABI,
        functionName: 'hasVoted',
        args: [matchId, address],
        query: { enabled: !!matchId && !!address },
        })
    }

    // Read: Get voting session
    const useVotingSession = (matchId) => {
        return useReadContract({
        address: addresses.votingContract,
        abi: TODO_ARENA_ABI,
        functionName: 'getVotingSession',
        args: [matchId],
        query: { enabled: !!matchId },
        })
    }

    // Read: Get final winners
    const useFinalWinners = (matchId) => {
        return useReadContract({
        address: addresses.votingContract,
        abi: TODO_ARENA_ABI,
        functionName: 'getFinalWinners',
        args: [matchId],
        query: { enabled: !!matchId },
        })
    }

    return {
        submitVote,
        isVoting,
        useHasVoted,
        useVotingSession,
        useFinalWinners,
        contractAddress: addresses.votingContract,
    }
    }

    export default useVotingContract
