<script lang="ts">
	// import { snippet } from 'svelte';

	let { review, setup } = $props();

	// State for the active tab (defaults to 'error')
	let activeTab = $state('review');

	const tabs = [
		{ id: 'review', label: '1. Review' },
		{ id: 'setup', label: '2. Setup' }
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
		{#if activeTab === 'review'}
			<div class="animate-in fade-in duration-300">
				{@render review()}
			</div>
		{:else if activeTab === 'setup'}
			<div class="animate-in fade-in duration-300">
				{@render setup()}
			</div>
		{/if}
	</div>
</div>
