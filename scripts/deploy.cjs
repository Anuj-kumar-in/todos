const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying contracts...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

    const chainId = hre.network.config.chainId;

    let todosArenaAddress = null;
    let relayerAddress = null;

    // Deploy TodosArena first (it's the token contract that Relayer needs)
    todosArenaAddress = process.env.VITE_TODOS_ARENA_ADDRESS;

    // Deploy Relayer with TodosArena address as the token
    console.log("Deploying Relayer contract...");
    const Relayer = await hre.ethers.getContractFactory("Relayer");
    const relayer = await Relayer.deploy(deployer.address, deployer.address, todosArenaAddress);
    await relayer.waitForDeployment();
    relayerAddress = await relayer.getAddress();
    console.log("Relayer deployed at:", relayerAddress);

    console.log("🎉 Deployment completed!");
    console.log("Contract Addresses:");
    if (todosArenaAddress) console.log("TodosArena:", todosArenaAddress);
    console.log("Relayer:", relayerAddress);

    const fs = require("fs");
    const addresses = {
        todosArena: todosArenaAddress,
        relayer: relayerAddress,
        network: hre.network.name,
        deployer: deployer.address,
        deployedAt: new Date().toISOString(),
        chainId: chainId,
        rpcUrl: hre.network.config.url
    };

    fs.writeFileSync(
        "deployed-addresses.json",
        JSON.stringify(addresses, null, 2)
    );
    console.log("Addresses saved to deployed-addresses.json");

    // Update .env file with the deployed addresses
    const networkToEnv = {
        sepolia: { todosArena: 'VITE_TODOS_ARENA_ADDRESS', relayer: 'VITE_SEPOLIA_RELAYER_ADDRESS' },
        arbitrum: { relayer: 'VITE_ARBITRUM_RELAYER_ADDRESS' },
        arbitrumSepolia: { relayer: 'VITE_ARBITRUM_SEPOLIA_RELAYER_ADDRESS' },
        optimism: { relayer: 'VITE_OPTIMISM_RELAYER_ADDRESS' },
        optimismSepolia: { relayer: 'VITE_OPTIMISM_SEPOLIA_RELAYER_ADDRESS' },
        polygon: { relayer: 'VITE_POLYGON_RELAYER_ADDRESS' },
        polygonAmoy: { relayer: 'VITE_POLYGON_AMOY_RELAYER_ADDRESS' },
        base: { relayer: 'VITE_BASE_RELAYER_ADDRESS' },
        baseSepolia: { relayer: 'VITE_BASE_SEPOLIA_RELAYER_ADDRESS' },
        blast: { relayer: 'VITE_BLAST_RELAYER_ADDRESS' },
        blastSepolia: { relayer: 'VITE_BLAST_SEPOLIA_RELAYER_ADDRESS' },
        linea: { relayer: 'VITE_LINEA_RELAYER_ADDRESS' },
        lineaSepolia: { relayer: 'VITE_LINEA_SEPOLIA_RELAYER_ADDRESS' },
        scroll: { relayer: 'VITE_SCROLL_RELAYER_ADDRESS' },
        scrollSepolia: { relayer: 'VITE_SCROLL_SEPOLIA_RELAYER_ADDRESS' },
        zkSync: { relayer: 'VITE_ZKSYNC_RELAYER_ADDRESS' },
        zkSyncSepolia: { relayer: 'VITE_ZKSYNC_SEPOLIA_RELAYER_ADDRESS' },
        bsc: { relayer: 'VITE_BSC_RELAYER_ADDRESS' },
        bscTestnet: { relayer: 'VITE_BSC_TESTNET_RELAYER_ADDRESS' },
        avalanche: { relayer: 'VITE_AVALANCHE_RELAYER_ADDRESS' },
        avalancheFuji: { relayer: 'VITE_AVALANCHE_FUJI_RELAYER_ADDRESS' },
        mantle: { relayer: 'VITE_MANTLE_RELAYER_ADDRESS' },
        mantleSepolia: { relayer: 'VITE_MANTLE_SEPOLIA_RELAYER_ADDRESS' },
        celo: { relayer: 'VITE_CELO_RELAYER_ADDRESS' },
        // Add more as needed
    };

    const envVars = networkToEnv[hre.network.name];
    if (envVars) {
        const envPath = '.env';
        let envContent = fs.readFileSync(envPath, 'utf8');

        if (envVars.relayer && relayerAddress) {
            const regex = new RegExp(`^${envVars.relayer}=.*$`, 'm');
            envContent = envContent.replace(regex, `${envVars.relayer}=${relayerAddress}`);
            console.log(`Updated ${envVars.relayer} in .env with ${relayerAddress}`);
        }

        if (envVars.todosArena && todosArenaAddress) {
            const regex = new RegExp(`^${envVars.todosArena}=.*$`, 'm');
            envContent = envContent.replace(regex, `${envVars.todosArena}=${todosArenaAddress}`);
            console.log(`Updated ${envVars.todosArena} in .env with ${todosArenaAddress}`);
        }

        fs.writeFileSync(envPath, envContent);
    } else {
        console.log(`No env var mapping for network ${hre.network.name}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
