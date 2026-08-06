const memoize = {
	'Cache Key': {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description: 'Column or value used as lookup keys for the Memoize cache.',
		example: ['some_table.col'],
		requiredExplainMods: []
	},
	'Cache Mode': {
		sourceFunction: 'show_memoize_info',
		appliesTo: ['Memoize'],
		description:
			"Cache key comparison mode: 'logical' or 'binary'. When using binary, such as with integer values, comparison is done by comparing raw bytes (binary). When values require logical translation to compare, such as text, logical checks will be used instead",
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
		description: 'Number of cache lookup misses, meaning the loop had to check the table directly',
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
		description:
			"Number of times a single scan's results exceeded the cache memory limit, preventing it from being cached for future reference.",
		example: 0,
		requiredExplainMods: ['ANALYZE']
	}
	// 'Estimated Capacity': {
	// 	sourceFunction: 'show_memoize_info',
	// 	appliesTo: ['Memoize'],
	// 	description:
	// 		'Planner-estimated number of cache entries that fit in memory (PG19+/master). Suppressed with COSTS OFF.',
	// 	example: 1000,
	// 	requiredExplainMods: []
	// },
	// 'Estimated Distinct Lookup Keys': {
	// 	sourceFunction: 'show_memoize_info',
	// 	appliesTo: ['Memoize'],
	// 	description:
	// 		'Planner-estimated number of distinct cache keys (PG19+/master). Suppressed with COSTS OFF.',
	// 	example: 500,
	// 	requiredExplainMods: []
	// },
	// 'Estimated Lookups': {
	// 	sourceFunction: 'show_memoize_info',
	// 	appliesTo: ['Memoize'],
	// 	description:
	// 		'Planner-estimated total number of cache lookups (PG19+/master). Suppressed with COSTS OFF.',
	// 	example: 2000,
	// 	requiredExplainMods: []
	// },
	// 'Estimated Hit Percent': {
	// 	sourceFunction: 'show_memoize_info',
	// 	appliesTo: ['Memoize'],
	// 	description:
	// 		'Planner-estimated cache hit rate percentage (PG19+/master). Suppressed with COSTS OFF.',
	// 	example: 75.0,
	// 	requiredExplainMods: []
	// }
};

/* Force memoize query:

BEGIN;

-- 1. Create primary table
CREATE TEMP TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name TEXT
);

-- 2. Create target table with duplicate foreign keys
CREATE TEMP TABLE employees (
    emp_id INT PRIMARY KEY,
    dept_id INT,
    emp_name TEXT
);

-- Populate departments
INSERT INTO departments (dept_id, dept_name)
SELECT g, 'Dept ' || g 
FROM generate_series(1, 10) AS g;

-- Populate employees with high repetition of dept_ids
INSERT INTO employees (emp_id, dept_id, emp_name)
SELECT 
    g, 
    ((g % 10) + 1), -- Produces repeated dept_ids (1..10) over 100,000 rows
    'Employee ' || g
FROM generate_series(1, 100000) AS g;

-- Index the join key
CREATE INDEX idx_emp_dept_id ON employees(dept_id);

-- Analyze statistics so the planner has accurate counts
ANALYZE departments;
ANALYZE employees;

-- 3. Force Nested Loop to see Memoize in action
SET LOCAL enable_hashjoin = off;
SET LOCAL enable_mergejoin = off;

-- 4. Execute query with EXPLAIN ANALYZE
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT d.dept_name, e.emp_name
FROM departments d
JOIN employees e ON d.dept_id = e.dept_id;

ROLLBACK;
*/
