<script lang="ts">
	// import { snippet } from 'svelte';

	let { error, understanding, fixes } = $props();
	
	// State for the active tab (defaults to 'error')
	let activeTab = $state('error');

	const tabs = [
		{ id: 'error', label: '1. The Error' },
		{ id: 'understanding', label: '2. Understanding it' },
		{ id: 'fixes', label: '3. Causes & Fixes' }
	];
</script>

<div class="border border-stone-200 rounded-lg overflow-hidden bg-white mb-8">
	<!-- Tab Headers -->
	<div class="flex border-b border-stone-200 bg-stone-50">
		{#each tabs as tab}
			<button
				onclick={() => activeTab = tab.id}
				class="flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 
                {activeTab === tab.id 
                    ? 'bg-white text-[#ff3e00] border-b-2 border-[#ff3e00]' 
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100 cursor-pointer'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="p-6 md:p-8 bg-white min-h-[300px]">
		{#if activeTab === 'error'}
			<div class="animate-in fade-in duration-300">
				{@render error()}
			</div>
		{:else if activeTab === 'understanding'}
			<div class="animate-in fade-in duration-300">
				{@render understanding()}
			</div>
		{:else if activeTab === 'fixes'}
			<div class="animate-in fade-in duration-300">
				{@render fixes()}
			</div>
		{/if}
	</div>
</div>