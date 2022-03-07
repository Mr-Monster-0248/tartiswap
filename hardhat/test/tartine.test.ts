import { expect } from "chai";
import { ethers } from "hardhat";
import { Tartine } from "../typechain";

describe("Tartine", () => {
  let tartine: Tartine;

  beforeEach(async () => {
    const TartineFactory = await ethers.getContractFactory("Tartine");
    tartine = await TartineFactory.deploy(true);
    await tartine.deployed();
  });

  it("has TRTN symbol", async () => {
    expect(await tartine.symbol()).to.equal("TRTN");
  });

  it("allows faucet calls if enabled", async () => {
    await tartine.faucet(42);

    const [signer] = await ethers.getSigners();

    const balance = await tartine.balanceOf(signer.address);

    expect(balance).to.equal(42);
  });

  it("blocks faucet calls if disabled", async () => {
    expect(tartine.faucet(42)).to.be.revertedWith("");
  });
});
