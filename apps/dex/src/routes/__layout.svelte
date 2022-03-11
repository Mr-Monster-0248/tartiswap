<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { ethersStore } from '$lib/stores/ethers.store';
	import GlobalAppLoadingIndicator from '$lib/components/GlobalAppLoadingIndicator.svelte';

	let loaded = false;

	onMount(() => {
		$ethersStore.initialize();
		loaded = true;
	});
</script>

<main>
	{#if loaded}
		<slot />
	{:else}
		<GlobalAppLoadingIndicator />
	{/if}
</main>
