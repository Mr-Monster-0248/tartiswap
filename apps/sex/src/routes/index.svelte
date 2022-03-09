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

	$: {
		if ($ethersStore.status === 'CONNECTED') {
			tartiswap = getTartiSwapContract(import.meta.env.VITE_TARTISWAP_ADDRESS, $ethersStore.signer);
			getPairs(tartiswap).then((pairs) => {
				availablePairs = pairs;
			});
		}
	}
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
	<AmountAndCurrencyPicker
		currencies={['TRTN', 'BSCT', 'ETH']}
		on:amount-change={(e) => console.log(e.detail)}
		on:currency-change={(e) => console.log(e.detail)}
	/>
	<AmountAndCurrencyPicker />
</div>
