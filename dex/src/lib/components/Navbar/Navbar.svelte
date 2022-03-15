<script>
	import { ethersStore } from '$lib/stores/ethers.store';

	import ConnectButton from './ConnectButton.svelte';
</script>

<nav class="bg-violet-900 w-screen p-4">
	<div class="flex justify-between items-center">
		<h1 class="text-violet-200 text-xl">TartiSwap</h1>
		<ul class="flex space-x-5 text-violet-200 text-base">
			<li><a href="/" class="hover:underline">Exchange</a></li>
			{#if $ethersStore.status === 'CONNECTED'}
				<li><a href="/faucet" class="hover:underline">Faucet</a></li>
			{/if}
		</ul>
		<ConnectButton />
	</div>
</nav>
