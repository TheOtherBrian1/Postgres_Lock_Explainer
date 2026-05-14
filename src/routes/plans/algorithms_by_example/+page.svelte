<script lang="ts">
	import SectionHeader from '$lib/components/section_header.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import UnorderedList from '$lib/components/lists/unordered_list.svelte';
	import NumberedList from '$lib/components/lists/numbered_list.svelte';
	import CodeBlock from '$lib/components/code_block.svelte';

	import Quote from '$lib/components/quote.svelte';

	import IndexOnly from '$lib/content/locks/animation/index_only_scan.svelte';
	import SeqScan from '$lib/content/locks/animation/seq_scan.svelte';
	import Index from '$lib/content/locks/animation/index_scan.svelte';
	import IndexBitmap from '$lib/content/locks/animation/index_bitmap.svelte';
	import BitOr from '$lib/content/locks/animation/bitor.svelte';
	import BitmapHeapScan from '$lib/content/locks/animation/bitmapheapscan.svelte';
	import Aggregation from '$lib/content/locks/animation/aggregation.svelte';
	import Groupby from '$lib/content/locks/animation/groupby.svelte';

	import NestedLoop from '$lib/content/locks/animation/nested_loop.svelte';
	import HashJoin from '$lib/content/locks/animation/hash_join.svelte';
	import MergeJoin from '$lib/content/locks/animation/merge_join.svelte';

	import hardDrive from '$lib/assets/hard_drive.jpg';
	import IntersectAndExcept from '$lib/assets/except_and_intersect.png';
	import SuperSectionHeader from '$lib/components/super_section_header.svelte';
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<!-- INTRO:------ -->
	<section class="explainer_section">
		<SectionHeader>Algorithms available to the planner</SectionHeader>
		<p>
			The planner can return up to 57 different algorithms (plus a few more if we include
			modifiers), to fetch, alter, and sort data. This section outlines them, so you can better
			interpret the query plans brought up in the following sections.
		</p>
	</section>

	<!-- SCANS:------------------------- -->
	<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
		<SuperSectionHeader>Scan Nodes</SuperSectionHeader>
		<p>
			Operations that retrieve data from indexes, tables, and table-like structures, such as
			functions that return tabular data.
		</p>
		<!-- PRIMARY SCANS:------------- -->
		<section class="explainer_section">
			<SectionHeader>Primary scans</SectionHeader>
			<p>These are the main algorithms Postgres uses to fetch data from disk:</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Sequential Scan
			</h4>
			<p>It takes all pages and manually scans them over for the relevant rows</p>
			<SeqScan />
			<p>
				A sequential scan will return the entire table with some exceptions. When a <CodeHighlight
					>LIMIT</CodeHighlight
				> condition, a sequential scan can be escaped early.
			</p>
			<p>
				Likewise, if metadata, such as a uniqueness constraint, allows the executor to determine
				that all filter satisfying values have already been accounted for, it can stop without
				scanning the entire table.
			</p>
			<p>
				Sequential scans on large tables are slow and can have a high IO overhead because of the
				amount of data that needs to be reviewed.
			</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Index Only Scan
			</h4>
			<p>
				If all the data exists within an index, Postgres can scan over just the index pages rather
				than referencing the main table. Though, it may also cross-check specific table pages
				anyways if they've been recently modified to ensure consistency.
			</p>
			<IndexOnly />
			<p>
				Indexes are specially structured for rapid lookups, so reviewing them alone is faster when
				possible.
			</p>
			<p>
				With the exception of a few specialized indexes, such as <CodeHighlight>HSNW</CodeHighlight
				>, indexes are also always more compact and smaller than their table counterparts. This
				means fewer pages need to be loaded into memory to scan over them. Another added bonus.
			</p>
			<p>
				For these reasons, the scan is generally the fastest of the primary scans and least resource
				heavy.
			</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Index Scan
			</h4>
			<p>
				If a query references multiple columns, some are indexed and others are not, it can search
				the index to find out what table pages contain the relevant rows. Then, it can just fetch
				the relevant table pages, rather than performing a full sequential scan:
			</p>
			<Index />
			<p>
				Index scans are faster than sequential scans for decently sized tables, but only when
				filtering for uncommon values (generally represent less than 5%-10% of a table).
			</p>
			<p>
				If 40% of a column just contains the value <CodeHighlight>$25</CodeHighlight> and you are only
				looking for values that are <CodeHighlight>$25</CodeHighlight> or greater, it may be faster to
				just perform a sequential scan. Otherwise, you'll have the overhead of scanning over the index,
				which will then instruct the executor to look at a large amount of table pages anyways.
			</p>
		</section>

		<!-- BITMAP SCANS:-------------- -->
		<section class="explainer_section">
			<SectionHeader>Bit Scans</SectionHeader>
			<p>
				Although this is used often enough to be considered a primary scan, like <CodeHighlight
					>Sequential Scans</CodeHighlight
				> or <CodeHighlight>Index only Scans</CodeHighlight>, they occur in a multi-step process.
				Because of their relative complexity, it's worth devoting an entire segment to them.
			</p>
			<p>The stages are:</p>
			{#snippet item7()}
				<strong>Bitmap index scan:</strong> Relevant pages are uncovered from indexes and are then ordered
				sequentially into bitmaps
			{/snippet}
			{#snippet item8()}
				<strong>Merge bitmaps:</strong> the bitmaps from each index are optionally ANDed/ORed together.
			{/snippet}
			{#snippet item9()}
				<strong>Bitmap heap scan:</strong> the single bitmap is used to fetch table pages in physical
				order.
			{/snippet}
			<NumberedList items={[item7, item8, item9]} />

			<p>
				Bitmap scans sit between sequential scans and index scans. Sequential scans read the entire
				table, which can be wasteful. Index scans can jump directly to relevant table pages, but
				often do so in a scattered, random order.
			</p>
			<p>
				Although discussed in more depth in the cost section, it's worth briefly explaining why <span
					class="italic">"scattered, random order"</span
				> matters. Historically, fetching data from disk meant waiting for a hard drive to rotate its
				read mechanism to a physical spot on disk:
			</p>
			<div class="my-4 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm md:p-6">
				<figure>
					<img class="m-auto w-auto rounded-sm shadow-sm" src={hardDrive} alt="blackhole" />
					<figcaption class="pt-2 text-center">
						<a href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg">
							Hatachi hard drive, from 2001, with visible read/write arm</a
						>
					</figcaption>
				</figure>
			</div>
			<p>
				Randomly hopping around disk imposes a time penalty, while scanning physically adjacent data
				is faster. With the proliferation of SSDs, the penalty is mostly negligible, but for legacy
				drives, it still matters.
			</p>
			<p>Reading ahead, you'll uncover how bitmaps overcome the "random hop" penalty.</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Bitmap Index Scans
			</h4>
			<p>
				Potentially relevant table pages are uncovered from an index and then added to an in-memory
				bitmap:
			</p>
			<IndexBitmap />

			<p>
				The bitmap index scan is just the first stage, but it provides 2 notable benefits over a
				regular index scan:
			</p>
			{#snippet item10()}
				<strong>Allows for sequential-like scans:</strong> The bitmap sorts the table pages sequentially.
				That way, when it is time to fetch them, the penalty for jumping around disk on hard drives is
				minimized.
			{/snippet}
			{#snippet item11()}
				<strong>Combinable:</strong> Multiple indexes can be converted into bitmaps, which can be combined.
			{/snippet}

			<NumberedList items={[item10, item11]} />
			<p>The second benefit will be explored next</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				BitmapAnd/BitmapOr
			</h4>
			<p>
				Queries may have multiple filter statements that are compatible with independent indexes:
			</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
...
WHERE
	colA LIKE 'some_word' -- has a pg_trgm GIN index
		OR
	colB >= 500; -- has a BTREE index
	</CodeBlock>
			<p>
				If multiple bitmaps are made for each index, to accommodate the filters, they can be ANDED (<CodeHighlight
					>BitmapAnd</CodeHighlight
				>) or ORED (<CodeHighlight>BitmapOR</CodeHighlight>) together:
			</p>
			<BitOr />
			<p>Once the combined map is complete, the final phase can commence.</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Bitmap Heap Scan
			</h4>
			<p>
				The final bitmap is used to sequentially fetch the corresponding pages from the main table.
				The relevant rows are then extracted and used:
			</p>
			<BitmapHeapScan />
		</section>

		<!-- PARALLEL SCANS:------------ -->
		<section class="explainer_section">
			<SectionHeader>Parallel scans</SectionHeader>
			<p>
				Identical to the primary scan types, but executed across multiple workers (processes) to
				fetch data in parallel. Enables the query to take advantage of multi-core hardware. These
				scans always appear under either:
			</p>
			{#snippet item12()}
				<strong><CodeHighlight>Gather Merge</CodeHighlight> nodes: </strong><span class="pl-2"
					>Combines results from all workers <em>while preserving sort order</em></span
				>
			{/snippet}

			{#snippet item13()}
				<strong><CodeHighlight>Gather</CodeHighlight> nodes: </strong>
				<span class="pl-2"
					>Combines results from all workers
					<em>without preserving order</em></span
				>
			{/snippet}
			<UnorderedList color="red" items={[item12, item13]} />

			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Parallel Sequential Scan
			</h4>
			<p>Sequential scan that uses multiple workers</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Parallel Index Only Scan
			</h4>
			<p>Index only scan that uses multiple workers</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Parallel Index Scan
			</h4>
			<p>Index scan that uses multiple workers</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Parallel Bitmap Heap Scan
			</h4>
			<p>Bitmap heap scan that uses multiple workers</p>
		</section>

		<!-- OBSCURE SCANS:------------- -->
		<section class="explainer_section">
			<SectionHeader>Obscure scans</SectionHeader>
			<p>
				These are scans used to review data outside the typical table structure or rely on rarely
				utilized Postgres features.
			</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Result
			</h4>
			<p>Applies to statements that just returns a constant.</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
SELECT 1;
			</CodeBlock>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Foreign Scan
			</h4>
			<p>
				Fetches data against a foreign table, defined by <a
					href="https://wiki.postgresql.org/wiki/Foreign_data_wrappers"
					class="a">foreign data wrapper</a
				>.
			</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Custom Scan
			</h4>
			<p>A non-native scan implemented by an extension.</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Function Scans
			</h4>
			<p>
				Returned when a database function, such as <CodeHighlight>generate_series()</CodeHighlight>,
				is referenced as if it were a table:
			</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
SELECT * FROM generate_series(1, 1000);
	</CodeBlock>
			<p>
				The function may be performing other operations internally, such as sequential scans, but
				these are obfuscated from the planner's output.
			</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				ProjectSet
			</h4>
			<p>
				It is used when a function that returns a set (row compatible data) is used with a <CodeHighlight
					>SELECT</CodeHighlight
				> command rather than a <CodeHighlight>SELECT ... FROM ...</CodeHighlight> command.
			</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
SELECT generate_series(1, 1000);
	</CodeBlock>

			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				CTE scans
			</h4>
			<p>
				Fetches data from a temporary table defined via a <CodeHighlight>WITH</CodeHighlight> statement:
			</p>
			<Quote>
				NOTE: the CTE must be sufficiently complex. If possible, the planner may instead opt to
				collapse it into the broader query with a different scan.
			</Quote>
			<!-- prettier-ignore  -->
			<CodeBlock>
WITH some_temp_table AS (
	SELECT id FROM generate_series(1, 1000) AS id
)
some_new_temp_table AS (
	select * FROM some_temp_table
)
SELECT * FROM some_new_temp_table;
	</CodeBlock>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Subquery Scan
			</h4>
			<p>Fetches data from a subquery that is presented as a table:</p>
			<Quote>
				NOTE: the subquery must be sufficiently complex. If possible, the planner may instead opt to
				integrate it into the broader query with a different scan.
			</Quote>
			<!-- prettier-ignore  -->
			<CodeBlock>
SELECT * FROM (
	SELECT 
		some_table1.id, 
		some_table1.name, 
		some_table1.year 
	FROM 
	some_table1 
	JOIN some_table2 ON some_table2.id = some_table1.id
);
	</CodeBlock>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				TID scan
			</h4>
			<p>
				Every row has a CTID (current tuple ID). It defines what table page a row is on and its
				relative order within the page. For instance, a tuple id of <CodeHighlight
					>(0, 5)</CodeHighlight
				> translates to "the fifth row (tuple) on the 0th page of a table".
			</p>
			<p>
				It is possible to filter for a row directly with its CTID. This will result in a TID SCAN.
			</p>
			<p>
				It is very fast, but seldomly used in practice. Beyond being incredibly obscure, CTIDs are
				temporary, possibly changing when a VACUUM runs.
			</p>
			<p>Outside of experimentation, I have only ever used this scan for data recovery.</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
			SELECT * FROM tab1 WHERE ctid = '(0, 1)'::tid;
		</CodeBlock>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Range TID scan
			</h4>
			<p>
				Same as a TID scan, but instead of looking for a specific row, you are looking for a range
				of rows.
			</p>
			<Quote>
				I know I'm breaking the fourth wall by addressing you directly, but what is wrong with you?
				Why, why would you be intrigued with TID scans of any type? Are you interested in Postgres?
				Nerd! (please contribute to the site)
			</Quote>
			<!-- prettier-ignore  -->
			<CodeBlock>
			SELECT ctid, * FROM tab1 WHERE ctid &gt;= '(0, 1)'::tid AND ctid &lt; '(1, 1)'::tid;
		</CodeBlock>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Worktable Scan
			</h4>
			<p>
				A scan on a subtable generated within a <CodeHighlight>RECURSIVE</CodeHighlight> query
			</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
EXPLAIN WITH RECURSIVE cte_name (id)
AS (
    -- anchor member
    SELECT id FROM tab1 WHERE id = 1

    UNION ALL

    -- recursive term
    SELECT t.id FROM tab1 t
    JOIN cte_name c ON t.id = c.id + 1
    WHERE t.id &lt; 5
)
SELECT * FROM cte_name;
		</CodeBlock>

			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Table Function Scan
			</h4>
			<p>
				Postgres natively supports <CodeHighlight>JSON</CodeHighlight> and <CodeHighlight
					>XML</CodeHighlight
				> data types. When one uses either the
				<a
					class="a"
					href="https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-SQLJSON-TABLE"
					>JSON_TABLE</a
				>
				or
				<a
					class="a"
					href="https://www.postgresql.org/docs/current/functions-xml.html#FUNCTIONS-XML-PROCESSING-XMLTABLE"
					>XMLTABLE</a
				>
				functions, it will result in a <CodeHighlight>Table Function Scan</CodeHighlight>.
			</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
SELECT *
FROM json_docs,
JSON_TABLE(
    payload,
    '$.users[*]'
    COLUMNS (
        name TEXT PATH '$.name',
        age  INT  PATH '$.age'
    )
) AS jt;
		</CodeBlock>

			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Sample Scan
			</h4>
			<p>
				Although the scan method was first introduced in the <a
					class="a"
					href="https://en.wikipedia.org/wiki/SQL:2003">SQL:2003 standard</a
				>, Postgres incorporated it in
				<a class="a" href="https://www.postgresql.org/docs/9.5/release-9-5.html">V09.5 in 2016</a>.
				It returns a random sample of rows from a table rather than the entire set. EnterpriseDB's
				<a class="a" href="https://www.enterprisedb.com/blog/tablesample-postgresql-95">blog</a>
				gives more detail.
				<!-- prettier-ignore  -->
				<CodeBlock>
SELECT * FROM test_table TABLESAMPLE SYSTEM (10);
		</CodeBlock>
			</p>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Named Tuplestore Scan
			</h4>
			<p>
				I included this for thoroughness, but to be honest, I'm not even sure what it is. You can
				try reading the <a
					class="a"
					href="https://github.com/postgres/postgres/blob/901ed9b352b41f034e17bc540725082a488fce31/src/backend/executor/nodeNamedtuplestorescan.c"
					>source code</a
				> if you're really determined to understand it.
			</p>
		</section>
	</div>
	<!-- JOINS: ---------------------- -->
	<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
		<SuperSectionHeader>Join-Like Nodes</SuperSectionHeader>
		<p>Enables <CodeHighlight>JOINS</CodeHighlight> or join-like operations</p>
		<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
			<section class="explainer_section">
				<SectionHeader>Join algorithms</SectionHeader>
				<p>Used to join tables together</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Nested Loop
				</h4>
				<p>
					This compares every single column value in one table to every single column value in
					another:
				</p>
				<NestedLoop />
				<p>
					This operation requires the most comparison operations of any of the join strategies, but
					doesn't require intermediary steps, such as sorting or hashing.
				</p>
				<p>
					Nested loops are often used as a fallback strategy when other options seem untenable or
					the database lacks enough statistics to make a better decision.
				</p>
				<p>
					When one input is small, such as after filtering reduces the scan output or when a <CodeHighlight
						>LIMIT</CodeHighlight
					> clause suggests to the planner that the operation may be able to escape early, the planner
					may still prefer a nested loop. This is because the total number of loops may be reduced, to
					the point where more advanced join methods may not be worth the setup overhead.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Hash Join
				</h4>
				<p>
					All the values from the first column are hashed and stored in a lookup structure. Then,
					for each value in the second column, its key is hashed and checked against that lookup to
					see if a match exists.
				</p>
				<HashJoin />
				<p>
					Hash joins are generally performant with a look up time of O(N). They're often preferred
					for small and medium sized inputs.
				</p>
				<p>
					However, the hashing process adds CPU cycles, and maintaining the lookup structure
					requires memory or disk to compensate.
				</p>
				<p>
					For these reasons they have a notable resource overhead. The planner is inclined to opt
					against the option if believes the hash table will not be able to fit into memory.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Parallel Hash Join
				</h4>
				<p>Same as Hash Join, but managed by multiple workers in parallel.</p>

				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Merge Join
				</h4>
				<p>This works when both join columns are sorted.</p>
				{#snippet item1()}
					Join columns (<CodeHighlight>COL1</CodeHighlight> and <CodeHighlight>COL2</CodeHighlight>)
					are sorted in the same order.
				{/snippet}
				{#snippet item2()}
					Compares first value in <CodeHighlight>SORTED_COL1</CodeHighlight> value to <CodeHighlight
						>SORTED_COL2</CodeHighlight
					>
				{/snippet}
				{#snippet item3()}
					If the values match, join them
				{/snippet}
				{#snippet item4()}
					If <CodeHighlight>SORTED_COL1</CodeHighlight> value is larger, check the next value in <CodeHighlight
						>SORTED_COL2</CodeHighlight
					>
				{/snippet}
				{#snippet item5()}
					If <CodeHighlight>SORTED_COL1</CodeHighlight> value is smaller, move on to the next value in
					<CodeHighlight>SORTED_COL1</CodeHighlight> and continue from the last value reviewed in <CodeHighlight
						>SORTED_COL2</CodeHighlight
					>
				{/snippet}
				<NumberedList items={[item1, item2, item3, item4]} />
				<MergeJoin />
				<p>
					Unlike <CodeHighlight>Nested Loops</CodeHighlight>, this approach avoids reviewing the
					same rows more than once. They do require both columns to be sortable and have an overhead
					for the sorting operation unless they are already pre-sorted due to a highly compatible
					index.
				</p>
				<p>
					This option is often preferred for large tables because sorting operations can spill over
					into disk more elegantly than hashes.
				</p>
			</section>
		</div>

		<!-- EXISTENCE CHECKS: ---------------------- -->
		<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
			<section class="explainer_section">
				<SectionHeader>Existence checks</SectionHeader>
				<p>
					These are usually join style algorithms used in conjunction with the <CodeHighlight
						>EXISTS</CodeHighlight
					> or <CodeHighlight>IN</CodeHighlight> operators. Instead of merging tables, it just checks
					to see if a value is present or not.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Semi Join
				</h4>
				<p>
					When one issues a query with <CodeHighlight>EXISTS</CodeHighlight> or <CodeHighlight
						>IN</CodeHighlight
					>:
				</p>
				<!-- prettier-ignore -->
				<CodeBlock>
SELECT p.title
FROM posts p
WHERE EXISTS (
    SELECT 1 FROM tags t WHERE t.tag_id = p.tag_id
)
AND p.post_id &lt; 5000;
			</CodeBlock>
				<p>
					The planner doesn't need to combine rows, but simply return a TRUE/FALSE when a join would
					normally occur.
				</p>
				<p>There are several types of Semi Joins:</p>
				<ul class="mb-10 ml-4 list-disc space-y-2">
					<li class="pl-4">Nested Loop Semi Join</li>
					<li class="pl-4">Hash Semi Join</li>
					<li class="pl-4">Parallel Hash Semi Join</li>
					<li class="pl-4">Merge Semi Join</li>
				</ul>
				<p>
					They all reflect their <CodeHighlight>JOIN</CodeHighlight> counterparts, but with less overhead.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Anti Join
				</h4>
				<p>
					Functionally identical to a <CodeHighlight>Semi Join</CodeHighlight>, but is satisfied
					when a join does not occur. Emerges when the<CodeHighlight>NOT EXISTS</CodeHighlight> and <CodeHighlight
						>NOT IN</CodeHighlight
					> operators are used.
				</p>
				<p>There are several types of Semi Joins:</p>
				<ul class="mb-10 ml-4 list-disc space-y-2">
					<li class="pl-4">Nested Loop Anti Join</li>
					<li class="pl-4">Hash Anti Join</li>
					<li class="pl-4">Parallel Hash Anti Join</li>
					<li class="pl-4">Merge Anti Join</li>
				</ul>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					SubPlan
				</h4>
				<p>
					When a subquery needs to be referenced multiple times, and the above two nodes are not
					possible, Postgres may opt to access the subquery multiple times in a loop. The SubPlan is
					not a true node, but just a way for the planner to denote that it is looping over a child
					node.
				</p>
				<p>
					SubPlans can be performant if the inner child is not expensive, but for sufficiently
					complex datasets, they are ineffecient.
				</p>
			</section>
		</div>

		<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
			<section class="explainer_section">
				<SectionHeader>Intersections and Except</SectionHeader>
				<p>
					It is possible to find out what rows are unique to a table with the <CodeHighlight
						>EXCEPT</CodeHighlight
					> command. Inversely, one can find what rows are shared between two tables with the <CodeHighlight
						>INTERSECT</CodeHighlight
					> command
				</p>
				<figure>
					<img
						class="m-auto max-h-96 w-auto rounded-sm shadow-sm"
						src={IntersectAndExcept}
						alt="blackhole"
					/>
					<figcaption class="pt-2 text-center">Intersection and Exception diagram</figcaption>
				</figure>
				<p>
					Compared to <CodeHighlight>JOINS</CodeHighlight>, which compare individual columns, these
					operations can compare entire rows.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					HashSetOp
				</h4>
				<p>
					Used with <CodeHighlight>EXCEPT</CodeHighlight> and <CodeHighlight
						>INTERSECT</CodeHighlight
					> operators. Relies on hashing to detect matching rows.
				</p>
				<!-- prettier-ignore -->
				<CodeBlock>
SELECT rows
FROM table_a
EXCEPT
SELECT rows
FROM table_b;
			</CodeBlock>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					SetOp
				</h4>
				<p>
					Used with the <CodeHighlight>EXCEPT</CodeHighlight> and
					<CodeHighlight>INTERSECT</CodeHighlight> operators. Finds rows that match with one another.
					Relies on <CodeHighlight>SORTING</CodeHighlight> to find like rows.
				</p>
				<!-- prettier-ignore -->
				<CodeBlock>
SELECT rows
FROM table_a
INTERSECT
SELECT rows
FROM table_b;
			</CodeBlock>
			</section>
		</div>
	</div>

	<!-- DATA PROCESSING -->
	<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
		<section class="explainer_section">
			<SuperSectionHeader>Data processing operations</SuperSectionHeader>
			<p>
				These perform intermidiary operations on rows before they're returned, such as caching,
				sorting, or modifying data.
			</p>

			<!-- AGGREGATE AND GROUP BY -->
			<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
				<SectionHeader>Aggregate and Group-By Nodes</SectionHeader>
				<p>
					Aggregate nodes take a collection of values from a column and produce a single result.
					There are many <a
						class="a"
						href="https://www.postgresql.org/docs/18/functions-aggregate.html"
						>aggregate functions</a
					>, including <CodeHighlight>COUNT</CodeHighlight>, <CodeHighlight>AVG</CodeHighlight>, and
					<CodeHighlight>SUM</CodeHighlight>:
				</p>
				<!-- prettier-ignore  -->
				<CodeBlock>
SELECT COUNT(id) FROM some_table;
</CodeBlock>
				<p>
					Internally, these functions review each value against a running state. For example, with <CodeHighlight
						>SUM()</CodeHighlight
					>:
				</p>
				{#snippet item14()}
					The state stores the current sum
				{/snippet}
				{#snippet item15()}
					Each value reviewed is then added to the state
				{/snippet}
				{#snippet item16()}
					Once all values from the <CodeHighlight>Scan</CodeHighlight> are processed, the final state
					is returned as the result.
				{/snippet}
				<NumberedList items={[item14, item15, item16]} />
				<Aggregation />
				<p>
					Aggregate functions are almost always combined with the <CodeHighlight
						>GROUP BY</CodeHighlight
					> clause. It bundles like values into their own collections. The database can then run an aggregate
					function on each collection rather than an entire column returned by a scan.
				</p>
				<Groupby />

				<p>
					There are several types of nodes that Postgres may use to accommodate aggregate and group
					by patterns.
				</p>

				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Aggregate
				</h4>
				<p>
					An aggregate node takes values from a scan and executes an aggregation function, such as <CodeHighlight
						>SUM</CodeHighlight
					> against it.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					HashAggregate
				</h4>

				<p>
					A hash aggregate uses the <CodeHighlight>GROUP BY</CodeHighlight> column(s) to build an in-memory
					hash table.
				</p>
				<p>As each row is processed:</p>

				{#snippet item18()}
					The <CodeHighlight>GROUP BY</CodeHighlight> values are hashed.
				{/snippet}
				{#snippet item19()}
					The hash is then fed into a hash table to find the relevant collection
				{/snippet}
				{#snippet item20()}
					If the collection doesn't exist yet, it's created
				{/snippet}
				{#snippet item21()}
					The aggregate function is then applied to the new entry and added to the respective
					collection's state.
				{/snippet}

				<NumberedList items={[item18, item19, item20, item21]} />

				<p>
					For non-sorted data this approach is relatively fast, but requires memory to maintain the
					hash table.
				</p>
				<p>
					Beyond being used with aggregates, it may also be used by <CodeHighlight
						>DISTINCT</CodeHighlight
					> and other commands that need to remove duplicate entries.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					GroupAggregate
				</h4>

				<p>
					The rows are sorted by group keys. This means that values intended for the same group will
					be adjacent to one another. Postgres can check if a row and its neighbors should belong in
					the same collection and then perform aggregation against them.
				</p>
				<p>
					The benefit of sorting is that, unlike a hash table, sorted rows can more easily be
					spilled to disk, which aids particularly large tables. If an index has already presorted
					the relevant values, this can also streamline the operation.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Partial Aggregate and Finalize Aggregate
				</h4>
				<p>
					When parallel scans are performed, a <CodeHighlight>Partial Aggregate</CodeHighlight> will run
					an aggregation against the sets from each scan.
				</p>
				<p>
					A <CodeHighlight>Gather</CodeHighlight> node will then combine the partial aggregates into a
					resulting set of values. Then a <CodeHighlight>Finalize Aggregate</CodeHighlight> will merge
					those together into a final output.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					MixedAggregate
				</h4>
				<p>placeholder</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					WindowAgg
				</h4>
				<p>placeholder</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Group
				</h4>
				<p>
					Occurs when one uses <CodeHighlight>GROUP BY</CodeHighlight> without an aggregate function.
					It just removes duplicate values from a scan node and it is equivalent to running <CodeHighlight
						>DISTINCT</CodeHighlight
					>.
				</p>
				<!-- prettier-ignore -->
				<CodeBlock>
SELECT 
	id, 
	message 
FROM some_table 
GROUP BY id, message
			</CodeBlock>
				<p>
					Internally, it requires the values to be pre-sorted. Then it just compares adjacent rows
					to see if they are duplicates or not.
				</p>
			</div>

			<!-- HASH NODES -->
			<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
				<SectionHeader>Hash Nodes</SectionHeader>

				<p>
					These nodes perform hashes to support downstream operations, such as <CodeHighlight
						>Hash Joins</CodeHighlight
					>
				</p>

				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Hash
				</h4>
				<p>
					Performs a hash against data. There isn't one hash algorithm Postgres relies on. Instead,
					it has different strategies depending on the data type.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Parallel Hash
				</h4>
				<p>Same as regular hash, but uses multiple workers to create and manage the hash table</p>
			</div>

			<!-- SORT NODES -->
			<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
				<SectionHeader>Sort Nodes</SectionHeader>

				<p>
					These nodes perform sorting, typically to support an <CodeHighlight
						>ORDER BY</CodeHighlight
					> clause or to enable downstream operations, such as <CodeHighlight>Group</CodeHighlight>,
					that depend on ordered input.
				</p>

				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Sort
				</h4>
				<p>
					In memory, Postgres will use the <a
						class="a"
						href="https://en.wikipedia.org/wiki/Quicksort">quicksort algorithm</a
					>
					or, if <CodeHighlight>LIMIT</CodeHighlight> clause is present, the
					<a class="a" href="https://en.wikipedia.org/wiki/Heapsort">top-N heapsort algorithm</a> to
					order values. For large enough entries, Postgres may opt to perform an external
					<a class="a" href="https://en.wikipedia.org/wiki/Merge_sort">merge sort</a> on disk.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Incremental Sort
				</h4>
				<p>If multiple columns are being sorted:</p>
				<!-- prettier-ignore -->
				<CodeBlock>
SELECT 
	id, 
	message 
FROM some_table 
ORDER BY id DESC, message DESC
			</CodeBlock>
				and if one or more leading columns are already ordered, for example due to an index or a previous
				operation, an incremental sort allows PostgreSQL to sort only the remaining unsorted columns.
			</div>

			<!-- GATHER -->
			<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
				<SectionHeader>Gather nodes</SectionHeader>
				<p>
					When running parallel operations (e.g. parallel scans or parallel hash joins), a gather
					node collects the values from each operation and stitches it together into a single
					output.
				</p>

				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Gather Merge
				</h4>

				<p>Combines parallel operations, but preserves sort order.</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Gather
				</h4>
				<p>Combines parallel operations, but does not preserve sort order.</p>
			</div>
		</section>

		<!-- APPEND NODES -->
		<section class="explainer_section">
			<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
				<SectionHeader>Append nodes</SectionHeader>
				<p>
					These nodes are similar to gather nodes, but instead they combine scans from <CodeHighlight
						>UNION</CodeHighlight
					> operations.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Append
				</h4>

				<p>
					Combines sets for <CodeHighlight>UNION</CodeHighlight> operations. Does not take into account
					sort order.
				</p>
				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Parallel Append
				</h4>

				<p>
					Same as <CodeHighlight>Append</CodeHighlight>, but uses multiple workers to perform the
					operation.
				</p>

				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Merge Append
				</h4>
				<p>
					Combines sets for <CodeHighlight>UNION</CodeHighlight> operations. Takes into account sort order.
				</p>

				<h4
					class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Recursive Union
				</h4>
				<p>
					Combines sets produced within <CodeHighlight>RECURSIVE</CodeHighlight> queries.
				</p>
			</div>
		</section>
		<!-- CACHING OPERATIONS -->
		<section class="explainer_section">
			<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
				<SectionHeader>Caching</SectionHeader>

				<p>
					Postgres can cache some of its results for future operations within session memory rather
					than shared memory (<CodeHighlight>Shared Buffers</CodeHighlight>) for better performance.
				</p>
				<h4
					class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Memoize
				</h4>
				<p>
					Used to optimize <CodeHighlight>Nested Loop</CodeHighlight> joins. When one side of the join
					contains a large number of duplicate values, PostgreSQL can compare against a single representative
					value instead of repeatedly evaluating every duplicate row. The duplicates are cached in session
					memory for faster reference.
				</p>
				<h4
					class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Materialize
				</h4>
				<p>
					Normally, Postgres will leave tabular data in<CodeHighlight>Shared Buffers</CodeHighlight> that
					can be referenced by other queries, too. If a return set is relatively small, Postgres can opt
					to keep a copy in session memory for faster referencing.
				</p>
			</div>
		</section>

		<!-- DATA MODIFICATION. -->
		<section class="explainer_section">
			<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
				<SectionHeader>Data Modification</SectionHeader>

				<p>Changes row data</p>
				<h4
					class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Delete
				</h4>
				<p>
					Occurs when someone runs a <CodeHighlight>DELETE</CodeHighlight> command.
				</p>
				<h4
					class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Insert
				</h4>
				<p>
					<CodeHighlight>INSERTS</CodeHighlight> new rows
				</p>
				<h4
					class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Update
				</h4>
				<p>
					Applies when someone <CodeHighlight>UPDATES</CodeHighlight> rows
				</p>
				<h4
					class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Merge
				</h4>
				<p>
					Appears when a <CodeHighlight>MERGE</CodeHighlight> command is used.
				</p>
			</div>
		</section>

		<!-- MISC. -->
		<section class="explainer_section">
			<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
				<SectionHeader>Misc</SectionHeader>

				<p>These are operations that do not fit into a specific category.</p>
				<h4
					class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					InitPlan
				</h4>
				<p>
					This is not technically a node, but a special type of modifier that is worth bringing up.
					It is a <CodeHighlight>SubPlan</CodeHighlight> that the planner is able to run only once and
					then cache. That way, when it is rereferenced in a loop, the children nodes do not need to be
					re-executed.
				</p>
				<h4
					class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					LockRows
				</h4>
				<p>
					Applies a row lock to a row. Appears when <CodeHighlight>SELECT FOR...</CodeHighlight> commands
					are used.
				</p>

				<!-- prettier-ignore -->
				<CodeBlock>
SELECT * FROM some_table FOR KEY SHARE;
			</CodeBlock>
				<p>
					<CodeHighlight>DELETE</CodeHighlight>, <CodeHighlight>MERGE</CodeHighlight>, and <CodeHighlight
						>UPDATE</CodeHighlight
					> commands will also claim row locks, but they are not reported by the planner.
				</p>

				<h4
					class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Limit
				</h4>
				<p>Allows a child node to escape early once it has returned a certain number of values.</p>
				<h4
					class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
				>
					Unique
				</h4>
				<p>
					Often used in conjunction with <CodeHighlight>DISTINCT</CodeHighlight> and <CodeHighlight
						>UNION</CodeHighlight
					> commands, it just removes duplicate rows from a scan. It requires the rows to be pre-sorted,
					so it often comes after a <CodeHighlight>Sort</CodeHighlight> node.
				</p>
				<p>
					Very similar to <CodeHighlight>Group</CodeHighlight>, but only checks the columns being
					returned by the query. The former can be instructed to review columns that will not be
					returned.
				</p>
			</div>
		</section>
	</div>
</article>
