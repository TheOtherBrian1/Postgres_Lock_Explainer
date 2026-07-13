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
			u1Class: ACTIVE_R1, // Reader 1 (96)
			u2Class: FADED, // Writer 2 (97)

			// Reader 1 reads Row 1 and Row 2
			row1Class: 'bg-blue-50/40 border-l-4 border-blue-500',
			row2Class: 'bg-blue-50/40 border-l-4 border-blue-500',
			showRow3: false,
			row3Class: '',
			row4Class: 'bg-white border-l-4 border-stone-200',

			infoBoxClass: 'bg-blue-50 border border-blue-200 text-blue-800',
			infoTitle: 'Transaction 96 Reads Row 1 and Row 2',
			iconColor: 'text-blue-500'
		},
		{
			u1Class: FADED,
			u2Class: ACTIVE_W2, // Writer 2 (97)

			// Writer 2 creates/inserts Row 3
			row1Class: 'bg-white border-l-4 border-stone-200 opacity-40',
			row2Class: 'bg-white border-l-4 border-stone-200 opacity-40',
			showRow3: true,
			row3Class: 'bg-orange-50/40 border-l-4 border-[#ff3e00]',
			row4Class: 'bg-white border-l-4 border-stone-200 opacity-40',

			infoBoxClass: 'bg-orange-50 border border-orange-200 text-orange-900',
			infoTitle: 'Transaction 97 creates Row 3',
			iconColor: 'text-[#ff3e00]'
		},
		{
			u1Class: ACTIVE_R1, // Reader 1 (96)
			u2Class: FADED,

			// Reader 1 encounters Row 3, sees a newer xmin, and ignores it
			row1Class: 'bg-white border-l-4 border-stone-200 opacity-40',
			row2Class: 'bg-white border-l-4 border-stone-200 opacity-40',
			showRow3: true,
			row3Class: 'bg-red-50 border-l-4 border-red-500 font-bold text-red-900',
			row4Class: 'bg-white border-l-4 border-stone-200 opacity-40',

			infoBoxClass: 'bg-red-50 border border-red-200 text-red-800',
			infoTitle: 'Transaction 96 notices Row 3 XMIN is newer and ignores it',
			iconColor: 'text-red-500'
		},
		{
			u1Class: ACTIVE_R1, // Reader 1 (96)
			u2Class: FADED,

			// Reader 1 continues on to read Row 4
			row1Class: 'bg-white border-l-4 border-stone-200 opacity-40',
			row2Class: 'bg-white border-l-4 border-stone-200 opacity-40',
			showRow3: true,
			row3Class: 'bg-white border-l-4 border-stone-200 opacity-40',
			row4Class: 'bg-blue-50/40 border-l-4 border-blue-500',

			infoBoxClass: 'bg-blue-50 border border-blue-200 text-blue-800',
			infoTitle: 'Transaction 96 Continues Scanning onto Row 4',
			iconColor: 'text-blue-500'
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
					<tr
						class="{stages[currentStage]
							.row1Class} border-b border-stone-100 transition-all duration-300"
					>
						<td class="bg-stone-50/40 px-3 py-2 text-center text-stone-400">1</td>
						<td class="px-3 py-2 whitespace-nowrap"
							><span class="font-bold text-stone-800">$150</span></td
						>
						<td class="px-3 py-2 text-center font-bold text-stone-500">95</td>
						<td class="px-3 py-2 text-center text-stone-400">0</td>
						<td class="px-3 py-2 text-right"
							><span
								class="rounded bg-blue-100 px-1 py-0.5 font-sans text-[9px] font-bold tracking-wide text-blue-600 uppercase"
								>V1</span
							></td
						>
					</tr>

					<tr
						class="{stages[currentStage]
							.row2Class} border-b border-stone-100 transition-all duration-300"
					>
						<td class="bg-stone-50/40 px-3 py-2 text-center text-stone-400">2</td>
						<td class="px-3 py-2 whitespace-nowrap"
							><span class="font-bold text-stone-800">$450</span></td
						>
						<td class="px-3 py-2 text-center font-bold text-stone-500">95</td>
						<td class="px-3 py-2 text-center text-stone-400">0</td>
						<td class="px-3 py-2 text-right"
							><span
								class="rounded bg-blue-100 px-1 py-0.5 font-sans text-[9px] font-bold tracking-wide text-blue-600 uppercase"
								>V1</span
							></td
						>
					</tr>

					{#if stages[currentStage].showRow3}
						<tr
							class="{stages[currentStage]
								.row3Class} border-b border-stone-100 transition-all duration-300"
						>
							<td class="bg-stone-50/40 px-3 py-2 text-center text-stone-400">3</td>
							<td class="px-3 py-2 whitespace-nowrap"
								><span class="font-bold text-stone-800">$300</span></td
							>
							<td class="px-3 py-2 text-center font-bold text-orange-600">97</td>
							<td class="px-3 py-2 text-center text-stone-400">0</td>
							<td class="px-3 py-2 text-right">
								<span
									class="rounded px-1 py-0.5 font-sans text-[9px] font-bold tracking-wide uppercase {stages[
										currentStage
									].row3Class.includes('text-red-900')
										? 'bg-red-100 text-red-600'
										: 'bg-orange-100 text-[#ff3e00]'}"
								>
									{stages[currentStage].row3Class.includes('text-red-900') ? 'Invisible' : 'New'}
								</span>
							</td>
						</tr>
					{/if}

					<tr class="{stages[currentStage].row4Class} transition-all duration-300">
						<td class="bg-stone-50/40 px-3 py-2 text-center text-stone-400">4</td>
						<td class="px-3 py-2 whitespace-nowrap"
							><span class="font-bold text-stone-800">$200</span></td
						>
						<td class="px-3 py-2 text-center font-bold text-stone-500">95</td>
						<td class="px-3 py-2 text-center text-stone-400">0</td>
						<td class="px-3 py-2 text-right"
							><span
								class="rounded bg-blue-100 px-1 py-0.5 font-sans text-[9px] font-bold tracking-wide text-blue-600 uppercase"
								>V1</span
							></td
						>
					</tr>
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
				<div class="text-xs font-bold tracking-wide">{stages[currentStage].infoTitle}</div>
			</div>
		</div>
	</div>
</div>
