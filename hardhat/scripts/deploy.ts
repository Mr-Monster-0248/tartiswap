import { ethers } from "hardhat";

const CONTRACT_NAME = "Greeter";
const CONTRACT_CONSTRUCTOR_PARAMS = ["Hello, Hardhat!"];

async function deploy() {
  const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = await ContractFactory.deploy(...CONTRACT_CONSTRUCTOR_PARAMS);

  await contract.deployed();
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
