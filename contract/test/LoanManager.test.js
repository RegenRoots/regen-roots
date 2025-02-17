const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoanManager", function () {
  let LoanManager, loanManager, FarmToken, farmToken, owner, borrower, addr1;

  beforeEach(async function () {
    [owner, borrower, addr1] = await ethers.getSigners();
    FarmToken = await ethers.getContractFactory("FarmToken");
    farmToken = await FarmToken.deploy();
    await farmToken.deployed();

    LoanManager = await ethers.getContractFactory("LoanManager");
    loanManager = await LoanManager.deploy(farmToken.address);
    await loanManager.deployed();

    // Mint a token to borrower
    const MINTER_ROLE = await farmToken.MINTER_ROLE();
    await farmToken.grantRole(MINTER_ROLE, owner.address);
    await farmToken.mint(borrower.address, 1);
  });

  it("should allow borrower to request a loan", async function () {
    await farmToken.connect(borrower).approve(loanManager.address, 1);
    await loanManager.connect(borrower).requestLoan(1, ethers.utils.parseEther("1"), 500, 3600);
    const loan = await loanManager.loans(0);
    expect(loan.borrower).to.equal(borrower.address);
  });

  it("should allow owner to approve a loan", async function () {
    await farmToken.connect(borrower).approve(loanManager.address, 1);
    await loanManager.connect(borrower).requestLoan(1, ethers.utils.parseEther("1"), 500, 3600);
    await owner.sendTransaction({ to: loanManager.address, value: ethers.utils.parseEther("1") });
    await loanManager.connect(owner).approveLoan(0);
    const loan = await loanManager.loans(0);
    expect(loan.isActive).to.be.true;
  });

  it("should allow borrower to repay a loan", async function () {
    await farmToken.connect(borrower).approve(loanManager.address, 1);
    await loanManager.connect(borrower).requestLoan(1, ethers.utils.parseEther("1"), 500, 3600);
    await owner.sendTransaction({ to: loanManager.address, value: ethers.utils.parseEther("1") });
    await loanManager.connect(owner).approveLoan(0);

    const interest = ethers.utils.parseEther("0.0001369863"); // Example interest calculation
    await loanManager.connect(borrower).repayLoan(0, { value: ethers.utils.parseEther("1").add(interest) });
    const loan = await loanManager.loans(0);
    expect(loan.isActive).to.be.false;
  });
}); 