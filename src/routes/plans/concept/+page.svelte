<script lang="ts">
	// COMPONENTS -----------------------
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import SectionHeader from '$lib/components/section_header.svelte';
	import UnorderedList from '$lib/components/lists/unordered_list.svelte';
	import DropDown from '$lib/components/drop_down.svelte';

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
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<p><strong>The query planner works by:</strong></p>

	{#snippet item20()}
		Reviewing a query
	{/snippet}
	{#snippet item21()}
		Identifying the relevant tables
	{/snippet}
	{#snippet item22()}
		Identifying applicable indexes
	{/snippet}
	{#snippet item23()}
		Estimating which retrieval and processing algorithms would be most optimal
	{/snippet}
	{#snippet item24()}
		Estimating the best order to apply those algorithms
	{/snippet}
	{#snippet item25()}
		Outputting a plan-of-action for the query executor
	{/snippet}
	<NumberedList items={[item20, item21, item22, item23, item24, item25]} />

	<p>
		In my opinion, it's easier to understand why the planner exists by exploring the problems that
		encouraged its creation.
	</p>
	<p>
		This intro lists out the problems early database designers faced and then how incremental
		improvements eventually grew overtime into a full fledged planner.
	</p>
	<section class="explainer_section">
		<SectionHeader>The first table</SectionHeader>

		In this hypothetical scenario, you were tasked with creating a basic authentication system that
		outlines a person's <CodeHighlight>name</CodeHighlight>, <CodeHighlight>email</CodeHighlight>,
		and <CodeHighlight>password</CodeHighlight>:

		<div
			class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
		>
			<h5 class="mb-6 text-center text-xl font-bold text-stone-900">User table</h5>
			<table
				class="w-full border-collapse overflow-hidden rounded-lg border border-stone-200 text-left shadow-sm"
			>
				<thead class="bg-stone-100 text-xs font-semibold text-stone-500 uppercase">
					<tr>
						<th class="w-16 border-r border-b border-stone-200 px-4 py-3">ID</th>
						<th class="border-b border-stone-200 px-4 py-3">Name</th>
						<th class="border-b border-stone-200 px-4 py-3">Email</th>
						<th class="border-b border-stone-200 px-4 py-3">Password</th>
					</tr>
				</thead>
				<tbody class="bg-white font-mono text-sm">
					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">1</td>
						<td class="px-4 py-3 font-bold text-stone-800">Alex Rivers</td>
						<td class="px-4 py-3 text-stone-600">alex@demo.com</td>
						<td class="px-4 py-3 text-stone-800">password123</td>
					</tr>

					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">2</td>
						<td class="px-4 py-3 font-bold text-stone-800">Samira Khan</td>
						<td class="px-4 py-3 text-stone-600">samira@demo.com</td>
						<td class="px-4 py-3 text-stone-800">sunnyday88</td>
					</tr>

					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">3</td>
						<td class="px-4 py-3 font-bold text-stone-800">Jordan Lee</td>
						<td class="px-4 py-3 text-stone-600">jlee@demo.com</td>
						<td class="px-4 py-3 text-stone-800">letmeinnow</td>
					</tr>
				</tbody>
			</table>
		</div>

		<p>
			To keep your app simple, you decide to just keep the information in a <strong>C</strong>omma
			<strong>S</strong>eperated list/<strong>V</strong>ector (CSV):
		</p>

		<!-- prettier-ignore  -->
		<CodeBlock label='users.csv'>
ID,Name,Email,Password
1,Alex Rivers,alex@demo.com,password123
2,Samira Khan,samira@demo.com,sunnyday88
3,Jordan Lee,jlee@demo.com,letmeinnow
		</CodeBlock>

		<p>
			CPUs cannot process data on disk, only memory. Because this is explorative, for simplicity,
			you decide to just pull the entire file into RAM:
		</p>
		<CSVScan />
		<p>Once in memory, you parse the CSV and manually compare each line to find the one you want</p>
		<CSVScan3 />

		<p>
			You're initial test is dealing only with 3 rows, so this niave approach works fine. As we
			start to add complexity, you'll see how it begins to breakdown. The first issue we'll
			encounter is around memory management.
		</p>
	</section>

	<section class="explainer_section">
		<SectionHeader>Memory management tradeoffs</SectionHeader>

		<p>The CSV file currently only has 3 rows.</p>
		<p>
			What if it grows 20 million times larger? Memory becomes a bottleneck or even a failure
			hazard:
		</p>
		<CSVMemoryOverlaod />
		<p>So instead, you break the file into fixed-size chunks (A.K.A. pages). You can then:</p>
		{#snippet item1()}
			Pull some pages into memory
		{/snippet}
		{#snippet item2()}
			Scan through them
		{/snippet}
		{#snippet item3()}
			Process the data (e.g., send to terminal or aggregate)
		{/snippet}
		{#snippet item4()}
			Discard pages to make room for more
		{/snippet}
		<NumberedList items={[item1, item2, item3, item4]} />
		<MemorySwap />
		<p>An important question is: how big should these pages be?</p>
		<p>
			If the page size is too large, say 10 MB, you have to load all of it even if you only need a
			single row. That is inefficient and unacceptable.
		</p>
		<LargePage />
		<p>
			If the pagges are too small, say 0.1 KB, large reads become inefficient. Pulling in 500 MB
			would require millions of requests to disk. Each one goes through the OS and carries overhead,
			so performance suffers quickly. Tiny chunks are just as impractical.
		</p>
		<Thrashing />
		<p>
			You decide to go with 8kB chunks. In reality, this is the default and most popular page size
			for Postgres.
		</p>
		<p>
			Pages were introduced in this context to keep memory stable. But stepping slightly ahead, they
			will become foundational to the planner's logic system.
		</p>
		<p>
			They are a stable unit of overhead that we can use to compare retrieval strategies. For
			example, if one algorithm can access the needed data by scanning just 5 pages, while another
			has to examine 5 million, the first one is clearly the better choice.
		</p>
	</section>
	<section class="explainer_section">
		<SectionHeader>Initial optimization</SectionHeader>

		<h4
			class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			The limits of the machine
		</h4>
		<p>
			Let's say the CSV grows to 120 million rows and 2 GB in size. On a machine with 100 MB/s
			throughput, reading it would take at least ~20 seconds in a perfect world.
		</p>

		<p>
			In reality, you are constantly loading pages into memory, evicting others, scanning rows, and
			paying overhead from the OS and competing processes. The execution time will likely be longer.
		</p>

		<p>
			What is certain is that waiting 20+ seconds just to check whether a user exists is untenable.
		</p>
		<p>
			The machine is bounded at 100MB/s throughput, which means that the only way you can make the
			operation faster is to be more selective. You must find a way to review fewer pages.
		</p>
		<h4
			class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			Introducing the index
		</h4>
		<DropDown title="Conceptual explanation of an index">
			<p>
				When you search for the name "Luke Skywalker" in a phone book, you don't scan over every
				page. It's pre-sorted alphabetically. Instead, you just jump into the index at the back of
				the book that tells you where to find the "L" section. Then within that section, you narrow
				it down further until you get to the part with all "Lukes" with last names that start with
				"S"
			</p>
			<p>
				From there you may actually start scanning over each entry to find the <del>droids</del> person
				you're looking for, but with this strategy, you avoid the headache of looking at probably 99%
				of the pages.
			</p>
			<p>
				Adding an index to a book has a cost for the book author. They have to add extra pages that
				contain no new data, just references to the content that already exists. The utility for
				readers makes the tradeoffs worth it.
			</p>
		</DropDown>

		<p>
			To improve selectivity, you create a new file that holds an index for the <CodeHighlight
				>email</CodeHighlight
			> column. In this case, it's just a simple hash map, but you're program is able to use it to check
			if an email exists or not rapidly.
		</p>
		<Index />
		<p>
			You also append metadata to each index entry that outlines which page in <CodeHighlight
				>users.csv</CodeHighlight
			> holds the corresponding row data. That way, if you need to check the <CodeHighlight
				>ID</CodeHighlight
			> or <CodeHighlight>name</CodeHighlight> associated with the email, you can quickly pull out its
			page after scanning the index.
		</p>
		<p>
			The index itself is smaller than the main table, but it still takes up storage. Also, whenever
			an email in the main table is added or modified, you have to also update the index, too.
		</p>
		<p>
			The storage and maitenance tradeoffs, though, are worth it because it makes your most common
			operations so much faster.
		</p>
		<p>
			In Postgres one would actually use a <CodeHighlight>BTREE</CodeHighlight>, <CodeHighlight
				>HASH</CodeHighlight
			>, <CodeHighlight>GIN</CodeHighlight>... index. Certain index structures are only compatible
			with specific data types (numerics vs. strings) or operators (<CodeHighlight>=</CodeHighlight
			>, <CodeHighlight>&lt;</CodeHighlight>, <CodeHighlight>LIKE</CodeHighlight>...). You'd choose
			the right one for your data and access requirements.
		</p>
		<p>
			The main takeaway, though, it that by adding a complimentary data structure, an index, the
			program can be more selective about the pages it pulls into memory and scans.
		</p>
		<p>
			There's just one problem: how does the program know when to use one index over another or
			ignore them altogether? We can address this by adding a rudimentary planner.
		</p>
	</section>

	<section class="explainer_section">
		<SectionHeader>Adding a simple planner</SectionHeader>
		<p>
			The index is there, but it is only set up for the <CodeHighlight>email</CodeHighlight> value:
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock label='filter on email'>
-- probably should use the index
SELECT 
	*
FROM users.csv
WHERE email = 'terminator@sky.net'
		</CodeBlock>
		<p>
			If you filter on <CodeHighlight>name</CodeHighlight>, the index is useless:
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock label='filter on email'>
-- can't use the index
SELECT 
	*
FROM users.csv
WHERE name = 'IAM'
		</CodeBlock>
		<p>
			A trivial planner can just decide if an index is even good for filtering through the chunks.
			In this case, it'd just be the logic:
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock label='filter on email'>
if (filter references email)
	... use index
else 
	... don't use index
		</CodeBlock>
		<p>
			You go realize, though, that for indexes that store a copy of a column's data, you can read
			directly from it without touching the main CSV file.
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock label='filter on email'>
-- can get all the data from the index (NO NEED TO TOUCH THE TABLE)
SELECT 
	email
FROM users.csv
		</CodeBlock>
		<p>
			This <CodeHighlight>Index only Scan</CodeHighlight> is pretty useful. The index is relatively smaller
			than the <CodeHighlight>.csv</CodeHighlight>. You decide to add this logic to the planner too:
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock label='add index only scan'>
if (filter references email)
	... use index to filter down chunks

else if (only column referenced is email)
	... ignore main file. Get all data from index.csv

else 
	... don't use index. Scan main file
		</CodeBlock>
		<p>
			So far, this is working better than before. Performance is improving. Sadly, you'll see, the
			index doesn't work in all sitautions.
		</p>
	</section>
	<section class="explainer_section">
		<SectionHeader>The data distribution problem</SectionHeader>
		<p>
			The first table was successful, but now you are asked to create a new one that tracks an
			account's balance.
		</p>

		<div
			class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
		>
			<h5 class="mb-6 text-center text-xl font-bold text-stone-900">Account table</h5>
			<table
				class="w-full border-collapse overflow-hidden rounded-lg border border-stone-200 text-left shadow-sm"
			>
				<thead class="bg-stone-100 text-xs font-semibold text-stone-500 uppercase">
					<tr>
						<th class="w-16 border-r border-b border-stone-200 px-4 py-3">ID</th>
						<th class="border-b border-stone-200 px-4 py-3">balance</th>
					</tr>
				</thead>
				<tbody class="bg-white font-mono text-sm">
					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">1</td>
						<td class="px-4 py-3 font-bold text-stone-800">0</td>
					</tr>

					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">2</td>
						<td class="px-4 py-3 font-bold text-stone-800">0</td>
					</tr>

					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">3</td>
						<td class="px-4 py-3 font-bold text-stone-800">0</td>
					</tr>

					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">4</td>
						<td class="px-4 py-3 font-bold text-stone-800">0</td>
					</tr>
					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">5</td>
						<td class="px-4 py-3 font-bold text-stone-800">10,000</td>
					</tr>
					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">6</td>
						<td class="px-4 py-3 font-bold text-stone-800">0</td>
					</tr>
					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">...</td>
						<td class="px-4 py-3 font-bold text-stone-800">0</td>
					</tr>
					<tr class="border-b border-stone-100 transition-colors hover:bg-stone-50">
						<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">60,000,000</td>
						<td class="px-4 py-3 font-bold text-stone-800">0</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p>
			As before, you decide to maintain an index, targetting the balance column. However, there's an
			issue: all but one entry is <CodeHighlight>0</CodeHighlight>.
		</p>
		<p>You try to find all accounts with a balance below $500:</p>
		<!-- prettier-ignore  -->
		<CodeBlock label='balance.csv'>
SELECT 
	*
FROM balance.csv
WHERE balance &lt; 500;
		</CodeBlock>
		<p>
			Your planner's logic breaks. It ops to check the index, let's assume its 1,000 pages in size
			(8MB), but your app still needs to get the ID data from the main file. So, it takes the
			metadata in the index to cross check the relevant pages from <CodeHighlight
				>balance.csv</CodeHighlight
			>, too.
		</p>
		<p>
			Because nearly every value is below 500, the query reviewing 1,000 pages from the index, but
			on top of it, it is also cross-referencing every single page from the main csv. It would've
			been better if it just didn't use the index at all.
		</p>
		<p>
			Indexes can be counterproductive when searching for over-represented values. In those cases,
			you will check the index, but you will still then have to fetch a good bulk of pages from the
			main table anyways. You'll need a way to account for the data distribution problem.
		</p>
		<h4
			class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			Naive Solution: hard-coding
		</h4>
		<p>
			Because you're dealing with just one balance table, you decide to just modify your planner's
			logic:
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock label='add index only scan'>
if (only column referenced is balance)
	... ignore main file. Get all data from index.csv
else 
	... do not use index. Scan main file
		</CodeBlock>

		<p>
			However, overtime, values will be added, removed, and updated. You cannot trust this
			hard-coded approach when data is constantly changing.
		</p>
		<h4
			class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			The fix
		</h4>
		<p>
			To make a truly general solution, you decide that after a certain amount of entries are added
			or modified, you'll take a random sample of rows and check the distribution of data.
		</p>
		<p>
			You'll find the 100 most common values and keep them in a special reference file that is very
			small. You'll also take note of their distribution and give a uniqueness score to the table
			overall.
		</p>
		<p>
			Then, whenever a query is made, you'll check to see if the filter references one of the common
			values. If it does, you'll see how common its distribution is and then make a decision about
			whether its still worth using the index or not.
		</p>
		<p>
			If the value isn't common, enough to be in the list, then it's probably unique enough to just
			use the index anyways.
		</p>
		<p>
			You start to notice that you can actually approximate how many pages you'll need pretty well
			for each operation with these statistics.
		</p>
		<p>
			So, you create a score system for different retrieval strategies based on the amount of pages
			you'd expect each scan type to use.
		</p>
		<p>Right now, your system only has three algorithms it can work with:</p>
		<ul class="mb-10 ml-4 list-disc space-y-2">
			<li class="pl-4">
				<strong class="mb-1 block text-stone-900"> Sequential Scan </strong>
				Scan over all table pages
			</li>
			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">Index only Scan </strong>
				Scan over index pages to get the data
			</li>
			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">Index Scan </strong>
				Scan the index to identify relevant entries and their location in the main table, then fetch only
				the corresponding pages from the table instead of reading all of it.
			</li>
		</ul>
		<p>The planner is starting to become robust.</p>
	</section>
	<section class="explainer_section">
		<SectionHeader>Completion</SectionHeader>
		<p>You now have two CSV files:</p>
		<ul class="mt-2 ml-4 list-inside list-disc space-y-1 text-gray-600 [&>li>a]:underline">
			<li>Accounts</li>
			<li>Balances</li>
		</ul>
		<p>In some cases, you may want to join them together</p>
		<!-- prettier-ignore  -->
		<CodeBlock label='users.csv'>
SELECT
	id,
	balance,
	name
FROM balance
JOIN user ON 
user.id = account.id
WHERE user.name = 'John Wick';
		</CodeBlock>
		<p>
			There are different algorithms you can use to join rows just like there are algorithsm to
			fetch rows from individual tables.
		</p>
		<p>
			You modify your planner to take into account the varying join strategies, indexes, data
			distribution,... It even looks into managing sorts for you. You're taking into account edge
			cases that you come across and expand it's reasoning. Still, it's main purpose stays simple:
		</p>
		{#snippet item5()}
			Review statistics about the table
		{/snippet}
		{#snippet item6()}
			Review the available data structures to work with
		{/snippet}
		{#snippet item7()}
			Predict the overhead of using one algorithm over another
		{/snippet}
		{#snippet item8()}
			Decide on the best collection of algorithms to minimize overhead
		{/snippet}
		<NumberedList items={[item5, item6, item7, item8]} />
	</section>

	<section class="explainer_section">
		<SectionHeader>How the planner really works</SectionHeader>
		<p>
			Postgres's actual planner is more complex than the pseudo system devised for this example. It
			can decide between 21 algorithms to manage sorts, data retrieval, joins, etc. and also has a
			cost system that takes into account more than just the page size of a table.
		</p>
		<p>
			Yet, it stll fufills the same purpose outlined for the pseudo planner. It just has more
			variety of cases it needs to track. In the next sections, we'll discuss the 21 algorithms,
			then the cost system, plan interpretation, and troubleshooting.
		</p>
	</section>
</article>
