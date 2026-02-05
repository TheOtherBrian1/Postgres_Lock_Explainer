<script lang="ts">
	// COMPONENTS -----------------------
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import SectionHeader from '$lib/components/section_header.svelte';
	import DropDown from '$lib/components/drop_down.svelte';
	import Image from '$lib/components/image_cont.svelte';
	import Quote from '$lib/components/quote.svelte';
	import ReviewRow from '$lib/components/ReviewRow.svelte';

	// REVIEWS --------------------------
	import Redgate from '$lib/content/locks/reviews/redgate/index.svelte';
	import Datadog from '$lib/content/locks/reviews/datadog/index.svelte';
	import Pganalyze from '$lib/content/locks/reviews/pganalyze/index.svelte';
	import Netdata from '$lib/content/locks/reviews/netdata/index.svelte';
	import Pgbadger from '$lib/content/locks/reviews/pgbadger/index.svelte';
	import Pgwatch from '$lib/content/locks/reviews/pgwatch/index.svelte';
	import PMM from '$lib/content/locks/reviews/pmm/index.svelte';
	import PGHero from '$lib/content/locks/reviews/pghero/index.svelte';
	import UnorderedList from '$lib/components/lists/unordered_list.svelte';

	// IMAGES ---------------------------
	import new_project from '$lib/assets/new_project.png';
	import pick_ubuntu from '$lib/assets/pick_ubuntu.png';
	import new_server from '$lib/assets/new_server.png';
	import IPv4 from '$lib/assets/IPv4.png';
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<section class="explainer_section">
		<SectionHeader>Monitoring Locks</SectionHeader>

		<p class="p">
			Locks, as stated in other sections, generally do not cause issues, but they can sometimes make
			relatively fast queries slow. For instance, if a query normally runs for 1ms, but is often
			blocked by another that takes 1s, then the fast query becomes a dreadfully slow one. There are
			a few techniques for monitoring locking activity.
		</p>

		<SectionHeader>Viewing lock trees in real time</SectionHeader>

		<p>
			In Postgres, there's a view called <a
				href="https://www.postgresql.org/docs/current/view-pg-locks.html"
				class="a">pg_locks</a
			>. It shows all active locks:
		</p>
		<CodeBlock>SELECT * FROM pg_locks;</CodeBlock>

		<p>
			However, the output isn't the most interpretable. Either or, at the end of the day, the amount
			of locks doesn't matter. What really matters is the amount of blocking. To get that
			information, one needs to use another view called <a
				href="https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW"
				class="a">pg_stat_activity</a
			>.
		</p>
		It shows connections assocaited with the DB. It has a column called <CodeHighlight
			>wait_event_type</CodeHighlight
		>. When it's set to <CodeHighlight>Lock</CodeHighlight>, the connection is stuck in a lock
		queue.
		<!-- prettier-ignore  -->
		<CodeBlock label='Find blocked queries'>
SELECT 
  datname,
  usename,
  pid,
  query AS query_waiting_on_lock,
  application_name
FROM pg_stat_activity 
WHERE wait_event_type = 'Lock';
		</CodeBlock>

		<p>
			By joining <CodeHighlight>pg_locks</CodeHighlight> with <CodeHighlight
				>pg_stat_activity</CodeHighlight
			>, one can see what table locks queries are waiting for.
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock>
SELECT 
  datname,
  usename,
  pg_stat_activity.pid,
  query AS query_waiting_to_apply_lock,
  application_name,
  pg_locks.mode AS lock_pending,
  COALESCE(((SELECT NOW()) - pg_locks.waitstart)::interval, '0 seconds'::interval) AS time_spent_waiting
FROM pg_stat_activity
INNER JOIN pg_locks 
ON pg_locks.pid = pg_stat_activity.pid
WHERE 
  wait_event_type = 'Lock' 
    AND 
  pg_locks.granted = false;

		</CodeBlock>
		<p>
			Unfortunately, to find out what queroes are blocking, one needs to use a special function
			called <a
				href="https://www.postgresql.org/docs/18/functions-info.html#:~:text=the%20current%20session.-,pg_blocking_pids,-(%20integer%20)%20%E2%86%92"
				class="a"
			>
				pg_blocking_pids(pid)</a
			>
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock label="Find blocker process id">
SELECT pg_blocking_pids(pid_of_blocked_process);
		</CodeBlock>

		<p>
			It returns the process of the blocker, which you can then use with <CodeHighlight
				>pg_stat_activity</CodeHighlight
			> and <CodeHighlight>pg_locks</CodeHighlight> again to find out what query it is currently issuing.
		</p>

		<p>
			But, it may be blocked itself. To find the active process at the front of the queue, you need
			to use a <CodeHighlight>RECURSIVE VIEW</CodeHighlight> that regressively scans over pg_locks to
			get the full value.
		</p>
		<p>
			Checking the lock tree is fairly difficult, but the <a
				class="a"
				href="https://wiki.postgresql.org/wiki/Lock_dependency_information">Postgres Wiki</a
			>,
			<a
				href="https://www.crunchydata.com/blog/one-pid-to-lock-them-all-finding-the-source-of-the-lock-in-postgres#one-lock-to-rule-them-all"
				class="a">Crunchy Data</a
			>
			and
			<a href="https://postgres.ai/blog/20211018-postgresql-lock-trees" class="a">Postgres.ai</a> have
			examples on how to do it.
		</p>

		<p>
			Datadog and PgAnalyze also have lock tree queries. I was able to capture the queries and I'm
			including them below if anyone is curious:
		</p>
		<DropDown title="Datadog and PGAnalyze queries">
			<h4>Datadog query</h4>
			<!-- prettier-ignore  -->
			<CodeBlock label = 'Datadog lock tree query'>
/* service='datadog-agent' */
SELECT
    clock_timestamp() AS now,
    datid,
    datname,
    pid,
    usesysid,
    usename,
    application_name,
    client_addr,
    client_hostname,
    client_port,
    backend_start,
    xact_start,
    query_start,
    state_change,
    wait_event_type,
    wait_event,
    state,
    backend_xid,
    backend_xmin,
    query,
    backend_type::bytea AS backend_type,
    pg_blocking_pids(pid) AS blocking_pids
FROM pg_stat_activity
WHERE
    backend_type != 'client backend'
    OR (
        COALESCE(TRIM(query), '') != ''
        AND pid != pg_backend_pid()
        AND query_start IS NOT NULL
        AND datname NOT ILIKE 'template0'
        AND datname NOT ILIKE 'template1'
        AND datname NOT ILIKE 'rdsadmin'
        AND datname NOT ILIKE 'azure_maintenance'
        AND datname NOT ILIKE 'cloudsqladmin'
        AND datname NOT ILIKE 'alloydbadmin'
        AND datname NOT ILIKE 'alloydbmetadata'
        AND NOT (
            query_start &lt; NOW() --&lth----modified to NOW() instead of a hard-coded timestamp. Consider changing time range
            AND state = 'idle'
        )
    );

		</CodeBlock>

			<h4>PGAnalyze query</h4>

			<!-- prettier-ignore  -->
			<CodeBlock label = 'PGAnalyze lock tree query'>
SELECT
    (
        extract(epoch FROM COALESCE(backend_start, pg_catalog.pg_postmaster_start_time()))::int::text
        || pg_catalog.to_char(pid, 'FM0000000')
    )::bigint AS session_id,

    datid,
    datname,
    usesysid,
    usename,
    pid,
    application_name,
    client_addr::text,
    client_port,
    backend_start,
    xact_start,
    query_start,
    state_change,

    (COALESCE(wait_event_type, '') = 'Lock') AS waiting,

    backend_xid,
    backend_xmin,
    wait_event_type,
    wait_event,
    backend_type,

    CASE
        WHEN COALESCE(wait_event_type, '') = 'Lock'
        THEN pg_blocking_pids(pid)
        ELSE NULL
    END AS blocking_pids,

    state,
    query

FROM pg_stat_activity
WHERE pid IS NOT NULL;

		</CodeBlock>
		</DropDown>
		<!-- <p>To not overwhelm anyone, I put the lock tree analyzer query in the drop down.</p> -->

		<!-- <DropDown title="Find blockers">
			<CodeBlock>test</CodeBlock>
		</DropDown> -->

		<p>
			Lock tree queries can be run periodically to collect blocking metrics. Alternatively, one
			could just be run manually to help with performance investiations.
		</p>
		<p>
			The Postgres doc states the following warning about <CodeHighlight
				>pg_blocking_pid</CodeHighlight
			>
		</p>
		<Quote>
			<div class="flex flex-col">
				<span>
					Frequent calls to this function could have some impact on database performance, because it
					needs exclusive access to the lock manager's shared state for a short time.
				</span>
				<a href="#">- operator docs</a>
			</div>
		</Quote>

		<p>
			The people behind Postgres.ai <a
				class="a"
				href="https://postgres.ai/blog/20251013-postgres-marathon-2-007">benchmarked the function</a
			>
			and found that calling it ten times per second reduces performance by about <code>10%</code>.
			My observations of other monitoring platforms found that lock metric scraping every 10 to 15
			seconds is common and should not have meaningful impacts on performance.
		</p>

		<SectionHeader>Monitoring via the logs</SectionHeader>
		<p>
			This was discussed in the <a class="a" href="/locks/troubleshooting"
				>troubleshooting section</a
			>, but there are certain log settings one can use to record lock queues.
		</p>
		<Quote notItalic={true}>
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
				Unless you are monitoring the DB with a special tool, you should strongly consider enabling
				the setting:
			</p>

			<CodeBlock>ALTER DATABASE &lt;some_db&gt; SET log_lock_waits = TRUE;</CodeBlock>

			<p>
				When a lock queue forms that holds operations for 1+s, the following logs will be produced:
			</p>

			<!-- prettier-ignore -->
			<CodeBlock>
-- if a query waiting to claim a lock on a table/index
process 1017208 still waiting for "lock_type" on relation 75874 of database 5 after 1001.872 ms 

-- if a query waiting to claim a lock on a row (tuple)
process 45981 still waiting for "lock_type" on tuple (12313,6) of relation 37590 of database 5 after 1000.050 ms 

-- if a query is waiting to claim a transaction lock
process 46449 still waiting for "lock_type" on transaction 87656107 after 1000.045 ms
</CodeBlock>
			...
			<p class="p">
				Beyond the log's primary message, it will contain sub-fields that are also insightful, such
				as:
			</p>
			<ul class="mb-6 ml-6 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>
					<strong>query</strong>: <span>The query that is waiting</span>
				</li>

				<li>
					<strong>detail</strong>:
					<span
						>Process id holding the lock: 1007982. and the processes currently waiting for lock
						access: 1017210, 101711,...</span
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
			<CodeBlock
				>process 1007982 acquired ShareLock on transaction 445264 after 33566.880 ms</CodeBlock
			>
		</Quote>

		<section class="explainer_section">
			<SectionHeader>Professional Monitoring Tools</SectionHeader>
			<p>There are a lot of popular tools for monitoring Postgres performance</p>
			<p>
				I went through the process of investigating the most recognizable ones to see how much
				visibility they gave over locking.
			</p>
			<p class="p mb-4">My guidelines were a bit opinionated, but in general:</p>
			{#snippet item1()}
				Full lock visibility (frequent lock tree sampling), scored highest
			{/snippet}

			{#snippet item2()}
				Partial lock visibility scored mid range (5 to 7).
			{/snippet}

			{#snippet item3()}
				No lock visibility scored low, but not 0 because they still serve a purpose, just not for
				lock management
			{/snippet}
			<UnorderedList color="red" items={[item1, item2, item3]} />

			<p>The more comprehensive review is at the end, but the summary is:</p>
			<div class="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm text-stone-600">
						<caption class="caption-top px-6 py-4 text-left text-lg font-medium text-stone-700">
							Tools Reviewed
						</caption>
						<thead class="bg-stone-50 text-xs text-stone-500 uppercase">
							<tr>
								<th class="px-6 py-4 font-bold tracking-wider">Tool</th>
								<th class="px-6 py-4 font-bold tracking-wider">Lock Visibility</th>
								<th class="px-6 py-4 font-bold tracking-wider">Setup Experience</th>
								<th class="px-6 py-4 font-bold tracking-wider">Score</th>
							</tr>
						</thead>

						<tbody class="divide-y divide-stone-100">
							<ReviewRow
								tool="Datadog"
								url="https://www.datadoghq.com/free-datadog-trial/"
								visibility="Excellent"
								visibilityNotes="Complete visibility over locks"
								setup="Ran into a few issues, but the setup process was okay. Could be better. Have to work with .yaml files and have an intuition for navigating the Linux directory layout"
								warnSetup={false}
								score="9.9"
							/>
							<ReviewRow
								tool="PGAnalyze"
								url="https://pganalyze.com/"
								visibility="Excellent"
								visibilityNotes="Complete visibility over locks"
								setup="Pretty straightforwards for self-hosted instances. May run into hiccups if you customize log file locations"
								warnSetup={false}
								score="9.8"
							/>
							<ReviewRow
								tool="PGWatch"
								url="https://www.cybertec-postgresql.com/en/products/pgwatch-postgresql-monitoring/"
								demoUrl="https://demo.pgwatch.com/?var-agg_interval=1m&orgId=1&from=now-1h&to=now&timezone=utc&var-dbname=$__all&var-replicas=show&refresh=5m"
								visibility="Good"
								visibilityNotes="Shows types of locks active, but not the queries being impacted"
								setup="N/A: I did not personally set up the tool, just used it"
								warnSetup={false}
								score="7"
							/>
							<ReviewRow
								tool="Percona Monitor and Managment"
								url="https://docs.percona.com/pmm"
								demoUrl="https://pmmdemo.percona.com/graph/d/postgresql-instance-summary/postgresql-instance-summary?from=now-7d&to=now&timezone=America%2FNew_York&var-interval=$__auto&var-qthres=0.100&var-slowq=0&var-srvcnt=2&var-rangeCustom=10080&var-clustercnt=1&var-withoutcluster=1&var-environment=$__all&var-cluster=$__all&var-node_name=pmm-server&var-service_name=pmm-server-postgresql&orgId=1&var-database=$__all&var-version=14.19&var-service_type=$__all&var-uptime=45.60035768750001&var-currentConn=10&var-activeConn=3&var-node_id=pmm-server&var-uptimedecimal=45.6&var-max_connections=100&var-work_mem=4194304&var-shared_buffers=134217728&var-wal_buffers=4194304&var-wal_segment_size=16777216&var-maintenance_work_mem=67108864&var-block_size=8192&var-checkpoint_segments=&var-checkpoint_timeout=300&var-fsync=1&var-default_statistics_target=100&var-seq_page_cost=1&var-random_page_cost=4&var-effective_cache_size=4294967296&var-effective_io_concurrency=1&var-autovacuum=1&var-autovacuum_analyze_scale_factor=0.1&var-autovacuum_analyze_threshold=50&var-autovacuum_vacuum_scale_factor=0.2&var-autovacuum_vacuum_threshold=50&var-autovacuum_vacuum_cost_limit=1767595127000&var-autovacuum_vacuum_cost_delay=0.002&var-autovacuum_max_workers=3&var-autovacuum_naptime=60&var-autovacuum_freeze_max_age=200000000&var-logging_collector=0&var-log_min_duration_statement=1767595127000&var-log_duration=0&var-log_lock_waits=0&var-max_wal_senders=10&var-max_wal_size=1073741824&var-min_wal_size=83886080&var-wal_compression=0&var-max_worker_processes=8&var-max_parallel_workers_per_gather=2&var-max_parallel_workers=2&var-autovacuum_work_mem=1767595127000&var-autovacuum_multixact_freeze_max_age=400000000&var-service_id=7f81a4af-b887-4cba-9835-ffdb1c762c92"
								visibility="Moderate"
								visibilityNotes="Similar to PGWatch, but lacks visibility over wait durations"
								setup="Recommends installing a the pg_stat_monitors extension. Not the most straightforward process, but still doable"
								warnSetup={false}
								score="6.8"
							/>

							<ReviewRow
								tool="Netdata"
								url="https://www.netdata.cloud/"
								demoUrl="https://app.netdata.cloud/spaces/netdata-demo/rooms/all-nodes/overview?_gl=1*1dh0cmr*_gcl_au*MTg4Mjc1MDEwMS4xNzYwMDk2NzEw*_ga*MzE3NjE0MjU3LjE3NTIzMTcxNzM.*_ga_J69Z2JCTFB*czE3NjQ3MDc5MDkkbzEyJGcxJHQxNzY0NzA5NzcwJGozOCRsMCRoMA..#metrics_correlation=false&after=-900&before=0&utc=Europe%2FAthens&offset=%2B2&timezoneName=E.%20Europe&modal=&modalTab=&_o=q1ZKzkgsKvFLzE3VLUvMUbJSyk3NK413LCjIyUxOLMnMzyvWNYgvLk3CJhyQX1ySXpRarGuopKOUYpFokmqQbKprnmxuqWtiaGKqa2lgkKprYZxomWZglpacZJaoq0sd22oB"
								visibility="Moderate"
								visibilityNotes="Offers information over the quantity of locks active or waiting, but no further details"
								setup="Perfection! Straightforward setup process with no issues whatsoever. Best from a enterprise provider."
								warnSetup={false}
								score="6.5"
							/>

							<ReviewRow
								tool="PGBadger"
								url="https://github.com/darold/pgbadger"
								demoUrl="https://pgbadger.darold.net/examples/sample.html#locks-type"
								visibility="Low"
								visibilityNotes="Provides information via log interpretation, but it isn't suitable for live monitoring"
								setup="N/A: I did not personally set up the tool, just used it"
								warnSetup={false}
								score="5"
							/>

							<ReviewRow
								tool="PGHero"
								url="https://github.com/ankane/pghero"
								demoUrl="https://pghero.dokkuapp.com/"
								visibility="None"
								visibilityNotes="Provides no information over locks"
								setup="Trivial to set up. Download, deploy, connect to your Postgres instance"
								warnSetup={false}
								score="3"
							/>

							<ReviewRow
								tool="Redgate Monitor"
								url="https://www.red-gate.com/products/redgate-monitor/"
								demoUrl="https://monitor.red-gate.com/GlobalDashboard"
								visibility="None"
								visibilityNotes="Offers no visibility over locks"
								setup="The worst out of all them. Offensively tediuos and unintuitive"
								warnSetup={true}
								score="3"
							/>
						</tbody>
					</table>
				</div>
			</div>
			<p class="mt-4">
				For my review process, I created a few throwaway Postgres servers on <a
					class="a"
					href="https://hetzner.cloud/?ref=rTQwfR1oZc81">Hetzner</a
				> to deploy the software to. I wanted full control over the system just in case I needed to apply
				any special configurations to get everything to work. I documented the setup process below if
				you want to check it out, but it's important to note that if you're using a DB provider, like
				AWS RDS, Supabase, etc. the tools I tested may not be compatible with those platforms.
			</p>
			<DropDown title="Review Process">
				<DropDown title="Hetzner Setup">
					<section class="explainer_section">
						<SectionHeader>Deploying a server on Hetzner</SectionHeader>
						<Quote>
							Note: to connect to the server, you will need to use SSH. Here's a <a
								href="https://uchicago-cs.github.io/student-resource-guide/vscode/ssh.html"
								class="a">guide</a
							>
							to use SSH with VSCode. You must also know how to work in a terminal/command_line environment.
						</Quote>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
							1. Create a <a class="a font-bold" href="https://hetzner.cloud/?ref=rTQwfR1oZc81"
								>Hetzner Account</a
							>
						</h4>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
							2. Create a new <a class="a font-bold" href="https://console.hetzner.cloud/projects"
								>Cloud</a
							> project
						</h4>
						<Image src={new_project} alt="creating a new project" />
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">3. Create a new server</h4>
						<div class="pl-4">
							<p class="p">
								You will be given a few options for configurations. Outside of IPv4 and the Linux
								Flavor, you can go with the defaults. Feel free to pick the most affordable server,
								too.
							</p>
							<Image src={new_server} alt="creating a new server" />
						</div>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
							Select Ubuntu for your Linux flavor
						</h4>
						<div class="pl-4">
							<Image src={pick_ubuntu} alt="selecting Ubuntu" />
						</div>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Enable IPv4</h4>
						<div class="pl-4">
							<p class="p">
								Some of the providers I tested were not yet IPv6 compliant, so IPv4 is necessary.
							</p>
							<Image src={IPv4} alt="enabling IPv4" />
						</div>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Deploy</h4>
						<div class="pl-4">
							<p class="p">
								Once the server is up and running, you should receive an email with your SSH
								configs, assuming you didn't manually set up SSH beforehand.
							</p>
						</div>
					</section>
				</DropDown>
				<DropDown title="Postgres Setup">
					<section class="explainer_section">
						<SectionHeader>Deploying Postgres to Ubuntu</SectionHeader>
						<p class="p">
							Although one could go through the effort of <a
								href="https://medium.com/@bbrenng1/compiling-postgres-from-source-on-ubuntu-a2cbf0235878"
								class="a">compiling PG from source</a
							>, one could also just use Ubuntu's package manager to quickly deploy it. At the time
							of writing, Hetzner Ubuntu targets PG16 by default. This was fine for tests,
							especially because some tools, such as Redgate and Datadog are not yet compatible with
							PG18 (the latest release).
						</p>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Install PG from the terminal</h4>
						<div class="pl-4">
							<!-- prettier-ignore  -->
							<CodeBlock>
sudo apt update
sudo apt install postgresql-16 -y
                    </CodeBlock>
						</div>

						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
							Reconfigure the pg_hba.conf file
						</h4>
						<div class="pl-4">
							<p>
								The <CodeHighlight>pg_hba.conf</CodeHighlight> file determines who's allowed to connect
								to your Postgres server. If too loosely configured, you will likely be hacked by bots.
								While exploring these services, bots actually tried to hack me over 1,000 times, so this
								step is actually critical.
							</p>
							<p class="p">The file can be found in the path:</p>
							<CodeBlock label="pg_hba.conf">/etc/postgresql/16/main/pg_hba.conf</CodeBlock>
							<p class="p">
								Append the below settings. On top of the default settings, which allow you to
								connect from within the machine, the new ones tell the server to also accept
								encrypted password authentication from external IPs
							</p>
							<!-- prettier-ignore  -->
							<CodeBlock label='pg_hba.conf'>
# Block all online connections that do not use SSL
hostnossl    all        all             all                     reject

# Allow requests from anywhere using SSL
hostssl      all        all            0.0.0.0/0                scram-sha-256
hostssl      all        all            ::0/0                    scram-sha-256
                    </CodeBlock>
						</div>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
							Modify the postgresql.conf file
						</h4>
						<div class="pl-4">
							<p class="p">
								This file determines server settings. Below's is the path to its default location
							</p>
							<CodeBlock label="postgresql.conf">/etc/postgresql/16/main/postgresql.conf</CodeBlock>
							<p class="p">
								Change the <CodeHighlight>listen_addresses</CodeHighlight> setting to '*', so that any
								external IP can attempt to connect. Although not best practice, it simplifies the process
								of configuring the monitoring tools.
							</p>
							<CodeBlock>listen_addresses = '*' # what IP address(es) to listen on</CodeBlock>
							<p class="p">
								Then go to the website <a class="a" href="https://pgtune.leopard.in.ua/">pgtune</a> and
								change your other settings based on its recommendations. Restart the database, so the
								changes take affect.
							</p>
							<CodeBlock label="restart PG">sudo systemctl restart postgresql</CodeBlock>
						</div>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
							PSQL into PG and alter your password
						</h4>
						<div class="pl-4">
							<p class="p">
								Ubuntu creates a new Linux user <CodeHighlight>postgres</CodeHighlight> that can access
								the DB by default. Impersonate that user with the <CodeHighlight>su</CodeHighlight> command
							</p>
							<CodeBlock label="impersonate">su postgres</CodeBlock>
							<p class="p">Then PSQL into the instance:</p>
							<CodeBlock label="impersonate">psql</CodeBlock>
							<p class="p">
								Alter the Postgres role's password (do not forget it). The database is a dummy
								instance, so it doesn't need to be too sophisticated, but it shouldn't be simple
								enough that one of the many scraping bots that target exposed PG servers could guess
								it in a few hundred tries.
							</p>
							<CodeBlock label="impersonate"
								>ALTER ROLE postgres WITH password 'your_new_password';</CodeBlock
							>
							<p class="p">Exit the PSQL session</p>
							<CodeBlock label="impersonate">exit</CodeBlock>
							<p class="p">
								Then run <CodeHighlight>exit</CodeHighlight> again to stop impersonating the postgres
								Linux user
							</p>
							<CodeBlock label="impersonate">exit</CodeBlock>
						</div>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
							Change your environment variables for Postgres. It makes it simpler to connect from
							within your machine.
						</h4>
						<div class="pl-4">
							<!-- prettier-ignore  -->
							<CodeBlock>
export PGHOST=localhost
export PGPORT=5432
export PGPASSWORD=&lt;password&gt;
export PGDATABASE=postgres
export PGUSER=postgres
                    </CodeBlock>
						</div>
					</section>
				</DropDown>

				<p class="p">
					To test blocking, I set up a <a
						href="https://www.postgresql.org/docs/current/pgbench.html"
						class="a">PGBench</a
					> test script to generate problematic locks. If you're unfamiliar with PGBench, it's a benchmarking
					tool that comes bundled with Postgres.
				</p>
				<DropDown title="PGBench Setup">
					<section class="explainer_section">
						<SectionHeader>Configuring PGBench</SectionHeader>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
							Create a folder as the root user to hold your scripts
						</h4>
						<div class="pl-4">
							<CodeBlock label="pgbench folder">mkdir pgbench_scripts</CodeBlock>
						</div>

						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Create the test scripts</h4>
						<div class="pl-4">
							<!-- prettier-ignore  -->
							<CodeBlock label='create_hard_locks.sql'>
BEGIN;
	DROP TABLE testing.users;
	SELECT pg_sleep(1);
ROLLBACK;
                    </CodeBlock>
							<!-- prettier-ignore  -->
							<CodeBlock label="normal_op.sql">
BEGIN; 
    SELECT * FROM testing.users 
    WHERE id = floor(1 + random() * 100_000); 
COMMIT;
					</CodeBlock>
							<!-- prettier-ignore  -->
							<CodeBlock label="sharelock_long.sql">
BEGIN; 
    UPDATE testing.users 
    SET id = 1_000_001 
    WHERE id = 5; 
    SELECT pg_sleep(1);
ROLLBACK;
					</CodeBlock>
							<!-- prettier-ignore  -->
							<CodeBlock label="sharelock.sql">
BEGIN; 
    UPDATE testing.users 
    SET id = 1_000_001 
    WHERE id = 5; 
ROLLBACK;
                    </CodeBlock>
							<!-- prettier-ignore  -->
							<CodeBlock label="setup.sql">
CREATE SCHEMA IF NOT EXISTS testing;

CREATE TABLE IF NOT EXISTS testing.users (
	id int NOT NULL UNIQUE,
	user_id UUID NOT NULL,
	first_name text,
	last_name text,
	email text
);

-- faster means to vacuum full table
TRUNCATE testing.users;

-- repopulate table with 100K rows
INSERT INTO testing.users (
	id,
	user_id,
	first_name,
	last_name,
	email
)
SELECT 
	id,
	gen_random_uuid() AS user_id,
	random()::TEXT AS first_name,
	random()::TEXT AS last_name,
	random()::TEXT || '@gmail.com' AS email
FROM generate_series(1, 100_000) AS id;
					</CodeBlock>
						</div>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
							Change your environment variables for Postgres. It makes it simpler to connect from
							within your machine.
						</h4>
						<div class="pl-4">
							<!-- prettier-ignore  -->
							<CodeBlock>
export PGHOST=localhost
export PGPORT=5432
export PGPASSWORD=&lt;password&gt;
export PGDATABASE=postgres
export PGUSER=postgres
                    </CodeBlock>
						</div>

						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
							In your machine, run the setup script
						</h4>
						<div class="pl-4">
							<p class="p">
								This file determines server settings. Below's is the path to its default location
							</p>
							<!-- prettier-ignore  -->
							<CodeBlock label="setup with PSQL">
psql -U postgres -d postgres -f ./setup.sql
                    </CodeBlock>
						</div>
						<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Run PGBench</h4>
						<div class="pl-4">
							<p class="p">The below command runs the script</p>
							<!-- prettier-ignore  -->
							<CodeBlock label="run operations for 1000s">
pgbench \
    -f ./normal_op.sql@200 \
    -f ./create_hard_locks.sql@1 \
    -f ./sharelock_long.sql@1 \
    -f ./sharelock.sql@2 \
    -n \
    -j 2 \
    -c 15 \
    -T 1000
                    </CodeBlock>
						</div>
					</section>
				</DropDown>

				<Quote>
					<strong class="mt-4 pb-4">NOTE:</strong>
					<p>
						To save time, I didn't deploy PGBadger and PGWatch to my machine, but instead relied on
						their publicly available demoes to make my assessemnts. This was not my original plan,
						but the setup process for many services proved frustrating and time-consuming. Redgate,
						in particular, required an unreasonable amount of effort just to evaluate, and after
						more than nine hours spent trialing tools, I made concessions to ensure all services
						could still be reviewed.
					</p>
				</Quote>
			</DropDown>
		</section>
		<Redgate />
		<Datadog />
		<Pganalyze />
		<Netdata />
		<Pgbadger />
		<PMM />
		<PGHero />
		<Pgwatch />
	</section>
</article>
