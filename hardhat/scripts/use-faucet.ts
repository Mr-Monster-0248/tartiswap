import { ethers } from "hardhat";

async function useFaucet() {
  const tartine = await ethers.getContractAt(
    "Tartine",
    "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"
  );

  await tartine.deployed();

  console.log(await tartine.faucet(1000000000));
}

useFaucet();
