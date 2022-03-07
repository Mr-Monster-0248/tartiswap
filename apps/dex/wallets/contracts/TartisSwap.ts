import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import tartineJSON from 'hardhat/artifacts/contracts/Tartine.sol/Tartine.json';
import { Tartine } from 'hardhat/typechain';

export const useTartine = (
  address?: string,
  signer?: ethers.providers.JsonRpcSigner,
) => {
  const { library } = useWeb3React<ethers.providers.Web3Provider>();
  const contractAddress = process.env.TARTINE_CONTRACT_ADDRESS ?? address;
  const provider = signer ?? library;

  const tartine = new ethers.Contract(
    contractAddress,
    tartineJSON.abi,
    provider,
  ) as Tartine;

  return { tartine };
};
