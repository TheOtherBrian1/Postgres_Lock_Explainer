<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: string;
	}
	let { title, children }: Props = $props();

	// State for the active tab (defaults to 'error')
	let toggleActive = $state(false);
</script>

<div class="mb-2 overflow-hidden rounded-lg border border-stone-200 bg-white">
	<button
		onclick={() => (toggleActive = !toggleActive)}
		class="flex w-full flex-1 cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium transition-colors duration-200
        {toggleActive
			? 'border-b-2 border-[#ff3e00] bg-white text-[#ff3e00]'
			: ' text-stone-500 hover:bg-stone-100 hover:text-stone-800'}"
	>
		<span>{title}</span>
		<div
			class="ransition-colors relative bottom-[2px] h-2 w-2 border-t-2 border-r-2 duration-200 {toggleActive
				? 'top-[2px] bottom-0 rotate-315 border-[#ff3e00]'
				: 'rotate-135 border-stone-500'}"
		></div>
	</button>

	{#if toggleActive}
		<div class="min-h-[300px] bg-white p-6 md:p-8">
			<div class="animate-in fade-in duration-300">
				{@render children()}
			</div>
		</div>
	{/if}
</div>
