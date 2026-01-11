<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		notItalic?: boolean;
		source?: {
			label: string;
			link: string;
		};
	}
	let { children, source, notItalic }: Props = $props();
</script>

<quote
	class={` mb-2 inline-block w-full border-l-2  border-gray-500 py-[1px] pl-4 ${notItalic ? '' : 'italic'}`}
>
	{@render children()}
	{#if source}
		<div>- <a href={source.link}>{source.label}</a></div>
	{/if}
</quote>
