<script>
	import { onMount } from 'svelte';

	// Svelte 5 reactive table array
	let rows = $state([
		{ id: 1, invoice: '$100', currentVal: 100, statusA: 'idle' },
		{ id: 2, invoice: '$200', currentVal: 200, statusA: 'idle' },
		{ id: 3, invoice: '$300', currentVal: 300, statusA: 'idle' },
		{ id: 4, invoice: '$400', currentVal: 400, statusA: 'idle' },
		{ id: 5, invoice: '$500', currentVal: 500, statusA: 'idle' }
	]);

	let isReaderAActive = $state(false);
	let currentSum = $state(0);
	let dynamicAddition = $state({ text: '', key: 0 });

	let isRunning = false;
	let currentTimeoutIds = [];

	onMount(() => {
		isRunning = true;
		triggerSimulation();
		return () => {
			isRunning = false;
			clearAllTimeouts();
		};
	});

	function delay(ms) {
		return new Promise((resolve) => {
			const id = setTimeout(resolve, ms);
			currentTimeoutIds.push(id);
		});
	}

	function clearAllTimeouts() {
		currentTimeoutIds.forEach((id) => clearTimeout(id));
		currentTimeoutIds = [];
	}

	function resetSimulationState() {
		clearAllTimeouts();
		isReaderAActive = false;
		currentSum = 0;
		dynamicAddition = { text: '', key: Math.random() };

		rows[0].invoice = '$100';
		rows[0].currentVal = 100;
		rows[1].invoice = '$200';
		rows[1].currentVal = 200;
		rows[2].invoice = '$300';
		rows[2].currentVal = 300;
		rows[3].invoice = '$400';
		rows[3].currentVal = 400;
		rows[4].invoice = '$500';
		rows[4].currentVal = 500;

		rows.forEach((row) => {
			row.statusA = 'idle';
		});
	}

	async function triggerSimulation() {
		// Clear anything running and restart the persistent loop
		resetSimulationState();
		isRunning = true;

		// Infinite loop to keep the animation going
		while (isRunning) {
			await runSimulation();
			if (isRunning) {
				// Short break between loop cycles
				await delay(1500);
				resetSimulationState();
			}
		}
	}

	async function runSimulation() {
		isReaderAActive = true;

		// --- ROW 1 ---
		rows[0].statusA = 'reading';
		await delay(1000);
		if (!isRunning) return;
		currentSum += rows[0].currentVal;
		dynamicAddition = { text: `+${rows[0].currentVal}`, key: Math.random() };
		rows[0].statusA = 'idle';

		// --- ROW 2 ---
		rows[1].statusA = 'reading';
		await delay(1000);
		if (!isRunning) return;
		currentSum += rows[1].currentVal;
		dynamicAddition = { text: `+${rows[1].currentVal}`, key: Math.random() };
		rows[1].statusA = 'idle';

		// --- ROW 3 ---
		rows[2].statusA = 'reading';
		await delay(1000);
		if (!isRunning) return;
		currentSum += rows[2].currentVal;
		dynamicAddition = { text: `+${rows[2].currentVal}`, key: Math.random() };
		rows[2].statusA = 'idle';

		// --- ROW 4 ---
		rows[3].statusA = 'reading';
		await delay(1000);
		if (!isRunning) return;
		currentSum += rows[3].currentVal;
		dynamicAddition = { text: `+${rows[3].invoice}`, key: Math.random() };
		rows[3].statusA = 'idle';

		// --- ROW 5 ---
		rows[4].statusA = 'reading';
		await delay(1000);
		if (!isRunning) return;
		currentSum += rows[4].currentVal;
		dynamicAddition = { text: `+${rows[4].currentVal}`, key: Math.random() };
		rows[4].statusA = 'idle';

		isReaderAActive = false;
	}
</script>

<div
	onclick={triggerSimulation}
	class="container"
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && triggerSimulation()}
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Aggregate: Add Column Data to State
	</h5>

	<div class="playground">
		<div class="table-wrapper">
			<table class="simulation-table">
				<thead>
					<tr>
						<th style="width: 70px;">ID</th>
						<th>Invoice Value</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row (row.id)}
						<tr class={row.statusA === 'reading' ? 'has-reader-a' : ''}>
							<td class="row-id">[{row.id}]</td>
							<td class="invoice-amount">{row.invoice}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="pipeline-center">
			<div class="agg-node">SUM</div>
			{#key dynamicAddition.key}
				{#if dynamicAddition.text}
					<span class="floating-math">{dynamicAddition.text}</span>
				{/if}
			{/key}
		</div>

		<div class="state-column">
			<div class="state-header">Accumulated State</div>
			<div class="state-card {currentSum > 0 ? 'pulse-green' : ''}">
				{currentSum.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
					maximumFractionDigits: 0
				})}
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		max-width: 850px;
		margin: 2rem auto;
		padding: 1.75rem;
		position: relative;
		background-color: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
		cursor: pointer;
		user-select: none;
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.container:hover {
		background-color: #f3f4f6;
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
	}

	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.panel-label {
		font-size: 0.75rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #4b5563;
		line-height: 1.2;
	}

	.sub-label {
		font-size: 0.65rem;
		color: #9ca3af;
		font-weight: 500;
	}

	.indicators {
		display: flex;
		gap: 0.5rem;
	}

	.indicator {
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
		font-size: 0.8rem;
		font-weight: 700;
		background-color: #e5e7eb;
		color: #9ca3af;
		transition: all 0.2s ease;
	}

	.indicator.active-a {
		background-color: #ea580c;
		color: white;
	}

	.playground {
		display: grid;
		grid-template-columns: 1.2fr 0.6fr 1fr;
		align-items: center;
		gap: 1.5rem;
		background: #ffffff;
		border: 1px solid #f0f0f0;
		border-radius: 12px;
		padding: 1rem;
	}

	.table-wrapper {
		width: 100%;
	}

	.simulation-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0 0.5rem;
	}

	.simulation-table th {
		text-align: left;
		padding: 0.25rem 0.75rem;
		color: #6b7280;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.simulation-table tr {
		background-color: #fafafa;
	}

	.simulation-table td {
		padding: 0.75rem;
		border-top: 3px solid transparent;
		border-bottom: 3px solid transparent;
		font-size: 0.9rem;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.simulation-table td:first-child {
		border-left: 3px solid transparent;
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
		font-family: monospace;
		font-weight: bold;
		color: #9ca3af;
	}

	.simulation-table td:last-child {
		border-right: 3px solid transparent;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
	}

	.invoice-amount {
		font-weight: 600;
		color: #1f2937;
	}

	.pipeline-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100%;
	}

	.agg-node {
		display: flex;
		width: 64px;
		height: 64px;
		align-items: center;
		justify-content: center;
		background-color: #f3e8ff;
		border: 3px solid #a855f7;
		color: #7e22ce;
		border-radius: 50%;
		font-weight: 900;
		font-size: 0.85rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
	}

	.floating-math {
		position: absolute;
		font-family: monospace;
		font-weight: 800;
		font-size: 1.1rem;
		color: #a855f7;
		animation: float-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@keyframes float-up {
		0% {
			opacity: 0;
			transform: translateY(10px) scale(0.8);
		}
		20% {
			opacity: 1;
			transform: translateY(-20px) scale(1.1);
		}
		100% {
			opacity: 0;
			transform: translateY(-55px) scale(0.95);
		}
	}

	.state-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.state-header {
		font-size: 0.7rem;
		font-weight: bold;
		text-transform: uppercase;
		color: #3b82f6;
		letter-spacing: 0.02em;
	}

	.state-card {
		width: 140px;
		height: 54px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #eff6ff;
		border: 2px solid #bfdbfe;
		color: #1e40af;
		border-radius: 8px;
		font-family: monospace;
		font-size: 1.25rem;
		font-weight: 800;
	}

	.pulse-green {
		animation: value-flash 0.4s ease-out;
	}

	@keyframes value-flash {
		0% {
			background-color: #eff6ff;
			border-color: #bfdbfe;
		}
		40% {
			background-color: #dcfce7;
			border-color: #4ade80;
			color: #166534;
			transform: scale(1.04);
		}
		100% {
			background-color: #eff6ff;
			border-color: #bfdbfe;
			color: #1e40af;
			transform: scale(1);
		}
	}

	/* Reader A Visual Highlights */
	.has-reader-a td {
		background-color: #fff7ed !important;
		border-top-color: #ea580c !important;
		border-bottom-color: #ea580c !important;
	}
	.has-reader-a td:first-child {
		border-left-color: #ea580c !important;
	}
	.has-reader-a td:last-child {
		border-right-color: #ea580c !important;
	}

	.click-hint {
		text-align: center;
		font-size: 0.75rem;
		color: #9ca3af;
		margin-top: 1.25rem;
		font-weight: 500;
	}
</style>
