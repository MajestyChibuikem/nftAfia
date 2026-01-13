# NFT Afia Marketplace

A decentralized NFT marketplace built with Next.js, Solidity, and IPFS for minting, buying, and selling NFTs.

## Features

- 🎨 **Mint NFTs**: Upload images and create unique NFTs with metadata
- 🛒 **Buy NFTs**: Purchase NFTs from the marketplace
- 📈 **Sell NFTs**: List your owned NFTs for sale
- 💼 **Wallet Integration**: MetaMask support for transactions
- 🌐 **IPFS Storage**: Decentralized storage for images and metadata
- 📱 **Responsive Design**: Modern UI that works on all devices
- ⚡ **Fast Transactions**: Optimized smart contracts for gas efficiency

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Blockchain**: Ethereum/Polygon
- **Storage**: IPFS (Pinata)
- **Wallet**: MetaMask, Ethers.js
- **UI Components**: Headless UI, Heroicons

## Prerequisites

- Node.js 18+ 
- MetaMask browser extension
- API keys for:
  - Pinata (IPFS storage)
  - Ethereum/Polygon RPC endpoints
  - Etherscan API (for contract verification)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nft-afia-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your API keys in `.env.local`:
   ```env
   # IPFS Storage - Pinata
   PINATA_API_KEY=your_pinata_api_key_here
   PINATA_SECRET_KEY=your_pinata_secret_key_here
   PINATA_JWT=your_pinata_jwt_here

   # Blockchain RPC URLs
   ETHEREUM_RPC_URL=your_ethereum_rpc_url_here
   POLYGON_RPC_URL=your_polygon_rpc_url_here

   # For testnet development
   GOERLI_RPC_URL=your_goerli_rpc_url_here
   MUMBAI_RPC_URL=your_mumbai_rpc_url_here

   # Blockchain Explorer API
   ETHERSCAN_API_KEY=your_etherscan_api_key_here

   # Contract addresses (after deployment)
   NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address_here

   # Hardhat
   PRIVATE_KEY=your_wallet_private_key_for_deployment
   ```

4. **Compile smart contracts**
   ```bash
   npm run compile
   ```

5. **Deploy smart contract** (choose network)
   ```bash
   # For testnet
   npm run deploy mumbai
   
   # For mainnet
   npm run deploy polygon
   ```

6. **Update contract address**
   After deployment, copy the contract address and update `NEXT_PUBLIC_CONTRACT_ADDRESS` in your `.env.local`

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Smart Contract Features

### NFTMarketplace.sol
- **ERC-721 Standard**: Compliant with NFT standards
- **Marketplace Functions**: List, buy, and resell NFTs
- **Security**: Reentrancy protection and access controls
- **Gas Optimization**: Efficient contract design

### Key Functions
- `createToken()`: Mint new NFTs
- `createMarketSale()`: Purchase NFTs
- `resellToken()`: List owned NFTs for sale
- `fetchMarketItems()`: Get all listed NFTs
- `fetchMyNFTs()`: Get user's owned NFTs
- `fetchItemsListed()`: Get user's listed NFTs

## API Endpoints

### `/api/upload-to-ipfs`
Uploads images to IPFS using Pinata
- **Method**: POST
- **Body**: FormData with image file
- **Returns**: IPFS hash and gateway URL

### `/api/upload-metadata`
Uploads NFT metadata to IPFS
- **Method**: POST
- **Body**: JSON metadata object
- **Returns**: IPFS hash and gateway URL

## Usage Guide

### Minting an NFT
1. Connect your MetaMask wallet
2. Navigate to "Mint NFT" page
3. Upload an image (supports JPG, PNG, GIF, WebP)
4. Fill in name, description, and price
5. Click "Mint NFT" and confirm transaction

### Buying an NFT
1. Browse the marketplace
2. Click "Buy NFT" on any listed item
3. Confirm the transaction in MetaMask
4. NFT will be transferred to your wallet

### Selling an NFT
1. Go to "My NFTs" page
2. Select "Owned" tab
3. Click "List for Sale" on any owned NFT
4. Set a new price and confirm transaction

## Deployment

### Smart Contract Deployment
```bash
# Deploy to testnet
npm run deploy mumbai

# Deploy to mainnet
npm run deploy polygon

# Verify contract
npm run verify polygon <contract-address>
```

### Frontend Deployment
The frontend can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**

### Environment Setup for Production
1. Set up production environment variables
2. Deploy smart contract to mainnet
3. Update contract address in production environment
4. Configure IPFS gateway for production

## Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Environment Variables**: Use secure environment variable management
- **Smart Contract**: Audit contracts before mainnet deployment
- **Access Controls**: Implement proper access controls in contracts
- **Input Validation**: Validate all user inputs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the smart contract code

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced search and filtering
- [ ] NFT collections
- [ ] Royalty system
- [ ] Auction functionality
- [ ] Mobile app
- [ ] Analytics dashboard
