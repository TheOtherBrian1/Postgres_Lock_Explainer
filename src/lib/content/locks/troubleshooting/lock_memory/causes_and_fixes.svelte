<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
</script>

<!-- <h4 class="mb-4 text-xl font-bold text-stone-900">Cause 1: Partitioning</h4>
<p class="mb-4">
  If you have heavily partitioned tables, each sub-table can be locked,
  exhausting your lock threshold.
</p>
<CodeBlock label="modify max_locks_per_transaction">
  ALTER DATABASE &lt;db_name&gt; SET max_locks_per_transaction TO
  &lt;some_int_val&gt;
</CodeBlock>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">
  Cause 2: Connection leaks
</h4>
<p>
  Connection leaks occur when you start a transaction with a <CodeHighlight
    >BEGIN</CodeHighlight
  > command, but then forget to conclude it with a <CodeHighlight
    >COMMIT</CodeHighlight
  >. Set a timeout to kill these automatically:
</p>
<CodeBlock>
  -- for the entire database ALTER ROLE &lt;some_db&gt; SET
  idle_transaction_session_timeout TO '10s';
</CodeBlock>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">
  Cause 3: Small servers
</h4>
<p>
  If your connection pool size is high relative to server power. Increase <CodeHighlight
    >max_locks_per_transaction</CodeHighlight
  >.
</p>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">
  Cause 4: Complex joins & triggers
</h4>
<p>
  Joins, foreign keys, and triggers cause queries against one table to extend to
  others. The first approach is to remove redundant indexes. If refactoring is
  not an option, increase the lock limit setting.
</p> -->

<p class="p">
	It's rare for queries to claim enough locks to cause this error. In my experience, it occurs in
	four scenarios and the solution depends on the underlying cause:
</p>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">Cause 1: Partitioning</h4>

<p class="p">
	if you have heavily partitioned tables, each sub-table can be locked, exhausting your lock
	threshold. This is especially common for those relying on auto-partitioning extensions, like
	pg_partman and timescale.
</p>

<p class="p">
	If you perhaps inherited someone else's project and
	are unsure if a table is partitioned, you can find out how many partitions a table has with the
	below query:
</p>

<!-- prettier-ignore -->
<CodeBlock label='Find partitions per table'>
SELECT COUNT(*)
FROM pg_inherits i
JOIN pg_class c ON i.inhrelid = c.oid
WHERE i.inhparent = 'SOME_SCHEMA_NAME.SOME_TABLE_NAME'::regclass
  AND c.relkind = 'r'; 
</CodeBlock>

<p class="p">
	If you don't find it disruptive, you can detatch older partitions to reduce lock strain.
</p>

<p class="p">
	However, lock consumption is an acceptable hazard of partitioning and its perfectly fine to just
	increase the <a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-MAX-LOCKS-PER-TRANSACTION"
		>max_locks_per_transaction</a
	> setting.
</p>

<CodeBlock label="modify max_locks_per_transaction">
	ALTER DATABASE &lt;db_name&gt; SET max_locks_per_transaction TO &lt;some_int_val&gt;
</CodeBlock>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">Cause 2: Connection leaks</h4>

<p class="p">
	Lock conflicting connection leaks occur when you start a transaction with a <CodeHighlight
		>BEGIN</CodeHighlight
	> command, but then forget to conclude it with a <CodeHighlight>COMMIT</CodeHighlight>. Most
	Postgres client libraries handle this for you in the background, but some tools do not <CodeHighlight
		>auto-commit</CodeHighlight
	> be default. For instance, the popular Python driver Psycopg needs to be explicitly configured to auto-commit.
</p>

<p class="p">
	Likely, the accummulated locks will cause more noticable problems, like table blocking, way before
	it starts throwing memory errors, but if it goes on long enough, you'll eventually encounter this
	issue.
</p>

<p class="p">
	If this happens, it's a bug in your code or you accidentally left a connection open from a GUI
	client, like PSQL, DBeaver, DataGrip, or whatever tool you use. You can check for current
	long-lived transactions by running:
</p>

<!-- prettier-ignore -->
<CodeBlock label='Find partitions per table'>
SELECT
    pg_stat_activity.pid,
    pg_stat_ssl.ssl AS ssl_connection,
    pg_stat_activity.datname AS database,
    pg_stat_activity.usename AS connected_role,
    pg_stat_activity.application_name,
    pg_stat_activity.client_addr,
    pg_stat_activity.query,
    pg_stat_activity.query_start,
    pg_stat_activity.state,
	pg_stat_activity.xact_star,
    pg_stat_activity.backend_start
FROM pg_stat_activity
JOIN pg_stat_ssl
    ON pg_stat_activity.pid = pg_stat_ssl.pid
WHERE 
  pg_stat_activity.xact_start &lt; NOW() - INTERVAL '5 seconds' --&lt;--------consider changing interval
    AND
  state &lt;&gt; 'idle';
</CodeBlock>

<p class="p">
	As insurance against this mistake, you can set an

	<a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-DEADLOCK-TIMEOUT"
		>idle_transaction_session_timeout</a
	>. It'll kill transactions that are left open doing nothing after the limit is reached.
</p>

<!-- prettier-ignore -->
<CodeBlock>
-- just for a transaction 
BEGIN; 
  SET LOCAL idle_transaction_session_timeout TO '10s'; 
  -- your queries 
COMMIT; 

-- for a connection 
SET idle_transaction_session_timeout TO '10s'; 

-- for a specific role 
ALTER ROLE &lt;some_role&gt; SET idle_transaction_session_timeout TO '10s'; 

-- for the entire database 
ALTER ROLE &lt;some_db&gt; SET idle_transaction_session_timeout TO '10s';
</CodeBlock>

<p class="p">
	If you start noticing <CodeHighlight>Idle-In-Transaction</CodeHighlight> errors afterwards, you'll have
	to reconfigure your clients or modify your code, as connection leaks like these can make your DB partially
	inaccessible in the long-run.
</p>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">
	Cause 3: Small servers with high connection activity
</h4>

<p class="p">
	If your

	<a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-DEADLOCK-TIMEOUT"
		>max_connections</a
	>

	size relative to your server's power is far beyond the defaults, you could encounter this error if
	your running at high capacity.
</p>

<p class="p">
	Check your system's memory usage. If it is strained, you'll have to refactor your queries to
	minimize memory exhaustion or increase your server size. Then you can increase the <a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-MAX-LOCKS-PER-TRANSACTION"
		>max_locks_per_transaction</a
	> setting.
</p>

<!-- prettier-ignore -->
<CodeBlock label="modify max_locks_per_transaction">
  ALTER DATABASE &lt;db_name&gt; SET max_locks_per_transaction TO &lt;some_int_val&gt;
</CodeBlock>

<p class="p">
	After increasing the setting, monitor the database for signs of lock contention that can hold up
	queries.
</p>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">
	Cause 4: Large join operations, foreign key dependencies, over-indexing, and triggers
</h4>

<p class="p">
	Joins, foreign keys, and triggers cause queries against one table to extend to others, potentially
	amplifying the locks claimed per interaction. If these tables are heavily indexed, that too could
	amplify the locks claimed. The first approach in this case is to remove redundant indexes. You can
	check for them with this query:
</p>

<!-- prettier-ignore -->
<CodeBlock>
SELECT
  FORMAT('%I.%I', schemaname, relname) AS name,
  indexrelname AS index,
  pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size,
  idx_scan as index_scans
FROM pg_stat_user_indexes ui
JOIN pg_index i ON ui.indexrelid = i.indexrelid
WHERE
  NOT indisunique AND idx_scan &lt; 50 AND pg_relation_size(relid) &gt; 5 * 8192
  AND NOT schemaname LIKE ANY($1)
ORDER BY
  pg_relation_size(i.indexrelid) / nullif(idx_scan, 0) DESC NULLS FIRST,
  pg_relation_size(i.indexrelid) DESC;
</CodeBlock>

<p class="p">
	Then you can apply migrations to remove the redundant ones. If other factors are at play, such as
	triggers, foreign keys, and joining, you can look into adjusting your querying patterns or
	refactoring your tables. If you can improve performance, maybe by adding more targetted indexes,
	adjusting memory settings, etc. you can prevent problematic queries from overlapping with each
	other to the point that it leads to lock memory errors. If refactoring is not an option, you can
	increase the <CodeHighlight>max_locks_per_transaction</CodeHighlight> value:
</p>

<!-- prettier-ignore -->
<CodeBlock label="modify max_locks_per_transaction">
  ALTER DATABASE &lt;db_name&gt; SET max_locks_per_transaction TO &lt;some_int_val&gt;
</CodeBlock>

<p class="p">
	However, as your system is heavily interconnected, you may already be experiencing lock related
	performance penalties around queueing. You should check your observability tools to make sure that
	is not the case and if performance is not at risk or further degregation is tolerable, you can
	modify your setting.
</p>
