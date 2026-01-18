#!/bin/bash

test_networks=("sepolia" "arbitrumSepolia" "lineaSepolia" "polygonAmoy" "baseSepolia" "blastSepolia" "optimismSepolia" "palmTestnet" "avalancheFuji" "zkSyncSepolia" "bscTestnet" "unichainSepolia" "swellchainTestnet" "scrollSepolia" "opBNBTestnet" "mantleSepolia")

for network in "${test_networks[@]}"; do
    echo "Deploying to $network"
    npx hardhat run scripts/deploy.cjs --network $network || echo "Deployment failed on $network, skipping"
done