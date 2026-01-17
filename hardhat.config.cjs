require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            },
            viaIR: true  // Enable IR-based code generation to fix stack depth issues
        }
    },
    networks: {
        hardhat: {
            chainId: 31337
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337
        },
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL || "https://sepolia.drpc.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11155111
        },
        arbitrumSepolia: {
            url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://arbitrum-sepolia.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 421614
        },
        linea: {
            url: process.env.LINEA_RPC_URL || "https://linea-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 59144
        },
        lineaSepolia: {
            url: process.env.LINEA_SEPOLIA_RPC_URL || "https://linea-sepolia.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 59141
        },
        polygon: {
            url: process.env.POLYGON_RPC_URL || "https://polygon-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 137
        },
        polygonAmoy: {
            url: process.env.POLYGON_AMOY_RPC_URL || "https://polygon-amoy.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 80002
        },
        base: {
            url: process.env.BASE_RPC_URL || "https://base-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 8453
        },
        baseSepolia: {
            url: process.env.BASE_SEPOLIA_RPC_URL || "https://base-sepolia.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 84532
        },
        blast: {
            url: process.env.BLAST_RPC_URL || "https://blast-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 81457
        },
        blastSepolia: {
            url: process.env.BLAST_SEPOLIA_RPC_URL || "https://blast-sepolia.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 168587773
        },
        optimism: {
            url: process.env.OPTIMISM_RPC_URL || "https://optimism-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 10
        },
        optimismSepolia: {
            url: process.env.OPTIMISM_SEPOLIA_RPC_URL || "https://optimism-sepolia.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11155420
        },
        arbitrum: {
            url: process.env.ARBITRUM_RPC_URL || "https://arbitrum-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 42161
        },
        palm: {
            url: process.env.PALM_RPC_URL || "https://palm-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11297108109
        },
        palmTestnet: {
            url: process.env.PALM_TESTNET_RPC_URL || "https://palm-testnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11297108099
        },
        avalanche: {
            url: process.env.AVALANCHE_RPC_URL || "https://avalanche-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 43114
        },
        avalancheFuji: {
            url: process.env.AVALANCHE_FUJI_RPC_URL || "https://avalanche-fuji.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 43113
        },
        starknet: {
            url: process.env.STARKNET_RPC_URL || "https://starknet-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1
        },
        starknetSepolia: {
            url: process.env.STARKNET_SEPOLIA_RPC_URL || "https://starknet-sepolia.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1
        },
        celo: {
            url: process.env.CELO_RPC_URL || "https://celo-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 42220
        },
        zkSync: {
            url: process.env.ZKSYNC_RPC_URL || "https://zksync-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 324
        },
        zkSyncSepolia: {
            url: process.env.ZKSYNC_SEPOLIA_RPC_URL || "https://zksync-sepolia.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 300
        },
        bsc: {
            url: process.env.BSC_RPC_URL || "https://bsc-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 56
        },
        bscTestnet: {
            url: process.env.BSC_TESTNET_RPC_URL || "https://bsc-testnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 97
        },
        unichain: {
            url: process.env.UNICHAIN_RPC_URL || "https://unichain-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1
        },
        unichainSepolia: {
            url: process.env.UNICHAIN_SEPOLIA_RPC_URL || "https://unichain-sepolia.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1
        },
        swellchain: {
            url: process.env.SWELLCHAIN_RPC_URL || "https://swellchain-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1
        },
        swellchainTestnet: {
            url: process.env.SWELLCHAIN_TESTNET_RPC_URL || "https://swellchain-testnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1
        },
        scroll: {
            url: process.env.SCROLL_RPC_URL || "https://scroll-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 534352
        },
        scrollSepolia: {
            url: process.env.SCROLL_SEPOLIA_RPC_URL || "https://scroll-sepolia.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 534351
        },
        opBNB: {
            url: process.env.OPBNB_RPC_URL || "https://opbnb-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 204
        },
        opBNBTestnet: {
            url: process.env.OPBNB_TESTNET_RPC_URL || "https://opbnb-testnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 5611
        },
        mantle: {
            url: process.env.MANTLE_RPC_URL || "https://mantle-mainnet.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 5000
        },
        mantleSepolia: {
            url: process.env.MANTLE_SEPOLIA_RPC_URL || "https://mantle-sepolia.infura.io/v3/9a06dc3f8b30448f8c0d3e9b01a24939",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 5003
        },
        ethereum: {
            url: process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    }
};
