<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	export let disabled: boolean = false;

	function emitClick() {
		dispatch('click');
	}
</script>

<button
	class="hover:shadow-none rounded-2xl w-1/4 px-2 py-3 shadow mx-auto mt-10
  {disabled
		? 'bg-violet-900 border border-violet-300 text-violet-200'
		: 'bg-violet-300 hover:bg-violet-200'}"
	on:click={emitClick}
	{disabled}
>
	<slot />
</button>
