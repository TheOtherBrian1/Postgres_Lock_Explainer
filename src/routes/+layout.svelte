<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import GithubWhite from '$lib/assets/GitHub_Invertocat_White.svg';
	import GithubBlack from '$lib/assets/GitHub_Invertocat_Black.svg';

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
		<div class="h-6 w-6 cursor-pointer">
			<div class="mb-1 h-0.5 w-full bg-black"></div>
			<div class="mb-1 h-0.5 w-full bg-black"></div>
			<div class="h-0.5 w-full bg-black"></div>
		</div>

		<div
			class="absolute top-10 right-0 z-20 mx-auto hidden w-48 flex-col rounded-xl border border-stone-200 bg-white p-2 shadow-xl group-focus-within:flex"
		>
			<div class="flex flex-col gap-1">
				{#each endpoints as { path, name }}
					<a
						href={path}
						class={`block cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200
                ${
									page.url.pathname === path
										? 'bg-[#FF3E00]/5 text-[#FF3E00]'
										: 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
								}`}
					>
						{name}
					</a>
				{/each}
			</div>

			<div class="my-2 border-t border-stone-100"></div>

			<a
				href="https://github.com/TheOtherBrian1/Postgres_Lock_Explainer"
				class="flex w-full cursor-pointer items-center justify-between rounded-md bg-stone-50 px-3 py-2 text-sm font-medium text-stone-600 transition-all duration-300 hover:bg-stone-100 hover:text-[#FF3E00]"
			>
				<span class="whitespace-nowrap">GitHub Star</span>
				<img src={GithubBlack} alt="Star on Github" class="h-4 w-4 opacity-75" />
			</a>
		</div>
	</div>

	<div class="  relative mx-auto max-w-[1164px] rounded-sm bg-[#f5f1eb] px-6 pb-16">
		<a
			href="https://github.com/TheOtherBrian1/Postgres_Lock_Explainer"
			class="absolute top-0 right-0 hidden h-[70px] w-[70px] items-center justify-center
    bg-stone-800 transition-colors duration-200 [clip-path:polygon(100%_0,0_0,100%_100%)]
    hover:bg-stone-900 md:inline-flex"
		>
			<img src={GithubWhite} alt="github star link" class="mt-1 mb-7 ml-6 h-6 w-6" />
		</a>
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
