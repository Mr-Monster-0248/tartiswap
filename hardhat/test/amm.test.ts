import { expect } from "chai";
import { ethers } from "hardhat";
import { Biscotte, TartiAMM, Tartine } from "../typechain";
import { bigNumberWithDecimalsFrom } from "../utils/decimals";

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

    await tartine.faucet(bigNumberWithDecimalsFrom(100));
    await biscotte.faucet(bigNumberWithDecimalsFrom(100));

    tartiAmm = await TartiAMMFactory.deploy(
      tartine.address,
      biscotte.address,
      bigNumberWithDecimalsFrom(5),
      bigNumberWithDecimalsFrom(5)
    );
    await tartiAmm.deployed();

    await tartine.approve(tartiAmm.address, bigNumberWithDecimalsFrom(100));
    await biscotte.approve(tartiAmm.address, bigNumberWithDecimalsFrom(100));

    await tartiAmm.initializePair();
  });

  it("deploys correctly", async () => {
    const [owner] = await ethers.getSigners();

    expect(await tartine.balanceOf(owner.address)).to.equal(
      bigNumberWithDecimalsFrom(95)
    );
    expect(await biscotte.balanceOf(owner.address)).to.equal(
      bigNumberWithDecimalsFrom(95)
    );

    expect(await tartine.balanceOf(tartiAmm.address)).to.equal(
      bigNumberWithDecimalsFrom(5)
    );
    expect(await biscotte.balanceOf(tartiAmm.address)).to.equal(
      bigNumberWithDecimalsFrom(5)
    );
  });

  it("computes correctly the constant sum", async () => {
    const bsctAmountFromTrade = await tartiAmm.getExpectedReturnFromToken1Trade(
      bigNumberWithDecimalsFrom(20)
    );

    expect(bsctAmountFromTrade).to.equal(bigNumberWithDecimalsFrom(4));
  });

  it("receives the right BSCT amount when sending TRTN", async () => {
    const [owner] = await ethers.getSigners();

    await tartiAmm.tradeToken1ForToken2(bigNumberWithDecimalsFrom(20)); // Should trade 20 whole TRTN for 4 whole BSCT

    expect(await tartine.balanceOf(owner.address)).to.equal(
      bigNumberWithDecimalsFrom(75)
    );
    expect(await biscotte.balanceOf(owner.address)).to.equal(
      bigNumberWithDecimalsFrom(99)
    );

    expect(await tartine.balanceOf(tartiAmm.address)).to.equal(
      bigNumberWithDecimalsFrom(25)
    );
    expect(await biscotte.balanceOf(tartiAmm.address)).to.equal(
      bigNumberWithDecimalsFrom(1)
    );
  });
});
