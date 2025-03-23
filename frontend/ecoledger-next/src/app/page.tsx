"use client";

import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import Link from "next/link";
import Logo from "../components/Logo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo withText size="md" />
            
            <div className="flex gap-3">
              <Link 
                href="/login" 
                className="px-4 py-2 text-green-600 font-medium hover:text-green-800 transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Turn Your Land into <span className="text-green-600">Carbon Credits</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl">
                EcoLedger helps landowners convert their environmental efforts into tradable carbon tokens on the blockchain.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard" 
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md text-center shadow-sm hover:shadow transition-all"
                >
                  Launch EcoLedger
                </Link>
                <Link 
                  href="/register" 
                  className="px-8 py-3 bg-white text-green-600 font-medium rounded-md border border-green-200 text-center shadow-sm hover:shadow hover:border-green-300 transition-all"
                >
                  Register Your Land
                </Link>
              </div>
            </div>
            <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                <div className="relative">
                  <Image 
                    src="/assets/images/logo.svg" 
                    alt="EcoLedger"
                    width={500}
                    height={500}
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How EcoLedger Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to verify, tokenize, and trade environmental impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Land</h3>
              <p className="text-gray-600">
                Register and verify your land details. Our team will review your submission and confirm your eligibility for carbon credits.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Receive Tokens</h3>
              <p className="text-gray-600">
                Once approved, connect your wallet and receive CAR tokens representing your land's carbon offsetting potential.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trade on Market</h3>
              <p className="text-gray-600">
                Sell your carbon credits on our marketplace to businesses and individuals looking to offset their carbon footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Carbon Credit Journey?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-3xl mx-auto">
            Join EcoLedger today and turn your environmental stewardship into verifiable, tradable assets.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/register" 
              className="px-8 py-3 bg-white text-green-600 font-medium rounded-md text-center shadow-sm hover:bg-gray-50 transition-colors"
            >
              Register Now
            </Link>
            
            <Link 
              href="/login" 
              className="px-8 py-3 bg-green-700 text-white font-medium rounded-md text-center shadow-sm hover:bg-green-800 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2 space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-500">
                &copy; 2024 EcoLedger. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Link - Hidden */}
      <div className="fixed bottom-4 right-4">
        <Link 
          href="/admin" 
          className="p-2 bg-gray-100 rounded-md text-xs text-gray-500 hover:bg-gray-200 transition-colors"
        >
          Admin Access
        </Link>
      </div>
    </div>
  );
}
