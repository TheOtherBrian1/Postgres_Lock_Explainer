<script lang="ts">
	// import { snippet } from 'svelte';

	let { Summary, Advanced_Explanation } = $props();

	// State for the active tab (defaults to 'error')
	let activeTab = $state('Summary');

	const tabs = [
		{ id: 'Summary', label: 'Summary' },
		{ id: 'Advanced_Explanation', label: 'Advanced_Explanation' }
		// { id: 'fixes', label: 'Causes & Fixes' }
	];
</script>

<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white">
	<!-- Tab Headers -->
	<div class="flex border-b border-stone-200 bg-stone-50">
		{#each tabs as tab}
			<button
				onclick={() => (activeTab = tab.id)}
				class="flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200
                {activeTab === tab.id
					? 'border-b-2 border-[#ff3e00] bg-white text-[#ff3e00]'
					: 'cursor-pointer text-stone-500 hover:bg-stone-100 hover:text-stone-800'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="min-h-[300px] bg-white p-6 md:p-8">
		{#if activeTab === 'Summary'}
			<div class="animate-in fade-in duration-300">
				{@render Summary()}
			</div>
		{:else if activeTab === 'Advanced_Explanation'}
			<div class="animate-in fade-in duration-300">
				{@render Advanced_Explanation()}
			</div>
			<!-- {:else if activeTab === 'fixes'}
			<div class="animate-in fade-in duration-300">
				{@render fixes()}
			</div>
		-->
		{/if}
	</div>
</div>
