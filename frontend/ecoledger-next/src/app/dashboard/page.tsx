"use client";

import { useState, useEffect } from "react";
import { useActiveAccount, ConnectButton, useReadContract } from "thirdweb/react";
import Link from "next/link";
import Image from "next/image";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { parseAbi } from "viem";
import { formatTokenAmount } from "../../utils/token";
import Logo from "../../components/Logo";

// Carbon token contract ABI
const carbonTokenAbi = parseAbi([
  "function balanceOf(address account) external view returns (uint256)"
]);

// Token address (assuming it's the same as in your CarbonClaim contract)
const CARBON_TOKEN_ADDRESS = "0xee7158270D3508c9f87A96D6E62E55d2555FF703";

const mockActivityData = [
  { month: "January", carbonCredits: 50, energyUsage: 30 },
  { month: "February", carbonCredits: 55, energyUsage: 45 },
  { month: "March", carbonCredits: 80, energyUsage: 40 },
  { month: "April", carbonCredits: 75, energyUsage: 20 },
  { month: "May", carbonCredits: 60, energyUsage: 80 },
  { month: "June", carbonCredits: 50, energyUsage: 60 },
  { month: "July", carbonCredits: 40, energyUsage: 85 }
];

export default function Dashboard() {
  const activeAccount = useActiveAccount();
  const [userName, setUserName] = useState("John Doe");
  
  // Create a stable empty address for when no account is connected
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const accountAddress = activeAccount?.address || zeroAddress;
  const isConnected = !!activeAccount;
  
  // Read contract with proper hook usage
  const { data: balanceData, isLoading } = useReadContract({
    contract: {
      abi: carbonTokenAbi,
      address: CARBON_TOKEN_ADDRESS,
      chain: sepolia,
      client,
    },
    method: "balanceOf",
    params: [accountAddress],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Logo withText size="md" />
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-gray-900 font-medium hover:text-green-600">
                Home
              </Link>
              {isConnected && (
                <Link href="/market" className="text-gray-500 hover:text-green-600">
                  Market
                </Link>
              )}
              <Link href="/profile" className="text-gray-500 hover:text-green-600">
                Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="text-sm text-gray-700">
                <span className="font-medium">EcoUser</span>
                <span className="text-gray-400 ml-2">
                  {activeAccount?.address.slice(0, 6)}...{activeAccount?.address.slice(-4)}
                </span>
              </div>
            ) : (
              <ConnectButton 
                client={client}
                appMetadata={{
                  name: "EcoLedger",
                  url: "https://ecoledger.example",
                }}
              />
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome, {isConnected ? userName.split(' ')[0] : "Guest"}!</h1>
          <p className="text-gray-600 text-sm mt-1">Here's an overview of your EcoLedger activity</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Wallet</h2>
              
              {isConnected ? (
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Wallet Connected</h3>
                      <p className="text-xs text-gray-500 font-mono">{activeAccount?.address}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-500 mb-1">Balance: {activeAccount?.address ? "0.0297593254997100" : "0"}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="text-gray-800 font-medium">ECO Tokens: </span>
                      <span className="ml-1">{balanceData ? formatTokenAmount(balanceData) : "0"}</span>
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <Link href="/claim" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Claim ECO Tokens
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Connect your wallet to view your balance</p>
                  <ConnectButton 
                    client={client}
                    appMetadata={{
                      name: "EcoLedger",
                      url: "https://ecoledger.example",
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Activity Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Activity Overview</h2>
              
              <div className="h-64 relative">
                {/* This is where you'd normally use a chart library */}
                <div className="flex items-end justify-between h-48 border-b border-l">
                  {mockActivityData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="relative h-40 w-10 flex items-end mb-1">
                        <div 
                          className="absolute bottom-0 w-3 bg-green-500 rounded-t" 
                          style={{ height: `${data.carbonCredits}%`, left: 0 }}
                        ></div>
                        <div 
                          className="absolute bottom-0 w-3 bg-blue-500 rounded-t" 
                          style={{ height: `${data.energyUsage}%`, right: 0 }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{data.month.substring(0, 3)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-4 space-x-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Carbon Credits</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Energy Usage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Your Stats Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Your Stats</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3">
                  <p className="text-3xl font-bold text-gray-800">
                    {balanceData ? formatTokenAmount(balanceData) : "0"}
                  </p>
                  <p className="text-sm text-gray-500">ECO Tokens</p>
                </div>
                
                <div className="text-center p-3">
                  <p className="text-3xl font-bold text-gray-800">0</p>
                  <p className="text-sm text-gray-500">Land Parcels</p>
                </div>
                
                <div className="text-center p-3">
                  <p className="text-3xl font-bold text-gray-800">0</p>
                  <p className="text-sm text-gray-500">Transactions</p>
                </div>
                
                <div className="text-center p-3">
                  <p className="text-3xl font-bold text-gray-800">$0</p>
                  <p className="text-sm text-gray-500">Total Value</p>
                </div>
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Transactions</h2>
              
              {isConnected ? (
                <div className="space-y-3">
                  <p className="text-center text-gray-500 py-6">No recent transactions</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Connect your wallet to view transactions</p>
                  <ConnectButton 
                    client={client}
                    appMetadata={{
                      name: "EcoLedger",
                      url: "https://ecoledger.example",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 