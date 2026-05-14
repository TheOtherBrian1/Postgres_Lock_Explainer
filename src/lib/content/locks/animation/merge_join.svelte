<div
	class="mt-4 mb-8 rounded-xl border border-stone-200 bg-white p-4 font-sans text-stone-600 shadow-md md:p-6"
	style="--join-speed: 16s;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Algorithm: Merge Join
	</h5>

	<style>
		/*
         * MERGE JOIN TIMELINE (16s cycle)
         *
         * Sorted Left:  [3, 5, 22]    Sorted Right: [5, 10, 22]
         *
         * Step 0 (0%-8%):    Sort indicator plays (both tables flash "sorted" state)
         * Step 1 (10%-22%):  L=3, R=5   → Compare: 3 < 5  → advance Left   (blue, L smaller)
         * Step 2 (25%-37%):  L=5, R=5   → Compare: 5 == 5 → MATCH!          (green)
         * Step 3 (40%-52%):  L=22, R=5  → Compare: 22 > 5 → advance Right   (amber, L larger)
         * Step 4 (55%-67%):  L=22, R=10 → Compare: 22 > 10→ advance Right   (amber, L larger)
         * Step 5 (70%-82%):  L=22, R=22 → Compare: 22==22 → MATCH!          (green)
         * Step 6 (85%-95%):  Done — both exhausted
         *
         * Left pointer positions:  row0=0, row1=48px, row2=96px
         * Right pointer positions: row0=0, row1=48px, row2=96px
         */

		/* Left pointer movement */
		@keyframes left-ptr {
			0%,
			8% {
				transform: translateY(0);
			}
			10%,
			22% {
				transform: translateY(0);
			} /* L=3 */
			25%,
			37% {
				transform: translateY(48px);
			} /* L=5 */
			40%,
			52% {
				transform: translateY(96px);
			} /* L=22 */
			55%,
			67% {
				transform: translateY(96px);
			} /* L=22 */
			70%,
			82% {
				transform: translateY(96px);
			} /* L=22 */
			85%,
			100% {
				transform: translateY(96px);
			}
		}

		/* Right pointer movement */
		@keyframes right-ptr {
			0%,
			8% {
				transform: translateY(0);
			}
			10%,
			22% {
				transform: translateY(0);
			} /* R=5 */
			25%,
			37% {
				transform: translateY(0);
			} /* R=5 */
			40%,
			52% {
				transform: translateY(0);
			} /* R=5 */
			55%,
			67% {
				transform: translateY(48px);
			} /* R=10 */
			70%,
			82% {
				transform: translateY(96px);
			} /* R=22 */
			85%,
			100% {
				transform: translateY(96px);
			}
		}

		/* Sort flash at start — both tables get a brief blue pulse */
		@keyframes sort-flash {
			0%,
			1% {
				box-shadow: none;
				border-color: #e7e5e4;
			}
			2%,
			6% {
				box-shadow: 0 0 0 2px #3b82f6;
				border-color: #3b82f6;
			}
			8%,
			100% {
				box-shadow: none;
				border-color: #e7e5e4;
			}
		}

		/* Sorted badge fade */
		@keyframes sorted-badge {
			0%,
			1% {
				opacity: 0;
				transform: scale(0.8);
			}
			2%,
			7% {
				opacity: 1;
				transform: scale(1);
			}
			9%,
			100% {
				opacity: 0;
				transform: scale(1);
			}
		}

		/*
         * Connector lines — one per step, pre-positioned at correct row pairs.
         * Each fades in during its comparison window.
         */

		/* Step 1: L0→R0 (3 vs 5) — L smaller, advance left */
		@keyframes line-s1 {
			0%,
			9% {
				opacity: 0;
			}
			11%,
			20% {
				opacity: 1;
			}
			22%,
			100% {
				opacity: 0;
			}
		}
		/* Step 2: L1→R0 (5 vs 5) — MATCH */
		@keyframes line-s2 {
			0%,
			24% {
				opacity: 0;
			}
			26%,
			35% {
				opacity: 1;
			}
			37%,
			100% {
				opacity: 0;
			}
		}
		/* Step 3: L2→R0 (22 vs 5) — L larger, advance right */
		@keyframes line-s3 {
			0%,
			39% {
				opacity: 0;
			}
			41%,
			50% {
				opacity: 1;
			}
			52%,
			100% {
				opacity: 0;
			}
		}
		/* Step 4: L2→R1 (22 vs 10) — L larger, advance right */
		@keyframes line-s4 {
			0%,
			54% {
				opacity: 0;
			}
			56%,
			65% {
				opacity: 1;
			}
			67%,
			100% {
				opacity: 0;
			}
		}
		/* Step 5: L2→R2 (22 vs 22) — MATCH */
		@keyframes line-s5 {
			0%,
			69% {
				opacity: 0;
			}
			71%,
			80% {
				opacity: 1;
			}
			82%,
			100% {
				opacity: 0;
			}
		}

		/* Comparison result badge */
		@keyframes cmp-s1 {
			0%,
			9% {
				opacity: 0;
			}
			12%,
			20% {
				opacity: 1;
			}
			22%,
			100% {
				opacity: 0;
			}
		}
		@keyframes cmp-s2 {
			0%,
			24% {
				opacity: 0;
			}
			27%,
			35% {
				opacity: 1;
			}
			37%,
			100% {
				opacity: 0;
			}
		}
		@keyframes cmp-s3 {
			0%,
			39% {
				opacity: 0;
			}
			42%,
			50% {
				opacity: 1;
			}
			52%,
			100% {
				opacity: 0;
			}
		}
		@keyframes cmp-s4 {
			0%,
			54% {
				opacity: 0;
			}
			57%,
			65% {
				opacity: 1;
			}
			67%,
			100% {
				opacity: 0;
			}
		}
		@keyframes cmp-s5 {
			0%,
			69% {
				opacity: 0;
			}
			72%,
			80% {
				opacity: 1;
			}
			82%,
			100% {
				opacity: 0;
			}
		}

		/* Done badge */
		@keyframes done-badge {
			0%,
			84% {
				opacity: 0;
				transform: scale(0.8);
			}
			86%,
			95% {
				opacity: 1;
				transform: scale(1);
			}
			97%,
			100% {
				opacity: 0;
				transform: scale(1);
			}
		}

		/* Match highlight on left val 5 */
		@keyframes hl-l5 {
			0%,
			24% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
			26%,
			35% {
				background-color: #dcfce7;
				color: #166534;
				box-shadow: 0 0 0 2px #22c55e;
			}
			37%,
			100% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
		}
		/* Match highlight on left val 22 */
		@keyframes hl-l22 {
			0%,
			69% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
			71%,
			80% {
				background-color: #dcfce7;
				color: #166534;
				box-shadow: 0 0 0 2px #22c55e;
			}
			82%,
			100% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
		}
		/* Match highlight on right val 5 */
		@keyframes hl-r5 {
			0%,
			24% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
			26%,
			35% {
				background-color: #dcfce7;
				color: #166534;
				box-shadow: 0 0 0 2px #22c55e;
			}
			37%,
			100% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
		}
		/* Match highlight on right val 22 */
		@keyframes hl-r22 {
			0%,
			69% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
			71%,
			80% {
				background-color: #dcfce7;
				color: #166534;
				box-shadow: 0 0 0 2px #22c55e;
			}
			82%,
			100% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
		}

		.anim-left-ptr {
			animation: left-ptr var(--join-speed) infinite ease-in-out;
		}
		.anim-right-ptr {
			animation: right-ptr var(--join-speed) infinite ease-in-out;
		}

		.anim-sort-flash {
			animation: sort-flash var(--join-speed) infinite ease-in-out;
		}
		.anim-sorted-badge {
			animation: sorted-badge var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}

		.line-s1 {
			animation: line-s1 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.line-s2 {
			animation: line-s2 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.line-s3 {
			animation: line-s3 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.line-s4 {
			animation: line-s4 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.line-s5 {
			animation: line-s5 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}

		.cmp-s1 {
			animation: cmp-s1 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.cmp-s2 {
			animation: cmp-s2 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.cmp-s3 {
			animation: cmp-s3 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.cmp-s4 {
			animation: cmp-s4 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.cmp-s5 {
			animation: cmp-s5 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}

		.anim-done {
			animation: done-badge var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}

		.hl-l5 {
			animation: hl-l5 var(--join-speed) infinite;
		}
		.hl-l22 {
			animation: hl-l22 var(--join-speed) infinite;
		}
		.hl-r5 {
			animation: hl-r5 var(--join-speed) infinite;
		}
		.hl-r22 {
			animation: hl-r22 var(--join-speed) infinite;
		}
	</style>

	<div class="relative mx-auto flex max-w-lg flex-col items-center gap-8">
		<!-- Main layout -->
		<div class="relative mt-4 flex w-full justify-center gap-0">
			<!-- Left (COL1) — sorted ascending -->
			<div class="relative w-36 shrink-0">
				<div
					class="mb-3 text-center text-[10px] font-black tracking-widest text-blue-600 uppercase"
				>
					COL1 (sorted)
				</div>
				<div class="relative space-y-3">
					<!-- Pointer -->
					<div
						class="anim-left-ptr pointer-events-none absolute right-0 left-0 z-20 h-[36px] rounded border-2 border-blue-500 bg-blue-500/5"
					></div>
					<!-- Row 0: 3 -->
					<div
						class="anim-sort-flash relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="font-mono text-[10px] text-stone-400">a</span>
						<span class="rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">3</span>
					</div>
					<!-- Row 1: 5 -->
					<div
						class="anim-sort-flash relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="font-mono text-[10px] text-stone-400">b</span>
						<span class="hl-l5 rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">5</span
						>
					</div>
					<!-- Row 2: 22 -->
					<div
						class="anim-sort-flash relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="font-mono text-[10px] text-stone-400">c</span>
						<span class="hl-l22 rounded bg-stone-100 px-2 font-mono font-bold text-stone-800"
							>22</span
						>
					</div>
				</div>
				<!-- Sorted badge -->
				<div
					class="anim-sorted-badge absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full rounded bg-blue-500 px-2 py-0.5 text-[9px] font-bold whitespace-nowrap text-white"
				>
					✓ Sorted
				</div>
			</div>

			<!-- Center connector SVG + comparison badges -->
			<div class="relative mt-[26px] w-24 shrink-0" style="height: 132px;">
				<!-- SVG lines: one per comparison step -->
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 96 132"
					class="overflow-visible"
					preserveAspectRatio="none"
				>
					<!-- Step 1: L0→R0 (3 vs 5) blue -->
					<line
						class="line-s1"
						x1="0"
						y1="18"
						x2="96"
						y2="18"
						stroke="#3b82f6"
						stroke-width="1.5"
						stroke-dasharray="4 3"
					/>
					<!-- Step 2: L1→R0 (5 vs 5) GREEN match -->
					<line
						class="line-s2"
						x1="0"
						y1="66"
						x2="96"
						y2="18"
						stroke="#22c55e"
						stroke-width="2.5"
						stroke-dasharray="4 3"
					/>
					<!-- Step 3: L2→R0 (22 vs 5) amber -->
					<line
						class="line-s3"
						x1="0"
						y1="114"
						x2="96"
						y2="18"
						stroke="#f59e0b"
						stroke-width="1.5"
						stroke-dasharray="4 3"
					/>
					<!-- Step 4: L2→R1 (22 vs 10) amber -->
					<line
						class="line-s4"
						x1="0"
						y1="114"
						x2="96"
						y2="66"
						stroke="#f59e0b"
						stroke-width="1.5"
						stroke-dasharray="4 3"
					/>
					<!-- Step 5: L2→R2 (22 vs 22) GREEN match -->
					<line
						class="line-s5"
						x1="0"
						y1="114"
						x2="96"
						y2="114"
						stroke="#22c55e"
						stroke-width="2.5"
						stroke-dasharray="4 3"
					/>
				</svg>

				<!-- Comparison result badges (centered over connector) -->
				<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-start">
					<!-- Step 1: 3 < 5 -->
					<div
						class="cmp-s1 absolute top-[4px] rounded-full border border-blue-300 bg-blue-100 px-2 py-0.5 text-[9px] font-bold whitespace-nowrap text-blue-700"
					>
						3 &lt; 5 ↓L
					</div>
					<!-- Step 2: 5 == 5 -->
					<div
						class="cmp-s2 absolute top-[28px] rounded-full border border-green-400 bg-green-100 px-2 py-0.5 text-[9px] font-bold whitespace-nowrap text-green-700"
					>
						5 = 5 ✓
					</div>
					<!-- Step 3: 22 > 5 -->
					<div
						class="cmp-s3 absolute top-[52px] rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[9px] font-bold whitespace-nowrap text-amber-700"
					>
						22 &gt; 5 ↓R
					</div>
					<!-- Step 4: 22 > 10 -->
					<div
						class="cmp-s4 absolute top-[76px] rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[9px] font-bold whitespace-nowrap text-amber-700"
					>
						22 &gt; 10 ↓R
					</div>
					<!-- Step 5: 22 == 22 -->
					<div
						class="cmp-s5 absolute top-[100px] rounded-full border border-green-400 bg-green-100 px-2 py-0.5 text-[9px] font-bold whitespace-nowrap text-green-700"
					>
						22 = 22 ✓
					</div>
					<!-- Done -->
					<div
						class="anim-done absolute top-[48px] rounded-lg bg-stone-800 px-3 py-1 text-[10px] font-bold whitespace-nowrap text-white shadow-lg"
					>
						Complete ✓
					</div>
				</div>
			</div>

			<!-- Right (COL2) — sorted ascending -->
			<div class="relative w-36 shrink-0">
				<div
					class="mb-3 text-center text-[10px] font-black tracking-widest text-amber-600 uppercase"
				>
					COL2 (sorted)
				</div>
				<div class="relative space-y-3">
					<!-- Pointer -->
					<div
						class="anim-right-ptr pointer-events-none absolute right-0 left-0 z-20 h-[36px] rounded border-2 border-amber-500 bg-amber-500/5"
					></div>
					<!-- Row 0: 5 -->
					<div
						class="anim-sort-flash relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="hl-r5 rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">5</span
						>
						<span class="font-mono text-[10px] text-stone-400">a</span>
					</div>
					<!-- Row 1: 10 -->
					<div
						class="anim-sort-flash relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">10</span>
						<span class="font-mono text-[10px] text-stone-400">b</span>
					</div>
					<!-- Row 2: 22 -->
					<div
						class="anim-sort-flash relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="hl-r22 rounded bg-stone-100 px-2 font-mono font-bold text-stone-800"
							>22</span
						>
						<span class="font-mono text-[10px] text-stone-400">c</span>
					</div>
				</div>
				<!-- Sorted badge -->
				<div
					class="anim-sorted-badge absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full rounded bg-amber-500 px-2 py-0.5 text-[9px] font-bold whitespace-nowrap text-white"
				>
					✓ Sorted
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div
			class="flex w-full shrink-0 items-center justify-between rounded-b-lg border-t border-stone-100 bg-stone-50/50 p-3 pt-4"
		>
			<div class="flex flex-col">
				<span class="text-[10px] font-black text-stone-500 uppercase">Complexity</span>
				<span class="font-mono text-xs font-bold text-emerald-600">O(N + M)</span>
			</div>
			<div
				class="max-w-[220px] text-right text-[9px] leading-tight font-medium text-stone-400 italic"
			>
				Both sides pre-sorted. Pointers advance in one pass. Smaller value moves forward, equals get
				joined.
			</div>
		</div>
	</div>
</div>
