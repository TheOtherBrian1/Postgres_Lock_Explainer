<script>
	export let node;
	export let maxMetric;
	export let isMetricTime;
	export let depth = 0;

	let expanded = false;

	// Postgres metrics are per-loop. Multiply to get the true inclusive duration.
	$: loops = node['Actual Loops'] || 1;
	$: nodeDuration = isMetricTime
		? (node['Actual Total Time'] || 0) * loops
		: node['Total Cost'] || 0;

	// Calculate the total duration of all immediate children
	$: childrenDuration = (node.Plans || []).reduce((sum, child) => {
		let cLoops = child['Actual Loops'] || 1;
		return (
			sum + (isMetricTime ? (child['Actual Total Time'] || 0) * cLoops : child['Total Cost'] || 0)
		);
	}, 0);

	// Exclusive duration is the time spent executing THIS node, minus its children.
	// (Math.max prevents UI bugs from CTEs or weird Postgres parallel accounting anomalies)
	$: exclusiveDuration = Math.max(0, nodeDuration - childrenDuration);

	// Calculate widths for the stacked bar
	$: totalPct = Math.min((nodeDuration / maxMetric) * 100, 100);
	$: exclusivePct = nodeDuration > 0 ? (exclusiveDuration / nodeDuration) * 100 : 0;

	$: primitiveKeys = Object.keys(node).filter(
		(k) => typeof node[k] !== 'object' && k !== 'Plan Rows' && k !== 'Actual Rows'
	);
</script>

<div class="flex flex-col border-b border-stone-100 py-2 transition-colors hover:bg-stone-50">
	<div class="flex w-full items-center">
		<div class="flex w-[55%] items-center pr-4" style="padding-left: {depth * 1.5}rem;">
			<button
				class="mr-2 flex h-5 w-5 items-center justify-center rounded text-stone-400 transition-transform hover:bg-stone-200 hover:text-stone-700"
				style="transform: rotate({expanded ? '90deg' : '0deg'})"
				on:click={() => (expanded = !expanded)}
				aria-label="Toggle node details"
			>
				▶
			</button>

			<div class="flex flex-col">
				<div class="flex items-center gap-2">
					<span class="text-sm font-bold text-blue-700">{node['Node Type']}</span>
					{#if loops > 1}
						<span class="rounded bg-stone-200 px-1.5 py-0.5 text-[9px] font-bold text-stone-600">
							{loops} loops
						</span>
					{/if}
				</div>
				<span class="mt-0.5 max-w-sm truncate font-mono text-xs text-stone-500">
					{#if node['Relation Name']}
						on {node['Relation Name']}
					{/if}
					{#if node['Index Name']}
						using {node['Index Name']}
					{/if}
					{#if node['CTE Name']}
						CTE {node['CTE Name']}
					{/if}
					{#if node['Subplan Name']}
						({node['Subplan Name']})
					{/if}
				</span>
			</div>
		</div>

		<div class="flex w-[45%] items-center justify-between pl-2">
			<div
				class="group relative flex h-5 flex-1 items-center overflow-hidden rounded border border-stone-200/50 bg-stone-100 shadow-inner"
			>
				<div class="absolute left-0 h-full bg-blue-100 transition-all" style="width: {totalPct}%;">
					<div
						class="absolute left-0 h-full bg-blue-500 transition-all"
						style="width: {exclusivePct}%;"
					></div>
				</div>

				<div
					class="absolute inset-0 hidden items-center justify-center bg-stone-900/80 text-[10px] font-bold text-white group-hover:flex"
				>
					{((exclusiveDuration / maxMetric) * 100).toFixed(1)}% Exclusive
				</div>
			</div>

			<span class="ml-2 w-16 text-right font-mono text-[10px] text-stone-600">
				{nodeDuration.toFixed(1)}{isMetricTime ? 'ms' : ''}
			</span>
		</div>
	</div>

	{#if expanded}
		<div
			class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 rounded border border-stone-200 bg-stone-50 p-3 text-xs shadow-sm"
			style="margin-left: {depth * 1.5 + 1.5}rem;"
		>
			<div class="col-span-2 mb-2 flex justify-between border-b border-stone-200 pb-1">
				<span class="font-medium text-stone-500">Rows (Plan / Actual):</span>
				<span class="font-mono font-bold text-stone-800">
					{node['Plan Rows'] || 0} / {node['Actual Rows'] || 'N/A'}
				</span>
			</div>

			{#each primitiveKeys as key}
				<div class="flex justify-between border-b border-stone-200/50 pb-1">
					<span class="font-medium text-stone-500">{key}:</span>
					<span class="max-w-[60%] text-right font-mono break-words text-stone-800"
						>{node[key]}</span
					>
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if node.Plans && node.Plans.length > 0}
	{#each node.Plans as childPlan}
		<svelte:self node={childPlan} {maxMetric} {isMetricTime} depth={depth + 1} />
	{/each}
{/if}
