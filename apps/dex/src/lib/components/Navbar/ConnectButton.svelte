<script lang="ts">
	import { ethersStore } from '$lib/stores/ethers.store';

	let formatedAddress: string;

	$: if ($ethersStore.account) {
		formatedAddress = `${$ethersStore.account.slice(0, 6)}...${$ethersStore.account.slice(
			$ethersStore.account.length - 4,
			$ethersStore.account.length
		)}`;
	}
</script>

{#if $ethersStore.status !== 'CONNECTED'}
	<button
		class="p-2 px-3 rounded-2xl
    bg-violet-600 text-violet-200 
    hover:bg-violet-700 
    hover:text-violet-300"
		on:click={$ethersStore.connect}
	>
		Connect to wallet
	</button>
{:else}
	<div
		class="p-2 px-3 rounded-2xl border
    bg-violet-900 border-violet-400 text-violet-200 cursor-default"
	>
		{formatedAddress}
	</div>
{/if}
