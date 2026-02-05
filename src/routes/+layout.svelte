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
	<link rel="icon" type="image/x-icon" href={favicon} />
</svelte:head>

<div class=" from-bg-[#F9F8F6] relative w-full px-0 md:px-20 md:pt-4">
	<div
		aria-label="show menu"
		tabindex="1"
		role="button"
		class="cursor group absolute top-8 right-8 z-20 md:hidden"
	>
		<div class="h-6 w-6">
			<div class="mb-1 h-0.5 w-full bg-black"></div>
			<div class="mb-1 h-0.5 w-full bg-black"></div>
			<div class="h-0.5 w-full bg-black"></div>
		</div>
		<div
			class=" absolute
				 top-8 right-0 z-10 mx-auto mb-12 hidden max-w-5xl justify-center gap-12 border-b border-stone-200 bg-[#f8f8f5] p-4 px-6 shadow-2xl group-focus-within:block md:flex"
		>
			{#each endpoints as { path, name }}
				<a
					href={path}
					class={`block cursor-pointer   pb-3 text-sm font-medium transition-all duration-300  hover:text-[#FF3E00]
                ${page.url.pathname === path ? ' border-[#FF3E00] text-[#FF3E00]' : ' border-transparent text-stone-400'} `}
				>
					{name}
				</a>
			{/each}
		</div>
	</div>

	<div class=" mx-auto max-w-[1164px] rounded-sm bg-[#f5f1eb] px-6 py-4 pb-16">
		<Header title={'Postgres Locks Explained'} subtitle={'From novice to expert'} />

		<div
			class="mx-auto mb-12 hidden max-w-5xl justify-center gap-12 border-b border-stone-200 px-6 md:flex"
		>
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
