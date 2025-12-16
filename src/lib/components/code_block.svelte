<script lang="ts">
	import hljs from 'highlight.js/lib/core';
	import pgsql from 'highlight.js/lib/languages/pgsql';
	import 'highlight.js/styles/base16/google-dark.css';
	import type { Snippet } from 'svelte';

	hljs.registerLanguage('pgsql', pgsql);

	function highlight(node: HTMLElement) {
		hljs.highlightElement(node);
	}

	interface Props {
		children: Snippet;
		label?: string;
	}

	let { children, label }: Props = $props();
</script>

<div class="mt-2 mb-6 w-full overflow-hidden rounded-xl bg-[#1d1c21] shadow-inner">
	{#if label}
		<div
			class="flex items-center border-b border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-stone-400"
		>
			{label}
		</div>
	{/if}
	<div class="overflow-x-auto rounded-sm p-2 text-xs leading-relaxed md:text-sm">
		<pre><code use:highlight class="language-pgsql rounded-sm p-0">{@render children()}</code></pre>
	</div>
</div>
