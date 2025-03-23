"use client";

import React from "react";
import Link from "next/link";
import { useActiveAccount, ConnectButton } from "thirdweb/react";
import { client } from "../client";
import Logo from "../../components/Logo";
import Image from "next/image";

// Mock carbon offset projects
const carbonProjects = [
  {
    id: 1,
    name: "Amazon Rainforest Conservation",
    location: "Brazil",
    description: "Support conservation efforts in the Amazon rainforest, protecting biodiversity and preventing deforestation.",
    price: 12.5,
    credits: 1000,
    remaining: 750,
    image: "/assets/images/logo.svg",
    tags: ["Conservation", "Biodiversity", "Forests"]
  },
  {
    id: 2,
    name: "Wind Farm Development",
    location: "Texas, USA",
    description: "Invest in clean energy through wind farm development, reducing reliance on fossil fuels.",
    price: 9.8,
    credits: 1500,
    remaining: 1200,
    image: "/assets/images/logo.svg",
    tags: ["Renewable Energy", "Wind Power", "Clean Energy"]
  },
  {
    id: 3,
    name: "Mangrove Restoration",
    location: "Indonesia",
    description: "Support the restoration of mangrove ecosystems, which are critical for coastal protection and carbon sequestration.",
    price: 15.2,
    credits: 800,
    remaining: 650,
    image: "/assets/images/logo.svg",
    tags: ["Coastal Protection", "Restoration", "Mangroves"]
  },
  {
    id: 4,
    name: "Solar Energy Project",
    location: "Morocco",
    description: "Support the development of large-scale solar energy production in North Africa.",
    price: 10.5,
    credits: 2000,
    remaining: 1800,
    image: "/assets/images/logo.svg",
    tags: ["Solar Power", "Renewable Energy", "Desert"]
  }
];

export default function Market() {
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
              <Link href="/market" className="text-gray-900 font-medium hover:text-green-600">
                Market
              </Link>
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Carbon Offset Marketplace</h1>
            <p className="text-gray-600">Purchase carbon credits to offset your environmental impact</p>
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white">
              <option>All Projects</option>
              <option>Forests</option>
              <option>Renewable Energy</option>
              <option>Ocean</option>
            </select>
          </div>
        </div>
        
        {!isConnected && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-amber-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-medium text-amber-800">Connect wallet to purchase</h3>
                <p className="text-amber-700 text-sm mt-1">You need to connect your wallet to buy carbon credits</p>
                <div className="mt-3">
                  <ConnectButton 
                    client={client}
                    appMetadata={{
                      name: "EcoLedger",
                      url: "https://ecoledger.example",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {carbonProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden relative bg-green-50">
                <Image 
                  src={project.image} 
                  alt={project.name}
                  width={500}
                  height={300}
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white text-sm">{project.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-1">{project.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">{tag}</span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-lg font-bold text-gray-800">${project.price}</p>
                    <p className="text-xs text-gray-500">per credit</p>
                  </div>
                  
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium ${isConnected ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    disabled={!isConnected}
                  >
                    Buy Credits
                  </button>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Available</span>
                    <span>{project.remaining} of {project.credits}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full" 
                      style={{ width: `${(project.remaining / project.credits) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 