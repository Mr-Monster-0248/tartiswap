import { ethers } from 'ethers';

export async function initializeDappFeatures() {
	if (!window.ethereum)
		throw new Error(
			'This browser does not provide the required window.ethereum feature. Please install the MetaMask extension.'
		);

	const provider = new ethers.providers.Web3Provider(window.ethereum);

	const signer = await provider.getSigner();
	const accounts = await provider.listAccounts();

	return { provider, signer, accounts };
}
