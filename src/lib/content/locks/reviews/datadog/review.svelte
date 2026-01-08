<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import ImageCont from '$lib/components/image_cont.svelte';

	// IMAGES ----------------------------
	import Waiting from '$lib/assets/Datadog/waiting.png';
	import Blocking from '$lib/assets/Datadog/blocking.png';
	import Overview from '$lib/assets/Datadog/overview.png';
	import Locks from '$lib/assets/Datadog/locks.png';
</script>

<p class="p">
	<strong>TL;DR</strong> Excellent support for lock monitoring and other metrics.
</p>

<p class="p">
	Although not as hard to set up as Redgate, it was still not as easy as I would have liked.
</p>
<p class="p">
	Despite the initial difficulty, the Dashboard is easy to navigate once properly configured and the
	metrics are deligihtfully comprehensive, especially for lock monitoring. The metrics I think are
	most important are present:
</p>

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">A nice overview of active queries</h4>
<ImageCont src={Overview} alt="Overview" />
<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">The type of locks present in the DB</h4>
<ImageCont src={Locks} alt="Locks" />
<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">What queries are waiting most on locks</h4>
<ImageCont src={Waiting} alt="Waiting" />
<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">What queries are blocking most</h4>
<ImageCont src={Blocking} alt="Blocking" />

<p class="p">
	There was a flaw with the blocking portion of the dashboard, but this would be a flaw with any
	monitoring tool. When running multiple statements in a BEGIN/COMMIT block, Postgres's block
	observability will show the statement that is being run and not necessarily the one that is
	blocking. In my case, that meant I saw a lot of <CodeHighlight>pg_sleep()</CodeHighlight> statements
	as the blocker, when in reality it was the <CodeHighlight>SELECT</CodeHighlight> statement that was
	blocking.
</p>
