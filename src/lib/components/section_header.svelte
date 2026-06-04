<script lang="ts">
	let { children, color = null } = $props();
</script>

<div class="mb-3 w-full rounded-lg border-b border-stone-800 bg-stone-900 backdrop-blur-sm">
	<h4 class="flex items-center gap-2 text-xl font-bold text-stone-100 md:text-2xl">
		{#if !color}
			<span class="h-16 w-2 rounded-full bg-sky-500"></span>
		{:else if color === 'red'}
			<span class="h-16 w-2 rounded-full bg-[#ff3e00]"></span>
		{:else}
			<span class="h-16 w-2 rounded-full bg-yellow-500"></span>
		{/if}
		{@render children()}
	</h4>
</div>
