import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { mainnet, sepolia, hardhat, arbitrumSepolia } from 'wagmi/chains'

// Get WalletConnect project ID from environment or use demo ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

export const config = getDefaultConfig({
    appName: 'todosArena',
    projectId: projectId,
    chains: [sepolia, mainnet, hardhat, arbitrumSepolia],
    transports: {
        [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL || "https://sepolia.drpc.org"),
        [mainnet.id]: http(),
        [hardhat.id]: http('http://127.0.0.1:8545'),
        [arbitrumSepolia.id]: http(import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC_URL || "https://arbitrum-sepolia.drpc.org"),
    },
    ssr: true, // Enable SSR
    initialChain: sepolia.id, // Default to Sepolia testnet
})

// Contract addresses from environment
export const getContractAddresses = (chainId) => {
    const addresses = {
        // Sepolia testnet
        11155111: {
            todoToken: import.meta.env.VITE_TODO_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
            matchContract: import.meta.env.VITE_MATCH_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
            votingContract: import.meta.env.VITE_VOTING_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
            rewardDistribution: import.meta.env.VITE_REWARD_DISTRIBUTION_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Arbitrum Sepolia testnet
        421614: {
            todoToken: import.meta.env.VITE_TODO_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
            matchContract: import.meta.env.VITE_MATCH_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
            votingContract: import.meta.env.VITE_VOTING_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
            rewardDistribution: import.meta.env.VITE_REWARD_DISTRIBUTION_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Hardhat local
        31337: {
            todoToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            matchContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
            votingContract: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
            rewardDistribution: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
        },
        // Mainnet
        1: {
            todoToken: import.meta.env.VITE_TODO_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
            matchContract: import.meta.env.VITE_MATCH_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
            votingContract: import.meta.env.VITE_VOTING_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
            rewardDistribution: import.meta.env.VITE_REWARD_DISTRIBUTION_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
    }
    return addresses[chainId] || addresses[11155111]
}

export const supportedChains = [
    { id: sepolia.id, name: 'Sepolia Testnet', icon: '🔷', isTestnet: true },
    { id: mainnet.id, name: 'Ethereum Mainnet', icon: '⟠', isTestnet: false },
    { id: arbitrumSepolia.id, name: 'Arbitrum Sepolia', icon: '🔶', isTestnet: true },
]
