'use client'

import { ethers } from 'ethers'
import toast from 'react-hot-toast'

interface NFT {
  tokenId: string
  seller: string
  owner: string
  price: string
  image: string
  name: string
  description: string
}

interface NFTGridProps {
  nfts: NFT[]
  onBuyNFT: (nft: NFT) => void
}

export default function NFTGrid({ nfts, onBuyNFT }: NFTGridProps) {
  const formatPrice = (price: string) => {
    return `${parseFloat(price).toFixed(4)} ETH`
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto mb-6 glass-card rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 blur-2xl opacity-50"></div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No NFTs Available</h3>
        <p className="text-white/60 text-lg mb-8">
          Be the first to mint an extraordinary NFT!
        </p>
        <button className="btn-glow">
          Mint Your First NFT
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {nfts.map((nft, index) => (
        <div 
          key={nft.tokenId} 
          className="nft-card group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="relative overflow-hidden rounded-t-2xl">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-nft.png'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 right-4 glass-effect px-3 py-1 rounded-full text-xs font-semibold text-white">
              #{nft.tokenId}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="glass-effect px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-sm text-white/80">Seller</div>
                <div className="text-white font-semibold">{shortenAddress(nft.seller)}</div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-3 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-500 group-hover:to-red-500 group-hover:bg-clip-text transition-all duration-300">
              {nft.name}
            </h3>
            <p className="text-white/60 text-sm mb-4 line-clamp-2 group-hover:text-white/80 transition-colors duration-300">
              {nft.description}
            </p>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                <span className="text-sm text-white/60">Available</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Price</div>
                <div className="text-xl font-bold gradient-text">
                  {formatPrice(nft.price)}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onBuyNFT(nft)}
              className="w-full btn-glow group-hover:scale-105 transition-transform duration-300"
            >
              <span className="relative z-10">Buy NFT</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
