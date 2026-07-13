<script lang="ts">
	let currentStage = $state(0);

	// Compact Presentation Helpers
	const FADED = 'opacity-30 scale-95 border-stone-200 text-stone-400 bg-stone-100';
	const ACTIVE_R1 =
		'opacity-100 scale-100 font-bold border-blue-400 bg-blue-500 text-white shadow-sm';
	const ACTIVE_W2 =
		'opacity-100 scale-100 font-bold border-orange-500 bg-[#ff3e00] text-white shadow-sm';
	const ACTIVE_R2 =
		'opacity-100 scale-100 font-bold border-green-500 bg-green-600 text-white shadow-sm';

	const stages = [
		{
			// Dynamic Minimal Badge Styles
			u1Class: ACTIVE_R1, // Reader 1
			u2Class: FADED, // Writer 2
			u3Class: FADED, // Reader 2

			// Row Visibility
			showOldRow: true,
			showNewRow: true,

			// Row 1 MVCC Data
			oldRowClass: 'bg-blue-50/40 border-l-4 border-blue-500',
			oldRowContent: '$150',
			oldXmin: '95',
			oldXmax: '0',
			oldRowDead: false,

			// Row 2 MVCC Data
			newRowClass: 'bg-white border-l-4 border-stone-200',
			newRowContent: '$450',
			newXmin: '95',
			newXmax: '0',
			newRowReading: false,
			newRowFinal: false,

			// Bottom Interactive Text Metadata info box
			infoBoxClass: 'bg-blue-50 border border-blue-200 text-blue-800',
			infoTitle: 'Transaction 96 Reads Rows',
			infoText: '',
			iconColor: 'text-blue-500'
		},
		{
			u1Class: FADED,
			u2Class: ACTIVE_W2,
			u3Class: FADED,

			showOldRow: true,
			showNewRow: true,

			oldRowClass: 'bg-orange-50/40 border-l-4 border-[#ff3e00]',
			oldRowContent: '$150',
			oldXmin: '95',
			oldXmax: '96', // Stamped by deleting transaction
			oldRowDead: false,

			newRowClass: 'bg-white border-l-4 border-stone-200 opacity-60',
			newRowContent: '$450',
			newXmin: '95',
			newXmax: '0',
			newRowReading: false,
			newRowFinal: false,

			infoBoxClass: 'bg-orange-50 border border-orange-200 text-orange-900',
			infoTitle: 'Transaction 96 soft-deletes row 1',
			infoText: '',
			iconColor: 'text-[#ff3e00]'
		},
		{
			u1Class: FADED,
			u2Class: FADED,
			u3Class: ACTIVE_R2,

			showOldRow: true,
			showNewRow: true,

			oldRowClass: 'bg-red-50 border-l-4 border-red-500 font-bold text-red-900',
			oldRowContent: '$150',
			oldXmin: '95',
			oldXmax: '96',
			oldRowDead: true,

			newRowClass: 'bg-white border-l-4 border-stone-200 opacity-40',
			newRowContent: '$450',
			newXmin: '95',
			newXmax: '0',
			newRowReading: false,
			newRowFinal: false,

			infoBoxClass: 'bg-red-50 border border-red-200 text-red-800',
			infoTitle: 'Transaction 97 sees an older XMAX, so it ignores it',
			infoText: '',
			iconColor: 'text-red-500'
		},
		{
			u1Class: FADED,
			u2Class: FADED,
			u3Class: ACTIVE_R2,

			showOldRow: true,
			showNewRow: true,

			oldRowClass:
				'bg-stone-100 opacity-30 border-l-4 border-stone-300 line-through decoration-stone-400',
			oldRowContent: '$150',
			oldXmin: '95',
			oldXmax: '96',
			oldRowDead: true,

			newRowClass: 'bg-green-50/40 border-l-4 border-green-500 font-bold text-green-900',
			newRowContent: '$450',
			newXmin: '95',
			newXmax: '0',
			newRowReading: true,
			newRowFinal: true,

			infoBoxClass: 'bg-green-50 border border-green-200 text-green-800',
			infoTitle: 'Transaction 97 sees no XMAX for row 2 and accepts it',
			infoText: '',
			iconColor: 'text-green-500'
		}
	];

	function advanceStage() {
		currentStage = currentStage >= 3 ? 0 : currentStage + 1;
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
		<div class="flex max-w-[70%] flex-wrap items-center gap-1">
			<div
				class="rounded border border-stone-200 bg-stone-100 px-2 py-0.5 font-mono text-[10px] tracking-wider text-stone-400 opacity-40"
			>
				W1 (95)
			</div>
			<div
				class="rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider transition-all duration-300 {stages[
					currentStage
				].u1Class}"
			>
				R1 (96)
			</div>
			<div
				class="rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider transition-all duration-300 {stages[
					currentStage
				].u2Class}"
			>
				W2 (97)
			</div>
			<div
				class="rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider transition-all duration-300 {stages[
					currentStage
				].u3Class}"
			>
				R2 (98)
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

	<div class="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
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
					{#if stages[currentStage].showOldRow}
						<tr
							class="{stages[currentStage]
								.oldRowClass} border-b border-stone-100 transition-all duration-300"
						>
							<td class="bg-stone-50/40 px-3 py-2 text-center text-stone-400">1</td>
							<td class="px-3 py-2 whitespace-nowrap">
								<span
									class={stages[currentStage].oldRowDead
										? 'text-stone-400 line-through'
										: 'font-bold text-stone-800'}
								>
									{stages[currentStage].oldRowContent}
								</span>
							</td>
							<td class="px-3 py-2 text-center font-bold text-blue-700"
								>{stages[currentStage].oldXmin}</td
							>
							<td
								class="px-3 py-2 text-center {stages[currentStage].oldXmax !== '0'
									? 'font-bold text-orange-600'
									: 'text-stone-400'}"
							>
								{stages[currentStage].oldXmax}
							</td>
							<td class="px-3 py-2 text-right">
								<span
									class="rounded px-1 py-0.5 font-sans text-[9px] font-bold tracking-wide uppercase {stages[
										currentStage
									].oldRowDead
										? 'bg-red-100 text-red-600'
										: 'bg-blue-100 text-blue-600'}"
								>
									{stages[currentStage].oldRowDead ? 'Dead' : 'V1'}
								</span>
							</td>
						</tr>
					{/if}

					{#if stages[currentStage].showNewRow}
						<tr class="{stages[currentStage].newRowClass} transition-all duration-300">
							<td class="bg-stone-50/40 px-3 py-2 text-center text-stone-400">2</td>
							<td class="px-3 py-2 whitespace-nowrap">
								<span class="font-bold text-stone-800">
									{stages[currentStage].newRowContent}
								</span>
							</td>
							<td class="px-3 py-2 text-center font-bold text-blue-700"
								>{stages[currentStage].newXmin}</td
							>
							<td class="px-3 py-2 text-center text-stone-400">{stages[currentStage].newXmax}</td>
							<td class="px-3 py-2 text-right">
								<span
									class="rounded px-1 py-0.5 font-sans text-[9px] font-bold tracking-wide uppercase {stages[
										currentStage
									].newRowReading
										? 'bg-green-100 text-green-600'
										: 'bg-blue-100 text-blue-600'}"
								>
									{stages[currentStage].newRowFinal ? 'Live' : 'V1'}
								</span>
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
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<div>
				<div class="mb-0.5 text-xs font-bold tracking-wide">{stages[currentStage].infoTitle}</div>
				<div class="text-[11.5px] leading-relaxed opacity-90">
					{stages[currentStage].infoText}
				</div>
			</div>
		</div>
	</div>
</div>
