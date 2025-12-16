<div class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-8 font-sans shadow-sm">
	<h5 class="mb-6 text-center text-xl font-bold text-stone-900">Deadlock Detection Sequence</h5>

	<style>
		:root {
			/* Total Cycle: 12 seconds */
			--anim-total: 12s;

			--c-red: #ef4444;
			--c-yellow: #f59e0b;
			--c-stone: #e7e5e4;
		}

		.dl-stage {
			animation-duration: var(--anim-total);
			animation-iteration-count: infinite;
			animation-fill-mode: both;
			animation-timing-function: linear;
		}

		/* --- 1. RED LINES (LOCKED) --- */
		/* Occurs: 5% to 10% */
		@keyframes red-line-draw {
			0%,
			5% {
				stroke-dashoffset: 250;
				opacity: 0;
			}
			10%,
			90% {
				stroke-dashoffset: 0;
				opacity: 1;
				stroke: var(--c-red);
			}
			95%,
			100% {
				stroke-dashoffset: 250;
				opacity: 0;
			}
		}

		@keyframes red-label-fade {
			0%,
			10% {
				opacity: 0;
				transform: translate(-50%, -50%) scale(0.8);
			}
			12%,
			90% {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1);
			}
			95%,
			100% {
				opacity: 0;
				transform: translate(-50%, -50%) scale(0.8);
			}
		}

		/* --- 2. YELLOW LINES (GROWING) --- */
		/* Occurs: 20% to 30% */
		/* We animate the stroke-dashoffset of a MASK to make the dashed line reveal/grow */
		@keyframes yellow-line-grow {
			0%,
			20% {
				stroke-dashoffset: 250;
			}
			30%,
			85% {
				stroke-dashoffset: 0;
			} /* Reaches destination */
			95%,
			100% {
				stroke-dashoffset: 250;
			}
		}

		/* Opacity control for the yellow line group */
		@keyframes yellow-line-opacity {
			0%,
			19% {
				opacity: 0;
			}
			20%,
			85% {
				opacity: 1;
			}
			95%,
			100% {
				opacity: 0;
			}
		}

		/* --- 3. WAITING LABELS --- */
		/* Occurs: 30% (After lines finish growing) */
		@keyframes yellow-label-pop {
			0%,
			30% {
				opacity: 0;
				transform: translate(-50%, -40%) scale(0.8);
			}
			32%,
			85% {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1);
			}
			95%,
			100% {
				opacity: 0;
				transform: translate(-50%, -40%) scale(0.8);
			}
		}

		/* --- 4. TIMER (The 3-second lie) --- */
		/* Occurs: Starts at 35%, Ends at 60% (Duration = 25% of 12s = 3 seconds) */
		@keyframes timer-appear {
			0%,
			34% {
				opacity: 0;
				transform: translate(-50%, -40%) scale(0.9);
			}
			35%,
			60% {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1);
			}
			61%,
			100% {
				opacity: 0;
				transform: translate(-50%, -40%) scale(0.9);
			}
		}

		@keyframes timer-bar {
			0%,
			35% {
				width: 100%;
				background-color: #22c55e;
			} /* Green start */
			48% {
				background-color: #eab308;
			} /* Yellow mid */
			60% {
				width: 0%;
				background-color: #ef4444;
			} /* Red end */
			100% {
				width: 0%;
			}
		}

		/* --- 5. DEADLOCK --- */
		/* Occurs: 61% (Immediately after timer dies) */
		@keyframes deadlock-pop {
			0%,
			60% {
				opacity: 0;
				transform: translate(-50%, -50%) scale(0.5);
			}
			62%,
			65% {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1.1);
			}
			68%,
			85% {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1);
			}
			95%,
			100% {
				opacity: 0;
				transform: translate(-50%, -50%) scale(0.5);
			}
		}

		/* Class Mappings */
		.anim-red-line {
			animation-name: red-line-draw;
			stroke-dasharray: 250;
		}
		.anim-red-label {
			animation-name: red-label-fade;
		}

		.anim-yellow-mask {
			animation-name: yellow-line-grow;
			stroke-dasharray: 250; /* The mask is solid, so we use large array */
		}
		.anim-yellow-group {
			animation-name: yellow-line-opacity;
		}
		.anim-yellow-label {
			animation-name: yellow-label-pop;
		}

		.anim-timer-cont {
			animation-name: timer-appear;
		}
		.anim-timer-fill {
			animation-name: timer-bar;
		}
		.anim-deadlock {
			animation-name: deadlock-pop;
		}
	</style>

	<div
		class="relative mx-auto h-[350px] w-full max-w-[600px] overflow-hidden rounded-xl border border-stone-100 bg-stone-50"
	>
		<div
			class="dl-stage anim-deadlock absolute top-1/2 left-1/2 z-50 rounded-lg border-2 border-red-700 bg-red-600 px-6 py-3 text-center text-lg font-bold whitespace-nowrap text-white shadow-2xl"
		>
			Deadlock detected
		</div>

		<div
			class="dl-stage anim-timer-cont absolute top-1/2 left-1/2 z-40 flex w-40 flex-col items-center gap-1 rounded-xl border border-stone-200 bg-white p-3 shadow-xl"
		>
			<div class="flex w-full justify-between text-xs font-bold text-stone-500">
				<span>TIMEOUT</span>
				<span class="font-mono text-red-500">1.0s</span>
			</div>
			<div class="h-2 w-full overflow-hidden rounded-full bg-stone-100">
				<div class="dl-stage anim-timer-fill h-full bg-green-500"></div>
			</div>
		</div>

		<svg class="pointer-events-none absolute inset-0 z-10 h-full w-full">
			<defs>
				<mask id="mask-t1-r2">
					<line
						x1="20%"
						y1="50%"
						x2="50%"
						y2="80%"
						stroke="white"
						stroke-width="5"
						class="dl-stage anim-yellow-mask"
					/>
				</mask>
				<mask id="mask-t2-r1">
					<line
						x1="80%"
						y1="50%"
						x2="50%"
						y2="20%"
						stroke="white"
						stroke-width="5"
						class="dl-stage anim-yellow-mask"
					/>
				</mask>
			</defs>

			<line
				x1="20%"
				y1="50%"
				x2="50%"
				y2="20%"
				stroke-width="3"
				stroke-linecap="round"
				class="dl-stage anim-red-line"
			/>

			<line
				x1="80%"
				y1="50%"
				x2="50%"
				y2="80%"
				stroke-width="3"
				stroke-linecap="round"
				class="dl-stage anim-red-line"
			/>

			<g class="dl-stage anim-yellow-group">
				<line
					x1="20%"
					y1="50%"
					x2="50%"
					y2="80%"
					stroke="#f59e0b"
					stroke-width="3"
					stroke-linecap="round"
					stroke-dasharray="8"
					mask="url(#mask-t1-r2)"
				/>
			</g>

			<g class="dl-stage anim-yellow-group">
				<line
					x1="80%"
					y1="50%"
					x2="50%"
					y2="20%"
					stroke="#f59e0b"
					stroke-width="3"
					stroke-linecap="round"
					stroke-dasharray="8"
					mask="url(#mask-t2-r1)"
				/>
			</g>
		</svg>

		<div
			class="dl-stage anim-red-label absolute top-[35%] left-[35%] z-20 rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 shadow-sm"
		>
			LOCKED
		</div>
		<div
			class="dl-stage anim-red-label absolute top-[65%] left-[65%] z-20 rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 shadow-sm"
		>
			LOCKED
		</div>

		<div
			class="dl-stage anim-yellow-label absolute top-[65%] left-[35%] z-20 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 shadow-sm"
		>
			WAITING
		</div>
		<div
			class="dl-stage anim-yellow-label absolute top-[35%] left-[65%] z-20 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 shadow-sm"
		>
			WAITING
		</div>

		<div
			class="absolute top-1/2 left-[20%] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
		>
			<div
				class="relative z-20 flex h-14 w-14 items-center justify-center rounded-lg border-2 border-stone-800 bg-white shadow-sm"
			>
				<span class="font-bold text-stone-800">Q1</span>
			</div>
		</div>

		<div
			class="absolute top-1/2 left-[80%] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
		>
			<div
				class="relative z-20 flex h-14 w-14 items-center justify-center rounded-lg border-2 border-stone-800 bg-white shadow-sm"
			>
				<span class="font-bold text-stone-800">Q2</span>
			</div>
		</div>

		<div
			class="absolute top-[20%] left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center"
		>
			<svg width="40" height="40" viewBox="0 0 40 40">
				<circle cx="20" cy="20" r="18" fill="white" stroke="#e7e5e4" stroke-width="2" />
				<text
					x="50%"
					y="55%"
					text-anchor="middle"
					dominant-baseline="middle"
					font-size="10"
					font-weight="bold"
					fill="#78716c">R1</text
				>
			</svg>
		</div>

		<div
			class="absolute top-[80%] left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center"
		>
			<svg width="40" height="40" viewBox="0 0 40 40">
				<circle cx="20" cy="20" r="18" fill="white" stroke="#e7e5e4" stroke-width="2" />
				<text
					x="50%"
					y="55%"
					text-anchor="middle"
					dominant-baseline="middle"
					font-size="10"
					font-weight="bold"
					fill="#78716c">R2</text
				>
			</svg>
		</div>
	</div>
	<div class="mt-4 flex justify-center gap-8 text-xs font-medium text-stone-500">
		<div class="flex items-center gap-2">
			<div class="h-1 w-8 rounded bg-[#ff3e00]"></div>
			<span>Lock Held</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="h-1 w-8 border-b-2 border-dashed border-amber-400"></div>
			<span>Blocked Wait</span>
		</div>
	</div>
</div>
