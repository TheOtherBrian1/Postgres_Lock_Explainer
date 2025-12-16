<script lang="ts">
	import NavBar from '$lib/components/navbar.svelte';
	import Header from '$lib/components/header.svelte';
	import { page } from '$app/state';

	let { children } = $props();
	const endpoints = [
		{
			path: '/docs/concurrency/locks/concept',
			name: 'Concept'
		},
		{
			path: '/docs/concurrency/locks/lock_tool',
			name: 'Lock Blocking Graph'
		},
		{
			path: '/docs/concurrency/locks/troubleshooting',
			name: 'Troubleshooting'
		}
	];
</script>

<div class="from-bg-[#F9F8F6] w-full bg-gradient-to-b to-white px-0 pt-4 md:px-20">
	<div class=" mx-auto max-w-[1164px] rounded-sm bg-[#f5f1eb] px-6 py-4">
		<NavBar />
		<Header
			title={'Concurrency'}
			subtitle={'How Postgres safely runs multiple queries simultaneously'}
		/>

		<div class="mx-auto mb-12 flex max-w-5xl justify-center gap-12 border-b border-stone-200 px-6">
			{#each endpoints as { path, name }}
				<a
					href={path}
					class={`block cursor-pointer border-b-2   pb-3 text-sm font-medium transition-all duration-300 hover:text-[#FF3E00] 
                ${page.url.pathname === path ? ' border-[#FF3E00] text-[#FF3E00]' : ' border-transparent text-stone-400'} `}
				>
					{name}
				</a>
			{/each}
		</div>
		{@render children()}
	</div>
</div>
