<div
	class="mt-4 mb-8 rounded-xl border border-stone-100 bg-white p-4 font-sans text-stone-600 shadow-sm md:p-6"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Memory Buffer
	</h5>

	<style>
		:root {
			/* Longer speed to allow for both sets of pages to be seen clearly */
			--swap-speed: 6s;
			--page-blue: #3b82f6;
		}

		/* Set 1: Pages 1-3 */
		@keyframes page-set-alpha {
			0%,
			5% {
				transform: translateY(20px);
				opacity: 0;
			}
			10%,
			40% {
				transform: translateY(0);
				opacity: 1;
			} /* Item 1-3: Load & Process */
			45%,
			50% {
				transform: translateY(-30px);
				opacity: 0;
			} /* Item 4: Evict/Discard */
			55%,
			100% {
				opacity: 0;
			}
		}

		/* Set 2: Pages 10-12 */
		@keyframes page-set-beta {
			0%,
			50% {
				transform: translateY(20px);
				opacity: 0;
			}
			60%,
			90% {
				transform: translateY(0);
				opacity: 1;
			} /* Next set loads */
			95%,
			100% {
				transform: translateY(-30px);
				opacity: 0;
			}
		}

		/* Scan line visualization */
		@keyframes scan-loop {
			0%,
			10%,
			50%,
			60% {
				top: 0%;
				opacity: 0;
			}
			15%,
			35%,
			65%,
			85% {
				opacity: 1;
			}
			40%,
			90% {
				top: 100%;
				opacity: 0;
			}
		}

		.mem-zone-inner {
			background-image: radial-gradient(#e7e5e4 1px, transparent 1px);
			background-size: 16px 16px;
		}

		.page-node {
			border: 1px solid #2563eb;
			background-color: var(--page-blue);
			box-shadow:
				0 4px 6px -1px rgba(0, 0, 0, 0.1),
				0 2px 4px -1px rgba(0, 0, 0, 0.06);
		}

		.set-alpha {
			animation: page-set-alpha var(--swap-speed) infinite ease-in-out;
		}
		.set-beta {
			animation: page-set-beta var(--swap-speed) infinite ease-in-out;
		}
		.scanner {
			animation: scan-loop var(--swap-speed) infinite linear;
		}
	</style>

	<div class="relative mx-auto flex max-w-xs flex-col items-center gap-4">
		<div
			class="relative flex h-28 w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-stone-200 bg-stone-50"
		>
			<div
				class="absolute top-1 left-2 z-10 text-[8px] font-bold tracking-widest text-stone-400 uppercase"
			>
				(Buffer Cache)
			</div>

			<div class="mem-zone-inner absolute inset-0 opacity-30"></div>

			<div
				class="scanner pointer-events-none absolute right-0 left-0 z-30 h-0.5 bg-white/80 shadow-[0_0_10px_2px_#3b82f6]"
			></div>

			<div class="relative flex w-full items-center justify-center gap-2 px-2">
				<div class="set-alpha absolute inset-0 flex items-center justify-center gap-2">
					{#each [1, 2, 3] as i}
						<div
							class="page-node flex h-14 w-14 flex-col items-center justify-center rounded text-white"
						>
							<span class="font-mono text-[9px] font-bold">page{i}</span>
							<span class="font-mono text-[7px] opacity-70">8kB</span>
						</div>
					{/each}
				</div>

				<div class="set-beta absolute inset-0 flex items-center justify-center gap-2">
					{#each [10, 11, 12] as i}
						<div
							class="page-node flex h-14 w-14 flex-col items-center justify-center rounded text-white"
						>
							<span class="font-mono text-[9px] font-bold">page{i}</span>
							<span class="font-mono text-[7px] opacity-70">8kB</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="h-4 text-stone-200">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg
			>
		</div>

		<div class="w-full rounded border border-stone-200 bg-white p-3 shadow-sm">
			<div class="mb-3 flex items-center justify-between border-b border-stone-100 pb-1">
				<div class="flex items-center gap-1.5 text-[9px] font-bold text-stone-500 uppercase">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="10"
						height="10"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><path d="M21 12V7H3v10h10" /><circle cx="18" cy="18" r="3" /><path d="M15 18h6" /></svg
					>
					Users.csv (On-Disk Pages)
				</div>
			</div>

			<div class="grid grid-cols-5 gap-1.5">
				{#each [1, 2, 3, '...', 10, 11, 12, '...'] as label}
					<div
						class="flex h-8 items-center justify-center rounded border border-stone-100 bg-stone-50 font-mono text-[7px] text-stone-400"
					>
						{typeof label === 'number' ? 'p' + label : label}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div
		class="mt-6 flex justify-center gap-6 text-[9px] font-bold tracking-widest text-stone-400 uppercase"
	>
		<div class="flex items-center gap-2">
			<div class="h-2 w-2 rounded-full bg-blue-500"></div>
			<span>Memory buffers</span>
		</div>
	</div>
</div>
