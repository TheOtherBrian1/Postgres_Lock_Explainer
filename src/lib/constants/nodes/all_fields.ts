const fields = {
	'Node Type': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description:
			'The type of execution plan node being executed (e.g., Seq Scan, Hash Join, Index Scan).',
		example: 'Seq Scan',
		requiredExplainMods: []
	},
	'Parent Relationship': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Child Plan Nodes'],
		description:
			'The structural relationship of this node to its parent node (e.g., Outer, Inner, SubPlan, InitPlan).',
		example: 'Outer',
		requiredExplainMods: []
	},
	'Parallel Aware': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description:
			'Indicates whether the node is aware of parallel execution and actively coordinates among parallel workers.',
		example: false,
		requiredExplainMods: []
	},
	'Async Capable': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description:
			'Indicates whether the node supports asynchronous execution (primarily used for Foreign Data Wrappers).',
		example: false,
		requiredExplainMods: []
	},
	'Scan Direction': {
		sourceFunction: 'ExplainIndexScanDetails',
		appliesTo: ['Index Scan', 'Index Only Scan', 'Bitmap Index Scan'],
		description:
			'The direction in which an index is traversed (e.g., Forward, Backward, NoMovement).',
		example: 'Forward',
		requiredExplainMods: []
	},
	'Relation Name': {
		sourceFunction: 'ExplainScanTarget',
		appliesTo: [
			'Seq Scan',
			'Index Scan',
			'Index Only Scan',
			'Bitmap Heap Scan',
			'Tid Scan',
			'Tid Range Scan',
			'NamedTuplestore Scan'
		],
		description: 'The name of the database table or relation being scanned.',
		example: 'nodes',
		requiredExplainMods: []
	},
	Schema: {
		sourceFunction: 'ExplainScanTarget',
		appliesTo: [
			'Seq Scan',
			'Index Scan',
			'Index Only Scan',
			'Bitmap Heap Scan',
			'Tid Scan',
			'Tid Range Scan',
			'Function Scan'
		],
		description: 'The database schema containing the target table or function.',
		example: 'public',
		requiredExplainMods: []
	},
	Alias: {
		sourceFunction: 'ExplainScanTarget',
		appliesTo: [
			'Seq Scan',
			'Index Scan',
			'Index Only Scan',
			'Bitmap Heap Scan',
			'Tid Scan',
			'Tid Range Scan',
			'Subquery Scan',
			'CTE Scan',
			'WorkTable Scan',
			'Function Scan'
		],
		description: 'The table or subquery alias assigned or used in the query.',
		example: 'nodes',
		requiredExplainMods: []
	},
	'Startup Cost': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description:
			'Estimated cost before the node can output its first row, expressed in arbitrary planner cost units.',
		example: 0.29,
		requiredExplainMods: []
	},
	'Total Cost': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description: 'Estimated overall cost to fully execute the node and return all expected rows.',
		example: 189.0,
		requiredExplainMods: []
	},
	'Plan Rows': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description: 'The estimated number of rows output by this node.',
		example: 9999,
		requiredExplainMods: []
	},
	'Plan Width': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description: 'The estimated average width of rows output by this node, in bytes.',
		example: 22,
		requiredExplainMods: []
	},
	'Actual Startup Time': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description: 'Actual time elapsed in milliseconds before returning the first row.',
		example: 0.096,
		requiredExplainMods: ['ANALYZE']
	},
	'Actual Total Time': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description: 'Actual total time elapsed in milliseconds across all executions of this node.',
		example: 0.097,
		requiredExplainMods: ['ANALYZE']
	},
	'Actual Rows': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description: 'Actual number of rows returned per iteration loop of this node.',
		example: 1,
		requiredExplainMods: ['ANALYZE']
	},
	'Actual Loops': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description: 'Number of times this plan node was executed during query processing.',
		example: 1,
		requiredExplainMods: ['ANALYZE']
	},
	Output: {
		sourceFunction: 'ExplainNode',
		appliesTo: ['All Plan Nodes'],
		description: 'List of target expressions and columns projected by this node.',
		example: ['id', 'random'],
		requiredExplainMods: ['VERBOSE']
	},
	Filter: {
		sourceFunction: 'ExplainNode',
		appliesTo: [
			'Seq Scan',
			'Index Scan',
			'Index Only Scan',
			'Bitmap Heap Scan',
			'Subquery Scan',
			'CTE Scan',
			'WorkTable Scan',
			'Function Scan'
		],
		description: 'The Boolean qualification condition evaluated for each candidate row.',
		example: '(nodes.id > 1)',
		requiredExplainMods: []
	},
	'Rows Removed by Filter': {
		sourceFunction: 'ExplainNode',
		appliesTo: [
			'Seq Scan',
			'Index Scan',
			'Index Only Scan',
			'Bitmap Heap Scan',
			'Subquery Scan',
			'CTE Scan',
			'WorkTable Scan',
			'Function Scan'
		],
		description: "Number of rows discarded because they failed the node's filter condition.",
		example: 1,
		requiredExplainMods: ['ANALYZE']
	},
	'Index Name': {
		sourceFunction: 'ExplainIndexScanDetails',
		appliesTo: ['Index Scan', 'Index Only Scan', 'Bitmap Index Scan'],
		description: 'The name of the target index used for scanning.',
		example: 'some_index',
		requiredExplainMods: []
	},
	'Index Cond': {
		sourceFunction: 'ExplainIndexScanDetails',
		appliesTo: ['Index Scan', 'Index Only Scan', 'Bitmap Index Scan'],
		description: 'The condition expression evaluated directly against index keys.',
		example: '(nodes.id = 1)',
		requiredExplainMods: []
	},
	'Rows Removed by Index Recheck': {
		sourceFunction: 'ExplainIndexScanDetails',
		appliesTo: ['Index Scan', 'Index Only Scan'],
		description:
			'Number of rows evaluated during a lossy index/heap recheck that failed the qualification.',
		example: 0,
		requiredExplainMods: ['ANALYZE']
	},
	'Heap Fetches': {
		sourceFunction: 'ExplainIndexScanDetails',
		appliesTo: ['Index Only Scan'],
		description:
			'Number of heap tuples fetched during an Index Only Scan to verify MVCC visibility.',
		example: 0,
		requiredExplainMods: ['ANALYZE']
	},
	'Recheck Cond': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Bitmap Heap Scan'],
		description:
			'The qualification condition evaluated during a Bitmap Heap Scan to re-verify tuples retrieved via bitmap pages.',
		example: '(nodes.id = 1)',
		requiredExplainMods: []
	},
	'Exact Heap Blocks': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Bitmap Heap Scan'],
		description:
			'Number of table pages visited during a Bitmap Heap Scan that contained exact matching row pointers.',
		example: 1,
		requiredExplainMods: ['ANALYZE']
	},
	'Lossy Heap Blocks': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Bitmap Heap Scan'],
		description:
			'Number of table pages visited during a Bitmap Heap Scan where lossy page-level bits were used because the bitmap overflowed memory.',
		example: 0,
		requiredExplainMods: ['ANALYZE']
	},
	'TID Cond': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Tid Scan', 'Tid Range Scan'],
		description: 'The ctid qualification condition used for physical Tuple Identifier scans.',
		example: "(nodes.ctid = '(0,1)'::tid)",
		requiredExplainMods: []
	},
	'Function Name': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Function Scan'],
		description:
			'The name of the set-returning or table-generating function referenced in a Function Scan.',
		example: 'generate_series',
		requiredExplainMods: []
	},
	'Function Call': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Function Scan'],
		description: 'The full function invocation expression and arguments.',
		example: 'generate_series(1, 1000)',
		requiredExplainMods: []
	},
	'CTE Name': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['CTE Scan', 'WorkTable Scan'],
		description: 'The name of the Common Table Expression (WITH clause) referenced by the scan.',
		example: 'my_cte',
		requiredExplainMods: []
	},
	'Custom Plan Provider': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Custom Scan'],
		description:
			'The identifier string of a third-party extension providing a custom execution plan node.',
		example: 'TimescaleDB',
		requiredExplainMods: []
	},
	'Join Type': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Nested Loop', 'Hash Join', 'Merge Join'],
		description:
			'The variant of relational join executed (e.g., Inner, Left, Right, Full, Semi, Anti).',
		example: 'Inner',
		requiredExplainMods: []
	},
	'Inner Unique': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Nested Loop', 'Hash Join', 'Merge Join'],
		description: 'Indicates whether the inner side of a join is known to produce unique join keys.',
		example: false,
		requiredExplainMods: []
	},
	'Hash Cond': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Hash Join'],
		description: 'The equality join condition evaluated by a Hash Join node.',
		example: '(nodes.id = join_node.id)',
		requiredExplainMods: []
	},
	'Merge Cond': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Merge Join'],
		description: 'The ordered equality join condition evaluated by a Merge Join node.',
		example: '(nodes.id = join_node.id)',
		requiredExplainMods: []
	},
	'Workers Planned': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Gather', 'Gather Merge'],
		description: 'The number of parallel worker processes requested by the planner.',
		example: 1,
		requiredExplainMods: []
	},
	'Workers Launched': {
		sourceFunction: 'ExplainMissingWorkers',
		appliesTo: ['Gather', 'Gather Merge'],
		description:
			'The actual number of parallel worker processes successfully spawned at execution time.',
		example: 1,
		requiredExplainMods: ['ANALYZE']
	},
	'Single Copy': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Gather'],
		description: 'Indicates if a Gather node executed a single copy of a non-parallelizable plan.',
		example: false,
		requiredExplainMods: []
	},
	Workers: {
		sourceFunction: 'show_worker_info',
		appliesTo: ['Gather', 'Gather Merge', 'Parallel Hash Join'],
		description:
			'An array containing detailed runtime performance metrics per individual parallel worker process.',
		example: [
			{
				'Worker Number': 0,
				'Actual Startup Time': 4.498,
				'Actual Total Time': 1592.558,
				'Actual Rows': 8780,
				'Actual Loops': 1
			}
		],
		requiredExplainMods: ['ANALYZE']
	},
	Strategy: {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Aggregate'],
		description:
			'The operational strategy used for aggregation (e.g., Plain, Sorted, Hashed, Mixed).',
		example: 'Plain',
		requiredExplainMods: []
	},
	'Partial Mode': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Aggregate'],
		description:
			'The stage of multi-phase parallel aggregate processing (e.g., Partial, Finalize, Simple).',
		example: 'Finalize',
		requiredExplainMods: []
	},
	'Group Key': {
		sourceFunction: 'ExplainNode',
		appliesTo: ['Group', 'GroupAggregate'],
		description:
			'The expressions or columns used to partition data into groups for GROUP BY operations.',
		example: ['sales.id'],
		requiredExplainMods: []
	},
	'Sort Key': {
		sourceFunction: 'show_sort_info',
		appliesTo: ['Sort', 'Merge Append', 'Incremental Sort'],
		description: 'The sequence of expressions or columns defining the target sort ordering.',
		example: ['sales.customer_id'],
		requiredExplainMods: []
	},
	'Sort Method': {
		sourceFunction: 'show_sort_info',
		appliesTo: ['Sort'],
		description:
			'The sorting algorithm utilized at runtime (e.g., quicksort, top-N heapsort, external merge).',
		example: 'external merge',
		requiredExplainMods: ['ANALYZE']
	},
	'Sort Space Used': {
		sourceFunction: 'show_sort_info',
		appliesTo: ['Sort'],
		description: 'Amount of memory or disk space consumed during the sort operation, in kilobytes.',
		example: 14224,
		requiredExplainMods: ['ANALYZE']
	},
	'Sort Space Type': {
		sourceFunction: 'show_sort_info',
		appliesTo: ['Sort'],
		description: 'Storage medium used for sorting (Memory or Disk).',
		example: 'Disk',
		requiredExplainMods: ['ANALYZE']
	},
	'Presorted Key': {
		sourceFunction: 'show_incremental_sort_info',
		appliesTo: ['Incremental Sort'],
		description:
			'Columns in an Incremental Sort node that were already pre-ordered by prior operations or indexes.',
		example: ['sales.id'],
		requiredExplainMods: []
	},
	'Full-sort Groups': {
		sourceFunction: 'show_incremental_sort_info',
		appliesTo: ['Incremental Sort'],
		description:
			'Statistics regarding groups in Incremental Sort where a full sort operation was required.',
		example: {
			'Group Count': 15625,
			'Sort Methods Used': ['quicksort'],
			'Sort Space Memory': {
				'Average Sort Space Used': 26,
				'Peak Sort Space Used': 26
			}
		},
		requiredExplainMods: ['ANALYZE']
	},
	'Pre-sorted Groups': {
		sourceFunction: 'show_incremental_sort_info',
		appliesTo: ['Incremental Sort'],
		description:
			'Statistics regarding groups in Incremental Sort that were already in sorted order.',
		example: {
			'Group Count': 10,
			'Sort Methods Used': ['quicksort'],
			'Sort Space Memory': {
				'Average Sort Space Used': 12,
				'Peak Sort Space Used': 16
			}
		},
		requiredExplainMods: ['ANALYZE']
	},
	'Hash Buckets': {
		sourceFunction: 'show_hash_info',
		appliesTo: ['Hash', 'HashAggregate'],
		description: 'Number of buckets allocated in the in-memory hash table.',
		example: 1024,
		requiredExplainMods: ['ANALYZE']
	},
	'Original Hash Buckets': {
		sourceFunction: 'show_hash_info',
		appliesTo: ['Hash'],
		description:
			'Initial number of hash buckets planned prior to dynamic execution time expansion.',
		example: 1024,
		requiredExplainMods: ['ANALYZE']
	},
	'Hash Batches': {
		sourceFunction: 'show_hash_info',
		appliesTo: ['Hash'],
		description: 'Number of batch passes required for Hash Join execution.',
		example: 1,
		requiredExplainMods: ['ANALYZE']
	},
	'Original Hash Batches': {
		sourceFunction: 'show_hash_info',
		appliesTo: ['Hash'],
		description: 'Initial batch count projected during query planning before disk spilling.',
		example: 1,
		requiredExplainMods: ['ANALYZE']
	},
	'Peak Memory Usage': {
		sourceFunction: 'show_hash_info',
		appliesTo: ['Hash', 'HashAggregate', 'Memoize'],
		description: 'Peak RAM consumed in kilobytes by hash tables or memoization structures.',
		example: 512,
		requiredExplainMods: ['ANALYZE']
	},
	'Cache Key': {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description: 'Expressions evaluated to generate lookup keys in a Memoize node.',
		example: ['outer_table.id'],
		requiredExplainMods: []
	},
	'Cache Mode': {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description: 'Operating mode for a Memoize cache (e.g., logical, binary).',
		example: 'logical',
		requiredExplainMods: []
	},
	Hits: {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description: 'Number of times a cache lookup hit succeeded in Memoize.',
		example: 150,
		requiredExplainMods: ['ANALYZE']
	},
	Misses: {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description:
			'Number of times a cache lookup missed in Memoize and forced child plan evaluation.',
		example: 50,
		requiredExplainMods: ['ANALYZE']
	},
	Evictions: {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description: 'Number of cached entries evicted under memory constraints.',
		example: 0,
		requiredExplainMods: ['ANALYZE']
	},
	'Shared Hit Blocks': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description:
			'Number of shared buffer pages accessed directly from the PostgreSQL shared buffer pool.',
		example: 3,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Shared Read Blocks': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of shared buffer pages read from disk or OS cache into shared memory.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Shared Dirtied Blocks': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of shared buffer pages modified during node execution.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Shared Written Blocks': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of shared buffer pages written to disk by this backend process.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Local Hit Blocks': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of local buffer pages accessed directly from backend private memory.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Local Read Blocks': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of local buffer pages read from disk into backend private memory.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Local Dirtied Blocks': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of local buffer pages modified in backend private memory.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Local Written Blocks': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of local buffer pages written to disk.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Temp Read Blocks': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of temporary file pages read from disk during spillover operations.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Temp Written Blocks': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of temporary file pages written to disk during spillover operations.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'I/O Read Time': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description:
			'Total time spent reading pages from disk across shared and local buffers, in milliseconds.',
		example: 0.0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'I/O Write Time': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description:
			'Total time spent writing pages to disk across shared and local buffers, in milliseconds.',
		example: 0.0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Temp I/O Read Time': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Total time spent reading temporary disk files, in milliseconds.',
		example: 0.0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'Temp I/O Write Time': {
		sourceFunction: 'ExplainPropertyBuffers',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Total time spent writing temporary disk files, in milliseconds.',
		example: 0.0,
		requiredExplainMods: ['ANALYZE', 'BUFFERS']
	},
	'WAL Records': {
		sourceFunction: 'ExplainPropertyWAL',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of Write-Ahead Log records generated.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'WAL']
	},
	'WAL FPI': {
		sourceFunction: 'ExplainPropertyWAL',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Number of Full Page Images written to the Write-Ahead Log.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'WAL']
	},
	'WAL Bytes': {
		sourceFunction: 'ExplainPropertyWAL',
		appliesTo: ['All Plan Nodes', 'Planning'],
		description: 'Total volume of Write-Ahead Log data generated, expressed in bytes.',
		example: 0,
		requiredExplainMods: ['ANALYZE', 'WAL']
	},
	'Query Text': {
		sourceFunction: 'ExplainQueryText',
		appliesTo: ['Root Level Plan'],
		description: 'The raw SQL query string executed.',
		example: 'SELECT * FROM duck WHERE id > 10',
		requiredExplainMods: ['VERBOSE']
	},
	'Planning Time': {
		sourceFunction: 'ExplainOnePlan',
		appliesTo: ['Root Level Plan'],
		description: 'Total time elapsed in milliseconds during query planning and optimization.',
		example: 0.045,
		requiredExplainMods: ['SUMMARY']
	},
	Planning: {
		sourceFunction: 'ExplainOnePlan',
		appliesTo: ['Root Level Plan'],
		description:
			'Container object holding buffer, WAL, and memory stats captured during the planning phase.',
		example: {
			'Memory Used': 7,
			'Memory Allocated': 8,
			'Shared Hit Blocks': 0
		},
		requiredExplainMods: ['BUFFERS', 'WAL', 'MEMORY']
	},
	'Memory Used': {
		sourceFunction: 'ExplainOnePlan',
		appliesTo: ['Planning'],
		description: 'Peak memory utilized during query planning, in kilobytes.',
		example: 7,
		requiredExplainMods: ['MEMORY']
	},
	'Memory Allocated': {
		sourceFunction: 'ExplainOnePlan',
		appliesTo: ['Planning'],
		description: 'Total memory allocated during query planning, in kilobytes.',
		example: 8,
		requiredExplainMods: ['MEMORY']
	},
	'Execution Time': {
		sourceFunction: 'ExplainOneQuery',
		appliesTo: ['Root Level Plan'],
		description: 'Total query execution time in milliseconds, excluding planning.',
		example: 209.872,
		requiredExplainMods: ['ANALYZE']
	},
	Triggers: {
		sourceFunction: 'ExplainPrintTriggers',
		appliesTo: ['Root Level Plan'],
		description:
			'List of executed table trigger performance statistics including execution times and call counts.',
		example: [
			{
				'Trigger Name': 'trig_update_timestamp',
				Relation: 'duck',
				Time: 0.521,
				Calls: 10
			}
		],
		requiredExplainMods: ['ANALYZE']
	},
	JIT: {
		sourceFunction: 'show_jit',
		appliesTo: ['Root Level Plan', 'Workers'],
		description:
			'Just-In-Time code compilation metrics including function counts, optimization flags, and timing statistics.',
		example: {
			Functions: 4,
			Options: {
				Inlining: true,
				Optimization: true,
				Expressions: true,
				Deforming: true
			},
			Timing: {
				Generation: {
					Deform: 0.116,
					Total: 0.73
				},
				Inlining: 7.659,
				Optimization: 16.384,
				Emission: 13.031,
				Total: 37.803
			}
		},
		requiredExplainMods: []
	},
	Serialization: {
		sourceFunction: 'ExplainOnePlan',
		appliesTo: ['Root Level Plan'],
		description: 'Metrics capturing output serialization overhead and data payload size.',
		example: {
			Time: 85.043,
			'Output Volume': 11611,
			Format: 'text'
		},
		requiredExplainMods: ['SERIALIZE']
	},
	Plans: {
		sourceFunction: 'ExplainSubPlans',
		appliesTo: ['Parent Plan Nodes'],
		description: 'Array containing nested child plan node objects.',
		example: [],
		requiredExplainMods: []
	}
};
