<script lang="ts">
	import Deadlocks from '$lib/content/locks/troubleshooting/deadlocks/index.svelte';
	import LockMemory from '$lib/content/locks/troubleshooting/lock_memory/index.svelte';
	import Blocked from '$lib/content/locks/troubleshooting/blocked/index.svelte';
	import SectionHeader from '$lib/components/section_header.svelte';
	import Queues from '$lib/content/locks/troubleshooting/queues/index.svelte';
	import Timeout from '$lib/content/locks/troubleshooting/timeouts/index.svelte';
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<!-- INTRO -->
	<section class="mb-12">
		<SectionHeader>The critical flaw with locks</SectionHeader>
		<p class="p">
			Locks are a queuing mechanism. When the queue backs up, queries wait, and in the worst cases
			critical functionality grinds to a halt.
		</p>
		<p class="p">
			As a Postgres support engineer, I look at thousands of production databases a year. In my
			experience, lock bottlenecks are rare, certainly less so than under-optimized queries, poor
			connection management, or bloat.
		</p>
		<p class="p">
			It's their relative obscurity that makes them so pernicious: when they shift from helpful to
			harmful, few developers know how to detect and correct.
		</p>
		<p class="p">
			My goal is to outline the varying problems I've come across and the configurations necessary
			to monitor and address them.
		</p>
	</section>
	<Deadlocks />
	<LockMemory />
	<Queues />
	<Blocked />
	<Timeout />
</article>
