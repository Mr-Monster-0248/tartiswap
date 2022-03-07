import { expect } from "chai";
import { ethers } from "hardhat";
import { Biscotte } from "../typechain";

describe("Biscotte", () => {
  let biscotte: Biscotte;

  beforeEach(async () => {
    const biscotteFactory = await ethers.getContractFactory("Biscotte");
    biscotte = await biscotteFactory.deploy(true);
    await biscotte.deployed();
  });

  it("has BSCT symbol", async () => {
    expect(await biscotte.symbol()).to.equal("BSCT");
  });

  it("allows faucet calls if enabled", async () => {
    await biscotte.faucet(42);

    const [signer] = await ethers.getSigners();

    const balance = await biscotte.balanceOf(signer.address);

    expect(balance).to.equal(42);
  });

  it("blocks faucet calls if disabled", async () => {
    expect(biscotte.faucet(42)).to.be.revertedWith("");
  });
});
