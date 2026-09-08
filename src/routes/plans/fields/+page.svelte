<script lang="ts">
	// COMPONENTS -----------------------
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import SectionHeader from '$lib/components/section_header.svelte';
	import UnorderedList from '$lib/components/lists/unordered_list.svelte';
	import DropDown from '$lib/components/drop_down.svelte';
	import Quote from '$lib/components/quote.svelte';
	import TabGroup from '$lib/components/troubleshooting_tab.svelte';

	// ANIMATIONS -----------------------
	import CSVScan from '$lib/content/locks/animation/csv_scan2.svelte';
	import CSVScan3 from '$lib/content/locks/animation/csv_scan3.svelte';
	import CSVMemoryOverlaod from '$lib/content/locks/animation/csv_memory_overload.svelte';
	import NumberedList from '$lib/components/lists/numbered_list.svelte';
	import MemorySwap from '$lib/content/locks/animation/memory_swap.svelte';
	import LargePage from '$lib/content/locks/animation/large_page.svelte';
	import Index from '$lib/content/locks/animation/index.svelte';

	// IMAGES ---------------------------
	import blackhole from '$lib/assets/blackhole.webp';
	import Thrashing from '$lib/content/locks/animation/thrashing.svelte';
	import hardDrive from '$lib/assets/hard_drive.jpg';

	const memoryModifiers = {
		'Memory Allocated': {
			sourceFunction: 'show_memory_counters',
			appliesTo: ['Planning'],
			description: 'Total memory allocated during planning, in kilobytes.',
			example: 8,
			requiredExplainMods: ['MEMORY']
		},
		'Memory Used': {
			sourceFunction: 'show_memory_counters',
			appliesTo: ['Planning'],
			description: 'Peak memory used during planning, in kilobytes.',
			example: 7,
			requiredExplainMods: ['MEMORY']
		}
		// Planning: {
		// 	sourceFunction: 'ExplainOnePlan',
		// 	appliesTo: ['Root Level Plan'],
		// 	description:
		// 		'Container holding buffer usage (BUFFERS) and/or memory counters (MEMORY) from the planning phase.',
		// 	example: {},
		// 	requiredExplainMods: ['BUFFERS or MEMORY']
		// }
	};

	const summaryModifiers = {
		'Planning Time': {
			sourceFunction: 'ExplainOnePlan',
			appliesTo: ['Root Level Plan'],
			description:
				'Time spent planning, in milliseconds. Gated on SUMMARY, which defaults to TRUE with ANALYZE and FALSE for just EXPLAIN.',
			example: 0.045,
			requiredExplainMods: ['SUMMARY']
		},
		'Execution Time': {
			sourceFunction: 'ExplainOnePlan',
			appliesTo: ['Root Level Plan'],
			description:
				'Total execution time in milliseconds, excluding planning. Requires ANALYZE and SUMMARY (SUMMARY defaults to TRUE with ANALYZE).',
			example: 209.872,
			requiredExplainMods: ['ANALYZE', 'SUMMARY']
		}
	};
	const verboseModifiers = {
		'Query Identifier': {
			sourceFunction: 'ExplainPrintPlan',
			appliesTo: ['Root Level Plan'],
			description:
				"64-bit hash of the query (unique identifier for a query) - same strategy used by <a class='a' href='https://www.postgresql.org/docs/current/pgstatstatements.html'>pg_stat_statements</a>. Helpful to use with <a href='https://www.postgresql.org/docs/current/auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-VERBOSE' class='a'>auto_explain</a> to track plans in the logs. Requires <a href='https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-COMPUTE-QUERY-ID' class='a'>compute_query_id</a> to be enabled in addition to VERBOSE.",
			example: -1234567890123456789,
			requiredExplainMods: ['VERBOSE']
		},
		Schema: {
			sourceFunction: 'ExplainTargetRel',
			appliesTo: [
				'Seq Scan',
				'Sample Scan',
				'Index Scan',
				'Index Only Scan',
				'Bitmap Heap Scan',
				'Tid Scan',
				'Tid Range Scan',
				'Foreign Scan (on a relation)',
				'Custom Scan (on a relation)',
				'ModifyTable'
			],
			description:
				'The schema containing the target table. Only emitted for ordinary relations. Function Scans do not get a Schema property.',
			example: 'public',
			requiredExplainMods: ['VERBOSE']
		},
		Output: {
			sourceFunction: 'show_plan_tlist',
			appliesTo: ['All Plan Nodes'],
			description:
				'List of expressions and columns outputted by this node to either the client or parent node.',
			example: `'id', 'col_1'`,
			requiredExplainMods: ['VERBOSE']
		},
		'Function Call': {
			sourceFunction: 'show_expression',
			appliesTo: ['Function Scan'],
			description: 'The full function invocation expression with arguments',
			example: 'generate_series(1, 1000)',
			requiredExplainMods: ['VERBOSE']
		}
	};

	const bufferModifiers = {
		'Shared Hit Blocks': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description:
				'Shared buffer pages found already in the buffer pool. Node-level values need ANALYZE; planning-phase values need only BUFFERS. Since PG18, BUFFERS defaults to ON with ANALYZE.',
			example: 3,
			requiredExplainMods: ['BUFFERS']
		},
		'Shared Read Blocks': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Pages requested from the OS, which may come from the OS cache or disk.',
			example: 0,
			requiredExplainMods: ['BUFFERS']
		},
		'Shared Dirtied Blocks': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description:
				'Shared buffer pages dirtied by this node/phase. A page that is already dirty cannot be marked dirty twice.',
			example: 0,
			requiredExplainMods: ['BUFFERS']
		},
		'Shared Written Blocks': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description:
				'Shared buffer pages written out by this process. If they are dirty, they will be forcefully written to disk synchronously.',
			example: 0,
			requiredExplainMods: ['BUFFERS']
		},
		'Local Hit Blocks': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description:
				'Local (temporary-table) buffer pages found in session buffers (defined by the temp_buffers setting) ',
			example: 0,
			requiredExplainMods: ['BUFFERS']
		},
		'Local Read Blocks': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Local buffer pages read from disk or the OS cache.',
			example: 0,
			requiredExplainMods: ['BUFFERS']
		},
		'Local Dirtied Blocks': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Local buffer pages dirtied.',
			example: 0,
			requiredExplainMods: ['BUFFERS']
		},
		'Local Written Blocks': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Local buffer pages evicted from buffers.',
			example: 0,
			requiredExplainMods: ['BUFFERS']
		},
		'Temp Read Blocks': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Temp-file blocks read (sort/hash spill files).',
			example: 0,
			requiredExplainMods: ['BUFFERS']
		},
		'Temp Written Blocks': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Temp-file blocks written.',
			example: 0,
			requiredExplainMods: ['BUFFERS']
		},
		'Shared I/O Read Time': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description:
				'Milliseconds spent reading shared blocks. Requires track_io_timing = on in addition to BUFFERS; zero/absent otherwise.',
			example: 0.0,
			requiredExplainMods: ['BUFFERS']
		},
		'Shared I/O Write Time': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Milliseconds spent writing shared blocks. Requires track_io_timing.',
			example: 0.0,
			requiredExplainMods: ['BUFFERS']
		},
		'Local I/O Read Time': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Milliseconds spent reading local blocks. Requires track_io_timing.',
			example: 0.0,
			requiredExplainMods: ['BUFFERS']
		},
		'Local I/O Write Time': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Milliseconds spent writing local blocks. Requires track_io_timing.',
			example: 0.0,
			requiredExplainMods: ['BUFFERS']
		},
		'Temp I/O Read Time': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Milliseconds spent reading temp files. Requires track_io_timing.',
			example: 0.0,
			requiredExplainMods: ['BUFFERS']
		},
		'Temp I/O Write Time': {
			sourceFunction: 'show_buffer_usage',
			appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
			description: 'Milliseconds spent writing temp files. Requires track_io_timing.',
			example: 0.0,
			requiredExplainMods: ['BUFFERS']
		},
		Planning: {
			sourceFunction: 'ExplainOnePlan',
			appliesTo: ['Root Level Plan'],
			description: 'Container holding buffer usage from the planning phase',
			example: 'N/A',
			requiredExplainMods: ['BUFFERS or MEMORY']
		}
	};

	const analyzeModifers = {/*
		'Actual Startup Time': {
			sourceFunction: 'ExplainNode',
			appliesTo: ['All Plan Nodes'],
			description:
				'Actual time in milliseconds before the first row was returned, averaged per loop. Requires node-level timing (TIMING, on by default with ANALYZE); omitted with TIMING OFF.',
			example: 0.096,
			requiredExplainMods: ['ANALYZE']
		},
		'Actual Total Time': {
			sourceFunction: 'ExplainNode',
			appliesTo: ['All Plan Nodes'],
			description:
				'Actual total time in milliseconds for this node, averaged per loop. Requires TIMING (on by default with ANALYZE); omitted with TIMING OFF.',
			example: 0.097,
			requiredExplainMods: ['ANALYZE']
		},
		'Actual Rows': {
			sourceFunction: 'ExplainNode',
			appliesTo: ['All Plan Nodes'],
			description:
				'Actual number of rows returned per loop of this node (a per-iteration average; since PG18 shown with two decimal places, e.g. 1.00).',
			example: 1.0,
			requiredExplainMods: ['ANALYZE']
		},
		'Actual Loops': {
			sourceFunction: 'ExplainNode',
			appliesTo: ['All Plan Nodes'],
			description: 'Number of times this plan node was executed.',
			example: 1,
			requiredExplainMods: ['ANALYZE']
		},
		'Rows Removed by Filter': {
			sourceFunction: 'show_instrumentation_count',
			appliesTo: ['Any node with a Filter'],
			description:
				"Number of rows discarded because they failed the node's Filter condition. Joins similarly get 'Rows Removed by Join Filter'.",
			example: 1,
			requiredExplainMods: ['ANALYZE']
		},
		'Rows Removed by Index Recheck': {
			sourceFunction: 'show_instrumentation_count',
			appliesTo: ['Index Scan', 'Index Only Scan', 'Bitmap Heap Scan'],
			description:
				'Rows rejected during recheck of lossy index quals (index scans) or during bitmap heap recheck (Bitmap Heap Scan).',
			example: 0,
			requiredExplainMods: ['ANALYZE']
		},
		'Heap Fetches': {
			sourceFunction: 'ExplainNode',
			appliesTo: ['Index Only Scan'],
			description: 'Number of heap tuples fetched during an Index Only Scan to verify visibility.',
			example: 0,
			requiredExplainMods: ['ANALYZE']
		},
		'Exact Heap Blocks': {
			sourceFunction: 'show_tidbitmap_info',
			appliesTo: ['Bitmap Heap Scan'],
			description:
				'Number of heap pages visited with exact (per-tuple) bitmap entries. Also reported per parallel worker.',
			example: 1,
			requiredExplainMods: ['ANALYZE']
		},
		'Lossy Heap Blocks': {
			sourceFunction: 'show_tidbitmap_info',
			appliesTo: ['Bitmap Heap Scan'],
			description:
				'Number of heap pages visited via lossy page-level bitmap entries (bitmap exceeded work_mem). Also reported per parallel worker.',
			example: 0,
			requiredExplainMods: ['ANALYZE']
		},
		'Workers Launched': {
			sourceFunction: 'ExplainNode',
			appliesTo: ['Gather', 'Gather Merge'],
			description: 'Actual number of parallel workers launched at execution time.',
			example: 1,
			requiredExplainMods: ['ANALYZE']
		},
		'Worker Number': {
			sourceFunction: 'ExplainOpenWorker',
			appliesTo: ['Worker'],
			description: 'The zero-based index of the parallel worker whose statistics follow.',
			example: 0,
			requiredExplainMods: ['ANALYZE']
		},
		Worker: {
			sourceFunction: 'ExplainFlushWorkersState',
			appliesTo: ['Workers'],
			description:
				"Container (anonymous object in JSON) holding one parallel worker's statistics inside a Workers array.",
			example: {},
			requiredExplainMods: ['ANALYZE']
		},
		Workers: {
			sourceFunction: 'ExplainFlushWorkersState',
			appliesTo: [
				'Any plan node below Gather/Gather Merge that has per-worker instrumentation (e.g., Sort, Incremental Sort, Aggregate, Memoize, Bitmap Heap Scan, and any node with per-worker timing/buffer stats)'
			],
			description:
				'Array of per-worker runtime statistics for the node. Appears on the individual parallel plan nodes, not on Gather itself; suppressed when the Gather is hidden (debug_parallel_query=regress).',
			example: [],
			requiredExplainMods: ['ANALYZE']
		},
		'Sort Method': {
			sourceFunction: 'show_sort_info',
			appliesTo: ['Sort'],
			description:
				'Sorting algorithm used at runtime (quicksort, top-N heapsort, external merge, external sort, still in progress). Also reported per parallel worker.',
			example: 'external merge',
			requiredExplainMods: ['ANALYZE']
		},
		'Sort Space Used': {
			sourceFunction: 'show_sort_info',
			appliesTo: ['Sort'],
			description: 'Memory or disk space consumed by the sort, in kilobytes.',
			example: 14224,
			requiredExplainMods: ['ANALYZE']
		},
		'Sort Space Type': {
			sourceFunction: 'show_sort_info',
			appliesTo: ['Sort'],
			description: "Storage medium used for sorting: 'Memory' or 'Disk'.",
			example: 'Disk',
			requiredExplainMods: ['ANALYZE']
		},
		'Full-sort Groups': {
			sourceFunction: 'show_incremental_sort_group_info',
			appliesTo: ['Incremental Sort'],
			description:
				"Container object with statistics for fully-sorted groups in an Incremental Sort. (There is no 'Incremental Sort Groups' key; the containers are 'Full-sort Groups' and 'Pre-sorted Groups'.) Also reported per parallel worker.",
			example: {},
			requiredExplainMods: ['ANALYZE']
		},

		'Pre-sorted Groups': {
			sourceFunction: 'show_incremental_sort_group_info',
			appliesTo: ['Incremental Sort'],
			description:
				'Container object with statistics for groups that only needed sorting of the non-presorted suffix.',
			example: {},
			requiredExplainMods: ['ANALYZE']
		},
		'Group Count': {
			sourceFunction: 'show_incremental_sort_group_info',
			appliesTo: ['Full-sort Groups', 'Pre-sorted Groups'],
			description: 'Number of groups processed in this Incremental Sort category.',
			example: 15625,
			requiredExplainMods: ['ANALYZE']
		},

		'Sort Methods Used': {
			sourceFunction: 'show_incremental_sort_group_info',
			appliesTo: ['Full-sort Groups', 'Pre-sorted Groups'],
			description: 'Array of sorting algorithms used across the groups in this category.',
			example: ['quicksort'],
			requiredExplainMods: ['ANALYZE']
		},
		'Sort Space Memory': {
			sourceFunction: 'show_incremental_sort_group_info',
			appliesTo: ['Full-sort Groups', 'Pre-sorted Groups'],
			description:
				"Container with average/peak in-memory sort space for the category. Disk usage appears under a parallel 'Sort Space Disk' container. (There is no plain 'Sort Space' key.)",
			example: {},
			requiredExplainMods: ['ANALYZE']
		},
		'Sort Space Disk': {
			sourceFunction: 'show_incremental_sort_group_info',
			appliesTo: ['Full-sort Groups', 'Pre-sorted Groups'],
			description: 'Container with average/peak on-disk sort space for the category.',
			example: {},
			requiredExplainMods: ['ANALYZE']
		},
		'Average Sort Space Used': {
			sourceFunction: 'show_incremental_sort_group_info',
			appliesTo: ['Sort Space Memory', 'Sort Space Disk'],
			description: 'Average sort space consumed per group, in kB.',
			example: 26,
			requiredExplainMods: ['ANALYZE']
		},
		'Peak Sort Space Used': {
			sourceFunction: 'show_incremental_sort_group_info',
			appliesTo: ['Sort Space Memory', 'Sort Space Disk'],
			description: 'Peak sort space consumed across all groups, in kB.',
			example: 26,
			requiredExplainMods: ['ANALYZE']
		},
		'Hash Buckets': {
			sourceFunction: 'show_hash_info',
			appliesTo: ['Hash'],
			description:
				'Number of buckets in the hash table built by a Hash node. HashAggregate does not emit bucket counts.',
			example: 1024,
			requiredExplainMods: ['ANALYZE']
		},
		'Original Hash Buckets': {
			sourceFunction: 'show_hash_info',
			appliesTo: ['Hash'],
			description: 'Initially planned bucket count before runtime expansion.',
			example: 1024,
			requiredExplainMods: ['ANALYZE']
		},
		'Hash Batches': {
			sourceFunction: 'show_hash_info',
			appliesTo: ['Hash'],
			description:
				'Number of batches used by the hash join (greater than 1 means spilling to disk).',
			example: 1,
			requiredExplainMods: ['ANALYZE']
		},
		'Original Hash Batches': {
			sourceFunction: 'show_hash_info',
			appliesTo: ['Hash'],
			description: 'Initially planned batch count before any runtime increase.',
			example: 1,
			requiredExplainMods: ['ANALYZE']
		},
		'Peak Memory Usage': {
			sourceFunction: 'show_hash_info / show_hashagg_info / show_memoize_info',
			appliesTo: ['Hash', 'Aggregate (Hashed/Mixed)', 'Memoize'],
			description:
				'Peak memory consumed in kilobytes by the hash table or memoize cache. Also reported per parallel worker where applicable.',
			example: 512,
			requiredExplainMods: ['ANALYZE']
		},
		'HashAgg Batches': {
			sourceFunction: 'show_hashagg_info',
			appliesTo: ['Aggregate (Hashed/Mixed)'],
			description:
				"Number of batches used by hash aggregation (greater than 1 means spilling to disk). Text format labels this simply 'Batches'.",
			example: 1,
			requiredExplainMods: ['ANALYZE']
		},
		'Disk Usage': {
			sourceFunction: 'show_hashagg_info',
			appliesTo: ['Aggregate (Hashed/Mixed)'],
			description: 'Disk space in kilobytes used by hash-aggregate spill files.',
			example: 1024,
			requiredExplainMods: ['ANALYZE']
		},
		'Cache Hits': {
			sourceFunction: 'show_memoize_info',
			appliesTo: ['Memoize'],
			description: 'Number of successful cache lookups. Also reported per parallel worker.',
			example: 150,
			requiredExplainMods: ['ANALYZE']
		},
		'Cache Misses': {
			sourceFunction: 'show_memoize_info',
			appliesTo: ['Memoize'],
			description: 'Number of cache lookup misses.',
			example: 50,
			requiredExplainMods: ['ANALYZE']
		},
		'Cache Evictions': {
			sourceFunction: 'show_memoize_info',
			appliesTo: ['Memoize'],
			description: 'Number of cache entries evicted due to memory pressure.',
			example: 0,
			requiredExplainMods: ['ANALYZE']
		},
		'Cache Overflows': {
			sourceFunction: 'show_memoize_info',
			appliesTo: ['Memoize'],
			description: "Number of times a single scan's results exceeded the cache memory limit.",
			example: 0,
			requiredExplainMods: ['ANALYZE']
		},
		'Tuples Inserted': {
			sourceFunction: 'show_modifytable_info',
			appliesTo: ['ModifyTable (INSERT ... ON CONFLICT, MERGE)'],
			description:
				'Number of tuples actually inserted. Only reported for INSERT with ON CONFLICT (alongside Conflicting Tuples) and for MERGE; plain INSERT/UPDATE/DELETE do not emit per-operation tuple counts here.',
			example: 100,
			requiredExplainMods: ['ANALYZE']
		},
		'Tuples Updated': {
			sourceFunction: 'show_modifytable_info',
			appliesTo: ['ModifyTable (MERGE)'],
			description: 'Number of tuples updated by MERGE actions.',
			example: 50,
			requiredExplainMods: ['ANALYZE']
		},
		'Tuples Deleted': {
			sourceFunction: 'show_modifytable_info',
			appliesTo: ['ModifyTable (MERGE)'],
			description: 'Number of tuples deleted by MERGE actions.',
			example: 10,
			requiredExplainMods: ['ANALYZE']
		},
		'Tuples Skipped': {
			sourceFunction: 'show_modifytable_info',
			appliesTo: ['ModifyTable (MERGE)'],
			description:
				"Number of source rows for which no MERGE action fired. (ON CONFLICT DO NOTHING skips are counted under 'Conflicting Tuples', not here.)",
			example: 5,
			requiredExplainMods: ['ANALYZE']
		},
		'Conflicting Tuples': {
			sourceFunction: 'show_modifytable_info',
			appliesTo: ['ModifyTable (INSERT ... ON CONFLICT)'],
			description:
				'Number of rows that hit a unique-constraint conflict (skipped by DO NOTHING, or updated by DO UPDATE before its WHERE filter).',
			example: 5,
			requiredExplainMods: ['ANALYZE']
		},

		Storage: {
			sourceFunction: 'show_storage_info',
			appliesTo: ['Material', 'CTE Scan', 'Table Function Scan', 'Recursive Union', 'WindowAgg'],
			description:
				"Storage medium the node's tuplestore ended up using: 'Memory' or 'Disk' (PG17+). Applies to tuplestore-backed nodes, not table scans; not 'heap'.",
			example: 'Memory',
			requiredExplainMods: ['ANALYZE']
		},
		'Maximum Storage': {
			sourceFunction: 'show_storage_info',
			appliesTo: ['Material', 'CTE Scan', 'Table Function Scan', 'Recursive Union', 'WindowAgg'],
			description:
				"Peak space actually used by the node's tuplestore, in kilobytes (PG17+). It is a measured runtime value, not a configured threshold.",
			example: 65,
			requiredExplainMods: ['ANALYZE']
		},
		'Index Searches': {
			sourceFunction: 'show_indexsearches_info',
			appliesTo: ['Index Scan', 'Index Only Scan', 'Bitmap Index Scan'],
			description:
				'Number of distinct index search operations performed (PG18+), e.g. incremented per rescan or per skip-scan/SAOP primitive search.',
			example: 1,
			requiredExplainMods: ['ANALYZE']
		},

		'Average Prefetch Distance': {
			sourceFunction: 'print_io_usage',
			appliesTo: ['ReadStream-backed scans: Bitmap Heap Scan, Seq Scan, Tid Range Scan'],
			description:
				'Master/PG19+: average read-ahead distance of the ReadStream, in blocks/pinned buffers. Enabled by EXPLAIN (ANALYZE, IO); the IO option requires ANALYZE (not BUFFERS). Also reported per parallel worker.',
			example: 262.629,
			requiredExplainMods: ['ANALYZE', 'IO']
		},
		'Max Prefetch Distance': {
			sourceFunction: 'print_io_usage',
			appliesTo: ['ReadStream-backed scans: Bitmap Heap Scan, Seq Scan, Tid Range Scan'],
			description: 'Master/PG19+: maximum read-ahead distance observed, in blocks.',
			example: 271,
			requiredExplainMods: ['ANALYZE', 'IO']
		},
		'Prefetch Capacity': {
			sourceFunction: 'print_io_usage',
			appliesTo: ['ReadStream-backed scans: Bitmap Heap Scan, Seq Scan, Tid Range Scan'],
			description:
				"Master/PG19+: maximum possible look-ahead distance (the stream's max pinned buffers), in blocks.",
			example: 272,
			requiredExplainMods: ['ANALYZE', 'IO']
		},
		'I/O Count': {
			sourceFunction: 'print_io_usage',
			appliesTo: ['ReadStream-backed scans: Bitmap Heap Scan, Seq Scan, Tid Range Scan'],
			description: 'Master/PG19+: number of I/O requests issued by the ReadStream.',
			example: 100,
			requiredExplainMods: ['ANALYZE', 'IO']
		},
		'I/O Waits': {
			sourceFunction: 'print_io_usage',
			appliesTo: ['ReadStream-backed scans: Bitmap Heap Scan, Seq Scan, Tid Range Scan'],
			description:
				'Master/PG19+: number of times the consumer had to wait for an I/O when pulling a buffer from the stream.',
			example: 10,
			requiredExplainMods: ['ANALYZE', 'IO']
		},
		'Average I/O Size': {
			sourceFunction: 'print_io_usage',
			appliesTo: ['ReadStream-backed scans: Bitmap Heap Scan, Seq Scan, Tid Range Scan'],
			description:
				'Master/PG19+: average size of I/O requests, measured in blocks (BLCKSZ units), not bytes.',
			example: 15.983,
			requiredExplainMods: ['ANALYZE', 'IO']
		},
		'Average I/Os In Progress': {
			sourceFunction: 'print_io_usage',
			appliesTo: ['ReadStream-backed scans: Bitmap Heap Scan, Seq Scan, Tid Range Scan'],
			description:
				'Master/PG19+: average number of concurrently in-progress I/O requests at issue time.',
			example: 1.2,
			requiredExplainMods: ['ANALYZE', 'IO']
		},

		'WAL Records': {
			sourceFunction: 'show_wal_usage',
			appliesTo: ['All Plan Nodes'],
			description:
				'Number of WAL records generated by this node. WAL usage is per-node only; it is not included in the Planning section.',
			example: 0,
			requiredExplainMods: ['ANALYZE', 'WAL']
		},
		'WAL FPI': {
			sourceFunction: 'show_wal_usage',
			appliesTo: ['All Plan Nodes'],
			description: 'Number of full page images written to WAL.',
			example: 0,
			requiredExplainMods: ['ANALYZE', 'WAL']
		},
		'WAL Bytes': {
			sourceFunction: 'show_wal_usage',
			appliesTo: ['All Plan Nodes'],
			description: 'Total WAL volume generated, in bytes.',
			example: 0,
			requiredExplainMods: ['ANALYZE', 'WAL']
		},
		'WAL Buffers Full': {
			sourceFunction: 'show_wal_usage',
			appliesTo: ['All Plan Nodes'],
			description: 'PG18+: number of times WAL buffers filled, forcing a write.',
			example: 0,
			requiredExplainMods: ['ANALYZE', 'WAL']
		},
		'WAL FPI Bytes': {
			sourceFunction: 'show_wal_usage',
			appliesTo: ['All Plan Nodes'],
			description: 'Master/PG19+: total bytes of full page images written to WAL.',
			example: 0,
			requiredExplainMods: ['ANALYZE', 'WAL']
		},

		Serialization: {
			sourceFunction: 'ExplainPrintSerialize',
			appliesTo: ['Root Level Plan'],
			description:
				'Container for result-serialization metrics (SERIALIZE requires ANALYZE). May also contain buffer-usage fields when BUFFERS is on.',
			example: {},
			requiredExplainMods: ['ANALYZE', 'SERIALIZE']
		},
		'Output Volume': {
			sourceFunction: 'ExplainPrintSerialize',
			appliesTo: ['Serialization'],
			description: 'Total size of serialized output, in kilobytes (not bytes).',
			example: 12,
			requiredExplainMods: ['ANALYZE', 'SERIALIZE']
		},
		Format: {
			sourceFunction: 'ExplainPrintSerialize',
			appliesTo: ['Serialization'],
			description:
				"Wire serialization format of the query results: 'text' or 'binary'. This is the SERIALIZE argument, not the EXPLAIN output format (so never json/xml/yaml).",
			example: 'text',
			requiredExplainMods: ['ANALYZE', 'SERIALIZE']
		},
		Time: {
			sourceFunction: 'ExplainPrintSerialize / report_triggers',
			appliesTo: ['Serialization', 'Trigger'],
			description:
				'Milliseconds spent serializing output, or executing a trigger. Only shown when TIMING is on (default with ANALYZE).',
			example: 85.043,
			requiredExplainMods: ['ANALYZE']
		},
		Triggers: {
			sourceFunction: 'ExplainPrintTriggers',
			appliesTo: ['Root Level Plan'],
			description: 'List of per-trigger execution statistics.',
			example: [],
			requiredExplainMods: ['ANALYZE']
		},
		Trigger: {
			sourceFunction: 'report_triggers',
			appliesTo: ['Triggers'],
			description: "Container (anonymous object in JSON) for one trigger's statistics.",
			example: {},
			requiredExplainMods: ['ANALYZE']
		},
		'Trigger Name': {
			sourceFunction: 'report_triggers',
			appliesTo: ['Trigger'],
			description: 'Name of the executed trigger.',
			example: 'trig_update_timestamp',
			requiredExplainMods: ['ANALYZE']
		},
		'Constraint Name': {
			sourceFunction: 'report_triggers',
			appliesTo: ['Trigger'],
			description:
				'Constraint associated with the trigger (for constraint triggers such as foreign keys).',
			example: 'fk_user_id',
			requiredExplainMods: ['ANALYZE']
		},
		Relation: {
			sourceFunction: 'report_triggers',
			appliesTo: ['Trigger'],
			description:
				'Table the trigger fired on; shown when the statement had multiple result relations.',
			example: 'nodes',
			requiredExplainMods: ['ANALYZE']
		},
		Calls: {
			sourceFunction: 'report_triggers',
			appliesTo: ['Trigger'],
			description: 'Number of times the trigger fired.',
			example: 10,
			requiredExplainMods: ['ANALYZE']
		},
		JIT: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['Root Level Plan', 'Workers'],
			description:
				'JIT compilation metrics container. Only appears when JIT actually ran, which in practice means the query was executed (ANALYZE); the whole section is also suppressed with COSTS OFF.',
			example: {},
			requiredExplainMods: ['ANALYZE']
		},
		Functions: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['JIT'],
			description: 'Number of functions JIT-compiled.',
			example: 4,
			requiredExplainMods: ['ANALYZE']
		},
		Options: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['JIT'],
			description:
				'Container of booleans for enabled JIT features (Inlining, Optimization, Expressions, Deforming).',
			example: {},
			requiredExplainMods: ['ANALYZE']
		},
		Inlining: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['Options', 'Timing'],
			description:
				'In Options: whether inlining was enabled (bool). In Timing: milliseconds spent inlining (requires TIMING).',
			example: true,
			requiredExplainMods: ['ANALYZE']
		},
		Optimization: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['Options', 'Timing'],
			description:
				'In Options: whether LLVM optimization was enabled (bool). In Timing: milliseconds spent optimizing (requires TIMING).',
			example: true,
			requiredExplainMods: ['ANALYZE']
		},
		Expressions: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['Options'],
			description: 'Whether expression JIT compilation was enabled.',
			example: true,
			requiredExplainMods: ['ANALYZE']
		},
		Deforming: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['Options'],
			description: 'Whether tuple-deforming JIT compilation was enabled.',
			example: true,
			requiredExplainMods: ['ANALYZE']
		},
		Timing: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['JIT'],
			description: 'JIT timing breakdown; only emitted with ANALYZE and TIMING both on.',
			example: {},
			requiredExplainMods: ['ANALYZE']
		},
		Generation: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['Timing'],
			description: 'Container for code-generation timing (contains Deform and Total).',
			example: {},
			requiredExplainMods: ['ANALYZE']
		},
		Deform: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['Generation'],
			description:
				'Milliseconds spent generating tuple-deforming code (included in Generation Total).',
			example: 0.116,
			requiredExplainMods: ['ANALYZE']
		},
		Emission: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['Timing'],
			description: 'Milliseconds spent emitting machine code.',
			example: 13.031,
			requiredExplainMods: ['ANALYZE']
		},
		Total: {
			sourceFunction: 'ExplainPrintJIT',
			appliesTo: ['Generation', 'Timing'],
			description:
				'Total milliseconds for code generation (inside Generation) or for all JIT phases (inside Timing).',
			example: 37.803,
			requiredExplainMods: ['ANALYZE']
		}
*/
	};

	/*





	<p>In this case, the planner is stating that:</p>
	{#snippet item1()}
		It is using a <CodeHighlight>Sequential Scan</CodeHighlight> on tab1
		<!-- prettier-ignore -->
		<CodeBlock>
Seq Scan on tab1
		</CodeBlock>
	{/snippet}
	{#snippet item2()}
		The cost to start the operation is 0
		<!-- prettier-ignore -->
		<CodeBlock>
(cost=0.00
		</CodeBlock>
		<p>The cost means:</p>
		<ul class="mb-10 ml-4 list-disc space-y-2">
			<li class="pl-4">
				<strong class="mb-1 block text-stone-900"> Page cost </strong>
				In order to fetch a
			</li>
		</ul>
	{/snippet}
	<NumberedList items={[item1, item2]} />
	<section class="explainer_section">
		<SectionHeader>The planner configs</SectionHeader>
		<p>All planner sub-fields (show up when using JSON output)</p>
		{#snippet item1()}
			<strong>Planning Time:</strong> Time spent planning in <CodeHighlight>ms</CodeHighlight>
			<!-- prettier-ignore  -->
			<CodeBlock>
"Planning Time": 0.042,
        </CodeBlock>
		{/snippet}
		{#snippet item2()}
			<strong>Execution Time:</strong> Time spent executing a query in <CodeHighlight
				>ms</CodeHighlight
			>
			<!-- prettier-ignore  -->
			<CodeBlock>
"Execution Time": 10.656
        </CodeBlock>
		{/snippet}
		{#snippet item3()}
			<strong>ExplainPropertyText(conf->name, setting, es);:</strong> Time spent executing a query
			in <CodeHighlight>ms</CodeHighlight>
			<!-- prettier-ignore  -->
			<CodeBlock>
"Execution Time": 10.656
        </CodeBlock>
		{/snippet}
		{#snippet item4()}
			<strong>Settings</strong> The configurations that the planner took into account while devising
			the query plan
			<!-- prettier-ignore  -->
			<CodeBlock>
    "Settings": &#123;
      "effective_cache_size": "6553MB",
      "maintenance_io_concurrency": "100",
      "effective_io_concurrency": "128"
    &#125;
        </CodeBlock>
		{/snippet}
		{#snippet item5()}
			<strong>JIT</strong> Shows how the JIT compiler modified operators to be more optimized
			<!-- prettier-ignore  -->
			<CodeBlock>
&#123;
  "JIT": &#123;
    "Functions": 4,
    "Options": &#123;
      "Inlining": true,
      "Optimization": true,
      "Expressions": true,
      "Deforming": true
    &#125;,
    "Timing": &#123;
      "Generation": &#123;
        "Deform": 0.116,
        "Total": 0.730
      &#125;,
      "Inlining": 7.659,
      "Optimization": 16.384,
      "Emission": 13.031,
      "Total": 37.803
    &#125;
  &#125;
&#125;
        </CodeBlock>
		{/snippet}

		{#snippet item6()}
			<strong>Query Identifier</strong> the query identifier
			<!-- prettier-ignore  -->
			<CodeBlock>
"Query Identifier": -6757913672274505220,
        </CodeBlock>
		{/snippet}

		{#snippet item7()}
			<strong>Triggers</strong> information about triggers that have been activated
			<!-- prettier-ignore  -->
			<CodeBlock>
&#123;
  "Triggers": [
    &#123;
      "Trigger Name": "trg_set_updated_at",
      "Relation": "accounts",
      "Time": 4.204,
      "Calls": 1
    &#125;
  ]
&#125;      

"Triggers": [
      &#123;
        "Trigger Name": "RI_ConstraintTrigger_c_73741",
        "Constraint Name": "child_parent_id_fkey",
        "Relation": "child",
        "Time": 0.236,
        "Calls": 1
      &#125;
</CodeBlock>
		{/snippet}

		{#snippet item8()}
			<strong>Serialization</strong> information about serialization
			<!-- prettier-ignore  -->
			<CodeBlock>

"Serialization": &#123;
      "Time": 0.000,
      "Output Volume": 20kB,
      "Format": "text",
      "Shared Hit Blocks": 0,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0
&#125;
        </CodeBlock>
		{/snippet}

		{#snippet item9()}
			<strong>Query Text</strong> Shows query text
			<!-- prettier-ignore  -->
			<CodeBlock>
Could not generate example normally
        </CodeBlock>
		{/snippet}
		<NumberedList items={[item1, item2, item3, item4, item5, item6, item7, item8, item9]} />
		<section class="explainer_section">
			<SectionHeader>The planner configs</SectionHeader>

			<Quote>
				<strong>NOTE</strong>: it is rare to adjust these settings casually. If the setting should
				be changed in most situations, I will make that obvious.
			</Quote>
			<div
				class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
			>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Cost Constants
				</h4>

				<p>
					Postgres uses its statistics to predict how many rows (internally known as tuples) and
					pages each operation will review.
				</p>

				<ul class="mb-10 ml-4 list-disc space-y-2">
					<li class="pl-4">
						<strong class="mb-1 block text-stone-900"> seq_page_cost </strong>

						The cost overhead of fetching a page sequentially (default 1). Used generally with
						sequential scans, index scans, or bitmap heap scans.
					</li>
				</ul>
			</div>
		</section>
	</section>
	
*/
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<SectionHeader>Understanding EXPLAIN</SectionHeader>
	<p>
		Now that we know the nodes and the settings that are considered, it is important to actually see
		query plans.
	</p>

	<p>
		To view the plan, you can place the <CodeHighlight>EXPLAIN</CodeHighlight> modifier at front of a
		query:
	</p>
	<CodeBlock>EXPLAIN SELECT * FROM tab1;</CodeBlock>

	<p>It will then produce an explain tree:</p>
	<!-- prettier-ignore -->
	<CodeBlock>
EXPLAIN SELECT * FROM tab1 WHERE id &gt; 1;

                        QUERY PLAN
-------------------------------------------------------------
Seq Scan on tab1  (cost=0.00..25.88 rows=423 width=36)
  Filter: (id &gt; 1)
	</CodeBlock>
	<p>The output shows you what the planner would have run based on its statistics of the data.</p>

	<p>Here's a breakdown:</p>

	<ul class="mb-10 ml-4 list-disc space-y-2">
		<li class="pl-4">
			<strong class="mb-1 block text-stone-900">
				Node Type (<CodeHighlight>Seq Scan on tab1</CodeHighlight>)
			</strong>
			<p class="font-medium">The planner decided to fetch the data with a sequential scan node</p>
		</li>
		<li class="pl-4">
			<strong class="mb-1 block text-stone-900">
				Cost (<CodeHighlight>cost=0.00..25.88</CodeHighlight>)
			</strong>
			<p class="font-medium">
				This oultines the cost to even start the operation and the end cost to finish it.
			</p>
			<p>
				Cost is an arbitary unit used to determine how expensive one node will be relative to
				another. Based on the table's statistics, the planner believes that the prerequisite cost to
				even start the operation will be <CodeHighlight>0.00</CodeHighlight>. Note, the prerequisite
				cost includes the cost of children operations, too.
			</p>
			<p>
				Based on the total amount of table pages it will have to review, the CPU cost of looking
				over those pages, and the CPU cost of running comparison operations against their values,
				the planner believes it will end up having a cost of <CodeHighlight>25.88</CodeHighlight>.
			</p>
		</li>
		<li class="pl-4">
			<strong class="mb-1 block text-stone-900">
				Rows (<CodeHighlight>rows=423</CodeHighlight>)
			</strong>
			<p class="font-medium">
				How many rows the planner expects to review before deciding which ones to return to either
				the client or a parent node.
			</p>
			<p>
				Estimating the total rows helps determine the cost overhead of running operations, such as <CodeHighlight
					>ILIKE</CodeHighlight
				> against each value.
			</p>
		</li>
		<li class="pl-4">
			<strong class="mb-1 block text-stone-900">
				Width (<CodeHighlight>width=36</CodeHighlight>)
			</strong>
			<p class="font-medium">
				The width field determines the expected average length of the rows that will have to be
				returned.
			</p>
			<p>
				A row that consists of just a single 32 bit integer will have a width of 32 bits. If it has
				a 32 bit integer and a 400 bit line of text, then its width will be 432 bits. For instance,
				if two rows will be returned, one of length 2 bits and another of length 4 bits, the
				expected average will be 3 bits.
			</p>
			<p>The planner estimates this value based on its statistics of the table.</p>
			<p>
				This estimate helps the planner determine the overhead of caching/storing the objects in
				memory temporarily. Though, for sequential scans, this value isn't useful. It could be
				helpful for something like memoize, though.
			</p>
		</li>
		<li class="pl-4">
			<strong class="mb-1 block text-stone-900">
				Filter (<CodeHighlight>Filter: (id &gt; 1)</CodeHighlight>)
			</strong>
			<p class="font-medium">This states that reviewed rows would be compared against a filter.</p>
			<p>
				<CodeHighlight>Filter</CodeHighlight> is just one of many node <CodeHighlight
					>Properties</CodeHighlight
				> and <CodeHighlight>Qualifiers</CodeHighlight>. They show extra information about how a
				node executed its operations.
			</p>
		</li>
	</ul>
	<h4
		class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
	>
		EXPLAIN modifiers
	</h4>
	<p>
		The <CodeHighlight>EXPLAIN</CodeHighlight> command has several options that expand its base output:
	</p>
	<div class="p- grid grid-cols-1 gap-4">
		<div class="  rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">ANALYZE</h4>
			<p
				style="text-decoration-underline: none"
				class=" p mt-2 border-none text-sm text-stone-600 no-underline"
			>
				Beyond just showing what the planner would run based on its statistics, it actually runs the
				query and shows the true overhead for each node.
			</p>
		</div>
		<div class="rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">VERBOSE</h4>
			<p class="p mt-2 border-none text-sm text-stone-600 no-underline">
				Provides extra information about the query plan, mainly in regards to table and function
				names, which otherwise may be omitted.
			</p>
		</div>

		<div class="rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">COSTS</h4>
			<p class="p mt-2 border-none text-sm text-stone-600 no-underline">
				It includes the node upfront and final cost. On by default.
			</p>
		</div>

		<div class="rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">SETTINGS</h4>
			<p class="p mt-2 border-none text-sm text-stone-600 no-underline">
				It includes configurations Postgres took into account when deciding which nodes to use in
				its plan.
			</p>
		</div>

		<div class="rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">GENERIC_PLAN</h4>
			<p class="p mt-2 border-none text-sm text-stone-600 no-underline">
				Introduced in PG 16, it allows one to run EXPLAIN against against queries with placeholders <CodeHighlight
					>$1</CodeHighlight
				> within <CodeHighlight>WHERE</CodeHighlight> clauses. It can be helpful for determing the overhead
				of certain plans when you do not have a good sample of data to test on.
			</p>
			<Quote>Cannot be run with <CodeHighlight>ANALYZE</CodeHighlight></Quote>
		</div>

		<div class="rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">BUFFERS</h4>
			<p class="p mt-2 border-none text-sm text-stone-600 no-underline">
				It outlines the amount of times a node referenced shared buffers for its pages or had to ask
				the OS to fetch data from elsewhere (disk or OS cache).
			</p>
			<Quote>Automatically used when <CodeHighlight>ANALYZE</CodeHighlight> is enabled</Quote>
		</div>

		<div class="rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">SERIALIZE</h4>
			<p class="p mt-2 border-none text-sm text-stone-600 no-underline">
				Tracks the costs and overhead involved with sending data from the database to the client.
			</p>
			<Quote>Must be run with <CodeHighlight>ANALYZE</CodeHighlight></Quote>
		</div>

		<div class="rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">WAL</h4>
			<p class="p mt-2 border-none text-sm text-stone-600 no-underline">WAL generation by node</p>
			<Quote>Must be run with <CodeHighlight>ANALYZE</CodeHighlight></Quote>
		</div>

		<div class="rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">TIMING</h4>
			<p class="p mt-2 border-none text-sm text-stone-600 no-underline">
				Amount of time spent on each node.
			</p>
			<Quote
				>Must be run with <CodeHighlight>ANALYZE</CodeHighlight> and defaults to true when <CodeHighlight
					>ANALYZE</CodeHighlight
				> is used</Quote
			>
		</div>

		<div class="rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">SUMMARY</h4>
			<p class="p mt-2 border-none text-sm text-stone-600 no-underline">
				Summary about overhead, such as total time for the entire query
			</p>
			<Quote>Enabled by default with <CodeHighlight>ANALYZE</CodeHighlight></Quote>
		</div>

		<div class="rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
			<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">MEMORY</h4>
			<p class="p mt-2 border-none text-sm text-stone-600 no-underline">
				Just tells you how much memory the planning phase took (not the execution phase)
			</p>
			<Quote
				>I try not to break the fourth wall in these docs, but I just need to add how sad this node
				makes me. I want to know how much memory each node uses, not how much memory the planning
				phase requires, which is usually negligible. For anyone wondering if it is possible to get
				memory usage by node - NO. Only a handful report their memory overhead. By happenstance,
				they're the ones that generally require the most memory.</Quote
			>
		</div>
	</div>
</article>
<SectionHeader>In Depth: Data provided by each EXPLAIN Option</SectionHeader>

<!-- MEMORY -->

<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
>
	<h4
		class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
	>
		MEMORY in depth
	</h4>
	<p>Shows memory in kilobytes used during the planning phase. It relies on two fields:</p>
	<ul class="mb-10 ml-4 list-disc space-y-2">
		{#each Object.entries(memoryModifiers) as [key, val]}
			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">
					{key}
				</strong>
				<p class="font-medium">
					{val.description}
				</p>
			</li>
		{/each}
	</ul>
	<DropDown title="Plan Examples">
		<!-- prettier-ignore -->
		<CodeBlock label="text format">
EXPLAIN (MEMORY) 
SELECT * FROM 
VALUES 
		(1, 'hello'),
		(2, 'world')
AS outcome(some_int, some_text);

                          QUERY PLAN                          
--------------------------------------------------------------
 Values Scan on "*VALUES*"  (cost=0.00..0.04 rows=3 width=36)
 Planning:
   Memory: used=11kB  allocated=16kB
(3 rows)
	</CodeBlock>
		<!-- prettier-ignore-->
		<CodeBlock label="json format">
EXPLAIN (MEMORY, FORMAT JSON) 
SELECT * FROM 
VALUES 
		(1, 'hello'),
		(2, 'world')
AS outcome(some_int, some_text);

            QUERY PLAN             
-----------------------------------

[
  &lbrace; 
    "Plan": &lbrace; 
      "Node Type": "Values Scan",
      "Parallel Aware": false,
      "Async Capable": false,
      "Alias": "*VALUES*",
      "Startup Cost": 0,
      "Total Cost": 0.04,
      "Plan Rows": 3,
      "Plan Width": 36
    &rbrace; ,
    "Planning": &lbrace; 
      "Memory Used": 11,
      "Memory Allocated": 16
    &rbrace; 
  &rbrace; 
]
	</CodeBlock>
	</DropDown>
</div>

<!-- VERBOSE -->

<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
>
	<h4
		class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
	>
		VERBOSE in depth
	</h4>
	<p>
		Includes identifying information about the schemas, queries, and columns/functions referenced by
		nodes. In my experience it is not very useful for live testing, but can enhance supporting
		tooling, such as <a href="https://www.postgresql.org/docs/current/auto-explain.html" class="a"
			>auto_explain</a
		>
	</p>
	<ul class="mb-10 ml-4 list-disc space-y-2">
		{#each Object.entries(verboseModifiers) as [key, val]}
			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">
					{key}
				</strong>
				<p class="font-medium">
					{@html val.description}
				</p>
				<p><span class="pr-2">Example:</span><CodeHighlight>{val.example}</CodeHighlight></p>
			</li>
		{/each}
	</ul>
	<DropDown title="Plan Examples">
		<p>Examples with normal tables.</p>
		<!-- prettier-ignore -->
		<CodeBlock label="text format">
CREATE TABLE example (id int);

EXPLAIN (VERBOSE) 
SELECT *, NOW() FROM example;

                            QUERY PLAN                             
-------------------------------------------------------------------
 Seq Scan on public.example  (cost=0.00..41.88 rows=2550 width=12)
   Output: id, now()
 Query Identifier: 8349264353673623874
	</CodeBlock>
		<!-- prettier-ignore-->
		<CodeBlock label="json format">
CREATE TABLE example (id int);

EXPLAIN (VERBOSE, FORMAT JSON) 
SELECT *, NOW() FROM example;

            QUERY PLAN             
-----------------------------------

[
  &lbrace; 
    "Plan": &lbrace; 
      "Node Type": "Seq Scan",
      "Parallel Aware": false,
      "Async Capable": false,
      "Relation Name": "example",
      "Schema": "public",
      "Alias": "example",
      "Startup Cost": 0,
      "Total Cost": 41.88,
      "Plan Rows": 2550,
      "Plan Width": 12,
      "Output": [
        "id",
        "now()"
      ]
    &rbrace;,
    "Query Identifier": -6100595365655136000
  &rbrace; 
]
	</CodeBlock>

		<p>Examples with functions</p>
		<!-- prettier-ignore-->
		<CodeBlock label='text'>
EXPLAIN (VERBOSE)
SELECT *, NOW() FROM generate_series(1,100);

                                    QUERY PLAN                                    
----------------------------------------------------------------------------------
 Function Scan on pg_catalog.generate_series  (cost=0.00..1.25 rows=100 width=12)
   Output: generate_series, now()
   Function Call: generate_series(1, 100)
 Query Identifier: 8599573785302140517
		</CodeBlock>

		<!-- prettier-ignore-->
		<CodeBlock label='json'>
EXPLAIN (VERBOSE, FORMAT JSON)
SELECT *, NOW() FROM generate_series(1,100);

                    QUERY PLAN                    
--------------------------------------------------
[
  &rbrace; 
    "Plan": &rbrace; 
      "Node Type": "Function Scan",
      "Parallel Aware": false,
      "Async Capable": false,
      "Function Name": "generate_series",
      "Schema": "pg_catalog",
      "Alias": "generate_series",
      "Startup Cost": 0,
      "Total Cost": 1.25,
      "Plan Rows": 100,
      "Plan Width": 12,
      "Output": [
        "generate_series",
        "now()"
      ],
      "Function Call": "generate_series(1, 100)"
    &lbrace;,
    "Query Identifier": -6934685096456829000
  &lbrace;
]
		</CodeBlock>
	</DropDown>
</div>

<!-- SUMMARY -->

<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
>
	<h4
		class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
	>
		SUMMARY in depth
	</h4>
	<p>
		In practice, <CodeHighlight>SUMMARY</CodeHighlight> is just an extension of <CodeHighlight
			>ANALYZE</CodeHighlight
		> and is automatically enabled when the latter is used.
	</p>
	<ul class="mb-10 ml-4 list-disc space-y-2">
		{#each Object.entries(summaryModifiers) as [key, val]}
			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">
					{key}
				</strong>
				<p class="font-medium">
					{@html val.description}
				</p>
				<p><span class="pr-2">Example:</span><CodeHighlight>{val.example}</CodeHighlight></p>
			</li>
		{/each}
	</ul>
	<DropDown title="Plan Examples">
		<p>Examples with just <CodeHighlight>SUMMARY</CodeHighlight></p>
		<!-- prettier-ignore -->
		<CodeBlock label="text format">
CREATE TABLE example (id int);

EXPLAIN (SUMMARY) 
SELECT *, NOW() FROM example;

                         QUERY PLAN                         
------------------------------------------------------------
 Seq Scan on example  (cost=0.00..41.88 rows=2550 width=12)
 Planning Time: 0.224 ms
	</CodeBlock>
		<!-- prettier-ignore-->
		<CodeBlock label="json format">
CREATE TABLE example (id int);

EXPLAIN (SUMMARY, FORMAT JSON) 
SELECT *, NOW() FROM example;

            QUERY PLAN             
-----------------------------------
[
  &lbrace;
    "Plan": &lbrace;
      "Node Type": "Seq Scan",
      "Parallel Aware": false,
      "Async Capable": false,
      "Relation Name": "example",
      "Alias": "example",
      "Startup Cost": 0,
      "Total Cost": 41.88,
      "Plan Rows": 2550,
      "Plan Width": 12
    &rbrace;,
    "Planning Time": 0.363
  &rbrace;
]
	</CodeBlock>

		<p>Examples with ANALYZE</p>
		<!-- prettier-ignore-->
		<CodeBlock label='text'>
-- SUMMARY is implicit
EXPLAIN (ANALYZE)
SELECT *, NOW() FROM generate_series(1,100);

                                                      QUERY PLAN                                                      
----------------------------------------------------------------------------------------------------------------------
 Function Scan on generate_series  (cost=0.00..1.25 rows=100 width=12) (actual time=0.201..0.209 rows=100.00 loops=1)
 Planning Time: 0.143 ms
 Execution Time: 0.285 ms
		</CodeBlock>

		<!-- prettier-ignore-->
		<CodeBlock label='json'>
-- SUMMARY is implicit
EXPLAIN (ANALYZE, FORMAT JSON)
SELECT *, NOW() FROM generate_series(1,100);

                    QUERY PLAN                    
--------------------------------------------------
[
  &lbrace;
    "Plan": &lbrace;
      "Node Type": "Function Scan",
      "Parallel Aware": false,
      "Async Capable": false,
      "Function Name": "generate_series",
      "Alias": "generate_series",
      "Startup Cost": 0,
      "Total Cost": 1.25,
      "Plan Rows": 100,
      "Plan Width": 12,
      "Actual Startup Time": 0.028,
      "Actual Total Time": 0.04,
      "Actual Rows": 100,
      "Actual Loops": 1
    &rbrace;,
    "Planning Time": 0.069,
    "Triggers": [],
    "Execution Time": 0.135
  &rbrace;
]
		</CodeBlock>
	</DropDown>
</div>

<!-- BUFFERS -->

<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
>
	<h4
		class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
	>
		BUFFERS in depth
	</h4>
	<p>BUFFERS is complex enough that it is worth providing a summary for those interested.</p>
	<p>
		If you're just using this as a reference, feel free to jump down to the node explanations and
		examples.
	</p>
	<TabGroup>
		{#snippet Summary()}
			<p>
				CPUs do not know how to examine data on disk, so before it can read/write from/to rows, it
				must pull it into memory.
			</p>
			<p>
				Because each request to the disk/OS has an overhead, instead of requesting 1 row at a time,
				it pulls data into memory in 8KB blocks called pages.
			</p>
			<p>
				Under normal circumstances, they will placed in a memory buffer called <a
					href="https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-BUFFERS"
					class="a">shared_buffers</a
				>.
			</p>
			<p>
				Beyond acting as the staging grounds for read/writes, it also acts as a cache. Once pages
				are placed in there, Postgres will only evict them if truly necessary. That way, they can be
				re-referenced without having to interact with the OS and/or disk again.
			</p>
			<p>
				<CodeHighlight>shared_buffers</CodeHighlight>, by default, is 128MB in size. This is just a
				historic value. Usually, one should start at 25% of their system's memory and then modify it
				as needed based on cache hit rate and spare memory capacity.
			</p>
			<p>
				The <CodeHighlight>BUFFER</CodeHighlight> modifier tells you how many buffer pages were accessed,
				dirtied (written to), and evicted (removed from cache and <em>potentially</em> written to disk
				synchronously). They'll only actually be written to disk if they're dirty.
			</p>
			<p>
				It helps you determine if buffers played a meaningful role in query performance and if it is
				worthwhile to tune shared_buffers.
			</p>
			<p>There are a few caveats with shared_buffers.</p>
			<p>
				This topic is actually very advanced with a lot of edge cases, so it is worth checking the
				advanced explanation tab.
			</p>
		{/snippet}
		{#snippet Advanced_Explanation()}
			<p>
				Some of this is based on my personal knowledge managing PG for large accounts, but a lot of
				the nitty details comes from <a href="https://www.interdb.jp/pg/pgsql08/04.html" class="a"
					>interdb.jp</a
				>, which is one of the best sources for learning PG internals.
				<a
					class="a"
					href="https://www.cybrosys.com/research-and-development/postgres/overview-of-buffer-access-strategies-in-postgresql"
					>Cybrosys</a
				> also has a few blog posts discussing buffers.
			</p>

			<p>
				Note to future Brian, add section on pg_stat_statements, refreshing statsitics, running
				VACUUM ANALYZE to not cripple a machine after reseting statistics, and cache monitoring.
			</p>
			{#snippet item1()}
				<strong>Ring Buffers:</strong>
				<p>
					If a table is 25+% the size of shared buffers <CodeHighlight
						>(table_size &gt;= shared_buffers/4)</CodeHighlight
					>, then, to prevent the table from flooding the shared_cache, a seperate ring buffer cache
					will be created for it. When <CodeHighlight>EXPLAIN BUFFERS</CodeHighlight> references these
					tables, they will show up with a high read (miss) rate because their local cache is small.
				</p>
				<p>
					This is intentional design and often compensated for by the OS cache. If you want to avoid
					this, either partition your tables to make them smaller or increase your shared_buffers
					setting.
				</p>
			{/snippet}
			{#snippet item2()}
				<strong>The OS cache will compensate:</strong>
				<p>
					When pages are evicted from shared_buffers, the OS can opt to store them in its own cache.
					That way, when the database requests the data again, it will still come from memory.
					Fetching data from the OS still has a greater overhead than shared_buffers, but it is
					mild, especially when compared to fetching data from disk.
				</p>
				<p>
					Unfortunately, the OS is not transparent about its cache hit rate for database objects, so
					one cannot definitively tell when it is intervening, but if the cache hit rate is poor,
					but read activity against disk is still low, it's reasonable to assume that the OS cache
					is intervening effectively.
				</p>
			{/snippet}

			{#snippet item3()}
				<strong>Temp buffers:</strong>
				<p>
					Temp tables get their own <strong>LOCAL</strong> buffers that exist for the liftime of the
					connection. The max size that all temp table buffers can combine to is determined by the <CodeHighlight
						>temp_buffers</CodeHighlight
					> settings. It defaults to 8MB and once exceeded, further temp pages must be written to disk
					for future reference.
				</p>
				<p>
					Unfortunately, PostgreSQL made the awkward choice of using the term local buffers in
					EXPLAIN to define memory used by temp tables. It makes it confusing to track.
				</p>
			{/snippet}
			{#snippet item4()}
				<strong>Local buffers and disk:</strong>
				<p>
					Intermediary objects, such as hash tables used for hashing operations, also have to be
					placed on disk or in memory.
				</p>
				<p>
					Most scans against normal tables and indexes do not have a high memory overhead, as
					they're just pulling in and out data from the pre-allocated shared_buffer.
				</p>
				<p>
					However, certain operations, such as hashing and sorting, do claim a meaningful amount of
					memory. Most operations like this report their memory overhead in their ANALYZE plan.
					However, once the memory limits, defined by the <CodeHighlight
						>hash_mem_multiplier</CodeHighlight
					> and
					<CodeHighlight>work_mem</CodeHighlight> settings, for an operation are exceeded, intermediary
					values are written to disk.
				</p>
				<p>
					<strong>TEMP</strong> space, that <CodeHighlight>EXPLAIN BUFFERS</CodeHighlight> reports, is
					in regard to read/writes to temp files on disk and are not in regard to memory overhead.
				</p>
			{/snippet}
			{#snippet item5()}
				<strong>Loops:</strong>
				<p>
					When a node is looped over multiple times (requires <CodeHighlight>ANALYZE</CodeHighlight
					>), each loop will be added to the running total of read, hit, written, and dirtied
					blocks. Essentially, it can double count values, so be wary.
				</p>
			{/snippet}
			<NumberedList items={[item1, item2, item3, item4, item5]} />
		{/snippet}
	</TabGroup>

	<ul class="mb-10 ml-4 list-disc space-y-2">
		{#each Object.entries(bufferModifiers) as [key, val]}
			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">
					{key}
				</strong>
				<p class="font-medium">
					{@html val.description}
				</p>
				<p><span class="pr-2">Example:</span><CodeHighlight>{val.example}</CodeHighlight></p>
			</li>
		{/each}
	</ul>
	<DropDown title="Plan Examples">
		<p>
			<strong
				>Examples highlighting <CodeHighlight>shared_buffers</CodeHighlight> interactions</strong
			>
		</p>
		<!-- prettier-ignore -->
		<CodeBlock label="text format">
-- to reproduce this example, use pg17 and set shared_buffers to 150MB. Then restart postgres.
ALTER SYSTEM SET shared_buffers = '150MB';

BEGIN;
-- note shared_buffers is set to 1GB for this e
CREATE TABLE example AS SELECT id FROM generate_series(1, 10000) AS id;

-- check to see the table's size. Should be around 512kB:
SELECT pg_size_pretty(pg_total_relation_size('example'));

-- NOTE: in text form, the plan will only include non-zero values
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM example;

ROLLBACK;

                                                  QUERY PLAN                                                  
--------------------------------------------------------------------------------------------------------------
 Seq Scan on example  (cost=0.00..227.20 rows=16320 width=4) (actual time=0.032..0.929 rows=10000.00 loops=1)
   Buffers: shared hit=64
 Planning:
   Buffers: shared hit=12 read=7
   I/O Timings: shared read=2.678
 Planning Time: 3.017 ms
 Execution Time: 1.455 ms
	</CodeBlock>
		<!-- prettier-ignore-->
		<CodeBlock label="json format">
CREATE TABLE example (id int);

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT * FROM example;

            QUERY PLAN             
-----------------------------------
[
  &lbrace;
    "Plan": &lbrace;
      "Node Type": "Seq Scan",
      "Parallel Aware": false,
      "Async Capable": false,
      "Relation Name": "example",
      "Alias": "example",
      "Startup Cost": 0,
      "Total Cost": 227.2,
      "Plan Rows": 16320,
      "Plan Width": 4,
      "Actual Startup Time": 0.029,
      "Actual Total Time": 1.159,
      "Actual Rows": 10000,
      "Actual Loops": 1,
      "Shared Hit Blocks": 64,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0,
      "Shared I/O Read Time": 0,
      "Shared I/O Write Time": 0,
      "Local I/O Read Time": 0,
      "Local I/O Write Time": 0,
      "Temp I/O Read Time": 0,
      "Temp I/O Write Time": 0
    &rbrace;,
    "Planning": &lbrace;
      "Shared Hit Blocks": 18,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0,
      "Shared I/O Read Time": 0,
      "Shared I/O Write Time": 0,
      "Local I/O Read Time": 0,
      "Local I/O Write Time": 0,
      "Temp I/O Read Time": 0,
      "Temp I/O Write Time": 0
    &rbrace;,
    "Planning Time": 0.154,
    "Triggers": [],
    "Execution Time": 1.742
  &rbrace;
]
	</CodeBlock>

		<p>
			<strong>Examples around temp tables (<CodeHighlight>temp_buffers</CodeHighlight>)</strong>
		</p>
		<!-- prettier-ignore-->
		<CodeBlock label='text'>


BEGIN;

SET temp_buffers = '1MB';

CREATE TEMP TABLE example AS SELECT id FROM generate_series(1, 30000) AS id;

-- check to see the table's size. Should be around ~1.5MB (1,536kB):
SELECT pg_size_pretty(pg_total_relation_size('example'));

-- NOTE: in text form, the plan will only include non-zero values
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM example;

ROLLBACK;

                                                  QUERY PLAN                                                  
--------------------------------------------------------------------------------------------------------------
 Seq Scan on example  (cost=0.00..681.60 rows=48960 width=4) (actual time=0.199..4.730 rows=30000.00 loops=1)
   Buffers: local hit=4 read=188 written=65
   I/O Timings: local read=1.089 write=0.616
 Planning:
   Buffers: shared hit=4
 Planning Time: 0.226 ms
 Execution Time: 6.384 ms
		</CodeBlock>

		<p>
			In the above example, only 4 of the temp table's pages (32kB worth) were read directly from
			local buffers (hit). Another 188 pages (~1.5MB or 1,504kB) had to be pulled from disk (or the
			OS cache) into buffers before they could be <em>read</em>. Finally, 65 temp pages (~.5MB or
			520kB) had to be evicted from buffers (<em>written</em>). If they were dirty, they'd have to
			be written back to disk immediately.
		</p>

		<!-- prettier-ignore-->
		<CodeBlock label='json'>
BEGIN;

SET temp_buffers = '1MB';

CREATE TEMP TABLE example AS SELECT id FROM generate_series(1, 30000) AS id;

-- check to see the table's size. Should be around ~1.5MB (1,536kB):
SELECT pg_size_pretty(pg_total_relation_size('example'));

-- NOTE: in text form, the plan will only include non-zero values
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT * FROM example;

ROLLBACK;

                    QUERY PLAN                    
--------------------------------------------------
[
  &lbrace;
    "Plan": &lbrace;
      "Node Type": "Seq Scan",
      "Parallel Aware": false,
      "Async Capable": false,
      "Relation Name": "example",
      "Alias": "example",
      "Startup Cost": 0,
      "Total Cost": 681.6,
      "Plan Rows": 48960,
      "Plan Width": 4,
      "Actual Startup Time": 0.064,
      "Actual Total Time": 4.503,
      "Actual Rows": 30000,
      "Actual Loops": 1,
      "Shared Hit Blocks": 0,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 4,
      "Local Read Blocks": 188,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 65,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0
    &rbrace;,
    "Planning": &lbrace;
      "Shared Hit Blocks": 19,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0
    &rbrace;,
    "Planning Time": 0.107,
    "Triggers": [],
    "Execution Time": 6.511
  &rbrace;
]
		</CodeBlock>
		<p>Another good example to showcase is around write behavior, such as an update</p>
		<!-- prettier-ignore -->
		<CodeBlock label="text format">
BEGIN;

SET temp_buffers = '1MB';

CREATE TEMP TABLE example AS SELECT id FROM generate_series(1, 30000) AS id;

-- check to see the table's size. Should be around ~1.5MB (1,536kB):
SELECT pg_size_pretty(pg_total_relation_size('example'));

-- NOTE: in text form, the plan will only include non-zero values
EXPLAIN (ANALYZE, BUFFERS) 
UPDATE example
SET id = 1;

ROLLBACK;
                                                     QUERY PLAN                                                      
---------------------------------------------------------------------------------------------------------------------
 Update on example  (cost=0.00..681.60 rows=0 width=0) (actual time=30.914..30.915 rows=0.00 loops=1)
   Buffers: local hit=90242 read=215 dirtied=268 written=406
   I/O Timings: local read=1.107 write=7.187
   -&gt;  Seq Scan on example  (cost=0.00..681.60 rows=48960 width=10) (actual time=0.166..5.114 rows=30000.00 loops=1)
         Buffers: local read=192 written=143
         I/O Timings: local read=1.010 write=0.876
 Planning:
   Buffers: shared hit=4
 Planning Time: 0.206 ms
 Execution Time: 30.954 ms
	</CodeBlock>
		<p>
			What is notable about this example is that the local hit rate is <CodeHighlight
				>90242</CodeHighlight
			>. That is extremely high. Considering only 1MB worth of pages or 128 pages can exist in the
			local buffer, how can 90,242 pages be hit? The same pages be accessed over and over again
			(double counted). Likely, each page is being fetched 3 times per row to check internal
			structures and the planner is considering each reference a hit.
		</p>
		<p>
			The hit rate isn't s notable as the write and read rate, as they have greater potential for IO
			strain. Still this helps illustrate that the metrics from EXPLAIN can't just be taken at face
			value. It's still important to have an inkling of how the underlying mechanisms work because
			the same pages can be referenced and evicted over and over again.
		</p>
		<p>Here's the same query, but without the output in json format</p>
		<!-- prettier-ignore -->
		<CodeBlock label="json format">
BEGIN;

SET temp_buffers = '1MB';

CREATE TEMP TABLE example AS SELECT id FROM generate_series(1, 30000) AS id;

-- check to see the table's size. Should be around ~1.5MB (1,536kB):
SELECT pg_size_pretty(pg_total_relation_size('example'));

-- NOTE: in text form, the plan will only include non-zero values
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
UPDATE example
SET id = 1;

ROLLBACK;

                QUERY PLAN                 
-------------------------------------------
 [
  &lbrace;
    "Plan": &lbrace;
      "Node Type": "ModifyTable",
      "Operation": "Update",
      "Parallel Aware": false,
      "Async Capable": false,
      "Relation Name": "example",
      "Alias": "example",
      "Startup Cost": 0,
      "Total Cost": 681.6,
      "Plan Rows": 0,
      "Plan Width": 0,
      "Actual Startup Time": 61.667,
      "Actual Total Time": 61.668,
      "Actual Rows": 0,
      "Actual Loops": 1,
      "Shared Hit Blocks": 0,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 90265,
      "Local Read Blocks": 192,
      "Local Dirtied Blocks": 266,
      "Local Written Blocks": 404,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0,
      "Plans": [
        &lbrace;
          "Node Type": "Seq Scan",
          "Parent Relationship": "Outer",
          "Parallel Aware": false,
          "Async Capable": false,
          "Relation Name": "example",
          "Alias": "example",
          "Startup Cost": 0,
          "Total Cost": 681.6,
          "Plan Rows": 48960,
          "Plan Width": 10,
          "Actual Startup Time": 0.087,
          "Actual Total Time": 8.254,
          "Actual Rows": 30000,
          "Actual Loops": 1,
          "Shared Hit Blocks": 0,
          "Shared Read Blocks": 0,
          "Shared Dirtied Blocks": 0,
          "Shared Written Blocks": 0,
          "Local Hit Blocks": 0,
          "Local Read Blocks": 192,
          "Local Dirtied Blocks": 0,
          "Local Written Blocks": 161,
          "Temp Read Blocks": 0,
          "Temp Written Blocks": 0
        &rbrace;
      ]
    &rbrace;,
    "Planning": &lbrace;
      "Shared Hit Blocks": 22,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0
    &rbrace;,
    "Planning Time": 0.295,
    "Triggers": [],
    "Execution Time": 61.711
  &rbrace;
]
	</CodeBlock>

		<strong
			>Examples highlighting temp block (<CodeHighlight>work_mem+</CodeHighlight>) interactions</strong
		>
		<p>
			Predominantly for sorts and hashing, the database is inclined to use session memory. In fact,
			these are the only operations that the planner will plainly share the memory footprint for.
		</p>
		<p>The below example shows memory usage by a sort node:</p>
		<!-- prettier-ignore -->
		<CodeBlock label="text format">
BEGIN;

SET work_mem = '20MB';

CREATE TABLE example AS SELECT id FROM generate_series(1, 30000) AS id;

-- check to see the table's size. Should be around ~1.5MB (1,536kB):
SELECT pg_size_pretty(pg_total_relation_size('example'));

-- NOTE: in text form, the plan will only include non-zero values
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM example ORDER BY id DESC;

                                                     QUERY PLAN                                                     
--------------------------------------------------------------------------------------------------------------------
 Sort  (cost=4495.42..4617.82 rows=48960 width=4) (actual time=5.780..6.964 rows=30000.00 loops=1)
   Sort Key: id DESC
   Sort Method: quicksort  Memory: 769kB
   Buffers: shared hit=195
   -&gt;  Seq Scan on example  (cost=0.00..681.60 rows=48960 width=4) (actual time=0.009..1.880 rows=30000.00 loops=1)
         Buffers: shared hit=192
 Planning:
   Buffers: shared hit=14 read=3
   I/O Timings: shared read=0.760
 Planning Time: 0.871 ms
 Execution Time: 7.918 ms

ROLLBACK;

		</CodeBlock>
		<p>
			The relevant field is <CodeHighlight>Sort Method: quicksort Memory: 769kB</CodeHighlight>. It
			will be discussed more in the <CodeHighlight>ANALYZE</CodeHighlight> portion of this site. When
			<CodeHighlight>work_mem</CodeHighlight> is dropped to the point that the data can no longer fit
			in memory, then <CodeHighlight>Temp Blocks</CodeHighlight> are referenced.
		</p>
		<!-- prettier-ignore-->
		<CodeBlock label="text format">
BEGIN;

SET work_mem = '64kB';

CREATE TABLE example AS SELECT id FROM generate_series(1, 30000) AS id;

-- check to see the table's size. Should be around ~1.5MB (1,536kB):
SELECT pg_size_pretty(pg_total_relation_size('example'));

-- NOTE: in text form, the plan will only include non-zero values
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM example ORDER BY id DESC; 

                                                     QUERY PLAN                                                     
--------------------------------------------------------------------------------------------------------------------
 Sort  (cost=5839.42..5961.82 rows=48960 width=4) (actual time=11.290..14.280 rows=30000.00 loops=1)
   Sort Key: id DESC
   Sort Method: external merge  Disk: 392kB
   Buffers: shared hit=192, temp read=94 written=104
   I/O Timings: temp read=0.324 write=1.144
   -&gt;  Seq Scan on example  (cost=0.00..681.60 rows=48960 width=4) (actual time=0.023..2.579 rows=30000.00 loops=1)
         Buffers: shared hit=192
 Planning:
   Buffers: shared hit=4
 Planning Time: 0.170 ms
 Execution Time: 16.802 ms
ROLLBACK;

		</CodeBlock>
		<p>
			The line <CodeHighlight>Buffers: shared hit=192, temp read=94 written=104</CodeHighlight> indicates
			what happened. 104 pages (832kB) of data was written to temp files. A total of 94 pages (752kB)
			were read back. Some of the files written may include metadata or might be expendable, so it is
			normal for PG not to look over all of them. This occurred because <CodeHighlight
				>work_mem</CodeHighlight
			> was too small to accommodate the operation otherwise. It's important to note that memory was still
			used, but just dwarfed by the disk internations.
		</p>
		<p>
			One may have noticed the line <CodeHighlight
				>Sort Method: external merge Disk: 392kB</CodeHighlight
			>. If 832kB of data was written, why did the Sort report using 392kB of space? This represents
			the largest size the temp file grew to during operations. You can restrict the size by
			modifying the <CodeHighlight>temp_file_limit</CodeHighlight> setting.
		</p>
		<!-- prettier-ignore -->
		<CodeBlock>
BEGIN;

SET work_mem = '64kB';

CREATE TABLE example AS SELECT id FROM generate_series(1, 30000) AS id;

SET temp_file_limit = '391kB'; -- causes below operation to fail. Set it to 392kB or whatever value it reported the first time around to watch it suddenly work.

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM example ORDER BY id DESC; 

ROLLBACK;
		 </CodeBlock>
	</DropDown>
</div>

<!-- ANALYZE -->
<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
>
	<h4
		class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
	>
		ANALYZE in depth (WIP)
	</h4>
	<ul class="mb-10 ml-4 list-disc space-y-2">
		{#each Object.entries(analyzeModifers) as [key, val]}
			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">
					{key}
				</strong>
				<p class="font-medium">
					{@html val.description}
				</p>
				<p><span class="pr-2">Example:</span><CodeHighlight>{val.example}</CodeHighlight></p>
			</li>
		{/each}
	</ul>
</div>

<!-- 
















 -->
<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
>
	<h4
		class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
	>
		Available algorithms
	</h4>
	It's not possible to disable a scan entirely, as that may prevent the database from executing queries,
	but you can make it only use an algorithm as a last resort. By running one of the below commands, while
	substituting<em>SOME_ALGO</em> for the relevant setting, you will tell Postgres to assume that the
	operation costs <CodeHighlight>10,000,000,000</CodeHighlight>
	<!-- prettier-ignore  -->
	<CodeBlock label='quasi disable algorithm'>
-- query level:
BEGIN;
	SET LOCAL enable_SOME_ALGO TO FALSE;
	-- your queries;
COMMIT;

-- connection (session) level
SET enable_SOME_ALGO TO FALSE;

-- role level:
SET ROLE some_user enable_SOME_ALGO TO FALSE;

-- database level:
SET DATABSE some_database enable_SOME_ALGO TO FALSE;
		</CodeBlock>
	<p>Here's a list of all the values that can be set:</p>
	<p class="space-x-1">
		<CodeHighlight>enable_async_append</CodeHighlight>, <CodeHighlight
			>enable_bitmapscan</CodeHighlight
		>, <CodeHighlight>enable_gathermerge</CodeHighlight>, <CodeHighlight
			>enable_group_by_reordering</CodeHighlight
		>, <CodeHighlight>enable_hashagg</CodeHighlight>, <CodeHighlight>enable_hashjoin</CodeHighlight
		>, <CodeHighlight>enable_incremental_sort</CodeHighlight>, <CodeHighlight
			>enable_indexonlyscan</CodeHighlight
		>, <CodeHighlight>enable_indexscan</CodeHighlight>, <CodeHighlight
			>enable_material</CodeHighlight
		>, <CodeHighlight>enable_memoize</CodeHighlight>, <CodeHighlight>enable_mergejoin</CodeHighlight
		>, <CodeHighlight>enable_nestloop</CodeHighlight>, <CodeHighlight
			>enable_parallel_append</CodeHighlight
		>, <CodeHighlight>enable_parallel_hash</CodeHighlight>, <CodeHighlight
			>enable_partition_pruning</CodeHighlight
		>, <CodeHighlight>enable_partitionwise_aggregate</CodeHighlight>, <CodeHighlight
			>enable_partitionwise_join</CodeHighlight
		>, <CodeHighlight>enable_presorted_aggregate</CodeHighlight>, <CodeHighlight
			>enable_seqscan</CodeHighlight
		>, <CodeHighlight>enable_sort</CodeHighlight>, <CodeHighlight>enable_tidscan</CodeHighlight>
	</p>
	<p>
		When tuning a query, it is very common practice to disable a node type to see if the planner
		adopts a different plan. If it doesn't, then the planner cannot find a comparable node to rely
		on.
	</p>
	<p>
		If the plan does change and it is faster, you can explore ways to give the planner more
		information to make better decisions.
	</p>
</div>
