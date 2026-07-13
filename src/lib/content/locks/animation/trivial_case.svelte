<script>
	import { onMount } from 'svelte';

	// Trimmed down to 3 initial rows
	let rows = [
		{ id: 1, text: 'Row 1: Initial Data', status: 'idle' },
		{ id: 2, text: 'Row 2: Initial Data', status: 'idle' },
		{ id: 3, text: 'Row 3: Initial Data', status: 'idle' }
	];

	let currentStage = 'Read'; // 'Read' | 'Write' | 'Maintenance' | 'Done'
	let extraColumnAdded = false;

	onMount(() => {
		runSimulation();
	});

	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	async function runSimulation() {
		// --- 1. READ STAGE ---
		currentStage = 'Read';
		for (let i = 0; i < rows.length; i++) {
			rows[i].status = 'reading';
			await delay(800);
			rows[i].status = 'idle';
		}

		// --- 2. WRITE STAGE ---
		currentStage = 'Write';
		await delay(600);

		// Delete Row 1 (Index 0)
		rows[0].status = 'writing';
		rows[0].text = 'Row 1: Deleting...';
		await delay(1000);
		rows = rows.filter((_, i) => i !== 0); // Remove row 1

		// Update Row 2 (Now at Index 0 after deletion)
		rows[0].status = 'writing';
		rows[0].text = 'Row 2: Updating...'; // Initial update state
		await delay(800); // Pause between updating and updated
		rows[0].text = 'Row 2: Updated'; // Final updated state
		await delay(1000);
		rows[0].status = 'idle';

		// Insert Row 3 (Inserting a new row at index 2)
		rows = [
			...rows.slice(0, 2),
			{ id: 4, text: 'Row 3: Inserting...', status: 'writing' },
			...rows.slice(2)
		];
		await delay(1000);
		rows[2].text = 'Row 3: Inserted';
		rows[2].status = 'idle';

		// --- 3. MAINTENANCE STAGE ---
		await delay(600);
		currentStage = 'Maintenance';
		await delay(600);

		// ALTER TABLE: Add a column simulation
		extraColumnAdded = true;
		rows = rows.map((row) => ({
			...row,
			status: 'maintenance'
		}));
		await delay(1500);

		// Reset maintenance highlight after completion
		rows = rows.map((row) => ({ ...row, status: 'idle' }));
		currentStage = 'Done';
	}
</script>

<div class="container">
	<div class="indicators">
		<div class="indicator {currentStage === 'Read' ? 'active-read' : ''}">Read</div>
		<div class="indicator {currentStage === 'Write' ? 'active-write' : ''}">Write</div>
		<div class="indicator {currentStage === 'Maintenance' ? 'active-maintenance' : ''}">
			Maintenance
		</div>
	</div>

	<div class="table-wrapper">
		<table class="simulation-table">
			<thead>
				<tr>
					<th style="width: 80px;">ID</th>
					<th>Data Content</th>
					{#if extraColumnAdded}
						<th class="new-column-header">New Column (ALTER)</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each rows as row (row.id)}
					<tr
						class="{row.status === 'reading' ? 'highlight-read' : ''} 
                               {row.status === 'writing' ? 'highlight-write' : ''} 
                               {row.status === 'maintenance' ? 'highlight-maintenance' : ''}"
					>
						<td class="row-id">[{row.id}]</td>
						<td>{row.text}</td>
						{#if extraColumnAdded}
							<td class="extra-cell">
								<span class="status-badge">Active</span>
							</td>
						{/if}
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
		max-width: 800px;
		margin: 2rem auto;
		padding: 1rem;
		position: relative;
	}

	/* Top Right Indicators Styling */
	.indicators {
		position: absolute;
		top: 0;
		right: 1rem;
		display: flex;
		gap: 0.5rem;
	}

	.indicator {
		padding: 0.4rem 0.8rem;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: 600;
		background-color: #f3f4f6;
		color: #9ca3af;
		transition: all 0.3s ease;
	}

	.indicator.active-read {
		background-color: #10b981;
		color: white;
	}

	.indicator.active-write {
		background-color: #f97316;
		color: white;
	}

	.indicator.active-maintenance {
		background-color: #3b82f6;
		color: white;
	}

	/* Table Layout Styling */
	.table-wrapper {
		margin-top: 3.5rem;
	}

	.simulation-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0 0.5rem;
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
		transition: all 0.25s ease;
	}

	.simulation-table td {
		padding: 1rem;
		border-top: 1px solid #e5e7eb;
		border-bottom: 1px solid #e5e7eb;
	}

	.simulation-table td:first-child {
		border-left: 1px solid #e5e7eb;
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
	}

	.simulation-table td:last-child {
		border-right: 1px solid #e5e7eb;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
	}

	.row-id {
		font-family: monospace;
		color: #6b7280;
		font-weight: bold;
	}

	/* Dynamic Table Row Highlight States */
	.highlight-read td {
		background-color: #ecfdf5;
		border-color: #10b981;
	}
	.highlight-read td:first-child {
		border-left-color: #10b981;
	}
	.highlight-read td:last-child {
		border-right-color: #10b981;
	}

	.highlight-write td {
		background-color: #fff7ed;
		border-color: #f97316;
	}
	.highlight-write td:first-child {
		border-left-color: #f97316;
	}
	.highlight-write td:last-child {
		border-right-color: #f97316;
	}

	.highlight-maintenance td {
		background-color: #eff6ff;
		border-color: #3b82f6;
	}
	.highlight-maintenance td:first-child {
		border-left-color: #3b82f6;
	}
	.highlight-maintenance td:last-child {
		border-right-color: #3b82f6;
	}

	/* Added Alter Table Elements */
	.new-column-header {
		color: #1e40af !important;
		animation: fadeIn 0.5s ease forwards;
	}

	.extra-cell {
		animation: fadeIn 0.5s ease forwards;
	}

	.status-badge {
		background-color: #dbeafe;
		color: #1e40af;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: bold;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
