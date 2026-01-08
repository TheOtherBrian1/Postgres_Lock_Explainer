<script>
	/** @type {{ items: import('svelte').Snippet[] }} */
	let { items } = $props();
</script>

<ol class=" ml-2 list-none">
	{#each items as item, index}
		<li class="flex items-start gap-3">
			<span
				class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
				>{index + 1}
			</span>
			<p>
				{@render item()}
			</p>
		</li>
	{/each}
</ol>
