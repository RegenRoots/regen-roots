const { ethers } = require("hardhat");

async function main() {
  // Deploy FarmToken
  const FarmToken = await ethers.getContractFactory("FarmToken");
  const farmToken = await FarmToken.deploy();
  await farmToken.waitForDeployment();
  console.log("FarmToken deployed to:", farmToken.target);

  // Deploy FarmRegistry with the FarmToken address
  const FarmRegistry = await ethers.getContractFactory("FarmRegistry");
  const farmRegistry = await FarmRegistry.deploy(
    ethers.parseEther("0.1"),
    ethers.parseEther("0.05"),
    farmToken.target
  );
  await farmRegistry.waitForDeployment();
  console.log("FarmRegistry deployed to:", farmRegistry.target);

  // Deploy InvestmentManager
  const InvestmentManager = await ethers.getContractFactory("InvestmentManager");
  const investmentManager = await InvestmentManager.deploy(
    farmRegistry.target,
    1000,
    ethers.parseEther("1")
  );
  await investmentManager.waitForDeployment();
  console.log("InvestmentManager deployed to:", investmentManager.target);

  // Deploy Marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    farmRegistry.target,
    100,
    3600
  );
  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", marketplace.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });