<div
	class="mt-4 mb-8 rounded-xl border border-stone-100 bg-white p-4 font-sans text-stone-600 shadow-sm md:p-6"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Linear Search: Find ID=3
	</h5>

	<style>
		:root {
			--search-speed: 4s;
			/* Using a fixed height for rows to make the math reliable */
			--row-h: 28px;
			--row-gap: 4px;
		}

		@keyframes search-pointer {
			0%,
			15% {
				transform: translateY(0);
				opacity: 1;
			}
			35%,
			50% {
				transform: translateY(calc(var(--row-h) + var(--row-gap)));
				opacity: 1;
			}
			70%,
			90% {
				transform: translateY(calc((var(--row-h) + var(--row-gap)) * 2));
				opacity: 1;
			}
			95%,
			100% {
				transform: translateY(calc((var(--row-h) + var(--row-gap)) * 2));
				opacity: 0;
			}
		}

		@keyframes status-1 {
			0%,
			15% {
				opacity: 1;
				content: '✕';
				color: #ef4444;
			}
			16%,
			100% {
				opacity: 0;
			}
		}
		@keyframes status-2 {
			0%,
			35% {
				opacity: 0;
			}
			36%,
			50% {
				opacity: 1;
				content: '✕';
				color: #ef4444;
			}
			51%,
			100% {
				opacity: 0;
			}
		}
		@keyframes status-3 {
			0%,
			70% {
				opacity: 0;
			}
			71%,
			90% {
				opacity: 1;
				content: '✓';
				color: #22c55e;
			}
			91%,
			100% {
				opacity: 0;
			}
		}

		@keyframes row-success {
			0%,
			70% {
				background-color: white;
			}
			71%,
			90% {
				background-color: #f0fdf4;
				border-color: #bbf7d0;
			}
		}

		.search-box {
			animation: search-pointer var(--search-speed) infinite cubic-bezier(0.4, 0, 0.2, 1);
		}

		.status-icon::after {
			font-weight: bold;
			font-size: 12px;
			animation-duration: var(--search-speed);
			animation-iteration-count: infinite;
		}
		.s-1::after {
			content: '';
			animation-name: status-1;
		}
		.s-2::after {
			content: '';
			animation-name: status-2;
		}
		.s-3::after {
			content: '';
			animation-name: status-3;
		}

		.row-found {
			animation: row-success var(--search-speed) infinite;
		}
	</style>

	<div class="relative mx-auto max-w-sm rounded-lg border border-stone-200 bg-stone-50 p-3">
		<div class="mb-3 flex items-center justify-between border-b border-stone-200 pb-2">
			<div class="text-[9px] font-bold tracking-tight text-stone-400 uppercase">In memory</div>
			<div class="rounded bg-stone-800 px-1.5 py-0.5 font-mono text-[9px] text-blue-300">
				seek(id: 3)
			</div>
		</div>

		<div class="relative flex flex-col space-y-1 font-mono text-[10px]">
			<div
				class="search-box pointer-events-none absolute top-0 right-0 left-0 z-20 h-[28px] rounded border-2 border-blue-500 bg-blue-500/5 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
			>
				<div class="absolute top-1.5 -left-6">
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

			<div
				class="flex h-[28px] items-center justify-between rounded border border-transparent bg-white px-2"
			>
				<span class="text-stone-400">0: &#123; id: 1, name: "Alex"... &#125;</span>
				<span class="status-icon s-1"></span>
			</div>

			<div
				class="flex h-[28px] items-center justify-between rounded border border-transparent bg-white px-2"
			>
				<span class="text-stone-400">1: &#123; id: 2, name: "Samira"... &#125;</span>
				<span class="status-icon s-2"></span>
			</div>

			<div
				class="row-found flex h-[28px] items-center justify-between rounded border border-stone-100 bg-white px-2"
			>
				<span class="font-bold text-stone-800">2: &#123; id: 3, name: "Jordan"... &#125;</span>
				<span class="status-icon s-3"></span>
			</div>
		</div>
	</div>

	<div class="mt-4 flex flex-col items-center gap-1">
		<div class="text-[10px] font-medium tracking-widest text-stone-400 uppercase">
			Algorithm: <span class="text-stone-600">Sequential Scan</span>
		</div>
		<div class="h-1 w-24 overflow-hidden rounded-full bg-stone-100">
			<div
				class="h-full bg-blue-500"
				style="animation: progress var(--search-speed) infinite linear;"
			></div>
		</div>
	</div>

	<style>
		@keyframes progress {
			0% {
				width: 0%;
			}
			70% {
				width: 100%;
			}
			100% {
				width: 100%;
			}
		}
	</style>
</div>
