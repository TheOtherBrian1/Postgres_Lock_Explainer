<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import DropDown from '$lib/components/drop_down.svelte';
</script>

<p class="p">
	There's a setting called <a
		class="a"
		href="https://www.postgresql.org/docs/17/runtime-config-logging.html#GUC-LOG-LOCK-WAITS"
		>log_lock_waits</a
	>.
</p>

<p>
	It tells Postgres to log queries that are waiting on locks longer than the <a
		class="font-medium text-[#ff3e00] underline decoration-2 underline-offset-2 transition-colors hover:text-[#ff6b35]"
		href="https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-DEADLOCK-TIMEOUT"
		>deadlock_timeout</a
	> (default is 1s).
</p>

<p class="p">
	Unless you are monitoring the DB with a special tool, you should strongly consider enabling the
	setting:
</p>

<CodeBlock>ALTER DATABASE &lt;some_db&gt; SET log_lock_waits = TRUE;</CodeBlock>

<p>When a lock queue forms that holds operations for 1+s, the following logs will be produced:</p>

<!-- prettier-ignore -->
<CodeBlock>
-- if a query waiting to claim a lock on a table/index
process 1017208 still waiting for "lock_type" on relation 75874 of database 5 after 1001.872 ms 

-- if a query waiting to claim a lock on a row (tuple)
process 45981 still waiting for "lock_type" on tuple (12313,6) of relation 37590 of database 5 after 1000.050 ms 

-- if a query is waiting to claim a transaction lock
process 46449 still waiting for "lock_type" on transaction 87656107 after 1000.045 ms
</CodeBlock>

<p class="p">
	They're not errors, but instead are signs of performance degregation due to locks. The <CodeHighlight
		>Understanding</CodeHighlight
	> section explains these logs in more detail.
</p>


<DropDown title='Real world example'>
	<p>
		Someone noticed that their database was sufferring from severe IO strain, but couldn't diagnose the cause.
	</p>
	<p>
		Reviewing their logs, I noticed lock queues for <CodeHighlight>REFRESH MATERIALIZED VIEW CONCURRENTLY</CodeHighlight> queries. 
	</p>
	<p>
		Every 5 minutes, they had a cron job to refresh their view, but at one point, the query degraded. By the time the first refresh completed, there'd be a few more stuck pending. 
	</p>
	<p>
		So, the view would refresh immediately after refreshing instead of waiting 5 minutes to execute again.
	</p>
	<p>
		The constant, redundant, rebuilding strained disk.
	</p>
	<p>
		The solution was to add a <CodeHighlight>lock_timeout</CodeHighlight> configuration to the <CodeHighlight>REFRESH</CodeHighlight> requests, so they wouldn't queue needlessly.
	</p>
	<p>
		The database also needed some general tuning and query optomization to help improve operations overall.
	</p>
	<p>
		Ideally, one should monitor for lock queues like these before the devolve into serious problems. You can go to the monitoring section to learn more about how to do this. 
	</p>
</DropDown>