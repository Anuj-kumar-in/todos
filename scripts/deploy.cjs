const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying TodosArena contract...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
    
    const TodosArena = await hre.ethers.getContractFactory("TodosArena");
    const todosArena = await TodosArena.deploy();
    await todosArena.waitForDeployment();
    const todosArenaAddress = await todosArena.getAddress();

    console.log("🎉 TodosArena contract deployed successfully!");
    console.log("Contract Address:");
    console.log("TodosArena:        ", todosArenaAddress);

    const fs = require("fs");
    const addresses = {
        todosArena: todosArenaAddress,
        network: hre.network.name,
        deployer: deployer.address,
        deployedAt: new Date().toISOString(),
        chainId: hre.network.config.chainId,
        rpcUrl: hre.network.config.url
    };

    fs.writeFileSync(
        "deployed-addresses.json",
        JSON.stringify(addresses, null, 2)
    );
    console.log("Addresses saved to deployed-addresses.json");

    // Update .env file with the deployed address
    const networkToEnv = {
        sepolia: 'SEPOLIA_TODOS_ARENA_ADDRESS',
        arbitrumSepolia: 'ARBITRUM_SEPOLIA_TODOS_ARENA_ADDRESS',
        lineaSepolia: 'LINEA_SEPOLIA_TODOS_ARENA_ADDRESS',
        polygonAmoy: 'POLYGON_AMOY_TODOS_ARENA_ADDRESS',
        baseSepolia: 'BASE_SEPOLIA_TODOS_ARENA_ADDRESS',
        blastSepolia: 'BLAST_SEPOLIA_TODOS_ARENA_ADDRESS',
        optimismSepolia: 'OPTIMISM_SEPOLIA_TODOS_ARENA_ADDRESS',
        palmTestnet: 'PALM_TESTNET_TODOS_ARENA_ADDRESS',
        avalancheFuji: 'AVALANCHE_FUJI_TODOS_ARENA_ADDRESS',
        zkSyncSepolia: 'ZKSYNC_SEPOLIA_TODOS_ARENA_ADDRESS',
        bscTestnet: 'BSC_TESTNET_TODOS_ARENA_ADDRESS',
        unichainSepolia: 'UNICHAIN_SEPOLIA_TODOS_ARENA_ADDRESS',
        swellchainTestnet: 'SWELLCHAIN_TESTNET_TODOS_ARENA_ADDRESS',
        scrollSepolia: 'SCROLL_SEPOLIA_TODOS_ARENA_ADDRESS',
        opBNBTestnet: 'OPBNB_TESTNET_TODOS_ARENA_ADDRESS',
        mantleSepolia: 'MANTLE_SEPOLIA_TODOS_ARENA_ADDRESS'
    };

    const envVar = networkToEnv[hre.network.name];
    if (envVar) {
        const envPath = '.env';
        let envContent = fs.readFileSync(envPath, 'utf8');
        const regex = new RegExp(`^${envVar}=.*$`, 'm');
        envContent = envContent.replace(regex, `${envVar}=${todosArenaAddress}`);
        fs.writeFileSync(envPath, envContent);
        console.log(`Updated ${envVar} in .env with ${todosArenaAddress}`);
    } else {
        console.log(`No env var mapping for network ${hre.network.name}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
