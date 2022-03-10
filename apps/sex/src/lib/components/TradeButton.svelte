<script lang="ts">
	import type { TartiPairInfo } from '$lib/contracts/tartiswap.contract';
	import { ethers } from 'ethers';

	import type { TartiAMM } from 'hardhat/typechain';

	export let amount: number;
	export let amm: TartiAMM;
	export let pair: TartiPairInfo;
	export let tokenSymbol: string;

	let loading = false;

	$: amountToTrade = amount ? ethers.utils.parseEther('' + amount) : ethers.BigNumber.from(0);

	async function trade() {
		loading = true;
		if (pair.token1Symbol === tokenSymbol) {
			await amm.tradeToken1ForToken2(amountToTrade);
		} else {
			await amm.tradeToken2ForToken1(amountToTrade);
		}
		loading = false;
		alert(`Traded ${amount} ${tokenSymbol}`);
	}
</script>

<button on:click={trade} disabled={loading || amountToTrade.eq(0)}>
	{#if !loading}
		Trade {tokenSymbol}
	{:else}
		Trade in progress...
	{/if}
</button>
