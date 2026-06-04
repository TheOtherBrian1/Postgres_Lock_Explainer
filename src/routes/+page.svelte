<script lang="ts">
	import Tool from '$lib/assets/Tool.gif';
	import SectionHeader from '$lib/components/section_header.svelte';
	import NumberedList from '$lib/components/lists/numbered_list.svelte';
	import UnorderedList from '$lib/components/lists/unordered_list.svelte';

	// const sections = [
	// 	{
	// 		link: '/locks/concept',
	// 		title: 'Concept',
	// 		blurb:
	// 			'Basic concepts of locks and how they work in Postgres. I tried to make it more digestible with animations.'
	// 	},
	// 	{
	// 		link: '/locks/locks_by_example',
	// 		title: 'Locks By Example',
	// 		blurb: 'Outlines table locks and provides a few demoes one can run to see them in action.'
	// 	},
	// 	{
	// 		link: '/locks/lock_tool',
	// 		title: 'Lock Blocking Graph',
	// 		blurb: 'Interactive tool that shows what SQL operations lock out each other.',
	// 		img: {
	// 			src: Tool,
	// 			alt: 'Lock Blocking Graph'
	// 		}
	// 	},
	// 	{
	// 		link: '/locks/troubleshooting',
	// 		title: 'Troubleshooting',
	// 		blurb: 'Lock problems and how to identify and resolve them.'
	// 	},
	// 	{
	// 		link: '/locks/monitoring',
	// 		title: 'Monitoring',
	// 		blurb: 'Reviews of popular monitoring tools, as well as some homegrown solutions.'
	// 	}
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
</script>

<article
	class="mx-auto mb-10 border border-stone-800 bg-[#100e0e] p-6 font-sans leading-relaxed text-stone-300 shadow-lg selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<!-- INTRO SLIDE -->
	<section tabindex="1" class="explainer h-screen outline-none">
		<SectionHeader>Postgres Locks: Demystified</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">
			Literally everything to know about Postgres Locks
		</h4>
		<div class=" mx-4 rounded-md border border-stone-900 bg-stone-950 p-4 px-4 shadow-sm md:p-6">
			<img class="m-auto w-auto rounded-sm shadow-sm" src={lock_wizard} alt="blackhole" />
		</div>
	</section>

	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="yellow">The Ignorance Tax</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">How to ruin a good tool</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 w-[400px] shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Adopt tech</li>
				<li>Lack depth to configure</li>
				<li>Overspend, migrate, or tolerate poor performance</li>
			</ul>
			<div class="w-auto rounded-2xl border border-stone-900 p-1 shadow-sm md:p-6">
				<figure>
					<img class="w-full rounded-sm shadow-sm" src={indecision} alt="blackhole" />
					<figcaption class="pt-2 text-center">
						<a href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg">
							Indecision Map</a
						>
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 w-[200px] shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<div class=" mx-4 rounded-md border border-stone-900 bg-stone-950 p-4 px-4 shadow-sm md:p-6">
				<img class="m-auto w-auto rounded-sm shadow-sm" src={slack} alt="blackhole" />
			</div>
		</div>
	</section>
	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 w-[200px] shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<figure>
				<img class="h-[150px] w-full rounded-sm shadow-sm" src={cpu} alt="blackhole" />
				<figcaption class="pt-2 text-center text-sm">
					<a
						class="text-xs"
						href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
					>
						CPU usage</a
					>
				</figcaption>
			</figure>
		</div>
	</section>
	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 w-[200px] shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<figure>
				<img class=" w-full rounded-sm shadow-sm" src={memory} alt="blackhole" />
				<figcaption class="pt-2 text-center text-sm">
					<a
						class="text-xs"
						href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
					>
						memory undercommitted</a
					>
				</figcaption>
			</figure>
		</div>
	</section>

	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 w-[200px] shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<figure>
				<img class=" w-full rounded-sm shadow-sm" src={disk} alt="blackhole" />
				<figcaption class="pt-2 text-center text-sm">
					<a
						class="text-xs"
						href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
					>
						Disk not near capacity</a
					>
				</figcaption>
			</figure>
		</div>
	</section>
	<section tabindex="1" class="troubleshooting_section outline-none">
		<SectionHeader color="red">The Postgres Iceberg</SectionHeader>
		<figure>
			<img class=" w-full rounded-sm shadow-sm" src={iceberg} alt="blackhole" />
			<figcaption class="pt-2 text-center text-sm">
				<a
					class="text-xs"
					href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
				>
					Postgres Iceberg Meme</a
				>
			</figcaption>
		</figure>
	</section>
	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 w-[200px] shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<div class=" mx-4 rounded-md border border-stone-900 bg-stone-950 p-4 px-4 shadow-sm md:p-6">
				<img class="m-auto w-auto rounded-sm shadow-sm" src={slack} alt="blackhole" />
			</div>
		</div>
	</section>

	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 w-[200px] shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<figure>
				<!-- prettier-ignore -->
				<CodeBlock>
SELECT 
    blocked.pid AS blocked_pid,
    blocked.usename AS blocked_user,
    blocked.query AS blocked_query,
    blocked.state AS blocked_state,
    NOW() - blocked.query_start AS blocked_duration,
    
    ...
</CodeBlock>
				<figcaption class="relative bottom-6 pt-2 text-center text-sm">
					<a
						class="text-xs"
						href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
					>
						Lock detection query</a
					>
				</figcaption>
			</figure>
		</div>
	</section>
	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Locks can take your system offline</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Customer rang me on Slack</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 w-[200px] shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Database down</li>
				<li>Hardware was fine</li>
				<li>Blocked by lock</li>
			</ul>
			<figure>
				<!-- prettier-ignore -->
				<CodeBlock>
select pg_terminate_backend(pid)
from pg_stat_activity
where pid = "blocking_connection_process"
</CodeBlock>
				<figcaption class="relative bottom-6 pt-2 text-center text-sm">
					<a
						class="text-xs"
						href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
					>
						Kill connection</a
					>
				</figcaption>
			</figure>
		</div>
	</section>
	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Problem solved?</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Questions of terror</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Locks?</li>
				<li>Why do they exist?</li>
				<li>When can they harm our database?</li>
				<li>How can we monitor for problems?</li>
				<li>And what paths do we have to troubleshoot and correct?</li>
			</ul>
		</div>
	</section>
	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">The real problem</SectionHeader>
		<div class="flex space-x-8">
			<ul class="mb-6 ml-6 shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Communication</li>
				<li>Observability</li>
			</ul>
			<figure>
				<img class=" w-full rounded-sm shadow-sm" src={elephant_angry} alt="blackhole" />
				<figcaption class="pt-2 text-center text-sm">
					<a
						class="text-xs"
						href="https://commons.wikimedia.org/wiki/File:Hatachi_500_GB_hard_drive,_2011.jpg"
					>
						communication shouldn't intimidate</a
					>
				</figcaption>
			</figure>
		</div>
	</section>
	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Really solving the problem</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Questions of terror</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>Locks?</li>
				<li>Why do they exist?</li>
				<li>When can they harm our database?</li>
				<li>How can we monitor for problems?</li>
				<li>And what paths do we have to troubleshoot and correct?</li>
			</ul>
		</div>
	</section>
	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Locks? Why do they exist?</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">Why are they tolerated?</h4>
		<div class="flex">
			<ul class="mb-6 ml-6 shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
				<li>
					Some commands (<CodeHighlight>SELECT</CodeHighlight>,<CodeHighlight>INSERT</CodeHighlight
					>, <CodeHighlight>ALTER</CodeHighlight>) conflict
				</li>
				<li>Overlapping, conflicting commands cause:</li>
				<ul class="mb-6 ml-6 shrink-0 list-disc space-y-4 marker:text-[#ff3e00]">
					<li>DB failure</li>
					<li>Consistency violation</li>
					<li>Data corruption</li>
				</ul>
				<li>Locks queue conflicting operations, so they do not overlap</li>
			</ul>
		</div>
	</section>
	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="red">Reviewing conflicts</SectionHeader>
		<div class="flex">
			{#snippet item1()}
				<span><strong class="text-stone-100">Reader + Reader:</strong> No conflict is needed</span>
			{/snippet}
			{#snippet item2()}
				<span
					><strong class="text-stone-100">Reader + Writer:</strong> Handled with row versioning (MVCC)</span
				>
			{/snippet}
			{#snippet item3()}
				<span><strong class="text-stone-100">Writer + Writer:</strong> Handled with locks</span>
			{/snippet}
			{#snippet item4()}
				<span
					><strong class="text-stone-100">Maintenance + Anything:</strong> Handled with locks</span
				>
			{/snippet}
			<UnorderedList items={[item1, item2, item3, item4]} />
		</div>
	</section>
	<section tabindex="1" class="troubleshooting_section h-screen outline-none">
		<SectionHeader color="yellow">Single user</SectionHeader>
		<h4 class="mt-0 p-4 pt-0 text-sm font-bold text-stone-400">How to ruin a good tool</h4>
		<div class="flex"></div>
	</section>
</article>
