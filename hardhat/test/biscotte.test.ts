import { expect } from "chai";
import { ethers } from "hardhat";

describe("Biscotte", function () {
  it("should allow faucet calls if enabled", async () => {
    const biscotteFactory = await ethers.getContractFactory("Biscotte");
    const biscotte = await biscotteFactory.deploy(true);
    await biscotte.deployed();

    await biscotte.faucet(42);

    const [signer] = await ethers.getSigners();

    const balance = await biscotte.balanceOf(signer.address);

    expect(balance).to.equal(42);
  });

  it("should block faucet calls if disabled", async () => {
    const biscotteFactory = await ethers.getContractFactory("Biscotte");
    const biscotte = await biscotteFactory.deploy(false);
    await biscotte.deployed();

    expect(biscotte.faucet(42)).to.be.revertedWith("");
  });
});
