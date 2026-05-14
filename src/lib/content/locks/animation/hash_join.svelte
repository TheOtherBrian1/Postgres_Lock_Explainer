<div
	class="mt-4 mb-8 rounded-xl border border-stone-200 bg-white p-4 font-sans text-stone-600 shadow-md md:p-6"
	style="--join-speed: 14s; --hash-purple: #a855f7; --match-green: #22c55e;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Algorithm: Hash Join (Build & Probe)
	</h5>

	<style>
		/* Phase 1: Build Table Scan (0% - 35%) */
		@keyframes build-scan {
			0%,
			2% {
				transform: translateY(0);
				opacity: 0;
			}
			3%,
			10% {
				transform: translateY(0);
				opacity: 1;
				border-color: #3b82f6;
				background-color: rgba(59, 130, 246, 0.05);
			}
			11%,
			13% {
				transform: translateY(48px);
				opacity: 1;
				border-color: #3b82f6;
				background-color: transparent;
			}
			14%,
			21% {
				transform: translateY(48px);
				opacity: 1;
				border-color: #3b82f6;
				background-color: rgba(59, 130, 246, 0.05);
			}
			22%,
			24% {
				transform: translateY(96px);
				opacity: 1;
				border-color: #3b82f6;
				background-color: transparent;
			}
			25%,
			32% {
				transform: translateY(96px);
				opacity: 1;
				border-color: #3b82f6;
				background-color: rgba(59, 130, 246, 0.05);
			}
			33%,
			100% {
				opacity: 0;
				transform: translateY(96px);
			}
		}

		/* Entry 10 — no match phase needed */
		@keyframes entry-10 {
			0%,
			5% {
				opacity: 0;
				transform: scale(0.8);
			}
			6%,
			7% {
				opacity: 1;
				transform: scale(1.05);
			}
			8%,
			95% {
				opacity: 1;
				transform: scale(1);
			}
			96%,
			100% {
				opacity: 0;
				transform: scale(1);
			}
		}

		/* Entry 5 — merged: appears during build scan, glows green during probe match */
		@keyframes entry-5 {
			0%,
			16% {
				opacity: 0;
				transform: scale(0.8);
				background-color: #fff;
				border-color: #f3e8ff;
				box-shadow: none;
			}
			17%,
			18% {
				opacity: 1;
				transform: scale(1.05);
				background-color: #fff;
				border-color: #f3e8ff;
				box-shadow: none;
			}
			19%,
			52% {
				opacity: 1;
				transform: scale(1);
				background-color: #fff;
				border-color: #f3e8ff;
				box-shadow: none;
			}
			53%,
			60% {
				opacity: 1;
				transform: scale(1);
				background-color: #dcfce7;
				border-color: #22c55e;
				box-shadow: 0 0 0 2px #22c55e;
			}
			61%,
			95% {
				opacity: 1;
				transform: scale(1);
				background-color: #fff;
				border-color: #f3e8ff;
				box-shadow: none;
			}
			96%,
			100% {
				opacity: 0;
				transform: scale(1);
				background-color: #fff;
				border-color: #f3e8ff;
				box-shadow: none;
			}
		}

		/* Entry 22 — merged: appears during build scan, glows green during probe match */
		@keyframes entry-22 {
			0%,
			27% {
				opacity: 0;
				transform: scale(0.8);
				background-color: #fff;
				border-color: #f3e8ff;
				box-shadow: none;
			}
			28%,
			29% {
				opacity: 1;
				transform: scale(1.05);
				background-color: #fff;
				border-color: #f3e8ff;
				box-shadow: none;
			}
			30%,
			72% {
				opacity: 1;
				transform: scale(1);
				background-color: #fff;
				border-color: #f3e8ff;
				box-shadow: none;
			}
			73%,
			80% {
				opacity: 1;
				transform: scale(1);
				background-color: #dcfce7;
				border-color: #22c55e;
				box-shadow: 0 0 0 2px #22c55e;
			}
			81%,
			95% {
				opacity: 1;
				transform: scale(1);
				background-color: #fff;
				border-color: #f3e8ff;
				box-shadow: none;
			}
			96%,
			100% {
				opacity: 0;
				transform: scale(1);
				background-color: #fff;
				border-color: #f3e8ff;
				box-shadow: none;
			}
		}

		/* Phase 2: Probe UI */
		@keyframes probe-ui-fade {
			0%,
			35% {
				opacity: 0;
			}
			40%,
			95% {
				opacity: 1;
			}
			96%,
			100% {
				opacity: 0;
			}
		}

		@keyframes probe-scan {
			0%,
			45% {
				transform: translateY(0);
				opacity: 0;
			}
			46%,
			60% {
				transform: translateY(0);
				opacity: 1;
			}
			65%,
			80% {
				transform: translateY(48px);
				opacity: 1;
			}
			85%,
			100% {
				opacity: 0;
				transform: translateY(48px);
			}
		}

		/* Laser Sweep for Probe Lookups */
		@keyframes probe-laser {
			0%,
			48% {
				opacity: 0;
				transform: rotate(0);
			}
			49%,
			52% {
				opacity: 1;
				transform: rotate(15deg);
				stroke: #a855f7;
				stroke-width: 1.5;
			}
			53%,
			60% {
				opacity: 1;
				transform: rotate(15deg);
				stroke: #22c55e;
				stroke-width: 3;
			}
			61%,
			67% {
				opacity: 0;
				transform: rotate(15deg);
			}
			68%,
			72% {
				opacity: 1;
				transform: translateY(48px) rotate(-15deg);
				stroke: #a855f7;
				stroke-width: 1.5;
			}
			73%,
			80% {
				opacity: 1;
				transform: translateY(48px) rotate(-15deg);
				stroke: #22c55e;
				stroke-width: 3;
			}
			81%,
			100% {
				opacity: 0;
				transform: translateY(48px);
			}
		}

		/* Single animation per element — no conflicts */
		.anim-build-box {
			animation: build-scan var(--join-speed) infinite ease-in-out;
		}
		.anim-probe-ui {
			animation: probe-ui-fade var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.anim-probe-box {
			animation: probe-scan var(--join-speed) infinite ease-in-out;
		}
		.anim-laser {
			animation: probe-laser var(--join-speed) infinite ease-in-out;
			transform-origin: 0px 18px;
		}

		.e10 {
			animation: entry-10 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.e5 {
			animation: entry-5 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.e22 {
			animation: entry-22 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
	</style>

	<div class="relative mx-auto flex max-w-xl flex-col items-center gap-8">
		<div class="flex h-[180px] w-full items-start justify-between gap-4">
			<div class="anim-probe-ui w-32">
				<div
					class="mb-3 text-center text-[10px] font-black tracking-widest text-blue-600 uppercase"
				>
					Probe Side
				</div>
				<div class="relative space-y-3">
					<div
						class="anim-probe-box pointer-events-none absolute right-0 left-0 z-20 h-[36px] rounded border-2 border-blue-500 bg-blue-500/5"
					></div>
					<div
						class="flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-3"
					>
						<span class="font-mono text-[10px] text-stone-400">P.a</span>
						<span class="rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">5</span>
					</div>
					<div
						class="flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-3"
					>
						<span class="font-mono text-[10px] text-stone-400">P.b</span>
						<span class="rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">22</span>
					</div>
				</div>
			</div>

			<div class="flex flex-1 flex-col items-center">
				<div class="mb-3 shrink-0 text-[10px] font-black tracking-widest text-purple-600 uppercase">
					Hash Table
				</div>

				<div class="absolute left-[155px] z-0 mt-8 h-[100px] w-12">
					<svg width="100%" height="100%" class="overflow-visible">
						<line
							class="anim-laser"
							x1="0"
							y1="18"
							x2="45"
							y2="18"
							stroke="#a855f7"
							stroke-width="1.5"
							stroke-dasharray="3 3"
						/>
					</svg>
				</div>

				<div
					class="relative min-h-[110px] w-full shrink-0 space-y-2 rounded-lg border-2 border-purple-200 bg-purple-50 p-2"
				>
					<div
						class="e10 flex items-center justify-between rounded border border-purple-100 bg-white px-2 py-1 font-mono text-[10px]"
					>
						<span class="text-purple-400">hash(10)</span>
						<span class="font-bold text-stone-800">10</span>
					</div>
					<div
						class="e5 flex items-center justify-between rounded border border-purple-100 bg-white px-2 py-1 font-mono text-[10px]"
					>
						<span class="text-purple-400">hash(5)</span>
						<span class="font-bold text-stone-800">5</span>
					</div>
					<div
						class="e22 flex items-center justify-between rounded border border-purple-100 bg-white px-2 py-1 font-mono text-[10px]"
					>
						<span class="text-purple-400">hash(22)</span>
						<span class="font-bold text-stone-800">22</span>
					</div>
				</div>
			</div>

			<div class="relative w-32 shrink-0">
				<div
					class="mb-3 text-center text-[10px] font-black tracking-widest text-stone-400 uppercase"
				>
					Build Side
				</div>
				<div class="relative space-y-3">
					<div
						class="anim-build-box pointer-events-none absolute right-0 left-0 z-20 h-[36px] rounded border-2"
					></div>
					<div
						class="flex h-[36px] items-center justify-between rounded border border-stone-100 bg-white px-3"
					>
						<span class="rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">10</span>
						<span class="font-mono text-[10px] text-stone-300">B.a</span>
					</div>
					<div
						class="flex h-[36px] items-center justify-between rounded border border-stone-100 bg-white px-3"
					>
						<span class="rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">5</span>
						<span class="font-mono text-[10px] text-stone-300">B.b</span>
					</div>
					<div
						class="flex h-[36px] items-center justify-between rounded border border-stone-100 bg-white px-3"
					>
						<span class="rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">22</span>
						<span class="font-mono text-[10px] text-stone-300">B.c</span>
					</div>
				</div>
			</div>
		</div>

		<div
			class="flex w-full shrink-0 items-center justify-between rounded-b-lg border-t border-stone-100 bg-stone-50/50 p-3 pt-4"
		>
			<div class="flex flex-col">
				<span class="text-[10px] font-black text-stone-500 uppercase">Strategy Logic</span>
				<span class="font-mono text-xs font-bold text-purple-700"
					>1: Build Table &rarr; 2: Probe Side</span
				>
			</div>
			<div
				class="max-w-[260px] text-right text-[9px] leading-tight font-medium text-stone-400 italic"
			>
				Watch the Hash Table populate dynamically as the Build Side is scanned. The Probe lookup
				happens seamlessly afterward.
			</div>
		</div>
	</div>
</div>
