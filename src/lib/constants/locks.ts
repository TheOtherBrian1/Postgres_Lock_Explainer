const tableLocks = [
	{
		lock: 'ACCESS SHARE',
		conflicts: ['ACCESS EXCLUSIVE'],
		description:
			"Acquired by operations that only read from a table. It ensures the operation doesn't try to read from a table whose file or access rules are being modified. Without this protection, the operation could fail (for example, if the read tried to interact with a table while it was being DROPPED) or return inconsistent results, e.g. if table or RLS rules change midway through the query."
	},
	{
		lock: 'ROW SHARE',
		conflicts: ['EXCLUSIVE', 'ACCESS EXCLUSIVE'],
		description:
			'Functionally identical to ACCESS SHARE (SELECT), but also prevents materialized views from refreshing concurrently.'
	},
	{
		lock: 'ROW EXCLUSIVE',
		conflicts: ['SHARE', 'SHARE ROW EXCLUSIVE', 'EXCLUSIVE', 'ACCESS EXCLUSIVE'],
		description:
			'Claimed by write commands and it blocks indexes, and triggers from being built. Also prevents foreign key constraints from being added. Without it, write operations could attempt to write to index files that are in a transitory state, disrupt an initial foreign key check, or inappropriately activate a partially created trigger. It also blocks operations that change or alter the definition of the underlying table file (such as a DROP command).'
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
			'Prevents schema definition modifications and vacuum/analyzes from interrupting each other. Also used to create indexes concurrently. It still allows reads/writes.'
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
		description: 'Prevents writes and maintenance operations against a table, so they do not interfere with the index creation process. Notably, it does not block itself, so it is possible to build multiple indexes for a table at once.'
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
		description: 'Prevents all writes and maintenance operations while triggers and foreign keys are added. Nearly identical to the SHARE lock, with the exception that it also blocks SHARE, too, preventing index creation commands.'
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
		description: 'Allows materialized views to refresh while still allowing SELECT'
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
			"When a table's underlying file is being replaced, or its metadata is significantly modified, Postgres blocks all operations on that table. This prevents data loss during writes and avoids returning incomplete or inconsistent data during reads."
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
