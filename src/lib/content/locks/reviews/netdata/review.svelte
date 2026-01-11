<script lang="ts">
	import ImageCont from '$lib/components/image_cont.svelte';

	// IMAGES ----------------------------
	import Held from '$lib/assets/Netdata/Held.png';
	import Wait from '$lib/assets/Netdata/Wait.png';
	import Percentage from '$lib/assets/Netdata/Percentage_of_locks_held.png';
</script>

<p class="p">
	<strong>TL;DR</strong> Best setup experience by far. Offers visibility over locking activity, but no
	insight into what is causing the lock or being blocked
</p>

<p class="p">
	At this point in the review, I had gone through the process of configuring Datadog, Redgate, and
	PGAnalyze. All setup processes were unpleasant. This tool for a self-hosted environment was
	functionally a one-click deploy.
</p>
<p class="p">
	However, the locking metrics its Postgres integration offers visibility into are more limited than
	PGAnalyze and Datadog.
</p>
<p class="p">It will show you:</p>

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
	The percentage of all available locks being used
</h4>
<ImageCont src={Percentage} alt="Percentage of locks used" />
<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
	What locks are being held at any given moment
</h4>
<ImageCont src={Held} alt="Held locks" />

<ImageCont src={Wait} alt="Waiting" />

<p class="p">
	What it doesn't offer is any insight into what queries are blocking or being blocked. So, you'll
	be able to tell when locks are being problematic, but not know what queries to correct or how to
	action the issue. You'll still have to rely on other tools, logs, or queries to investigate
	further.
</p>
<p class="p">
	Because the solution is open source, you can self-host it. Even the paid tier seems competitive
	relative to other vendors. The deployment process is so pleasant that I personally would lean
	towards it for certain projects even though its coverage is not as robust out-of-the-box.
</p>
