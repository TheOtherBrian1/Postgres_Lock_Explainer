<script lang="ts">
	import ImageCont from '$lib/components/image_cont.svelte';

	// IMAGES ----------------------------
	import AvgPath from '$lib/assets/Pgwatch/AvgPath.png';
	import AvgWaitingState from '$lib/assets/Pgwatch/AvgWaitingState.png';
	import ExclusiveLockCount from '$lib/assets/Pgwatch/ExclusiveLockCount.png';
	import LongestWaitDuration from '$lib/assets/Pgwatch/LongestWaitDuration.png';
</script>

<p class="p">
	<strong>TL;DR</strong> Comprehensive for general monitoring, but doesn't show what queries are blocks/blocking.
</p>

<p class="p">
	pgwatch is overwhelming in how much coverage it offers for Postgres (seriously, it has 10+
	dashboards). Though, when it comes to lock monitoring, it lags behind a few other options.
</p>
<p class="p">
	It will help identify when locking problems are occurring, but it's not going to help much with
	identifying what queries are blocking or being blocked.
</p>
<p class="p">Some notable graphs it offers around locks are:</p>

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Types of locks over time</h4>
<ImageCont src={AvgPath} alt="graph of locks over time" />

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Sessions stuck in waiting states</h4>
<ImageCont src={AvgWaitingState} alt="graphs of sessions waiting" />

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Exclusive Lock count</h4>
<ImageCont src={ExclusiveLockCount} alt="Exclusive lock counts" />

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Longest time spent waiting for locks</h4>
<ImageCont src={LongestWaitDuration} alt="wait graph" />
