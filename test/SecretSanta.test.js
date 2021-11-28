const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SecretSanta', function () {
  let santa, elfOne, elfTwo, gift;
  let nft;
  before(async () => {
    const [_santa, _elfOne, _elfTwo, _elfThree] = await ethers.getSigners();
    santa  = _santa;
    elfOne = _elfOne;
    elfTwo = _elfTwo;
    elfThree = _elfThree;

    // Mint ERC721Mock tokens to each player
    const NFT = await ethers.getContractFactory('ERC721Mock');
    nft = await NFT.deploy('721Mock', 'MOCK');
    await nft.deployed();

    try {
      await nft.connect(santa).mint(elfOne.address, 1);
      expect(await nft.exists(1)).to.eq(true);

      await nft.connect(santa).mint(elfTwo.address, 2);
      expect(await nft.exists(2)).to.eq(true);

      await nft.connect(santa).mint(elfThree.address, 3);
      expect(await nft.exists(3)).to.eq(true);
    } catch(error) {
      console.log(error.message);
      expect(error)
    } 

    const Contract = await ethers.getContractFactory('SecretSanta');
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it('should allow elf one to deposit a gift', async () => {
    await nft.connect(elfOne).approve(contract.address, 1);
    await contract.connect(elfOne).deposit(nft.address, 1);
    const gave = await contract.connect(santa).gave(elfOne.address);
    expect(gave).eq(true);
  });

  it('should allow elf two to deposit a gift', async () => {
    await nft.connect(elfTwo).approve(contract.address, 2);
    await contract.connect(elfTwo).deposit(nft.address, 2);
    const gave = await contract.connect(santa).gave(elfTwo.address);
    expect(gave).eq(true);
  });

  it('should allow elf three to deposit a gift', async () => {
    await nft.connect(elfThree).approve(contract.address, 3);
    await contract.connect(elfThree).deposit(nft.address, 3);
    const gave = await contract.connect(santa).gave(elfThree.address);
    expect(gave).eq(true);
  });
  it('should not allow an elf to deposit more than one gift', async () => {
    try {
      await nft.connect(elfOne).mint(elfOne.address, 4);
      await nft.connect(elfOne).approve(contract.address, 4);
      await contract.connect(elfOne).deposit(nft.address, 4);
    } catch (error) {
      expect(error.message).to.include("Too generous");
    }
  });

  it('should not allow withdrawls unless deposit', async () => { 
    try {
      await contract.connect(santa).withdraw();
    } catch (error) {
      expect(error.message).to.include("Grinch")
    }
  });
  it('should allow elf one to withdraw gift', async () => {
    await contract.connect(elfOne).withdraw();
  });

  xit('should allow elf two to withdraw gift', async () => {
    await contract.connect(elfTwo).withdraw();
  });


  it('should not allow withdrawls before the holidy');
  it('should prevent multiple withdrawls', async () => {
    try {
      await contract.connect(elfOne).withdraw();
    } catch (error) {
      expect(error.message).to.include('Grinch');
    }

  });
  it('should not return the elfs original gift');
});
