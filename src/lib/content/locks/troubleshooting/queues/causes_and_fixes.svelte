<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
</script>

<p>
	These errors are most often caused by slow queries or poorly formatted migrations. <CodeHighlight
		>Problem 4's</CodeHighlight
	> Understanding portion discusses this in more detail. The goal of is this portion is just to explain
	how you can increase visiblity over blocking queries via logging. For other monitoring techniques, go
	to the <a href="/locks/monitoring" class="a">monitoring section</a>.
</p>

<p>
	The <CodeHighlight>log_lock_waits</CodeHighlight> setting records the blocked query, but only the blocker's
	process_id
</p>

<p>
	It's not possible to consistently log the blocking query retroactively. There are some settings
	you can change, though, that increase the odds of getting it.
</p>

<p>
	Configure the Postgres setting <a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-MIN-DURATION-STATEMENT"
		>log_min_duration_statement</a
	> to the same value as the deadlock_timeout. This will tell the database to log all queries, blocking
	or not, that ran for a certain amount of time.
</p>

<CodeBlock>ALTER ROLE postgres SET log_min_duration_statement = '1s';</CodeBlock>

<p>
	Alternatively, enable the postgres bundled <a
		href="https://www.postgresql.org/docs/18/auto-explain.html#:~:text=In%20ordinary%20usage%2C%20these%20parameters%20are%20set%20in%20postgresql.conf%2C%20although%20superusers%20can%20alter%20them%20on%2Dthe%2Dfly%20within%20their%20own%20sessions.%20Typical%20usage%20might%20be%3A"
		class="a">auto_explain module</a
	>. It provides utilities identical to log_min_duration_statement, but also logs the query plan,
	too:
</p>

<!-- prettier-ignore -->
<CodeBlock label='alter setting'>
-- add auto_explain to shared_preload_libraries if not already present and restart server
ALTER SYSTEM SET shared_preload_libraries = 'auto_explain';

-- Set the minimum duration to log
ALTER DATABASE postgres SET auto_explain.log_min_duration = '1s';
</CodeBlock>

<p>These settings produce logs that have the following header:</p>

<CodeBlock>duration: 0.487 ms statement: SELECT...</CodeBlock>

<p>
	Both record a query's transaction and process_id in their log fields, which can be used to
	determine what operation was the blocker in <em>most cases</em>.
</p>

<p>
	Because migration related operations are more likely to induce these errors, it's worth logging
	them by default.
</p>

<CodeBlock label="log all DDL commands"
	>ALTER DATABASE &lt;database_name&gt; SET log_statement = 'ddl';</CodeBlock
>
