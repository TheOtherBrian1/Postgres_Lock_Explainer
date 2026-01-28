<script lang="ts">
	// COMPONENTS -----------------------
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import SectionHeader from '$lib/components/section_header.svelte';
	import UnorderedList from '$lib/components/lists/unordered_list.svelte';

	// ANIMATIONS -----------------------
	import ConcurrencyConflicts from '$lib/content/locks/animation/concurrencyConflicts.svelte';
	import Vacuum from '$lib/content/locks/animation/vacuum.svelte';
	import LockQueue from '$lib/content/locks/animation/lockQueue.svelte';

	// IMAGES ---------------------------
	import blackhole from '$lib/assets/blackhole.webp';
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<section class="explainer_section">
		<SectionHeader>The Headaches of Concurrency</SectionHeader>

		<p>
			Unlike spreadsheets such as Excel, where usually only one person works at a time, a large
			Postgres server can orchestrate hundreds to thousands of active queries simultaneously.
		</p>
		<p>
			But this creates a problem: what if two users commission operations that are incompatible with
			each other? For example, imagine one user is deleting a row:
		</p>

		<CodeBlock label="writer">DELETE FROM actors WHERE row_id = 1;</CodeBlock>

		<p>While someone is reading from it:</p>

		<CodeBlock label="reader">SELECT name FROM actors WHERE row_id = 1;</CodeBlock>

		<p>
			If the <CodeHighlight>DELETE</CodeHighlight> is still in progress when the
			<CodeHighlight>SELECT</CodeHighlight> runs, the reader could end up with partially removed data.
		</p>
		<p>
			For example, if the row contained the name “Bob Odenkirk,” the query might return only “kirk”
			if part of the row had already been removed.
		</p>
		<ConcurrencyConflicts />

		<p>
			Depending on the competing operations, varying strategies are used to prevent data
			inconsistencies. The main scenarios are:
		</p>
		{#snippet item1()}
			<span
				><strong class="text-stone-900">Reader + Reader:</strong> No conflict, so no special handling
				is needed.</span
			>
		{/snippet}
		{#snippet item2()}
			<span
				><strong class="text-stone-900">Reader + Writer:</strong> Handled with data redundancy (MVCC).</span
			>
		{/snippet}
		{#snippet item3()}
			<span
				><strong class="text-stone-900">Writer + Writer:</strong> Handled with
				<em class="text-stone-900">locks</em>.</span
			>
		{/snippet}
		{#snippet item4()}
			<span
				><strong class="text-stone-900">Altering table behavior:</strong> Handled with
				<em class="text-stone-900">locks</em>.</span
			>
		{/snippet}
		<UnorderedList items={[item1, item2, item3, item4]} />
	</section>
	<section class="explainer_section">
		<SectionHeader>Reader + Reader Scenario</SectionHeader>

		<p>
			Read operations don't modify data, so they pose no risk to integrity. Two agents can read the
			same data without any special handling.
		</p>
		<!-- prettier-ignore  -->
		<CodeBlock>
-- agent 1: doesn't interfere with agent 2 
SELECT name FROM actors WHERE row_id = 1; 

-- agent 2: doesn't interfere with agent 1 
SELECT name FROM actors WHERE row_id = 1;
		</CodeBlock>
	</section>
	<section class="explainer_section">
		<SectionHeader>Reader + Writer Scenario</SectionHeader>
		<p>
			To handle conflicts between read requests <CodeHighlight>SELECT</CodeHighlight> and a data modification
			requests (<CodeHighlight>UPDATES</CodeHighlight>, <CodeHighlight>DELETES</CodeHighlight>, <CodeHighlight
				>INSERTS</CodeHighlight
			>...) Postgres uses a technique called
			<code class="font-medium">Multi-View-Concurrency-Control</code> (<abbr>MVCC</abbr>). This
			means Postgres creates different "versions" of the data so reads and writes don't get in each
			other's way.
		</p>
		<p>The way this is handled depends on the operation:</p>

		{#snippet item5()}
			<div class="ml-3">
				<strong class="mb-1 block text-stone-900">DELETE</strong>
				When a row is deleted, Postgres doesn't remove it immediately. Current readers can still see it,
				but future queries treat it as if it were gone. Later, a background process called the vacuum
				(Postgres's garbage collector) actually removes the row when the original readers no longer reference it.
			</div>
		{/snippet}
		{#snippet item6()}
			<div class="ml-3">
				<strong class="mb-1 block text-stone-900">UPDATE</strong>
				When a row is updated, Postgres doesn't change it in place. It marks the old version for existing
				readers, creates a copy with the relevant changes, and finally marks the copy as the new version
				for future queries. As with <CodeHighlight>DELETEs</CodeHighlight>, when the old version of
				a row is no longer needed, the vacuum is allowed to remove it.
			</div>
		{/snippet}
		{#snippet item7()}
			<div class="ml-3">
				<strong class="mb-1 block text-stone-900">INSERT</strong>
				When a new row is added, current readers ignore it, but future read queries are able to interact
				with it.
			</div>
		{/snippet}
		<UnorderedList items={[item5, item6, item7]} />
		<Vacuum />

		<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">MVCC Tradeoffs</h4>

		{#snippet item8()}
			<strong>Creates redundant data</strong>: To handle some operations, MVCC needs to hold
			multiple versions of the same row: old ones for ongoing reads, and new ones for updates. Even
			after the operations complete, the old versions will stay around until the vacuum clears them
			from disk. This means that MVCC has a storage penalty.
		{/snippet}
		{#snippet item9()}
			<strong>Requires a garbage collector</strong>: Postgres's garbage collector, the vacuum, runs
			whenever a certain amount of bloat accumulates or when a set amount of time passes. When it
			does run, depending on the bloat burden, it can stress system resources.
		{/snippet}
		<div class="ml-3">
			<UnorderedList color="red" items={[item8, item9]} />
		</div>
		<p>
			Despite the extra storage and maintenance required, MVCC is still worth the trade-offs. So
			much so, that Oracle, MongoDB, Postgres, etc. adopted it to accommodate parallelism.
		</p>
		<p>
			Newer, more performant versions of MVCC, are being explored for Postgres. For instance, <a
				class="a"
				href="https://www.orioledb.com/">OrioleDB</a
			>, an experimental extension, modifies the storage engine so that the vacuum is no longer
			necessary.
		</p>
	</section>
	<section class="explainer_section">
		<SectionHeader>Writer + Writer Scenario</SectionHeader>
		<p>
			When operations can't safely happen at the same time, databases create a waiting line: just
			like people queuing for a bathroom.
		</p>

		<div class="mt-10 mb-8 rounded-xl border border-stone-100 bg-stone-50 p-6">
			<LockQueue />
		</div>

		<p class="mb-2 font-bold text-stone-900">With locks:</p>

		{#snippet item10()}
			A transaction "locks the door" on the data it's modifying
		{/snippet}
		{#snippet item11()}
			Other transactions check if the data is available
		{/snippet}
		{#snippet item12()}
			If it's locked, they wait in line
		{/snippet}
		{#snippet item13()}
			When the first transaction finishes, the next one in queue gets access
		{/snippet}
		<div class="ml-6">
			<UnorderedList color="red" items={[item10, item11, item12, item13]} />
		</div>
		<p>
			Postgres uses different locks for different operations, each blocking only what's necessary to
			keep data safe while letting other queries run.
		</p>
		<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Lock tradeoffs</h4>

		{#snippet item14()}
			<strong>Stalls requests</strong>: If a slow query holds up the queue or the line becomes too
			long, requests will return more slowly or may even timeout.
		{/snippet}
		<div class="ml-6">
			<UnorderedList color="red" items={[item14]} />
		</div>
	</section>
	<section>
		<SectionHeader>Locks: Altering table behavior</SectionHeader>
		<p>Just like Word documents, MP4s, and PNGs, Postgres tables are stored as ordinary files.</p>
		<!-- prettier-ignore  -->
		<CodeBlock label="Find Table File">
-- shows you where the table lives on disk 
SELECT pg_relation_filepath('table_name');
		</CodeBlock>

		<p>
			Postgres has full freedom to delete, overwrite, and modify their access permissions and
			formatting.
		</p>

		<p>
			Operations, such as <CodeHighlight>DROP</CodeHighlight>, <CodeHighlight>ALTER</CodeHighlight>, <CodeHighlight
				>CREATE</CodeHighlight
			>, change the nature of the file.
		</p>

		<p>
			When they are initiated, Postgres can't know if the table file will be available for queries
			until the transaction completes. Interacting with a file in an unknown state would be like
			interacting with a blackhole.
		</p>

		<div class="my-4 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm md:p-6">
			<img class="m-auto w-auto rounded-sm shadow-sm" src={blackhole} alt="blackhole" />
		</div>
		<p>Reads would be searching the void and writes would be lost forever.</p>

		<p>
			So file altering commands require the strictest locks. Although there are some exceptions,
			they generally will take the table offline or lock out all write operations.
		</p>

		<p>
			Some commands may not be as destructive to the underlying file, but they still change access
			rules or data formatting. For instance <CodeHighlight>ALTER TABLE...</CodeHighlight> commands may
			make a table inaccessible to certain users or modify data types.
		</p>
		<p>
			A query running while these commands execute can't adapt to the new table structure
			mid-flight. It's like reading a book in English that suddenly switches to Korean, or an online
			article that suddenly becomes paywalled three-quarters of the way through. So, queries are
			still blocked by them.
		</p>
		<p>
			On large tables, maintenance operations can be time consuming, so the harsh locks become
			disruptive. There are a few clever strategies to get around this, that I discuss in parts of
			the <a href="/locks/troubleshooting" class="a">troubleshooting section</a>.
		</p>
		<h4 class="mt-8 mb-4 text-right text-xl font-bold text-stone-900">
			<a href="/locks/locks_by_example" class="a"
				>Next Section <span class="relative top-[1px] inline">→</span></a
			>
		</h4>
	</section>
</article>
