import { expect } from "chai";
import { ethers } from "hardhat";

describe("Tartine", function () {
  it("should allow faucet calls if enabled", async () => {
    const TartineFactory = await ethers.getContractFactory("Tartine");
    const tartine = await TartineFactory.deploy(true);
    await tartine.deployed();

    await tartine.faucet(42);

    const [signer] = await ethers.getSigners();

    const balance = await tartine.balanceOf(signer.address);

    expect(balance).to.equal(42);
  });

  it("should block faucet calls if disabled", async () => {
    const TartineFactory = await ethers.getContractFactory("Tartine");
    const tartine = await TartineFactory.deploy(false);
    await tartine.deployed();

    expect(tartine.faucet(42)).to.be.revertedWith("");
  });
});
