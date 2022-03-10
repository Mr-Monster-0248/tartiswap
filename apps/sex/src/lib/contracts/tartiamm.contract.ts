import { ethers } from 'ethers';
import tartiAmmMeta from 'hardhat/artifacts/contracts/TartiAMM.sol/TartiAMM.json';
import type { TartiAMM } from 'hardhat/typechain';

export function getTartiAmmContractAt(address: string, signer: ethers.providers.JsonRpcSigner) {
	return new ethers.Contract(address, tartiAmmMeta.abi, signer) as TartiAMM;
}
