import { ethers } from "hardhat";
import { Baguette } from "../typechain/Baguette";
import { Biscotte } from "../typechain/Biscotte";
import { Tartine } from "../typechain/Tartine";
import { TartiSwap } from "../typechain/TartiSwap";
import { bigNumberWithDecimalsFrom } from "../utils/decimals";

async function deployTartiSwap() {
  const TartiSwapFactory = await ethers.getContractFactory("TartiSwap");
  const tartiswap = await TartiSwapFactory.deploy();
  await tartiswap.deployed();
  return tartiswap;
}

async function deployTartineAndBiscotteAndBaguette() {
  const TartineFactory = await ethers.getContractFactory("Tartine");
  const BiscotteFactory = await ethers.getContractFactory("Biscotte");
  const BaguetteFactory = await ethers.getContractFactory("Baguette");

  const tartine = await TartineFactory.deploy(true);
  const biscotte = await BiscotteFactory.deploy(true);
  const baguette = await BaguetteFactory.deploy(true);
  await tartine.deployed();
  await biscotte.deployed();
  await baguette.deployed();

  return [tartine, biscotte, baguette];
}

async function faucetDecimalsFromTartineAndBiscotteAndBaguette(
  decimals: number,
  tartine: Tartine,
  biscotte: Biscotte,
  baguette: Baguette
) {
  await tartine.faucet(bigNumberWithDecimalsFrom(decimals));
  await biscotte.faucet(bigNumberWithDecimalsFrom(decimals));
  await baguette.faucet(bigNumberWithDecimalsFrom(decimals));
}

async function deployAndInitializeAmm(
  tartine: Tartine | Biscotte | Baguette,
  biscotte: Biscotte | Tartine | Baguette,
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

async function deployAll() {
  console.log("Deploying Tartine and Biscotte...");
  const [tartine, biscotte, baguette] =
    await deployTartineAndBiscotteAndBaguette();
  console.log("Tartine deployed at " + tartine.address);
  console.log("Biscotte deployed at " + biscotte.address);
  console.log("Baguette deployed at " + baguette.address);

  console.log("Deploying TartiSwap...");
  const tartiswap = await deployTartiSwap();
  console.log("TartiSwap deployed at " + tartiswap.address);

  console.log("Funding deploying account with a little *coup de pouce*");
  await faucetDecimalsFromTartineAndBiscotteAndBaguette(
    100000,
    tartine,
    biscotte,
    baguette
  );
  console.log("*coup de pouce* succeeded");

  console.log("Deploying and initializing TRTN/BSCT pair...");
  const trtnBsctPair = await deployAndInitializeAmm(
    tartine,
    biscotte,
    bigNumberWithDecimalsFrom(50000),
    tartiswap
  );
  console.log("TRTN/BSCT pair deployed at " + trtnBsctPair.address);

  console.log("Deploying and initializing BGTT/TRTN pair...");
  const bgttTrtnPair = await deployAndInitializeAmm(
    baguette,
    tartine,
    bigNumberWithDecimalsFrom(50000),
    tartiswap
  );
  console.log("BGTT/TRTN pair deployed at " + bgttTrtnPair.address);
}

deployAll()
  .then(() => {
    console.log("deployment successfull");
  })
  .catch(console.error);
