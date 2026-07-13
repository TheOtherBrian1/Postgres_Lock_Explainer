<script>
	import { onMount } from 'svelte';

	// Svelte 5 deep reactivity requires the $state rune
	let rows = $state([
		{ id: 1, invoice: '$100', statusA: 'idle', statusB: 'idle' },
		{ id: 2, invoice: '$200', statusA: 'idle', statusB: 'idle' },
		{ id: 3, invoice: '$300', statusA: 'idle', statusB: 'idle' },
		{ id: 4, invoice: '$480,000', statusA: 'idle', statusB: 'idle' },
		{ id: 5, invoice: '$500', statusA: 'idle', statusB: 'idle' }
	]);

	let isReaderAActive = $state(false);
	let isReaderBActive = $state(false);

	let isRunning = false;
	let currentTimeoutIds = [];

	onMount(() => {
		triggerSimulation();
		return () => clearAllTimeouts();
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
		isReaderBActive = false;
		rows.forEach((row) => {
			row.statusA = 'idle';
			row.statusB = 'idle';
		});
	}

	async function triggerSimulation() {
		if (isRunning) {
			resetSimulationState();
			await new Promise((r) => setTimeout(r, 50));
		}

		isRunning = true;
		resetSimulationState();
		await runSimulation();
		isRunning = false;
	}

	async function runSimulation() {
		// --- READER A STARTS ---
		isReaderAActive = true;

		// Reader A scans Row 1
		rows[0].statusA = 'reading';
		await delay(1000);
		if (!isRunning) return;
		rows[0].statusA = 'idle';

		// Reader A scans Row 2
		rows[1].statusA = 'reading';
		await delay(1000);
		if (!isRunning) return;
		rows[1].statusA = 'idle';

		// Reader A reaches Row 3 and stays permanently
		rows[2].statusA = 'reading';
		await delay(1200);
		if (!isRunning) return;

		// --- READER B STARTS ---
		isReaderBActive = true;

		// Reader B scans Row 1
		rows[0].statusB = 'reading';
		await delay(1000);
		if (!isRunning) return;
		rows[0].statusB = 'idle';

		// Reader B scans Row 2
		rows[1].statusB = 'reading';
		await delay(1000);
		if (!isRunning) return;
		rows[1].statusB = 'idle';

		// Reader B reaches Row 3 -> OVERLAP ZONE
		rows[2].statusB = 'reading';
		await delay(2500);
		if (!isRunning) return;

		// Reader B leaves Row 3 (Reader A remains locked on 'reading')
		rows[2].statusB = 'idle';

		// Reader B continues to Row 4
		rows[3].statusB = 'reading';
		await delay(1000);
		if (!isRunning) return;
		rows[3].statusB = 'idle';

		// Reader B scans Row 5
		rows[4].statusB = 'reading';
		await delay(1000);
		if (!isRunning) return;
		rows[4].statusB = 'idle';

		isReaderBActive = false;
	}
</script>

<div
	onclick={triggerSimulation}
	class="container"
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && triggerSimulation()}
>
	<div class="indicators">
		<div class="indicator reader-a {isReaderAActive ? 'active-a' : ''}">Reader A</div>
		<div class="indicator reader-b {isReaderBActive ? 'active-b' : ''}">Reader B</div>
	</div>

	<div class="table-wrapper">
		<table class="simulation-table">
			<thead>
				<tr>
					<th style="width: 100px;">ID</th>
					<th>Invoice</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as row (row.id)}
					<tr
						class="
							{row.statusA === 'reading' ? 'has-reader-a' : ''} 
							{row.statusB === 'reading' ? 'has-reader-b' : ''}
						"
					>
						<td class="row-id">[{row.id}]</td>
						<td class="invoice-amount">{row.invoice}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.container {
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		max-width: 600px;
		margin: 2rem auto;
		padding: 1.5rem;
		position: relative;
		background-color: #f9fafb;
		border: 1px dashed #d1d5db;
		border-radius: 12px;
		cursor: pointer;
		user-select: none;
		transition: background-color 0.2s ease;
	}

	.container:hover {
		background-color: #f3f4f6;
	}

	/* Top Right Indicators Styling */
	.indicators {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		display: flex;
		gap: 0.5rem;
	}

	.indicator {
		padding: 0.4rem 0.8rem;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: 600;
		background-color: #e5e7eb;
		color: #9ca3af;
		transition: all 0.3s ease;
	}

	.indicator.active-a {
		background-color: #ea580c;
		color: white;
	}

	.indicator.active-b {
		background-color: #2563eb;
		color: white;
	}

	/* Table Layout Styling */
	.table-wrapper {
		margin-top: 3.5rem;
	}

	.simulation-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0 0.75rem;
	}

	.simulation-table th {
		text-align: left;
		padding: 0.5rem 1rem;
		color: #4b5563;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.simulation-table tr {
		background-color: #ffffff;
		transition: background-color 0.2s ease;
	}

	.simulation-table td {
		padding: 1rem;
		border-top: 3px solid transparent;
		border-bottom: 3px solid transparent;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.simulation-table td:first-child {
		border-left: 3px solid transparent;
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
	}

	.simulation-table td:last-child {
		border-right: 3px solid transparent;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
	}

	.row-id {
		font-family: monospace;
		color: #6b7280;
		font-weight: bold;
	}

	.invoice-amount {
		font-weight: 500;
	}

	/* --- HIGHLIGHT STATES --- */

	/* Reader A Style Rules (Orange Inline Borders & Background) */
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

	/* Reader B Style Rules (Blue Exterior Outline) */
	.has-reader-b {
		outline: 4px solid #2563eb;
		outline-offset: 2px;
		border-radius: 6px;
	}

	/* Reader B Blue Background (ONLY applied when A is not on the row) */
	tr.has-reader-b:not(.has-reader-a) td {
		background-color: #eff6ff;
	}

	.click-hint {
		text-align: center;
		font-size: 0.8rem;
		color: #6b7280;
		margin-top: 1.5rem;
	}
</style>
