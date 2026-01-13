const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let nftMarketplace;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nftMarketplace.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await nftMarketplace.name()).to.equal("NFT Afia Marketplace");
      expect(await nftMarketplace.symbol()).to.equal("NFTAM");
    });

    it("Should have correct listing price", async function () {
      expect(await nftMarketplace.getListingPrice()).to.equal(ethers.parseEther("0.025"));
    });
  });

  describe("NFT Creation", function () {
    it("Should create a new NFT", async function () {
      const tokenURI = "ipfs://test-uri";
      const price = ethers.parseEther("0.1");
      const listingPrice = await nftMarketplace.getListingPrice();

      await expect(
        nftMarketplace.connect(addr1).createToken(tokenURI, price, { value: listingPrice })
      ).to.emit(nftMarketplace, "MarketItemCreated");

      // Check that the NFT was created
      const marketItems = await nftMarketplace.fetchMarketItems();
      expect(marketItems.length).to.equal(1);
      expect(marketItems[0].tokenId).to.equal(1);
      expect(marketItems[0].price).to.equal(price);
      expect(marketItems[0].seller).to.equal(addr1.address);
      expect(marketItems[0].sold).to.equal(false);
    });

    it("Should fail if listing price is not paid", async function () {
      const tokenURI = "ipfs://test-uri";
      const price = ethers.parseEther("0.1");

      await expect(
        nftMarketplace.connect(addr1).createToken(tokenURI, price)
      ).to.be.revertedWith("Price must equal listing price");
    });

    it("Should fail if price is zero", async function () {
      const tokenURI = "ipfs://test-uri";
      const price = 0;
      const listingPrice = await nftMarketplace.getListingPrice();

      await expect(
        nftMarketplace.connect(addr1).createToken(tokenURI, price, { value: listingPrice })
      ).to.be.revertedWith("Price must be at least 1 wei");
    });
  });

  describe("NFT Purchase", function () {
    beforeEach(async function () {
      // Create an NFT first
      const tokenURI = "ipfs://test-uri";
      const price = ethers.parseEther("0.1");
      const listingPrice = await nftMarketplace.getListingPrice();
      
      await nftMarketplace.connect(addr1).createToken(tokenURI, price, { value: listingPrice });
    });

    it("Should allow purchase of NFT", async function () {
      const price = ethers.parseEther("0.1");
      
      await expect(
        nftMarketplace.connect(addr2).createMarketSale(1, { value: price })
      ).to.emit(nftMarketplace, "MarketItemSold");

      // Check that the NFT was sold
      const marketItems = await nftMarketplace.fetchMarketItems();
      expect(marketItems.length).to.equal(0);

      // Check that addr2 owns the NFT
      expect(await nftMarketplace.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should fail if wrong price is paid", async function () {
      const wrongPrice = ethers.parseEther("0.05");
      
      await expect(
        nftMarketplace.connect(addr2).createMarketSale(1, { value: wrongPrice })
      ).to.be.revertedWith("Please submit the asking price");
    });
  });

  describe("NFT Reselling", function () {
    beforeEach(async function () {
      // Create and purchase an NFT
      const tokenURI = "ipfs://test-uri";
      const price = ethers.parseEther("0.1");
      const listingPrice = await nftMarketplace.getListingPrice();
      
      await nftMarketplace.connect(addr1).createToken(tokenURI, price, { value: listingPrice });
      await nftMarketplace.connect(addr2).createMarketSale(1, { value: price });
    });

    it("Should allow owner to resell NFT", async function () {
      const newPrice = ethers.parseEther("0.2");
      const listingPrice = await nftMarketplace.getListingPrice();

      await expect(
        nftMarketplace.connect(addr2).resellToken(1, newPrice, { value: listingPrice })
      ).to.emit(nftMarketplace, "MarketItemCreated");

      // Check that the NFT is back in the marketplace
      const marketItems = await nftMarketplace.fetchMarketItems();
      expect(marketItems.length).to.equal(1);
      expect(marketItems[0].price).to.equal(newPrice);
      expect(marketItems[0].seller).to.equal(addr2.address);
    });

    it("Should fail if non-owner tries to resell", async function () {
      const newPrice = ethers.parseEther("0.2");
      const listingPrice = await nftMarketplace.getListingPrice();

      await expect(
        nftMarketplace.connect(addr1).resellToken(1, newPrice, { value: listingPrice })
      ).to.be.revertedWith("Only token owner can resell");
    });
  });

  describe("Fetching NFTs", function () {
    beforeEach(async function () {
      // Create multiple NFTs
      const tokenURI = "ipfs://test-uri";
      const price = ethers.parseEther("0.1");
      const listingPrice = await nftMarketplace.getListingPrice();
      
      await nftMarketplace.connect(addr1).createToken(tokenURI, price, { value: listingPrice });
      await nftMarketplace.connect(addr2).createToken(tokenURI, price, { value: listingPrice });
    });

    it("Should fetch market items correctly", async function () {
      const marketItems = await nftMarketplace.fetchMarketItems();
      expect(marketItems.length).to.equal(2);
    });

    it("Should fetch user's NFTs correctly", async function () {
      const userNFTs = await nftMarketplace.connect(addr1).fetchMyNFTs();
      expect(userNFTs.length).to.equal(0); // addr1 sold their NFT to marketplace
    });

    it("Should fetch listed items correctly", async function () {
      const listedItems = await nftMarketplace.connect(addr1).fetchItemsListed();
      expect(listedItems.length).to.equal(1);
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to update listing price", async function () {
      const newListingPrice = ethers.parseEther("0.05");
      
      await nftMarketplace.updateListingPrice(newListingPrice);
      expect(await nftMarketplace.getListingPrice()).to.equal(newListingPrice);
    });

    it("Should fail if non-owner tries to update listing price", async function () {
      const newListingPrice = ethers.parseEther("0.05");
      
      await expect(
        nftMarketplace.connect(addr1).updateListingPrice(newListingPrice)
      ).to.be.reverted;
    });

    it("Should allow owner to withdraw funds", async function () {
      // First create an NFT to generate some fees
      const tokenURI = "ipfs://test-uri";
      const price = ethers.parseEther("0.1");
      const listingPrice = await nftMarketplace.getListingPrice();
      
      await nftMarketplace.connect(addr1).createToken(tokenURI, price, { value: listingPrice });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await nftMarketplace.withdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
});
