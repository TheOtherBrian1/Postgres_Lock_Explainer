

SELECT 
  datname,
  usename,
  pid,
  query AS query_waiting_on_lock,
  NOW() - xact_start AS apprx_time_spent_waiting,
  application_name
FROM pg_stat_activity 
WHERE wait_event_type = 'Lock' AND usename = 'postgres';

SELECT 
  datname,
  usename,
  pg_stat_activity.pid,
  query AS query_waiting_on_lock,
  NOW() - xact_start AS apprx_time_spent_waiting,
  application_name,
  -- pg_locks.*,
  -- pg_locks.relation::regclass
  pg_locks.mode
FROM pg_stat_activity
INNER JOIN pg_locks 
ON pg_locks.pid = pg_stat_activity.pid
WHERE wait_event_type = 'Lock' AND pg_locks.granted = false AND usename = 'postgres';



CREATE RECURSIVE VIEW public.lock_tree (
  datname, 
  usename, 
  pid, 
  query_waiting_on_lock, 
  apprx_time_spent_waiting,
  application_name,
  mode
) AS
    SELECT 
  datname,
  usename,
  pg_stat_activity.pid,
  query AS query_waiting_on_lock,
  NOW() - xact_start AS apprx_time_spent_waiting,
  application_name,
  -- pg_locks.*,
  -- pg_locks.relation::regclass
  pg_locks.mode
FROM pg_stat_activity
INNER JOIN pg_locks 
ON pg_locks.pid = pg_stat_activity.pid
WHERE wait_event_type = 'Lock' AND pg_locks.granted = false AND usename = 'postgres'
UNION ALL
SELECT lock_tree.* FROM lock_tree WHERE pg_blocking_pids(pid) IN (lock_tree.pid);


SELECT * FROM pg_locks WHERE pid = 293

SELECT pg_blocking_pids(2662)

SELECT * FROM '{1, 2, 3}'::int[] range_intersect_agg('{1, 2, 3}'::int[])