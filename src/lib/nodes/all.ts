const json = {
	_meta: {
		basedOn: 'src/backend/commands/explain.c, git master (PG19devel)',
		notes: [
			'Property names are the non-text (JSON/XML/YAML) labels passed to ExplainProperty*/ExplainOpenGroup.',
			'requiredExplainMods lists EXPLAIN options that must be enabled. Since PG18, BUFFERS defaults to ON when ANALYZE is used; SUMMARY and TIMING default to ON with ANALYZE; COSTS defaults to ON always. Entries gated on a default-on option note it in the description instead of requiredExplainMods.',
			'Node-level ANALYZE-only fields also require that the node was actually executed.'
		]
	},
	'Node Type': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description:
			"The type of execution plan node (e.g., Seq Scan, Hash Join, Index Scan). Note: in structured formats, sorted and hashed aggregates both have Node Type 'Aggregate' (distinguished by Strategy), unlike the text labels GroupAggregate/HashAggregate.",
		example: 'Seq Scan',
		requiredExplainMods: []
	},
	'Parent Relationship': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Child Plan Nodes'],
		description:
			'The structural relationship of this node to its parent (e.g., Outer, Inner, Member, Subquery, InitPlan, SubPlan, child/children for Custom Scan).',
		example: 'Outer',
		requiredExplainMods: []
	},
	'Parallel Aware': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description:
			"Whether the node is parallel-aware (actively divides work among parallel workers). Always emitted in structured formats; in text it appears as a 'Parallel' prefix on the node name.",
		example: false,
		requiredExplainMods: []
	},
	'Async Capable': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description:
			'Whether the node supports asynchronous execution (currently Foreign Scans under Append). Always emitted in structured formats.',
		example: false,
		requiredExplainMods: []
	},
	Disabled: {
		sourceFunction: 'ExplainNode (plan_is_disabled)',
		appliesTo: ['All Plan Nodes'],
		description:
			'Whether this node itself was disabled by planner settings (e.g., an enable_* GUC) yet still chosen. Computed by subtracting child disabled-node counts; always emitted in structured formats, in text only when true.',
		example: false,
		requiredExplainMods: []
	},
	Operation: {
		sourceFunction: 'ExplainNode',
		appliesTo: ['ModifyTable', 'SetOp'],
		description:
			"For ModifyTable: the DML operation (Insert, Update, Delete, Merge). For SetOp: the set operation (Intersect, Intersect All, Except, Except All). There is no separate 'Command' property.",
		example: 'Insert',
		requiredExplainMods: []
	},
	'Subplan Name': {
		sourceFunction: 'ExplainNode / ExplainSubPlans',
		appliesTo: ['SubPlan', 'InitPlan', 'CTE plans'],
		description:
			"The subplan identifier assigned by the planner, e.g. 'SubPlan 1', 'InitPlan 1 (returns $0)', or 'CTE <name>'.",
		example: 'SubPlan 1',
		requiredExplainMods: []
	},
	'Scan Direction': {
		sourceFunction: 'ExplainIndexScanDetails',
		appliesTo: ['Index Scan', 'Index Only Scan'],
		description:
			'The direction the index is traversed: Forward or Backward. Not emitted for Bitmap Index Scan (which prints only Index Name, via ExplainNode).',
		example: 'Forward',
		requiredExplainMods: []
	},
	'Relation Name': {
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
			"The name of the table being scanned or modified. A NamedTuplestore Scan emits 'Tuplestore Name' instead, not 'Relation Name'.",
		example: 'nodes',
		requiredExplainMods: []
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
			'The schema containing the target table. Only emitted for ordinary relations, and only with VERBOSE. Function Scans do not get a Schema property.',
		example: 'public',
		requiredExplainMods: ['VERBOSE']
	},
	Alias: {
		sourceFunction: 'ExplainTargetRel',
		appliesTo: [
			'Seq Scan',
			'Sample Scan',
			'Index Scan',
			'Index Only Scan',
			'Bitmap Heap Scan',
			'Tid Scan',
			'Tid Range Scan',
			'Subquery Scan',
			'Function Scan',
			'Table Function Scan',
			'Values Scan',
			'CTE Scan',
			'NamedTuplestore Scan',
			'WorkTable Scan',
			'Foreign Scan',
			'Custom Scan',
			'ModifyTable'
		],
		description: 'The rangetable alias used for the scan target in the query.',
		example: 'nodes',
		requiredExplainMods: []
	},
	'Startup Cost': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description:
			'Estimated cost before the node can output its first row, in planner cost units. Suppressed with COSTS OFF (COSTS defaults to on).',
		example: 0.29,
		requiredExplainMods: []
	},
	'Total Cost': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description:
			'Estimated total cost to run the node to completion, in planner cost units. Suppressed with COSTS OFF.',
		example: 189.0,
		requiredExplainMods: []
	},
	'Plan Rows': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description:
			'Estimated number of rows output by this node per execution. Suppressed with COSTS OFF.',
		example: 9999,
		requiredExplainMods: []
	},
	'Plan Width': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description: 'Estimated average width of output rows, in bytes. Suppressed with COSTS OFF.',
		example: 22,
		requiredExplainMods: []
	},
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
	Output: {
		sourceFunction: 'show_plan_tlist',
		appliesTo: ['All Plan Nodes'],
		description: 'List of target expressions and columns projected by this node.',
		example: ['id', 'random'],
		requiredExplainMods: ['VERBOSE']
	},
	Filter: {
		sourceFunction: 'show_scan_qual / show_upper_qual',
		appliesTo: [
			'Seq Scan',
			'Sample Scan',
			'Index Scan',
			'Index Only Scan',
			'Bitmap Heap Scan',
			'Tid Scan',
			'Tid Range Scan',
			'Subquery Scan',
			'Function Scan',
			'Table Function Scan',
			'Values Scan',
			'CTE Scan',
			'NamedTuplestore Scan',
			'WorkTable Scan',
			'Foreign Scan',
			'Custom Scan',
			'Nested Loop',
			'Hash Join',
			'Merge Join',
			'Aggregate',
			'Group',
			'WindowAgg',
			'Result'
		],
		description:
			"The boolean qualification evaluated for each candidate row (plan->qual). Join nodes additionally emit a separate 'Join Filter' property for the join condition itself.",
		example: '(nodes.id > 1)',
		requiredExplainMods: []
	},
	'Rows Removed by Filter': {
		sourceFunction: 'show_instrumentation_count',
		appliesTo: ['Any node with a Filter'],
		description:
			"Number of rows discarded because they failed the node's Filter condition. Joins similarly get 'Rows Removed by Join Filter'.",
		example: 1,
		requiredExplainMods: ['ANALYZE']
	},
	'Index Name': {
		sourceFunction: 'ExplainIndexScanDetails / ExplainNode',
		appliesTo: ['Index Scan', 'Index Only Scan', 'Bitmap Index Scan'],
		description: 'The name of the index used for scanning.',
		example: 'some_index',
		requiredExplainMods: []
	},
	'Index Cond': {
		sourceFunction: 'show_scan_qual',
		appliesTo: ['Index Scan', 'Index Only Scan', 'Bitmap Index Scan'],
		description:
			"The condition evaluated directly against index keys. Ordered index scans may also emit an 'Order By' property for amcanorderbyop clauses.",
		example: '(nodes.id = 1)',
		requiredExplainMods: []
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
	'Recheck Cond': {
		sourceFunction: 'show_scan_qual',
		appliesTo: ['Bitmap Heap Scan'],
		description:
			'The qualification re-verified against heap tuples fetched via the bitmap (applied when the bitmap is lossy).',
		example: '(nodes.id = 1)',
		requiredExplainMods: []
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
	'TID Cond': {
		sourceFunction: 'show_scan_qual',
		appliesTo: ['Tid Scan'],
		description:
			"The ctid qualification for a Tid Scan. Tid Range Scan emits 'TID Range Cond' instead.",
		example: "(nodes.ctid = '(0,1)'::tid)",
		requiredExplainMods: []
	},
	'TID Range Cond': {
		sourceFunction: 'show_scan_qual',
		appliesTo: ['Tid Range Scan'],
		description: 'The ctid range qualification for a Tid Range Scan.',
		example: "(nodes.ctid < '(10,1)'::tid)",
		requiredExplainMods: []
	},
	'Function Name': {
		sourceFunction: 'ExplainTargetRel',
		appliesTo: ['Function Scan'],
		description:
			"The name of the set-returning function in a Function Scan (single-function case). Table Function Scans emit 'Table Function Name' instead.",
		example: 'generate_series',
		requiredExplainMods: []
	},
	'Function Call': {
		sourceFunction: 'show_expression',
		appliesTo: ['Function Scan'],
		description:
			'The full function invocation expression with arguments. Only emitted with VERBOSE.',
		example: 'generate_series(1, 1000)',
		requiredExplainMods: ['VERBOSE']
	},
	'CTE Name': {
		sourceFunction: 'ExplainTargetRel',
		appliesTo: ['CTE Scan', 'WorkTable Scan'],
		description: 'The name of the Common Table Expression referenced by the scan.',
		example: 'my_cte',
		requiredExplainMods: []
	},
	'Tuplestore Name': {
		sourceFunction: 'ExplainTargetRel',
		appliesTo: ['NamedTuplestore Scan'],
		description:
			'The name of the named tuplestore (e.g., a trigger transition table) being scanned.',
		example: 'new_table',
		requiredExplainMods: []
	},
	'Custom Plan Provider': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Custom Scan'],
		description: 'The identifier string of the extension providing the custom plan node.',
		example: 'TimescaleDB',
		requiredExplainMods: []
	},
	'Join Type': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Nested Loop', 'Hash Join', 'Merge Join'],
		description: 'The join variant (Inner, Left, Right, Full, Semi, Anti, Right Semi, Right Anti).',
		example: 'Inner',
		requiredExplainMods: []
	},
	'Inner Unique': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Nested Loop', 'Hash Join', 'Merge Join'],
		description: 'Whether the inner side is known to produce at most one match per outer row.',
		example: false,
		requiredExplainMods: []
	},
	'Hash Cond': {
		sourceFunction: 'show_upper_qual',
		appliesTo: ['Hash Join'],
		description: 'The equality join condition evaluated by a Hash Join.',
		example: '(nodes.id = join_node.id)',
		requiredExplainMods: []
	},
	'Merge Cond': {
		sourceFunction: 'show_upper_qual',
		appliesTo: ['Merge Join'],
		description: 'The ordered equality join condition evaluated by a Merge Join.',
		example: '(nodes.id = join_node.id)',
		requiredExplainMods: []
	},
	'Join Filter': {
		sourceFunction: 'show_upper_qual',
		appliesTo: ['Nested Loop', 'Hash Join', 'Merge Join'],
		description:
			"Extra join qualification applied to each joined row pair (beyond the hash/merge condition). Paired with 'Rows Removed by Join Filter' under ANALYZE.",
		example: '(a.x > b.y)',
		requiredExplainMods: []
	},
	'Workers Planned': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Gather', 'Gather Merge'],
		description: 'Number of parallel workers requested by the planner. Suppressed with COSTS OFF.',
		example: 1,
		requiredExplainMods: []
	},
	'Workers Launched': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Gather', 'Gather Merge'],
		description: 'Actual number of parallel workers launched at execution time.',
		example: 1,
		requiredExplainMods: ['ANALYZE']
	},
	'Single Copy': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Gather'],
		description: 'Whether the Gather ran a single copy of a non-parallel-safe plan in one worker.',
		example: false,
		requiredExplainMods: []
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
	Strategy: {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Aggregate', 'SetOp'],
		description: 'For Aggregate: Plain, Sorted, Hashed, or Mixed. For SetOp: Sorted or Hashed.',
		example: 'Plain',
		requiredExplainMods: []
	},
	'Partial Mode': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Aggregate'],
		description: 'Stage of multi-phase (parallel) aggregation: Simple, Partial, or Finalize.',
		example: 'Finalize',
		requiredExplainMods: []
	},
	'Group Key': {
		sourceFunction: 'show_sort_group_keys',
		appliesTo: ['Group', 'Aggregate (Sorted strategy)'],
		description:
			"Columns/expressions used to partition rows into groups for GROUP BY. Hashed aggregates without grouping sets also emit 'Group Key'; within GROUPING SETS output, the per-set lists are labeled 'Group Keys' and 'Hash Keys' (plural).",
		example: ['sales.id'],
		requiredExplainMods: []
	},
	'Grouping Sets': {
		sourceFunction: 'show_grouping_sets',
		appliesTo: ['Aggregate (with GROUPING SETS / ROLLUP / CUBE)'],
		description:
			"List container of grouping-set descriptors. Each element may contain 'Sort Key', 'Group Keys', and/or 'Hash Keys'. An empty grouping set (grand total) appears as an empty 'Group Keys' list in structured formats; the '()' notation is text-format only and is not a JSON key.",
		example: [],
		requiredExplainMods: []
	},
	'Grouping Set': {
		sourceFunction: 'show_grouping_set_keys',
		appliesTo: ['Grouping Sets'],
		description: "Container (anonymous object in JSON) for one grouping set's key lists.",
		example: {},
		requiredExplainMods: []
	},
	'Sort Key': {
		sourceFunction: 'show_sort_group_keys',
		appliesTo: ['Sort', 'Incremental Sort', 'Merge Append', 'Gather Merge', 'Grouping Sets'],
		description:
			'The expressions defining the target sort ordering (with DESC/NULLS/COLLATE/USING options appended where non-default).',
		example: ['sales.customer_id'],
		requiredExplainMods: []
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
	'Presorted Key': {
		sourceFunction: 'show_sort_group_keys',
		appliesTo: ['Incremental Sort'],
		description: 'The leading sort columns already ordered by the input (the presorted prefix).',
		example: ['sales.id'],
		requiredExplainMods: []
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
		description: 'Number of batches used by the hash join (greater than 1 means spilling to disk).',
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
	'Planned Partitions': {
		sourceFunction: 'show_hashagg_info',
		appliesTo: ['Aggregate (Hashed/Mixed)'],
		description:
			'Number of spill partitions the planner expected. Emitted with plain EXPLAIN too (does not require ANALYZE); suppressed with COSTS OFF.',
		example: 4,
		requiredExplainMods: []
	},
	'Cache Key': {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description: 'Expressions used as lookup keys for the Memoize cache.',
		example: ['outer_table.id'],
		requiredExplainMods: []
	},
	'Cache Mode': {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description: "Cache key comparison mode: 'logical' or 'binary'.",
		example: 'logical',
		requiredExplainMods: []
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
	'Estimated Capacity': {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description:
			'Planner-estimated number of cache entries that fit in memory (PG19+/master). Suppressed with COSTS OFF.',
		example: 1000,
		requiredExplainMods: []
	},
	'Estimated Distinct Lookup Keys': {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description:
			'Planner-estimated number of distinct cache keys (PG19+/master). Suppressed with COSTS OFF.',
		example: 500,
		requiredExplainMods: []
	},
	'Estimated Lookups': {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description:
			'Planner-estimated total number of cache lookups (PG19+/master). Suppressed with COSTS OFF.',
		example: 2000,
		requiredExplainMods: []
	},
	'Estimated Hit Percent': {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description:
			'Planner-estimated cache hit rate percentage (PG19+/master). Suppressed with COSTS OFF.',
		example: 75.0,
		requiredExplainMods: []
	},
	'Target Tables': {
		sourceFunction: 'show_modifytable_info',
		appliesTo: ['ModifyTable'],
		description:
			'List container of per-target-table objects, present when a DML statement touches multiple result relations (inheritance/partitioning). Each element carries Relation Name / Schema / Alias — it is not a flat array of name strings.',
		example: [],
		requiredExplainMods: []
	},
	'Target Table': {
		sourceFunction: 'show_modifytable_info',
		appliesTo: ['Target Tables'],
		description:
			"Container (anonymous object in JSON) for one target relation inside Target Tables; the relation's name appears as 'Relation Name' inside it, not as the value of this key.",
		example: {},
		requiredExplainMods: []
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
	'Conflict Resolution': {
		sourceFunction: 'show_modifytable_info',
		appliesTo: ['ModifyTable (INSERT ... ON CONFLICT)'],
		description:
			"ON CONFLICT resolution policy: 'UPDATE' or 'NOTHING'. A DO UPDATE ... WHERE clause additionally emits 'Conflict Filter' (and 'Rows Removed by Conflict Filter' under ANALYZE).",
		example: 'UPDATE',
		requiredExplainMods: []
	},
	'Conflict Arbiter Indexes': {
		sourceFunction: 'show_modifytable_info',
		appliesTo: ['ModifyTable (INSERT ... ON CONFLICT)'],
		description: 'Unique indexes used as conflict arbiters.',
		example: ['nodes_pkey'],
		requiredExplainMods: []
	},
	'Sampling Method': {
		sourceFunction: 'show_tablesample',
		appliesTo: ['Sample Scan'],
		description: 'TABLESAMPLE method used (e.g., system, bernoulli).',
		example: 'system',
		requiredExplainMods: []
	},
	'Sampling Parameters': {
		sourceFunction: 'show_tablesample',
		appliesTo: ['Sample Scan'],
		description: 'Parameter expressions supplied to TABLESAMPLE.',
		example: ["'10'::real"],
		requiredExplainMods: []
	},
	'Repeatable Seed': {
		sourceFunction: 'show_tablesample',
		appliesTo: ['Sample Scan'],
		description: 'Seed expression from the REPEATABLE clause, if any.',
		example: "'42'::double precision",
		requiredExplainMods: []
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
	Window: {
		sourceFunction: 'show_window_def',
		appliesTo: ['WindowAgg'],
		description:
			"The window definition for this WindowAgg, e.g. 'w1 AS (PARTITION BY id)'. WindowAgg may also emit 'Run Condition' for monotonic window function filters.",
		example: 'w1 AS (PARTITION BY id)',
		requiredExplainMods: []
	},
	Replaces: {
		sourceFunction: 'show_result_replacement_info',
		appliesTo: ['Result'],
		description:
			"Master/PG19+: describes the origin of a Result node — what plan shape it replaced and why it was inserted (from the Result node's result_reason, e.g. a scan proven empty or a constant-only query). Emitted where relevant; the value is a descriptive string, not a subplan identifier.",
		example: 'scan of relation nodes',
		requiredExplainMods: []
	},
	'Subplans Removed': {
		sourceFunction: 'ExplainMissingMembers',
		appliesTo: ['Append', 'Merge Append'],
		description:
			'Number of child subplans pruned before execution (executor-startup pruning). Shown whenever fewer children were initialized than planned — this can appear without ANALYZE (e.g. EXPLAIN of a generic plan); runtime exec-time pruning details additionally require ANALYZE.',
		example: 2,
		requiredExplainMods: []
	},
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
		description: 'Shared buffer pages read in from disk.',
		example: 0,
		requiredExplainMods: ['BUFFERS']
	},
	'Shared Dirtied Blocks': {
		sourceFunction: 'show_buffer_usage',
		appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
		description: 'Shared buffer pages dirtied by this node/phase.',
		example: 0,
		requiredExplainMods: ['BUFFERS']
	},
	'Shared Written Blocks': {
		sourceFunction: 'show_buffer_usage',
		appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
		description: 'Shared buffer pages written out by this process.',
		example: 0,
		requiredExplainMods: ['BUFFERS']
	},
	'Local Hit Blocks': {
		sourceFunction: 'show_buffer_usage',
		appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
		description: 'Local (temporary-table) buffer pages found in local buffers.',
		example: 0,
		requiredExplainMods: ['BUFFERS']
	},
	'Local Read Blocks': {
		sourceFunction: 'show_buffer_usage',
		appliesTo: ['All Plan Nodes', 'Planning', 'Serialization'],
		description: 'Local buffer pages read from disk.',
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
		description: 'Local buffer pages written to disk.',
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
	'Query Text': {
		sourceFunction: 'ExplainQueryText',
		appliesTo: ['Root Level Plan (auto_explain / logged plans only)'],
		description:
			'The SQL text of the query. Never emitted by interactive EXPLAIN regardless of options; it appears only when a caller such as auto_explain invokes ExplainQueryText for logged plans. Not gated on VERBOSE.',
		example: 'SELECT * FROM duck WHERE id > 10',
		requiredExplainMods: []
	},
	Query: {
		sourceFunction: 'ExplainOnePlan (ExplainOpenGroup)',
		appliesTo: ['Root Level'],
		description:
			"Structural container wrapping one plan's entire output (Plan, Planning, Triggers, JIT, timings...). In JSON it is an anonymous object element of the top-level array; in XML it is a <Query> element. It is NOT a property holding the query string and requires no options.",
		example: {},
		requiredExplainMods: []
	},
	'Query Identifier': {
		sourceFunction: 'ExplainPrintPlan',
		appliesTo: ['Root Level Plan'],
		description:
			"64-bit query hash computed by core query jumbling; requires compute_query_id to be enabled (pg_stat_statements enables it in 'auto' mode) in addition to VERBOSE.",
		example: -1234567890123456789,
		requiredExplainMods: ['VERBOSE']
	},
	'Query Parameters': {
		sourceFunction: 'ExplainQueryParameters',
		appliesTo: ['Root Level Plan (auto_explain / logged plans only)'],
		description:
			'Bind parameter values ($1, $2, ...). Only emitted via auto_explain (controlled by auto_explain.log_parameter_max_length), never by interactive EXPLAIN. Unrelated to the GENERIC_PLAN option, which plans without parameter values.',
		example: "$1 = '10'",
		requiredExplainMods: []
	},
	'Planning Time': {
		sourceFunction: 'ExplainOnePlan',
		appliesTo: ['Root Level Plan'],
		description:
			'Time spent planning, in milliseconds. Gated on SUMMARY, which defaults to ON with ANALYZE and OFF for plain EXPLAIN.',
		example: 0.045,
		requiredExplainMods: ['SUMMARY']
	},
	Planning: {
		sourceFunction: 'ExplainOnePlan',
		appliesTo: ['Root Level Plan'],
		description:
			'Container holding buffer usage (BUFFERS) and/or memory counters (MEMORY) from the planning phase. WAL stats are not part of this section.',
		example: {},
		requiredExplainMods: ['BUFFERS or MEMORY']
	},
	'Memory Used': {
		sourceFunction: 'show_memory_counters',
		appliesTo: ['Planning'],
		description: 'Peak memory used during planning, in kilobytes.',
		example: 7,
		requiredExplainMods: ['MEMORY']
	},
	'Memory Allocated': {
		sourceFunction: 'show_memory_counters',
		appliesTo: ['Planning'],
		description: 'Total memory allocated during planning, in kilobytes.',
		example: 8,
		requiredExplainMods: ['MEMORY']
	},
	'Execution Time': {
		sourceFunction: 'ExplainOnePlan',
		appliesTo: ['Root Level Plan'],
		description:
			'Total execution time in milliseconds, excluding planning. Requires ANALYZE and SUMMARY (SUMMARY defaults to ON with ANALYZE).',
		example: 209.872,
		requiredExplainMods: ['ANALYZE']
	},
	Settings: {
		sourceFunction: 'ExplainPrintSettings',
		appliesTo: ['Root Level Plan'],
		description:
			'Planner-relevant GUC settings whose values differ from the built-in defaults, as a name/value map.',
		example: { work_mem: '64MB' },
		requiredExplainMods: ['SETTINGS']
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
	},
	Plans: {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Parent Plan Nodes'],
		description: 'Array of nested child plan node objects.',
		example: [],
		requiredExplainMods: []
	}
};
