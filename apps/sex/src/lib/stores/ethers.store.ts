import { ethers } from 'ethers';
import { writable, get } from 'svelte/store';

interface EthersStore {
	status: 'CONNECTED' | 'NOT_CONNECTED' | 'INCOMPATIBLE' | 'UNINITIALIZED';
	provider: null | ethers.providers.Web3Provider;
	account: null | string;
	signer: null | ethers.providers.JsonRpcSigner;
	initialize: () => Promise<void>;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}

const initialState: EthersStore = {
	status: 'UNINITIALIZED',
	provider: null,
	account: null,
	signer: null,
	initialize: async () => {
		//
	},
	connect: async () => {
		console.error('Your browser is incompatible, please install the MetaMask extension');
	},
	disconnect: async () => {
		console.error('Your browser is incompatible, please install the MetaMask extension');
	}
};

function createEthersStore() {
	const store = writable<EthersStore>(initialState);

	/**
	 * Function to call to initialize the store during in an onMount lifecycle hook
	 */
	async function initialize() {
		if (get(store).status !== 'UNINITIALIZED') return;

		if (!window.ethereum) {
			store.update((_) => ({
				..._,
				status: 'INCOMPATIBLE'
			}));
		} else {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			store.update((_) => ({
				..._,
				status: 'NOT_CONNECTED',
				provider
			}));
		}
	}

	/**
	 * Function to connect your account to the provider
	 */
	async function connect() {
		const currentStatus = get(store).status;

		switch (currentStatus) {
			case 'CONNECTED':
				return;

			case 'INCOMPATIBLE':
				throw new Error(
					'Incompatible browser. Please install the MetaMask extension (or equivalent).'
				);

			case 'UNINITIALIZED':
				throw new Error('Ethers store must be initialized first');

			default:
				break;
		}

		const accounts: string[] = await window.ethereum.request({
			method: 'eth_requestAccounts'
		});

		if (!accounts.length) {
			throw new Error('Please allow access to at least an account');
		}

		const account = accounts[0];
		const signer = get(store).provider.getSigner();

		store.update((_) => ({
			..._,
			status: 'CONNECTED',
			account,
			signer
		}));
	}

	store.update((_) => ({
		..._,
		initialize,
		connect
	}));

	return {
		subscribe: store.subscribe
	};
}

export const ethersStore = createEthersStore();
