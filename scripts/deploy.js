const hre = require("hardhat");

async function main() {
  console.log("Deploying NFT Marketplace...");

  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();

  await nftMarketplace.waitForDeployment();

  const address = await nftMarketplace.getAddress();
  console.log("NFT Marketplace deployed to:", address);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await nftMarketplace.deploymentTransaction().wait(6);

  // Verify the contract on Etherscan
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
