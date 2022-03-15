import { ethers } from 'ethers';
import type { ERC20 } from 'hardhat/typechain';
import erc20Abi from './ERC20-abi.json';

export function getERC20ContractAt(address: string, signer: ethers.providers.JsonRpcSigner) {
	return new ethers.Contract(address, erc20Abi, signer) as ERC20;
}

export function getCustomContractAt<T>(
	address: string,
	contractInterface: ethers.ContractInterface,
	signer: ethers.providers.JsonRpcSigner
) {
	return new ethers.Contract(address, contractInterface, signer) as unknown as T;
}
