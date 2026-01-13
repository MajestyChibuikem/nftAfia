import { ethers, ContractTransactionResponse } from 'ethers';

export interface MarketItem {
  tokenId: bigint;
  seller: string;
  owner: string;
  price: bigint;
  sold: boolean;
}

export interface NFTMarketplace {
  createToken(tokenURI: string, price: bigint, overrides?: any): Promise<ContractTransactionResponse>;
  createMarketSale(tokenId: bigint, overrides?: any): Promise<ContractTransactionResponse>;
  resellToken(tokenId: bigint, price: bigint, overrides?: any): Promise<ContractTransactionResponse>;
  fetchMarketItems(): Promise<MarketItem[]>;
  fetchMyNFTs(): Promise<MarketItem[]>;
  fetchItemsListed(): Promise<MarketItem[]>;
  getListingPrice(): Promise<bigint>;
  updateListingPrice(listingPrice: bigint): Promise<ContractTransactionResponse>;
  withdraw(): Promise<ContractTransactionResponse>;
  tokenURI(tokenId: bigint): Promise<string>;
  ownerOf(tokenId: bigint): Promise<string>;
}

export class NFTMarketplace__factory {
  static connect(address: string, signerOrProvider: ethers.Signer | ethers.Provider): NFTMarketplace {
    return new ethers.Contract(address, [], signerOrProvider) as unknown as NFTMarketplace;
  }
}
