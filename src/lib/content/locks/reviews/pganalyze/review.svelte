<script lang="ts">
	import ImageCont from '$lib/components/image_cont.svelte';

	// IMAGES ----------------------------
	import QueryOverview from '$lib/assets/PGanalyze/query_overview.png';
	import LogOverview from '$lib/assets/PGanalyze/log_lock_monitor.png';
	import Wait from '$lib/assets/PGanalyze/Wait.png';
</script>

<p class="p">
	<strong>TL;DR</strong> Excellent support for lock monitoring and other metrics.
</p>

<p class="p">
	PGAnalyze has the simplest setup process of all the closed source or partially closed source tools
	I reviewed. However, I ran into quite a few hiccups when I reconfigured my log files to a custom
	location.
</p>
<p class="p">
	Confessionally, I am a bit biased towards PGAnalyze because it has been recommended to me by
	people I admire, and also because their Postgres blog, in my opinion, is the best in the industry.
</p>

<p class="p">
	Although the UI is a bit more clunky than the other tools, it has everything one could want in a
	lock monitoring tool and has the best query advisor in the industry. However, the UI doesn't make
	it as trivial to identify blockers, so I rated it slightly lower than DataDog.
</p>

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">A nice overview of queries</h4>
<ImageCont src={QueryOverview} alt="Overview of queries" />
<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
	Good overview of blocking events and affected queries
</h4>
<ImageCont src={Wait} alt="Waiting events" />
<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
	Fantastic log interpreter with special care given to locking events
</h4>
<ImageCont src={LogOverview} alt="Log Interpreter" />
