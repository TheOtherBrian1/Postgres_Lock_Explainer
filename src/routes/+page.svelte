<script lang="ts">
	import Tool from '$lib/assets/Tool.gif';
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<section class="explainer_section">
		<p class="p">
			Hi! I, Brian B. (also known as the @TheOtherBrian1 on GitHub) created this site to explain how
			locks work in Postgres.
		</p>
		<p class="p">
			I currently work as a support engineer at Supabase, which manages over 4 million Postgres
			databases at the time of writing. For most of my work day, I functionally act as a database
			consultant.
		</p>
		<p class="p">
			I consider Postgres's official docs on locks to be unapproachable for new comers and the
			resources available online to be either too shallow or too complex.
		</p>
		<p class="p">
			This site represents the documentation and resources I wish existed when I was learning about
			locks.
		</p>
	</section>
	<p class="p">It's split into 5 sections:</p>
	<section class="explainer_section">
		<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
			<a class="a" href="/locks/concept">Concept</a>
		</h4>
		<p class="p text-sm">
			explains the basic concepts of locks and how they work in Postgres. I tried to make it more
			digestible with animations
		</p>
	</section>
	<section class="explainer_section">
		<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
			<a class="a" href="/locks/lock_tool">Lock Blocking Graph</a>
		</h4>
		<p class="p text-sm">Interactive tool that shows what SQL operations lock out each other.</p>
		<img src={Tool} alt="Lock Blocking Graph" />
	</section>
	<section class="explainer_section">
		<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
			<a class="a" href="/locks/troubleshooting">Troubleshooting</a>
		</h4>
		<p class="p text-sm">Explains how to identify and resolve common lock issues.</p>
	</section>
	<section class="explainer_section">
		<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
			<a class="a" href="/locks/troubleshooting">Monitoring</a>
		</h4>
		<p class="p text-sm">
			Reviews popular tools for monitoring locks, as well as some homegrown solutions.
		</p>
	</section>
</article>
