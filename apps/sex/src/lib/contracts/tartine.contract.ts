import { ethers } from 'ethers';
import tartineMeta from 'hardhat/artifacts/contracts/Tartine.sol/Tartine.json';
import type { Tartine } from 'hardhat/typechain';

export function getTartineContract(
	address: string,
	signer: ethers.providers.JsonRpcSigner
): Tartine {
	return new ethers.Contract(address, tartineMeta.abi, signer) as Tartine;
}
