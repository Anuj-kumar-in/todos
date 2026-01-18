export const CONTRACT_ADDRESSES = {
  // ==================== PRIMARY NETWORK (Source of Truth) ====================
  // Deploy TodosArena ONLY on primary network
  primary: {
    todosArena: import.meta.env.TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000'
  },

  // ==================== ETHEREUM MAINNET ====================
  1: {
    todosArena: import.meta.env.TODOS_ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== ETHEREUM SEPOLIA TESTNET ====================
  11155111: {
    relayer: import.meta.env.SEPOLIA_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== ARBITRUM MAINNET ====================
  42161: {
    relayer: import.meta.env.ARBITRUM_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== ARBITRUM SEPOLIA TESTNET ====================
  421614: {
    relayer: import.meta.env.ARBITRUM_SEPOLIA_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== OPTIMISM MAINNET ====================
  10: {
    relayer: import.meta.env.OPTIMISM_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== OPTIMISM SEPOLIA TESTNET ====================
  11155420: {
    relayer: import.meta.env.OPTIMISM_SEPOLIA_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== POLYGON MAINNET ====================
  137: {
    relayer: import.meta.env.POLYGON_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== POLYGON AMOY TESTNET ====================
  80002: {
    relayer: import.meta.env.POLYGON_AMOY_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== BASE MAINNET ====================
  8453: {
    relayer: import.meta.env.BASE_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== BASE SEPOLIA TESTNET ====================
  84532: {
    relayer: import.meta.env.BASE_SEPOLIA_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== BLAST MAINNET ====================
  81457: {
    relayer: import.meta.env.BLAST_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== BLAST SEPOLIA TESTNET ====================
  168587773: {
    relayer: import.meta.env.BLAST_SEPOLIA_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== LINEA MAINNET ====================
  59144: {
    relayer: import.meta.env.LINEA_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== LINEA SEPOLIA TESTNET ====================
  59141: {
    relayer: import.meta.env.LINEA_SEPOLIA_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== SCROLL MAINNET ====================
  534352: {
    relayer: import.meta.env.SCROLL_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== SCROLL SEPOLIA TESTNET ====================
  534351: {
    relayer: import.meta.env.SCROLL_SEPOLIA_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== ZKSYNC MAINNET ====================
  324: {
    relayer: import.meta.env.ZKSYNC_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== ZKSYNC SEPOLIA TESTNET ====================
  300: {
    relayer: import.meta.env.ZKSYNC_SEPOLIA_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== BSC MAINNET ====================
  56: {
    relayer: import.meta.env.BSC_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== BSC TESTNET ====================
  97: {
    relayer: import.meta.env.BSC_TESTNET_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== AVALANCHE MAINNET ====================
  43114: {
    relayer: import.meta.env.AVALANCHE_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== AVALANCHE FUJI TESTNET ====================
  43113: {
    relayer: import.meta.env.AVALANCHE_FUJI_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== MANTLE MAINNET ====================
  5000: {
    relayer: import.meta.env.MANTLE_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== MANTLE SEPOLIA TESTNET ====================
  5003: {
    relayer: import.meta.env.MANTLE_SEPOLIA_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== CELO MAINNET ====================
  42220: {
    relayer: import.meta.env.CELO_RELAYER_ADDRESS || '0x0000000000000000000000000000000000000000',
  },

  // ==================== HARDHAT LOCAL ====================
  31337: {
    todosArena: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    relayer: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
}

// ==================== ACCOUNT ADDRESSES ====================
export const ACCOUNTS = {
  ADMIN: import.meta.env.ADMIN_ADDRESS || '0x0000000000000000000000000000000000000000',     // Has BRIDGE_ROLE on TodosArena
  DEPLOYER: import.meta.env.DEPLOYER_ADDRESS || '0x0000000000000000000000000000000000000000', // Receives stakes from users
}

// ==================== NETWORK NAMES ====================
export const NETWORK_NAMES = {
  1: 'Ethereum',
  11155111: 'Ethereum Sepolia',
  42161: 'Arbitrum One',
  421614: 'Arbitrum Sepolia',
  10: 'Optimism',
  11155420: 'Optimism Sepolia',
  137: 'Polygon',
  80002: 'Polygon Amoy',
  8453: 'Base',
  84532: 'Base Sepolia',
  81457: 'Blast',
  168587773: 'Blast Sepolia',
  59144: 'Linea',
  59141: 'Linea Sepolia',
  534352: 'Scroll',
  534351: 'Scroll Sepolia',
  324: 'zkSync',
  300: 'zkSync Sepolia',
  56: 'BSC',
  97: 'BSC Testnet',
  43114: 'Avalanche',
  43113: 'Avalanche Fuji',
  5000: 'Mantle',
  5003: 'Mantle Sepolia',
  42220: 'Celo',
  31337: 'Hardhat Local',
}

// ==================== DEPLOYMENT CONFIGURATION ====================
// Use this to determine which contract to use for each network
export const getContractAddresses = (chainId) => {
  const addresses = CONTRACT_ADDRESSES[chainId]
  
  if (!addresses) {
    console.warn(`No contract addresses configured for chain ${chainId}`)
    return {
      todosArena: undefined,
      relayer: undefined,
    }
  }

  return {
    todosArena: addresses.todosArena || CONTRACT_ADDRESSES.primary?.todosArena,
    relayer: addresses.relayer || undefined,
  }
}

// Check if chain is primary network
export const isPrimaryNetwork = (chainId) => {
  return chainId === 1 // Ethereum Mainnet is primary
}

// Check if Relayer is deployed on this chain
export const hasRelayer = (chainId) => {
  return !!CONTRACT_ADDRESSES[chainId]?.relayer
}

// Get primary network TODO Arena address
export const getPrimaryTodosArena = () => {
  return CONTRACT_ADDRESSES.primary?.todosArena || '0x0000000000000000000000000000000000000000'
}