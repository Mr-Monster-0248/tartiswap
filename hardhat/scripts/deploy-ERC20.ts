import { ethers } from "hardhat";

async function deploy() {
  const TartineFactory = await ethers.getContractFactory("Tartine");
  const BiscotteFactory = await ethers.getContractFactory("Biscotte");

  const tartine = await TartineFactory.deploy(true);
  const biscotte = await BiscotteFactory.deploy(true);

  await tartine.deployed();
  await biscotte.deployed();
}

deploy()
  .then(() => {
    console.log("ERC20 deployed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
