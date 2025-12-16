<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import Animation from '$lib/content/locks/animation/deadlocks.svelte';
</script>

<p>
	Imagine a user runs the below <CodeHighlight>UPDATE</CodeHighlight> query.
</p>
<!-- prettier-ignore -->
<CodeBlock>
BEGIN; 
	UPDATE row 1; 
	UPDATE row 2; 
COMMIT;
</CodeBlock>

<p class="p">It's going to try to:</p>
<ol class="mb-8 ml-2 list-none space-y-3">
	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>1</span
		>

		<span>Claim a lock on row 1 to update it</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>2</span
		>

		<span>Claim a lock on row 2 to update it</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>3</span
		>

		<span>Commit transaction</span>
	</li>
</ol>

<p>
	What if at the same time, another query runs that does the exact same thing, but instead updates
	row 2 first and then row 1:
</p>

<!-- prettier-ignore -->
<CodeBlock>
BEGIN; 
	UPDATE row 2; 
	UPDATE row 1; 
COMMIT;
</CodeBlock>

<p class="p">That potentially creates a conflict:</p>

<ol class="mb-8 ml-2 list-none space-y-3">
	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>1</span
		>

		<span>Query 1 locks row 1 to update it</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>2</span
		>

		<span>Query 2 locks row 2 to update it</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>3</span
		>

		<span>Query 1 tries to lock row 2</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>4</span
		>

		<span>Query 1 sees Query 2 already locked row 2, so it waits</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>5</span
		>

		<span>Query 2 tries to lock row 1</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>6</span
		>

		<span>Query 2 sees Query 1 already locked row 1, so it waits</span>
	</li>

	<li class="flex items-start gap-3">
		<span
			class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff3e00]/10 text-xs font-bold text-[#ff3e00]"
			>6</span
		>

		<span>Both queries are now waiting on each other and cannot proceed</span>
	</li>
</ol>

<Animation />

<p>
	Postgres has a setting called: <a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-DEADLOCK-TIMEOUT"
		>deadlock_timeout</a
	>
</p>

<!-- prettier-ignore -->
<CodeBlock>
-- check the timeout on your DB

SELECT * FROM pg_settings 
WHERE name = 'deadlock_timeout';
</CodeBlock>

<p class="p">
	By default, it's set to <CodeHighlight>1s</CodeHighlight>. That's how often Postgres checks for
	deadlocks. If it finds one, it picks the process holding the weaker lock and ends it. The affected
	query then returns an error:
</p>

<!-- prettier-ignore -->
<CodeBlock>
ERROR: 'deadlock detected'
DETAIL: 'Process 1007982 waits for ShareLock on transaction 441394; blocked by process 1007981.'
Process '1007981 waits for ShareLock on transaction 441400; blocked by process 1007982.'
HINT: 'See server log for query details.'
CONTEXT: 'while updating tuple (0,1) in relation some_table'
</CodeBlock>

<p class="p">
	In most cases, you can ignore them as one-off events. Even the Postgres docs considers them rare
	occurrences:
</p>

<quote class=" mb-2 inline-block border-l-2 border-gray-500 py-[1px] pl-4 italic">
	<span class="italic"
		>We optimistically assume that deadlocks are not common in production applications</span
	>

	<br />

	-
	<a
		class="underline"
		href="https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-DEADLOCK-TIMEOUT:~:text=We%20optimistically%20assume%20that%20deadlocks%20are%20not%20common%20in%20production%20applications"
		>PG Docs</a
	>
</quote>

<p class="p">However, if they become disruptive, you can check out the causes and fixes section.</p>
