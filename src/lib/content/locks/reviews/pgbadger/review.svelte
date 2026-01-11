<script lang="ts">
	import ImageCont from '$lib/components/image_cont.svelte';

	// IMAGES ----------------------------
	import Errors from '$lib/assets/PGBadger/Errors.png';
	import Lock_Type from '$lib/assets/PGBadger/Lock_Type.png';
	import Waited from '$lib/assets/PGBadger/Waited.png';
	import WaitingQueries from '$lib/assets/PGBadger/Queries_that_waited_most.png';

	import CodeHighlight from '$lib/components/code_highlight.svelte';
</script>

<p class="p">
	<strong>TL;DR</strong> No realtime monitoring. Organizes logs for the users, including those related
	to locks.
</p>

<p class="p">
	PGBadger is a single Perl script that interprets and aggregates your log files. Some logs, such as
	those produced by <CodeHighlight>log_lock_waits</CodeHighlight>, <CodeHighlight
		>deadlock_timeout</CodeHighlight
	>, and <CodeHighlight>lock_timeout</CodeHighlight>, are lock related.
</p>
<p class="p">
	The script can be configured to run as a cron job, but by default it will only run once a day.
</p>
<p class="p">
	The output are HTML, CSS, and JS files that you need to access by hosting your own webserver, such
	as Apache. Alternatively, if your machine has a browser, you should be able to open the files
	directly in it.
</p>
<p class="p">
	It's a good tool for filtering logs overall, but it's is not intended for realtime analytics. It's
	not a suitable replacement for a monitoring dashboard nor does it provide a competitive level of
	lock insight compared to the other options.
</p>
<p class="p">Some notable features include:</p>

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Shows error frequencies from logs</h4>
<ImageCont src={Errors} alt="error logs" />

<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
	Shows frequency oflock types recorded in the logs
</h4>
<ImageCont src={Lock_Type} alt="lock types" />
<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
	Shows which queries collectively waited for locks the longest based on log entries
</h4>
<ImageCont src={Waited} alt="lock types" />
<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
	Shows which queries overall were recorded waiting for locks in the logs
</h4>
<ImageCont src={WaitingQueries} alt="lock types" />
