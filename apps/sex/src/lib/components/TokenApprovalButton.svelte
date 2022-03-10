<script lang="ts">
	import type { TartiPairInfo } from '$lib/contracts/tartiswap.contract';
	import { ethersStore } from '$lib/stores/ethers.store';
	import { BigNumber, ethers } from 'ethers';
	import type { ERC20 } from 'hardhat/typechain/ERC20';

	export let tokenToApprove: ERC20;
	export let selectedPair: TartiPairInfo;
	export let amount: number;

	export let allowanceGranted: boolean = false;

	let loading = false;
	let allowance: ethers.BigNumber;

	$: computedAmount = amount
		? ethers.BigNumber.from(amount).mul(BigNumber.from(10).pow(18))
		: BigNumber.from(0);

	$: if (tokenToApprove && amount) {
		loading = true;
		tokenToApprove.allowance($ethersStore.account, selectedPair.address).then((a) => {
			allowance = a;
			loading = false;
		});
	}

	$: allowanceGranted = allowance >= computedAmount;

	async function approveTokenSpending() {
		if (!tokenToApprove) {
			alert('No token selected.');
			return;
		}

		if (allowanceGranted) return;

		loading = true;
		debugger;
		await tokenToApprove.approve(
			selectedPair.address,
			computedAmount.mul(BigNumber.from(10).pow(6))
		);
		loading = false;
	}
</script>

{#if computedAmount.gt(0) && !allowanceGranted}
	<button on:click={approveTokenSpending} disabled={loading}>
		<slot />
	</button>
{/if}
