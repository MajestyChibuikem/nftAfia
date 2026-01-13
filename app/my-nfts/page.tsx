'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { NFTMarketplace__factory } from '../../typechain-types'

interface NFT {
  tokenId: string
  seller: string
  owner: string
  price: string
  image: string
  name: string
  description: string
}

export default function MyNFTsPage() {
  const [account, setAccount] = useState<string>('')
  const [contract, setContract] = useState<any>(null)
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([])
  const [listedNFTs, setListedNFTs] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'owned' | 'listed'>('owned')

  useEffect(() => {
    connectWallet()
  }, [])

  useEffect(() => {
    if (contract && account) {
      loadMyNFTs()
    }
  }, [contract, account])

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        setAccount(accounts[0])
        
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        
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

  const loadMyNFTs = async () => {
    try {
      setLoading(true)
      
      // Load owned NFTs
      const ownedItems = await contract.fetchMyNFTs()
      const ownedNFTItems = await Promise.all(
        ownedItems.map(async (item: any) => {
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
      setOwnedNFTs(ownedNFTItems)
      
      // Load listed NFTs
      const listedItems = await contract.fetchItemsListed()
      const listedNFTItems = await Promise.all(
        listedItems.map(async (item: any) => {
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
      setListedNFTs(listedNFTItems)
      
    } catch (error) {
      console.error('Error loading NFTs:', error)
      toast.error('Failed to load NFTs')
    } finally {
      setLoading(false)
    }
  }

  const resellNFT = async (nft: NFT, newPrice: string) => {
    try {
      if (!contract) {
        toast.error('Please connect your wallet first')
        return
      }
      
      const listingPrice = await contract.getListingPrice()
      const price = ethers.parseEther(newPrice)
      
      const transaction = await contract.resellToken(nft.tokenId, price, {
        value: listingPrice,
      })
      
      await transaction.wait()
      toast.success('NFT listed for sale successfully!')
      loadMyNFTs()
    } catch (error) {
      console.error('Error reselling NFT:', error)
      toast.error('Failed to list NFT for sale')
    }
  }

  const formatPrice = (price: string) => {
    return `${parseFloat(price).toFixed(4)} ETH`
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const NFTCard = ({ nft, type }: { nft: NFT; type: 'owned' | 'listed' }) => {
    const [showResellForm, setShowResellForm] = useState(false)
    const [newPrice, setNewPrice] = useState('')

    const handleResell = () => {
      if (!newPrice || parseFloat(newPrice) <= 0) {
        toast.error('Please enter a valid price')
        return
      }
      resellNFT(nft, newPrice)
      setShowResellForm(false)
      setNewPrice('')
    }

    return (
      <div className="card hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-nft.png'
            }}
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            #{nft.tokenId}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {nft.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {nft.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              {type === 'owned' ? 'Owner' : 'Seller'}: {shortenAddress(nft.owner)}
            </span>
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(nft.price)}
            </span>
          </div>
          
          {type === 'owned' && (
            <div>
              {showResellForm ? (
                <div className="space-y-2">
                  <input
                    type="number"
                    step="0.001"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="input-field text-sm"
                    placeholder="New price (ETH)"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleResell}
                      className="flex-1 btn-primary text-sm"
                    >
                      List for Sale
                    </button>
                    <button
                      onClick={() => setShowResellForm(false)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowResellForm(true)}
                  className="w-full btn-primary"
                >
                  List for Sale
                </button>
              )}
            </div>
          )}
          
          {type === 'listed' && (
            <div className="text-center text-sm text-gray-500">
              Listed for sale
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar account={account} onConnect={connectWallet} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            My NFTs
          </h1>
          <p className="text-gray-600">
            Manage your NFT collection and listings
          </p>
        </div>

        {!account ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Please connect your wallet to view your NFTs
            </p>
            <button onClick={connectWallet} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setActiveTab('owned')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'owned'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Owned ({ownedNFTs.length})
                </button>
                <button
                  onClick={() => setActiveTab('listed')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'listed'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Listed ({listedNFTs.length})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeTab === 'owned' && ownedNFTs.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                      You don't own any NFTs yet
                    </div>
                    <p className="text-gray-400">
                      Mint your first NFT to get started!
                    </p>
                  </div>
                )}
                
                {activeTab === 'listed' && listedNFTs.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                      You haven't listed any NFTs for sale
                    </div>
                    <p className="text-gray-400">
                      List your owned NFTs to start selling!
                    </p>
                  </div>
                )}
                
                {activeTab === 'owned' && ownedNFTs.map((nft) => (
                  <NFTCard key={nft.tokenId} nft={nft} type="owned" />
                ))}
                
                {activeTab === 'listed' && listedNFTs.map((nft) => (
                  <NFTCard key={nft.tokenId} nft={nft} type="listed" />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
