import { ethers } from 'ethers';

export interface MarketItem {
  tokenId: ethers.BigNumber;
  seller: string;
  owner: string;
  price: ethers.BigNumber;
  sold: boolean;
}

export interface NFTMarketplace {
  createToken(tokenURI: string, price: ethers.BigNumber, overrides?: any): Promise<ethers.ContractTransaction>;
  createMarketSale(tokenId: ethers.BigNumber, overrides?: any): Promise<ethers.ContractTransaction>;
  resellToken(tokenId: ethers.BigNumber, price: ethers.BigNumber, overrides?: any): Promise<ethers.ContractTransaction>;
  fetchMarketItems(): Promise<MarketItem[]>;
  fetchMyNFTs(): Promise<MarketItem[]>;
  fetchItemsListed(): Promise<MarketItem[]>;
  getListingPrice(): Promise<ethers.BigNumber>;
  updateListingPrice(listingPrice: ethers.BigNumber): Promise<ethers.ContractTransaction>;
  withdraw(): Promise<ethers.ContractTransaction>;
  tokenURI(tokenId: ethers.BigNumber): Promise<string>;
  ownerOf(tokenId: ethers.BigNumber): Promise<string>;
}

export class NFTMarketplace__factory {
  static connect(address: string, signerOrProvider: ethers.Signer | ethers.Provider): NFTMarketplace {
    return new ethers.Contract(address, [], signerOrProvider) as NFTMarketplace;
  }
}
