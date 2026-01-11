<script>
	/** @type {{ items: import('svelte').Snippet[], not_p?: boolean }} */
	let { items, not_p } = $props();
</script>

<ol class=" ml-2 w-full list-none">
	{#each items as item, index}
		<li class="flex w-full items-start gap-3">
			<span
				class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
				>{index + 1}
			</span>
			{#if not_p}
				{@render item()}
			{:else}
				<p>
					{@render item()}
				</p>
			{/if}
		</li>
	{/each}
</ol>
