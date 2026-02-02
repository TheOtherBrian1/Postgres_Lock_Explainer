<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import DropDown from '$lib/components/drop_down.svelte';
	import Quote from '$lib/components/quote.svelte';
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

<DropDown title="Real world example">
	<p>
		Someone asked for my help removing a heavily partitioned table from their database. Everytime
		they tried to <CodeHighlight>DROP</CodeHighlight> it, they encountered the <CodeHighlight
			>out of shared memory</CodeHighlight
		> message.
	</p>
	<p>
		Each partition required an <CodeHighlight>ACCESS EXCLUSIVE</CodeHighlight> lock. Collectively, they
		used up more locks than the database could support.
	</p>
	<p>
		The solutions were trivial: remove the individual partitions in small batches or temporariliy
		increase the lock limit:
	</p>
	<CodeBlock label="modify max_locks_per_transaction">
		ALTER DATABASE &lt;db_name&gt; SET max_locks_per_transaction TO &lt;some_int_val&gt;
	</CodeBlock>

	<p>
		What wasn't trivial for me the first time around was interpretting the error message. Hopefully,
		this guide removes that ambiguity for others.
	</p>
</DropDown>
