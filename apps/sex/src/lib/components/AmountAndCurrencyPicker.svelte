<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let currencies: string[] = [];
</script>

<input
	type="number"
	placeholder="amount"
	on:change={(e) => dispatch('amount-change', e.currentTarget.value)}
/>
<select on:change={(e) => dispatch('currency-change', e.currentTarget.value)}>
	{#each currencies as currency}
		<option value={currency} label={currency} />
	{/each}
</select>
