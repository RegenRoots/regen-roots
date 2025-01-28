const { ethers } = require("hardhat");

async function main() {
  // Deploy FarmRegistry
  const FarmRegistry = await ethers.getContractFactory("FarmRegistry");
  const farmRegistry = await FarmRegistry.deploy(ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.05"));
  await farmRegistry.deployed();
  console.log("FarmRegistry deployed to:", farmRegistry.address);

  // Deploy InvestmentManager
  const InvestmentManager = await ethers.getContractFactory("InvestmentManager");
  const investmentManager = await InvestmentManager.deploy(farmRegistry.address, 1000, ethers.utils.parseEther("1"));
  await investmentManager.deployed();
  console.log("InvestmentManager deployed to:", investmentManager.address);

  // Deploy Marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(farmRegistry.address, 100, 3600);
  await marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 