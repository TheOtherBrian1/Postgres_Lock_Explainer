<!-- 
	If you are here, 
	you are probably wondering how this animation was made.
	Well, it was generated with Gemini. 
	
	I'm generally sceptical of AI coding, 
	but I figured it was harmless for dealing with a basic HTML/CSS prop where 
	data integrity and user security isn't at risk. The code was reviewed and edited by me (the AI made some notable errors)
	@theotherbrian1, so, yeah, human insight was involved. 
-->

<script lang="ts">
	let currentStage = $state(0);

	// Helper to manage opacity for the 'inactive' users
	const FADED = 'opacity-40 grayscale-[0.5] scale-95';
	const ACTIVE = 'opacity-100 scale-100 shadow-md border-stone-300';

	const stages = [
		{
			title: 'Stage 1: Reader Accessing Row',
			description: 'Old Reader (U1) is reading the original row',
			progress: 20,
			// Visual States for Cards
			u1Class: `border-blue-400 bg-blue-50 ${ACTIVE}`,
			u2Class: `border-stone-200 bg-stone-50 ${FADED}`,
			u3Class: `border-stone-200 bg-stone-50 ${FADED}`,

			u1Status: 'Reading row...',
			u2Status: 'Waiting...',
			u3Status: 'Waiting...',

			showOldRow: true,
			showNewRow: false,

			// Table Row Styles
			oldRowClass: 'bg-blue-50/50 border-l-4 border-blue-500',
			oldRowContent: 'Bob Odenkirk',

			// Info Box Styles
			infoBoxClass: 'bg-blue-50 border border-blue-200 text-blue-800',
			infoTitle: 'Stage 1: Initial Read',
			infoText: 'Old Reader (U1) is reading the row.',
			iconColor: 'text-blue-500'
		},
		{
			title: 'Stage 2: Writer Creates New Version',
			description: 'Writer copies the row, old reader continues unaffected',
			progress: 40,

			u1Class: `border-blue-400 bg-blue-50 ${ACTIVE}`,
			u2Class: `border-[#ff3e00] bg-orange-50 ${ACTIVE}`,
			u3Class: `border-stone-200 bg-stone-50 ${FADED}`,

			u1Status: 'Still reading old version...',
			u2Status: 'Creating new version...',
			u3Status: 'Waiting...',

			showOldRow: true,
			showNewRow: true,

			oldRowClass: 'bg-blue-50/50 border-l-4 border-blue-500',
			oldRowXmax: '101',
			newRowClass: 'bg-orange-50/50 border-l-4 border-[#ff3e00]',

			infoBoxClass: 'bg-orange-50 border border-orange-200 text-orange-900',
			infoTitle: 'Stage 2: MVCC in Action',
			infoText:
				'Writer (U2) creates a NEW row version instead of modifying in place. U1 continues reading the old version without interruption!',
			iconColor: 'text-[#ff3e00]'
		},
		{
			title: 'Stage 3: New Reader Sees Updated Version',
			description: 'New reader sees the updated row, old reader still sees original',
			progress: 60,

			u1Class: `border-blue-400 bg-blue-50 ${ACTIVE}`,
			u2Class: `border-stone-200 bg-stone-50 ${FADED}`,
			u3Class: `border-green-400 bg-green-50 ${ACTIVE}`,

			u1Status: 'Still reading old version...',
			u2Status: 'Update complete',
			u3Status: 'Reading new version...',

			showOldRow: true,
			showNewRow: true,

			oldRowClass: 'bg-blue-50/50 border-l-4 border-blue-500',
			oldRowXmax: '101',
			newRowClass: 'bg-green-50/50 border-l-4 border-green-500',
			newRowReading: true,

			infoBoxClass: 'bg-green-50 border border-green-200 text-green-800',
			infoTitle: 'Stage 3: Concurrent Reads',
			infoText:
				'New Reader (U3) sees the updated version while Old Reader (U1) still sees the original. Both queries run simultaneously without blocking each other!',
			iconColor: 'text-green-500'
		},
		{
			title: 'Stage 4: Old Reader Finishes',
			description: 'Old reader releases the stale row, marking it for cleanup',
			progress: 80,

			u1Class: `border-stone-200 bg-stone-50 ${FADED}`,
			u2Class: `border-stone-200 bg-stone-50 ${FADED}`,
			u3Class: `border-green-400 bg-green-50 ${ACTIVE}`,

			u1Status: 'Transaction complete ✓',
			u2Status: 'Update complete',
			u3Status: 'Reading new version...',

			showOldRow: true,
			showNewRow: true,

			// Grayed out "dead" row
			oldRowClass: 'bg-stone-100 opacity-60 border-l-4 border-stone-300 decoration-stone-400',
			oldRowXmax: '101',
			oldRowDead: true,

			newRowClass: 'bg-green-50/50 border-l-4 border-green-500',
			newRowReading: true,

			infoBoxClass: 'bg-stone-100 border border-stone-300 text-stone-700',
			infoTitle: 'Stage 4: Stale Version Released',
			infoText:
				"Old Reader (U1) completes its transaction. The old row is now a 'dead tuple' - invisible to everyone and ready for cleanup.",
			iconColor: 'text-stone-500'
		},
		{
			title: 'Stage 5: Vacuum Cleanup',
			description: 'Background vacuum process removes the dead tuple',
			progress: 100,

			u1Class: `border-stone-200 bg-stone-50 ${FADED}`,
			u2Class: `border-stone-200 bg-stone-50 ${FADED}`,
			u3Class: `border-green-400 bg-green-50 ${ACTIVE}`,

			u1Status: 'Transaction complete ✓',
			u2Status: 'Update complete',
			u3Status: 'Reading current version...',

			showOldRow: false, // It's gone!
			showNewRow: true,

			newRowClass: 'bg-green-50/50 border-l-4 border-green-500',
			newRowFinal: true,

			infoBoxClass: 'bg-red-50 border border-red-200 text-red-900',
			infoTitle: 'Stage 5: Vacuum Process',
			infoText:
				'The vacuum background process permanently removes dead tuples, reclaiming disk space. Without vacuum, old versions would accumulate and bloat the database.',
			iconColor: 'text-red-500'
		}
	];

	function nextStage() {
		currentStage = currentStage >= 4 ? 0 : currentStage + 1;
	}
	function prevStage() {
		currentStage = currentStage - 1 < 0 ? 4 : currentStage - 1;
	}
</script>

<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
>
	<h5 class="mb-6 text-center text-xl font-bold text-stone-900">MVCC Simulator</h5>

	<div class="mb-8 rounded-xl border border-stone-200 bg-stone-50 p-6">
		<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
			<div>
				<div class="text-lg font-bold text-stone-900">{stages[currentStage].title}</div>
				<div class="mt-1 text-sm text-stone-500">{stages[currentStage].description}</div>
			</div>
			<div class="flex space-x-2">
				<button
					onclick={prevStage}
					class="cursor-pointer rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium transition-colors hover:border-[#ff3e00] hover:bg-white hover:text-[#ff3e00]"
				>
					<span class="inline md:hidden lg:inline">←</span> Prev
				</button>
				<button
					onclick={nextStage}
					class="cursor-pointer rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#ff3e00]"
				>
					Next <span class="inline md:hidden lg:inline">→</span>
				</button>
			</div>
		</div>
		<div class="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
			<div
				class="h-full rounded-full bg-[#ff3e00] transition-all duration-500 ease-out"
				style="width: {stages[currentStage].progress}%"
			></div>
		</div>
	</div>

	<div class=" mb-8 hidden grid-cols-1 gap-4 sm:grid md:grid-cols-3">
		<div
			class="rounded-xl border-2 p-4 transition-all duration-500 ease-in-out {stages[currentStage]
				.u1Class}"
		>
			<div class="mb-3 flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded bg-blue-500 text-sm font-bold text-white shadow-sm md:hidden lg:flex"
				>
					U1
				</div>
				<div class="leading-none">
					<div class="text-sm font-bold text-stone-900">Old Reader</div>
					<div class="mt-1 text-xs text-stone-500">{stages[currentStage].u1Status}</div>
				</div>
			</div>
			<div
				class="overflow-x-auto rounded border border-stone-100 bg-white p-2 font-mono text-xs text-stone-500 shadow-sm"
			>
				SELECT name...
			</div>
		</div>

		<div
			class="rounded-xl border-2 p-4 transition-all duration-500 ease-in-out {stages[currentStage]
				.u2Class}"
		>
			<div class="mb-3 flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded bg-[#ff3e00] text-sm font-bold text-white shadow-sm md:hidden lg:flex"
				>
					U2
				</div>
				<div class="leading-none">
					<div class="text-sm font-bold text-stone-900">Writer</div>
					<div class="mt-1 text-xs text-stone-500">{stages[currentStage].u2Status}</div>
				</div>
			</div>
			<div
				class="overflow-x-auto rounded border border-stone-100 bg-white p-2 font-mono text-xs text-stone-500 shadow-sm"
			>
				UPDATE actors...
			</div>
		</div>

		<div
			class="rounded-xl border-2 p-4 transition-all duration-500 ease-in-out {stages[currentStage]
				.u3Class}"
		>
			<div class="mb-3 flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded bg-green-600 text-sm font-bold text-white shadow-sm md:hidden lg:flex"
				>
					U3
				</div>
				<div class="leading-none">
					<div class="text-sm font-bold text-stone-900">New Reader</div>
					<div class="mt-1 text-xs text-stone-500">{stages[currentStage].u3Status}</div>
				</div>
			</div>
			<div
				class="overflow-x-auto rounded border border-stone-100 bg-white p-2 font-mono text-xs text-stone-500 shadow-sm"
			>
				SELECT name...
			</div>
		</div>
	</div>

	<div class="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
		<div class="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-4 py-3">
			<svg class="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
				></path>
			</svg>
			<h2 class="text-sm font-semibold tracking-wide text-stone-700 uppercase">
				Database: actors table
			</h2>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full border-collapse text-left">
				<thead class="bg-stone-100 text-xs font-semibold text-stone-500 uppercase">
					<tr>
						<th class="w-16 border-r border-b border-stone-200 px-4 py-2">ID</th>
						<th class="border-b border-stone-200 px-4 py-2">Name</th>
					</tr>
				</thead>
				<tbody class="font-mono text-sm">
					{#if stages[currentStage].showOldRow}
						<tr class="{stages[currentStage].oldRowClass} transition-all duration-500">
							<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">1</td>
							<td class="px-4 py-3">
								<div class="flex items-center justify-between">
									<span
										class={stages[currentStage].oldRowDead
											? 'text-stone-400 line-through'
											: 'font-bold text-stone-800'}>Bob Odenkirk</span
									>

									<span
										class="ml-2 rounded px-1.5 py-0.5 font-sans text-[10px] tracking-wide uppercase
                                        {stages[currentStage].oldRowDead
											? 'bg-stone-200 text-stone-500'
											: 'bg-blue-100 text-blue-600'}"
									>
										{stages[currentStage].oldRowDead ? 'Dead Tuple' : 'Version 1'}
									</span>
								</div>
							</td>
						</tr>
					{/if}

					{#if stages[currentStage].showNewRow}
						<tr class="{stages[currentStage].newRowClass} transition-all duration-500">
							<td class="border-r border-stone-200/50 px-4 py-3 text-stone-500">1</td>
							<td class="px-4 py-3">
								<div class="flex items-center justify-between">
									<span class="font-bold text-stone-800">Robert Odenkirk</span>
									<span
										class="ml-2 rounded px-1.5 py-0.5 font-sans text-[10px] tracking-wide uppercase
                                        {stages[currentStage].newRowReading
											? 'bg-green-100 text-green-600'
											: 'bg-orange-100 text-[#ff3e00]'}"
									>
										{stages[currentStage].newRowFinal ? 'Current' : 'Version 2'}
									</span>
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<div
		class="mt-6 rounded-xl p-4 transition-colors duration-300 {stages[currentStage].infoBoxClass}"
	>
		<div class="flex items-start gap-3">
			<svg
				class="mt-0.5 h-5 w-5 flex-shrink-0 {stages[currentStage].iconColor}"
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
				<div class="mb-1 text-sm font-bold">{stages[currentStage].infoTitle}</div>
				<div class="text-sm leading-relaxed opacity-90">
					{stages[currentStage].infoText}
				</div>
			</div>
		</div>
	</div>
</div>
