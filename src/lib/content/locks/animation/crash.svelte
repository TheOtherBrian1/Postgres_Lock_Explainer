<script lang="ts">
	let currentStage = $state(0);

	// Compact Presentation Helpers
	const FADED = 'opacity-30 scale-95 border-stone-200 text-stone-400 bg-stone-100';
	const ACTIVE_R1 =
		'opacity-100 scale-100 font-bold border-blue-400 bg-blue-500 text-white shadow-sm';
	const ACTIVE_W2 =
		'opacity-100 scale-100 font-bold border-orange-500 bg-[#ff3e00] text-white shadow-sm';

	const stages = [
		{
			u1Class: ACTIVE_R1, // Reader 1 (95)
			u2Class: FADED, // Writer 2 (96)

			// Table Structure State
			showTableRows: true,
			showEmptyVoid: false,
			isCrashed: false,

			// Row Visual State Classes
			row1Class: 'bg-blue-50/40 border-l-4 border-blue-500',
			row2Class: 'bg-white border-l-4 border-stone-200 opacity-60',

			infoBoxClass: 'bg-blue-50 border border-blue-200 text-blue-800',
			infoTitle: 'Transaction 95 is reading from the table',
			iconColor: 'text-blue-500'
		},
		{
			u1Class: FADED,
			u2Class: ACTIVE_W2, // Writer 2 (96)

			showTableRows: false,
			showEmptyVoid: true,
			isCrashed: false,

			row1Class: '',
			row2Class: '',

			infoBoxClass: 'bg-orange-50 border border-orange-200 text-orange-900',
			infoTitle: 'Transaction 96 Drops the table',
			iconColor: 'text-[#ff3e00]'
		},
		{
			u1Class: ACTIVE_R1, // Reader 1 (95)
			u2Class: FADED,

			showTableRows: false,
			showEmptyVoid: true,
			isCrashed: true, // Triggers engine failure color palette shifts

			row1Class: '',
			row2Class: '',

			infoBoxClass: 'bg-red-50 border border-red-200 text-red-900 font-bold animate-pulse',
			infoTitle: 'Transaction 95 continues reading the void and crashes',
			iconColor: 'text-red-600'
		}
	];

	function advanceStage() {
		currentStage = currentStage >= 2 ? 0 : currentStage + 1;
	}
</script>

<div
	onclick={advanceStage}
	class="mt-4 mb-6 cursor-pointer rounded-xl border border-stone-200 bg-stone-50/30 p-4 font-sans text-stone-600 shadow-md transition-colors select-none hover:border-stone-300 md:p-6"
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && advanceStage()}
>
	<div class="mb-4 flex items-center justify-between gap-2">
		<div class="flex max-w-[75%] flex-wrap items-center gap-1">
			<div
				class="rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider transition-all duration-300 {stages[
					currentStage
				].u1Class}"
			>
				R1 (95)
			</div>
			<div
				class="rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider transition-all duration-300 {stages[
					currentStage
				].u2Class}"
			>
				W2 (96)
			</div>
		</div>

		<div
			class="flex items-center gap-1.5 text-right font-mono text-[10px] font-bold tracking-wider whitespace-nowrap text-stone-500 uppercase"
		>
			<svg
				class="xs:block hidden h-3.5 w-3.5 text-stone-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
				></path>
			</svg>
			<span>heap blocks</span>
		</div>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-colors duration-300 {stages[
			currentStage
		].isCrashed
			? 'border-red-300 bg-red-50/10'
			: ''}"
	>
		<div class="overflow-x-auto">
			<table class="w-full border-collapse text-left">
				<thead
					class="bg-stone-100 font-mono text-[10px] font-bold tracking-wide text-stone-500 uppercase"
				>
					<tr>
						<th class="w-10 border-b border-stone-200 px-3 py-2 text-center">ID</th>
						<th class="border-b border-stone-200 px-3 py-2">Invoice</th>
						<th class="w-20 border-b border-stone-200 px-3 py-2 text-center">XMIN</th>
						<th class="w-20 border-b border-stone-200 px-3 py-2 text-center">XMAX</th>
						<th class="w-16 border-b border-stone-200 px-3 py-2 text-right">Ver</th>
					</tr>
				</thead>
				<tbody class="font-mono text-xs">
					{#if stages[currentStage].showTableRows}
						<tr
							class="{stages[currentStage]
								.row1Class} border-b border-stone-100 transition-all duration-300"
						>
							<td class="bg-stone-50/40 px-3 py-2 text-center text-stone-400">1</td>
							<td class="px-3 py-2 whitespace-nowrap"
								><span class="font-bold text-stone-800">$150</span></td
							>
							<td class="px-3 py-2 text-center font-bold text-stone-500">90</td>
							<td class="px-3 py-2 text-center text-stone-400">0</td>
							<td class="px-3 py-2 text-right"
								><span
									class="rounded bg-blue-100 px-1 py-0.5 font-sans text-[9px] font-bold tracking-wide text-blue-600 uppercase"
									>V1</span
								></td
							>
						</tr>

						<tr class="{stages[currentStage].row2Class} transition-all duration-300">
							<td class="bg-stone-50/40 px-3 py-2 text-center text-stone-400">2</td>
							<td class="px-3 py-2 whitespace-nowrap"
								><span class="font-bold text-stone-800">$450</span></td
							>
							<td class="px-3 py-2 text-center font-bold text-stone-500">90</td>
							<td class="px-3 py-2 text-center text-stone-400">0</td>
							<td class="px-3 py-2 text-right"
								><span
									class="rounded bg-blue-100 px-1 py-0.5 font-sans text-[9px] font-bold tracking-wide text-blue-600 uppercase"
									>V1</span
								></td
							>
						</tr>
					{/if}

					{#if stages[currentStage].showEmptyVoid}
						<tr
							class="transition-all duration-300 {stages[currentStage].isCrashed
								? 'bg-red-50 text-red-700'
								: 'bg-stone-50 text-stone-400'}"
						>
							<td colspan="5" class="px-4 py-6 text-center font-mono text-[11px] tracking-wide">
								{#if stages[currentStage].isCrashed}
									<span class="font-bold"
										>💥 FATAL: relation "invoices" does not exist at block offset</span
									>
								{:else}
									<span class="italic">[Relation Dropped: Memory Unallocated]</span>
								{/if}
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<div
		class="mt-4 rounded-xl p-3.5 transition-colors duration-300 {stages[currentStage].infoBoxClass}"
	>
		<div class="flex items-start gap-2.5">
			<svg
				class="mt-0.5 h-4.5 w-4.5 shrink-0 {stages[currentStage].iconColor}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				{#if stages[currentStage].isCrashed}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					></path>
				{:else}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				{/if}
			</svg>
			<div>
				<div class="text-xs font-bold tracking-wide">{stages[currentStage].infoTitle}</div>
			</div>
		</div>
	</div>
</div>
