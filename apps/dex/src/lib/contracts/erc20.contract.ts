import { ethers } from 'ethers';
import type { ERC20 } from 'hardhat/typechain';
import erc20Abi from './ERC20-abi.json';

export function getERC20ContractAt(address: string, signer: ethers.providers.JsonRpcSigner) {
	return new ethers.Contract(address, erc20Abi, signer) as ERC20;
}
