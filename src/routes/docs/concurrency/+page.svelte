<script lang="ts">
	import NavBar from '$lib/components/navbar.svelte';
	import Header from '$lib/components/header.svelte';
	import LocksExplained from '$lib/content/locks/explainer.svelte';
	import Troubleshooting from '$lib/content/locks/troubleshooting/index.svelte';
	import LockChecker from '$lib/content/locks/tools/lock_checker.svelte';
	let activeView = $state(0);
</script>

{#snippet TabButton(viewIndex: number, label: string)}
	<button
		onclick={() => (activeView = viewIndex)}
		class="border-b-2 pb-3 text-sm font-medium transition-all duration-300 hover:text-[#FF3E00]
        {activeView === viewIndex
			? 'border-[#FF3E00] text-[#FF3E00]'
			: ' cursor-pointer border-transparent text-stone-400'}"
	>
		{label}
	</button>
{/snippet}

<div class="from-bg-[#F9F8F6] w-full bg-gradient-to-b to-white px-0 pt-4 md:px-20">
	<div class=" mx-auto max-w-[1164px] rounded-sm bg-[#f5f1eb] px-6 py-4">
		<NavBar />
		<Header
			title={'Concurrency'}
			subtitle={'How Postgres safely runs multiple queries simultaneously'}
		/>

		<div class="mx-auto mb-12 flex max-w-5xl justify-center gap-12 border-b border-stone-200 px-6">
			{@render TabButton(0, 'The Concept')}
			{@render TabButton(1, 'Lock Blocking Graph')}
			{@render TabButton(2, 'Troubleshooting')}
		</div>
		{#if activeView === 0}
			<LocksExplained />
		{:else if activeView === 1}
			<LockChecker />
		{:else}
			<Troubleshooting />
		{/if}
	</div>
</div>
