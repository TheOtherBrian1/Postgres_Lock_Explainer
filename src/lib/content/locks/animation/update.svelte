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
			// Dynamic Minimal Badge Styles
			u1Class: ACTIVE_R1, // Reader 1
			u2Class: ACTIVE_W2, // Writer 2

			// Row Visibility
			showOldRow: true,
			showNewRow: false,

			// MVCC Table Layout Bindings
			oldRowClass: 'bg-blue-50/40 border-l-4 border-blue-500',
			oldRowContent: 'Bob Odenkirk',
			oldRowDead: false,

			newRowClass: '',
			newRowContent: 'Robert Odenkirk',
			newRowReading: false,
			newRowFinal: false,

			// Core Contextual Descriptive Blocks
			infoBoxClass: 'bg-blue-50 border border-blue-200 text-blue-800',
			infoTitle: 'Reader 1 Reading Original Version',
			infoText: ''
		},
		{
			u1Class: ACTIVE_R1,
			u2Class: ACTIVE_W2,

			showOldRow: true,
			showNewRow: true,

			oldRowClass: 'bg-blue-50/30 border-l-4 border-blue-400 opacity-70',
			oldRowContent: 'Bob Odenkirk',
			oldRowDead: false,

			newRowClass: 'bg-orange-50/40 border-l-4 border-[#ff3e00]',
			newRowContent: 'Robert Odenkirk',
			newRowReading: false,
			newRowFinal: false,

			infoBoxClass: 'bg-orange-50 border border-orange-200 text-orange-900',
			infoTitle: 'Writer 2 Updates row by making a copy',
			infoText: '',
			iconColor: 'text-[#ff3e00]'
		},
		{
			u1Class: ACTIVE_R1,
			u2Class: FADED,

			showOldRow: true,
			showNewRow: true,

			oldRowClass: 'bg-blue-50/20 border-l-4 border-blue-300 opacity-50',
			oldRowContent: 'Bob Odenkirk',
			oldRowDead: false,

			newRowClass: 'bg-green-50/40 border-l-4 border-green-500',
			newRowContent: 'Robert Odenkirk',
			newRowReading: true,
			newRowFinal: false,

			infoBoxClass: 'bg-green-50 border border-green-200 text-green-800',
			infoTitle: 'Writer 2 has committed; new reads can access current commits',
			infoText: '',
			iconColor: 'text-green-500'
		},
		{
			u1Class: FADED,
			u2Class: FADED,

			showOldRow: true,
			showNewRow: true,

			oldRowClass:
				'bg-stone-100 opacity-40 border-l-4 border-stone-300 line-through decoration-stone-400',
			oldRowContent: 'Bob Odenkirk',
			oldRowDead: true,

			newRowClass: 'bg-green-50/40 border-l-4 border-green-500',
			newRowContent: 'Robert Odenkirk',
			newRowReading: true,
			newRowFinal: false,

			infoBoxClass: 'bg-stone-100 border border-stone-300 text-stone-700',
			infoTitle: 'Old reader (Reader 1) completes. No active references to stale row',
			infoText: '',
			iconColor: 'text-stone-500'
		},
		{
			u1Class: FADED,
			u2Class: FADED,

			showOldRow: false,
			showNewRow: true,

			newRowClass: 'bg-green-50/40 border-l-4 border-green-500',
			newRowContent: 'Robert Odenkirk',
			newRowReading: true,
			newRowFinal: true,

			infoBoxClass: 'bg-red-50 border border-red-200 text-red-900',
			infoTitle: 'Garbage collector (VACUUM) allowed to remove stale row',
			infoText: '',
			iconColor: 'text-red-500'
		}
	];

	function advanceStage() {
		currentStage = currentStage >= 4 ? 0 : currentStage + 1;
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
				class="rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider transition-all duration-300 {stages[
					currentStage
				].u1Class}"
			>
				Reader 1
			</div>
			<div
				class="rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider transition-all duration-300 {stages[
					currentStage
				].u2Class}"
			>
				Writer 2
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
						<th class="border-b border-stone-200 px-3 py-2">Actor</th>
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
							<td class="px-3 py-2 text-right">
								<span
									class="rounded px-1 py-0.5 font-sans text-[9px] font-bold tracking-wide uppercase {stages[
										currentStage
									].oldRowDead
										? 'bg-stone-200 text-stone-500'
										: 'bg-blue-100 text-blue-600'}"
								>
									{stages[currentStage].oldRowDead ? 'Dead' : 'V1'}
								</span>
							</td>
						</tr>
					{/if}

					{#if stages[currentStage].showNewRow}
						<tr class="{stages[currentStage].newRowClass} transition-all duration-300">
							<td class="bg-stone-50/40 px-3 py-2 text-center text-stone-400">1</td>
							<td class="px-3 py-2 whitespace-nowrap">
								<span class="font-bold text-stone-800">
									{stages[currentStage].newRowContent}
								</span>
							</td>
							<td class="px-3 py-2 text-right">
								<span
									class="rounded px-1 py-0.5 font-sans text-[9px] font-bold tracking-wide uppercase {stages[
										currentStage
									].newRowReading
										? 'bg-green-100 text-green-600'
										: 'bg-orange-100 text-[#ff3e00]'}"
								>
									{stages[currentStage].newRowFinal ? 'Live' : 'V2'}
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
