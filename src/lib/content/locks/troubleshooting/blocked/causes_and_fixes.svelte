<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
</script>

<p class="p">
	As stated before, this error is a subset of lock queues, so the advice from problem 3 still
	applies. This is just extra precautions you can take to improve reliability.
</p>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">Step 1: manually kill offenders</h4>

<p class="p">
	As mentioned in the <CodeHighlight>Error</CodeHighlight> portion of this section, if you are in an immediate
	crisis, you can run the below query to check for blocking operations
</p>

<!-- prettier-ignore -->
<CodeBlock>
SELECT 
    blocked.pid AS blocked_pid,
    blocked.usename AS blocked_user,
    blocked.query AS blocked_query,
    blocked.state AS blocked_state,
    NOW() - blocked.query_start AS blocked_duration,
    
    blocker.pid AS blocking_pid,
    blocker.usename AS blocking_user,
    blocker.query AS blocking_query,
    blocker.state AS blocking_state,
    NOW() - blocker.query_start AS blocking_duration,
    
    locks.locktype,
    locks.mode AS lock_mode,
    locks.relation::regclass AS table_name,
    locks.page,
    locks.tuple,
    locks.transactionid
FROM pg_stat_activity blocked
JOIN pg_locks locks ON blocked.pid = locks.pid
JOIN pg_locks blocking_locks ON (
    locks.locktype = blocking_locks.locktype
    AND locks.database IS NOT DISTINCT FROM blocking_locks.database
    AND locks.relation IS NOT DISTINCT FROM blocking_locks.relation
    AND locks.page IS NOT DISTINCT FROM blocking_locks.page
    AND locks.tuple IS NOT DISTINCT FROM blocking_locks.tuple
    AND locks.virtualxid IS NOT DISTINCT FROM blocking_locks.virtualxid
    AND locks.transactionid IS NOT DISTINCT FROM blocking_locks.transactionid
    AND locks.classid IS NOT DISTINCT FROM blocking_locks.classid
    AND locks.objid IS NOT DISTINCT FROM blocking_locks.objid
    AND locks.objsubid IS NOT DISTINCT FROM blocking_locks.objsubid
    AND locks.pid != blocking_locks.pid
)
JOIN pg_stat_activity blocker ON blocking_locks.pid = blocker.pid
WHERE NOT locks.granted 
AND blocking_locks.granted
ORDER BY blocked_duration DESC, blocking_duration DESC;
</CodeBlock>

<p>If you find it necessary, you can then kill blocking queries by running:</p>

<!-- prettier-ignore -->
<CodeBlock>
-- kill the query (may not work if system is over stressed) 
SELECT pg_cancel_backend(&lt;pid of the process&gt;) ;

-- kill the entire connection select pg_terminate_backend(pid) from
select pg_terminate_backend(pid)
from pg_stat_activity
where pid = &lt;connection_id&gt;
</CodeBlock>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">Step 2: Set proper timeouts</h4>

<p>
	You should set an <a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TRANSACTION-TIMEOUT"
		>idle_in_transaction_session_timeout</a
	>. This is to defend against accidental connection leaks that can leave behind locks. This can be
	set at different levels for finer control:
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
ALTER DATABASE &lt;some_db&gt; SET idle_transaction_session_timeout TO '10s';
</CodeBlock>

<p>
	For migrations in particular, you should consider setting a transaction level <a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-STATEMENT-TIMEOUT"
		>statement_timeout</a
	>. It controls how long an individual statement can run. A statement in this case is just any
	single query within a transaction.
</p>

<!-- prettier-ignore -->
<CodeBlock>
-- just for a transaction 
BEGIN; 
  -- set the statement_timeout just for the migration transaction or session. Feel free to modify it for each query as needed. 
  SET LOCAL statement_timeout TO '10s'; 
  
  -- your Query 
  -- modify the 
  SET LOCAL statement_timeout TO DEFAULT; 
  
  -- your next query... 
  
  COMMIT;
</CodeBlock>

<p>
	The final timeout setting is <CodeHighlight>lock_timeout</CodeHighlight>. It determines how long a
	query can wait for a lock to be freed. Especially in migrations, your queries may claim mltiple
	hard-locks. If an earlier operation claimed one, and then further queries in the transaction get
	stuck waiting for a new lock or are slow, that can cause the migration to delay. If it becomes too
	bad, that leads to a lock queue that can take your instance offline. To avoid this, you should set
	limits in place for how long a transaction can wait for locks.
</p>

<!-- prettier-ignore -->
<CodeBlock>
BEGIN; 
  SET LOCAL lock_timeout = '4s'; 
  ALTER some_table ADD COLUMN some_name TEXT; 
  SET LOCAL lock_timeout TO DEFAULT;
    -- your other queries... 
COMMIT;
</CodeBlock>

<p class="p">
	There isn't a specific timeout you should choose. Instead you should see how long your queries are
	running and then choose values that are tolerable for your current usage.
</p>
<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">Step 3: Optomize queries and refactor</h4>

<p class="p">
	If you have queries creating enduring locks, you should look into your migration process or start
	using a migration linter, like <a class="a" href="https://squawkhq.com/">squawkhq</a>. If
	migrations aren't the primary culprit, you should explore optomizing your queries.
</p>

<h4 class="mt-8 mb-4 text-xl font-bold text-stone-900">Step 4: Monitoring</h4>

<p class="p">You can try tools like:</p>

<ul class="mb-10 ml-4 list-disc space-y-2">
	<li class="pl-4">
		<strong class="mb-1 block text-stone-900">
			<a
				class=" underline decoration-2 underline-offset-2 transition-colors hover:text-[#ff6b35]"
				href="https://pganalyze.com/">PGAnalyze</a
			>
		</strong>
		<p>
			I met the engineers behind the product. It's made by the best in the industry, but you can't
			self-host and its pricing is at a <a class="a" href="https://pganalyze.com/pricing">premium</a
			>. They have a <a class="a" href="https://app.pganalyze.com/users/sign_up">free trial</a> if
			you want to check it out. Their
			<a
				class="a"
				href="https://pganalyze.com/blog/postgres-lock-monitoring#identifying-postgres-connections-that-block-queries-and-lead-to-cascading-lock-waits"
				>blog</a
			> contains visuals of the lock interface if you want a quick glance.
		</p>
	</li>

	<li class="pl-4">
		<strong class="mb-1 block text-stone-900">
			<a
				class=" underline decoration-2 underline-offset-2 transition-colors hover:text-[#ff6b35]"
				href="https://www.datadoghq.com/monitoring/postgresql-monitoring/">DataDog</a
			>
		</strong>
		<p class="p">
			Also a very good option with more flexible pricing. Here's an <a
				href="https://www.datadoghq.com/blog/troubleshoot-blocking-queries-with-database-monitoring/"
				class="a">article with pictures on how to use it for locks</a
			>
		</p>
	</li>

	<li class="pl-4">
		<strong class="mb-1 block text-stone-900">
			<a
				class=" underline decoration-2 underline-offset-2 transition-colors hover:text-[#ff6b35]"
				href="http://learn.netdata.cloud/docs/collecting-metrics/databases/postgresql">NetData</a
			>
		</strong>
		<p>
			Gives you insight about locks, but not about the underlying queries locking. There's a cloud
			version, but it is also open source and self-hostable. It's an extremely impressive piece of
			software overall and worth reviewing. Here's a link to a <a
				class="a"
				href="https://app.netdata.cloud/spaces/netdata-demo/rooms/postgresql/overview?_gl=1*2u2aig*_gcl_au*Nzk0MjI5MTIwLjE3NjM3NDgyOTE.*_ga*MTc3MTQ0Nzc4LjE3NjM3NDgyOTE.*_ga_J69Z2JCTFB*czE3NjU2MDM1MzUkbzMkZzEkdDE3NjU2MDQ0NjckajUzJGwwJGgw#metrics_correlation=false&after=1765603590000&before=1765604490000&utc=Europe%2FAthens&offset=%2B2&timezoneName=E.%20Europe&modal=&modalTab=&_o=tVBBasMwEPyLzllYy7Zs5dZT6aWUtvdlJa9aQywJyy6E0r9XeUCSU24zzDAzzK_y37xur7wI_PBJHdUicaePc9lkAaS3NXkpRQo0VHZ3XXyXkva1UnJnesr5NHve5hTpeU17JuKcC31dcCGfYiDQ6qCmkTtB38PgBwtd0_VgEQXGlm1AE7wzDHBzYk3JaY7bS_ycq6MidWwG0xtsrW4Q8aAMj6Y1vQXPE9YWDmC1nkD7bnAojC7oOy2PPeLvHw&modalParams=&force_play=undefined"
				>live demo</a
			>.
		</p>
	</li>

	<li class="pl-4">
		<strong class="mb-1 block text-stone-900">
			<a
				class=" underline decoration-2 underline-offset-2 transition-colors hover:text-[#ff6b35]"
				href="https://github.com/darold/pgbadger">PGBadger</a
			>
		</strong>
		<p>
			It's an opensource log analyzer, which needs direct access to the log files of the machine
			Postgres is hosted on or you need a way to export them. It's tried-and-true and can extract
			invaluable lock information from your logs. Here's a <a
				class="a"
				href="https://pgbadger.darold.net/examples/sample.html#locks-type">link to a demo site</a
			>
		</p>
	</li>
</ul>
<p class="p">
	I'm sure there are other tools out there, but I'm not familiar them. Using the <a
		class="a"
		href="https://github.com/TheOtherBrian1/pg_cron">pg_cron</a
	> or really any cron orchestrator, you can collect the relevant statistics yourself. I'll try to expand
	this guide on it in the future (no promises)
</p>
