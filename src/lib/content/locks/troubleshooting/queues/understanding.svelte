<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import NumberedList from '$lib/components/lists/numbered_list.svelte';
</script>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">Understanding the logs:</h4>
<p class="p">
	Beyond the log's primary message, it will contain sub-fields that are also insightful, such as:
</p>
<ul class="mb-6 ml-6 list-disc space-y-4 marker:text-[#ff3e00]">
	<li>
		<strong>query</strong>: <span>The query that is waiting</span>
	</li>

	<li>
		<strong>detail</strong>:
		<span
			>Process id holding the lock: 1007982. and the processes currently waiting for lock access:
			1017210, 101711,...</span
		>
	</li>

	<li>
		<strong>command_tag</strong>:
		<span>The waiting state, <CodeHighlight>ALTER TABLE waiting</CodeHighlight></span>
	</li>
</ul>

<p>
	<a
		class="a"
		href="https://www.postgresql.org/docs/17/runtime-config-logging.html#GUC-LOG-LOCK-WAITS"
		>log_lock_waits</a
	> also will record when waiting queries finally are able to run:
</p>

<CodeBlock>process 1007982 acquired ShareLock on transaction 445264 after 33566.880 ms</CodeBlock>

<h5 class="mt-8 mb-4 text-lg font-bold text-stone-900">Waiting log type 1: table lock</h5>
<CodeBlock>
	process 1017208 still waiting for "lock_type" on relation 75874 of database 5 after 1001.872 ms
</CodeBlock>

{#snippet item1()}
	The process (connection or background worker) "1017208" is trying to execute a query
{/snippet}
{#snippet item2()}
	The query cannot claim a lock on a table/index with an ID of "75874" in the database 5
{/snippet}
{#snippet item3()}
	The query has been waiting roughly 1s to claim its lock.
{/snippet}
<NumberedList items={[item1, item2, item3]} />

<p class="p">
	To find the original names of the objects and DB refrenced in the logs (assuming they still
	exist), one can run:
</p>
<!-- prettier-ignore -->
<CodeBlock label="view name of object">
-- get object name
SELECT 75874::regclass;

-- get the name of database the object is in
SELECT datname
FROM pg_database
WHERE oid = 5;
</CodeBlock>

<p class="p">
	Generally, one will see these warnings during long migrations. To mitigate them, one can use the
	advice of a migration linter, like <a class="a" href="https://squawkhq.com/">squawkhq</a>.
	However, many operations claim table locks that can cause some conflict. You can check out the
	<a href="/locks/lock_tool" class="a"> lock blocking graph</a> to know what blocks what and then try
	to speed up your queries or re-order them to minimize lock conflicts.
</p>

<h5 class="mt-8 mb-4 text-lg font-bold text-stone-900">Waiting log type 2: row lock</h5>
<!-- prettier-ignore -->
<CodeBlock>
process 45981 still waiting for "lock_type" on tuple (12313,6) of relation 37590 of database 5
after 1000.050 ms
</CodeBlock>
{#snippet item4()}
	The process (connection or background worker) "45981" is trying to execute a query
{/snippet}
{#snippet item5()}
	The query is trying to lock a specific row (tuple), but is blocked by another lock
{/snippet}
{#snippet item6()}
	The query cannot claim a lock on a table/index with an ID of "37590" in the database 5
{/snippet}
<NumberedList items={[item4, item5, item6]} />

<p class="p">
	These types of logs usually occur when multiple slow <CodeHighlight>UPDATE</CodeHighlight> or <CodeHighlight
		>DELETE</CodeHighlight
	> target the same row. They cannot modify the row simultaneously, so a queue forms.
</p>

<h5 class="mt-8 mb-4 text-lg font-bold text-stone-900">Waiting log type 3: transaction lock</h5>

<CodeBlock>
	process 46449 still waiting for "lock_type" on transaction 87656107 after 1000.045 ms
</CodeBlock>

{#snippet item7()}
	The process (connection or background worker) "46449" is trying to execute a query
{/snippet}
{#snippet item8()}
	The lock that the process is waiting for is not on a row nor object, but is instead on a
	transaction
{/snippet}
{#snippet item9()}
	The locked transaction is called 87656107
{/snippet}
<NumberedList items={[item7, item8, item9]} />

<p class="p">
	These types of logs usually occur when a slow <CodeHighlight>INSERT</CodeHighlight>, <CodeHighlight
		>UPDATE</CodeHighlight
	>, or <CodeHighlight>DELETE</CodeHighlight> command targets a table with a <CodeHighlight
		>UNIQUE/PRIMARY_KEY INDEX</CodeHighlight
	>.
</p>

<p class="p">
	In case two pending operations try to add/update/remove the same value in a unique column, the DB
	has to force these transactions to happen sequentially. This is to ensure that they don't
	accidentally add duplicate values. So, it's not the individual row or table that matters, but the
	order and speed of the transactions themself.
</p>
