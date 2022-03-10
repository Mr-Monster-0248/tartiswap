<script lang="ts">
	export let currencies: string[] = [];
	export let amount: number = 0;
	export let currency: string;
</script>

<input type="number" placeholder="amount" bind:value={amount} />
<select bind:value={currency}>
	{#each currencies as currency}
		<option value={currency} label={currency} />
	{/each}
</select>
