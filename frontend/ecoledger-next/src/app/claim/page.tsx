"use client";

import { useState } from "react";
import { ConnectButton, useActiveAccount, useReadContract, TransactionButton } from "thirdweb/react";
import { client } from "../client";
import { parseAbi } from "viem";
import Link from "next/link";
import { sepolia } from "thirdweb/chains";
import { prepareContractCall } from "thirdweb";
import { formatTokenAmount } from "../../utils/token";

// CarbonClaim contract ABI - only the functions we need
const carbonClaimAbi = parseAbi([
  "function getClaimableAmount(address user) public view returns (uint256)",
  "function claimTokens() external"
]);

// Real contract address
const CARBON_CLAIM_CONTRACT = "0xd30bd53fe783f5e8948f4f03efd38ab61ae155f7";

export default function ClaimPage() {
  const account = useActiveAccount();
  const [claimSuccess, setClaimSuccess] = useState(false);
  
  // Read the claimable amount for the connected wallet
  const { data: claimableAmount, isLoading, error, refetch } = useReadContract({
    contract: {
      address: CARBON_CLAIM_CONTRACT,
      abi: carbonClaimAbi,
      client,
      chain: sepolia,
    },
    method: "getClaimableAmount",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
  });

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20 w-full max-w-md">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">EcoLedger Carbon Token Claim</h1>
          <p className="text-zinc-300">Connect your wallet to claim your CAR tokens</p>
        </header>

        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          {!account ? (
            <div className="flex flex-col items-center space-y-4">
              <p className="mb-4 text-center">Connect your wallet to check your claimable tokens</p>
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
                <p className="text-sm text-zinc-400">Connected as</p>
                <p className="font-mono text-sm truncate">{account.address}</p>
              </div>
              
              <div className="border-t border-zinc-700 my-4"></div>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-1">Your Claimable Tokens</h2>
                
                {isLoading ? (
                  <p className="text-zinc-400">Loading...</p>
                ) : error ? (
                  <p className="text-red-400">Error loading claimable amount</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-3xl font-bold">
                      {formatTokenAmount(claimableAmount || 0n)} <span className="text-green-400">CAR</span>
                    </p>
                    
                    {/* Debug information */}
                    <div className="text-xs text-zinc-500 mt-1 mb-3">
                      Raw value: {claimableAmount?.toString() || "0"}
                    </div>
                    
                    <TransactionButton
                      transaction={() => 
                        prepareContractCall({
                          contract: {
                            address: CARBON_CLAIM_CONTRACT,
                            abi: carbonClaimAbi,
                            client,
                            chain: sepolia,
                          },
                          method: "claimTokens",
                          params: [],
                        })
                      }
                      disabled={!claimableAmount || claimableAmount === 0n}
                      className={`w-full py-2 px-4 rounded-md transition-colors ${
                        !claimableAmount || claimableAmount === 0n
                          ? "bg-zinc-600 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      onTransactionConfirmed={() => {
                        setClaimSuccess(true);
                        setTimeout(() => refetch(), 2000);
                      }}
                    >
                      Claim Tokens
                    </TransactionButton>
                    
                    {claimSuccess && (
                      <p className="text-green-400 text-sm">Tokens successfully claimed!</p>
                    )}
                  </div>
                )}
              </div>
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