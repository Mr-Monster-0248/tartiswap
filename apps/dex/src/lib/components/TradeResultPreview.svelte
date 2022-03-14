<script lang="ts">
	import type { TartiPairInfo } from '$lib/contracts/tartiswap.contract';
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions
	} from '@rgossiaux/svelte-headlessui';
	import { fade } from 'svelte/transition';
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

<div class="flex justify-between border-violet-200 border-2 rounded-3xl p-4 bg-violet-600">
	<input
		value={tradeResult}
		placeholder="0.0"
		disabled
		class="w-full border-r-2 font-semibold border-violet-200 focus:outline-none bg-violet-600"
	/>

	<div class="pl-4">
		<Listbox value={currency} on:change={(e) => (currency = e.detail)} let:open>
			<ListboxButton>
				{currency}
			</ListboxButton>

			{#if open}
				<div transition:fade>
					<ListboxOptions
						unmount={false}
						class="absolute z-10 mt-1 bg-violet-200 shadow-lg max-h-56 rounded-md py-1 overflow-auto focus:outline-none"
					>
						{#each currencies as curr}
							<ListboxOption
								value={curr}
								class="px-4 py-2 hover:bg-violet-400 active:bg-violet-400 focus:bg-violet-400 cursor-pointer"
							>
								{curr}
							</ListboxOption>
						{/each}
					</ListboxOptions>
				</div>
			{/if}
		</Listbox>
	</div>
</div>
