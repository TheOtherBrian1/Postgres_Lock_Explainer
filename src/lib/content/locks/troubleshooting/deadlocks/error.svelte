<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
</script>

<p class="p">
	When two queries wait on each other's locks and neither can finish, we call that a "deadlock".
</p>
<p class="p">
	To prevent them from indefinitely waiting, Postgres chooses one of the conflicting queries to kill
	and then returns the error <CodeHighlight>deadlock detected</CodeHighlight>:
</p>
<CodeBlock>ERROR: 'deadlock detected'</CodeBlock>
