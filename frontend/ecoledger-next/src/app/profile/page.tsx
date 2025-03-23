"use client";

import React from "react";
import Link from "next/link";
import { useActiveAccount, ConnectButton } from "thirdweb/react";
import { client } from "../client";
import Logo from "../../components/Logo";

export default function Profile() {
  const activeAccount = useActiveAccount();
  
  // Create a stable reference for when no account is connected
  const isConnected = !!activeAccount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Logo withText size="md" />
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-gray-500 hover:text-green-600">
                Home
              </Link>
              <Link href="/market" className="text-gray-500 hover:text-green-600">
                Market
              </Link>
              <Link href="/profile" className="text-gray-900 font-medium hover:text-green-600">
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Connect your wallet to view and manage your profile, transaction history, and carbon credits.
            </p>
            <ConnectButton 
              client={client}
              appMetadata={{
                name: "EcoLedger",
                url: "https://ecoledger.example",
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full text-white text-2xl font-bold mb-4">
                    EU
                  </div>
                  <h2 className="text-xl font-bold">EcoUser</h2>
                  <p className="text-gray-500 text-sm break-all">{activeAccount?.address}</p>
                </div>
                
                <div className="border-t border-gray-100 pt-4 pb-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">ACCOUNT DETAILS</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Display Name</label>
                      <input 
                        type="text" 
                        value="EcoUser" 
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="Add your email (optional)"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="font-medium text-gray-800 mb-4">Connected Wallet</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1 .257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Ethereum Wallet</p>
                      <p className="text-xs text-gray-500">{activeAccount?.address.slice(0, 12)}...{activeAccount?.address.slice(-8)}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                
                <button className="w-full mt-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors">
                  Disconnect
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-100">
                  <nav className="flex">
                    <button className="px-6 py-4 text-sm font-medium border-b-2 border-green-600 text-green-600">
                      Transaction History
                    </button>
                    <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                      Carbon Credits
                    </button>
                    <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                      Notifications
                    </button>
                  </nav>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-800">Recent Transactions</h3>
                    <select className="text-sm border rounded p-1">
                      <option>All Time</option>
                      <option>Last 30 Days</option>
                      <option>Last 7 Days</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="mr-4 bg-green-100 rounded-full p-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Received ECO Tokens</h4>
                          <span className="text-green-600 font-medium">+15.00 ECO</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-500">From: 0x7a23...45f9</p>
                          <p className="text-xs text-gray-500">June 24, 2023</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="mr-4 bg-blue-100 rounded-full p-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Purchased Carbon Credits</h4>
                          <span className="text-blue-600 font-medium">-5.2 ECO</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-500">Amazon Rainforest Project</p>
                          <p className="text-xs text-gray-500">June 18, 2023</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="mr-4 bg-green-100 rounded-full p-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Claimed Rewards</h4>
                          <span className="text-green-600 font-medium">+2.5 ECO</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-500">Referral Bonus</p>
                          <p className="text-xs text-gray-500">June 12, 2023</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <button className="text-green-600 text-sm font-medium hover:text-green-700">
                      View All Transactions
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-800 mb-4">Carbon Impact Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-xs font-medium text-green-800 mb-2">CARBON OFFSET</h4>
                    <p className="text-2xl font-bold text-gray-800">12.4 <span className="text-sm text-gray-500">tons</span></p>
                    <p className="text-xs text-gray-500 mt-1">↑ 23% from last month</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-xs font-medium text-blue-800 mb-2">PROJECTS SUPPORTED</h4>
                    <p className="text-2xl font-bold text-gray-800">3</p>
                    <p className="text-xs text-gray-500 mt-1">↑ 1 new this month</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="text-xs font-medium text-purple-800 mb-2">IMPACT SCORE</h4>
                    <p className="text-2xl font-bold text-gray-800">82 <span className="text-sm text-gray-500">/ 100</span></p>
                    <p className="text-xs text-gray-500 mt-1">↑ 5 points from last month</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium mb-3">Carbon Offset Certificates</h4>
                  <button className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-center hover:bg-gray-50">
                    <div className="text-gray-500">
                      <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium">Download All Certificates</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 