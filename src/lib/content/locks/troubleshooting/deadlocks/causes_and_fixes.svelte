<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import NumberedList from '$lib/components/lists/numbered_list.svelte';
</script>

<p class="p">
	There is no magic setting that can fix deadlocks because they're not caused by any distinct set
	up. They are a side-effect a overlapping queries taking locks on shared resources in conflicting
	orders.
</p>
<p class="p">
	As stated in the "Understanding section", in most cases, you can ignore them as one-off events.
	The fix, if necessary, is to:
</p>

{#snippet item1()}
	Speed up queries with optomization techniques or hardware improvements, so they're less likely to
	overlap
{/snippet}
{#snippet item2()}
	Be conservative with transactions that perform multiple statements, such as multiple <CodeHighlight
		>UPDATES</CodeHighlight
	> queries.
	<!-- prettier-ignore-->
	<CodeBlock>
BEGIN;
UPDATE some_table SET some_col = some_val WHERE id = 1;
UPDATE some_table SET some_col = some_val WHERE id = 2;
...
COMMIT;
	</CodeBlock>
	Some built in compound operations, such as <CodeHighlight>UPSERTS</CodeHighlight><sup
		><a class="a" href="https://www.dbvis.com/thetable/postgresql-upsert-insert-on-conflict-guide/"
			>(INSERT ON CONFLICT)</a
		></sup
	>
	and <CodeHighlight>MERGES</CodeHighlight> are also more vulnerable to these errors.
{/snippet}
{#snippet item3()}
	Use a Postgres linter, like <a class="a" href="https://squawkhq.com/">squawkhq</a> when issuing migrations
{/snippet}
<NumberedList items={[item1, item2, item3]} />

<p class="p">
	When you encounter the error, filter your logs for the keywords <CodeHighlight
		>deadlock detected</CodeHighlight
	>. In the entry's <CodeHighlight>detail</CodeHighlight> field, it'll show you what queries conflicted:
</p>
<!-- prettier-ignore -->
<CodeBlock>
Process 1007982 waits for ShareLock on transaction 441394; blocked by process 1007981.
Process 1007981 waits for ShareLock on transaction 441400; blocked by process 1007982.

Process 1007982:
UPDATE some_table
SET some_col = some_val
WHERE id = 1;

Process 1007981:
UPDATE some_table
SET some_col = some_val
WHERE id = 2;
</CodeBlock>

<p class="p">
	Unfortunately, when bundling queries together between <CodeHighlight>BEGIN/COMMIT</CodeHighlight> blocks,
	such as:
</p>

<!-- prettier-ignore -->
<CodeBlock>
BEGIN;
	UPDATE row 2; -- lock on row 2
	SELECT 1; -- does nothing
COMMIT;
</CodeBlock>

<p class="p">
	The error logs will only capture the last query (<CodeHighlight>SELECT 1</CodeHighlight>), even if
	earlier statements in the transaction contributed to the problematic lock. This can make debugging
	a bit less intuitive, but in general, it will usually provide enough information to deduce what
	occurred.
</p>
<p class="p">
	If you find that your mostly encountering deadlocks during migrations, rewrite your migration to
	isolate the primary offender into its own file.
</p>
<p class="p">
	Then, you can follow this <a
		class="a"
		href="https://postgres.ai/docs/postgres-howtos/monitoring-troubleshooting/lock-analysis/how-to-understand-what-is-blocking-ddl"
		>guide</a
	> from Postgres.ai on how to increase observability and debug. There are a few other resources around
	the web that can help:
</p>

<ul class="mt-2 ml-4 list-inside list-disc space-y-1 text-gray-600 [&>li>a]:underline">
	<li>
		<a
			href="https://www.netdata.cloud/academy/effective-strategies-for-managing-postgresql-deadlocks/"
			>Managing deadlocks</a
		>
	</li>
	<li>
		<a
			href="https://postgres.ai/blog/20210923-zero-downtime-postgres-schema-migrations-lock-timeout-and-retries"
			>Retrying queries strategically to bypass lock constraints</a
		>
	</li>
	<li>
		<a href="https://www.netdata.cloud/academy/10-real-world-postgresql-deadlock/"
			>Common patterns that produce deadlocks</a
		>
	</li>
	<li>
		<a href="https://www.netdata.cloud/academy/autovaccum-vs-deadlock/">Rare autovacuum deadlocks</a
		>
	</li>
	<li>
		<a href="https://www.netdata.cloud/academy/benchmarking-short-long-transactions-in-postgresql/"
			>Long-running VS. short-running queries impact on deadlock occurrences</a
		>
	</li>
</ul>
