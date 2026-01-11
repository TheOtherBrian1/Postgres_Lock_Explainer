<script lang="ts">
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import CodeBlock from '$lib/components/code_block.svelte';
</script>

<p>
	The <CodeHighlight>lock_timeout</CodeHighlight> setting determines how long a query will wait for a
	lock before aborting.
</p>
<p>Usually, the setting is used to mitigate the damage caused by lock-queues.</p>
<p>If you find it inappropriate for your database, you can update the value:</p>
<!-- prettier-ignore -->
<CodeBlock>
-- change just within a transaction
BEGIN;
SET LOCAL lock_timeout = '5s';
-- your queries here
COMMIT;

-- change at the session level 
SET lock_timeout = '5s';

-- change at the role level 
ALTER ROLE &lt;some_role&gt; SET lock_timeout = '5s';

-- change at the database level 
ALTER DATABASE &lt;some_database&gt; SET lock_timeout = '5s';
</CodeBlock>

<p>
	You should also check to see if some operation is pending for an unusually long time that may be
	blocking:
</p>

<!-- prettier-ignore -->
<CodeBlock label='check for long-running queries'>
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
    pg_stat_activity.backend_start
FROM pg_stat_activity
JOIN pg_stat_ssl
    ON pg_stat_activity.pid = pg_stat_ssl.pid
WHERE 
  pg_stat_activity.query_start &lt; NOW() - INTERVAL '5 seconds' --&lt;--------consider changing interval
    AND
  state &lt;&gt; 'idle';
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
