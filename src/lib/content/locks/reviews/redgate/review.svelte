<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
</script>

<p class="p">
	<strong>TL;DR</strong> no support for lock monitoring and unpleasant developer experience. Live
	<a href="https://monitor.red-gate.com/GlobalDashboard" class="a">demo</a> for the curious.
</p>

<p class="p">
	When initially looking into Redgate, I thought it had support for lock monitoring. Apparently,
	that's for Microsoft SQL Server. Their Postgres Monitoring service scrapes a <a
		href="https://documentation.red-gate.com/monitor/list-of-metrics-239667972.html#Listofmetrics-PostgreSQLinstanceanddatabasemetrics"
		class="a">smaller set of metrics</a
	>.
</p>
<p class="p">
	As I went through the configuration process, I noticed that Postgres was an afterthought in nearly
	all the documentation. My thoughts are that Postgres is something they're exploring, but a
	secondary consideration at the moment. Overall, it's good if you're deploying SQL Server,
	Postgres, etc. all at once, but if you're just using Postgres, there are better options that are
	open source, more cost competitive, or just more comprehensive.
</p>
