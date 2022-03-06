import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Biscotte, TartiAMM, Tartine } from "../typechain";

describe("TartiAMM", () => {
  let tartine: Tartine;
  let biscotte: Biscotte;
  let tartiAmm: TartiAMM;

  beforeEach(async () => {
    const TartineFactory = await ethers.getContractFactory("Tartine");
    const BiscotteFactory = await ethers.getContractFactory("Biscotte");
    const TartiAMMFactory = await ethers.getContractFactory("TartiAMM");

    tartine = await TartineFactory.deploy(true);
    biscotte = await BiscotteFactory.deploy(true);
    await tartine.deployed();
    await biscotte.deployed();

    await tartine.faucet(100);
    await biscotte.faucet(100);

    tartiAmm = await TartiAMMFactory.deploy(
      tartine.address,
      biscotte.address,
      5,
      5
    );
    await tartiAmm.deployed();

    await tartine.approve(tartiAmm.address, 100);
    await biscotte.approve(tartiAmm.address, 100);

    await tartiAmm.initializePair();
  });

  it("deploys correctly", async () => {
    const [owner] = await ethers.getSigners();

    expect(await tartine.balanceOf(owner.address)).to.equal(95);
    expect(await biscotte.balanceOf(owner.address)).to.equal(95);

    expect(await tartine.balanceOf(tartiAmm.address)).to.equal(5);
    expect(await biscotte.balanceOf(tartiAmm.address)).to.equal(5);
  });

  it("computes correctly the constant sum", async () => {
    const bsctAmountFromTrade = await tartiAmm.getExpectedReturnFromToken1Trade(
      20
    );

    expect(bsctAmountFromTrade).to.equal(4);
  });

  it("receives the right BSCT amount when sending TRTN", async () => {
    const [owner] = await ethers.getSigners();

    await tartiAmm.tradeToken1ForToken2(20); // Should trade 20 TRTN for 4 BSCT

    expect(await tartine.balanceOf(owner.address)).to.equal(75);
    expect(await biscotte.balanceOf(owner.address)).to.equal(99);

    expect(await tartine.balanceOf(tartiAmm.address)).to.equal(25);
    expect(await biscotte.balanceOf(tartiAmm.address)).to.equal(1);
  });
});
