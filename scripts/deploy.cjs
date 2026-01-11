const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying todosArena contracts...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
    console.log("");

    // Deploy TodoToken
    console.log("1. Deploying TodoToken...");
    const TodoToken = await hre.ethers.getContractFactory("TodoToken");
    const todoToken = await TodoToken.deploy(deployer.address);
    await todoToken.waitForDeployment();
    const todoTokenAddress = await todoToken.getAddress();
    console.log("   ✅ TodoToken deployed to:", todoTokenAddress);

    // Deploy VotingContract first
    console.log("2. Deploying VotingContract...");
    const VotingContract = await hre.ethers.getContractFactory("VotingContract");
    const votingContract = await VotingContract.deploy();
    await votingContract.waitForDeployment();
    const votingContractAddress = await votingContract.getAddress();
    console.log("   ✅ VotingContract deployed to:", votingContractAddress);

    // Deploy MatchContract
    console.log("3. Deploying MatchContract...");
    const MatchContract = await hre.ethers.getContractFactory("MatchContract");
    const matchContract = await MatchContract.deploy(deployer.address, votingContractAddress);
    await matchContract.waitForDeployment();
    const matchContractAddress = await matchContract.getAddress();
    console.log("   ✅ MatchContract deployed to:", matchContractAddress);

    // Deploy RewardDistribution
    console.log("4. Deploying RewardDistribution...");
    const RewardDistribution = await hre.ethers.getContractFactory("RewardDistribution");
    const rewardDistribution = await RewardDistribution.deploy(todoTokenAddress);
    await rewardDistribution.waitForDeployment();
    const rewardDistributionAddress = await rewardDistribution.getAddress();
    console.log("   ✅ RewardDistribution deployed to:", rewardDistributionAddress);

    // Grant MINTER_ROLE to RewardDistribution
    console.log("\n5. Setting up roles...");
    const MINTER_ROLE = await todoToken.MINTER_ROLE();
    await todoToken.grantRole(MINTER_ROLE, rewardDistributionAddress);
    console.log("   ✅ Granted MINTER_ROLE to RewardDistribution");

    // Grant VOTING_MANAGER_ROLE to MatchContract
    const VOTING_MANAGER_ROLE = await votingContract.VOTING_MANAGER_ROLE();
    await votingContract.grantRole(VOTING_MANAGER_ROLE, matchContractAddress);
    console.log("   ✅ Granted VOTING_MANAGER_ROLE to MatchContract");

    console.log("\n========================================");
    console.log("🎉 All contracts deployed successfully!");
    console.log("========================================\n");
    console.log("Contract Addresses:");
    console.log("-------------------");
    console.log("TodoToken:          ", todoTokenAddress);
    console.log("MatchContract:      ", matchContractAddress);
    console.log("VotingContract:     ", votingContractAddress);
    console.log("RewardDistribution: ", rewardDistributionAddress);
    console.log("");

    // Save addresses to a file
    const fs = require("fs");
    const addresses = {
        todoToken: todoTokenAddress,
        matchContract: matchContractAddress,
        votingContract: votingContractAddress,
        rewardDistribution: rewardDistributionAddress,
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
