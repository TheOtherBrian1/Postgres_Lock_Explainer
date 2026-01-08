<script lang="ts">
	import Tool from '$lib/assets/Tool.gif';
	import SectionHeader from '$lib/components/section_header.svelte';
	import NumberedList from '$lib/components/lists/numbered_list.svelte';
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<section class="explainer_section mt-5">
		<SectionHeader>About Me</SectionHeader>
		<p class="p">
			Hi! I'm Brian B. (also known as the <a class="a" href="https://github.com/TheOtherBrian1"
				>@TheOtherBrian1</a
			> on GitHub) and I created this site to explain how locks work in Postgres.
		</p>
		<p class="p">
			I currently work as a support engineer at <a class="a" href="https://supabase.com/"
				>Supabase</a
			>, which manages millions of Postgres databases at the time of writing. For most of my work
			day, I functionally act as a database consultant.
		</p>
		<p class="p">
			This site represents the documentation and resources I wish existed when I was learning about
			locks.
		</p>
		<p class="p">My goal is to:</p>

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
		<p class="p">
			The whole project took me about 3 months to complete, so I hope you find it insightful.
		</p>
	</section>

	<div class="space-y-4">
		<p class="text-stone-600">It's split into 5 sections:</p>

		<div class="grid grid-cols-1 gap-4">
			<a
				href="/locks/concept"
				class="group block rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all hover:border-amber-200 hover:bg-amber-50/50 hover:shadow-sm"
			>
				<h4
					class="flex items-center gap-2.5 text-lg font-bold text-stone-900 group-hover:text-amber-800"
				>
					<span
						class="h-2 w-2 shrink-0 rounded-full bg-stone-400 transition-colors group-hover:bg-amber-500"
					></span>
					Concept
				</h4>

				<p class="mt-2 text-sm text-stone-600 group-hover:text-stone-800">
					Explains the basic concepts of locks and how they work in Postgres. I tried to make it
					more digestible with animations.
				</p>
			</a>

			<a
				href="/locks/lock_tool"
				class="group block rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all hover:border-amber-200 hover:bg-amber-50/50 hover:shadow-sm"
			>
				<h4
					class="flex items-center gap-2.5 text-lg font-bold text-stone-900 group-hover:text-amber-800"
				>
					<span
						class="h-2 w-2 shrink-0 rounded-full bg-stone-400 transition-colors group-hover:bg-amber-500"
					></span>
					Lock Blocking Graph
				</h4>

				<p class="mt-2 mb-4 text-sm text-stone-600 group-hover:text-stone-800">
					Interactive tool that shows what SQL operations lock out each other.
				</p>

				<div class="overflow-hidden rounded-lg border border-stone-200/60 bg-white shadow-sm">
					<img
						src={Tool}
						alt="Lock Blocking Graph"
						class="w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
					/>
				</div>
			</a>

			<a
				href="/locks/troubleshooting"
				class="group block rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all hover:border-amber-200 hover:bg-amber-50/50 hover:shadow-sm"
			>
				<h4
					class="flex items-center gap-2.5 text-lg font-bold text-stone-900 group-hover:text-amber-800"
				>
					<span
						class="h-2 w-2 shrink-0 rounded-full bg-stone-400 transition-colors group-hover:bg-amber-500"
					></span>
					Troubleshooting
				</h4>

				<p class="mt-2 text-sm text-stone-600 group-hover:text-stone-800">
					Explains how to identify and resolve common lock issues.
				</p>
			</a>

			<a
				href="/locks/monitoring"
				class="group block rounded-xl border border-stone-200 bg-stone-50 p-5 transition-all hover:border-amber-200 hover:bg-amber-50/50 hover:shadow-sm"
			>
				<h4
					class="flex items-center gap-2.5 text-lg font-bold text-stone-900 group-hover:text-amber-800"
				>
					<span
						class="h-2 w-2 shrink-0 rounded-full bg-stone-400 transition-colors group-hover:bg-amber-500"
					></span>
					Monitoring
				</h4>

				<p class="mt-2 text-sm text-stone-600 group-hover:text-stone-800">
					Reviews popular tools for monitoring locks, as well as some homegrown solutions.
				</p>
			</a>
		</div>
	</div>
</article>
