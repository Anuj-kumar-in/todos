# todosArena

A decentralized sports/games management platform with AI-powered verification, community voting, and blockchain-secured token rewards.

## Features

- 🎮 **Multi-Game Support**: Supports online games, outdoor athletics, and indoor sports.
- 🤖 **AI Verification**: Uses  AI to detect winners via camera or screenshot proof.
- 🗳️ **Community Voting**: All players can vote on results to ensure transparency.
- 🪙 **Token Rewards**: Winners receive crypto on the blockchain as rewards.
- 📍 **Location-Based**: Find and join outdoor games near your location.
- ⛓️ **Blockchain Secured**: All data is stored on the Ethereum blockchain for transparency and security.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or any Web3 wallet
- Access to the Gemini AI API

### Installation

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Run development server
npm run dev
```

### Smart Contracts

```bash
# Compile smart contracts
npx hardhat compile

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to Arbitrum Sepolia
npx hardhat run scripts/deploy.cjs --network arbitrumSepolia
```

## Environment Setup

Copy `.env.example` to `.env` and fill in the following variables:

- `PRIVATE_KEY`: Your wallet private key for deployment.
- `VITE_WALLETCONNECT_PROJECT_ID`: Obtain this from WalletConnect Cloud.
- `GEMINI_API_KEY`: Required for AI detection features.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Web3**: wagmi, RainbowKit, ethers.js
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **AI**: Gemini AI API

## Project Structure

```
├── contracts/          # Solidity smart contracts
├── scripts/            # Deployment scripts
├── src/
│   ├── components/     # React components
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom hooks
│   └── config/         # Configuration
└── public/             # Static assets
```

## Usage

1. **Create a Match**: Navigate to the "Create Match" page and fill in the details.
2. **Join a Match**: Browse available matches and join one.
3. **Submit Proof**: Upload a screenshot or use the camera to submit proof of your win.
4. **Vote**: Participate in community voting to verify results.
5. **Claim Rewards**: Winners can claim Crypto.


## License

This project is licensed under the MIT License.
