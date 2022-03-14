<script lang="ts">
	import AmountAndCurrencyPicker from '$lib/components/AmountAndCurrencyPicker.svelte';
	import TokenApprovalButton from '$lib/components/TokenApprovalButton.svelte';
	import TradeButton from '$lib/components/TradeButton.svelte';
	import TradeResultPreview from '$lib/components/TradeResultPreview.svelte';
	import { getERC20ContractAt } from '$lib/contracts/erc20.contract';
	import { getTartiAmmContractAt } from '$lib/contracts/tartiamm.contract';
	import {
		getPairs,
		getTartiSwapContract,
		type TartiPairInfo
	} from '$lib/contracts/tartiswap.contract';
	import { fly } from 'svelte/transition';
	import { ethersStore } from '$lib/stores/ethers.store';
	import { ethers } from 'ethers';
	import type { ERC20, TartiSwap } from 'hardhat/typechain';

	let tartiswap: TartiSwap;
	let availablePairs: TartiPairInfo[] = [];
	let fromCurrency: string = '';
	let toCurrency: string = '';
	let amount: number;
	let maxAvailableAmount: ethers.BigNumber = ethers.BigNumber.from(0);
	let allowanceGranted;
	let tokenToApprove: ERC20;

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

	$: if (selectedPair != null) {
		const tokenAddress =
			selectedPair.token1Symbol === fromCurrency
				? selectedPair.token1Address
				: selectedPair.token2Address;

		tokenToApprove = getERC20ContractAt(tokenAddress, $ethersStore.signer);
	}

	$: if (tokenToApprove) {
		tokenToApprove.balanceOf($ethersStore.account).then((balance) => {
			maxAvailableAmount = balance;
		});
	}

	$: tartiAmm = selectedPair
		? getTartiAmmContractAt(selectedPair.address, $ethersStore.signer)
		: null;
</script>

{#if $ethersStore.status === 'CONNECTED'}
	<section class="flex flex-col pt-20 justify-center align-center px-[25%] min-h-[33%]">
		<div class="flex flex-col">
			<AmountAndCurrencyPicker {currencies} bind:currency={fromCurrency} bind:amount />
			<p class="my-2 mx-5 text-violet-200">
				Maximum available: {ethers.utils.formatUnits(maxAvailableAmount, 18)}
			</p>

			<div class="border-b border-violet-200 my-3" />

			<TradeResultPreview
				{amount}
				bind:currency={toCurrency}
				amm={tartiAmm}
				pair={selectedPair}
				currencies={possibleToCurrencies}
			/>

			<div class="flex flex-row mt-3 space-x-4">
				<TokenApprovalButton bind:amount {selectedPair} {tokenToApprove} bind:allowanceGranted>
					{#if allowanceGranted}
						{fromCurrency} approved
					{:else}
						Approve {fromCurrency}
					{/if}
				</TokenApprovalButton>

				{#if allowanceGranted}
					<TradeButton
						{amount}
						amm={tartiAmm}
						pair={selectedPair}
						tokenSymbol={fromCurrency}
						disabled={!allowanceGranted}
					/>
				{/if}
			</div>
		</div>
	</section>
{/if}
