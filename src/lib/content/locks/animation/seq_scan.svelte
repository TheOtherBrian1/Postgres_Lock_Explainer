<div
	class="mt-4 mb-8 rounded-xl border border-stone-100 bg-white p-4 font-sans text-stone-600 shadow-sm md:p-6"
	style="--seq-speed: 12s;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Sequential Scan: Exhaustive Search
	</h5>

	<style>
		/* PAGE SWAPPING */
		@keyframes page-1-flow {
			0%,
			2% {
				transform: translateY(20px);
				opacity: 0;
			}
			6%,
			28% {
				transform: translateY(0);
				opacity: 1;
			}
			32%,
			100% {
				transform: translateY(-20px);
				opacity: 0;
			}
		}
		@keyframes page-2-flow {
			0%,
			31% {
				transform: translateY(20px);
				opacity: 0;
			}
			35%,
			61% {
				transform: translateY(0);
				opacity: 1;
			}
			65%,
			100% {
				transform: translateY(-20px);
				opacity: 0;
			}
		}
		@keyframes page-3-flow {
			0%,
			64% {
				transform: translateY(20px);
				opacity: 0;
			}
			68%,
			94% {
				transform: translateY(0);
				opacity: 1;
			}
			98%,
			100% {
				transform: translateY(-20px);
				opacity: 0;
			}
		}

		/* SCANNER MOVEMENTS */
		@keyframes scan-1 {
			0%,
			5% {
				opacity: 0;
				transform: translateY(30px);
			}
			8%,
			16% {
				opacity: 1;
				transform: translateY(30px);
			}
			18%,
			26% {
				opacity: 1;
				transform: translateY(58px);
			}
			29%,
			100% {
				opacity: 0;
				transform: translateY(58px);
			}
		}
		@keyframes scan-2 {
			0%,
			34% {
				opacity: 0;
				transform: translateY(30px);
				border-color: #3b82f6;
				background-color: rgba(59, 130, 246, 0.05);
			}
			37%,
			45% {
				opacity: 1;
				transform: translateY(30px);
				border-color: #22c55e;
				background-color: rgba(34, 197, 94, 0.1);
			} /* Match! */
			47%,
			59% {
				opacity: 1;
				transform: translateY(58px);
				border-color: #3b82f6;
				background-color: rgba(59, 130, 246, 0.05);
			} /* Move on */
			62%,
			100% {
				opacity: 0;
				transform: translateY(58px);
			}
		}
		@keyframes scan-3 {
			0%,
			67% {
				opacity: 0;
				transform: translateY(30px);
			}
			70%,
			79% {
				opacity: 1;
				transform: translateY(30px);
			}
			81%,
			92% {
				opacity: 1;
				transform: translateY(58px);
			}
			95%,
			100% {
				opacity: 0;
				transform: translateY(58px);
			}
		}

		/* STATUS ICONS (✓ / ✕) */
		@keyframes status-p1-r1 {
			0%,
			7% {
				opacity: 0;
			}
			8%,
			16% {
				opacity: 1;
				content: '✕';
				color: #ef4444;
			}
			17%,
			100% {
				opacity: 0;
			}
		}
		@keyframes status-p1-r2 {
			0%,
			17% {
				opacity: 0;
			}
			18%,
			26% {
				opacity: 1;
				content: '✕';
				color: #ef4444;
			}
			27%,
			100% {
				opacity: 0;
			}
		}
		@keyframes status-p2-r1 {
			0%,
			36% {
				opacity: 0;
			}
			37%,
			45% {
				opacity: 1;
				content: '✓';
				color: #22c55e;
			}
			46%,
			100% {
				opacity: 0;
			}
		}
		@keyframes status-p2-r2 {
			0%,
			46% {
				opacity: 0;
			}
			47%,
			59% {
				opacity: 1;
				content: '✕';
				color: #ef4444;
			}
			60%,
			100% {
				opacity: 0;
			}
		}
		@keyframes status-p3-r1 {
			0%,
			69% {
				opacity: 0;
			}
			70%,
			79% {
				opacity: 1;
				content: '✕';
				color: #ef4444;
			}
			80%,
			100% {
				opacity: 0;
			}
		}
		@keyframes status-p3-r2 {
			0%,
			80% {
				opacity: 0;
			}
			81%,
			92% {
				opacity: 1;
				content: '✕';
				color: #ef4444;
			}
			93%,
			100% {
				opacity: 0;
			}
		}

		/* MATCH HIGHLIGHT */
		@keyframes row-match {
			0%,
			36% {
				background-color: white;
				border-color: transparent;
			}
			37%,
			61% {
				background-color: #f0fdf4;
				border-color: #bbf7d0;
			}
			62%,
			100% {
				background-color: white;
				border-color: transparent;
			}
		}

		/* DISK HIGHLIGHTS */
		@keyframes disk-p1 {
			0%,
			4% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
			6%,
			30% {
				border-color: #3b82f6;
				background-color: #eff6ff;
			}
			32%,
			100% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
		}
		@keyframes disk-p2 {
			0%,
			33% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
			35%,
			63% {
				border-color: #3b82f6;
				background-color: #eff6ff;
			}
			65%,
			100% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
		}
		@keyframes disk-p3 {
			0%,
			66% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
			68%,
			96% {
				border-color: #3b82f6;
				background-color: #eff6ff;
			}
			98%,
			100% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
		}

		/* CLASS ASSIGNMENTS */
		.page-1-anim {
			animation: page-1-flow var(--seq-speed) infinite ease-in-out;
		}
		.page-2-anim {
			animation: page-2-flow var(--seq-speed) infinite ease-in-out;
		}
		.page-3-anim {
			animation: page-3-flow var(--seq-speed) infinite ease-in-out;
		}

		.scan-1-anim {
			animation: scan-1 var(--seq-speed) infinite cubic-bezier(0.4, 0, 0.2, 1);
		}
		.scan-2-anim {
			animation: scan-2 var(--seq-speed) infinite cubic-bezier(0.4, 0, 0.2, 1);
		}
		.scan-3-anim {
			animation: scan-3 var(--seq-speed) infinite cubic-bezier(0.4, 0, 0.2, 1);
		}

		.status-icon::after {
			font-weight: bold;
			font-size: 12px;
			animation-duration: var(--seq-speed);
			animation-iteration-count: infinite;
		}
		.s-p1-r1::after {
			content: '';
			animation-name: status-p1-r1;
		}
		.s-p1-r2::after {
			content: '';
			animation-name: status-p1-r2;
		}
		.s-p2-r1::after {
			content: '';
			animation-name: status-p2-r1;
		}
		.s-p2-r2::after {
			content: '';
			animation-name: status-p2-r2;
		}
		.s-p3-r1::after {
			content: '';
			animation-name: status-p3-r1;
		}
		.s-p3-r2::after {
			content: '';
			animation-name: status-p3-r2;
		}

		.row-found {
			animation: row-match var(--seq-speed) infinite;
		}

		.disk-1-anim {
			animation: disk-p1 var(--seq-speed) infinite;
		}
		.disk-2-anim {
			animation: disk-p2 var(--seq-speed) infinite;
		}
		.disk-3-anim {
			animation: disk-p3 var(--seq-speed) infinite;
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
				<div class="rounded bg-stone-800 px-1.5 py-0.5 font-mono text-[9px] text-blue-300">
					WHERE id = 3
				</div>
			</div>

			<div class="relative mt-6 h-[96px] w-full">
				<div
					class="page-1-anim absolute inset-0 flex flex-col space-y-1 rounded border border-stone-200 bg-white p-1 font-mono text-[10px] shadow-sm"
				>
					<div
						class="scan-1-anim pointer-events-none absolute right-1 left-1 z-20 h-[28px] rounded border-2 border-blue-500 bg-blue-500/5 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
					>
						<div class="absolute top-1.5 -left-5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#3b82f6"
								stroke-width="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
							>
						</div>
					</div>
					<div class="mb-1 flex h-[24px] items-center justify-between rounded bg-stone-100 px-2">
						<span class="font-bold text-stone-600">Page 1</span><span class="text-stone-400"
							>8kB</span
						>
					</div>
					<div
						class="flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="text-stone-400">0: &#123; id: 1, name: "Alex"... &#125;</span><span
							class="status-icon s-p1-r1"
						></span>
					</div>
					<div
						class="flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="text-stone-400">1: &#123; id: 2, name: "Samira"... &#125;</span><span
							class="status-icon s-p1-r2"
						></span>
					</div>
				</div>

				<div
					class="page-2-anim absolute inset-0 flex flex-col space-y-1 rounded border border-stone-200 bg-white p-1 font-mono text-[10px] shadow-sm"
				>
					<div
						class="scan-2-anim pointer-events-none absolute right-1 left-1 z-20 h-[28px] rounded border-2 border-blue-500 bg-blue-500/5 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
					>
						<div class="absolute top-1.5 -left-5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#3b82f6"
								stroke-width="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
							>
						</div>
					</div>
					<div class="mb-1 flex h-[24px] items-center justify-between rounded bg-stone-100 px-2">
						<span class="font-bold text-stone-600">Page 2</span><span class="text-stone-400"
							>8kB</span
						>
					</div>
					<div
						class="row-found flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="font-bold text-stone-800">2: &#123; id: 3, name: "Jordan"... &#125;</span
						><span class="status-icon s-p2-r1"></span>
					</div>
					<div
						class="flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="text-stone-400">3: &#123; id: 4, name: "Casey"... &#125;</span><span
							class="status-icon s-p2-r2"
						></span>
					</div>
				</div>

				<div
					class="page-3-anim absolute inset-0 flex flex-col space-y-1 rounded border border-stone-200 bg-white p-1 font-mono text-[10px] shadow-sm"
				>
					<div
						class="scan-3-anim pointer-events-none absolute right-1 left-1 z-20 h-[28px] rounded border-2 border-blue-500 bg-blue-500/5 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
					>
						<div class="absolute top-1.5 -left-5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#3b82f6"
								stroke-width="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
							>
						</div>
					</div>
					<div class="mb-1 flex h-[24px] items-center justify-between rounded bg-stone-100 px-2">
						<span class="font-bold text-stone-600">Page 3</span><span class="text-stone-400"
							>8kB</span
						>
					</div>
					<div
						class="flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="text-stone-400">4: &#123; id: 5, name: "Morgan"... &#125;</span><span
							class="status-icon s-p3-r1"
						></span>
					</div>
					<div
						class="flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="text-stone-400">5: &#123; id: 6, name: "Riley"... &#125;</span><span
							class="status-icon s-p3-r2"
						></span>
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
					Disk (Table Data)
				</div>
				<div class="rounded bg-red-50 px-1 text-[8px] font-bold text-red-500 uppercase">
					No Index = Scans All
				</div>
			</div>

			<div class="grid grid-cols-4 gap-2">
				<div
					class="disk-1-anim flex h-10 flex-col items-center justify-center rounded border-2 border-stone-200 bg-stone-50 font-mono text-[9px] text-stone-500 transition-colors"
				>
					<span class="font-bold">Page 1</span>
				</div>
				<div
					class="disk-2-anim flex h-10 flex-col items-center justify-center rounded border-2 border-stone-200 bg-stone-50 font-mono text-[9px] text-stone-500 transition-colors"
				>
					<span class="font-bold">Page 2</span>
				</div>
				<div
					class="disk-3-anim flex h-10 flex-col items-center justify-center rounded border-2 border-stone-200 bg-stone-50 font-mono text-[9px] text-stone-500 transition-colors"
				>
					<span class="font-bold">Page 3</span>
				</div>
				<div
					class="flex h-10 items-center justify-center font-mono text-[12px] font-bold text-stone-300"
				>
					...
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 flex flex-col items-center gap-1">
		<div class="text-[10px] font-medium tracking-widest text-stone-400 uppercase">
			Algorithm: <span class="text-stone-600">Sequential Scan</span>
		</div>
		<div class="h-1 w-32 overflow-hidden rounded-full bg-stone-100">
			<div
				class="h-full bg-blue-500"
				style="animation: progress var(--seq-speed) infinite linear;"
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
