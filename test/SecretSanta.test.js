const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SecretSanta', function () {
  let santa, elfOne, elfTwo, gift;
  let nft;
  before(async () => {
    const [_santa, _elfOne, _elfTwo, _gift] = await ethers.getSigners();
    santa  = _santa;
    elfOne = _elfOne;
    elfTwo = _elfTwo;
    gift = _gift;

    const NFT = await ethers.getContractFactory('SecretSanta');
    nft = await NFT.deploy();
    await nft.deployed();

    //try {
    //  nft.connect(elfOne)
    //    .mint(1, { value: ethers.utils.parseEther('0.04') });
    //} catch(error) {
    //  console.log(error.message);
    //  expect(error.message).to.eq('fuck you')
    //} 

    //nft.connect(elfTwo)
    //    .mint(1, { value: ethers.utils.parseEther('0.04') });

    //const count = await nft.totalSupply();
    expect(count).to.eq(2);
    const Contract = await ethers.getContractFactory('SecretSanta');
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it('should allow elf one to deposit a gift', async () => {
   //  await contract.connect(elfOne).deposit(nft.address, 1);
    const elfs = await contract.connect(santa).niceList();
    expect(elfs.length).eq(1);
  });

  it('should allow elf one to deposit a gift', async () => {
    await contract.connect(elfTwo).deposit(nft.address, 2);
    const elfs = await contract.connect(santa).niceList();
    expect(elfs.length).eq(2);
  });

  it('should not allow an elf to deposit more than one gift', async () => {
    try {
      await contract.connect(elfOne).deposit(gift.address, 1);
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

  it('should allow elf two to withdraw gift', async () => {
    await contract.connect(elfTwo).withdraw();
  });


  it('should not allow withdrawls before the holidy');
  it('should prevent multiple withdrawls');
  it('should not return the elfs original gift');
});
