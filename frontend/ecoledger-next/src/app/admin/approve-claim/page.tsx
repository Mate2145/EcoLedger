"use client";

import { useState } from "react";
import { ConnectButton, useActiveAccount, TransactionButton } from "thirdweb/react";
import { client } from "../../client";
import { parseAbi } from "viem";
import Link from "next/link";
import { sepolia } from "thirdweb/chains";
import { prepareContractCall } from "thirdweb";
import { toWei } from "../../../utils/token";

// CarbonClaim contract ABI for admin functions
const carbonClaimAbi = parseAbi([
  "function approveClaim(address user, uint256 amount) external",
  "function approveClaimsBatch(address[] calldata users, uint256[] calldata amounts) external",
  "function getClaimableAmount(address user) public view returns (uint256)"
]);

// Real contract address
const CARBON_CLAIM_CONTRACT = "0xd30bd53fe783f5e8948f4f03efd38ab61ae155f7";

export default function ApproveClaimPage() {
  const account = useActiveAccount();
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [approveSuccess, setApproveSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Validate input
  const isValid = () => {
    if (!walletAddress || !walletAddress.startsWith("0x") || walletAddress.length !== 42) {
      setError("Please enter a valid wallet address");
      return false;
    }
    
    const amount = parseFloat(tokenAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid token amount");
      return false;
    }
    
    setError("");
    return true;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;
  };

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20 w-full max-w-md">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Admin: Approve Tokens</h1>
          <p className="text-zinc-300">Approve CAR tokens for users to claim</p>
        </header>

        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          {!account ? (
            <div className="flex flex-col items-center space-y-4">
              <p className="mb-4 text-center">Connect your wallet to approve token claims</p>
              <ConnectButton 
                client={client}
                appMetadata={{
                  name: "EcoLedger",
                  url: "https://ecoledger.example",
                }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-zinc-400">Connected as Admin</p>
                <p className="font-mono text-sm truncate">{account.address}</p>
              </div>
              
              <div className="border-t border-zinc-700 my-4"></div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      Token Amount (CAR)
                    </label>
                    <input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      placeholder="15.00"
                      step="0.01"
                      min="0"
                      className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md"
                    />
                  </div>
                  
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  
                  <TransactionButton
                    transaction={() => {
                      // Validate inputs before preparing the transaction
                      if (!isValid()) {
                        // Instead of returning null, throw an error that will be caught
                        throw new Error("Invalid input");
                      }
                      
                      // Convert tokens to wei (18 decimals)
                      const amountInWei = toWei(tokenAmount);
                      console.log(`Approving ${tokenAmount} tokens (${amountInWei} wei) for ${walletAddress}`);
                      
                      return prepareContractCall({
                        contract: {
                          address: CARBON_CLAIM_CONTRACT,
                          abi: carbonClaimAbi,
                          client,
                          chain: sepolia,
                        },
                        method: "approveClaim",
                        params: [walletAddress, amountInWei],
                      });
                    }}
                    disabled={!walletAddress || !tokenAmount || walletAddress.length !== 42 || !walletAddress.startsWith("0x") || isNaN(parseFloat(tokenAmount)) || parseFloat(tokenAmount) <= 0}
                    className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                    onTransactionConfirmed={() => {
                      setApproveSuccess(true);
                      setWalletAddress("");
                      setTokenAmount("");
                      setTimeout(() => setApproveSuccess(false), 5000);
                    }}
                  >
                    Approve Tokens
                  </TransactionButton>
                  
                  {approveSuccess && (
                    <p className="text-green-400 text-sm">Tokens successfully approved!</p>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-400 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
} 