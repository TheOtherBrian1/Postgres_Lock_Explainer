<script>
	import PlanViewer from './PlanViewer.svelte';

	// Store the raw string input
	let jsonInput = '';

	// Store the parsed object and any potential errors
	let planData = null;
	let jsonError = '';

	// Reactively attempt to parse the JSON whenever the input changes
	$: {
		if (!jsonInput.trim()) {
			planData = null;
			jsonError = '';
		} else {
			try {
				planData = JSON.parse(jsonInput);
				jsonError = '';
			} catch (err) {
				planData = null;
				jsonError = 'Invalid JSON format: ' + err.message;
			}
		}
	}

	// Optional: A helper to load a sample plan to test the UI quickly
	function loadSample() {
		jsonInput = `[{"Plan":{"Node Type":"Limit","Parallel Aware":false,"Async Capable":false,"Startup Cost":38227078.3,"Total Cost":38227078.8,"Plan Rows":200,"Plan Width":368,"Actual Startup Time":180.062,"Actual Total Time":180.132,"Actual Rows":200,"Actual Loops":1}}]`;
	}
</script>

<div class="min-h-screen bg-stone-100 p-4 font-sans md:p-8">
	<div class="mx-auto max-w-5xl space-y-6">
		<div class="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h1 class="text-xl font-bold text-stone-900">Postgres Plan Analyzer</h1>
				<button
					class="rounded bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600 transition-colors hover:bg-stone-200"
					on:click={loadSample}
				>
					Load Sample
				</button>
			</div>

			<textarea
				bind:value={jsonInput}
				placeholder="Paste your EXPLAIN (FORMAT JSON) output here..."
				class="h-32 w-full rounded-lg border border-stone-300 bg-stone-50 p-4 font-mono text-sm text-stone-700 shadow-inner transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
				spellcheck="false"
			></textarea>

			{#if jsonError}
				<div
					class="mt-3 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
				>
					{jsonError}
				</div>
			{/if}
		</div>

		{#if planData}
			<PlanViewer {planData} />
		{:else if !jsonError && !jsonInput.trim()}
			<div
				class="flex h-64 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 text-stone-400"
			>
				Awaiting Postgres JSON plan...
			</div>
		{/if}
	</div>
</div>
