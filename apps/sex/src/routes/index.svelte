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

	$: if ($ethersStore.status === 'CONNECTED' && !tartiswap) {
		tartiswap = getTartiSwapContract(import.meta.env.VITE_TARTISWAP_ADDRESS, $ethersStore.signer);
		getPairs(tartiswap).then((pairs) => {
			availablePairs = pairs;

			if (pairs.length > 0) {
				fromCurrency = pairs[0].token1Symbol;
				toCurrency = pairs[0].token2Symbol;
			}
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

	$: if (!toCurrency || !possibleToCurrencies.includes(toCurrency)) {
		toCurrency = possibleToCurrencies[0];
	}

	$: selectedPair = availablePairs.find(
		(p) =>
			(p.token1Symbol === fromCurrency && p.token2Symbol === toCurrency) ||
			(p.token2Symbol === fromCurrency && p.token1Symbol === toCurrency)
	);

	$: tokenAddressToApprove = !selectedPair
		? '0x0000000000000000000000000000000000000000'
		: selectedPair.token1Symbol === fromCurrency
		? selectedPair.token1Address
		: selectedPair.token2Address;
</script>

<svelte:head>
	<title>TartiSwap</title>
</svelte:head>

{#if $ethersStore.status === 'NOT_CONNECTED'}
	<button on:click={$ethersStore.connect}>Connect</button>
{:else if $ethersStore.status === 'CONNECTED'}
	<h3>All tokens</h3>
	<ul>
		{#each Array.from(new Set(availablePairs
					.flatMap( (p) => [{ symbol: p.token1Symbol, address: p.token1Address }, { symbol: p.token2Symbol, address: p.token2Address }] )
					.map((p) => JSON.stringify(p)))).map((p) => JSON.parse(p)) as token}
			<li>{token.symbol}: {token.address}</li>
		{/each}
	</ul>

	<h2>Dex</h2>
	<div>
		<AmountAndCurrencyPicker {currencies} bind:currency={fromCurrency} bind:amount />
		<AmountAndCurrencyPicker
			currencies={possibleToCurrencies}
			bind:currency={toCurrency}
			bind:amount
		/>
	</div>

	{#if selectedPair}
		<h5>AMM to approve:</h5>
		<h4>{selectedPair.token1Symbol}/{selectedPair.token2Symbol}: {selectedPair.address}</h4>
		<h5>ERC20 to approve AMM spendings for:</h5>
		<h4>{fromCurrency}: {tokenAddressToApprove}</h4>
	{/if}
{/if}
