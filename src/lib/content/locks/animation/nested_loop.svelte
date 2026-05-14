<div
	class="mt-4 mb-8 rounded-xl border border-stone-200 bg-white p-4 font-sans text-stone-600 shadow-md md:p-6"
	style="--join-speed: 10s;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Algorithm: Nested Loop Join
	</h5>

	<style>
		/*
         * Timeline (10s cycle):
         *   0%-45%  : Outer row 0 (val 5)  scans inner rows 0,1,2
         *   50%-95% : Outer row 1 (val 22) scans inner rows 0,1,2
         *
         * Outer row positions: row0 = 0px, row1 = 48px
         * Inner row positions: row0 = 0px, row1 = 48px, row2 = 96px
         *
         * Sub-phases per outer row (each 45% window split into 3 inner scans):
         *   Phase A: 0-14%  / 50-64%  -> inner row 0
         *   Phase B: 15-29% / 65-79%  -> inner row 1
         *   Phase C: 30-44% / 80-94%  -> inner row 2
         */

		/* Outer cursor: moves between row 0 and row 1 */
		@keyframes anchor-move {
			0%,
			45% {
				transform: translateY(0);
			}
			50%,
			95% {
				transform: translateY(48px);
			}
			100% {
				transform: translateY(0);
			}
		}

		/* Inner cursor: cycles through rows 0,1,2 for each outer row */
		@keyframes inner-move {
			0%,
			10% {
				transform: translateY(0);
			}
			15%,
			25% {
				transform: translateY(48px);
			}
			30%,
			40% {
				transform: translateY(96px);
			}
			45%,
			50%,
			60% {
				transform: translateY(0);
			}
			65%,
			75% {
				transform: translateY(48px);
			}
			80%,
			90% {
				transform: translateY(96px);
			}
			95%,
			100% {
				transform: translateY(0);
			}
		}

		/*
         * Connector line: we animate the start-Y and end-Y of the line
         * using transform on the full SVG container.
         * 
         * Since pure CSS can't animate SVG x1/y1/x2/y2 attributes,
         * we use 6 separate line segments that fade in/out at the right times.
         * Each line connects: outer-row center -> inner-row center
         *
         * Row centers (relative to the table top):
         *   Row 0: 18px, Row 1: 66px, Row 2: 114px
         */

		/* Line visibility keyframes - each of 6 comparisons */
		/* Outer0 -> Inner0 (0%-14%): no match */
		@keyframes line-0-0 {
			0%,
			2% {
				opacity: 0;
			}
			3%,
			12% {
				opacity: 1;
			}
			13%,
			100% {
				opacity: 0;
			}
		}
		/* Outer0 -> Inner1 (15%-29%): MATCH (5==5) */
		@keyframes line-0-1 {
			0%,
			14% {
				opacity: 0;
			}
			15%,
			27% {
				opacity: 1;
			}
			28%,
			100% {
				opacity: 0;
			}
		}
		/* Outer0 -> Inner2 (30%-44%): no match */
		@keyframes line-0-2 {
			0%,
			29% {
				opacity: 0;
			}
			30%,
			42% {
				opacity: 1;
			}
			43%,
			100% {
				opacity: 0;
			}
		}
		/* Outer1 -> Inner0 (50%-64%): no match */
		@keyframes line-1-0 {
			0%,
			52% {
				opacity: 0;
			}
			53%,
			62% {
				opacity: 1;
			}
			63%,
			100% {
				opacity: 0;
			}
		}
		/* Outer1 -> Inner1 (65%-79%): no match */
		@keyframes line-1-1 {
			0%,
			64% {
				opacity: 0;
			}
			65%,
			77% {
				opacity: 1;
			}
			78%,
			100% {
				opacity: 0;
			}
		}
		/* Outer1 -> Inner2 (80%-94%): MATCH (22==22) */
		@keyframes line-1-2 {
			0%,
			79% {
				opacity: 0;
			}
			80%,
			92% {
				opacity: 1;
			}
			93%,
			100% {
				opacity: 0;
			}
		}

		/* Match highlights on outer table values */
		@keyframes highlight-5 {
			0%,
			14% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
			15%,
			27% {
				background-color: #dcfce7;
				color: #166534;
				box-shadow: 0 0 0 2px #22c55e;
			}
			28%,
			100% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
		}
		@keyframes highlight-22 {
			0%,
			79% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
			80%,
			92% {
				background-color: #dcfce7;
				color: #166534;
				box-shadow: 0 0 0 2px #22c55e;
			}
			93%,
			100% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
		}

		/* Match highlights on inner table values */
		@keyframes highlight-inner-5 {
			0%,
			14% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
			15%,
			27% {
				background-color: #dcfce7;
				color: #166534;
				box-shadow: 0 0 0 2px #22c55e;
			}
			28%,
			100% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
		}
		@keyframes highlight-inner-22 {
			0%,
			79% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
			80%,
			92% {
				background-color: #dcfce7;
				color: #166534;
				box-shadow: 0 0 0 2px #22c55e;
			}
			93%,
			100% {
				background-color: #f5f5f4;
				color: #1c1917;
				box-shadow: none;
			}
		}

		.anim-anchor {
			animation: anchor-move var(--join-speed) infinite ease-in-out;
		}
		.anim-inner {
			animation: inner-move var(--join-speed) infinite ease-in-out;
		}

		.line-0-0 {
			animation: line-0-0 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.line-0-1 {
			animation: line-0-1 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.line-0-2 {
			animation: line-0-2 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.line-1-0 {
			animation: line-1-0 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.line-1-1 {
			animation: line-1-1 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}
		.line-1-2 {
			animation: line-1-2 var(--join-speed) infinite ease-in-out;
			opacity: 0;
		}

		.val-5 {
			animation: highlight-5 var(--join-speed) infinite;
		}
		.val-22 {
			animation: highlight-22 var(--join-speed) infinite;
		}
		.ival-5 {
			animation: highlight-inner-5 var(--join-speed) infinite;
		}
		.ival-22 {
			animation: highlight-inner-22 var(--join-speed) infinite;
		}
	</style>

	<div class="relative mx-auto flex max-w-lg flex-col items-center gap-8">
		<!-- Main layout: Outer Table | Connector SVG | Inner Table -->
		<div
			class="relative mt-4 flex w-full justify-center gap-0"
			style="--row-h: 36px; --row-gap: 12px;"
		>
			<!-- Outer Table -->
			<div class="relative w-36 shrink-0">
				<div
					class="mb-3 text-center text-[10px] font-black tracking-widest text-blue-600 uppercase"
				>
					Outer Table (N)
				</div>
				<div class="relative space-y-3">
					<!-- Selection cursor -->
					<div
						class="anim-anchor pointer-events-none absolute right-0 left-0 z-20 h-[36px] rounded border-2 border-blue-500 bg-blue-500/5"
					></div>
					<!-- Row 0: value 5 -->
					<div
						class="relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="font-mono text-[10px] text-stone-400">Col1.a</span>
						<span class="val-5 rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">5</span
						>
					</div>
					<!-- Row 1: value 22 -->
					<div
						class="relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="font-mono text-[10px] text-stone-400">Col1.b</span>
						<span class="val-22 rounded bg-stone-100 px-2 font-mono font-bold text-stone-800"
							>22</span
						>
					</div>
				</div>
			</div>

			<!-- Connector: SVG with 6 pre-drawn lines, faded in/out per comparison -->
			<div class="relative mt-[26px] w-20 shrink-0" style="height: 132px;">
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 80 132"
					class="overflow-visible"
					preserveAspectRatio="none"
				>
					<!--
                        Left endpoints (outer rows):  row0 center = 18, row1 center = 66
                        Right endpoints (inner rows): row0 center = 18, row1 center = 66, row2 center = 114
                    -->
					<!-- Outer0 → Inner0: no match (blue) -->
					<line
						class="line-0-0"
						x1="0"
						y1="18"
						x2="80"
						y2="18"
						stroke="#3b82f6"
						stroke-width="1.5"
						stroke-dasharray="4 3"
					/>
					<!-- Outer0 → Inner1: MATCH 5==5 (green, thicker) -->
					<line
						class="line-0-1"
						x1="0"
						y1="18"
						x2="80"
						y2="66"
						stroke="#22c55e"
						stroke-width="2.5"
						stroke-dasharray="4 3"
					/>
					<!-- Outer0 → Inner2: no match (blue) -->
					<line
						class="line-0-2"
						x1="0"
						y1="18"
						x2="80"
						y2="114"
						stroke="#3b82f6"
						stroke-width="1.5"
						stroke-dasharray="4 3"
					/>
					<!-- Outer1 → Inner0: no match (blue) -->
					<line
						class="line-1-0"
						x1="0"
						y1="66"
						x2="80"
						y2="18"
						stroke="#3b82f6"
						stroke-width="1.5"
						stroke-dasharray="4 3"
					/>
					<!-- Outer1 → Inner1: no match (blue) -->
					<line
						class="line-1-1"
						x1="0"
						y1="66"
						x2="80"
						y2="66"
						stroke="#3b82f6"
						stroke-width="1.5"
						stroke-dasharray="4 3"
					/>
					<!-- Outer1 → Inner2: MATCH 22==22 (green, thicker) -->
					<line
						class="line-1-2"
						x1="0"
						y1="66"
						x2="80"
						y2="114"
						stroke="#22c55e"
						stroke-width="2.5"
						stroke-dasharray="4 3"
					/>
				</svg>
			</div>

			<!-- Inner Table -->
			<div class="relative w-36 shrink-0">
				<div
					class="mb-3 text-center text-[10px] font-black tracking-widest text-amber-600 uppercase"
				>
					Inner Table (M)
				</div>
				<div class="relative space-y-3">
					<!-- Selection cursor -->
					<div
						class="anim-inner pointer-events-none absolute right-0 left-0 z-20 h-[36px] rounded border-2 border-amber-500 bg-amber-500/5"
					></div>
					<!-- Row 0: value 10 -->
					<div
						class="relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="rounded bg-stone-100 px-2 font-mono font-bold text-stone-800">10</span>
						<span class="font-mono text-[10px] text-stone-400">Col2.a</span>
					</div>
					<!-- Row 1: value 5 -->
					<div
						class="relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="ival-5 rounded bg-stone-100 px-2 font-mono font-bold text-stone-800"
							>5</span
						>
						<span class="font-mono text-[10px] text-stone-400">Col2.b</span>
					</div>
					<!-- Row 2: value 22 -->
					<div
						class="relative z-10 flex h-[36px] items-center justify-between rounded border border-stone-200 bg-white px-4"
					>
						<span class="ival-22 rounded bg-stone-100 px-2 font-mono font-bold text-stone-800"
							>22</span
						>
						<span class="font-mono text-[10px] text-stone-400">Col2.c</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div
			class="flex w-full shrink-0 items-center justify-between rounded-b-lg border-t border-stone-100 bg-stone-50/50 p-3 pt-4"
		>
			<div class="flex flex-col">
				<span class="text-[10px] font-black text-stone-500 uppercase">Complexity</span>
				<span class="font-mono text-xs font-bold text-red-600">O(N &times; M)</span>
			</div>
			<div class="max-w-[200px] text-right text-[9px] font-medium text-stone-400 italic">
				Each outer row is compared against every inner row. Matches glow green.
			</div>
		</div>
	</div>
</div>
