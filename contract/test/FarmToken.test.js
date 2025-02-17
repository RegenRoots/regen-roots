const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FarmToken", function () {
  let FarmToken, farmToken, owner, minter, addr1;

  beforeEach(async function () {
    [owner, minter, addr1] = await ethers.getSigners();
    FarmToken = await ethers.getContractFactory("FarmToken");
    farmToken = await FarmToken.deploy();
    await farmToken.deployed();

    // Grant MINTER_ROLE to minter
    const MINTER_ROLE = await farmToken.MINTER_ROLE();
    await farmToken.grantRole(MINTER_ROLE, minter.address);
  });

  it("should allow minter to mint tokens", async function () {
    await farmToken.connect(minter).mint(addr1.address, 1);
    expect(await farmToken.ownerOf(1)).to.equal(addr1.address);
  });

  it("should not allow non-minter to mint tokens", async function () {
    await expect(farmToken.connect(addr1).mint(addr1.address, 1)).to.be.revertedWith("AccessControl: account");
  });
}); 