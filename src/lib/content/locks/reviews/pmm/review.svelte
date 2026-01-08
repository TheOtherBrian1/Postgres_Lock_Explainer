<script lang="ts">
	import ImageCont from '$lib/components/image_cont.svelte';

	// IMAGES ----------------------------
	import Conflicts from '$lib/assets/PMM/Conflicts.png';
	import Duration from '$lib/assets/PMM/duration.png';
	import QueryPerformance from '$lib/assets/PMM/query_performance_and_time.png';
</script>

<p class="p">
	<strong>TL;DR</strong> Moderate support for lock monitoring. Fairly good metrics overall. Pleasant
	installaiton process. Live
	<a
		href="https://pmmdemo.percona.com/graph/d/postgresql-instance-summary/postgresql-instance-summary?from=now-7d&to=now&timezone=America%2FNew_York&var-interval=$__auto&var-qthres=0.100&var-slowq=0&var-srvcnt=2&var-rangeCustom=10080&var-clustercnt=1&var-withoutcluster=1&var-environment=$__all&var-cluster=$__all&var-node_name=pmm-server&var-service_name=pmm-server-postgresql&orgId=1&var-database=$__all&var-version=14.19&var-service_type=$__all&var-uptime=45.60035768750001&var-currentConn=10&var-activeConn=3&var-node_id=pmm-server&var-uptimedecimal=45.6&var-max_connections=100&var-work_mem=4194304&var-shared_buffers=134217728&var-wal_buffers=4194304&var-wal_segment_size=16777216&var-maintenance_work_mem=67108864&var-block_size=8192&var-checkpoint_segments=&var-checkpoint_timeout=300&var-fsync=1&var-default_statistics_target=100&var-seq_page_cost=1&var-random_page_cost=4&var-effective_cache_size=4294967296&var-effective_io_concurrency=1&var-autovacuum=1&var-autovacuum_analyze_scale_factor=0.1&var-autovacuum_analyze_threshold=50&var-autovacuum_vacuum_scale_factor=0.2&var-autovacuum_vacuum_threshold=50&var-autovacuum_vacuum_cost_limit=1767595127000&var-autovacuum_vacuum_cost_delay=0.002&var-autovacuum_max_workers=3&var-autovacuum_naptime=60&var-autovacuum_freeze_max_age=200000000&var-logging_collector=0&var-log_min_duration_statement=1767595127000&var-log_duration=0&var-log_lock_waits=0&var-max_wal_senders=10&var-max_wal_size=1073741824&var-min_wal_size=83886080&var-wal_compression=0&var-max_worker_processes=8&var-max_parallel_workers_per_gather=2&var-max_parallel_workers=2&var-autovacuum_work_mem=1767595127000&var-autovacuum_multixact_freeze_max_age=400000000&var-service_id=7f81a4af-b887-4cba-9835-ffdb1c762c92"
		class="a">demo</a
	> for the curious.
</p>

<p class="p">
	Unlike the other tools, which often relied on the pg_stats_statment extension, PMM encouraged
	users to use their in-house pg_stat_monitor extension instead. Installing it was a bit tricky, but
	not too burdensome. I can imagine it has a slightly higher performance penalty, but for decently
	sized servers, the tradeoff is likely worth it. I greatly appreciated having more information
	about how query performance changed over time.
</p>
<p class="p">
	However, the lock system only told me what locks were active at a given time. From this, it would
	be easier to identify lock interference, but not any easier to identify which queries were causing
	the most lock contention.
</p>
<p class="p">Some metrics it tracks that I believe would be helpful for lock monitoring include:</p>
<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Locks held at a given time</h4>
<ImageCont src={Conflicts} alt="graph of lock over time" />

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Samples queries their execution times</h4>
<ImageCont src={QueryPerformance} alt="graph of query performance over time" />

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Samples transaction durations</h4>
<ImageCont src={Duration} alt="graph of transaction durations" />
