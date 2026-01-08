<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		items: Snippet[];
		color?: 'red';
	}

	let { items, color }: Props = $props();
</script>

<ul class={`mb-8 ml-4 list-disc space-y-3 ${color === 'red' ? 'marker:text-[#ff3e00]' : ''}`}>
	{#each items as item}
		<li class="pl-1">{@render item()}</li>
	{/each}
</ul>
