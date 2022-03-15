<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { ethersStore } from '$lib/stores/ethers.store';
	import GlobalAppLoadingIndicator from '$lib/components/GlobalAppLoadingIndicator.svelte';
	import Navbar from '$lib/components/Navbar/Navbar.svelte';

	let loaded = false;

	onMount(() => {
		$ethersStore.initialize();
		loaded = true;
	});
</script>

<svelte:head>
	<title>TartiSwap</title>
</svelte:head>

<main class="bg-violet-900 h-screen">
	{#if loaded}
		<Navbar />
		<slot />
	{:else}
		<GlobalAppLoadingIndicator />
	{/if}
</main>
