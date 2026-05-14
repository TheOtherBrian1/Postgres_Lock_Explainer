<div
	class="mt-4 mb-8 rounded-xl border border-stone-200 bg-white p-4 font-sans text-stone-600 shadow-md md:p-6"
	style="--agg-speed: 14s;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Group By & Aggregate: Segmented State
	</h5>

	<style>
		/* SCANNER MOVEMENT (Sorted: A, A, B, B) */
		@keyframes scan-agg {
			0%,
			2% {
				opacity: 0;
				transform: translateY(0);
			}
			3%,
			18% {
				opacity: 1;
				transform: translateY(0);
				border-color: #a855f7;
				background-color: rgba(168, 85, 247, 0.1);
			} /* Scan User A (10) */
			19%,
			22% {
				opacity: 0;
				transform: translateY(40px);
			}
			23%,
			38% {
				opacity: 1;
				transform: translateY(40px);
				border-color: #a855f7;
				background-color: rgba(168, 85, 247, 0.1);
			} /* Scan User A (15) */
			39%,
			42% {
				opacity: 0;
				transform: translateY(80px);
			}
			43%,
			58% {
				opacity: 1;
				transform: translateY(80px);
				border-color: #f59e0b;
				background-color: rgba(245, 158, 11, 0.1);
			} /* Scan User B (25) */
			59%,
			62% {
				opacity: 0;
				transform: translateY(120px);
			}
			63%,
			78% {
				opacity: 1;
				transform: translateY(120px);
				border-color: #f59e0b;
				background-color: rgba(245, 158, 11, 0.1);
			} /* Scan User B (50) */
			79%,
			100% {
				opacity: 0;
				transform: translateY(120px);
			}
		}

		/* FLOATING ADDITIONS (Hovering high outside the SUM bubble) */
		@keyframes float-a-10 {
			0%,
			9% {
				opacity: 0;
				transform: translate(-50%, -15px) scale(0.8);
			}
			12%,
			16% {
				opacity: 1;
				transform: translate(-50%, -45px) scale(1.1);
				color: #a855f7;
			}
			18%,
			100% {
				opacity: 0;
				transform: translate(-50%, -55px) scale(1);
			}
		}
		@keyframes float-a-15 {
			0%,
			29% {
				opacity: 0;
				transform: translate(-50%, -15px) scale(0.8);
			}
			32%,
			36% {
				opacity: 1;
				transform: translate(-50%, -45px) scale(1.1);
				color: #a855f7;
			}
			38%,
			100% {
				opacity: 0;
				transform: translate(-50%, -55px) scale(1);
			}
		}
		@keyframes float-b-25 {
			0%,
			49% {
				opacity: 0;
				transform: translate(-50%, -15px) scale(0.8);
			}
			52%,
			56% {
				opacity: 1;
				transform: translate(-50%, -45px) scale(1.1);
				color: #d97706;
			}
			58%,
			100% {
				opacity: 0;
				transform: translate(-50%, -55px) scale(1);
			}
		}
		@keyframes float-b-50 {
			0%,
			69% {
				opacity: 0;
				transform: translate(-50%, -15px) scale(0.8);
			}
			72%,
			76% {
				opacity: 1;
				transform: translate(-50%, -45px) scale(1.1);
				color: #d97706;
			}
			78%,
			100% {
				opacity: 0;
				transform: translate(-50%, -55px) scale(1);
			}
		}

		/* STATE VALUE UPDATES: GROUP A */
		@keyframes val-a-0 {
			0%,
			14% {
				opacity: 1;
				transform: scale(1);
			}
			15%,
			100% {
				opacity: 0;
				transform: scale(0.9);
			}
		}
		@keyframes val-a-10 {
			0%,
			14% {
				opacity: 0;
				transform: scale(0.9);
			}
			15%,
			17% {
				transform: scale(1.1);
			}
			18%,
			34% {
				opacity: 1;
				transform: scale(1);
			}
			35%,
			100% {
				opacity: 0;
				transform: scale(0.9);
			}
		}
		@keyframes val-a-25 {
			0%,
			34% {
				opacity: 0;
				transform: scale(0.9);
			}
			35%,
			37% {
				transform: scale(1.1);
			}
			38%,
			100% {
				opacity: 1;
				transform: scale(1);
			}
		}

		/* STATE VALUE UPDATES: GROUP B */
		@keyframes val-b-0 {
			0%,
			54% {
				opacity: 1;
				transform: scale(1);
			}
			55%,
			100% {
				opacity: 0;
				transform: scale(0.9);
			}
		}
		@keyframes val-b-25 {
			0%,
			54% {
				opacity: 0;
				transform: scale(0.9);
			}
			55%,
			57% {
				transform: scale(1.1);
			}
			58%,
			74% {
				opacity: 1;
				transform: scale(1);
			}
			75%,
			100% {
				opacity: 0;
				transform: scale(0.9);
			}
		}
		@keyframes val-b-75 {
			0%,
			74% {
				opacity: 0;
				transform: scale(0.9);
			}
			75%,
			77% {
				transform: scale(1.1);
			}
			78%,
			100% {
				opacity: 1;
				transform: scale(1);
			}
		}

		/* SUCCESS HIGHLIGHTS */
		@keyframes box-pulse-a {
			0%,
			79% {
				background-color: #faf5ff;
				border-color: #e9d5ff;
				color: #6b21a8;
				box-shadow: none;
			}
			81%,
			95% {
				background-color: #dcfce7;
				border-color: #22c55e;
				color: #166534;
				box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
			}
			98%,
			100% {
				background-color: #faf5ff;
				border-color: #e9d5ff;
				color: #6b21a8;
				box-shadow: none;
			}
		}
		@keyframes box-pulse-b {
			0%,
			79% {
				background-color: #fffbeb;
				border-color: #fde68a;
				color: #92400e;
				box-shadow: none;
			}
			81%,
			95% {
				background-color: #dcfce7;
				border-color: #22c55e;
				color: #166534;
				box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
			}
			98%,
			100% {
				background-color: #fffbeb;
				border-color: #fde68a;
				color: #92400e;
				box-shadow: none;
			}
		}

		/* CLASS ASSIGNMENTS */
		.anim-scanner {
			animation: scan-agg var(--agg-speed) infinite cubic-bezier(0.4, 0, 0.2, 1);
		}

		.add-a-10 {
			animation: float-a-10 var(--agg-speed) infinite ease-out;
		}
		.add-a-15 {
			animation: float-a-15 var(--agg-speed) infinite ease-out;
		}
		.add-b-25 {
			animation: float-b-25 var(--agg-speed) infinite ease-out;
		}
		.add-b-50 {
			animation: float-b-50 var(--agg-speed) infinite ease-out;
		}

		.va-0 {
			animation: val-a-0 var(--agg-speed) infinite;
		}
		.va-10 {
			animation: val-a-10 var(--agg-speed) infinite;
		}
		.va-25 {
			animation: val-a-25 var(--agg-speed) infinite;
		}

		.vb-0 {
			animation: val-b-0 var(--agg-speed) infinite;
		}
		.vb-25 {
			animation: val-b-25 var(--agg-speed) infinite;
		}
		.vb-75 {
			animation: val-b-75 var(--agg-speed) infinite;
		}

		.anim-state-a {
			animation: box-pulse-a var(--agg-speed) infinite;
		}
		.anim-state-b {
			animation: box-pulse-b var(--agg-speed) infinite;
		}
	</style>

	<div class="relative mx-auto flex w-full max-w-lg flex-col items-center gap-2">
		<div class="flex w-full items-end justify-between px-2">
			<div
				class="w-[140px] text-center text-[10px] leading-tight font-black tracking-widest text-stone-500 uppercase"
			>
				Sorted Data<br /><span
					class="text-[8px] font-bold tracking-normal text-stone-400 normal-case"
					>Grouped by account_user</span
				>
			</div>
			<div class="w-16"></div>
			<div
				class="w-32 text-center text-[10px] leading-tight font-black tracking-widest text-stone-600 uppercase"
			>
				Partitioned State
			</div>
		</div>

		<div
			class="relative flex h-[170px] w-full items-center justify-between rounded-lg border border-stone-100 bg-stone-50/50 p-2"
		>
			<div class="relative z-10 flex w-[140px] shrink-0 flex-col gap-2">
				<div
					class="anim-scanner pointer-events-none absolute top-0 right-0 left-0 z-20 h-[32px] rounded border-2"
				></div>

				<div
					class="relative z-10 flex h-[32px] items-center justify-between rounded border border-stone-200 bg-white px-2 shadow-sm"
				>
					<span class="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold text-purple-700"
						>User A</span
					>
					<span class="font-mono text-xs font-bold text-stone-800">10</span>
				</div>
				<div
					class="relative z-10 flex h-[32px] items-center justify-between rounded border border-stone-200 bg-white px-2 shadow-sm"
				>
					<span class="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold text-purple-700"
						>User A</span
					>
					<span class="font-mono text-xs font-bold text-stone-800">15</span>
				</div>

				<div
					class="relative z-10 flex h-[32px] items-center justify-between rounded border border-stone-200 bg-white px-2 shadow-sm"
				>
					<span class="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700"
						>User B</span
					>
					<span class="font-mono text-xs font-bold text-stone-800">25</span>
				</div>
				<div
					class="relative z-10 flex h-[32px] items-center justify-between rounded border border-stone-200 bg-white px-2 shadow-sm"
				>
					<span class="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700"
						>User B</span
					>
					<span class="font-mono text-xs font-bold text-stone-800">50</span>
				</div>
			</div>

			<div class="flex h-full flex-1 flex-col justify-around pl-6">
				<div class="relative flex w-full items-center justify-between">
					<div
						class="relative z-10 flex h-[48px] w-[48px] items-center justify-center rounded-full border-[3px] border-purple-400 bg-purple-50 font-mono text-[12px] font-black text-purple-600 shadow-sm"
					>
						SUM
						<div class="absolute top-1/2 left-1/2 font-mono text-base font-bold">
							<span class="add-a-10 pointer-events-none absolute">+10</span>
							<span class="add-a-15 pointer-events-none absolute">+15</span>
						</div>
					</div>

					<svg
						class="pointer-events-none absolute left-[48px] h-4 w-[calc(100%-110px)] text-purple-200"
						preserveAspectRatio="none"
					>
						<line
							x1="10"
							y1="50%"
							x2="100%"
							y2="50%"
							stroke="currentColor"
							stroke-width="2"
							stroke-dasharray="4 4"
						/>
					</svg>

					<div
						class="anim-state-a relative z-10 mr-2 flex h-[40px] w-[64px] items-center justify-center rounded-lg border-2 font-mono text-xl font-black transition-colors duration-300"
					>
						<span class="va-0 absolute">0</span>
						<span class="va-10 absolute">10</span>
						<span class="va-25 absolute">25</span>
					</div>
				</div>

				<div class="relative flex w-full items-center justify-between">
					<div
						class="relative z-10 flex h-[48px] w-[48px] items-center justify-center rounded-full border-[3px] border-amber-400 bg-amber-50 font-mono text-[12px] font-black text-amber-600 shadow-sm"
					>
						SUM
						<div class="absolute top-1/2 left-1/2 font-mono text-base font-bold">
							<span class="add-b-25 pointer-events-none absolute">+25</span>
							<span class="add-b-50 pointer-events-none absolute">+50</span>
						</div>
					</div>

					<svg
						class="pointer-events-none absolute left-[48px] h-4 w-[calc(100%-110px)] text-amber-200"
						preserveAspectRatio="none"
					>
						<line
							x1="10"
							y1="50%"
							x2="100%"
							y2="50%"
							stroke="currentColor"
							stroke-width="2"
							stroke-dasharray="4 4"
						/>
					</svg>

					<div
						class="anim-state-b relative z-10 mr-2 flex h-[40px] w-[64px] items-center justify-center rounded-lg border-2 font-mono text-xl font-black transition-colors duration-300"
					>
						<span class="vb-0 absolute">0</span>
						<span class="vb-25 absolute">25</span>
						<span class="vb-75 absolute">75</span>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-6 flex w-full flex-col items-center gap-1">
			<div class="text-[10px] font-medium tracking-widest text-stone-400 uppercase">
				Progress: <span class="text-stone-600">Aggregation Stream</span>
			</div>
			<div class="h-1 w-48 overflow-hidden rounded-full bg-stone-100">
				<div
					class="h-full bg-blue-500"
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
