// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LoanManager is AccessControl {
    struct Loan {
        address borrower;
        uint256 tokenId;
        uint256 amount;
        uint256 interestRate; // in basis points (1/100 of a percent)
        uint256 duration; // in seconds
        uint256 startTime;
        bool isActive;
    }

    mapping(uint256 => Loan) public loans;
    IERC721 public farmToken;
    uint256 public loanCounter;

    event LoanRequested(uint256 loanId, address borrower, uint256 tokenId, uint256 amount);
    event LoanApproved(uint256 loanId);
    event LoanRepaid(uint256 loanId);

    constructor(address _farmToken) {
        farmToken = IERC721(_farmToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function requestLoan(uint256 tokenId, uint256 amount, uint256 interestRate, uint256 duration) external {
        require(farmToken.ownerOf(tokenId) == msg.sender, "Not token owner");
        // Transfer the token to the contract as collateral
        farmToken.transferFrom(msg.sender, address(this), tokenId);

        loans[loanCounter] = Loan({
            borrower: msg.sender,
            tokenId: tokenId,
            amount: amount,
            interestRate: interestRate,
            duration: duration,
            startTime: 0,
            isActive: false
        });

        emit LoanRequested(loanCounter, msg.sender, tokenId, amount);
        loanCounter++;
    }

    function approveLoan(uint256 loanId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Loan storage loan = loans[loanId];
        require(!loan.isActive, "Loan already active");

        loan.isActive = true;
        loan.startTime = block.timestamp;

        // Transfer the loan amount to the borrower
        payable(loan.borrower).transfer(loan.amount);

        emit LoanApproved(loanId);
    }

    function repayLoan(uint256 loanId) external payable {
        Loan storage loan = loans[loanId];
        require(loan.isActive, "Loan not active");
        require(msg.sender == loan.borrower, "Not borrower");

        uint256 interest = calculateInterest(loan.amount, loan.interestRate, loan.duration);
        uint256 totalRepayment = loan.amount + interest;

        require(msg.value >= totalRepayment, "Insufficient repayment amount");

        // Mark the loan as repaid
        loan.isActive = false;

        // Return the collateral token to the borrower
        farmToken.transferFrom(address(this), loan.borrower, loan.tokenId);

        emit LoanRepaid(loanId);
    }

    function calculateInterest(uint256 principal, uint256 rate, uint256 duration) internal pure returns (uint256) {
        return (principal * rate * duration) / (10000 * 365 * 24 * 60 * 60); // Assuming rate is annual
    }
} 