<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	// import CodeHighlight from "$lib/components/code_highlight.svelte";
</script>

<p>
	A query exceeded the <a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LOCK-TIMEOUT"
		>lock_timeout</a
	>
	setting, so it was terminated.
</p>
<!-- prettier-ignore -->
<CodeBlock>
canceling statement due to lock timeout
</CodeBlock>
