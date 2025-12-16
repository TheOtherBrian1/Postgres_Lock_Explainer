<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	// import CodeHighlight from "$lib/components/code_highlight.svelte";
</script>

<p>
	Postgres will only support a finite amount of object locks. Once the limit is reached, you will
	encounter the error
</p>

<!-- prettier-ignore -->
<CodeBlock>
ERROR: out of shared memory
SQL state: 53200
Hint: You might need to increase max_locks_per_transaction.
</CodeBlock>
