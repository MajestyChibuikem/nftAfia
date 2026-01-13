'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface NavbarProps {
  account: string
  onConnect: () => void
}

export default function Navbar({ account, onConnect }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-effect backdrop-blur-xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              </div>
              <span className="text-2xl font-bold gradient-text font-['Space_Grotesk']">NFT Afia</span>
            </Link>
            
            <div className="hidden md:ml-12 md:flex md:space-x-8">
              <Link 
                href="/" 
                className="relative text-white/80 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 group"
              >
                <span className="relative z-10">Marketplace</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                href="/mint" 
                className="relative text-white/80 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 group"
              >
                <span className="relative z-10">Mint NFT</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                href="/my-nfts" 
                className="relative text-white/80 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 group"
              >
                <span className="relative z-10">My NFTs</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {account ? (
              <div className="flex items-center space-x-3 glass-effect px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full pulse-glow"></div>
                <span className="text-sm text-white font-medium">
                  {shortenAddress(account)}
                </span>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="btn-glow relative overflow-hidden group"
              >
                <span className="relative z-10">Connect Wallet</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="glass-effect p-2 rounded-lg text-white hover:bg-white/20 transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-effect rounded-2xl mb-4">
            <div className="px-4 py-4 space-y-2">
              <Link 
                href="/" 
                className="block text-white/80 hover:text-white px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/mint" 
                className="block text-white/80 hover:text-white px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Mint NFT
              </Link>
              <Link 
                href="/my-nfts" 
                className="block text-white/80 hover:text-white px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                My NFTs
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
