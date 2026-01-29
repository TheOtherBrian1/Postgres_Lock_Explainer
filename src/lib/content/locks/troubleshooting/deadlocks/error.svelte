<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import DropDown from '$lib/components/drop_down.svelte';

</script>

<p class="p">
	When two queries wait on each other's locks and neither can finish, we call that a "deadlock".
</p>
<p class="p">
	To prevent them from indefinitely waiting, Postgres chooses one of the conflicting queries to kill
	and then returns the error <CodeHighlight>deadlock detected</CodeHighlight>:
</p>
<CodeBlock>ERROR: 'deadlock detected'</CodeBlock>

<DropDown title='Real world example'>
	<p>
		As I belabor many times throughout this section, deadlocks are rare and often negligible errors. I, though, recall one case where <CodeHighlight>INSERT ON CONFLICT</CodeHighlight> queries were interrupted enough by deadlocks that it affected an app's usability.
	</p>
	<p>
		the <CodeHighlight>INSERT</CodeHighlight> portion would fail due to <CodeHighlight>UNIQUE</CodeHighlight> requirements, but it still held onto the lock on the original value.
	</p>
	<p>
		When the query transitioned to <CodeHighlight>UPDATE</CodeHighlight>, it would then target another ID value. Another <CodeHighlight>INSERT ON CONFLICT</CodeHighlight> would target the same IDs in reverse, leading to deadlocks on an <CodeHighlight>UNIQUE INDEX</CodeHighlight> 
	</p>
	<p>
		The solution normally would be to refactor to avoid <CodeHighlight>ON CONFLICT</CodeHighlight> altogether.
	</p>
	<p>
		However, by increasing hardware resources, optomizing some CPU intensive queries, and adding indexes to foreign key columns, we were able to speed up the database as a whole.
	</p>
	<p>
		When all queries speed up, they're less likely to overlap during execution, so the <CodeHighlight>ON CONFLICT</CodeHighlight> queries stopped interfering with each otger. Technically, they still caused deadlocks, but the occurrences reduced enough that it was considered acceptable for the product's requirements.
	</p>
</DropDown>
