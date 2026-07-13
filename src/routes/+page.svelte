<script lang="ts">
	import Tool from '$lib/assets/Tool.gif';
	import SectionHeader from '$lib/components/section_header.svelte';
	import NumberedList from '$lib/components/lists/numbered_list.svelte';
	import UnorderedList from '$lib/components/lists/unordered_list.svelte';

	import TrivialCase from '$lib/content/locks/animation/trivial_case.svelte';
	// const sections = [
	//  {
	//      link: '/locks/concept',
	//      title: 'Concept',
	//      blurb:
	//          'Basic concepts of locks and how they work in Postgres. I tried to make it more digestible with animations.'
	//  },
	//  {
	//      link: '/locks/locks_by_example',
	//      title: 'Locks By Example',
	//      blurb: 'Outlines table locks and provides a few demoes one can run to see them in action.'
	//  },
	//  {
	//      link: '/locks/lock_tool',
	//      title: 'Lock Blocking Graph',
	//      blurb: 'Interactive tool that shows what SQL operations lock out each other.',
	//      img: {
	//          src: Tool,
	//          alt: 'Lock Blocking Graph'
	//      }
	//  },
	//  {
	//      link: '/locks/troubleshooting',
	//      title: 'Troubleshooting',
	//      blurb: 'Lock problems and how to identify and resolve them.'
	//  },
	//  {
	//      link: '/locks/monitoring',
	//      title: 'Monitoring',
	//      blurb: 'Reviews of popular monitoring tools, as well as some homegrown solutions.'
	//  }
	// ];
	import blackhole from '$lib/assets/blackhole.webp';
	import lock_wizard from '$lib/assets/lock_wizard.png';
	import indecision from '$lib/assets/indecision.png';
	import slack from '$lib/assets/slack.png';
	import memory from '$lib/assets/memory.png';
	import cpu from '$lib/assets/cpu.png';
	import disk from '$lib/assets/disk.png';
	import iceberg from '$lib/assets/iceberg.jpeg';
	import elephant_angry from '$lib/assets/elephant_angry.png';
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import ReadRead from '$lib/content/locks/animation/read_read.svelte';
	import ReaderWriter from '$lib/content/locks/animation/reader_writer.svelte';
	import Update from '$lib/content/locks/animation/update.svelte';
	import Delete from '$lib/content/locks/animation/delete.svelte';
	import Insert from '$lib/content/locks/animation/insert.svelte';
	import LockQueue from '$lib/content/locks/animation/lockQueue.svelte';
	import Crash from '$lib/content/locks/animation/crash.svelte';
	import squawkhq from '$lib/assets/squakhq.png';
	import squawkhq2 from '$lib/assets/squawkhq2.png';
</script>

<article
	class="mx-auto mb-10 max-w-[1400px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<section
		tabindex="1"
		class="explainer mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader>Postgres Locks: Demystified</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">
			Literally everything to know about Postgres Locks
		</h4>
		<div
			class="mx-4 flex items-center justify-center rounded-md border border-stone-900 bg-stone-950 p-4 px-4 shadow-sm md:p-6"
		>
			<img
				class="h-auto max-h-[60vh] w-auto max-w-full rounded-sm object-contain shadow-sm"
				src={lock_wizard}
				alt="blackhole"
			/>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">The Ignorance Tax</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">How to ruin a good tool</h4>
		<div class="grid items-center gap-8 px-4 md:grid-cols-2">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>Adopt tech</li>
				<li>Lack depth to configure</li>
				<li>Overspend, migrate, or tolerate poor performance</li>
			</ul>
			<div
				class="flex w-full justify-center rounded-2xl border border-stone-900 bg-white p-4 shadow-sm md:p-6"
			>
				<figure class="w-full max-w-md">
					<img
						class="h-auto w-full rounded-sm object-contain shadow-sm"
						src={indecision}
						alt="blackhole"
					/>
					<figcaption class="pt-2 text-center">
						<a
							href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
							class="text-xs text-stone-400 hover:underline"
						>
							Indecision Map</a
						>
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="grid items-center gap-8 px-4 md:grid-cols-2">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<div
				class="flex justify-center rounded-md border border-stone-900 bg-stone-950 p-4 shadow-sm md:p-6"
			>
				<img
					class="h-auto w-full max-w-md rounded-sm object-contain shadow-sm"
					src={slack}
					alt="blackhole"
				/>
			</div>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="grid items-center gap-8 px-4 md:grid-cols-2">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<div class="flex w-full justify-center">
				<figure class="w-full max-w-md">
					<img
						class="h-auto w-full rounded-sm object-contain shadow-sm"
						src={cpu}
						alt="blackhole"
					/>
					<figcaption class="pt-2 text-center text-sm">
						<a
							class="text-xs text-stone-400 hover:underline"
							href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
						>
							CPU usage</a
						>
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="grid items-center gap-8 px-4 md:grid-cols-2">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<div class="flex w-full justify-center">
				<figure class="w-full max-w-md">
					<img
						class="h-auto w-full rounded-sm object-contain shadow-sm"
						src={memory}
						alt="blackhole"
					/>
					<figcaption class="pt-2 text-center text-sm">
						<a
							class="text-xs text-stone-400 hover:underline"
							href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
						>
							memory undercommitted</a
						>
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="grid items-center gap-8 px-4 md:grid-cols-2">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<div class="flex w-full justify-center">
				<figure class="w-full max-w-md">
					<img
						class="h-auto w-full rounded-sm object-contain shadow-sm"
						src={disk}
						alt="blackhole"
					/>
					<figcaption class="pt-2 text-center text-sm">
						<a
							class="text-xs text-stone-400 hover:underline"
							href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
						>
							Disk not near capacity</a
						>
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">The Postgres Iceberg</SectionHeader>
		<div class="flex justify-center p-4">
			<figure class="w-full max-w-2xl">
				<img
					class="h-auto w-full rounded-sm object-contain shadow-sm"
					src={iceberg}
					alt="blackhole"
				/>
				<figcaption class="pt-2 text-center text-sm">
					<a
						class="text-xs text-stone-400 hover:underline"
						href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
					>
						Postgres Iceberg Meme</a
					>
				</figcaption>
			</figure>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="grid items-center gap-8 px-4 md:grid-cols-2">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<div
				class="flex justify-center rounded-md border border-stone-900 bg-stone-950 p-4 shadow-sm md:p-6"
			>
				<img
					class="h-auto w-full max-w-md rounded-sm object-contain shadow-sm"
					src={slack}
					alt="blackhole"
				/>
			</div>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="grid items-center gap-8 px-4 md:grid-cols-2">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<div class="w-full overflow-x-auto">
				<figure class="w-full">
					<CodeBlock>
						SELECT blocked.pid AS blocked_pid, blocked.usename AS blocked_user, blocked.query AS
						blocked_query, blocked.state AS blocked_state, NOW() - blocked.query_start AS
						blocked_duration, ...
					</CodeBlock>
					<figcaption class="pt-2 text-center text-sm">
						<a
							class="text-xs text-stone-400 hover:underline"
							href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
						>
							Lock detection query</a
						>
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="grid items-center gap-8 px-4 md:grid-cols-2">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<div class="w-full overflow-x-auto">
				<figure class="w-full">
					<CodeBlock>
						select pg_terminate_backend(pid) from pg_stat_activity where pid =
						"blocking_connection_process"
					</CodeBlock>
					<figcaption class="pt-2 text-center text-sm">
						<a
							class="text-xs text-stone-400 hover:underline"
							href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
						>
							Kill connection</a
						>
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Problem solved?</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Questions of terror</h4>
		<div class="max-w-2xl px-4">
			<ul class="list-disc space-y-4 pl-6 text-xl marker:text-[#ff3e00]">
				<li>Locks?</li>
				<li>Why do they exist?</li>
				<li>When can they harm our database?</li>
				<li>How can we monitor for problems?</li>
				<li>And what paths do we have to troubleshoot and correct?</li>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">The real problem</SectionHeader>
		<div class="grid items-center gap-8 px-4 md:grid-cols-2">
			<ul class="list-disc space-y-4 pl-6 text-xl marker:text-[#ff3e00]">
				<li>Communication</li>
				<li>Observability</li>
			</ul>
			<div class="flex w-full justify-center">
				<figure class="w-full max-w-md">
					<img
						class="h-auto w-full rounded-sm object-contain shadow-sm"
						src={elephant_angry}
						alt="blackhole"
					/>
					<figcaption class="pt-2 text-center text-sm">
						<a
							class="text-xs text-stone-400 hover:underline"
							href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
						>
							communication shouldn't intimidate</a
						>
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Really solving the problem</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Questions of terror</h4>
		<div class="max-w-2xl px-4">
			<ul class="list-disc space-y-4 pl-6 text-xl marker:text-[#ff3e00]">
				<li>Locks?</li>
				<li>Why do they exist?</li>
				<li>When can they harm our database?</li>
				<li>How can we monitor for problems?</li>
				<li>And what paths do we have to troubleshoot and correct?</li>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Locks? Why do they exist?</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="max-w-3xl px-4">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>
					Some commands (<CodeHighlight>SELECT</CodeHighlight>, <CodeHighlight>INSERT</CodeHighlight
					>, <CodeHighlight>ALTER</CodeHighlight>) conflict
				</li>
				<li>Overlapping, conflicting commands cause:</li>
				<ul class="mt-2 list-disc space-y-2 pl-6 marker:text-[#ff3e00]">
					<li>DB failure</li>
					<li>Consistency violation</li>
					<li>Data corruption</li>
				</ul>
				<li>Locks queue conflicting operations, so they do not overlap</li>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Reviewing conflicts</SectionHeader>
		<div class="max-w-2xl px-4">
			{#snippet item5()}
				<span class="text-lg"
					><strong class="text-stone-800">Single Session:</strong> No conflicts</span
				>
			{/snippet}
			{#snippet item1()}
				<span class="text-lg"
					><strong class="text-stone-800">Reader + Reader:</strong> No conflicts</span
				>
			{/snippet}
			{#snippet item2()}
				<span class="text-lg"
					><strong class="text-stone-800">Reader + Writer:</strong> Handled with row versioning (MVCC)</span
				>
			{/snippet}
			{#snippet item3()}
				<span class="text-lg"
					><strong class="text-stone-800">Writer + Writer:</strong> Handled with locks</span
				>
			{/snippet}
			{#snippet item4()}
				<span class="text-lg"
					><strong class="text-stone-800">Maintenance + Anything:</strong> Handled with locks</span
				>
			{/snippet}
			<UnorderedList items={[item5, item1, item2, item3, item4]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Single Session</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">No conflicts</h4>
		<div class="flex w-full justify-center p-4">
			<TrivialCase />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Read + Read</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">No conflicts</h4>
		<div class="flex w-full justify-center p-4">
			<ReadRead />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Read + Write</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">No conflicts</h4>
		<div class="flex w-full justify-center p-4">
			<ReaderWriter />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Should locks solve this problem?</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Locking sequence</h4>
		<div class="max-w-xl px-4">
			{#snippet item14()}
				<span class="text-lg">Reader engages</span>
			{/snippet}
			{#snippet item15()}
				<span class="text-lg">Write waits</span>
			{/snippet}
			{#snippet item16()}
				<span class="text-lg">Reader finishes</span>
			{/snippet}
			{#snippet item17()}
				<span class="text-lg">Write starts</span>
			{/snippet}
			<NumberedList items={[item14, item15, item16, item17]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Multi-View-Concurrency Control: better approach</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Multiple row versions</h4>
		<div class="max-w-2xl px-4">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>Writers don't overwrite rows</li>
				<li>They instead make versions of them</li>
				<li>Each transaction sees its own view of rows</li>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">MVCC: Updates</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Multiple row versions</h4>
		<div class="flex w-full justify-center p-4">
			<Update />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">MVCC: Deletes</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Multiple row versions</h4>
		<div class="flex w-full justify-center p-4">
			<Delete />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">MVCC: Deletes</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Multiple row versions</h4>
		<div class="flex w-full justify-center p-4">
			<Insert />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Tradeoffs of MVCC</SectionHeader>
		<div class="max-w-2xl px-4">
			{#snippet item14()}
				<span class="text-lg">Stale rows (bloat) temporarily take up space</span>
			{/snippet}
			{#snippet item15()}
				<span class="text-lg">Requires a garbage collector to remove stale rows</span>
			{/snippet}
			{#snippet item16()}
				<span class="text-lg"
					>Write amplification: rewriting rows/states across tables and indexes</span
				>
			{/snippet}
			<NumberedList items={[item14, item15, item16]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Write + Write</SectionHeader>
		<div class="flex w-full justify-center p-4">
			<LockQueue />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Maintenance + everything</SectionHeader>
		<div class="flex w-full justify-center p-4">
			<Crash />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Managing locking</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="max-w-2xl px-4">
			<ul class="list-disc space-y-4 pl-6 text-lg marker:text-[#ff3e00]">
				<li>We'll go over all 8 table locks</li>
				<li>Review all 4 row locks</li>
				<li>Discuss the conflicts they create</li>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Table locks: Access Share</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="max-w-3xl px-4">
			<ul class="list-disc space-y-4 pl-6 marker:text-[#ff3e00]">
				<li class="text-lg">Most common lock</li>
				<div class="w-full rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> CLAIMS LOCK: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis"> SELECT </span>
					</div>
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING LOCKS: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							ACCESS EXCLUSIVE
						</span>
					</div>
					<div class="group relative mt-2 mb-2 flex flex-col space-y-2 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING OPERATIONS: </span>
						<span class="w-full text-xs whitespace-normal">
							ALTER TABLE DETACH PARTITION, DROP TABLE, TRUNCATE, REINDEX, CLUSTER, VACUUM FULL,
							REFRESH MATERIALIZED VIEW (sans CONCURRENTLY), ALTER INDEX (general), ALTER TABLE
							(general), LOCK TABLE
						</span>
					</div>
				</div>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Blocking Live!</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="w-full max-w-3xl px-4">
			{#snippet item14()}
				<div class="mb-4 ml-3 flex w-full flex-col space-y-2">
					<span>Create a throwaway table and insert a few rows:</span>
					<div class="w-full overflow-x-auto">
						<CodeBlock label="session 1">
							CREATE TABLE throwaway (id INT); INSERT INTO throwaway (id) VALUES (1), (2), (3);
						</CodeBlock>
					</div>
				</div>
			{/snippet}
			{#snippet item15()}
				<div class="ml-3 flex w-full flex-col space-y-2">
					<p>
						<CodeHighlight>SELECT</CodeHighlight> from the table. You'll notice that the response comes
						back immediately
					</p>
					<div class="w-full overflow-x-auto">
						<CodeBlock label="session 1">SELECT * FROM throwaway;</CodeBlock>
					</div>
				</div>
			{/snippet}

			<NumberedList not_p={true} items={[item14, item15]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Blocking Live! Cont.</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="w-full max-w-3xl px-4">
			{#snippet item16()}
				<div class="mb-4 ml-3 flex w-full flex-col space-y-2">
					<p>
						Start a transaction by running <CodeHighlight>BEGIN;</CodeHighlight>. Then <CodeHighlight
							>ALTER</CodeHighlight
						> the table. Do not <CodeHighlight>COMMIT/ROLLBACK</CodeHighlight>. That way, the
						transaction will pend.
					</p>
					<div class="w-full overflow-x-auto">
						<CodeBlock label="session 1">
							BEGIN; ALTER TABLE throwaway ADD COLUMN some_col text; -- do not run COMMIT/ROLLBACK
						</CodeBlock>
					</div>
				</div>
			{/snippet}
			{#snippet item17()}
				<div class="ml-3 flex w-full flex-col space-y-2">
					<p>
						Open another tab/session and try the original <CodeHighlight>SELECT</CodeHighlight> query.
						It will hang because there is an <CodeHighlight>ACCESS EXCLUSIVE</CodeHighlight> lock blocking
						it.
					</p>
					<div class="w-full overflow-x-auto">
						<CodeBlock label="session 2">SELECT * FROM throwaway;</CodeBlock>
					</div>
				</div>
			{/snippet}

			<NumberedList offset={2} not_p={true} items={[item16, item17]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Blocking Live! Cont.</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="w-full max-w-3xl px-4">
			{#snippet item16()}
				<div class="mb-4 ml-3 flex w-full flex-col space-y-2">
					<p>
						Start a transaction by running <CodeHighlight>BEGIN;</CodeHighlight>. Then <CodeHighlight
							>ALTER</CodeHighlight
						> the table. Do not <CodeHighlight>COMMIT/ROLLBACK</CodeHighlight>. That way, the
						transaction will pend.
					</p>
					<div class="w-full overflow-x-auto">
						<CodeBlock label="session 1">
							BEGIN; ALTER TABLE throwaway ADD COLUMN some_col text; -- do not run COMMIT/ROLLBACK
						</CodeBlock>
					</div>
				</div>
			{/snippet}
			{#snippet item17()}
				<div class="ml-3 flex w-full flex-col space-y-2">
					<p>
						Open another tab/session and try the original <CodeHighlight>SELECT</CodeHighlight> query.
						It will hang because there is an <CodeHighlight>ACCESS EXCLUSIVE</CodeHighlight> lock blocking
						it.
					</p>
					<div class="w-full overflow-x-auto">
						<CodeBlock label="session 2">SELECT * FROM throwaway;</CodeBlock>
					</div>
				</div>
			{/snippet}

			<NumberedList offset={2} not_p={true} items={[item16, item17]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Observing locks</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="w-full max-w-3xl px-4">
			{#snippet item16()}
				<div class="mb-4 ml-3 flex w-full flex-col space-y-2">
					<p>
						Check <CodeHighlight>pg_stat_activity</CodeHighlight> for blocked sessions
					</p>
					<div class="w-full overflow-x-auto">
						<CodeBlock label="session 3">
							SELECT pid, wait_event_type, wait_event, state, query FROM pg_stat_activity WHERE
							wait_event_type = 'Lock';
						</CodeBlock>
					</div>
				</div>
			{/snippet}
			{#snippet item17()}
				<div class="ml-3 flex w-full flex-col space-y-2">
					<p>
						Give <CodeHighlight>pg_blocking_pids(int)</CodeHighlight> The blocked process ID to see its
						blocker and how long it's been blocked
					</p>
					<div class="w-full overflow-x-auto">
						<CodeBlock label="session 2">
							SELECT -- pg_stat_activity psa.pid, psa.wait_event_type, psa.wait_event, psa.state,
							psa.query, -- pg_locks pl.locktype, pl.relation::regclass, pl.tuple, pl.mode AS
							lock_name, pl.granted AS is_waiting, pl.waitstart AS time_waiting FROM
							pg_stat_activity psa JOIN pg_locks pl ON pl.pid = psa.pid --&lt;--- joined by process
							id WHERE psa.pid = ANY (pg_blocking_pids(/*PID*/));
						</CodeBlock>
					</div>
				</div>
			{/snippet}

			<NumberedList offset={4} not_p={true} items={[item16, item17]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Observing locks</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="w-full max-w-3xl px-4">
			{#snippet item17()}
				<div class="ml-3 flex w-full flex-col space-y-2">
					<p>
						Give <CodeHighlight>pg_blocking_pids(int)</CodeHighlight> The blocked process ID to see its
						blocker and how long it's been blocked
					</p>
					<div class="w-full overflow-x-auto">
						<CodeBlock label="session 3">
							WITH sos AS ( SELECT array_cat(array_agg(pid),
							array_agg((pg_blocking_pids(pid))[array_length(pg_blocking_pids(pid),1)])) pids FROM
							pg_locks WHERE NOT granted ) SELECT a.pid, a.usename, a.datname, a.state,
							a.wait_event_type || ': ' || a.wait_event AS wait_event,
							current_timestamp-a.state_change time_in_state, current_timestamp-a.xact_start
							time_in_xact, l.relation::regclass relname, l.locktype, l.mode, l.page, l.tuple,
							pg_blocking_pids(l.pid) blocking_pids,
							(pg_blocking_pids(l.pid))[array_length(pg_blocking_pids(l.pid),1)] last_session,
							coalesce((pg_blocking_pids(l.pid))[1]||'.'||coalesce(case when
							locktype='transactionid' then 1 else array_length(pg_blocking_pids(l.pid),1)+1
							end,0),a.pid||'.0') lock_depth, a.query FROM pg_stat_activity a JOIN sos s on (a.pid =
							any(s.pids)) LEFT OUTER JOIN pg_locks l on (a.pid = l.pid and not l.granted) ORDER BY
							lock_depth;
						</CodeBlock>
					</div>
				</div>
			{/snippet}

			<NumberedList offset={4} not_p={true} items={[item17]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Observing locks</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="w-full max-w-3xl px-4">
			{#snippet item17()}
				<div class="ml-3 flex w-full flex-col space-y-2">
					<p>
						Give <CodeHighlight>pg_blocking_pids(int)</CodeHighlight> The blocked process ID to see its
						blocker and how long it's been blocked
					</p>
					<div class="w-full overflow-x-auto">
						<CodeBlock label="session 3">
							WITH sos AS ( SELECT array_cat(array_agg(pid),
							array_agg((pg_blocking_pids(pid))[array_length(pg_blocking_pids(pid),1)])) pids FROM
							pg_locks WHERE NOT granted ) SELECT a.pid, a.usename, a.datname, a.state,
							a.wait_event_type || ': ' || a.wait_event AS wait_event,
							current_timestamp-a.state_change time_in_state, current_timestamp-a.xact_start
							time_in_xact, l.relation::regclass relname, l.locktype, l.mode, l.page, l.tuple,
							pg_blocking_pids(l.pid) blocking_pids,
							(pg_blocking_pids(l.pid))[array_length(pg_blocking_pids(l.pid),1)] last_session,
							coalesce((pg_blocking_pids(l.pid))[1]||'.'||coalesce(case when
							locktype='transactionid' then 1 else array_length(pg_blocking_pids(l.pid),1)+1
							end,0),a.pid||'.0') lock_depth, a.query FROM pg_stat_activity a JOIN sos s on (a.pid =
							any(s.pids)) LEFT OUTER JOIN pg_locks l on (a.pid = l.pid and not l.granted) ORDER BY
							lock_depth;
						</CodeBlock>
					</div>
				</div>
			{/snippet}

			<NumberedList offset={4} not_p={true} items={[item17]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Observing locks: logs</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<p class="mb-4 px-4">
			Unless you are monitoring the DB with a special tool, you should strongly consider enabling
			the setting:
		</p>

		<div class="mb-4 w-full overflow-x-auto px-4">
			<CodeBlock>ALTER DATABASE &lt;some_db&gt; SET log_lock_waits = TRUE;</CodeBlock>
		</div>

		<div class="flex w-full flex-col space-y-4 overflow-x-auto px-4">
			<CodeBlock>
				-- if a query waiting to claim a lock on a table/index process 1017208 still waiting for
				"lock_type" on relation 75874 of database 5 after 1001.872 ms -- if a query waiting to claim
				a lock on a row (tuple) process 45981 still waiting for "lock_type" on tuple (12313,6) of
				relation 37590 of database 5 after 1000.050 ms -- if a query is waiting to claim a
				transaction lock process 46449 still waiting for "lock_type" on transaction 87656107 after
				1000.045 ms
			</CodeBlock>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Observing locks: logs</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<p class="mb-4 px-4">
			Unless you are monitoring the DB with a special tool, you should strongly consider enabling
			the setting:
		</p>

		<div class="mb-4 w-full overflow-x-auto px-4">
			<CodeBlock>ALTER DATABASE &lt;some_db&gt; SET log_lock_waits = TRUE;</CodeBlock>
		</div>

		<div class="flex w-full flex-col space-y-4 overflow-x-auto px-4">
			<CodeBlock>
				-- if a query waiting to claim a lock on a table/index process 1017208 still waiting for
				"lock_type" on relation 75874 of database 5 after 1001.872 ms -- if a query waiting to claim
				a lock on a row (tuple) process 45981 still waiting for "lock_type" on tuple (12313,6) of
				relation 37590 of database 5 after 1000.050 ms -- if a query is waiting to claim a
				transaction lock process 46449 still waiting for "lock_type" on transaction 87656107 after
				1000.045 ms
			</CodeBlock>

			<CodeBlock>
				detail: " Process holding the lock: 1865795. Wait queue: 1804472, 1865801, 1804470, 1804471,
				1864158, 1779967"
			</CodeBlock>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Migration Management</SectionHeader>
		<div class="max-w-2xl px-4">
			{#snippet item14()}
				<span class="text-lg">Set appropriate timeouts</span>
			{/snippet}
			{#snippet item15()}
				<span class="text-lg">Use less disruptive alternatives</span>
			{/snippet}
			{#snippet item16()}
				<span class="text-lg">Use combination workarounds</span>
			{/snippet}
			{#snippet item17()}
				<span class="text-lg">Run the most disruptive operations last</span>
			{/snippet}
			{#snippet item18()}
				<span class="text-lg">Use a migration linter</span>
			{/snippet}
			{#snippet item19()}
				<span class="text-lg">Use extensions</span>
			{/snippet}
			<NumberedList items={[item14, item15, item16, item17, item18, item19]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Migration Management: Timeouts</SectionHeader>
		<div class="w-full overflow-x-auto px-4">
			<CodeBlock>
				BEGIN; -- idle-in-transaction management SET LOCAL idle_in_transaction_session_timeout TO
				'10s'; -- preventing active statement from blocking SET LOCAL statement_timeout TO '1s';
				SELECT pg_sleep(2); SET LOCAL statement_timeout TO DEFAULT; -- preventing queued statements
				from blocking SET LOCAL lock_timeout TO '1s'; ALTER TABLE throwaway ADD COLUMN some_col
				text; SET LOCAL lock_timeout TO DEFAULT; ROLLBACK;
			</CodeBlock>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Migration Management: Timeouts</SectionHeader>
		<div class="w-full overflow-x-auto px-4">
			<CodeBlock>
				BEGIN; -- idle-in-transaction management SET LOCAL idle_in_transaction_session_timeout TO
				'10s'; -- preventing active statement from blocking SET LOCAL statement_timeout TO '1s';
				SELECT pg_sleep(2); SET LOCAL statement_timeout TO DEFAULT; -- preventing queued statements
				from blocking SET LOCAL lock_timeout TO '1s'; ALTER TABLE throwaway ADD COLUMN some_col
				text; SET LOCAL lock_timeout TO DEFAULT; ROLLBACK;
			</CodeBlock>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Migration Management: Less Disruptive Alternatives</SectionHeader>
		<div class="w-full overflow-x-auto px-4">
			<CodeBlock>
				-- for indexes CREATE INDEX CONCURRENTLY idx_users_email ON users(email); -- for FOREIGN
				KEY, NULL, and CHECK constraints (avoid blocking read/writes) ALTER TABLE large_table ADD
				CONSTRAINT email_not_null NOT NULL email NOT VALID; ALTER TABLE users VALIDATE CONSTRAINT
				email_not_null; -- for detatching partitions ALTER TABLE measurement DETACH PARTITION
				measurement_y2006m02 CONCURRENTLY;
			</CodeBlock>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Migration Management: Combination Workarounds</SectionHeader>
		<div class="w-full overflow-x-auto px-4">
			<CodeBlock>
				-- unique/primary key constraints CREATE UNIQUE INDEX CONCURRENTLY users_id_idx ON
				users(id); ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY USING INDEX users_id_idx;
				-- Avoid adding columns with defaults ALTER TABLE items ADD COLUMN last_update timestamptz
				DEFAULT now(); -- instead -- select, update, insert, and delete block until the catalog is
				update (milliseconds) ALTER TABLE items ADD COLUMN last_update timestamptz; -- select and
				insert go through, some updates and deletes block while the table is rewritten UPDATE items
				SET last_update = now(); -- Rewrite a table (blocks writes) BEGIN; CREATE TABLE items_new
				(LIKE items INCLUDING ALL); -- long-running operation: LOCK items IN EXCLUSIVE MODE; \COPY
				items_new FROM 'newdata.csv' WITH CSV -- reads and writes blocked from here: DROP TABLE
				items; ALTER TABLE items_new RENAME TO items; COMMIT;
			</CodeBlock>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Migration Management: order operations</SectionHeader>
		<div class="w-full overflow-x-auto px-4">
			<CodeBlock>
				-- expensive operation LOCK TABLE a IN ACCESS EXCLUSIVE MODE; -- light operation SELECT
				COUNT(*) FROM large_table;
			</CodeBlock>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Migration Management: linters</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">How to ruin a good tool</h4>
		<div class="grid gap-6 px-4 md:grid-cols-2">
			<div
				class="flex w-full justify-center rounded-2xl border border-stone-900 bg-white p-4 shadow-sm md:p-6"
			>
				<figure class="w-full">
					<img
						class="h-auto w-full rounded-sm object-contain shadow-sm"
						src={squawkhq}
						alt="blackhole"
					/>
					<figcaption class="pt-2 text-center">
						<a
							href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
							class="text-xs text-stone-400 hover:underline"
						>
							Squawk</a
						>
					</figcaption>
				</figure>
			</div>
			<div
				class="flex w-full justify-center rounded-2xl border border-stone-900 bg-white p-4 shadow-sm md:p-6"
			>
				<figure class="w-full">
					<img
						class="h-auto w-full rounded-sm object-contain shadow-sm"
						src={squawkhq2}
						alt="blackhole"
					/>
					<figcaption class="pt-2 text-center">
						<a
							href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
							class="text-xs text-stone-400 hover:underline"
						>
							Squawk suggestions</a
						>
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="yellow">Migration Management: extensions</SectionHeader>
		<div class="max-w-2xl px-4">
			{#snippet item14()}
				<span class="text-lg"
					>PG_REPACK: <CodeHighlight>VACUUM FULL</CodeHighlight> without down time</span
				>
			{/snippet}
			{#snippet item15()}
				<span class="text-lg">PG_ROLL: Table changes without down time</span>
			{/snippet}
			<NumberedList items={[item14, item15]} />
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Table locks: Row Exclusive</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="max-w-3xl px-4">
			<ul class="list-disc space-y-4 pl-6 marker:text-[#ff3e00]">
				<li class="text-lg">writer lock</li>
				<div class="w-full rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> CLAIMS LOCK: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							UPDATE (NOT UNIQUE), UPDATE (UNIQUE), DELETE, INSERT, MERGE
						</span>
					</div>
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING LOCKS: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE
						</span>
					</div>
					<div class="group relative mt-2 mb-2 flex flex-col space-y-2 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING OPERATIONS: </span>
						<span class="w-full text-xs whitespace-normal">
							ALTER TABLE DETACH PARTITION, DROP TABLE, TRUNCATE, REINDEX, CLUSTER, VACUUM FULL,
							REFRESH MATERIALIZED VIEW (sans CONCURRENTLY), ALTER INDEX (general), ALTER TABLE
							(general), LOCK TABLE, CREATE INDEX (sans CONCURRENTLY), CREATE TRIGGER, ALTER
							TABLE... ADD FOREIGN KEY, ALTER TABLE... DISABLE TRIGGER, ALTER TABLE... ENABLE
							TRIGGER, ALTER TABLE... ENABLE REPLICA TRIGGER, ALTER TABLE... ENABLE ALWAYS TRIGGER,
							REFRESH MATERIALIZED VIEW CONCURRENTLY
						</span>
					</div>
				</div>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Table locks: Row Exclusive</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="max-w-3xl px-4">
			<ul class="list-disc space-y-4 pl-6 marker:text-[#ff3e00]">
				<li class="text-lg">writer lock</li>
				<div class="w-full rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> CLAIMS LOCK: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							UPDATE (NOT UNIQUE), UPDATE (UNIQUE), DELETE, INSERT, MERGE
						</span>
					</div>
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING LOCKS: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE
						</span>
					</div>
					<div class="group relative mt-2 mb-2 flex flex-col space-y-2 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING OPERATIONS: </span>
						<span class="w-full text-xs whitespace-normal">
							ALTER TABLE DETACH PARTITION, DROP TABLE, TRUNCATE, REINDEX, CLUSTER, VACUUM FULL,
							REFRESH MATERIALIZED VIEW (sans CONCURRENTLY), ALTER INDEX (general), ALTER TABLE
							(general), LOCK TABLE, CREATE INDEX (sans CONCURRENTLY), CREATE TRIGGER, ALTER
							TABLE... ADD FOREIGN KEY, ALTER TABLE... DISABLE TRIGGER, ALTER TABLE... ENABLE
							TRIGGER, ALTER TABLE... ENABLE REPLICA TRIGGER, ALTER TABLE... ENABLE ALWAYS TRIGGER,
							REFRESH MATERIALIZED VIEW CONCURRENTLY
						</span>
					</div>
				</div>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Table locks: Share</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="max-w-3xl px-4">
			<ul class="list-disc space-y-4 pl-6 marker:text-[#ff3e00]">
				<li class="text-lg">index lock</li>
				<div class="w-full rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> CLAIMS LOCK: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							CREATE INDEX (sans CONCURRENTLY)
						</span>
					</div>
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING LOCKS: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS
							EXCLUSIVE
						</span>
					</div>
					<div class="group relative mt-2 mb-2 flex flex-col space-y-2 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING OPERATIONS: </span>
						<span class="w-full text-xs whitespace-normal">
							UPDATE (NOT UNIQUE), UPDATE (UNIQUE), DELETE, INSERT, MERGE...
						</span>
					</div>
				</div>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Table locks: Share Row Exclusive</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="max-w-3xl px-4">
			<ul class="list-disc space-y-4 pl-6 marker:text-[#ff3e00]">
				<li class="text-lg">trigger and foreign key lock</li>
				<div class="w-full rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> CLAIMS LOCK: </span>
						<span class="w-full whitespace-normal">
							CREATE TRIGGER, ALTER TABLE... ADD FOREIGN KEY, ALTER TABLE... DISABLE TRIGGER, ALTER
							TABLE... ENABLE TRIGGER, ALTER TABLE... ENABLE REPLICA TRIGGER, ALTER TABLE... ENABLE
							ALWAYS TRIGGER
						</span>
					</div>
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING LOCKS: </span>
						<span class="w-full whitespace-normal">
							ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS
							EXCLUSIVE, SHARE
						</span>
					</div>
					<div class="group relative mt-2 mb-2 flex flex-col space-y-2 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING OPERATIONS: </span>
						<span class="w-full text-xs whitespace-normal">
							UPDATE (NOT UNIQUE), UPDATE (UNIQUE), DELETE, INSERT, MERGE, CREATE INDEX
						</span>
					</div>
				</div>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Table locks: Exclusive</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="max-w-3xl px-4">
			<ul class="list-disc space-y-4 pl-6 marker:text-[#ff3e00]">
				<li class="text-lg">refreshing materialized views concurrently</li>
				<div class="w-full rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> CLAIMS LOCK: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							REFRESH MATERIALIZED VIEW CONCURRENTLY
						</span>
					</div>
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING LOCKS: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE ,
							EXCLUSIVE, ACCESS EXCLUSIVE
						</span>
					</div>
					<div class="group relative mt-2 mb-2 flex flex-col space-y-2 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING OPERATIONS: </span>
						<span class="w-full text-xs whitespace-normal">
							All maintenance operations and SELECT... FOR UPDATE, SELECT... FOR NO KEY UPDATE,
							SELECT... FOR SHARE, SELECT... FOR KEY SHARE
						</span>
					</div>
				</div>
			</ul>
		</div>
	</section>

	<section
		tabindex="1"
		class="troubleshooting_section mb-20 flex min-h-screen flex-col justify-center outline-none"
	>
		<SectionHeader color="red">Table locks: Exclusive</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="max-w-3xl px-4">
			<ul class="list-disc space-y-4 pl-6 marker:text-[#ff3e00]">
				<li class="text-lg">refreshing materialized views concurrently</li>
				<div class="w-full rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all">
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> CLAIMS LOCK: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							REFRESH MATERIALIZED VIEW CONCURRENTLY
						</span>
					</div>
					<div class="group relative mb-2 flex space-x-1 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING LOCKS: </span>
						<span class="max-w-[600px] overflow-hidden text-nowrap text-ellipsis">
							ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE ,
							EXCLUSIVE, ACCESS EXCLUSIVE
						</span>
					</div>
					<div class="group relative mt-2 mb-2 flex flex-col space-y-2 text-[10px]">
						<span class="font-bold text-nowrap"> OPPOSING OPERATIONS: </span>
						<span class="w-full text-xs whitespace-normal">
							All maintenance operations and SELECT... FOR UPDATE, SELECT... FOR NO KEY UPDATE,
							SELECT... FOR SHARE, SELECT... FOR KEY SHARE
						</span>
					</div>
				</div>
			</ul>
		</div>
	</section>
</article>
