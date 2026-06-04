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

<!-- <div class=" from-bg-[#F9F8F6] relative w-full px-0 md:px-20 md:pt-4"> -->
{@render children()}
<!-- </div> -->
