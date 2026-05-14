<script>
	import PlanNode from './PlanNode.svelte';

	export let planData = [];

	// Safely extract the root "Plan" node
	$: rootNode =
		Array.isArray(planData) && planData.length > 0 && planData[0].Plan
			? planData[0].Plan
			: planData.Plan || planData;

	$: isMetricTime = !!(rootNode && rootNode['Actual Total Time']);

	// The true max time is the root node's Total Time multiplied by its loops
	$: maxMetric = rootNode
		? isMetricTime
			? rootNode['Actual Total Time'] * (rootNode['Actual Loops'] || 1)
			: rootNode['Total Cost'] || 1
		: 1;
</script>

{#if rootNode && Object.keys(rootNode).length > 0}
	<div
		class="rounded-xl border border-stone-200 bg-white p-4 font-sans text-stone-800 antialiased shadow-sm md:p-6"
	>
		<header class="mb-6 flex items-center justify-between">
			<h2 class="text-lg font-bold tracking-tight text-stone-900">Query Execution Plan</h2>
			<div
				class="rounded bg-blue-50 px-2 py-1 font-mono text-xs font-bold tracking-widest text-blue-700 uppercase"
			>
				{isMetricTime ? 'EXPLAIN ANALYZE (Time)' : 'EXPLAIN (Cost)'}
			</div>
		</header>

		<div
			class="mb-2 flex border-b-2 border-stone-200 pb-2 text-[10px] font-black tracking-widest text-stone-400 uppercase"
		>
			<div class="w-[55%]">Node Hierarchy</div>
			<div class="flex w-[45%] justify-between pr-2">
				<span>Execution Proportion</span>
				<span>Duration</span>
			</div>
		</div>

		<div class="flex flex-col">
			<PlanNode node={rootNode} {maxMetric} {isMetricTime} depth={0} />
		</div>
	</div>
{:else}
	<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
		Invalid or empty Postgres JSON plan provided.
	</div>
{/if}
