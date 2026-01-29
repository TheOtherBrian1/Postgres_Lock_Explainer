<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import DropDown from '$lib/components/drop_down.svelte';
</script>

<p class="p">
	This type of error is a severe subset of <CodeHighlight>Problem 3: Lock Queues</CodeHighlight> where
	locks <em>functionally</em> take tables offline or persistently block normal activity.
</p>
<p class="p">
	Certain operations, mainly <CodeHighlight>ALTER</CodeHighlight>, <CodeHighlight
		>CREATE</CodeHighlight
	>, and <CodeHighlight>DROP</CodeHighlight>, take <CodeHighlight>ACCESS EXCLUSIVE</CodeHighlight> locks
	that block all other queries against the table until the transaction completes. You can see the full
	list of blockers in the interactive locking tool section.
</p>
<p class="p">
	Even lesser locks can be dangerous in the wrong circumstances. For instance, if a transaction
	claims a <CodeHighlight>SHARELOCK</CodeHighlight> for too long on a unique index, it can block <CodeHighlight
		>INSERT</CodeHighlight
	> and <CodeHighlight>UPDATE</CodeHighlight> operations.
</p>
<p class="p">If you're noticing:</p>

<ul class="mb-10 ml-4 list-disc space-y-4">
	<li class="pl-4">
		<strong class="mb-1 block text-stone-900">Hanging queries</strong>
		Normally fast or responsive queries are hanging
	</li>
	<li class="pl-4">
		<strong class="mb-1 block text-stone-900">Timeouts and/or lock warnings</strong>
		Queries are throwing <CodeHighlight>statement timeout</CodeHighlight> errors:
		<!-- prettier-ignore -->
		<CodeBlock>
-- statement timeout errors 
canceling statement due to statement timeout 

-- lock wait warnings for relations 
process "so_and_so" still waiting for "lock_type" on relation "some_object_id" of database some_database_id after 1001.872ms
		</CodeBlock>
	</li>
	<li class="pl-4">
		<strong class="mb-1 block text-stone-900">Reasonable hardware stress</strong>
		If you're noticing any severe CPU, memory, disk, etc. stress that could throttle responsiveness and
		offer an alternative explanation for hanging queries.
	</li>
</ul>

<p class="p">
	Then locks are a likely factor. Run the below query to check for long-running locks:
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

<p class="p">And kill the offending query:</p>

<!-- prettier-ignore -->
<CodeBlock>
-- kill the query (may not work if system is over stressed) 
SELECT pg_cancel_backend(&lt;pid of the process&gt;) ;

-- kill the entire connection select pg_terminate_backend(pid) from
select pg_terminate_backend(pid)
from pg_stat_activity
where pid = &lt;connection_id&gt;
</CodeBlock>



<DropDown title='Real world example'>
	<p>
		This type of error is legitimate crisis and the customers I work with have summoned me at odd hours to diagnose it. Usually, I run the above tests, kill the offending query, and then go back to sleep. 
	</p>
	<p>
		In most cases, a developer just issued a <CodeHighlight>DROP/ALTER/CREATE</CodeHighlight> command that gut stuck behind a very slow transaction or was left in an <CodeHighlight>idle-in-transaction</CodeHighlight> state by a tired developer.
	</p>
	<p>
		These issues can be prevented by using a migration linter or just using the <CodeHighlight>lock_timeout</CodeHighlight> setting.
	<p>
		One novel case I recall had to do with a bug in the <CodeHighlight>PGGroonga</CodeHighlight> extension. It used a custom implementation of locks to manage an internal index. There was an edge case that caused the lock to be orphaned during periods of severe memory strain, causing all writes against the index to pend indefinitely.
	</p>
	<p>
		We were able to get rid of the orphaned lock with the nuclear option (fast restrt the DB). 
	<p>
		Fotunately, the bug has been patched in newer versions of the extension.
	</p>

	<p> 
		Another <em>fun</em> situation I encountered that took half a day to debug was around a custom advisory lock that was left in an <CodeHighlight>idle-in-transaction</CodeHighlight> state due to an edge case in an app's logic. 
	</p>
	<p>
		It didn't actually take a table offline, but rather crippled the database as a whole. Confessionally, I wasn't able to find out why it had such a negative impact. My speculative explanation at the time was that it interfered heavily with the vacuum and thus statistic refreshing. It didn't cause a wrap-around failure (that would've made more sense). What we noticed is that the longer the lock was orphaned, the query planner started defaulting to more problematic and CPU saturating execution strategies. 
	</p>
</DropDown>