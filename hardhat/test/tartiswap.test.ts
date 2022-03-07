import { expect } from "chai";
import { ethers } from "hardhat";
import { Biscotte, Tartine, TartiSwap } from "../typechain";
import { bigNumberWithDecimalsFrom } from "../utils/decimals";

describe("TartiSwap", () => {
  let tartiswap: TartiSwap;

  async function deployTartiSwap() {
    const TartiSwapFactory = await ethers.getContractFactory("TartiSwap");
    const tartiswap = await TartiSwapFactory.deploy();
    await tartiswap.deployed();
    return tartiswap;
  }

  async function deployTartineAndBiscotte() {
    const TartineFactory = await ethers.getContractFactory("Tartine");
    const BiscotteFactory = await ethers.getContractFactory("Biscotte");

    const tartine = await TartineFactory.deploy(true);
    const biscotte = await BiscotteFactory.deploy(true);
    await tartine.deployed();
    await biscotte.deployed();

    return [tartine, biscotte];
  }

  async function faucetDecimalsFromTartineAndBiscotte(
    decimals: number,
    tartine: Tartine,
    biscotte: Biscotte
  ) {
    await tartine.faucet(bigNumberWithDecimalsFrom(decimals));
    await biscotte.faucet(bigNumberWithDecimalsFrom(decimals));
  }

  async function deployAndInitializeAmm(
    tartine: Tartine | Biscotte,
    biscotte: Biscotte | Tartine,
    initialLiquidity: any, // ethers.BigNumber, actually, but typescript...
    tartiswap: TartiSwap
  ) {
    const TartiAMMFactory = await ethers.getContractFactory("TartiAMM");

    const tartiAmm = await TartiAMMFactory.deploy(
      tartine.address,
      biscotte.address,
      initialLiquidity,
      initialLiquidity
    );
    await tartiAmm.deployed();

    await tartine.approve(
      tartiAmm.address,
      bigNumberWithDecimalsFrom(initialLiquidity)
    );
    await biscotte.approve(
      tartiAmm.address,
      bigNumberWithDecimalsFrom(initialLiquidity)
    );

    // Initialize AMM
    await tartiAmm.initializePair(tartiswap.address);

    return tartiAmm;
  }

  beforeEach(async () => {
    tartiswap = await deployTartiSwap();
  });

  it("deploys correctly", async () => {});

  it("has 0 pairs listed by default", async () => {
    expect(await tartiswap.getNumberOfPairs()).to.equal(0);
  });

  it("updates the pairs list when a new pair is initialized", async () => {
    const [tartine, biscotte] = await deployTartineAndBiscotte();
    await faucetDecimalsFromTartineAndBiscotte(100, tartine, biscotte);

    // Deploy and initialize a first AMM
    await deployAndInitializeAmm(
      tartine,
      biscotte,
      bigNumberWithDecimalsFrom(5),
      tartiswap
    );
    expect(await tartiswap.getNumberOfPairs()).to.equal(1);

    // Deploy and initialize a second AMM
    await deployAndInitializeAmm(
      tartine,
      biscotte,
      bigNumberWithDecimalsFrom(10),
      tartiswap
    );
    expect(await tartiswap.getNumberOfPairs()).to.equal(2);
  });

  it("provides data about the registered pairs", async () => {
    const [tartine, biscotte] = await deployTartineAndBiscotte();
    await faucetDecimalsFromTartineAndBiscotte(100, tartine, biscotte);

    const pair1Liquidities = bigNumberWithDecimalsFrom(5);
    const pair1 = await deployAndInitializeAmm(
      tartine,
      biscotte,
      pair1Liquidities,
      tartiswap
    );

    const [
      p1AmmAddress,
      p1Token1Symbol,
      p1Token2Symbol,
      p1Token1Address,
      p1Token2Address,
      p1Token1Liquidity,
      p1Token2Liquidity,
    ] = await tartiswap.getPairDetailsAtIndex(0);

    expect(p1AmmAddress).to.equal(pair1.address);
    expect(p1Token1Symbol).to.equal(await tartine.symbol());
    expect(p1Token2Symbol).to.equal(await biscotte.symbol());
    expect(p1Token1Address).to.equal(tartine.address);
    expect(p1Token2Address).to.equal(biscotte.address);
    expect(p1Token1Liquidity).to.equal(pair1Liquidities);
    expect(p1Token2Liquidity).to.equal(pair1Liquidities);

    const pair2Liquidities = bigNumberWithDecimalsFrom(10);
    const pair2 = await deployAndInitializeAmm(
      biscotte,
      tartine,
      pair2Liquidities,
      tartiswap
    );

    const [
      p2AmmAddress,
      p2Token1Symbol,
      p2Token2Symbol,
      p2Ttoken1Address,
      p2Token2Address,
      p2Token1Liquidity,
      p2Token2Liquidity,
    ] = await tartiswap.getPairDetailsAtIndex(1);

    expect(p2AmmAddress).to.equal(pair2.address);
    expect(p2Token1Symbol).to.equal(await biscotte.symbol());
    expect(p2Token2Symbol).to.equal(await tartine.symbol());
    expect(p2Ttoken1Address).to.equal(biscotte.address);
    expect(p2Token2Address).to.equal(tartine.address);
    expect(p2Token1Liquidity).to.equal(pair2Liquidities);
    expect(p2Token2Liquidity).to.equal(pair2Liquidities);
  });
});
