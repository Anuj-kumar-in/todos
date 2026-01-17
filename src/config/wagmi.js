import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { mainnet, sepolia, hardhat, arbitrumSepolia, linea, lineaSepolia, polygon, polygonAmoy, base, baseSepolia, blast, blastSepolia, optimism, optimismSepolia, arbitrum, palm, palmTestnet, avalanche, avalancheFuji, starknet, starknetSepolia, celo, zkSync, zkSyncSepolia, bsc, bscTestnet, unichain, unichainSepolia, swellchain, swellchainTestnet, scroll, scrollSepolia, opBNB, opBNBTestnet, mantle, mantleSepolia } from 'wagmi/chains'


const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

export const config = getDefaultConfig({
    appName: 'todosArena',
    projectId: projectId,
    chains: [sepolia, mainnet, hardhat, arbitrumSepolia, linea, lineaSepolia, polygon, polygonAmoy, base, baseSepolia, blast, blastSepolia, optimism, optimismSepolia, arbitrum, palm, palmTestnet, avalanche, avalancheFuji, starknet, starknetSepolia, celo, zkSync, zkSyncSepolia, bsc, bscTestnet, unichain, unichainSepolia, swellchain, swellchainTestnet, scroll, scrollSepolia, opBNB, opBNBTestnet, mantle, mantleSepolia],
    transports: {
        [sepolia.id]: http(import.meta.env.SEPOLIA_RPC_URL),
        [mainnet.id]: http(import.meta.env.MAINNET_RPC_URL),
        [hardhat.id]: http('http://127.0.0.1:8545'),
        [arbitrumSepolia.id]: http(import.meta.env.ARBITRUM_SEPOLIA_RPC_URL),
        [linea.id]: http(import.meta.env.LINEA_RPC_URL),
        [lineaSepolia.id]: http(import.meta.env.LINEA_SEPOLIA_RPC_URL),
        [polygon.id]: http(import.meta.env.POLYGON_RPC_URL),
        [polygonAmoy.id]: http(import.meta.env.POLYGON_AMOY_RPC_URL),
        [base.id]: http(import.meta.env.BASE_RPC_URL),
        [baseSepolia.id]: http(import.meta.env.BASE_SEPOLIA_RPC_URL),
        [blast.id]: http(import.meta.env.BLAST_RPC_URL),
        [blastSepolia.id]: http(import.meta.env.BLAST_SEPOLIA_RPC_URL),
        [optimism.id]: http(import.meta.env.OPTIMISM_RPC_URL),
        [optimismSepolia.id]: http(import.meta.env.OPTIMISM_SEPOLIA_RPC_URL),
        [arbitrum.id]: http(import.meta.env.ARBITRUM_RPC_URL),
        [palm.id]: http(import.meta.env.PALM_RPC_URL),
        [palmTestnet.id]: http(import.meta.env.PALM_TESTNET_RPC_URL),
        [avalanche.id]: http(import.meta.env.AVALANCHE_RPC_URL),
        [avalancheFuji.id]: http(import.meta.env.AVALANCHE_FUJI_RPC_URL),
        [starknet.id]: http(import.meta.env.STARKNET_RPC_URL),
        [starknetSepolia.id]: http(import.meta.env.STARKNET_SEPOLIA_RPC_URL),
        [celo.id]: http(import.meta.env.CELO_RPC_URL),
        [zkSync.id]: http(import.meta.env.ZKSYNC_RPC_URL),
        [zkSyncSepolia.id]: http(import.meta.env.ZKSYNC_SEPOLIA_RPC_URL),
        [bsc.id]: http(import.meta.env.BSC_RPC_URL),
        [bscTestnet.id]: http(import.meta.env.BSC_TESTNET_RPC_URL),
        [unichain.id]: http(import.meta.env.UNICHAIN_RPC_URL),
        [unichainSepolia.id]: http(import.meta.env.UNICHAIN_SEPOLIA_RPC_URL),
        [swellchain.id]: http(import.meta.env.SWELLCHAIN_RPC_URL),
        [swellchainTestnet.id]: http(import.meta.env.SWELLCHAIN_TESTNET_RPC_URL),
        [scroll.id]: http(import.meta.env.SCROLL_RPC_URL),
        [scrollSepolia.id]: http(import.meta.env.SCROLL_SEPOLIA_RPC_URL),
        [opBNB.id]: http(import.meta.env.OPBNB_RPC_URL),
        [opBNBTestnet.id]: http(import.meta.env.OPBNB_TESTNET_RPC_URL),
        [mantle.id]: http(import.meta.env.MANTLE_RPC_URL),
        [mantleSepolia.id]: http(import.meta.env.MANTLE_SEPOLIA_RPC_URL),
    },
    ssr: true, // Enable SSR
    initialChain: sepolia.id, // Default to Sepolia testnet
})

// Contract addresses from environment
export const getContractAddresses = (chainId) => {
    const addresses = {
        // Sepolia testnet
        11155111: {
            todosArena: import.meta.env.SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Arbitrum Sepolia testnet
        421614: {
            todosArena: import.meta.env.ARBITRUM_SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Linea mainnet
        59144: {
            todosArena: import.meta.env.LINEA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Linea Sepolia testnet
        59141: {
            todosArena: import.meta.env.LINEA_SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Polygon mainnet
        137: {
            todosArena: import.meta.env.POLYGON_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Polygon Amoy testnet
        80002: {
            todosArena: import.meta.env.POLYGON_AMOY_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Base mainnet
        8453: {
            todosArena: import.meta.env.BASE_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Base Sepolia testnet
        84532: {
            todosArena: import.meta.env.BASE_SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Blast mainnet
        81457: {
            todosArena: import.meta.env.BLAST_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Blast Sepolia testnet
        168587773: {
            todosArena: import.meta.env.BLAST_SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Optimism mainnet
        10: {
            todosArena: import.meta.env.OPTIMISM_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Optimism Sepolia testnet
        11155420: {
            todosArena: import.meta.env.OPTIMISM_SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Arbitrum mainnet
        42161: {
            todosArena: import.meta.env.ARBITRUM_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Palm mainnet
        11297108109: {
            todosArena: import.meta.env.PALM_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Palm testnet
        11297108099: {
            todosArena: import.meta.env.PALM_TESTNET_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Avalanche mainnet
        43114: {
            todosArena: import.meta.env.AVALANCHE_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Avalanche Fuji testnet
        43113: {
            todosArena: import.meta.env.AVALANCHE_FUJI_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Starknet mainnet
        1: {
            todosArena: import.meta.env.STARKNET_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Starknet Sepolia testnet
        1: {
            todosArena: import.meta.env.STARKNET_SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Celo mainnet
        42220: {
            todosArena: import.meta.env.CELO_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // zkSync mainnet
        324: {
            todosArena: import.meta.env.ZKSYNC_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // zkSync Sepolia testnet
        300: {
            todosArena: import.meta.env.ZKSYNC_SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // BSC mainnet
        56: {
            todosArena: import.meta.env.BSC_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // BSC testnet
        97: {
            todosArena: import.meta.env.BSC_TESTNET_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Unichain mainnet
        1: {
            todosArena: import.meta.env.UNICHAIN_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Unichain Sepolia testnet
        1: {
            todosArena: import.meta.env.UNICHAIN_SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Swellchain mainnet
        1: {
            todosArena: import.meta.env.SWELLCHAIN_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Swellchain testnet
        1: {
            todosArena: import.meta.env.SWELLCHAIN_TESTNET_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Scroll mainnet
        534352: {
            todosArena: import.meta.env.SCROLL_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Scroll Sepolia testnet
        534351: {
            todosArena: import.meta.env.SCROLL_SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // opBNB mainnet
        204: {
            todosArena: import.meta.env.OPBNB_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // opBNB testnet
        5611: {
            todosArena: import.meta.env.OPBNB_TESTNET_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Mantle mainnet
        5000: {
            todosArena: import.meta.env.MANTLE_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Mantle Sepolia testnet
        5003: {
            todosArena: import.meta.env.MANTLE_SEPOLIA_TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        // Hardhat local
        31337: {
            todosArena: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        },
        // Mainnet
        1: {
            todosArena: import.meta.env.TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
    }
    return addresses[chainId] || addresses[11155111]
}

export const supportedChains = [
    { id: sepolia.id, name: 'Sepolia Testnet', icon: '🔷', isTestnet: true },
    { id: mainnet.id, name: 'Ethereum Mainnet', icon: '⟠', isTestnet: false },
    { id: arbitrumSepolia.id, name: 'Arbitrum Sepolia', icon: '🔶', isTestnet: true },
    { id: linea.id, name: 'Linea Mainnet', icon: '🟢', isTestnet: false },
    { id: lineaSepolia.id, name: 'Linea Sepolia', icon: '🟡', isTestnet: true },
    { id: polygon.id, name: 'Polygon Mainnet', icon: '🟣', isTestnet: false },
    { id: polygonAmoy.id, name: 'Polygon Amoy', icon: '🟤', isTestnet: true },
    { id: base.id, name: 'Base Mainnet', icon: '🔵', isTestnet: false },
    { id: baseSepolia.id, name: 'Base Sepolia', icon: '🔴', isTestnet: true },
    { id: blast.id, name: 'Blast Mainnet', icon: '🟠', isTestnet: false },
    { id: blastSepolia.id, name: 'Blast Sepolia', icon: '🟣', isTestnet: true },
    { id: optimism.id, name: 'Optimism Mainnet', icon: '🔴', isTestnet: false },
    { id: optimismSepolia.id, name: 'Optimism Sepolia', icon: '🟡', isTestnet: true },
    { id: arbitrum.id, name: 'Arbitrum Mainnet', icon: '🔵', isTestnet: false },
    { id: palm.id, name: 'Palm Mainnet', icon: '🟢', isTestnet: false },
    { id: palmTestnet.id, name: 'Palm Testnet', icon: '🟡', isTestnet: true },
    { id: avalanche.id, name: 'Avalanche Mainnet', icon: '🔴', isTestnet: false },
    { id: avalancheFuji.id, name: 'Avalanche Fuji', icon: '🟡', isTestnet: true },
    { id: starknet.id, name: 'Starknet Mainnet', icon: '🟣', isTestnet: false },
    { id: starknetSepolia.id, name: 'Starknet Sepolia', icon: '🟤', isTestnet: true },
    { id: celo.id, name: 'Celo Mainnet', icon: '🟢', isTestnet: false },
    { id: zkSync.id, name: 'zkSync Mainnet', icon: '🔵', isTestnet: false },
    { id: zkSyncSepolia.id, name: 'zkSync Sepolia', icon: '🔴', isTestnet: true },
    { id: bsc.id, name: 'BSC Mainnet', icon: '🟠', isTestnet: false },
    { id: bscTestnet.id, name: 'BSC Testnet', icon: '🟡', isTestnet: true },
    { id: unichain.id, name: 'Unichain Mainnet', icon: '🟣', isTestnet: false },
    { id: unichainSepolia.id, name: 'Unichain Sepolia', icon: '🟤', isTestnet: true },
    { id: swellchain.id, name: 'Swellchain Mainnet', icon: '🟢', isTestnet: false },
    { id: swellchainTestnet.id, name: 'Swellchain Testnet', icon: '🟡', isTestnet: true },
    { id: scroll.id, name: 'Scroll Mainnet', icon: '🔵', isTestnet: false },
    { id: scrollSepolia.id, name: 'Scroll Sepolia', icon: '🔴', isTestnet: true },
    { id: opBNB.id, name: 'opBNB Mainnet', icon: '🟠', isTestnet: false },
    { id: opBNBTestnet.id, name: 'opBNB Testnet', icon: '🟡', isTestnet: true },
    { id: mantle.id, name: 'Mantle Mainnet', icon: '🟣', isTestnet: false },
    { id: mantleSepolia.id, name: 'Mantle Sepolia', icon: '🟤', isTestnet: true },
]
