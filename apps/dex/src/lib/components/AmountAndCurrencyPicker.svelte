<script lang="ts">
	import {
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption
	} from '@rgossiaux/svelte-headlessui';
	import { fade } from 'svelte/transition';

	export let currencies: string[] = [];
	export let amount: number;
	export let currency: string;
</script>

<div class="flex justify-between border-dutchwhite border-2 rounded-3xl p-4">
	<input
		type="number"
		placeholder="amount"
		min="0"
		bind:value={amount}
		class="w-full border-r-2 font-semibold border-dutchwhite focus:outline-none"
	/>

	<div class="pl-4">
		<Listbox value={currency} on:change={(e) => (currency = e.detail)} let:open>
			<ListboxButton>
				{currency}
			</ListboxButton>
			{#if open}
				<div transition:fade class="">
					<ListboxOptions
						unmount={false}
						class="absolute z-10 mt-1 bg-white shadow-lg max-h-56 rounded-md py-1 overflow-auto focus:outline-none"
					>
						{#each currencies as curr}
							<ListboxOption
								value={curr}
								class="px-4 py-2 hover:bg-orchidpink active:bg-orchidpink focus:bg-orchidpink cursor-pointer"
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

<style lang="scss">
	svg {
		polygon {
			fill: red;
		}
	}
</style>
