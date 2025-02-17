const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Regens Smart Contracts", function () {
  let FarmRegistry, farmRegistry, InvestmentManager, investmentManager, Marketplace, marketplace, FarmToken, farmToken;
  let owner, addr1, addr2, addr3, farmer, verifier;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, farmer, verifier] = await ethers.getSigners();

    // Deploy FarmToken
    FarmToken = await ethers.getContractFactory("FarmToken");
    farmToken = await FarmToken.deploy();
    await farmToken.deployed();

    // Deploy FarmRegistry
    FarmRegistry = await ethers.getContractFactory("FarmRegistry");
    farmRegistry = await FarmRegistry.deploy(ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.05"), farmToken.address);
    await farmRegistry.deployed();

    // Grant VERIFIER_ROLE to verifier
    const VERIFIER_ROLE = await farmRegistry.VERIFIER_ROLE();
    await farmRegistry.grantRole(VERIFIER_ROLE, verifier.address);

    // Deploy InvestmentManager
    InvestmentManager = await ethers.getContractFactory("InvestmentManager");
    investmentManager = await InvestmentManager.deploy(farmRegistry.address, 1000, ethers.utils.parseEther("1"));
    await investmentManager.deployed();

    // Deploy Marketplace
    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(farmRegistry.address, 100, 3600);
    await marketplace.deployed();
  });

  describe("FarmRegistry", function () {
    it("should register a farm", async function () {
      await farmRegistry.connect(farmer).registerFarm("Farm1", "Country", "Region", "Coordinates", "MetadataURI", { value: ethers.utils.parseEther("0.1") });
      const farmInfo = await farmRegistry.getFarmInfo(1);
      expect(farmInfo.owner).to.equal(farmer.address);
    });

    it("should verify a farm", async function () {
      await farmRegistry.connect(farmer).registerFarm("Farm1", "Country", "Region", "Coordinates", "MetadataURI", { value: ethers.utils.parseEther("0.1") });
      await farmRegistry.connect(verifier).verifyFarm(1, { value: ethers.utils.parseEther("0.05") });
      const farmInfo = await farmRegistry.getFarmInfo(1);
      expect(farmInfo.isVerified).to.be.true;
    });

    it("should allow farmer to tokenize a farm", async function () {
      await farmRegistry.connect(farmer).registerFarm("Farm1", "Country", "Region", "Coordinates", "MetadataURI", { value: ethers.utils.parseEther("0.1") });
      await farmRegistry.connect(verifier).verifyFarm(1, { value: ethers.utils.parseEther("0.05") });
      await farmRegistry.connect(farmer).tokenizeFarm(1);
      expect(await farmToken.ownerOf(1)).to.equal(farmer.address);
    });

    it("should not allow non-owner to tokenize a farm", async function () {
      await farmRegistry.connect(farmer).registerFarm("Farm1", "Country", "Region", "Coordinates", "MetadataURI", { value: ethers.utils.parseEther("0.1") });
      await farmRegistry.connect(verifier).verifyFarm(1, { value: ethers.utils.parseEther("0.05") });
      await expect(farmRegistry.connect(verifier).tokenizeFarm(1)).to.be.revertedWith("Not farm owner");
    });
  });

  describe("InvestmentManager", function () {
    it("should allow investment in a verified farm", async function () {
      await farmRegistry.connect(farmer).registerFarm("Farm1", "Country", "Region", "Coordinates", "MetadataURI", { value: ethers.utils.parseEther("0.1") });
      await farmRegistry.connect(verifier).verifyFarm(1, { value: ethers.utils.parseEther("0.05") });

      await investmentManager.connect(addr3).invest(1, ethers.constants.AddressZero, ethers.utils.parseEther("1"), 3600, { value: ethers.utils.parseEther("1") });
      const investment = await investmentManager.investments(1);
      expect(investment.amount).to.equal(ethers.utils.parseEther("0.9")); // After platform fee
    });
  });

  describe("Marketplace", function () {
    it("should create a product", async function () {
      await farmRegistry.connect(farmer).registerFarm("Farm1", "Country", "Region", "Coordinates", "MetadataURI", { value: ethers.utils.parseEther("0.1") });
      await farmRegistry.connect(verifier).verifyFarm(1, { value: ethers.utils.parseEther("0.05") });

      await marketplace.connect(farmer).createProduct(1, "Product1", ethers.utils.parseEther("0.5"), 100, "MetadataURI", true, [], 1, 10);
      const product = await marketplace.getProduct(1);
      expect(product.name).to.equal("Product1");
    });
  });
}); 