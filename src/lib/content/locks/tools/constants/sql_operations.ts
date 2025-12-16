const operations = [
	{
		operation: 'SELECT',
		description: 'Reads rows from a table',
		exampleQuery: 'SELECT * FROM some_table;',
		mainTableLocksClaimed: ['ACCESS SHARE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's Lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=The%20SELECT%20command%20acquires%20a%20lock%20of%20this%20mode%20on%20referenced%20tables.%20In%20general%2C%20any%20query%20that%20only%20reads%20a%20table%20and%20does%20not%20modify%20it%20will%20acquire%20this%20lock%20mode.'
			}
		]
	},
	{
		operation: 'UPDATE (NOT UNIQUE)',
		description: 'Updates rows from a table',
		exampleQuery: `UPDATE some_table 
SET some_col = 'some_val'
WHERE some_col = 'some_other_val';`,
		mainTableLocksClaimed: ['ROW EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: ['FOR NO KEY UPDATE'],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=The%20commands%20UPDATE%2C%20DELETE%2C%20INSERT%2C%20and%20MERGE%20acquire%20this%20lock%20mode%20on%20the%20target%20table%20(in%20addition%20to%20ACCESS%20SHARE%20locks%20on%20any%20other%20referenced%20tables).%20In%20general%2C%20this%20lock%20mode%20will%20be%20acquired%20by%20any%20command%20that%20modifies%20data%20in%20a%20table.'
			},
			{
				title: "Postgres's row lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#:~:text=This%20lock%20mode%20is%20also%20acquired%20by%20any%20UPDATE%20that%20does%20not%20acquire%20a%20FOR%20UPDATE%20lock.'
			}
		]
	},
	{
		operation: 'UPDATE (UNIQUE)',
		description: 'Updates rows from a table with a unique or primary key column',
		exampleQuery: `UPDATE some_table 
SET some_col = 'some_val'
WHERE some_col = 'some_other_val';`,
		mainTableLocksClaimed: ['ROW EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: ['FOR UPDATE'],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=The%20commands%20UPDATE%2C%20DELETE%2C%20INSERT%2C%20and%20MERGE%20acquire%20this%20lock%20mode%20on%20the%20target%20table%20(in%20addition%20to%20ACCESS%20SHARE%20locks%20on%20any%20other%20referenced%20tables).%20In%20general%2C%20this%20lock%20mode%20will%20be%20acquired%20by%20any%20command%20that%20modifies%20data%20in%20a%20table.'
			},
			{
				title: "Postgres's row lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#:~:text=The%20FOR%20UPDATE%20lock,change%20in%20the%20future.'
			}
		]
	},
	{
		operation: 'DELETE',
		description: 'DELETE rows from a table',
		exampleQuery: `DELETE FROM some_table 
WHERE some_col = 'some_other_val';`,
		mainTableLocksClaimed: ['ROW EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: ['FOR UPDATE'],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#:~:text=ROW%20EXCLUSIVE%20(RowExclusiveLock)'
			},
			{
				title: "Postgres's row lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#:~:text=The%20FOR%20UPDATE%20lock%20mode%20is%20also%20acquired%20by%20any%20DELETE%20on%20a%20row'
			}
		]
	},
	{
		operation: 'INSERT',
		description: 'INSERT rows from a table',
		exampleQuery: `INSERT INTO some_table (col1, col2...)
VALUES ('some_val1', 'some_val2'...)`,
		mainTableLocksClaimed: ['ROW EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=The%20commands%20UPDATE%2C%20DELETE%2C%20INSERT%2C%20and%20MERGE%20acquire%20this%20lock%20mode%20on%20the%20target%20table%20(in%20addition%20to%20ACCESS%20SHARE%20locks%20on%20any%20other%20referenced%20tables).%20In%20general%2C%20this%20lock%20mode%20will%20be%20acquired%20by%20any%20command%20that%20modifies%20data%20in%20a%20table.'
			}
		]
	},
	{
		operation: 'MERGE',
		description:
			'Introduced in Postgres 15, MERGE allows developers to perform INSERTs, UPDATEs, and DELETEs in a single operation based on conditions',
		exampleQuery: `MERGE INTO customer_account ca
USING recent_transactions t
ON t.customer_id = ca.customer_id
WHEN MATCHED THEN
  UPDATE SET balance = balance + transaction_value
WHEN NOT MATCHED THEN
  INSERT (customer_id, balance)
  VALUES (t.customer_id, t.transaction_value);`,
		mainTableLocksClaimed: ['ROW EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: ['FOR UPDATE'],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=The%20commands%20UPDATE%2C%20DELETE%2C%20INSERT%2C%20and%20MERGE%20acquire%20this%20lock%20mode%20on%20the%20target%20table%20(in%20addition%20to%20ACCESS%20SHARE%20locks%20on%20any%20other%20referenced%20tables).%20In%20general%2C%20this%20lock%20mode%20will%20be%20acquired%20by%20any%20command%20that%20modifies%20data%20in%20a%20table.'
			},
			{
				title: "Postgres's row lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#:~:text=The%20FOR%20UPDATE%20lock,change%20in%20the%20future.'
			}
		]
	},
	{
		operation: 'VACUUM (without FULL)',
		description: 'Removed stale rows from table',
		exampleQuery: 'VACUUM some_table;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20VACUUM%20(without%20FULL)%2C%20ANALYZE%2C%20CREATE%20INDEX%20CONCURRENTLY%2C%20CREATE%20STATISTICS%2C%20COMMENT%20ON%2C%20REINDEX%20CONCURRENTLY%2C%20and%20certain%20ALTER%20INDEX%20and%20ALTER%20TABLE%20variants%20(for%20full%20details%20see%20the%20documentation%20of%20these%20commands).'
			}
		]
	},
	{
		operation: 'ANALYZE',
		description: 'Collects statistics about table contents',
		exampleQuery: 'ANALYZE some_table;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20VACUUM%20(without%20FULL)%2C%20ANALYZE%2C%20CREATE%20INDEX%20CONCURRENTLY%2C%20CREATE%20STATISTICS%2C%20COMMENT%20ON%2C%20REINDEX%20CONCURRENTLY%2C%20and%20certain%20ALTER%20INDEX%20and%20ALTER%20TABLE%20variants%20(for%20full%20details%20see%20the%20documentation%20of%20these%20commands).'
			}
		]
	},
	{
		operation: 'CREATE INDEX CONCURRENTLY',
		description: 'Builds an index without locking out writes',
		exampleQuery: 'CREATE INDEX CONCURRENTLY idx_name ON some_table (col_name);',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20VACUUM%20(without%20FULL)%2C%20ANALYZE%2C%20CREATE%20INDEX%20CONCURRENTLY%2C%20CREATE%20STATISTICS%2C%20COMMENT%20ON%2C%20REINDEX%20CONCURRENTLY%2C%20and%20certain%20ALTER%20INDEX%20and%20ALTER%20TABLE%20variants%20(for%20full%20details%20see%20the%20documentation%20of%20these%20commands).'
			}
		]
	},
	{
		operation: 'CREATE STATISTICS',
		description: 'Creates extended statistics objects',
		exampleQuery: 'CREATE STATISTICS s_name ON col1, col2 FROM some_table;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20VACUUM%20(without%20FULL)%2C%20ANALYZE%2C%20CREATE%20INDEX%20CONCURRENTLY%2C%20CREATE%20STATISTICS%2C%20COMMENT%20ON%2C%20REINDEX%20CONCURRENTLY%2C%20and%20certain%20ALTER%20INDEX%20and%20ALTER%20TABLE%20variants%20(for%20full%20details%20see%20the%20documentation%20of%20these%20commands).'
			}
		]
	},
	{
		operation: 'COMMENT ON',
		description: 'Define or change a comment on an object',
		exampleQuery: "COMMENT ON TABLE some_table IS 'This is a comment.';",
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20VACUUM%20(without%20FULL)%2C%20ANALYZE%2C%20CREATE%20INDEX%20CONCURRENTLY%2C%20CREATE%20STATISTICS%2C%20COMMENT%20ON%2C%20REINDEX%20CONCURRENTLY%2C%20and%20certain%20ALTER%20INDEX%20and%20ALTER%20TABLE%20variants%20(for%20full%20details%20see%20the%20documentation%20of%20these%20commands).'
			}
		]
	},
	{
		operation: 'REINDEX CONCURRENTLY',
		description: 'Rebuilds an index without locking out writes',
		exampleQuery: 'REINDEX INDEX CONCURRENTLY idx_name;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20VACUUM%20(without%20FULL)%2C%20ANALYZE%2C%20CREATE%20INDEX%20CONCURRENTLY%2C%20CREATE%20STATISTICS%2C%20COMMENT%20ON%2C%20REINDEX%20CONCURRENTLY%2C%20and%20certain%20ALTER%20INDEX%20and%20ALTER%20TABLE%20variants%20(for%20full%20details%20see%20the%20documentation%20of%20these%20commands).'
			}
		]
	},
	{
		operation: 'ALTER INDEX RENAME',
		description: 'Renames an existing index',
		exampleQuery: 'ALTER INDEX idx_name RENAME TO new_idx_name;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter index docs",
				link: 'https://www.postgresql.org/docs/current/sql-alterindex.html#:~:text=The%20RENAME%20form,UPDATE%20EXCLUSIVE%20lock.'
			}
		]
	},
	{
		operation: 'ALTER TABLE SET STATISTICS',
		description: 'Sets the per-column statistics-gathering target',
		exampleQuery: 'ALTER TABLE some_table ALTER COLUMN col_name SET STATISTICS 1000;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=SET%20STATISTICS%20acquires%20a%20SHARE%20UPDATE%20EXCLUSIVE%20lock.'
			}
		]
	},
	{
		operation: 'ALTER TABLE VALIDATE CONSTRAINT (general)',
		description:
			"You can add a NOT NULL constraint to a table that has NULL values already. However, the constraint would have to be added as INVALID, so it doesn't impose its rules against old rows, but instead just new/updated ones. VALIDATING causes a constraint to check old rows to make sure they comply with the rules.",
		exampleQuery: 'ALTER TABLE some_table VALIDATE CONSTRAINT constraint_name;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=After%20that%2C%20a,by%20the%20constraint.)'
			}
		]
	},
	{
		operation: 'ALTER TABLE VALIDATE CONSTRAINT FOREIGN KEY',
		description: 'Validates a foreign key constraint',
		exampleQuery: 'ALTER TABLE some_table VALIDATE CONSTRAINT fk_constraint_name;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: ['ROW SHARE'],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=After%20that%2C%20a,by%20the%20constraint.)'
			}
		]
	},
	{
		operation: 'ALTER TABLE CLUSTER ON',
		description: 'Sets the default index for future CLUSTER operations',
		exampleQuery: 'ALTER TABLE some_table CLUSTER ON idx_name;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=cluster%20the%20table.-,Changing%20cluster%20options%20acquires%20a%20SHARE%20UPDATE%20EXCLUSIVE%20lock.,-SET%20WITHOUT%20CLUSTER'
			}
		]
	},
	{
		operation: 'ALTER TABLE SET WITHOUT CLUSTER',
		description: 'Removes any hard-coded index targets for a table',
		exampleQuery: 'ALTER TABLE some_table SET WITHOUT CLUSTER;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=specify%20an%20index.-,Changing%20cluster%20options%20acquires%20a%20SHARE%20UPDATE%20EXCLUSIVE%20lock.,-SET%20WITHOUT%20OIDS'
			}
		]
	},
	{
		operation: 'ALTER TABLE ATTACH PARTITION',
		description:
			'Attaches a table as a partition. It claims a SHARE UPDATE EXCLUSIVE lock on the parent table. It is important to note that the paritition being attatched is functionally offline during the operation, as an ACCESS EXCLUSIVE LOCK is placed on it',
		exampleQuery: 'ALTER TABLE partitioned_table ATTACH PARTITION table_to_attach FOR VALUES ...;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'], // On the partition being attached
		refTableLocksClaimed: [''], // On the parent partitioned table
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DETACH-PARTITION:~:text=Attaching%20a%20partition%20acquires%20a%20SHARE%20UPDATE%20EXCLUSIVE%20lock%20on%20the%20parent%20table%2C%20in%20addition%20to%20the%20ACCESS%20EXCLUSIVE%20locks%20on%20the%20table%20being%20attached%20and%20on%20the%20default%20partition%20(if%20any).'
			}
		]
	},
	{
		operation: 'ALTER TABLE DETACH PARTITION',
		description: 'Detaches a partition from a partitioned table',
		exampleQuery: 'ALTER TABLE partitioned_table DETACH PARTITION partition_to_detach;',
		mainTableLocksClaimed: ['ACCESS EXCLUSIVE'],
		refTableLocksClaimed: ['SHARE'],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's partition detatch docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DETACH-PARTITION:~:text=This%20form%20detaches,a%20default%20partition.'
			},
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DETACH-PARTITION:~:text=ALTER%20TABLE%20changes,by%20any%20subcommand.'
			}
		]
	},
	{
		operation: 'ALTER TABLE DETACH PARTITION CONCURRENTLY',
		description: 'Detaches a partition from a parent table without blocking reads/writes.',
		exampleQuery:
			'ALTER TABLE partitioned_table DETACH PARTITION partition_to_detach CONCURRENTLY;',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: ['SHARE'],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's partition detatch docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DETACH-PARTITION:~:text=This%20form%20detaches,a%20default%20partition.'
			}
		]
	},
	{
		operation: 'ALTER TABLE... SET (n_distinct)',
		description:
			'Sets the estimated number of distinct values for a column. Used by the query planner',
		exampleQuery: 'ALTER TABLE some_table ALTER COLUMN col_name SET (n_distinct = 100.0);',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DETACH-PARTITION:~:text=Changing%20per%2Dattribute%20options%20acquires%20a%20SHARE%20UPDATE%20EXCLUSIVE%20lock.'
			}
		]
	},
	{
		operation: 'ALTER TABLE... RESET (n_distinct)',
		description: 'Resets the estimated number of distinct values for a column',
		exampleQuery: 'ALTER TABLE some_table ALTER COLUMN col_name RESET (n_distinct);',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DETACH-PARTITION:~:text=Changing%20per%2Dattribute%20options%20acquires%20a%20SHARE%20UPDATE%20EXCLUSIVE%20lock.'
			}
		]
	},
	{
		operation: 'ALTER TABLE... SET (n_distinct_inherited)',
		description: 'Sets estimated n-distinct values for inheritance parents',
		exampleQuery:
			'ALTER TABLE some_table ALTER COLUMN col_name SET (n_distinct_inherited = 100.0);',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DETACH-PARTITION:~:text=Changing%20per%2Dattribute%20options%20acquires%20a%20SHARE%20UPDATE%20EXCLUSIVE%20lock.'
			}
		]
	},
	{
		operation: 'ALTER TABLE... RESET (n_distinct_inherited)',
		description: 'Resets estimated n-distinct values for inheritance parents',
		exampleQuery: 'ALTER TABLE some_table ALTER COLUMN col_name RESET (n_distinct_inherited);',
		mainTableLocksClaimed: ['SHARE UPDATE EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-DETACH-PARTITION:~:text=Changing%20per%2Dattribute%20options%20acquires%20a%20SHARE%20UPDATE%20EXCLUSIVE%20lock.'
			}
		]
	},
	{
		operation: 'CREATE INDEX (sans CONCURRENTLY)',
		description: 'Builds an index on a table',
		exampleQuery: 'CREATE INDEX index_name ON table_name (column1, column2, ...);',
		mainTableLocksClaimed: ['SHARE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20CREATE%20INDEX%20(without%20CONCURRENTLY).'
			}
		]
	},
	{
		operation: 'CREATE TRIGGER',
		description: 'Adds a new trigger to a table.',
		exampleQuery:
			'CREATE TRIGGER new_trigger AFTER UPDATE ON users FOR EACH ROW EXECUTE FUNCTION check_user_update();',
		mainTableLocksClaimed: ['SHARE ROW EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20CREATE%20TRIGGER%20and%20some%20forms%20of%20ALTER%20TABLE.'
			}
		]
	},
	{
		operation: 'ALTER TABLE... ADD FOREIGN KEY',
		description: 'Adds a foreign key constraint to a table, linking it to a referenced table.',
		exampleQuery: 'ALTER TABLE orders ADD FOREIGN KEY (customer_id) REFERENCES customers (id);',
		mainTableLocksClaimed: ['SHARE ROW EXCLUSIVE'],
		refTableLocksClaimed: ['SHARE ROW EXCLUSIVE'],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=Although%20most%20forms,constraint%20is%20declared.'
			}
		]
	},
	{
		operation: 'ALTER TABLE... DISABLE TRIGGER',
		description: 'Disables a trigger',
		exampleQuery: 'ALTER TABLE users DISABLE TRIGGER check_user_update;',
		mainTableLocksClaimed: ['SHARE ROW EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=This%20command%20acquires%20a%20SHARE%20ROW%20EXCLUSIVE%20lock.'
			}
		]
	},
	{
		operation: 'ALTER TABLE... ENABLE TRIGGER',
		description: 'Enables a trigger',
		exampleQuery: 'ALTER TABLE users ENABLE TRIGGER check_user_update;',
		mainTableLocksClaimed: ['SHARE ROW EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=This%20command%20acquires%20a%20SHARE%20ROW%20EXCLUSIVE%20lock.'
			}
		]
	},
	{
		operation: 'ALTER TABLE... ENABLE REPLICA TRIGGER',
		description: 'Sets a trigger to be active in replica sessions',
		exampleQuery: 'ALTER TABLE users ENABLE REPLICA TRIGGER some_trigger;',
		mainTableLocksClaimed: ['SHARE ROW EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=This%20command%20acquires%20a%20SHARE%20ROW%20EXCLUSIVE%20lock.'
			}
		]
	},
	{
		operation: 'ALTER TABLE... ENABLE ALWAYS TRIGGER',
		description: 'Sets a trigger to be active on both the replica and primary',
		exampleQuery: 'ALTER TABLE users ENABLE ALWAYS TRIGGER user_audit_trigger;',
		mainTableLocksClaimed: ['SHARE ROW EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's alter table docs",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=This%20command%20acquires%20a%20SHARE%20ROW%20EXCLUSIVE%20lock.'
			}
		]
	},
	{
		operation: 'REFRESH MATERIALIZED VIEW CONCURRENTLY',
		description: 'Updates a materialized view without blocking reads.',
		exampleQuery: 'REFRESH MATERIALIZED VIEW CONCURRENTLY my_materialized_view;',
		mainTableLocksClaimed: ['EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20REFRESH%20MATERIALIZED%20VIEW%20CONCURRENTLY.'
			}
		]
	},
	{
		operation: 'DROP TABLE',
		description: 'Removes a table from the database.',
		exampleQuery: 'DROP TABLE users;',
		mainTableLocksClaimed: ['ACCESS EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20the,a%20mode%20explicitly.'
			}
		]
	},
	{
		operation: 'TRUNCATE',
		description:
			'Removes all rows from a table by deleting then recreating the underlying table file ',
		exampleQuery: 'TRUNCATE TABLE logs;',
		mainTableLocksClaimed: ['ACCESS EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20the,a%20mode%20explicitly.'
			}
		]
	},
	{
		operation: 'REINDEX',
		description: 'Rebuilds an index (removes bloat)',
		exampleQuery: 'REINDEX INDEX idx_name;',
		mainTableLocksClaimed: ['ACCESS EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20the,a%20mode%20explicitly.'
			}
		]
	},
	{
		operation: 'CLUSTER',
		description: "Reorders a table's rows to match the order of an index",
		exampleQuery: 'CLUSTER users USING users_pkey;',
		mainTableLocksClaimed: ['ACCESS EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20the,a%20mode%20explicitly.'
			}
		]
	},
	{
		operation: 'VACUUM FULL',
		description: 'Removes bloat by rewriting the entire table into a new file',
		exampleQuery: 'VACUUM FULL users;',
		mainTableLocksClaimed: ['ACCESS EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20the,a%20mode%20explicitly.'
			}
		]
	},
	{
		operation: 'REFRESH MATERIALIZED VIEW (sans CONCURRENTLY)',
		description:
			'Updates a materialized view, blocking all reads and writes against it during the update.',
		exampleQuery: 'REFRESH MATERIALIZED VIEW my_materialized_view;',
		mainTableLocksClaimed: ['ACCESS EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20the,a%20mode%20explicitly.'
			}
		]
	},
	{
		operation: 'ALTER INDEX (general)',
		description: 'Performs general index alterations',
		exampleQuery: 'ALTER INDEX idx_users_email RENAME TO idx_users_email_address;',
		mainTableLocksClaimed: ['ACCESS EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's locks doc",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=ALTER%20TABLE%20changes,by%20any%20subcommand.'
			}
		]
	},
	{
		operation: 'ALTER TABLE (general)',
		description: 'Alters a table',
		exampleQuery: 'ALTER TABLE users ADD COLUMN age INT;',
		mainTableLocksClaimed: ['ACCESS EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's locks doc",
				link: 'https://www.postgresql.org/docs/current/sql-altertable.html#:~:text=ALTER%20TABLE%20changes,by%20any%20subcommand.'
			}
		]
	},
	{
		operation: 'LOCK TABLE',
		description: 'Explicitly locks a table in ACCESS EXCLUSIVE mode (or another specified mode).',
		exampleQuery: 'LOCK TABLE users IN ACCESS EXCLUSIVE MODE;',
		mainTableLocksClaimed: ['ACCESS EXCLUSIVE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: [],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES:~:text=Acquired%20by%20the,a%20mode%20explicitly.'
			}
		]
	},
	{
		operation: 'SELECT... FOR UPDATE',
		description:
			'Selects rows and locks them, preventing other transactions from updating, deleting, or locking them',
		exampleQuery: 'SELECT * FROM users WHERE id = 1 FOR UPDATE;',
		mainTableLocksClaimed: ['ROW SHARE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: ['FOR UPDATE'],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#:~:text=Level%20Lock%20Modes-,FOR%20UPDATE,-FOR%20UPDATE%20causes'
			}
		]
	},
	{
		operation: 'SELECT... FOR NO KEY UPDATE',
		description:
			'Selects rows and locks them, blocking other FOR SHARE, FOR UPDATE, and FOR NO KEY UPDATE locks.',
		exampleQuery: 'SELECT * FROM users WHERE id = 1 FOR NO KEY UPDATE;',
		mainTableLocksClaimed: ['ROW SHARE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: ['FOR NO KEY UPDATE'],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#:~:text=in%20the%20future.-,FOR%20NO%20KEY%20UPDATE,-Behaves%20similarly%20to'
			}
		]
	},
	{
		operation: 'SELECT... FOR SHARE',
		description:
			'Selects rows and locks them, blocking other FOR UPDATE and FOR NO KEY UPDATE locks.',
		exampleQuery: 'SELECT * FROM users WHERE id = 1 FOR SHARE;',
		mainTableLocksClaimed: ['ROW SHARE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: ['FOR SHARE'],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#:~:text=FOR%20UPDATE%20lock.-,FOR%20SHARE,-Behaves%20similarly%20to'
			}
		]
	},
	{
		operation: 'SELECT... FOR KEY SHARE',
		description: 'Selects rows and locks them, blocking other FOR UPDATE locks.',
		exampleQuery: 'SELECT * FROM users WHERE id = 1 FOR KEY SHARE;',
		mainTableLocksClaimed: ['ROW SHARE'],
		refTableLocksClaimed: [],
		mainRowLocksClaimed: ['FOR KEY SHARE'],
		refRowLocksClaimed: [],
		sources: [
			{
				title: "Postgres's lock docs",
				link: 'https://www.postgresql.org/docs/current/explicit-locking.html#:~:text=KEY%20SHARE.-,FOR%20KEY%20SHARE,-Behaves%20similarly%20to'
			}
		]
	}
];

export default operations;
