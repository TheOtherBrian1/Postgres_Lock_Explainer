<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();
</script>

<quote class=" mb-2 inline-block border-l-2 border-gray-500 py-[1px] pl-4 italic">
	{@render children()}
</quote>
