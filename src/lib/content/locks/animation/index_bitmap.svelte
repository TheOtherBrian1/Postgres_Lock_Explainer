<div
	class="mt-4 mb-8 rounded-xl border border-stone-200 bg-white p-4 font-sans text-stone-600 shadow-md md:p-6"
	style="--scan-speed: 12s;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Bitmap Index Scan: Building the Bitmask
	</h5>

	<style>
		/* INDEX SCANNER JUMPS - Now perfectly aligned starting at 0 */
		@keyframes scan-idx {
			0%,
			5% {
				opacity: 0;
				transform: translateY(0);
			}
			10%,
			25% {
				opacity: 1;
				transform: translateY(0);
			} /* Scan Pg 3 */
			30%,
			35% {
				opacity: 0;
				transform: translateY(0);
			}

			36%,
			40% {
				opacity: 0;
				transform: translateY(28px);
			}
			45%,
			60% {
				opacity: 1;
				transform: translateY(28px);
			} /* Scan Pg 1 */
			65%,
			70% {
				opacity: 0;
				transform: translateY(28px);
			}

			71%,
			75% {
				opacity: 0;
				transform: translateY(56px);
			}
			80%,
			95% {
				opacity: 1;
				transform: translateY(56px);
			} /* Scan Pg 8 */
			98%,
			100% {
				opacity: 0;
				transform: translateY(56px);
			}
		}

		/* SVG PATH REVEALS */
		@keyframes path-3 {
			0%,
			12% {
				opacity: 0;
			}
			15%,
			25% {
				opacity: 1;
				stroke-dashoffset: 0;
			}
			28%,
			100% {
				opacity: 0;
			}
		}
		@keyframes path-1 {
			0%,
			47% {
				opacity: 0;
			}
			50%,
			60% {
				opacity: 1;
				stroke-dashoffset: 0;
			}
			63%,
			100% {
				opacity: 0;
			}
		}
		@keyframes path-8 {
			0%,
			82% {
				opacity: 0;
			}
			85%,
			95% {
				opacity: 1;
				stroke-dashoffset: 0;
			}
			98%,
			100% {
				opacity: 0;
			}
		}

		/* BITMAP SQUARES TURNING BLACK */
		@keyframes bg-bit-3 {
			0%,
			18% {
				background-color: #ffffff;
				border-color: #d6d3d1;
			}
			19%,
			100% {
				background-color: #1c1917;
				border-color: #1c1917;
			}
		}
		@keyframes txt-fade-out-3 {
			0%,
			18% {
				opacity: 1;
				color: #a8a29e;
			}
			19%,
			100% {
				opacity: 0;
			}
		}
		@keyframes txt-fade-in-3 {
			0%,
			18% {
				opacity: 0;
			}
			19%,
			100% {
				opacity: 1;
				color: #ffffff;
			}
		}

		@keyframes bg-bit-1 {
			0%,
			53% {
				background-color: #ffffff;
				border-color: #d6d3d1;
			}
			54%,
			100% {
				background-color: #1c1917;
				border-color: #1c1917;
			}
		}
		@keyframes txt-fade-out-1 {
			0%,
			53% {
				opacity: 1;
				color: #a8a29e;
			}
			54%,
			100% {
				opacity: 0;
			}
		}
		@keyframes txt-fade-in-1 {
			0%,
			53% {
				opacity: 0;
			}
			54%,
			100% {
				opacity: 1;
				color: #ffffff;
			}
		}

		@keyframes bg-bit-8 {
			0%,
			88% {
				background-color: #ffffff;
				border-color: #d6d3d1;
			}
			89%,
			100% {
				background-color: #1c1917;
				border-color: #1c1917;
			}
		}
		@keyframes txt-fade-out-8 {
			0%,
			88% {
				opacity: 1;
				color: #a8a29e;
			}
			89%,
			100% {
				opacity: 0;
			}
		}
		@keyframes txt-fade-in-8 {
			0%,
			88% {
				opacity: 0;
			}
			89%,
			100% {
				opacity: 1;
				color: #ffffff;
			}
		}

		/* CLASS ASSIGNMENTS */
		.anim-scanner {
			animation: scan-idx var(--scan-speed) infinite ease-in-out;
		}

		.p3 {
			animation: path-3 var(--scan-speed) infinite ease-out;
			stroke-dasharray: 200;
			stroke-dashoffset: 200;
		}
		.p1 {
			animation: path-1 var(--scan-speed) infinite ease-out;
			stroke-dasharray: 200;
			stroke-dashoffset: 200;
		}
		.p8 {
			animation: path-8 var(--scan-speed) infinite ease-out;
			stroke-dasharray: 200;
			stroke-dashoffset: 200;
		}

		.bg-3 {
			animation: bg-bit-3 var(--scan-speed) infinite;
		}
		.zero-3 {
			animation: txt-fade-out-3 var(--scan-speed) infinite;
		}
		.one-3 {
			animation: txt-fade-in-3 var(--scan-speed) infinite;
		}

		.bg-1 {
			animation: bg-bit-1 var(--scan-speed) infinite;
		}
		.zero-1 {
			animation: txt-fade-out-1 var(--scan-speed) infinite;
		}
		.one-1 {
			animation: txt-fade-in-1 var(--scan-speed) infinite;
		}

		.bg-8 {
			animation: bg-bit-8 var(--scan-speed) infinite;
		}
		.zero-8 {
			animation: txt-fade-out-8 var(--scan-speed) infinite;
		}
		.one-8 {
			animation: txt-fade-in-8 var(--scan-speed) infinite;
		}
	</style>

	<div
		class="relative mx-auto h-[340px] w-full max-w-[360px] overflow-hidden rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 p-4"
	>
		<div
			class="absolute top-[30px] left-1/2 z-10 w-[180px] -translate-x-1/2 rounded border border-stone-200 bg-white p-1 font-mono text-[10px] shadow-sm"
		>
			<div
				class="mb-1 rounded border border-purple-100 bg-purple-50 px-2 py-1 text-center font-bold tracking-tight text-purple-700"
			>
				Index (col1 = 'A')
			</div>

			<div class="relative">
				<div
					class="anim-scanner pointer-events-none absolute top-0 right-0 left-0 z-20 h-[28px] rounded border-2 border-purple-500 bg-purple-500/10"
				></div>

				<div
					class="flex h-[28px] items-center justify-between rounded border border-transparent px-2"
				>
					<span class="text-stone-500">'A'</span>
					<span class="rounded bg-purple-100 px-1 font-bold text-purple-600">Pg 3</span>
				</div>
				<div
					class="flex h-[28px] items-center justify-between rounded border border-transparent px-2"
				>
					<span class="text-stone-500">'A'</span>
					<span class="rounded bg-purple-100 px-1 font-bold text-purple-600">Pg 1</span>
				</div>
				<div
					class="flex h-[28px] items-center justify-between rounded border border-transparent px-2"
				>
					<span class="text-stone-500">'A'</span>
					<span class="rounded bg-purple-100 px-1 font-bold text-purple-600">Pg 8</span>
				</div>
			</div>
		</div>

		<svg class="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox="0 0 360 340">
			<defs>
				<marker
					id="arrowhead"
					viewBox="0 0 10 10"
					refX="5"
					refY="5"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
				</marker>
			</defs>
			<path
				class="p3"
				d="M 180 72 C 180 160, 117 160, 117 250"
				fill="none"
				stroke="#a855f7"
				stroke-width="2"
				marker-end="url(#arrowhead)"
			/>
			<path
				class="p1"
				d="M 180 100 C 180 180, 34 180, 34 250"
				fill="none"
				stroke="#a855f7"
				stroke-width="2"
				marker-end="url(#arrowhead)"
			/>
			<path
				class="p8"
				d="M 180 128 C 180 200, 326 200, 326 250"
				fill="none"
				stroke="#a855f7"
				stroke-width="2"
				marker-end="url(#arrowhead)"
			/>
		</svg>

		<div class="absolute bottom-[56px] left-[18px] z-10 flex w-[324px] justify-between gap-1">
			<div
				class="bg-1 relative flex h-8 w-8 items-center justify-center overflow-hidden rounded border-2 border-stone-300 font-mono text-[14px] font-bold shadow-sm transition-colors duration-150"
			>
				<span class="zero-1 absolute inset-0 flex items-center justify-center">0</span>
				<span class="one-1 absolute inset-0 flex items-center justify-center">1</span>
			</div>

			<div
				class="relative flex h-8 w-8 items-center justify-center rounded border-2 border-stone-300 bg-white font-mono text-[14px] font-bold text-stone-400 shadow-sm"
			>
				0
			</div>

			<div
				class="bg-3 relative flex h-8 w-8 items-center justify-center overflow-hidden rounded border-2 border-stone-300 font-mono text-[14px] font-bold shadow-sm transition-colors duration-150"
			>
				<span class="zero-3 absolute inset-0 flex items-center justify-center">0</span>
				<span class="one-3 absolute inset-0 flex items-center justify-center">1</span>
			</div>

			<div
				class="relative flex h-8 w-8 items-center justify-center rounded border-2 border-stone-300 bg-white font-mono text-[14px] font-bold text-stone-400 shadow-sm"
			>
				0
			</div>
			<div
				class="relative flex h-8 w-8 items-center justify-center rounded border-2 border-stone-300 bg-white font-mono text-[14px] font-bold text-stone-400 shadow-sm"
			>
				0
			</div>
			<div
				class="relative flex h-8 w-8 items-center justify-center rounded border-2 border-stone-300 bg-white font-mono text-[14px] font-bold text-stone-400 shadow-sm"
			>
				0
			</div>
			<div
				class="relative flex h-8 w-8 items-center justify-center rounded border-2 border-stone-300 bg-white font-mono text-[14px] font-bold text-stone-400 shadow-sm"
			>
				0
			</div>

			<div
				class="bg-8 relative flex h-8 w-8 items-center justify-center overflow-hidden rounded border-2 border-stone-300 font-mono text-[14px] font-bold shadow-sm transition-colors duration-150"
			>
				<span class="zero-8 absolute inset-0 flex items-center justify-center">0</span>
				<span class="one-8 absolute inset-0 flex items-center justify-center">1</span>
			</div>
		</div>

		<div
			class="absolute bottom-[36px] left-[18px] flex w-[324px] justify-between gap-1 font-mono text-[9px] font-bold text-stone-400"
		>
			<div class="w-8 text-center">Pg1</div>
			<div class="w-8 text-center">Pg2</div>
			<div class="w-8 text-center">Pg3</div>
			<div class="w-8 text-center">Pg4</div>
			<div class="w-8 text-center">Pg5</div>
			<div class="w-8 text-center">Pg6</div>
			<div class="w-8 text-center">Pg7</div>
			<div class="w-8 text-center">Pg8</div>
		</div>
	</div>

	<div class="mt-4 flex flex-col items-center gap-2">
		<p class="max-w-[280px] text-center text-[10px] leading-tight font-medium text-stone-500">
			The index yields pages completely out of order (<span class="font-bold">3, 1, 8</span>).
			Instead of jumping to the table immediately, the DB flips bits in a
			<span class="font-bold text-stone-900">memory grid</span>.
		</p>
	</div>
</div>
