<script lang="ts">
	import type { TartiPairInfo } from '$lib/contracts/tartiswap.contract';
	import { ethers } from 'ethers';

	import type { TartiAMM } from 'hardhat/typechain';

	export let amount: number;
	export let amm: TartiAMM;
	export let pair: TartiPairInfo;
	export let tokenSymbol: string;
	export let disabled: boolean;

	let loading = false;

	$: amountToTrade = amount ? ethers.utils.parseEther('' + amount) : ethers.BigNumber.from(0);

	async function trade() {
		loading = true;
		try {
			if (pair.token1Symbol === tokenSymbol) {
				await amm.tradeToken1ForToken2(amountToTrade);
			} else {
				await amm.tradeToken2ForToken1(amountToTrade);
			}
		} catch (err) {
			console.error(err);
		}
		loading = false;
	}
</script>

<button
	class="basis-1/2 grow px-3 py-2 rounded-2xl
	{disabled || loading
		? 'bg-violet-900 border border-violet-300 text-violet-200'
		: 'bg-violet-300 hover:bg-violet-200'}"
	on:click={trade}
	disabled={loading || disabled}
>
	{#if !loading}
		Trade {tokenSymbol}
	{:else}
		Trade in progress...
	{/if}
</button>
