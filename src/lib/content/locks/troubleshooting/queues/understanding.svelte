<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
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

<ol class="mb-8 ml-2 list-none space-y-3">
	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>1</span
		>

		<span>The process (connection or background worker) "1017208" is trying to execute a query</span
		>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>2</span
		>

		<p>The query cannot claim a lock on a table/index with an ID of "75874" in the database 5</p>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>3</span
		>

		<span>The query has been waiting roughly 1s to claim its lock.</span>
	</li>
</ol>

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
	lock simulator to know what blocks what and then try to speed up your queries or re-order them to
	minimize lock conflicts.
</p>

<h5 class="mt-8 mb-4 text-lg font-bold text-stone-900">Waiting log type 2: row lock</h5>

<CodeBlock>
	process 45981 still waiting for "lock_type" on tuple (12313,6) of relation 37590 of database 5
	after 1000.050 ms
</CodeBlock>

<ol class="mb-8 ml-2 list-none space-y-3">
	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>1</span
		>

		<span>The process (connection or background worker) "45981" is trying to execute a query</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>2</span
		>

		<span>The query is trying to lock a specific row (tuple), but is blocked by another lock</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>3</span
		>

		<span
			>The query cannot claim a lock on a table/index with an ID of "37590" in the database 5</span
		>
	</li>
</ol>

<p class="p">
	These types of logs usually occur when multiple slow <CodeHighlight>UPDATE</CodeHighlight> or <CodeHighlight
		>DELETE</CodeHighlight
	> target the same row. They cannot modify the row simultaneously, so a queue forms.
</p>

<h5 class="mt-8 mb-4 text-lg font-bold text-stone-900">Waiting log type 3: transaction lock</h5>

<CodeBlock>
	process 46449 still waiting for "lock_type" on transaction 87656107 after 1000.045 ms
</CodeBlock>

<ol class="mb-8 ml-2 list-none space-y-3">
	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>1</span
		>

		<span>The process (connection or background worker) "46449" is trying to execute a query</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>2</span
		>

		<span
			>The lock that the process is waiting for is not on a row nor object, but is instead on a
			transaction</span
		>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>3</span
		>

		<span>The locked transaction is called 87656107</span>
	</li>
</ol>

<p class="p">
	These types of logs usually occur when a slow <CodeHighlight>INSERT</CodeHighlight>, <CodeHighlight
		>UPDATE</CodeHighlight
	>, or <CodeHighlight>DELETE</CodeHighlight> command targets a table with a <CodeHighlight
		>UNIQUE/PRIMARY_KEY INDEX</CodeHighlight
	>. 
</p>

<p class="p">
	In case two pending operations try to add/remove the same value in a unique column, the DB has to force
	these transactions to happen sequentially. This is to ensure that they don't accidentally add duplicate values. So, it's not the individual
	row or table that matters, but the order and speed of the transactions themself.
</p>
