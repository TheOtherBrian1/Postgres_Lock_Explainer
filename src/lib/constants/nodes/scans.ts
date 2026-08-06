const scans = [
	// Base Scans
	'Seq Scan',
	'Index Scan',
	'Index Only Scan',
	'Index Scan Backward',
	'Index Only Scan Backward',

	// Bitmap Scans
	'Bitmap Index Scan',
	'BitmapOr',
	'BitmapAnd',
	'Bitmap Heap Scan',

	// Other Scans
	'Result',
	'Foreign Scan',
	'Custom Scan',
	'Function Scan',
	'ProjectSet',
	'Values Scan',
	'CTE Scan',
	'Subquery Scan',
	'TID Scan',
	'Range TID Scan',
	'WorkTable Scan',
	'Table Function Scan',
	'Sample Scan',
	'Named Tuplestore Scan'
];

const joins = [
	// Joins
	'Nested Loop',
	'Nested Loop Left Join',
	'Nested Loop Right Join',
	'Nested Loop Full Join',
	'Hash Join',
	'Hash Left Join',
	'Hash Right Join',
	'Hash Full Join',
	'Merge Join',
	'Merge Left Join',
	'Merge Right Join',
	'Merge Full Join',

	// Join-Like Nodes
	'Nested Loop Semi Join',
	'Hash Semi Join',
	'Merge Semi Join',
	'Nested Loop Anti Join',
	'Hash Anti Join',
	'Merge Anti Join',
	'HashSetOp',
	'SetOp'
];

const parallelOperations = [
	'Parallel Seq Scan',
	'Parallel Index Scan',
	'Parallel Index Only Scan',
	'Parallel Bitmap Heap Scan',
	'Parallel Append',
	'Parallel Hash',
	'Parallel Hash Join'
];

const concat = [
	// Gather Nodes
	'Gather',
	'Gather Merge',

	// Append Nodes
	'Append',
	'Merge Append',
	'Recursive Union'
];

const agg = [
	// Aggregate Nodes
	'Aggregate',
	'HashAggregate',
	'GroupAggregate',
	'MixedAggregate',
	'WindowAgg'
];

const dml = [
	// Data Modification
	'Delete',
	'Insert',
	'Update',
	'Merge'
];

const intermediate = [
	// Hash Nodes
	'Hash',

	// Sort Nodes
	'Sort',
	'Incremental Sort'
];

const caching = [
	// Caching
	'Memoize',
	'Materialize'
];

const unique = ['Group', 'Unique'];

const etc = [
	// Misc
	'LockRows',
	'Limit'
];
