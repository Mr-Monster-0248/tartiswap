import { ethers } from 'ethers';
import tartiswapMeta from 'hardhat/artifacts/contracts/TartiSwap.sol/TartiSwap.json';
import type { TartiSwap } from 'hardhat/typechain';

export interface TartiPairInfo {
	address: string;
	token1Symbol: string;
	token2Symbol: string;
	token1Address: string;
	token2Address: string;
	token1Liquidity: ethers.BigNumber;
	token2Liquidity: ethers.BigNumber;
}

export function getTartiSwapContract(
	address: string,
	signer: ethers.providers.JsonRpcSigner
): TartiSwap {
	return new ethers.Contract(address, tartiswapMeta.abi, signer) as TartiSwap;
}

export async function getPairs(contract: TartiSwap): Promise<TartiPairInfo[]> {
	const nbPairs = (await contract.getNumberOfPairs()).toNumber();
	const pairs: TartiPairInfo[] = [];

	for (let i = 0; i < nbPairs; i++) {
		const [
			address,
			token1Symbol,
			token2Symbol,
			token1Address,
			token2Address,
			token1Liquidity,
			token2Liquidity
		] = await contract.getPairDetailsAtIndex(i);

		pairs.push({
			address,
			token1Symbol,
			token2Symbol,
			token1Address,
			token2Address,
			token1Liquidity,
			token2Liquidity
		});
	}

	return pairs;
}
