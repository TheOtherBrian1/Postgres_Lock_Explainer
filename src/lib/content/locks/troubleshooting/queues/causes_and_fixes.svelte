<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
</script>

<p class="p">
	These errors are most often caused by slow queries or poorly formatted migrations. <CodeHighlight
		>Problem 4's</CodeHighlight
	> Understanding portion discusses this in more detail. The goal of is this portion is just to explain
	how you can increase visiblity over blocking queries.
</p>

<p class="p">
	To try to catch the <em>blocking query</em> (not just the victim), configure <CodeHighlight
		>log_min_duration_statement</CodeHighlight
	> or use <CodeHighlight>auto_explain</CodeHighlight>:
</p>
<CodeBlock>
	-- Log all queries running longer than 1s ALTER ROLE postgres SET log_min_duration_statement =
	'1s'; -- Or use auto_explain to get plans ENABLE extension auto_explain; ALTER ROLE postgres SET
	auto_explain.log_min_duration = '1s';
</CodeBlock>

<p class="p">
	The <CodeHighlight>log_lock_waits</CodeHighlight> logs record the blocked query, but only the blocker's
	process_id
</p>

<p class="p">
	It's not possible to consistently log the blocking query retroactively. There are some settings
	you can change, though, that increase the odds of getting it
</p>

<p class="p">
	Configure Postgres setting <a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-MIN-DURATION-STATEMENT"
		>log_min_duration_statement</a
	> to the same value as the deadlock_timeout. This will tell the database to log all queries, blocking
	or not, that ran for a certain amount of time.
</p>

<CodeBlock>ALTER ROLE postgres SET log_min_duration_statement = '1s';</CodeBlock>

<p class="p">
	Alternatively, enable the postgres bundled auto_explain extension. It provides utilities identical
	to log_min_duration_statement, but also logs the query plan, too:
</p>

<CodeBlock>
	ENABLE extension auto_explain; ALTER ROLE postgres SET auto_explain.log_min_duration = '1s';
</CodeBlock>

<p class="p">These settings produce logs that have the following header:</p>

<CodeBlock>duration: 0.487 ms statement: SELECT...</CodeBlock>

<p class="p">
	Both record a query's transaction and process_id in their log fields, which can be used to
	determine what operation was the blocker in <em>some cases</em>. If you had a queue of blocking
	queries, the first two may run for .6s. The last query would've been blocked for 1.2s, enough to
	trigger the log_lock_waits logger, but the blocking queries wouldn't have been picked up by
	log_min_duration_statement nor auto_explain. So, it's not full proof, but nonetheless helpful.
</p>

<p class="p">
	Because migration related operations are more likely to induce these errors, it's worth logging
	them by default.
</p>

<CodeBlock label="log all DDL commands"
	>ALTER DATABASE &lt;database_name&gt; SET log_statement = 'ddl';</CodeBlock
>
