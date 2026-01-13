'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import Navbar from './components/Navbar'
import NFTGrid from './components/NFTGrid'
import { NFTMarketplace__factory } from '../typechain-types'

export default function Home() {
  const [account, setAccount] = useState<string>('')
  const [contract, setContract] = useState<any>(null)
  const [nfts, setNfts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    connectWallet()
    loadNFTs()
  }, [])

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        setAccount(accounts[0])
        
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        
        // Replace with your deployed contract address
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''
        const nftContract = NFTMarketplace__factory.connect(contractAddress, signer)
        setContract(nftContract)
        
        toast.success('Wallet connected successfully!')
      } catch (error) {
        console.error('Error connecting wallet:', error)
        toast.error('Failed to connect wallet')
      }
    } else {
      toast.error('Please install MetaMask!')
    }
  }

  const loadNFTs = async () => {
    try {
      if (contract) {
        const items = await contract.fetchMarketItems()
        const nftItems = await Promise.all(
          items.map(async (item: any) => {
            const tokenURI = await contract.tokenURI(item.tokenId)
            const response = await fetch(tokenURI)
            const metadata = await response.json()
            
            return {
              tokenId: item.tokenId.toString(),
              seller: item.seller,
              owner: item.owner,
              price: ethers.formatEther(item.price),
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
            }
          })
        )
        setNfts(nftItems)
      }
    } catch (error) {
      console.error('Error loading NFTs:', error)
      toast.error('Failed to load NFTs')
    } finally {
      setLoading(false)
    }
  }

  const buyNFT = async (nft: any) => {
    try {
      if (!contract) {
        toast.error('Please connect your wallet first')
        return
      }
      
      const price = ethers.parseEther(nft.price)
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      })
      
      await transaction.wait()
      toast.success('NFT purchased successfully!')
      loadNFTs()
    } catch (error) {
      console.error('Error buying NFT:', error)
      toast.error('Failed to purchase NFT')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 mesh-gradient opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl floating"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
      
      <Navbar account={account} onConnect={connectWallet} />
      
      <main className="relative z-10 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="relative mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                <span className="gradient-text font-['Space_Grotesk']">NFT Afia</span>
              </h1>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 blur-3xl opacity-50"></div>
            </div>
            <p className="text-2xl md:text-3xl text-white/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              Discover, collect, and sell extraordinary 
              <span className="gradient-text font-semibold"> NFTs </span>
              on the blockchain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-glow text-lg px-8 py-4">
                Explore Marketplace
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Learn More
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="glass-card p-8 text-center">
              <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-white/60">NFTs Created</div>
            </div>
            <div className="glass-card p-8 text-center">
              <div className="text-4xl font-bold gradient-text mb-2">5K+</div>
              <div className="text-white/60">Artists</div>
            </div>
            <div className="glass-card p-8 text-center">
              <div className="text-4xl font-bold gradient-text mb-2">$2M+</div>
              <div className="text-white/60">Volume Traded</div>
            </div>
          </div>

          {/* NFT Grid Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Featured <span className="gradient-text">NFTs</span>
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
              </div>
            ) : (
              <NFTGrid nfts={nfts} onBuyNFT={buyNFT} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
