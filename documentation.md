Project 1: Simple NFT Marketplace
Overview
A basic NFT marketplace where users can mint, list, buy, and sell NFTs with IPFS integration for metadata storage.
Technical Stack

Smart Contracts: Solidity
Frontend: React/Next.js
Blockchain: Ethereum/Polygon
Storage: IPFS (Pinata/Web3.Storage)
Wallet Integration: MetaMask, WalletConnect

Smart Contract Architecture
NFTMarketplace.sol
solidity// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    
    address payable owner;
    uint256 listingPrice = 0.025 ether;
    
    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }
    
    mapping(uint256 => MarketItem) private idToMarketItem;
    
    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );
    
    constructor() ERC721("NFT Marketplace", "NFTM") {
        owner = payable(msg.sender);
    }
    
    function createToken(string memory tokenURI, uint256 price) 
        public payable returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, price);
        return newTokenId;
    }
    
    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must equal listing price");
        
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );
        
        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(tokenId, msg.sender, address(this), price, false);
    }
}
Frontend Components
Key Features

Mint NFT Page: Upload image/metadata, set price
Marketplace: Browse and purchase NFTs
My NFTs: View owned and listed NFTs
Wallet Connection: MetaMask integration

Tech Implementation

React hooks for state management
Web3.js or Ethers.js for blockchain interaction
IPFS client for file uploads
Responsive design with Tailwind CSS

API Endpoints

POST /api/upload-to-ipfs - Upload files to IPFS
GET /api/nft/:tokenId - Get NFT metadata
POST /api/mint - Mint new NFT

Database Schema (Optional - for caching)
sql-- NFTs table
CREATE TABLE nfts (
    id SERIAL PRIMARY KEY,
    token_id INTEGER UNIQUE,
    contract_address VARCHAR(42),
    owner_address VARCHAR(42),
    price DECIMAL(20,8),
    metadata_uri TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Deployment Guide

Deploy smart contract to testnet (Goerli/Mumbai)
Verify contract on Etherscan/Polygonscan
Deploy frontend to Vercel/Netlify
Set up IPFS pinning service
Configure environment variables