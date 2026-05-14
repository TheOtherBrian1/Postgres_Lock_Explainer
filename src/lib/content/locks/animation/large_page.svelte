<div
	class="mt-4 mb-8 rounded-xl border border-stone-100 bg-white p-4 font-sans text-stone-600 shadow-sm md:p-6"
	style="--bloat-speed: 12s; --page-blue: #3b82f6; --row-h: 22px;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Bloated Page Loading (10MB Chunk)
	</h5>

	<style>
		@keyframes page-meander-in {
			0% {
				transform: translate(-20px, 80px) scale(0.8);
				opacity: 0;
			}
			10% {
				transform: translate(15px, 60px) scale(0.85);
				opacity: 0.3;
			}
			20% {
				transform: translate(-10px, 45px) scale(0.9);
				opacity: 0.6;
			}
			30% {
				transform: translate(5px, 20px) scale(0.95);
				opacity: 0.8;
			}
			35%,
			85% {
				transform: translate(0, 0) scale(1);
				opacity: 1;
			}
			90% {
				transform: translateY(-10px) scale(1);
				opacity: 0.5;
			}
			95%,
			100% {
				transform: translateY(-40px) scale(0.9);
				opacity: 0;
			}
		}

		@keyframes scan-targeted {
			0%,
			35% {
				top: 0;
				opacity: 0;
			}
			40% {
				top: 0;
				opacity: 1;
			}
			45% {
				top: calc(var(--row-h) * 2);
				opacity: 1;
			}
			48%,
			52% {
				top: calc(var(--row-h) * 2);
				opacity: 1;
				background-color: #22c55e;
				box-shadow: 0 0 12px 3px #22c55e;
			}
			60%,
			100% {
				top: calc(var(--row-h) * 2);
				opacity: 0;
			}
		}

		@keyframes row-found-pulse {
			0%,
			48% {
				background-color: transparent;
				border-color: transparent;
			}
			50%,
			85% {
				background-color: rgba(34, 197, 94, 0.15);
				border-color: #22c55e;
			}
			90%,
			100% {
				background-color: transparent;
				border-color: transparent;
			}
		}

		.page-bloat {
			animation: page-meander-in var(--bloat-speed) infinite ease-out;
			border: 1px solid #2563eb;
			background-color: var(--page-blue);
			z-index: 20;
		}

		.scanner-targeted {
			animation: scan-targeted var(--bloat-speed) infinite ease-out;
			height: 2px;
			z-index: 30;
		}

		.row-target {
			animation: row-found-pulse var(--bloat-speed) infinite ease-out;
		}
	</style>

	<div class="relative mx-auto flex max-w-sm flex-col items-center gap-4">
		<div
			class="relative flex h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-stone-200 bg-stone-50"
		>
			<div
				class="absolute top-2 left-3 z-10 text-[10px] font-bold tracking-widest text-stone-400 uppercase"
			>
				Application RAM
			</div>

			<div class="page-bloat relative flex h-[240px] w-64 flex-col rounded text-white shadow-2xl">
				<div
					class="flex shrink-0 items-center justify-between border-b border-blue-600 bg-blue-700 p-2"
				>
					<span class="font-mono text-[10px] font-bold tracking-tight">page_huge_1</span>
					<span class="rounded bg-red-500 px-1.5 py-0.5 font-mono text-[9px] font-bold">10 MB</span>
				</div>

				<div class="relative flex flex-1 flex-col bg-white p-1">
					<div
						class="scanner-targeted pointer-events-none absolute right-1 left-1 bg-white/80 shadow-[0_0_10px_2px_#3b82f6]"
					></div>

					<div class="flex h-[22px] items-center px-2 font-mono text-[9px] text-stone-300">
						<span class="mr-2 font-bold text-stone-400">1:</span> id:10201...
					</div>
					<div class="flex h-[22px] items-center px-2 font-mono text-[9px] text-stone-300">
						<span class="mr-2 font-bold text-stone-400">2:</span> id:10202...
					</div>

					<div
						class="row-target flex h-[22px] items-center border-y border-transparent bg-stone-50/50 px-2 font-mono text-[9px] text-stone-900"
					>
						<span class="mr-2 font-bold text-stone-900">3:</span>
						<span class="font-bold text-blue-700">id:10203</span> (Found)
					</div>

					<div class="flex flex-1 flex-col items-center justify-center bg-stone-50/30 py-4">
						<div class="h-full w-px border-l border-dashed border-stone-200"></div>
						<span class="my-2 font-mono text-[8px] tracking-tighter text-stone-400 italic">
							~ 9,999,996 rows of wasted I/O ~
						</span>
						<div class="h-full w-px border-l border-dashed border-stone-200"></div>
					</div>

					<div class="flex h-[28px] shrink-0 items-center border-t border-stone-100 bg-white px-2">
						<span class="mr-2 font-mono text-[10px] font-bold text-stone-400">1,000,000:</span>
						<span class="font-mono text-[9px] text-stone-300 italic">id:1110203...</span>
					</div>
				</div>
			</div>
		</div>

		<div class="w-full text-center">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1"
			>
				<span class="text-[10px] font-bold tracking-tight text-red-700 uppercase"
					>Inefficiency: 1 row found / 10MB loaded</span
				>
			</div>
		</div>
	</div>
</div>
