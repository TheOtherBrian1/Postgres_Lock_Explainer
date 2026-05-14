<div
	class="mt-4 mb-8 rounded-xl border border-stone-100 bg-white p-4 font-sans text-stone-600 shadow-sm md:p-6"
	style="--scan-speed: 6s;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Index-Only Scan: Bypassing the Table
	</h5>

	<style>
		/* PAGE SWAPPING */
		@keyframes index-page-flow {
			0%,
			10% {
				transform: translateY(20px);
				opacity: 0;
			}
			15%,
			85% {
				transform: translateY(0);
				opacity: 1;
			}
			90%,
			100% {
				transform: translateY(-20px);
				opacity: 0;
			}
		}

		/* SCANNER MOVEMENTS */
		@keyframes index-scan {
			0%,
			20% {
				opacity: 0;
				transform: translateY(30px);
			}
			25%,
			40% {
				opacity: 1;
				transform: translateY(30px);
				border-color: #a855f7;
				background-color: rgba(168, 85, 247, 0.05);
			}
			45%,
			75% {
				opacity: 1;
				transform: translateY(58px);
				border-color: #22c55e;
				background-color: rgba(34, 197, 94, 0.1);
			} /* Match! */
			80%,
			100% {
				opacity: 0;
				transform: translateY(58px);
			}
		}

		/* MATCH HIGHLIGHT */
		@keyframes row-match {
			0%,
			44% {
				background-color: white;
				border-color: transparent;
			}
			45%,
			75% {
				background-color: #f0fdf4;
				border-color: #bbf7d0;
			}
			76%,
			100% {
				background-color: white;
				border-color: transparent;
			}
		}

		/* DISK HIGHLIGHTS */
		@keyframes disk-index-read {
			0%,
			10% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
			15%,
			85% {
				border-color: #a855f7;
				background-color: #faf5ff;
			}
			90%,
			100% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
		}

		/* CLASS ASSIGNMENTS */
		.index-page-anim {
			animation: index-page-flow var(--scan-speed) infinite ease-in-out;
		}
		.index-scan-anim {
			animation: index-scan var(--scan-speed) infinite cubic-bezier(0.4, 0, 0.2, 1);
		}
		.row-found {
			animation: row-match var(--scan-speed) infinite;
		}
		.disk-index-anim {
			animation: disk-index-read var(--scan-speed) infinite;
		}
	</style>

	<div class="relative mx-auto flex max-w-sm flex-col items-center gap-6">
		<div
			class="relative flex h-[160px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 p-3"
		>
			<div class="absolute top-2 left-3 z-10 flex w-[calc(100%-24px)] items-center justify-between">
				<div class="text-[9px] font-bold tracking-tight text-stone-400 uppercase">
					Memory Buffer
				</div>
				<div
					class="rounded bg-purple-900 px-1.5 py-0.5 font-mono text-[9px] text-purple-200 shadow-sm"
				>
					SELECT email WHERE email='jlee@'
				</div>
			</div>

			<div class="relative mt-6 h-[96px] w-full">
				<div
					class="index-page-anim absolute inset-0 flex flex-col space-y-1 rounded border-2 border-purple-200 bg-white p-1 font-mono text-[10px] shadow-sm"
				>
					<div
						class="index-scan-anim pointer-events-none absolute right-1 left-1 z-20 h-[28px] rounded border-2 border-purple-500 bg-purple-500/5 shadow-[0_0_8px_rgba(168,85,247,0.2)]"
					>
						<div class="absolute top-1.5 -left-5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#a855f7"
								stroke-width="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
							>
						</div>
					</div>

					<div class="mb-1 flex h-[24px] items-center justify-between rounded bg-purple-50 px-2">
						<span class="font-bold text-purple-700">Index Page (email_idx)</span>
						<span class="text-purple-400">8kB</span>
					</div>

					<div
						class="flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="text-stone-400">"alex@demo", ptr:0x1</span>
					</div>
					<div
						class="row-found flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="font-bold text-stone-900">"jlee@demo", ptr:0x5</span>
						<span class="text-[9px] font-bold text-green-600 uppercase">Data Found</span>
					</div>
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

		<div class="flex w-full gap-4">
			<div class="flex-1 rounded border border-purple-200 bg-white p-3 shadow-sm">
				<div
					class="mb-3 flex items-center gap-1.5 text-[9px] font-bold tracking-tighter text-purple-600 uppercase"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="10"
						height="10"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle
							cx="12"
							cy="12"
							r="3"
						/></svg
					>
					Index Data
				</div>
				<div
					class="disk-index-anim flex h-10 flex-col items-center justify-center rounded border-2 border-stone-200 bg-stone-50 font-mono text-[9px] text-purple-700 transition-colors"
				>
					<span class="font-bold">Index Page</span>
				</div>
			</div>

			<div class="flex-[1.5] rounded border border-stone-200 bg-stone-50 p-3 opacity-60">
				<div
					class="mb-3 flex items-center justify-between gap-1.5 text-[9px] font-bold tracking-tighter text-stone-500 uppercase"
				>
					<div class="flex items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" /><path d="M9 2v3" /><path
								d="M15 2v3"
							/><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M2 12h20" /><path
								d="M7 12v9"
							/><path d="M17 12v9" /></svg
						>
						Main Table (Heap)
					</div>
				</div>
				<div class="relative grid grid-cols-3 gap-1">
					<div
						class="absolute inset-0 z-10 flex items-center justify-center rounded bg-stone-200/60 backdrop-blur-[1px]"
					>
						<span
							class="rounded bg-stone-700 px-2 py-1 text-[8px] font-bold tracking-widest text-white uppercase shadow-sm"
							>Bypassed (0 I/O)</span
						>
					</div>

					<div
						class="flex h-10 flex-col items-center justify-center rounded border border-stone-200 bg-white font-mono text-[8px] text-stone-400"
					>
						Page 1
					</div>
					<div
						class="flex h-10 flex-col items-center justify-center rounded border border-stone-200 bg-white font-mono text-[8px] text-stone-400"
					>
						Page 2
					</div>
					<div
						class="flex h-10 flex-col items-center justify-center rounded border border-stone-200 bg-white font-mono text-[8px] text-stone-400"
					>
						Page 3
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 flex flex-col items-center gap-1">
		<div class="text-[10px] font-medium tracking-widest text-purple-500 uppercase">
			Algorithm: <span class="font-bold text-purple-700">Index-Only Scan</span>
		</div>
		<div class="h-1 w-32 overflow-hidden rounded-full bg-stone-100">
			<div
				class="h-full bg-purple-500"
				style="animation: progress var(--scan-speed) infinite linear;"
			></div>
		</div>
	</div>

	<style>
		@keyframes progress {
			0% {
				width: 0%;
			}
			75% {
				width: 100%;
			}
			100% {
				width: 100%;
			}
		}
	</style>
</div>
