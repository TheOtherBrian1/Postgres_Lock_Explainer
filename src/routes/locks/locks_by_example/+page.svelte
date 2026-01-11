<script lang="ts">
	import SectionHeader from '$lib/components/section_header.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import UnorderedList from '$lib/components/lists/unordered_list.svelte';
	import NumberedList from '$lib/components/lists/numbered_list.svelte';
	import DropDown from '$lib/components/drop_down.svelte';
	import CodeBlock from '$lib/components/code_block.svelte';
	import operations from '$lib/constants/sql_operations';
	import { tableLocks, rowLocks } from '$lib/constants/locks';

	import Quote from '$lib/components/quote.svelte';

	// Yes, I know nested sorts are not optomized. No, I don't care in this context. Judge somebody elses code
	// - signed, @theOtherBrian1, the human who wrote it!

	const getTableOps = (lockInput: string) => {
		let activeOps: string[] = [];
		for (let ops of operations) {
			for (let lock of ops.mainTableLocksClaimed) {
				if (lock === lockInput) activeOps.push(ops.operation);
			}
		}

		return activeOps;
	};
	const getRowOps = (lockInput: string) => {
		let activeOps: string[] = [];
		for (let ops of operations) {
			for (let lock of ops.mainRowLocksClaimed) {
				if (lock === lockInput) activeOps.push(ops.operation);
			}
		}

		return activeOps;
	};
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<section class="explainer_section">
		<SectionHeader>Seeing locks in action</SectionHeader>
		<p>
			If you want to follow along with the demo, instead of just reading along, you'll first need a
			Postgres DB. If you don't have one already, here are a few providers where you can quickly
			spin up one for free:
		</p>
		<DropDown title="Popular PG providers">
			{#snippet item1()}
				<a class="a" href="https://supabase.com/">Supabase</a>
			{/snippet}
			{#snippet item2()}
				<a class="a" href="https://neon.new/">Instagres</a>
			{/snippet}
			{#snippet item3()}
				<a class="a" href="https://www.thenile.dev/">Nile</a>
			{/snippet}
			{#snippet item4()}
				<a class="a" href="https://www.tigerdata.com/pricing">TigerData</a>
			{/snippet}
			{#snippet item5()}
				<a class="a" href="https://neon.com/">Neon</a>
			{/snippet}
			{#snippet item6()}
				<a class="a" href="https://www.prisma.io/postgres">Prisma</a>
			{/snippet}

			<UnorderedList color="red" items={[item1, item2, item3, item4, item5, item6]} />
		</DropDown>
		<p>
			You'll also need a Postgres interface that supports idle-in-transaction states and multiple
			sessions. Below are a list of popular options:
		</p>
		<DropDown title="Postgres interfaces">
			{#snippet item8()}
				<a class="a" href="https://www.beekeeperstudio.io/get">Beekeeper Studio Community</a> (novice
				friendly)
			{/snippet}
			{#snippet item9()}
				<a
					class="a"
					href="https://www.tigerdata.com/blog/how-to-install-psql-on-mac-ubuntu-debian-windows"
					>PSQL</a
				>
			{/snippet}
			{#snippet item10()}
				<a class="a" href="https://www.jetbrains.com/datagrip/">DataGrip</a>
			{/snippet}
			{#snippet item11()}
				<a class="a" href="https://www.pgadmin.org/">PGAdmin</a>
			{/snippet}
			{#snippet item12()}
				<a class="a" href="https://dbeaver.io/download/">DBeaver</a>
			{/snippet}
			<UnorderedList color="red" items={[item8, item9, item10, item11, item12]} />
		</DropDown>
		<div class="ml-3">
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				DEMO: ACCESS EXCLUSIVE lock
			</h4>
			<p>
				<CodeHighlight>ACCESS EXCLUSIVE</CodeHighlight> locks are the strictest locks, blocking all other
				operations. They're claimed only by commands that change table access permissions or target the
				underlying table file's structure.
			</p>
		</div>
		<div
			class="my-4 flex justify-center rounded-2xl border border-stone-100 bg-white p-4 shadow-sm md:p-6"
		>
			<iframe
				class="aspect-video max-h-[600px]
"
				src="https://www.youtube.com/embed/3kOY7pu3evs?si=7KBiQKsbj_X2fUy-"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
		</div>

		<p>To try the demo yourself:</p>
		{#snippet item14()}
			<div class="spacy-y-2 ml-3 flex w-full flex-col">
				Create a throwaway table and insert a few rows:
				<!-- prettier-ignore  -->
				<CodeBlock label='session 1'>
CREATE TABLE throwaway (id INT);
INSERT INTO throwaway (id) VALUES (1), (2), (3);
				</CodeBlock>
			</div>
		{/snippet}
		{#snippet item15()}
			<div class="spacy-y-2 ml-3 flex w-full flex-col">
				<p>
					<CodeHighlight>SELECT</CodeHighlight> from the table. You'll notice that the response comes
					back immediately
				</p>
				<!-- prettier-ignore  -->
				<CodeBlock label='session 1'>
SELECT * FROM throwaway;
			</CodeBlock>
			</div>
		{/snippet}
		{#snippet item16()}
			<div class="spacy-y-2 ml-3 flex w-full flex-col">
				<p>
					Start a transaction by running<CodeHighlight>BEGIN;</CodeHighlight>. Then <CodeHighlight
						>ALTER</CodeHighlight
					> the table. Do not <CodeHighlight>COMMIT/ROLLBACK</CodeHighlight>. That way, the
					transaction will pend.
				</p>
				<!-- prettier-ignore  -->
				<CodeBlock label='session 1'>
BEGIN;
	ALTER TABLE throwaway ADD COLUMN some_col text;
	-- do not run COMMIT/ROLLBACK
				</CodeBlock>
			</div>
		{/snippet}
		{#snippet item17()}
			<div class="spacy-y-2 ml-3 flex w-full flex-col">
				<p>
					Open another tab/session and try the original <CodeHighlight>SELECT</CodeHighlight> query. It
					will hang because there is an <CodeHighlight>ACCESS EXCLUSIVE</CodeHighlight> lock blocking
					it.
				</p>
				<!-- prettier-ignore  -->
				<CodeBlock label='session 2'>
SELECT * FROM throwaway;
				</CodeBlock>
			</div>
		{/snippet}
		<NumberedList not_p={true} items={[item14, item15, item16, item17]} />

		<!-- divider -->

		<div class="ml-3">
			<h4
				class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
			>
				DEMO: SHARE locks
			</h4>
			<p>
				<CodeHighlight>SHARE</CodeHighlight> locks are used to prevent writes while building indexes without
				the <CodeHighlight>CONCURRENTLY</CodeHighlight> modifier. However, they're also used in another
				atypical situation: protecting <CodeHighlight>UNIQUENESS</CodeHighlight>. If you try to
				create two identical entries in a <CodeHighlight>UNIQUE/PRIMARY_KEY</CodeHighlight> column, the
				first query will claim a <CodeHighlight>SHARE LOCK</CodeHighlight>. The second query will
				then wait for the first one to complete know if it can make the change itself.
			</p>
			<p>To see the lock in action:</p>
			{#snippet item18()}
				<div class="spacy-y-2 ml-3 flex w-full flex-col">
					<p>
						Create a throwaway <CodeHighlight>UNIQUE/PRIMARY_KEY</CodeHighlight> table and insert a few
						rows:
					</p>
					<!-- prettier-ignore  -->
					<CodeBlock label='session 1'>
CREATE TABLE throwaway_unique (id INT PRIMARY KEY);
INSERT INTO throwaway_unique (id) VALUES (1), (2), (3);
				</CodeBlock>
				</div>
			{/snippet}
			{#snippet item19()}
				<div class="spacy-y-2 ml-3 flex w-full flex-col">
					<p>
						Start a transaction by running<CodeHighlight>BEGIN;</CodeHighlight>. Then <CodeHighlight
							>UPDATE</CodeHighlight
						> ID 1 to 4. Do not <CodeHighlight>COMMIT/ROLLBACK</CodeHighlight>. That way, the
						transaction will pend.
					</p>
					<!-- prettier-ignore  -->
					<CodeBlock label='session 1'>
BEGIN;
	UPDATE throwaway_unique
	SET id = 3
	WHERE id = 4;
	-- do not run COMMIT/ROLLBACK
				</CodeBlock>
				</div>
			{/snippet}
			{#snippet item20()}
				<div class="spacy-y-2 ml-3 flex w-full flex-col">
					<p>Open another tab/session and try to update ID 2 to ID 5. You should have no issues.</p>
					<!-- prettier-ignore  -->
					<CodeBlock label='session 2'>
	UPDATE throwaway_unique
	SET id = 2
	WHERE id = 5;
				</CodeBlock>
				</div>
			{/snippet}
			{#snippet item21()}
				<div class="spacy-y-2 ml-3 flex w-full flex-col">
					<p>
						Now, try to update ID 3 to 4. You should be blocked by the share lock from the hung
						update query.
					</p>
					<!-- prettier-ignore  -->
					<CodeBlock label='session 2'>
	UPDATE throwaway_unique
	SET id = 3
	WHERE id = 4;
				</CodeBlock>
				</div>
			{/snippet}
			{#snippet item22()}
				<div class="spacy-y-2 ml-3 flex w-full flex-col">
					<p>
						Finally, <CodeHighlight>COMMIT</CodeHighlight> the hung query in the first session. The moment
						it completes, second one should be able to determine if it violates uniqueness or not.
					</p>
					<!-- prettier-ignore  -->
					<CodeBlock label='session 1'>
COMMIT;
				</CodeBlock>
				</div>
			{/snippet}
			<NumberedList not_p={true} items={[item18, item19, item20, item21, item22]} />
		</div>
	</section>
	<section class="explainer_section">
		<SectionHeader>Types of locks</SectionHeader>
		<p>
			It's more useful to know what commands (<CodeHighlight>SELECT</CodeHighlight>, <CodeHighlight
				>INSERT</CodeHighlight
			>...) block each other than to know what locks are used under-the-hood. For that reason, I
			created the <a class="a" href="/locks/lock_tool">Lock blocking tool</a> that just tells you what
			blocks what.
		</p>
		<p>
			However, when there are issues, monitoring tools and Postgres logs will mainly show the lock
			causing issues over the query that claimed it. To monitor and debug effectively, it's still
			useful to know what types of locks are out there and what they're intended to do.
		</p>
		<h4
			class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			Table Level Locks
		</h4>
		<p>
			These are locks taken on entire tables/indexes and persist from the statement that requested
			them until the transaction completed.
		</p>
		<Quote
			source={{
				label: 'PG Lock Docs',
				link: 'Remember that all of these lock modes are table-level locks, even if the name contains the word “row”; the names of the lock modes are historical. '
			}}
		>
			Remember that all of these lock modes are table-level locks, even if the name contains the
			word “row”; the names of the lock modes are historical
		</Quote>
		<div class="p- grid grid-cols-1 gap-4">
			{#each tableLocks as { lock, conflicts, description }}
				<div id={lock} class="  rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
					<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">
						{lock}
					</h4>
					<p
						style="text-decoration-underline: none"
						class=" p mt-2 border-none text-sm text-stone-600 no-underline"
					>
						{description}
					</p>
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-medium text-nowrap"> CLAIMS LOCK: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							{getTableOps(lock).join(', ')}
						</span>
					</div>
					<div class="flex flex-wrap items-center justify-start space-x-1 text-[10px]">
						<span class="font-medium"> BLOCKS: </span>
						{#each conflicts as conflict, i}
							<a href={`#${conflict}`}>{conflict}</a>
							{#if i !== conflicts.length - 1},
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
		<h4
			class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			Row Level Locks
		</h4>
		<p>
			These are locks taken on individual rows and persist from the time statement that requested
			them until the transaction completed.
		</p>
		<div class="p- grid grid-cols-1 gap-4">
			{#each rowLocks as { lock, conflicts, description }}
				<div id={lock} class="  rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
					<h4 class="flex items-center gap-2.5 text-lg font-bold text-stone-900">
						{lock}
					</h4>
					<p
						style="text-decoration-underline: none"
						class=" p mt-2 border-none text-sm text-stone-600 no-underline"
					>
						{description}
					</p>
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-medium text-nowrap"> CLAIMS LOCK: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							{getRowOps(lock).join(', ')}
						</span>
					</div>
					<div class="flex flex-wrap items-center justify-start space-x-1 text-[10px]">
						<span class="font-medium"> BLOCKS: </span>
						{#each conflicts as conflict, i}
							<a href={`#${conflict}`}>{conflict}</a>
							{#if i !== conflicts.length - 1},
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>
	<h4 class="mt-8 mb-4 text-right text-xl font-bold text-stone-900">
		<a href="/locks/lock_tool" class="a"
			>Next Section <span class="relative top-[1px] inline">→</span></a
		>
	</h4>
</article>
