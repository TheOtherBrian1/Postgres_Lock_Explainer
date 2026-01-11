const tableLocks = [
	{
		lock: 'ACCESS SHARE',
		conflicts: ['ACCESS EXCLUSIVE'],
		description:
			"Acquired by operations that only read from a table. It ensures the operation doesn't try to read from a table whose file or access rules are being modified. Without this protection, the operation could fail (for example, if the file no longer exists) or produce corrupted results (if table or RLS rules change midway through the query)."
	},
	{
		lock: 'ROW SHARE',
		conflicts: ['EXCLUSIVE', 'ACCESS EXCLUSIVE'],
		description:
			'Blocks data changes while indexes, materialized views, or triggers are being created to prevent new data from disrupting the build process. It also stops changes to table access rules (like RLS updates) or operations that overwrite the table file, protecting against data loss that could occur if the system tried changing data while the file was inaccessible.'
	},
	{
		lock: 'ROW EXCLUSIVE',
		conflicts: ['SHARE', 'SHARE ROW EXCLUSIVE', 'EXCLUSIVE', 'ACCESS EXCLUSIVE'],
		description:
			'Blocks data changes while indexes, materialized views, or triggers are being created to prevent new data from disrupting the build process. It also stops changes to table access rules (like RLS updates) or operations that overwrite the table file, protecting against data loss that could occur if the system tried changing data while the file was inaccessible.'
	},
	{
		lock: 'SHARE UPDATE EXCLUSIVE',
		conflicts: [
			'SHARE UPDATE EXCLUSIVE',
			'SHARE',
			'SHARE ROW EXCLUSIVE',
			'EXCLUSIVE',
			'ACCESS EXCLUSIVE'
		],
		description:
			'Prevents schema changes or vacuums from running at the same time on a table. Without it, changes could conflict, corrupt table statistics, and overlapping vacuums would waste resources.'
	},
	{
		lock: 'SHARE',
		conflicts: [
			'ROW EXCLUSIVE',
			'SHARE UPDATE EXCLUSIVE',
			'SHARE ROW EXCLUSIVE',
			'EXCLUSIVE',
			'ACCESS EXCLUSIVE'
		],
		description: 'Prevents data and table changes, which can impact the index build process'
	},
	{
		lock: 'SHARE ROW EXCLUSIVE',
		conflicts: [
			'ROW EXCLUSIVE',
			'SHARE UPDATE EXCLUSIVE',
			'SHARE ROW EXCLUSIVE',
			'SHARE',
			'SHARE ROW EXCLUSIVE',
			'EXCLUSIVE',
			'ACCESS EXCLUSIVE'
		],
		description: 'Prevents table data from being modified while triggers and foreign keys are added'
	},
	{
		lock: 'EXCLUSIVE',
		conflicts: [
			'ROW SHARE',
			'ROW EXCLUSIVE',
			'SHARE UPDATE EXCLUSIVE',
			'SHARE',
			'SHARE ROW EXCLUSIVE',
			'EXCLUSIVE',
			'ACCESS EXCLUSIVE'
		],
		description: 'Allows materialized views to refresh while still allowing SELECTs'
	},
	{
		lock: 'ACCESS EXCLUSIVE',
		conflicts: [
			'ACCESS SHARE',
			'ROW SHARE',
			'ROW EXCLUSIVE',
			'SHARE UPDATE EXCLUSIVE',
			'SHARE',
			'SHARE ROW EXCLUSIVE',
			'EXCLUSIVE',
			'ACCESS EXCLUSIVE'
		],
		description:
			"When a table's underlying file is being replaced or its access policies are being updated, Postgres blocks all operations on that table. This prevents data loss during writes and avoids returning incomplete or inconsistent data during reads."
	}
];
const rowLocks = [
	{
		lock: 'FOR UPDATE',
		conflicts: ['FOR UPDATE', 'FOR SHARE', 'FOR UPDATE', 'FOR NO KEY UPDATE'],
		description:
			'Blocks rows from being deleted or updated while protected. Also blocks SELECT statements that are modified to be treated as if they were UPDATEs/DELETEs'
	},
	{
		lock: 'FOR NO KEY UPDATE',
		conflicts: ['FOR SHARE', 'FOR UPDATE', 'FOR NO KEY UPDATE'],
		description: 'A lesser form of FOR UPDATE that allows SELECT FOR KEY SHARE'
	},
	{
		lock: 'FOR KEY SHARE',
		conflicts: ['FOR SHARE', 'FOR UPDATE', 'FOR NO KEY UPDATE'],
		description: 'A weak lock that allows for certain modified SELECT commands'
	},
	{
		lock: 'FOR SHARE',
		conflicts: ['FOR UPDATE'],
		description: 'A weak lock that allows for certain modified SELECT commands'
	}
];

export default [...tableLocks, ...rowLocks];
export { tableLocks, rowLocks };
