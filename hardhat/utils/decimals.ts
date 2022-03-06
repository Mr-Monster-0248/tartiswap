import { ethers } from "hardhat";

export const decimals = ethers.BigNumber.from(10).pow(18);
export default decimals;

export const bigNumberWithDecimalsFrom = (num: number) => {
  return ethers.BigNumber.from(num).mul(decimals);
};
