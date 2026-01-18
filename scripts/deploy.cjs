const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying contracts...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

    const chainId = hre.network.config.chainId;

    let todosArenaAddress = null;
    let relayerAddress = null;

    // Deploy Relayer on all networks
    console.log("Deploying Relayer contract...");
    const Relayer = await hre.ethers.getContractFactory("Relayer");
    const relayer = await Relayer.deploy(deployer.address, deployer.address);
    await relayer.waitForDeployment();
    relayerAddress = await relayer.getAddress();
    console.log("Relayer deployed at:", relayerAddress);

    // Deploy TodosArena on all networks
    console.log("Deploying TodosArena contract...");
    const TodosArena = await hre.ethers.getContractFactory("TodosArena");
    const todosArena = await TodosArena.deploy();
    await todosArena.waitForDeployment();
    todosArenaAddress = await todosArena.getAddress();
    console.log("TodosArena deployed at:", todosArenaAddress);

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
        sepolia: { todosArena: 'TODOS_ARENA_ADDRESS', relayer: 'SEPOLIA_RELAYER_ADDRESS' },
        arbitrum: { relayer: 'ARBITRUM_RELAYER_ADDRESS' },
        arbitrumSepolia: { relayer: 'ARBITRUM_SEPOLIA_RELAYER_ADDRESS' },
        optimism: { relayer: 'OPTIMISM_RELAYER_ADDRESS' },
        optimismSepolia: { relayer: 'OPTIMISM_SEPOLIA_RELAYER_ADDRESS' },
        polygon: { relayer: 'POLYGON_RELAYER_ADDRESS' },
        polygonAmoy: { relayer: 'POLYGON_AMOY_RELAYER_ADDRESS' },
        base: { relayer: 'BASE_RELAYER_ADDRESS' },
        baseSepolia: { relayer: 'BASE_SEPOLIA_RELAYER_ADDRESS' },
        blast: { relayer: 'BLAST_RELAYER_ADDRESS' },
        blastSepolia: { relayer: 'BLAST_SEPOLIA_RELAYER_ADDRESS' },
        linea: { relayer: 'LINEA_RELAYER_ADDRESS' },
        lineaSepolia: { relayer: 'LINEA_SEPOLIA_RELAYER_ADDRESS' },
        scroll: { relayer: 'SCROLL_RELAYER_ADDRESS' },
        scrollSepolia: { relayer: 'SCROLL_SEPOLIA_RELAYER_ADDRESS' },
        zkSync: { relayer: 'ZKSYNC_RELAYER_ADDRESS' },
        zkSyncSepolia: { relayer: 'ZKSYNC_SEPOLIA_RELAYER_ADDRESS' },
        bsc: { relayer: 'BSC_RELAYER_ADDRESS' },
        bscTestnet: { relayer: 'BSC_TESTNET_RELAYER_ADDRESS' },
        avalanche: { relayer: 'AVALANCHE_RELAYER_ADDRESS' },
        avalancheFuji: { relayer: 'AVALANCHE_FUJI_RELAYER_ADDRESS' },
        mantle: { relayer: 'MANTLE_RELAYER_ADDRESS' },
        mantleSepolia: { relayer: 'MANTLE_SEPOLIA_RELAYER_ADDRESS' },
        celo: { relayer: 'CELO_RELAYER_ADDRESS' },
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
