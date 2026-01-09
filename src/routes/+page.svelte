<script lang="ts">
	import Tool from '$lib/assets/Tool.gif';
	import SectionHeader from '$lib/components/section_header.svelte';
	import NumberedList from '$lib/components/lists/numbered_list.svelte';

	const sections = [
		{
			link: '/locks/concept',
			title: 'Concept',
			blurb:
				'Basic concepts of locks and how they work in Postgres. I tried to make more digestible with animations.'
		},
		{
			link: '/locks/lock_tool',
			title: 'Lock Blocking Graph',
			blurb: 'Interactive tool that shows what SQL operations lock out each other.',
			img: {
				src: Tool,
				alt: 'Lock Blocking Graph'
			}
		},
		{
			link: '/locks/troubleshooting',
			title: 'Troubleshooting',
			blurb: 'Lock problems and how to identify and resolve them.'
		},
		{
			link: '/locks/monitoring',
			title: 'Monitoring',
			blurb: 'Reviews of popular monitoring tools, as well as some homegrown solutions.'
		}
	];
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<section class="explainer_section mt-5">
		<SectionHeader>About Me</SectionHeader>
		<p>
			I, <a class="a" href="https://github.com/TheOtherBrian1">@TheOtherBrian1</a>, currently work
			as a support engineer at <a class="a" href="https://supabase.com/">Supabase</a>, a quickly
			growing Postgres provider. For most of my work day, I functionally act as a database
			consultant.
		</p>
		<p>
			This site represents the documentation and resources I wish existed when I was learning about
			locks.
		</p>
		<p>My goal is to:</p>

		{#snippet item1()}
			explain locks conceptually
		{/snippet}
		{#snippet item2()}
			provide real world examples from my professional experience
		{/snippet}
		{#snippet item3()}
			review monitoring tools
		{/snippet}
		{#snippet item4()}
			troubleshoot common issues
		{/snippet}
		<NumberedList items={[item1, item2, item3, item4]} />
		<p>The whole project took me about 3 months to complete, so I hope you find it insightful.</p>
	</section>

	<div class="space-y-4">
		<!-- <div class="flex h-12 items-center justify-start space-x-2 bg-gray-50">
			<div class="h-full w-[2px] rounded-full bg-stone-900"></div>
			<h4 class=" text-lg font-bold text-stone-900">Sections:</h4>
		</div>
		<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Sections:</h4> -->
		<h4
			class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			Sections:
		</h4>

		<div class="p- grid grid-cols-1 gap-4">
			{#each sections as { link, title, blurb, img }}
				<a
					href={link}
					class=" group rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all hover:border-amber-200 hover:bg-amber-50/50 hover:shadow-sm"
				>
					<h4
						class="flex items-center gap-2.5 text-lg font-bold text-stone-900 group-hover:text-amber-800"
					>
						<span
							class="h-2 w-2 shrink-0 rounded-full bg-stone-400 transition-colors group-hover:bg-amber-500"
						></span>
						{title}
					</h4>

					<p
						style="text-decoration-underline: none"
						class=" p mt-2 border-none text-sm text-stone-600 no-underline group-hover:text-stone-800"
					>
						{blurb}
					</p>
					{#if img?.src}
						<div class="overflow-hidden rounded-lg border border-stone-200/60 bg-white shadow-sm">
							<img
								src={img.src}
								alt={img.alt}
								class="w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
							/>
						</div>
					{/if}
				</a>
			{/each}
		</div>
	</div>
</article>
