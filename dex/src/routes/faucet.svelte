<script lang="ts">
	import FaucetButton from '$lib/components/FaucetButton.svelte';
	import { getCustomContractAt } from '$lib/contracts/erc20.contract';
	import { ethersStore } from '$lib/stores/ethers.store';
	import tartineMeta from 'hardhat/artifacts/contracts/Tartine.sol/Tartine.json';
	import biscotteMeta from 'hardhat/artifacts/contracts/Biscotte.sol/Biscotte.json';
	import baguetteMeta from 'hardhat/artifacts/contracts/Baguette.sol/Baguette.json';
	import type { Baguette, Biscotte, Tartine } from 'hardhat/typechain';
	import { ethers } from 'ethers';

	const tartine: Tartine = getCustomContractAt(
		import.meta.env.VITE_TARTINE_ADDRESS,
		tartineMeta.abi,
		$ethersStore.signer
	);

	const biscotte: Biscotte = getCustomContractAt(
		import.meta.env.VITE_BISCOTTE_ADDRESS,
		biscotteMeta.abi,
		$ethersStore.signer
	);

	const baguette: Baguette = getCustomContractAt(
		import.meta.env.VITE_BAGUETTE_ADDRESS,
		baguetteMeta.abi,
		$ethersStore.signer
	);

	let tartineDisable = true;
	let biscotteDisable = true;
	let baguetteDisable = true;

	let faucetTartine: () => void;
	let faucetBiscotte: () => void;
	let faucetBaguette: () => void;

	$: if ($ethersStore.status === 'CONNECTED') {
		faucetTartine = () => {
			tartineDisable = true;
			tartine
				.faucet(ethers.utils.parseEther('100'))
				.then(() => {
					console.log("you've been givent 100 Tartine");
				})
				.catch(console.error)
				.finally(() => {
					tartineDisable = false;
				});
		};

		faucetBiscotte = () => {
			biscotteDisable = true;
			biscotte
				.faucet(ethers.utils.parseEther('100'))
				.then(() => {
					console.log("you've been givent 100 Biscotte");
				})
				.catch(console.error)
				.finally(() => {
					biscotteDisable = false;
				});
		};

		faucetBaguette = () => {
			baguetteDisable = true;
			baguette
				.faucet(ethers.utils.parseEther('100'))
				.then(() => {
					console.log("you've been givent 100 Baguette");
				})
				.catch(console.error)
				.finally(() => {
					baguetteDisable = false;
				});
		};

		tartineDisable = false;
		biscotteDisable = false;
		baguetteDisable = false;
	}
</script>

{#if $ethersStore.status === 'CONNECTED'}
	<div class="flex flex-col space-y-3">
		<FaucetButton on:click={faucetTartine} disabled={tartineDisable}>
			Give me 100 Tartine
		</FaucetButton>
		<FaucetButton on:click={faucetBiscotte} disabled={biscotteDisable}>
			Give me 100 Biscotte
		</FaucetButton>
		<FaucetButton on:click={faucetBaguette} disabled={baguetteDisable}
			>Give me 100 Baguette
		</FaucetButton>
	</div>
{/if}
