import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESSES, MATCH_CONTRACT_ABI } from '../config/contracts'
import { getContractAddresses } from '../config/wagmi'
import toast from 'react-hot-toast'

export function useMatchContract() {
    const { address, chain } = useAccount()
    const chainId = chain?.id || 31337
    const addresses = getContractAddresses(chainId)
    
    // Debug logging
    console.log('useMatchContract - Chain ID:', chainId)
    console.log('useMatchContract - Addresses:', addresses)
    console.log('useMatchContract - Match Contract:', addresses.matchContract)

    // Read: Get match counter
    const { data: matchCounter, refetch: refetchCounter } = useReadContract({
        address: addresses.matchContract,
        abi: MATCH_CONTRACT_ABI,
        functionName: 'matchCounter',
    })
    
    // Debug logging for matchCounter
    console.log('useMatchContract - matchCounter:', matchCounter)

    // Read: Get all matches
    const { data: allMatches, refetch: refetchMatches, isLoading: isLoadingMatches } = useReadContract({
        address: addresses.matchContract,
        abi: MATCH_CONTRACT_ABI,
        functionName: 'getAllMatches',
    })
    
    // Debug logging for allMatches
    console.log('useMatchContract - allMatches:', allMatches)
    console.log('useMatchContract - isLoadingMatches:', isLoadingMatches)

    // Read: Get user matches
    const { data: userMatches, refetch: refetchUserMatches } = useReadContract({
        address: addresses.matchContract,
        abi: MATCH_CONTRACT_ABI,
        functionName: 'getUserMatches',
        args: [address],
        query: { enabled: !!address },
    })

    // Write: Create match
    const { writeContractAsync: createMatchWrite, isPending: isCreatingMatch } = useWriteContract()

    const createMatch = async (title, description, gameType, entryStake, maxParticipants, votingDuration) => {
        try {
            const tx = await createMatchWrite({
                address: addresses.matchContract,
                abi: MATCH_CONTRACT_ABI,
                functionName: 'createMatch',
                args: [title, description, gameType, parseEther(entryStake), maxParticipants, votingDuration],
            })
            toast.success('Match created! Waiting for confirmation...')
            return tx
        } catch (error) {
            console.error('Create match error:', error)
            toast.error(error.shortMessage || 'Failed to create match')
            throw error
        }
    }

    // Write: Join match
    const { writeContractAsync: joinMatchWrite, isPending: isJoiningMatch } = useWriteContract()

    const joinMatch = async (matchId, entryStake) => {
        try {
            const tx = await joinMatchWrite({
                address: addresses.matchContract,
                abi: MATCH_CONTRACT_ABI,
                functionName: 'joinMatch',
                args: [matchId],
                value: parseEther(entryStake),
            })
            toast.success('Joining match! Waiting for confirmation...')
            return tx
        } catch (error) {
            console.error('Join match error:', error)
            toast.error(error.shortMessage || 'Failed to join match')
            throw error
        }
    }

    // Write: Start match
    const { writeContractAsync: startMatchWrite, isPending: isStartingMatch } = useWriteContract()

    const startMatch = async (matchId) => {
        try {
            const tx = await startMatchWrite({
                address: addresses.matchContract,
                abi: MATCH_CONTRACT_ABI,
                functionName: 'startMatch',
                args: [matchId],
            })
            toast.success('Starting match!')
            return tx
        } catch (error) {
            console.error('Start match error:', error)
            toast.error(error.shortMessage || 'Failed to start match')
            throw error
        }
    }

    // Write: Start voting phase
    const { writeContractAsync: startVotingWrite, isPending: isStartingVoting } = useWriteContract()

    const startVotingPhase = async (matchId) => {
        try {
            const tx = await startVotingWrite({
                address: addresses.matchContract,
                abi: MATCH_CONTRACT_ABI,
                functionName: 'startVotingPhase',
                args: [matchId],
            })
            toast.success('Voting phase started!')
            return tx
        } catch (error) {
            console.error('Start voting error:', error)
            toast.error(error.shortMessage || 'Failed to start voting')
            throw error
        }
    }

    // Helper to get single match as a hook
    const useGetMatch = (matchId) => {
        return useReadContract({
            address: addresses.matchContract,
            abi: MATCH_CONTRACT_ABI,
            functionName: 'getMatch',
            args: [matchId],
            query: { enabled: !!matchId },
        })
    }

    return {
        matchCounter,
        allMatches,
        userMatches,
        isLoadingMatches,
        createMatch,
        isCreatingMatch,
        joinMatch,
        isJoiningMatch,
        startMatch,
        isStartingMatch,
        startVotingPhase,
        isStartingVoting,
        useGetMatch,
        refetchMatches,
        refetchUserMatches,
        refetchCounter,
        contractAddress: addresses.matchContract,
    }
}

export default useMatchContract
