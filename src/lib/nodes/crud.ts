const CRUDFields = {
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
		description: 'The name of the table being scanned or modified.',
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
		example: '(nodes.id >= 1)',
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
			'The name of the set-returning function in a Function Scan (single-function case).',
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
	}
};
