// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CarbonClaim
 * @dev Contract for claiming Carbon tokens after land proof verification
 */
contract CarbonClaim is Ownable, ReentrancyGuard {
    // Carbon token contract
    IERC20 public carbonToken;
    
    // Mapping to track approved claims
    mapping(address => uint256) public approvedClaims;
    
    // Mapping to track claimed tokens
    mapping(address => uint256) public claimedTokens;
    
    // Events
    event ClaimApproved(address indexed user, uint256 amount);
    event TokensClaimed(address indexed user, uint256 amount);
    
    /**
     * @dev Constructor sets the token address and contract owner
     * @param _carbonToken Address of the Carbon ERC20 token
     */
    constructor(address _carbonToken) {
        carbonToken = IERC20(_carbonToken);
        _transferOwnership(msg.sender);
    }
    
    /**
     * @dev Approve a claim for a user
     * @param user Address of the user
     * @param amount Amount of tokens to approve
     */
    function approveClaim(address user, uint256 amount) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        
        approvedClaims[user] += amount;
        
        emit ClaimApproved(user, amount);
    }
    
    /**
     * @dev Approve claims for multiple users at once
     * @param users Array of user addresses
     * @param amounts Array of token amounts
     */
    function approveClaimsBatch(address[] calldata users, uint256[] calldata amounts) external onlyOwner {
        require(users.length == amounts.length, "Arrays must have same length");
        
        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != address(0), "Invalid user address");
            require(amounts[i] > 0, "Amount must be greater than 0");
            
            approvedClaims[users[i]] += amounts[i];
            
            emit ClaimApproved(users[i], amounts[i]);
        }
    }
    
    /**
     * @dev Claim approved tokens
     */
    function claimTokens() external nonReentrant {
        uint256 claimableAmount = getClaimableAmount(msg.sender);
        require(claimableAmount > 0, "No tokens available to claim");
        
        // Update claimed amount before transfer to prevent reentrancy
        claimedTokens[msg.sender] += claimableAmount;
        
        // Transfer tokens to the user
        require(carbonToken.transfer(msg.sender, claimableAmount), "Token transfer failed");
        
        emit TokensClaimed(msg.sender, claimableAmount);
    }
    
    /**
     * @dev Get the amount of tokens a user can claim
     * @param user Address of the user
     * @return Amount of claimable tokens
     */
    function getClaimableAmount(address user) public view returns (uint256) {
        return approvedClaims[user] - claimedTokens[user];
    }
    
    /**
     * @dev Withdraw any tokens accidentally sent to the contract
     * @param token Address of the token to withdraw
     */
    function withdrawTokens(address token) external onlyOwner {
        IERC20 tokenContract = IERC20(token);
        uint256 balance = tokenContract.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        
        require(tokenContract.transfer(owner(), balance), "Token transfer failed");
    }
}