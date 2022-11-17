import { ethers } from "hardhat";

async function main() {
  const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
  const campaignFactory = await CampaignFactory.deploy();

  await campaignFactory.deployed();

  console.log(`CampaignFactory has been deployed at address: ${campaignFactory.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
