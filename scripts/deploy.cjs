const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying TodosArena unified contract...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
    console.log("");

    // Deploy TodosArena unified contract
    console.log("1. Deploying TodosArena...");
    const TodosArena = await hre.ethers.getContractFactory("TodosArena");
    const todosArena = await TodosArena.deploy();
    await todosArena.waitForDeployment();
    const todosArenaAddress = await todosArena.getAddress();
    console.log("   ✅ TodosArena deployed to:", todosArenaAddress);

    console.log("\n========================================");
    console.log("🎉 TodosArena contract deployed successfully!");
    console.log("========================================\n");
    console.log("Contract Address:");
    console.log("-------------------");
    console.log("TodosArena:        ", todosArenaAddress);
    console.log("");

    // Save addresses to a file
    const fs = require("fs");
    const addresses = {
        todosArena: todosArenaAddress,
        network: hre.network.name,
        deployer: deployer.address,
        deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        "deployed-addresses.json",
        JSON.stringify(addresses, null, 2)
    );
    console.log("📝 Addresses saved to deployed-addresses.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
