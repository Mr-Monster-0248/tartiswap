<script lang="ts">
	import { ethersStore } from '$lib/stores/ethers.store';
</script>

<svelte:head>
	<title>TartiSwap</title>
</svelte:head>

{#if $ethersStore.status === 'NOT_CONNECTED'}
	<button on:click|preventDefault={$ethersStore.connect}>Launch DApp</button>
{:else if $ethersStore.status === 'CONNECTED'}
	<h1>MetaMask connected: {$ethersStore.account}</h1>
{:else if $ethersStore.status === 'UNINITIALIZED'}
	<h1>
		Your browser is incompatible, please install the MetaMask (or equivalent) extension to make it
		compatible with this application.
	</h1>
{/if}
