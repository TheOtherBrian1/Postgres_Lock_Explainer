<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import Header from '$lib/components/header.svelte';
	import { page } from '$app/state';

	let { children } = $props();
	const endpoints = [
		{
			path: '/',
			name: 'About'
		},
		{
			path: '/locks/concept',
			name: 'Concept'
		},
		{
			path: '/locks/locks_by_example',
			name: 'Locks by Example'
		},
		{
			path: '/locks/lock_tool',
			name: 'Lock Blocking Graph'
		},
		{
			path: '/locks/troubleshooting',
			name: 'Troubleshooting'
		},
		{
			path: '/locks/monitoring',
			name: 'Monitoring'
		}
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="from-bg-[#F9F8F6] w-full bg-gradient-to-b to-white px-0 pt-4 md:px-20">
	<div class=" mx-auto max-w-[1164px] rounded-sm bg-[#f5f1eb] px-6 py-4 pb-16">
		<Header title={'Postgres Locks Explained'} subtitle={'From novice to expert'} />

		<div class="mx-auto mb-12 flex max-w-5xl justify-center gap-12 border-b border-stone-200 px-6">
			{#each endpoints as { path, name }}
				<a
					href={path}
					class={`block cursor-pointer border-b-2   pb-3 text-sm font-medium transition-all duration-300  hover:text-[#FF3E00]
                ${page.url.pathname === path ? ' border-[#FF3E00] text-[#FF3E00]' : ' border-transparent text-stone-400'} `}
				>
					{name}
				</a>
			{/each}
		</div>
		{@render children()}
	</div>
</div>
