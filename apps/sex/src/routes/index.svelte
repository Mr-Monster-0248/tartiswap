<script lang="ts">
	import AmountAndCurrencyPicker from '$lib/components/AmountAndCurrencyPicker.svelte';
	import {
		getPairs,
		getTartiSwapContract,
		type TartiPairInfo
	} from '$lib/contracts/tartiswap.contract';
	import { ethersStore } from '$lib/stores/ethers.store';
	import type { TartiSwap } from 'hardhat/typechain';

	let tartiswap: TartiSwap;
	let availablePairs: TartiPairInfo[] = [];
	let fromCurrency: string;
	let toCurrency: string;
	let amount: number;

	$: if ($ethersStore.status === 'CONNECTED') {
		tartiswap = getTartiSwapContract(import.meta.env.VITE_TARTISWAP_ADDRESS, $ethersStore.signer);
		getPairs(tartiswap).then((pairs) => {
			availablePairs = pairs;
		});
	}

	$: currencies = Array.from(
		new Set(availablePairs.flatMap((p) => [p.token1Symbol, p.token2Symbol]))
	);

	$: possibleToCurrencies = Array.from(
		new Set(
			availablePairs.flatMap((p) => {
				if (p.token1Symbol === fromCurrency) return p.token2Symbol;
				if (p.token2Symbol === fromCurrency) return p.token1Symbol;
				return [];
			})
		)
	);
</script>

<svelte:head>
	<title>TartiSwap</title>
</svelte:head>

{#if $ethersStore.status === 'NOT_CONNECTED'}
	<button on:click={$ethersStore.connect}>Connect</button>
{/if}

<div>
	{#each availablePairs as pair}
		<p>{pair.token1Symbol} / {pair.token2Symbol} : {pair.address}</p>
	{/each}
</div>

<div>
	<AmountAndCurrencyPicker {currencies} bind:currency={fromCurrency} bind:amount />
	<AmountAndCurrencyPicker
		currencies={possibleToCurrencies}
		bind:currency={toCurrency}
		bind:amount
	/>
</div>
