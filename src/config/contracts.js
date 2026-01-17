// Contract addresses - update these after deployment
export const CONTRACT_ADDRESSES = {
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


    export const TODO_ARENA_ABI = [
        {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
        },
        {
        "inputs": [],
        "name": "AccessControlBadConfirmation",
        "type": "error"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "account",
            "type": "address"
            },
            {
            "internalType": "bytes32",
            "name": "neededRole",
            "type": "bytes32"
            }
        ],
        "name": "AccessControlUnauthorizedAccount",
        "type": "error"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "spender",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "allowance",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "sender",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "approver",
            "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "sender",
            "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "spender",
            "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "owner",
            "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "account",
            "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
        },
        {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "bytes32",
            "name": "reportHash",
            "type": "bytes32"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
            }
        ],
        "name": "AIReportSubmitted",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "string",
            "name": "reason",
            "type": "string"
            }
        ],
        "name": "MatchCancelled",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "creator",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "string",
            "name": "title",
            "type": "string"
            },
            {
            "indexed": false,
            "internalType": "enum TodosArena.GameType",
            "name": "gameType",
            "type": "uint8"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "entryStake",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "maxParticipants",
            "type": "uint256"
            }
        ],
        "name": "MatchCreated",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "participantCount",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "totalPrizePool",
            "type": "uint256"
            }
        ],
        "name": "MatchStarted",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "enum TodosArena.MatchStatus",
            "name": "newStatus",
            "type": "uint8"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
            }
        ],
        "name": "MatchStatusChanged",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "participant",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "entryStakePaid",
            "type": "uint256"
            }
        ],
        "name": "ParticipantJoined",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "totalAmount",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "winnerCount",
            "type": "uint256"
            }
        ],
        "name": "RewardPoolCreated",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
            }
        ],
        "name": "RewardsClaimed",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "address[]",
            "name": "winners",
            "type": "address[]"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "totalAmount",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "amountPerWinner",
            "type": "uint256"
            }
        ],
        "name": "RewardsMinted",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
            },
            {
            "indexed": true,
            "internalType": "bytes32",
            "name": "previousAdminRole",
            "type": "bytes32"
            },
            {
            "indexed": true,
            "internalType": "bytes32",
            "name": "newAdminRole",
            "type": "bytes32"
            }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
            }
        ],
        "name": "RoleGranted",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
            }
        ],
        "name": "RoleRevoked",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            }
        ],
        "name": "TokensBurned",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "string",
            "name": "reason",
            "type": "string"
            }
        ],
        "name": "TokensMinted",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "voter",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "address[]",
            "name": "votedWinners",
            "type": "address[]"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
            }
        ],
        "name": "VoteCasted",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "address[]",
            "name": "winners",
            "type": "address[]"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "totalVotes",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "bool",
            "name": "consensusReached",
            "type": "bool"
            }
        ],
        "name": "VotingFinalized",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "address[]",
            "name": "participants",
            "type": "address[]"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "votingEndTime",
            "type": "uint256"
            }
        ],
        "name": "VotingSessionCreated",
        "type": "event"
        },
        {
        "inputs": [],
        "name": "BURNER_ROLE",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "CONSENSUS_THRESHOLD",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "DISTRIBUTOR_ROLE",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "MINTER_ROLE",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "ORACLE_ROLE",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "TOTAL_SUPPLY",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "VOTING_MANAGER_ROLE",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "VOTING_REWARD",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "owner",
            "type": "address"
            },
            {
            "internalType": "address",
            "name": "spender",
            "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "spender",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "account",
            "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "account",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
            }
        ],
        "name": "burnFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            }
        ],
        "name": "burnTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            },
            {
            "internalType": "string",
            "name": "_reason",
            "type": "string"
            }
        ],
        "name": "cancelMatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "claimAllRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "completeMatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "string",
            "name": "_title",
            "type": "string"
            },
            {
            "internalType": "string",
            "name": "_description",
            "type": "string"
            },
            {
            "internalType": "enum TodosArena.GameType",
            "name": "_gameType",
            "type": "uint8"
            },
            {
            "internalType": "uint256",
            "name": "_entryStake",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "_maxParticipants",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "_votingDuration",
            "type": "uint256"
            }
        ],
        "name": "createMatch",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            },
            {
            "internalType": "address[]",
            "name": "_winners",
            "type": "address[]"
            },
            {
            "internalType": "uint256",
            "name": "_totalPrizePool",
            "type": "uint256"
            }
        ],
        "name": "distributeRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "escrowAddress",
        "outputs": [
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "finalizeVoting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "getAllMatches",
        "outputs": [
            {
            "components": [
                {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
                },
                {
                "internalType": "address",
                "name": "creator",
                "type": "address"
                },
                {
                "internalType": "string",
                "name": "title",
                "type": "string"
                },
                {
                "internalType": "string",
                "name": "description",
                "type": "string"
                },
                {
                "internalType": "enum TodosArena.GameType",
                "name": "gameType",
                "type": "uint8"
                },
                {
                "internalType": "enum TodosArena.MatchStatus",
                "name": "status",
                "type": "uint8"
                },
                {
                "internalType": "uint256",
                "name": "entryStake",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "totalPrizePool",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "participantCount",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "maxParticipants",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "startedAt",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "votingStartTime",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "votingDuration",
                "type": "uint256"
                }
            ],
            "internalType": "struct TodosArena.MatchView[]",
            "name": "",
            "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "getFinalWinners",
        "outputs": [
            {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "getMatch",
        "outputs": [
            {
            "components": [
                {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
                },
                {
                "internalType": "address",
                "name": "creator",
                "type": "address"
                },
                {
                "internalType": "string",
                "name": "title",
                "type": "string"
                },
                {
                "internalType": "string",
                "name": "description",
                "type": "string"
                },
                {
                "internalType": "enum TodosArena.GameType",
                "name": "gameType",
                "type": "uint8"
                },
                {
                "internalType": "enum TodosArena.MatchStatus",
                "name": "status",
                "type": "uint8"
                },
                {
                "internalType": "uint256",
                "name": "entryStake",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "totalPrizePool",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "participantCount",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "maxParticipants",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "startedAt",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "votingStartTime",
                "type": "uint256"
                },
                {
                "internalType": "uint256",
                "name": "votingDuration",
                "type": "uint256"
                }
            ],
            "internalType": "struct TodosArena.MatchView",
            "name": "",
            "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "getMatchParticipants",
        "outputs": [
            {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "getMatchStatus",
        "outputs": [
            {
            "internalType": "enum TodosArena.MatchStatus",
            "name": "",
            "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "getParticipants",
        "outputs": [
            {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "_user",
            "type": "address"
            }
        ],
        "name": "getRewardBalance",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "getRewardPool",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "totalAmount",
            "type": "uint256"
            },
            {
            "internalType": "bool",
            "name": "distributed",
            "type": "bool"
            },
            {
            "internalType": "uint256",
            "name": "distributedAt",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "winnerCount",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
            }
        ],
        "name": "getRoleAdmin",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "_user",
            "type": "address"
            }
        ],
        "name": "getTotalEarned",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "getTotalRewardsDistributed",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "_user",
            "type": "address"
            }
        ],
        "name": "getUserMatches",
        "outputs": [
            {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "getVotingSession",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "totalVoters",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "votesReceived",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "votingEndTime",
            "type": "uint256"
            },
            {
            "internalType": "bool",
            "name": "finalized",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            },
            {
            "internalType": "address",
            "name": "_winner",
            "type": "address"
            }
        ],
        "name": "getWinnerVoteCount",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
            },
            {
            "internalType": "address",
            "name": "account",
            "type": "address"
            }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
            },
            {
            "internalType": "address",
            "name": "account",
            "type": "address"
            }
        ],
        "name": "hasRole",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            },
            {
            "internalType": "address",
            "name": "_voter",
            "type": "address"
            }
        ],
        "name": "hasVoted",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "account",
            "type": "address"
            }
        ],
        "name": "isMinter",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "joinMatch",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "matchCounter",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "name": "matches",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
            },
            {
            "internalType": "address",
            "name": "creator",
            "type": "address"
            },
            {
            "internalType": "string",
            "name": "title",
            "type": "string"
            },
            {
            "internalType": "string",
            "name": "description",
            "type": "string"
            },
            {
            "internalType": "enum TodosArena.GameType",
            "name": "gameType",
            "type": "uint8"
            },
            {
            "internalType": "enum TodosArena.MatchStatus",
            "name": "status",
            "type": "uint8"
            },
            {
            "internalType": "uint256",
            "name": "entryStake",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "totalPrizePool",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "maxParticipants",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "startedAt",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "votingStartTime",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "votingDuration",
            "type": "uint256"
            },
            {
            "internalType": "bytes32",
            "name": "aiReportHash",
            "type": "bytes32"
            },
            {
            "internalType": "bool",
            "name": "aiReportSubmitted",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "to",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            },
            {
            "internalType": "string",
            "name": "reason",
            "type": "string"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
            "internalType": "string",
            "name": "",
            "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "platformFeePercentage",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
            },
            {
            "internalType": "address",
            "name": "callerConfirmation",
            "type": "address"
            }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
            },
            {
            "internalType": "address",
            "name": "account",
            "type": "address"
            }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "name": "rewardPools",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "totalAmount",
            "type": "uint256"
            },
            {
            "internalType": "bool",
            "name": "distributed",
            "type": "bool"
            },
            {
            "internalType": "uint256",
            "name": "distributedAt",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "startMatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            }
        ],
        "name": "startVotingPhase",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            },
            {
            "internalType": "bytes32",
            "name": "_reportHash",
            "type": "bytes32"
            }
        ],
        "name": "submitAIReport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "_matchId",
            "type": "uint256"
            },
            {
            "internalType": "address[]",
            "name": "_winnerAddresses",
            "type": "address[]"
            }
        ],
        "name": "submitVote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
            "internalType": "string",
            "name": "",
            "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            }
        ],
        "name": "totalEarned",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "totalRewardsDistributed",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "to",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "from",
            "type": "address"
            },
            {
            "internalType": "address",
            "name": "to",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "name": "userMatches",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            }
        ],
        "name": "userRewardBalance",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            },
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            }
        ],
        "name": "votes",
        "outputs": [
            {
            "internalType": "address",
            "name": "voter",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
            },
            {
            "internalType": "bool",
            "name": "verified",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "name": "votingSessions",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "votesReceived",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "votingEndTime",
            "type": "uint256"
            },
            {
            "internalType": "bool",
            "name": "finalized",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            },
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            }
        ],
        "name": "winnerVoteCounts",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        }
    ]

// Game types enum
export const GAME_TYPES = {
    INDOOR: 0,
    OUTDOOR: 1,
    ONLINE: 2,
    OFFLINE: 3,
    HYBRID: 4,
}

export const GAME_TYPE_NAMES = {
    0: 'Indoor',
    1: 'Outdoor',
    2: 'Online',
    3: 'Offline',
    4: 'Hybrid',
}

export const GAME_TYPE_ICONS = {
    0: '🏀',
    1: '🏃',
    2: '🎮',
    3: '🎯',
    4: '🔄',
}

// Match statuses
export const MATCH_STATUS = {
    CREATED: 0,
    ACTIVE: 1,
    VOTING: 2,
    COMPLETED: 3,
    CANCELLED: 4,
}

export const MATCH_STATUS_NAMES = {
    0: 'Open',
    1: 'Active',
    2: 'Voting',
    3: 'Completed',
    4: 'Cancelled',
}

export const MATCH_STATUS_COLORS = {
    0: 'bg-green-500',
    1: 'bg-blue-500',
    2: 'bg-yellow-500',
    3: 'bg-purple-500',
    4: 'bg-red-500',
}
