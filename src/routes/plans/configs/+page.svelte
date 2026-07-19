<script lang="ts">
	// COMPONENTS -----------------------
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import SectionHeader from '$lib/components/section_header.svelte';
	import UnorderedList from '$lib/components/lists/unordered_list.svelte';
	import DropDown from '$lib/components/drop_down.svelte';
	import Quote from '$lib/components/quote.svelte';

	// ANIMATIONS -----------------------
	import CSVScan from '$lib/content/locks/animation/csv_scan2.svelte';
	import CSVScan3 from '$lib/content/locks/animation/csv_scan3.svelte';
	import CSVMemoryOverlaod from '$lib/content/locks/animation/csv_memory_overload.svelte';
	import NumberedList from '$lib/components/lists/numbered_list.svelte';
	import MemorySwap from '$lib/content/locks/animation/memory_swap.svelte';
	import LargePage from '$lib/content/locks/animation/large_page.svelte';
	import Index from '$lib/content/locks/animation/index.svelte';

	// IMAGES ---------------------------
	import blackhole from '$lib/assets/blackhole.webp';
	import Thrashing from '$lib/content/locks/animation/thrashing.svelte';
	import hardDrive from '$lib/assets/hard_drive.jpg';
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<Quote>
		<strong>NOTE:</strong>
		<p>
			I tried to be as thorough and accurate as possible, and, perhaps unjustified, believe this
			page to be one of the most comprehensive documents (not tools) on the Postgres planner's logic
			system.
		</p>
		<p>
			The sad reality is that this guide is incomplete. I know there must be more I do not know .
			This guide is a best effort explanation. I'm afraid that there is no living soul who has
			complete perspective over the planner's inner workings.
		</p>
	</Quote>
	<p>
		Early on, we showed what problems inspired the planner, and then outlined the available
		algorithms available to work with. Unfortunately, for the sake of thoroughness, we must now
		discuss the planner ecosystem. This consists of 5 parts:
	</p>
	{#snippet item1()}
		<strong>Planner configs:</strong> the settings you can change to modify the planner's behavior
	{/snippet}
	{#snippet item2()}
		<strong>Statistics and data structures:</strong> The approximate model Postgres has of the database
		that it uses to decide on possible algorithms
	{/snippet}

	{#snippet item3()}
		<strong>Extended Statistics:</strong> Statistics you explicitly tell Postgres to collect beyond its
		defaults.
	{/snippet}
	{#snippet item4()}
		<strong>Hardware resources:</strong> Available memory, cache, CPU, etc. for processes to utilize.
	{/snippet}
	{#snippet item5()}
		<strong>Operator quirks:</strong> plans forbidden due to security and behavioral concerns with certain
		operators and functions.
	{/snippet}
	<NumberedList items={[item1, item2, item3, item4, item5]} />
	<section class="explainer_section">
		<SectionHeader>The planner configs</SectionHeader>

		<Quote>
			<strong>NOTE</strong>: it is rare to adjust these settings casually. If the setting should be
			changed in most situations, I will make that obvious.
		</Quote>
		<div
			class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
		>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Cost Constants
			</h4>
			<!-- <p>
				Postgres measures how intensive an operation relatively. The base level of intensity is the
				act of requesting a page from the operating system. That cost is just <CodeHighlight
					>1</CodeHighlight
				>. The cost of filtering over a single row within the page is considered to be a hundredth
				the overhead of pulling a page from disk <CodeHighlight>0.01</CodeHighlight>.
			</p> -->
			<p>
				Postgres uses its statistics to predict how many rows (internally known as tuples) and pages
				each operation will review.
			</p>
			<p>
				It assigns a cost to the data it looks over. For instance, looking over a page costs 1 PG
				dollar. Meanwhile, looking over a table tuple costs 0.01 PG dollars.
			</p>
			<p>A plan that costs more is less likely to be pursued.</p>
			<p>
				The values and units are arbitary. The maintainers needed an abstract, generalizable system
				to apply across all hardware types and decided this approach was good enough. Sometimes,
				especially when you have special insight of your hardware, you should adjust these values to
				encourage the planner to take advantage of your computing advantages.
			</p>
			<p>Here are all the cost settings:</p>

			<ul class="mb-10 ml-4 list-disc space-y-2">
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> seq_page_cost </strong>

					The cost overhead of fetching a page sequentially (default 1). Used generally with
					sequential scans, index scans, or bitmap heap scans.
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> random_page_cost </strong>
					<p>
						The cost overhead of fetching a page from disk in a random order (default 4.0). Used to
						determine the overhead of using an index to find relevant pages in a table.
					</p>
					<p>
						For rotating hard drives, fetching data randomly takes longer because of the extra
						physical movement:
					</p>
					<figure class="pb-4">
						<img class="m-auto w-auto rounded-sm shadow-sm" src={hardDrive} alt="blackhole" />
						<figcaption class="pt-2 text-center">
							<a href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg">
								Hatachi hard drive, from 2001, with visible read/write arm</a
							>
						</figcaption>
					</figure>
					<p>
						Modern solid state drives (SSD) do not have the same performance penalty.<strong
							class="pl-1"
							>When using SSDs, a better default is <CodeHighlight>1.1</CodeHighlight></strong
						>
					</p>
					<p>
						It can also make sense to set the value lower when dealing with a memory rich system,
						where the OS is likely to cache data in memory rather than jumping through disk.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> cpu_tuple_cost </strong>

					The cost overhead of reviewing a row (tuple) within a table. Default is 0.01
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> cpu_index_tuple_cost </strong>

					The cost overhead of reviewing a row (tuple) within an index. Default is 0.005
				</li>

				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> cpu_operator_cost </strong>

					The cost overhead of each use of an operator to compare values, such as <CodeHighlight
						>=</CodeHighlight
					>, <CodeHighlight>&lt;=</CodeHighlight>, <CodeHighlight>&</CodeHighlight>... (default
					0.0025)
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> parallel_setup_cost </strong>

					The upfront cost of launching a another process to facilate a parallel scan (default:
					1,000)
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> parallel_tuple_cost </strong>

					The cost of transferring a scanned row from one parallel worker to another (default: 0.1)
				</li>
			</ul>
		</div>

		<div
			class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
		>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Available algorithms
			</h4>
			It's not possible to disable a scan entirely, as that may prevent the database from executing queries,
			but you can make it only use an algorithm as a last resort. By running one of the below commands,
			while substituting<em>SOME_ALGO</em> for the relevant setting, you will tell Postgres to
			assume that the operation costs <CodeHighlight>10,000,000,000</CodeHighlight>
			<!-- prettier-ignore  -->
			<CodeBlock label='quasi disable algorithm'>
-- query level:
BEGIN;
	SET LOCAL enable_SOME_ALGO TO FALSE;
	-- your queries;
COMMIT;

-- connection (session) level
SET enable_SOME_ALGO TO FALSE;

-- role level:
SET ROLE some_user enable_SOME_ALGO TO FALSE;

-- database level:
SET DATABSE some_database enable_SOME_ALGO TO FALSE;
		</CodeBlock>
			<p>Here's a list of all the values that can be set:</p>
			<p class="space-x-1">
				<CodeHighlight>enable_async_append</CodeHighlight>, <CodeHighlight
					>enable_bitmapscan</CodeHighlight
				>, <CodeHighlight>enable_gathermerge</CodeHighlight>, <CodeHighlight
					>enable_group_by_reordering</CodeHighlight
				>, <CodeHighlight>enable_hashagg</CodeHighlight>, <CodeHighlight
					>enable_hashjoin</CodeHighlight
				>, <CodeHighlight>enable_incremental_sort</CodeHighlight>, <CodeHighlight
					>enable_indexonlyscan</CodeHighlight
				>, <CodeHighlight>enable_indexscan</CodeHighlight>, <CodeHighlight
					>enable_material</CodeHighlight
				>, <CodeHighlight>enable_memoize</CodeHighlight>, <CodeHighlight
					>enable_mergejoin</CodeHighlight
				>, <CodeHighlight>enable_nestloop</CodeHighlight>, <CodeHighlight
					>enable_parallel_append</CodeHighlight
				>, <CodeHighlight>enable_parallel_hash</CodeHighlight>, <CodeHighlight
					>enable_partition_pruning</CodeHighlight
				>, <CodeHighlight>enable_partitionwise_aggregate</CodeHighlight>, <CodeHighlight
					>enable_partitionwise_join</CodeHighlight
				>, <CodeHighlight>enable_presorted_aggregate</CodeHighlight>, <CodeHighlight
					>enable_seqscan</CodeHighlight
				>, <CodeHighlight>enable_sort</CodeHighlight>, <CodeHighlight>enable_tidscan</CodeHighlight>
			</p>
			<p>
				When tuning a query, it is very common practice to disable a node type to see if the planner
				adopts a different plan. If it doesn't, then the planner cannot find a comparable node to
				rely on.
			</p>
			<p>
				If the plan does change and it is faster, you can explore ways to give the planner more
				information to make better decisions.
			</p>
		</div>
		<!-- </div> -->

		<div
			class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
		>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Threshold requirements
			</h4>
			<p>
				Because certain operations have a notable overhead, Postgres requires threshold limits to be
				met before considering them:
			</p>

			<ul class="mb-10 ml-4 list-disc space-y-2">
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> min_parallel_table_scan_size </strong>
					Minimum amount of table data to be scanned before a parallel scan is considered (default: 8MB)
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> min_parallel_index_scan_size </strong>
					<p>
						Minimum amount of index data to be scanned before a parallel scan is considered
						(default: 512kB)
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> Just In Time thresholds </strong>
					<p>
						Postgres can be compiled with a Just-in-Time compiler, which converts SQL operators into
						native machine code that can be executed seamlessly by CPUs. It speeds up a query's
						execution at the expense of planning time (and memory).
					</p>
					<p>
						When JIT is enabled, three values determine whether it will be utilized: <CodeHighlight
							>jit_above_cost</CodeHighlight
						>, <CodeHighlight>jit_inline_above_cost</CodeHighlight>, <CodeHighlight
							>jit_optimize_above_cost</CodeHighlight
						>. I included these values for thoroughness, but it extends beyond the scope of this
						site. If you want to know more, you can read the
						<a class="a" href="https://www.postgresql.org/docs/current/jit.html">Postgres docs</a>
					</p>
				</li>
			</ul>
		</div>

		<div
			class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
		>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Genetic Query Optimization
			</h4>
			<p>
				Postgres tries to exhaustively evaluate all execution plans. However, as queries reference
				more tables (or table-like structures), the number of plans grows exponentially. Once that
				complexity crosses a threshold (references 12+ table-like objects), Postgres switches to <CodeHighlight
					>Genetic Query Optimization (GEPO)</CodeHighlight
				>. It simulates a battle royale, survival of the fittest, style challenge to eliminate bad
				plans.
			</p>
			<p>
				It's a probablistic model, so it can produce bad outputs, but generally, it produces good
				enough plans without straining the system.
			</p>
			<p>Here are the configs:</p>

			<ul class="mb-10 ml-4 list-disc space-y-2">
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> geqo </strong>
					Enable GEPO (default: TRUE)
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> geqo_threshold </strong>
					<p>
						The amount of <CodeHighlight>FROM</CodeHighlight> objects that are required in a query before
						GEPO is used (Default 12). An example of qualifying objects include tables referenced in <CodeHighlight
							>JOINS</CodeHighlight
						>
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> geqo_effort </strong>
					<p>
						Determines how comprehensive GEQO will be when comparing plans. The values range from 1
						to 10 (default 5). Larger values will increase the odds of choosing a good plan, but
						will take longer to compute.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> geqo_pool_size </strong>
					<p>
						Determines the amount of competing individuals used by the genetic algorithm. By
						default, it is based on the <CodeHighlight>geqo_effort</CodeHighlight> and the number of <CodeHighlight
							>FROM</CodeHighlight
						> compatible objects. When hard-coded, values between 100 and 1,000 are good ranges.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> geqo_generations </strong>
					<p>
						Determines the amount of evolution stages the algorithm will try. By default, it is
						based on the <CodeHighlight>geqo_pool_size</CodeHighlight>, which is often ideal.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> geqo_selection_bias </strong>
					<p>
						The selective pressure within a population. The value can range from 1.5 to 2.0
						(default), with the higher value imposing greater selective pressures.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900"> geqo_seed </strong>
					<p>
						A random seed value ranging from 0 (default) to 1. Provides a starting point for the
						genetic algorithm.
					</p>
				</li>
			</ul>
		</div>
	</section>

	<section class="explainer_section">
		<SectionHeader>Statistics and data structures</SectionHeader>

		<div
			class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
		>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Data structures
			</h4>
			<p>
				From a data-structure perspective, PostgreSQL really only deals with two things: tables and
				indexes. Anything else you encounter falls into one of two categories:
			</p>
			{#snippet item9()}
				It lives outside normal query planning. For example, a foreign table uses a hard-coded scan
				strategy.
			{/snippet}
			{#snippet item10()}
				It's just a table or index in disguise. Things like partitions or materialized views are
				ultimately built on top of those same underlying structures.
			{/snippet}
			<NumberedList items={[item9, item10]} />
			<p>The dominant question for Postgres is: "when to prefer an index over a table?"</p>
			<p>First, it needs to check if an index is even viable:</p>
			{#snippet item11()}
				The query requests data that is all housed in an index?
			{/snippet}
			{#snippet item12()}
				Is the query filtering on an indexed column?
			{/snippet}
			{#snippet item13()}
				Is the filter operator compatible with the index?
			{/snippet}
			<NumberedList items={[item11, item12, item13]} />
			<p>
				If the first condition is true, or both the second and third condition are true, then an
				index can apply.
			</p>
			<p>
				Once the candidate indexes are found, Postgres needs to reference system statistics to
				estimate if the overhead of an index is tolerable.
			</p>

			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				pg_class statistics
			</h4>
			<p>
				Whenever Postgres's garbage collector (the Vacuum) runs automatically or an <CodeHighlight
					>ANALYZE</CodeHighlight
				> command is exeucted, Postgres will update its internal statistics. In some cases, certain DDL
				commands, such as <CodeHighlight>CREATE INDEX</CodeHighlight> will also refresh the statistics.
				Here are all the statistics collected:
			</p>
			<ul class="mb-10 ml-4 list-disc space-y-2">
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">reltuples</strong>

					<p>
						The <CodeHighlight>pg_class</CodeHighlight> table stores an estimate of a table/index's live
						row count. This value is updated during ANALYZE and VACUUM.
					</p>

					<p>
						If only part of the table is scanned, Postgres estimates the total row count by
						measuring the size of the rows it sampled, comparing that against the table's file size
						on disk, and scaling the count to best match the full table. Since row size can vary,
						this estimate is useful but not exact.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">relpages</strong>

					<p>
						The <CodeHighlight>pg_class</CodeHighlight> table stores an estimate of the amount of pages
						in a table/index. This value is updated during ANALYZE and VACUUM.
					</p>

					<p>
						If only part of the table is scanned, as with <CodeHighlight>reltuples</CodeHighlight
						>Postgres scales the data based on the table's file size.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">relallvisible</strong>

					<p>
						The <CodeHighlight>pg_class</CodeHighlight> table stores an estimate of pages that are visible
						to all transactions. This value is updated during ANALYZE and VACUUM.
					</p>

					<p>
						An index-only-scan is not truly index-only in some cases. If a page was recently
						modified, the index alone cannot tell if a value in the table should be visible to the
						query or hidden to accommodate version control. When a page is modified, Postgres will
						still have to reference the main table instead of just the index.
					</p>
					<p>
						Postgres will refer to an internal structure called a visibility map during execution to
						see what still be fetched from the table. The <CodeHighlight
							>relallvisible</CodeHighlight
						> value shows how many pages would need to be checked. If the ratio of compromised pages to
						all pages is relatively high, Postgres may consider an index-only-scan unworthy.
					</p>
				</li>
			</ul>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				pg_stats Statistics
			</h4>
			<p>
				Within the system catalog, postgres maintians a table called <a
					class="a"
					href="https://www.postgresql.org/docs/current/catalog-pg-statistic.html">pg_statistics</a
				>. It tracks data distribution data for each column, which the planner relies on to decide
				whether an index is optimal or not.
			</p>
			<p>
				The table itself is not formatted for human readability, but rather to be quickly accessed
				by queries. Postgres offers a <CodeHighlight>VIEW</CodeHighlight>
				<a class="a" href="https://www.postgresql.org/docs/current/view-pg-stats.html">pg_stats</a> that
				contains the same information, but is reformatted for maintainers. For better readability, I am
				going to refer to its values instead.
			</p>
			<p>
				Postgres collects distribution data by taking a random sample of rows. Specifically, it will
				collect the <CodeHighlight>default_statistics_target</CodeHighlight> setting worth of rows (100
				by default) times a constant value <CodeHighlight>300</CodeHighlight>.
			</p>
			<p>
				That means no matter the table size, by default, Postgres will sample 30,000 rows per table.
				As for why this value, it's based on insight from a 1998 paper:
				<a
					class="a"
					href="https://sigmodrecord.org/publications/sigmodRecord/9806/pdfs/276305.276343.pdf"
					>Random sampling for histogram construction: how much is enough?</a
				>. The conclusion was that table size is relatively negligible compared to size of overall
				values being tracked (100).
			</p>
			<p>To quote the Postgres maintainers:</p>
			<Quote
				source={{
					label: 'Postgres source code',
					link: 'https://github.com/postgres/postgres/blob/5cdec423193cb99b502816197395637120256f0d/src/backend/commands/analyze.c#L1980'
				}}
			>
				Note that because of the log function, the dependence on [table size] is quite weak; even at
				[table size] = 10^12, a 300*[histogram size] sample gives &lt;= 0.66 bin size error with
				probability 0.99. So there's no real need to scale for [table size], which is a good thing
				because we don't necessarily know it at this point.
			</Quote>
			<p>
				When dealing with very large tables or ones with abnormal distributions, it can make sense
				to alter the <CodeHighlight>default_statistics_target</CodeHighlight>, at the expense of
				greater <CodeHighlight>ANALYZE</CodeHighlight> penalties.
			</p>
			<p>Here are the relevant statistic values:</p>
			<ul class="mb-10 ml-4 list-disc space-y-2">
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">null_frac</strong>

					<p>
						The percentage of column entries that are <CodeHighlight>NULL</CodeHighlight>. 0 Means
						there are no <CodeHighlight>NULLS</CodeHighlight>, while 1 means there are only <CodeHighlight
							>NULLS</CodeHighlight
						>. NULLS behave atypically within Postgres. For instance, all NULLS are unique values,
						e.g. (NULL does not equal NULL), so tracking them allows the planner to make estimates
						when they're referenced in filters <CodeHighlight>WHERE val IS NOT NULL</CodeHighlight>.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">avg_width</strong>

					<p>
						The average length in bytes each entry in a column takes up. Used by the planner to
						determine the overhead of certain sort operations. To quote the source code:
					</p>
					<Quote
						source={{
							label: 'Source Code',
							link: 'https://github.com/postgres/postgres/blob/master/src/backend/optimizer/path/costsize.c'
						}}
					>
						If the total volume of data to sort is less than sort_mem, we will do an in-memory sort,
						which requires no I/O and about t*log2(t) tuple comparisons for t tuples...
					</Quote>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">n_distinct</strong>

					<p>
						The amount of distinct values in the table. When the value is positive, it is an
						estimate of the total count of distinct values. When the value is negative, it is an
						estimate of the ratio of distinct value to all values. When it is -1, the column is
						fully unique.
					</p>
					<p>
						Uniquness is used by the planner to determine the benefits of preferring indexes over
						tables. It may also be used to determine what GROUP BY algorithms to prioritize.
					</p>
				</li>

				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">most_common_vals</strong>

					<p>
						A list of the <CodeHighlight>default_statistics_target</CodeHighlight> (default 100) most
						common values found in the sample. Used to determine data distribution for indexes
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">most_common_freqs</strong>

					<p>
						Corresponds to the <CodeHighlight>most_common_vals</CodeHighlight>. Shows what
						percentage of times they show up.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">histogram_bounds</strong>

					<p>
						For columns that are compatible with the <CodeHighlight>&lt;</CodeHighlight> operator, it
						distributes values into approximately equal ranges.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">correlation</strong>

					<p>
						statistical correlation between physical row ordering and logical ordering. When the
						value is closer to -1/1, it means the data is correlated, so index scans should be
						considered because they are likely to hit fewer scattered pages in the main table.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">most_common_elems</strong>

					<p>
						Same as <CodeHighlight>most_common_vals</CodeHighlight>, but for compound data types,
						such as arrays.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">most_common_elem_freqs</strong>

					<p>
						Same as <CodeHighlight>most_common_freqs</CodeHighlight>, but for <CodeHighlight
							>most_common_elems</CodeHighlight
						>
					</p>
				</li>
			</ul>
		</div>
	</section>

	<section class="explainer_section">
		<SectionHeader>Extended Statistics</SectionHeader>
		<!-- <Quote>
			A tired Brian proceeded to cry as he realized how foolish he was to take on this project. The
			planner has never been successfully documented and now he must go through the soul crushing
			process of doing the impractical. This message was written by said tired Brian as he narrated
			himself in despair.
		</Quote> -->
		<div
			class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
		>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Placeholder
			</h4>
			<p>The planner takes take into account several memory constraints:</p>
			<ul class="mb-10 ml-4 list-disc space-y-2">
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">Placeholder</strong>
					<p>More placeholders</p>
				</li>
			</ul>
		</div>
	</section>

	<section class="explainer_section">
		<SectionHeader>Hardware Resources</SectionHeader>

		<div
			class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
		>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Available workers
			</h4>
			<p>The amount of workers (processes) Postgres can devote to parallel operations</p>
			<ul class="mb-10 ml-4 list-disc space-y-2">
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">max_parallel_workers_per_gather</strong>
					<p>
						The maximum amount of workers that a <CodeHighlight>Gather</CodeHighlight> or <CodeHighlight
							>Gather Merge</CodeHighlight
						> can request to perform sequential operations, such <CodeHighlight
							>Parallel Seq Scans</CodeHighlight
						> or <CodeHighlight>Parallel Hash</CodeHighlight>. Default is 2.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">max_worker_processes</strong>
					<p>
						The maximum amount of workers that can run at any time across the database (default is
						8).
					</p>
					<p>
						For example, if <CodeHighlight>max_worker_processes</CodeHighlight> is set to 12, then if
						two <CodeHighlight>Gather</CodeHighlight> nodes attempt to allocate 16 workers, one will have
						8, but the other will be stuck with only 4.
					</p>
				</li>
			</ul>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				Memory management
			</h4>
			<p>The planner takes take into account several memory constraints:</p>
			<ul class="mb-10 ml-4 list-disc space-y-2">
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">work_mem</strong>
					<p>
						<CodeHighlight>work_mem</CodeHighlight> determines how much memory an individual node (<CodeHighlight
							>Sequential Scan</CodeHighlight
						>, <CodeHighlight>Sort</CodeHighlight>, <CodeHighlight>Gather</CodeHighlight>...) can
						use before it switches to rely on disk to hold intermediate values. This is particularly
						relevant for deciding on sorting algorithms. When the planner believes the amount of
						data pulled cannot be sorted in memory, it will opt to perform merge sort on disk.
					</p>
					<p>
						<CodeHighlight>maintenance_work_mem</CodeHighlight> is a special variant that applies to maintenance
						operations, such as <CodeHighlight>CREATE INDEX</CodeHighlight> and <CodeHighlight
							>VACUUM</CodeHighlight
						>. It can indirectly affect query plans because it facilitates vacuum runs. If the
						vacuum fails, statistics can stale.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">hash_mem_multiplier</strong>
					<p>
						When hashing is used internally, the hash table must fit in memory. The amount of memory
						allowed is <CodeHighlight>maintenance_work_mem * hash_mem_multiplier</CodeHighlight>. If
						the planner believes the amount of unique values needed to be hashed would exceed this
						amount, it will opt for a different algorithm.
					</p>
				</li>
				<li class="pl-4">
					<strong class="mb-1 block text-stone-900">effective_cache_size</strong>
					<p>
						When Postgres requests pages the operating system may choose to cache a duplicate copy
						in memory. The <CodeHighlight>effective_cache_size</CodeHighlight> represents memory that
						the OS may be using for its own cache. The database takes into account the likelihood of fetching
						data from disk over cache when deciding on whether an index is practical. A higher <CodeHighlight
							>effective_cache_size</CodeHighlight
						>, encourages index usage.
					</p>
				</li>
			</ul>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				IO (work in progress)
			</h4>
		</div>
	</section>

	<section class="explainer_section">
		<SectionHeader>Operator quirks</SectionHeader>

		<div
			class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
		>
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				operator costs
			</h4>
			<p>
				Every single operator in postgres <CodeHighlight>=</CodeHighlight>, <CodeHighlight
					>&lt;=</CodeHighlight
				>, <CodeHighlight>LIKE</CodeHighlight>... is secretly a database function. For instance,
				when you compare two boolean values:
			</p>
			<CodeBlock>SELECT TRUE = TRUE;</CodeBlock>
			<p>
				Under-the-hood, Postgres is converting the <CodeHighlight>=</CodeHighlight> into the underlying
				database function <CodeHighlight>booleq</CodeHighlight>
			</p>
			<CodeBlock>SELECT booleq(TRUE, TRUE);</CodeBlock>
			<p>For built in operators, postgres assigns them a cost per use of 0.0025.</p>
			<p>
				Meanwhile, user defined functions inherit the cost of their underlying internals. It's
				possible to override the value just for an individual function/operator:
			</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
ALTER FUNCTION function_name(arg_types) COST new_cost;
			</CodeBlock>

			<p>
				There isn't much reason to do this unless you are contributing to the Postgres core,
				developing extensions, or experimenting, but it is worth pointing out.
			</p>
		</div>
		<h4
			class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			function volatility
		</h4>
		<p>A database function that returns a value can be:</p>
		{#snippet item6()}
			<strong>IMMUTABLE:</strong> The same input will always result in the same output between
			calls. Example: <CodeHighlight>ROUND()</CodeHighlight>.
		{/snippet}
		{#snippet item7()}
			<strong>STABLE:</strong> The same input will always result in the same output for all rows
			within a given statement. Example: <CodeHighlight>NOW()</CodeHighlight>
		{/snippet}
		{#snippet item8()}
			<strong>VOLATILE:</strong> The function can change its output every time it is called no
			matter the input. Example: <CodeHighlight>RANDOM()</CodeHighlight>.
		{/snippet}
		<NumberedList items={[item6, item7, item8]} />
		<p>You can check a function's settings by running:</p>
		<!-- prettier-ignore  -->
		<CodeBlock>
SELECT 
    proname as function_name,
    CASE provolatile
        WHEN 'i' THEN 'IMMUTABLE'
        WHEN 's' THEN 'STABLE'
        WHEN 'v' THEN 'VOLATILE'
    END as volatility
FROM pg_proc 
WHERE proname = 'function_name';----change to func name
		</CodeBlock>
		<p>
			<CodeHighlight>IMMUTABLE</CodeHighlight> functions and <CodeHighlight>STABLE</CodeHighlight> functions
			can be used with index scans.
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock>
SELECT * FROM some_table
WHERE 
	ROUND(some_num) = 10; ----- condition can be used with an index
		</CodeBlock>

		<p>
			<CodeHighlight>VOLATILE</CodeHighlight> functions will not be used with index scans because the
			planner cannot determine if data distribution is favorable ahead of time.
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock>
SELECT * FROM some_table
WHERE 
	RANDOM() = some_col; ----- index incompatible
		</CodeBlock>
		<p>
			By default, all user defined functions are <CodeHighlight>VOLATILE</CodeHighlight> unless explicitly
			configured not to be. You can update your functions by running:
		</p>

		<!-- prettier-ignore  -->
		<CodeBlock>
ALTER FUNCTION "func_name"() immutable;

ALTER FUNCTION "func_name"(int) volatile;  

ALTER FUNCTION "func_name"(int, text) stable; 
		</CodeBlock>
		<p>
			It is possible to coerce Postgres to treat a volatile function as a constant calling it in a
			subquery:
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock>
-- The RANDOM() will be called for every returned row
WHERE RANDOM() &lt; .5;

-- The RANDOM() will be called once and then cached. Index compatible
WHERE (SELECT RANDOM()) &lt; .5;
		</CodeBlock>
		<p>
			This tells the planner to use the query as an InitPlan node (cached SubPlan). Caching can
			really improve performance, not just be cause of better access to indexes, but also because
			the function doesn't need to be called as much. Just make sure it's the desired behavior
			before you incorporate it.
		</p>

		<h4
			class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			Security penalties
		</h4>
		<p>
			When using Row Level Security or <CodeHighlight>security_barrier</CodeHighlight> views, Postgres
			must prevent targetted database roles from seeing rows that fail the security conditions.
		</p>
		<p>
			Some operations/functions, though, expose values in error messages. For instance, if you try
			to use a typecast operator on an incompatible datatype, the error will reveal the offending
			value.
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock>
-- ERROR: invalid input syntax for type integer: "apple"
SELECT 'apple'::INT
		</CodeBlock>

		<p>
			Operators whose errors do not expose values nor modify data are <CodeHighlight
				>LEAKPROOF</CodeHighlight
			>. They can run in whatever order the planner considers most optimal.
		</p>
		<p>
			Meanwhile, <CodeHighlight>NOT LEAKPROOF</CodeHighlight> operators will always be executed after
			filters from Row Level Security policies have been satisfied.
		</p>
		<p>
			A <CodeHighlight>pg_trgm</CodeHighlight> GIN index on a <CodeHighlight>LIKE</CodeHighlight> condition
			might narrow the search down to just a handful of table pages.
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock>
-- define index
CREATE INDEX ON some_table USING GIN (name gin_trgm_ops);

-- LIKE filter that can be used with index
WHERE name LIKE 'Brian';
		</CodeBlock>
		<p>
			However, <CodeHighlight>LIKE</CodeHighlight> operators are marked as <CodeHighlight
				>NOT LEAKPROOF</CodeHighlight
			>
		</p>
		<p>
			If the filter was applied outside of an RLS policy, and a policy is active for the query, the
			planner will have to use a less SELECTIVE scan first. The resulting output may require more
			processing upfront and result in worse performance.
		</p>
		<p>
			Unfortunately, this is just a tradeoff that comes with security. If you have superuser access
			and using RLS throughout your database, you may want to redefine your custom database
			functions to be <CodeHighlight>LEAKPROOF</CodeHighlight> if you are believe they will not expose
			data.
		</p>
		<CodeBlock>ALTER FUNCTION some_func LEAKPROOF;</CodeBlock>
		<p>
			Alternatively, you can make your functions <CodeHighlight>SECURITY DEFINER</CodeHighlight> if RLS
			should not apply to them.
		</p>
	</section>
</article>
