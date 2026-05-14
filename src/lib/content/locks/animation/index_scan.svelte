<div
	class="mt-4 mb-8 rounded-xl border border-stone-100 bg-white p-4 font-sans text-stone-600 shadow-sm md:p-6"
	style="--scan-speed: 12s;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Index Scan: Lookup & Fetch
	</h5>

	<style>
		/* BUFFER LIFECYCLES */
		@keyframes idx-page-flow {
			0%,
			5% {
				transform: translateY(20px);
				opacity: 0;
			}
			10%,
			90% {
				transform: translateY(0);
				opacity: 1;
			}
			95%,
			100% {
				transform: translateY(-20px);
				opacity: 0;
			}
		}
		@keyframes p1-swap {
			0%,
			15% {
				transform: translateY(20px);
				opacity: 0;
			}
			20%,
			45% {
				transform: translateY(0);
				opacity: 1;
			}
			50%,
			100% {
				transform: translateY(-20px);
				opacity: 0;
			}
		}
		@keyframes p3-swap {
			0%,
			55% {
				transform: translateY(20px);
				opacity: 0;
			}
			60%,
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

		/* SCANNERS (24px header offset, 52px second row offset) */
		@keyframes idx-scan {
			0%,
			10% {
				opacity: 0;
				transform: translateY(24px);
			}
			12%,
			45% {
				opacity: 1;
				transform: translateY(24px);
				border-color: #a855f7;
				background-color: rgba(168, 85, 247, 0.1);
			}
			48%,
			49% {
				opacity: 0;
				transform: translateY(24px);
			}
			50%,
			85% {
				opacity: 1;
				transform: translateY(52px);
				border-color: #a855f7;
				background-color: rgba(168, 85, 247, 0.1);
			}
			88%,
			100% {
				opacity: 0;
				transform: translateY(52px);
			}
		}
		@keyframes p1-scan {
			0%,
			25% {
				opacity: 0;
				transform: translateY(24px);
			}
			30%,
			42% {
				opacity: 1;
				transform: translateY(24px);
				border-color: #22c55e;
				background-color: rgba(34, 197, 94, 0.1);
			}
			45%,
			100% {
				opacity: 0;
				transform: translateY(24px);
			}
		}
		@keyframes p3-scan {
			0%,
			65% {
				opacity: 0;
				transform: translateY(52px);
			}
			70%,
			82% {
				opacity: 1;
				transform: translateY(52px);
				border-color: #22c55e;
				background-color: rgba(34, 197, 94, 0.1);
			}
			85%,
			100% {
				opacity: 0;
				transform: translateY(52px);
			}
		}

		/* DISK HIGHLIGHTS */
		@keyframes disk-idx {
			0%,
			4% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
			5%,
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
		@keyframes disk-p1 {
			0%,
			14% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
			16%,
			46% {
				border-color: #3b82f6;
				background-color: #eff6ff;
			}
			48%,
			100% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
		}
		@keyframes disk-p3 {
			0%,
			54% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
			56%,
			86% {
				border-color: #3b82f6;
				background-color: #eff6ff;
			}
			88%,
			100% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
		}

		/* ASSIGNMENTS */
		.anim-idx-page {
			animation: idx-page-flow var(--scan-speed) infinite ease-in-out;
		}
		.anim-p1-page {
			animation: p1-swap var(--scan-speed) infinite ease-in-out;
		}
		.anim-p3-page {
			animation: p3-swap var(--scan-speed) infinite ease-in-out;
		}

		.anim-idx-scan {
			animation: idx-scan var(--scan-speed) infinite cubic-bezier(0.4, 0, 0.2, 1);
		}
		.anim-p1-scan {
			animation: p1-scan var(--scan-speed) infinite cubic-bezier(0.4, 0, 0.2, 1);
		}
		.anim-p3-scan {
			animation: p3-scan var(--scan-speed) infinite cubic-bezier(0.4, 0, 0.2, 1);
		}

		.anim-disk-idx {
			animation: disk-idx var(--scan-speed) infinite;
		}
		.anim-disk-p1 {
			animation: disk-p1 var(--scan-speed) infinite;
		}
		.anim-disk-p3 {
			animation: disk-p3 var(--scan-speed) infinite;
		}
	</style>

	<div class="relative mx-auto flex max-w-md flex-col items-center gap-6">
		<div
			class="relative flex h-[160px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 p-3"
		>
			<div class="absolute top-2 left-3 z-10 flex w-[calc(100%-24px)] items-center justify-between">
				<div class="text-[9px] font-bold tracking-tight text-stone-400 uppercase">
					Memory Buffer (RAM)
				</div>
				<div
					class="rounded bg-stone-800 px-1.5 py-0.5 font-mono text-[9px] text-blue-300 shadow-sm"
				>
					SELECT * WHERE name LIKE 'A%'
				</div>
			</div>

			<div class="relative mt-5 flex h-[96px] w-full gap-3">
				<div class="relative h-full w-1/2">
					<div
						class="anim-idx-page absolute inset-0 flex flex-col rounded border-2 border-purple-200 bg-white p-1 font-mono text-[9px] shadow-sm"
					>
						<div
							class="anim-idx-scan pointer-events-none absolute right-1 left-1 z-20 h-[28px] rounded border-2 border-purple-500 bg-purple-500/5 shadow-[0_0_6px_rgba(168,85,247,0.2)]"
						></div>

						<div
							class="mb-1 flex h-[24px] shrink-0 items-center justify-between rounded bg-purple-50 px-2"
						>
							<span class="font-bold text-purple-700">name_idx</span>
							<span class="text-purple-400">Idx Pg</span>
						</div>

						<div class="flex h-[28px] items-center justify-between rounded px-2">
							<span class="font-bold text-stone-700">"Alex"</span>
							<span class="font-bold text-purple-600">ptr: Pg 1</span>
						</div>
						<div class="flex h-[28px] items-center justify-between rounded px-2">
							<span class="font-bold text-stone-700">"Anna"</span>
							<span class="font-bold text-purple-600">ptr: Pg 3</span>
						</div>
					</div>
				</div>

				<div class="relative h-full w-1/2">
					<div
						class="anim-p1-page absolute inset-0 flex flex-col rounded border border-stone-200 bg-white p-1 font-mono text-[9px] shadow-sm"
					>
						<div
							class="anim-p1-scan pointer-events-none absolute right-1 left-1 z-20 h-[28px] rounded border-2 border-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.2)]"
						></div>

						<div
							class="mb-1 flex h-[24px] shrink-0 items-center justify-between rounded bg-stone-100 px-2"
						>
							<span class="font-bold text-stone-600">Table Pg 1</span>
						</div>

						<div class="flex h-[28px] items-center justify-between rounded px-1.5">
							<span class="font-bold text-stone-900">&#123;id:1, name:"Alex"&#125;</span>
							<span class="font-bold text-green-600">Fetch!</span>
						</div>
						<div class="flex h-[28px] items-center px-1.5 text-stone-400">
							&#123;id:2, name:"Bob"&#125;
						</div>
					</div>

					<div
						class="anim-p3-page absolute inset-0 flex flex-col rounded border border-stone-200 bg-white p-1 font-mono text-[9px] shadow-sm"
					>
						<div
							class="anim-p3-scan pointer-events-none absolute right-1 left-1 z-20 h-[28px] rounded border-2 border-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.2)]"
						></div>

						<div
							class="mb-1 flex h-[24px] shrink-0 items-center justify-between rounded bg-stone-100 px-2"
						>
							<span class="font-bold text-stone-600">Table Pg 3</span>
						</div>

						<div class="flex h-[28px] items-center px-1.5 text-stone-400">
							&#123;id:5, name:"Zack"&#125;
						</div>
						<div class="flex h-[28px] items-center justify-between rounded px-1.5">
							<span class="font-bold text-stone-900">&#123;id:6, name:"Anna"&#125;</span>
							<span class="font-bold text-green-600">Fetch!</span>
						</div>
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

		<div class="flex w-full gap-3">
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
					class="anim-disk-idx flex h-10 flex-col items-center justify-center rounded border-2 border-stone-200 bg-stone-50 font-mono text-[9px] text-purple-700 transition-colors"
				>
					<span class="font-bold">Index Page</span>
				</div>
			</div>

			<div class="flex-[1.5] rounded border border-stone-200 bg-white p-3 shadow-sm">
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
				<div class="grid grid-cols-3 gap-1.5">
					<div
						class="anim-disk-p1 flex h-10 flex-col items-center justify-center rounded border-2 border-stone-200 bg-stone-50 font-mono text-[8px] font-bold text-stone-500 transition-colors"
					>
						Page 1
					</div>
					<div
						class="flex h-10 flex-col items-center justify-center rounded border border-stone-100 bg-stone-50 font-mono text-[8px] text-stone-300"
					>
						Page 2
					</div>
					<div
						class="anim-disk-p3 flex h-10 flex-col items-center justify-center rounded border-2 border-stone-200 bg-stone-50 font-mono text-[8px] font-bold text-stone-500 transition-colors"
					>
						Page 3
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 flex flex-col items-center gap-1">
		<div class="text-[10px] font-medium tracking-widest text-stone-400 uppercase">
			Algorithm: <span class="font-bold text-stone-700">Index Scan (Two-Step Fetch)</span>
		</div>
		<div class="h-1 w-32 overflow-hidden rounded-full bg-stone-100">
			<div
				class="h-full bg-blue-500"
				style="animation: progress var(--scan-speed) infinite linear;"
			></div>
		</div>
	</div>

	<style>
		@keyframes progress {
			0% {
				width: 0%;
			}
			90% {
				width: 100%;
			}
			100% {
				width: 100%;
			}
		}
	</style>
</div>
