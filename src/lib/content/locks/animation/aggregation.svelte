<div
	class="mt-4 mb-8 rounded-xl border border-stone-200 bg-white p-4 font-sans text-stone-600 shadow-md md:p-6"
	style="--agg-speed: 14s;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Aggregate Node: Iterative State
	</h5>

	<style>
		/* SCANNER MOVEMENT OVER THE PURCHASES LIST (Aligned to 32px height + 8px gap) */
		@keyframes scan-agg {
			0%,
			4% {
				opacity: 0;
				transform: translateY(0);
			}
			5%,
			20% {
				opacity: 1;
				transform: translateY(0);
			} /* Scan 10 */
			21%,
			24% {
				opacity: 0;
				transform: translateY(40px);
			}
			25%,
			40% {
				opacity: 1;
				transform: translateY(40px);
			} /* Scan 25 */
			41%,
			44% {
				opacity: 0;
				transform: translateY(80px);
			}
			45%,
			60% {
				opacity: 1;
				transform: translateY(80px);
			} /* Scan 15 */
			61%,
			64% {
				opacity: 0;
				transform: translateY(120px);
			}
			65%,
			80% {
				opacity: 1;
				transform: translateY(120px);
			} /* Scan 50 */
			81%,
			100% {
				opacity: 0;
				transform: translateY(120px);
			}
		}

		/* FLOATING ADDITIONS OVER THE 'SUM' NODE (Moved higher to prevent obfuscation) */
		@keyframes float-10 {
			0%,
			9% {
				opacity: 0;
				transform: translate(-50%, -10px) scale(0.8);
			}
			12%,
			17% {
				opacity: 1;
				transform: translate(-50%, -55px) scale(1.1);
				color: #a855f7;
			}
			20%,
			100% {
				opacity: 0;
				transform: translate(-50%, -70px) scale(1);
			}
		}
		@keyframes float-25 {
			0%,
			29% {
				opacity: 0;
				transform: translate(-50%, -10px) scale(0.8);
			}
			32%,
			37% {
				opacity: 1;
				transform: translate(-50%, -55px) scale(1.1);
				color: #a855f7;
			}
			40%,
			100% {
				opacity: 0;
				transform: translate(-50%, -70px) scale(1);
			}
		}
		@keyframes float-15 {
			0%,
			49% {
				opacity: 0;
				transform: translate(-50%, -10px) scale(0.8);
			}
			52%,
			57% {
				opacity: 1;
				transform: translate(-50%, -55px) scale(1.1);
				color: #a855f7;
			}
			60%,
			100% {
				opacity: 0;
				transform: translate(-50%, -70px) scale(1);
			}
		}
		@keyframes float-50 {
			0%,
			69% {
				opacity: 0;
				transform: translate(-50%, -10px) scale(0.8);
			}
			72%,
			77% {
				opacity: 1;
				transform: translate(-50%, -55px) scale(1.1);
				color: #a855f7;
			}
			80%,
			100% {
				opacity: 0;
				transform: translate(-50%, -70px) scale(1);
			}
		}

		/* STATE VALUE UPDATES */
		@keyframes val-0 {
			0%,
			13% {
				opacity: 1;
				transform: scale(1);
			}
			14%,
			100% {
				opacity: 0;
				transform: scale(0.9);
			}
		}
		@keyframes val-10 {
			0%,
			13% {
				opacity: 0;
				transform: scale(0.9);
			}
			14%,
			16% {
				transform: scale(1.1);
			}
			17%,
			33% {
				opacity: 1;
				transform: scale(1);
			}
			34%,
			100% {
				opacity: 0;
				transform: scale(0.9);
			}
		}
		@keyframes val-35 {
			0%,
			33% {
				opacity: 0;
				transform: scale(0.9);
			}
			34%,
			36% {
				transform: scale(1.1);
			}
			37%,
			53% {
				opacity: 1;
				transform: scale(1);
			}
			54%,
			100% {
				opacity: 0;
				transform: scale(0.9);
			}
		}
		@keyframes val-50 {
			0%,
			53% {
				opacity: 0;
				transform: scale(0.9);
			}
			54%,
			56% {
				transform: scale(1.1);
			}
			57%,
			73% {
				opacity: 1;
				transform: scale(1);
			}
			74%,
			100% {
				opacity: 0;
				transform: scale(0.9);
			}
		}
		@keyframes val-100 {
			0%,
			73% {
				opacity: 0;
				transform: scale(0.9);
			}
			74%,
			76% {
				transform: scale(1.1);
			}
			77%,
			100% {
				opacity: 1;
				transform: scale(1);
			}
		}

		/* STATE BOX SUCCESS HIGHLIGHT & RETURN */
		@keyframes state-box-pulse {
			0%,
			80% {
				background-color: #eff6ff;
				border-color: #bfdbfe;
				color: #1e3a8a;
				box-shadow: none;
			}
			82%,
			95% {
				background-color: #dcfce7;
				border-color: #22c55e;
				color: #166534;
				box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2);
			}
			98%,
			100% {
				background-color: #eff6ff;
				border-color: #bfdbfe;
				color: #1e3a8a;
				box-shadow: none;
			}
		}

		@keyframes return-label {
			0%,
			80% {
				opacity: 0;
				transform: translateY(5px);
			}
			83%,
			95% {
				opacity: 1;
				transform: translateY(0);
			}
			98%,
			100% {
				opacity: 0;
				transform: translateY(5px);
			}
		}

		/* SVG DATA FLOW */
		@keyframes dash-flow {
			to {
				stroke-dashoffset: -16;
			}
		}

		/* CLASS ASSIGNMENTS */
		.anim-scanner {
			animation: scan-agg var(--agg-speed) infinite linear;
		}
		.anim-flow {
			animation: dash-flow 1s linear infinite;
			stroke-dasharray: 6 6;
		}

		.add-10 {
			animation: float-10 var(--agg-speed) infinite ease-out;
		}
		.add-25 {
			animation: float-25 var(--agg-speed) infinite ease-out;
		}
		.add-15 {
			animation: float-15 var(--agg-speed) infinite ease-out;
		}
		.add-50 {
			animation: float-50 var(--agg-speed) infinite ease-out;
		}

		.v-0 {
			animation: val-0 var(--agg-speed) infinite;
		}
		.v-10 {
			animation: val-10 var(--agg-speed) infinite;
		}
		.v-35 {
			animation: val-35 var(--agg-speed) infinite;
		}
		.v-50 {
			animation: val-50 var(--agg-speed) infinite;
		}
		.v-100 {
			animation: val-100 var(--agg-speed) infinite;
		}

		.anim-state {
			animation: state-box-pulse var(--agg-speed) infinite;
		}
		.anim-ret {
			animation: return-label var(--agg-speed) infinite ease-out;
		}
	</style>

	<div class="relative mx-auto flex w-full max-w-lg flex-col items-center gap-2">
		<div class="flex w-full justify-between px-2">
			<div
				class="w-32 text-center text-[10px] leading-tight font-black tracking-widest text-stone-500 uppercase"
			>
				purchases<br /><span class="text-[8px] font-bold tracking-normal text-stone-400 normal-case"
					>(Scan on Balance)</span
				>
			</div>
			<div class="w-24"></div>
			<div
				class="flex w-32 items-end justify-center text-center text-[10px] leading-tight font-black tracking-widest text-blue-600 uppercase"
			>
				State
			</div>
		</div>

		<div
			class="relative flex h-[160px] w-full items-center justify-between rounded-lg border border-stone-100 bg-stone-50/50 p-2"
		>
			<svg class="pointer-events-none absolute inset-0 h-full w-full" style="z-index: 0;">
				<line
					x1="25%"
					y1="50%"
					x2="42%"
					y2="50%"
					stroke="#cbd5e1"
					stroke-width="3"
					class="anim-flow"
				/>
				<line
					x1="58%"
					y1="50%"
					x2="75%"
					y2="50%"
					stroke="#cbd5e1"
					stroke-width="3"
					class="anim-flow"
				/>
				<polygon points="42%,50% 39%,48% 39%,52%" fill="#cbd5e1" />
				<polygon points="75%,50% 72%,48% 72%,52%" fill="#cbd5e1" />
			</svg>

			<div class="relative z-10 ml-2 flex w-32 shrink-0 flex-col gap-2">
				<div
					class="anim-scanner pointer-events-none absolute top-0 right-0 left-0 z-20 h-[32px] rounded border-2 border-blue-500 bg-blue-500/10 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
				></div>

				<div
					class="relative z-10 flex h-[32px] items-center justify-between rounded border border-stone-200 bg-white px-3 shadow-sm"
				>
					<span class="text-[10px] text-stone-400">id: 1</span>
					<span class="font-mono text-xs font-bold text-stone-800">10</span>
				</div>
				<div
					class="relative z-10 flex h-[32px] items-center justify-between rounded border border-stone-200 bg-white px-3 shadow-sm"
				>
					<span class="text-[10px] text-stone-400">id: 2</span>
					<span class="font-mono text-xs font-bold text-stone-800">25</span>
				</div>
				<div
					class="relative z-10 flex h-[32px] items-center justify-between rounded border border-stone-200 bg-white px-3 shadow-sm"
				>
					<span class="text-[10px] text-stone-400">id: 3</span>
					<span class="font-mono text-xs font-bold text-stone-800">15</span>
				</div>
				<div
					class="relative z-10 flex h-[32px] items-center justify-between rounded border border-stone-200 bg-white px-3 shadow-sm"
				>
					<span class="text-[10px] text-stone-400">id: 4</span>
					<span class="font-mono text-xs font-bold text-stone-800">50</span>
				</div>
			</div>

			<div class="relative z-10 flex flex-1 items-center justify-center">
				<div
					class="flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px] border-purple-500 bg-purple-100 font-mono text-[14px] font-black text-purple-700 shadow-md"
				>
					SUM
				</div>

				<div class="absolute top-1/2 left-1/2 font-mono text-lg font-bold">
					<span class="add-10 pointer-events-none absolute">+10</span>
					<span class="add-25 pointer-events-none absolute">+25</span>
					<span class="add-15 pointer-events-none absolute">+15</span>
					<span class="add-50 pointer-events-none absolute">+50</span>
				</div>
			</div>

			<div class="relative z-10 flex w-32 shrink-0 flex-col items-center justify-center pr-2">
				<div
					class="anim-state relative flex h-[48px] w-full max-w-[80px] items-center justify-center rounded-lg border-2 font-mono text-2xl font-black transition-colors duration-300"
				>
					<span class="v-0 absolute">0</span>
					<span class="v-10 absolute">10</span>
					<span class="v-35 absolute">35</span>
					<span class="v-50 absolute">50</span>
					<span class="v-100 absolute">100</span>
				</div>

				<div
					class="anim-ret absolute -bottom-6 w-full text-center text-[10px] font-bold tracking-widest whitespace-nowrap text-green-600 uppercase"
				>
					Returns Sum
				</div>
			</div>
		</div>

		<div class="mt-6 flex w-full flex-col items-center gap-1">
			<div class="text-[10px] font-medium tracking-widest text-stone-400 uppercase">
				Progress: <span class="text-stone-600">Aggregation Stream</span>
			</div>
			<div class="h-1 w-48 overflow-hidden rounded-full bg-stone-100">
				<div
					class="h-full bg-purple-500"
					style="animation: agg-progress var(--agg-speed) infinite linear;"
				></div>
			</div>
		</div>
	</div>

	<style>
		@keyframes agg-progress {
			0% {
				width: 0%;
			}
			80% {
				width: 100%;
			}
			100% {
				width: 100%;
			}
		}
	</style>
</div>
