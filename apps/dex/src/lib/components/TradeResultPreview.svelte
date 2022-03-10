<script lang="ts">
	import type { TartiPairInfo } from '$lib/contracts/tartiswap.contract';
	import { ethers } from 'ethers';

	import type { TartiAMM } from 'hardhat/typechain';

	export let currencies: string[] = [];
	export let currency: string;
	export let amount: number = 0;
	export let pair: TartiPairInfo;
	export let amm: TartiAMM;

	let tradeResult: string;

	$: computedTradeAmount = amount ? ethers.utils.parseEther('' + amount) : ethers.BigNumber.from(0);

	$: if (amount > 0) {
		const simulate =
			currency === pair.token1Symbol ? amm.simulateToken2Trade : amm.simulateToken1Trade;

		simulate(computedTradeAmount).then((r) => {
			tradeResult = ethers.utils.formatEther(r);
		});
	} else {
		tradeResult = '0';
	}
</script>

<input value={tradeResult} placeholder="amount" disabled />
<select bind:value={currency}>
	{#each currencies as currency}
		<option value={currency} label={currency} />
	{/each}
</select>
