'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { NFTMarketplace__factory } from '../../typechain-types'

export default function MintPage() {
  const [account, setAccount] = useState<string>('')
  const [contract, setContract] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  })
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  })

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

  const uploadToIPFS = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload-to-ipfs', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS')
      }

      const data = await response.json()
      return data.ipfsHash
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      throw error
    }
  }

  const createMetadata = async (imageHash: string) => {
    const metadata = {
      name: formData.name,
      description: formData.description,
      image: `ipfs://${imageHash}`,
      attributes: []
    }

    try {
      const response = await fetch('/api/upload-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      })

      if (!response.ok) {
        throw new Error('Failed to upload metadata')
      }

      const data = await response.json()
      return data.ipfsHash
    } catch (error) {
      console.error('Error uploading metadata:', error)
      throw error
    }
  }

  const mintNFT = async () => {
    if (!file || !formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all fields and upload an image')
      return
    }

    if (!contract) {
      toast.error('Please connect your wallet first')
      return
    }

    setLoading(true)

    try {
      // Upload image to IPFS
      const imageHash = await uploadToIPFS(file)
      
      // Create and upload metadata
      const metadataHash = await createMetadata(imageHash)
      
      // Get listing price
      const listingPrice = await contract.getListingPrice()
      
      // Mint NFT
      const price = ethers.parseEther(formData.price)
      const transaction = await contract.createToken(metadataHash, price, {
        value: listingPrice,
      })
      
      await transaction.wait()
      
      toast.success('NFT minted successfully!')
      
      // Reset form
      setFile(null)
      setPreview('')
      setFormData({ name: '', description: '', price: '' })
      
    } catch (error) {
      console.error('Error minting NFT:', error)
      toast.error('Failed to mint NFT')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar account={account} onConnect={connectWallet} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Mint Your NFT
            </h1>
            <p className="text-gray-600">
              Upload your digital asset and create a unique NFT for the marketplace
            </p>
          </div>

          <div className="card p-6">
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div>
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto max-h-48 rounded-lg"
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {isDragActive
                        ? 'Drop the image here'
                        : 'Drag and drop an image, or click to select'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter NFT name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Enter NFT description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  placeholder="0.01"
                />
              </div>
            </div>

            {/* Mint Button */}
            <button
              onClick={mintNFT}
              disabled={loading || !account}
              className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Minting...
                </div>
              ) : (
                'Mint NFT'
              )}
            </button>

            {!account && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Please connect your wallet to mint an NFT
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
