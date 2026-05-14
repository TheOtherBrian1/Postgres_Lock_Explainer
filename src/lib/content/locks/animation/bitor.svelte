<div
	class="mt-4 mb-8 rounded-xl border border-stone-200 bg-white p-4 font-sans text-stone-600 shadow-md md:p-6"
	style="--scan-speed: 8s;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900">
		BitmapOR (A | B): ORing bitmaps together
	</h5>

	<style>
		/* SVG Mesh Pulse */
		@keyframes mesh-pulse {
			0%,
			10% {
				opacity: 0;
				stroke-width: 1.5;
				stroke: #c084fc;
			}
			15%,
			35% {
				opacity: 1;
				stroke-width: 2;
				stroke: #a855f7;
			}
			40%,
			100% {
				opacity: 0;
				stroke-width: 1.5;
			}
		}

		/* Input Bit Pulse */
		@keyframes input-pulse {
			0%,
			10% {
				box-shadow: none;
			}
			15%,
			35% {
				border-color: #a855f7;
				box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.25);
			}
			40%,
			100% {
				box-shadow: none;
			}
		}

		/* Result Bit: FLIP to 1 */
		@keyframes result-flip-bg {
			0%,
			35% {
				background-color: white;
				border-color: #d6d3d1;
				color: #a8a29e;
				box-shadow: none;
			}
			40%,
			45% {
				background-color: #dcfce7;
				border-color: #22c55e;
				color: #166534;
				box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
			} /* Evaluate 1 */
			50%,
			85% {
				background-color: #1c1917;
				border-color: #1c1917;
				color: white;
				box-shadow: none;
			} /* Set 1 */
			90%,
			100% {
				background-color: white;
				border-color: #d6d3d1;
				color: #a8a29e;
				box-shadow: none;
			} /* Reset */
		}
		@keyframes res-txt-0-flip {
			0%,
			39% {
				opacity: 1;
			}
			40%,
			89% {
				opacity: 0;
			}
			90%,
			100% {
				opacity: 1;
			}
		}
		@keyframes res-txt-1-flip {
			0%,
			39% {
				opacity: 0;
			}
			40%,
			89% {
				opacity: 1;
			}
			90%,
			100% {
				opacity: 0;
			}
		}

		/* Result Bit: STAY 0 */
		@keyframes result-stay-bg {
			0%,
			35% {
				background-color: white;
				border-color: #d6d3d1;
				color: #a8a29e;
				box-shadow: none;
			}
			40%,
			45% {
				background-color: white;
				border-color: #a8a29e;
				color: #a8a29e;
				box-shadow: 0 0 0 3px rgba(168, 162, 158, 0.3);
			} /* Evaluate 0 */
			50%,
			85% {
				background-color: white;
				border-color: #d6d3d1;
				color: #a8a29e;
				box-shadow: none;
			}
			90%,
			100% {
				background-color: white;
				border-color: #d6d3d1;
				color: #a8a29e;
				box-shadow: none;
			}
		}

		/* Class Assignments */
		.anim-mesh {
			animation: mesh-pulse var(--scan-speed) infinite ease-in-out;
			stroke-dasharray: 4 4;
		}
		.anim-pulse {
			animation: input-pulse var(--scan-speed) infinite ease-in-out;
		}

		.anim-res-flip {
			animation: result-flip-bg var(--scan-speed) infinite ease-in-out;
		}
		.txt-0-flip {
			animation: res-txt-0-flip var(--scan-speed) infinite ease-in-out;
		}
		.txt-1-flip {
			animation: res-txt-1-flip var(--scan-speed) infinite ease-in-out;
		}

		.anim-res-stay {
			animation: result-stay-bg var(--scan-speed) infinite ease-in-out;
		}
		.txt-0-stay {
			opacity: 1;
		}
		.txt-1-stay {
			opacity: 0;
		}

		/* Base Bit Styles */
		.bit {
			width: 32px;
			height: 32px;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			border-width: 2px;
			border-radius: 4px;
			font-family: monospace;
			font-size: 14px;
			font-weight: bold;
			z-index: 10;
		}
		.bit-set {
			background-color: #1c1917;
			border-color: #1c1917;
			color: white;
		}
		.bit-unset {
			background-color: white;
			border-color: #d6d3d1;
			color: #a8a29e;
		}
	</style>

	<div
		class="relative mx-auto flex w-full max-w-[360px] flex-col items-center overflow-hidden rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 p-6"
	>
		<svg class="pointer-events-none absolute inset-0 h-full w-full" style="z-index: 0;">
			<line x1="40" y1="0" x2="40" y2="100%" class="anim-mesh" />
			<line x1="80" y1="0" x2="80" y2="100%" class="anim-mesh" />
			<line x1="120" y1="0" x2="120" y2="100%" class="anim-mesh" />
			<line x1="160" y1="0" x2="160" y2="100%" class="anim-mesh" />
			<line x1="200" y1="0" x2="200" y2="100%" class="anim-mesh" />
			<line x1="240" y1="0" x2="240" y2="100%" class="anim-mesh" />
			<line x1="280" y1="0" x2="280" y2="100%" class="anim-mesh" />
			<line x1="320" y1="0" x2="320" y2="100%" class="anim-mesh" />
		</svg>

		<div class="z-10 mb-3 flex w-full flex-col items-center gap-1">
			<span
				class="rounded bg-stone-50 px-2 text-[10px] font-black tracking-widest text-stone-500 uppercase"
				>Bitmap A</span
			>
			<div class="flex gap-2">
				<div class="bit bit-set anim-pulse">1</div>
				<div class="bit bit-unset anim-pulse">0</div>
				<div class="bit bit-set anim-pulse">1</div>
				<div class="bit bit-unset anim-pulse">0</div>
				<div class="bit bit-set anim-pulse">1</div>
				<div class="bit bit-unset anim-pulse">0</div>
				<div class="bit bit-set anim-pulse">1</div>
				<div class="bit bit-unset anim-pulse">0</div>
			</div>
		</div>

		<div
			class="z-10 my-1 rounded border border-purple-200 bg-purple-100 px-3 py-0.5 font-mono text-[12px] font-bold text-purple-700 shadow-sm"
		>
			OR
		</div>

		<div class="z-10 mt-3 mb-3 flex w-full flex-col items-center gap-1">
			<span
				class="rounded bg-stone-50 px-2 text-[10px] font-black tracking-widest text-stone-500 uppercase"
				>Bitmap B</span
			>
			<div class="flex gap-2">
				<div class="bit bit-unset anim-pulse">0</div>
				<div class="bit bit-set anim-pulse">1</div>
				<div class="bit bit-set anim-pulse">1</div>
				<div class="bit bit-unset anim-pulse">0</div>
				<div class="bit bit-unset anim-pulse">0</div>
				<div class="bit bit-set anim-pulse">1</div>
				<div class="bit bit-set anim-pulse">1</div>
				<div class="bit bit-unset anim-pulse">0</div>
			</div>
		</div>

		<div
			class="z-10 my-1 rounded border border-stone-300 bg-white px-3 py-0.5 font-mono text-[12px] font-bold text-stone-700 shadow-sm"
		>
			=
		</div>

		<div class="z-10 mt-3 flex w-full flex-col items-center gap-1">
			<span
				class="rounded bg-stone-50 px-2 text-[10px] font-black tracking-widest text-stone-500 uppercase"
				>Result Mask</span
			>
			<div class="flex gap-2">
				<div class="bit bit-unset anim-res-flip">
					<span class="txt-0-flip absolute">0</span><span class="txt-1-flip absolute">1</span>
				</div>
				<div class="bit bit-unset anim-res-flip">
					<span class="txt-0-flip absolute">0</span><span class="txt-1-flip absolute">1</span>
				</div>
				<div class="bit bit-unset anim-res-flip">
					<span class="txt-0-flip absolute">0</span><span class="txt-1-flip absolute">1</span>
				</div>
				<div class="bit bit-unset anim-res-stay">
					<span class="txt-0-stay absolute">0</span><span class="txt-1-stay absolute">1</span>
				</div>
				<div class="bit bit-unset anim-res-flip">
					<span class="txt-0-flip absolute">0</span><span class="txt-1-flip absolute">1</span>
				</div>
				<div class="bit bit-unset anim-res-flip">
					<span class="txt-0-flip absolute">0</span><span class="txt-1-flip absolute">1</span>
				</div>
				<div class="bit bit-unset anim-res-flip">
					<span class="txt-0-flip absolute">0</span><span class="txt-1-flip absolute">1</span>
				</div>
				<div class="bit bit-unset anim-res-stay">
					<span class="txt-0-stay absolute">0</span><span class="txt-1-stay absolute">1</span>
				</div>
			</div>

			<div class="mt-1 flex gap-2 font-mono text-[9px] font-bold text-stone-400">
				<div class="w-[32px] bg-stone-50 text-center">Pg1</div>
				<div class="w-[32px] bg-stone-50 text-center">Pg2</div>
				<div class="w-[32px] bg-stone-50 text-center">Pg3</div>
				<div class="w-[32px] bg-stone-50 text-center">Pg4</div>
				<div class="w-[32px] bg-stone-50 text-center">Pg5</div>
				<div class="w-[32px] bg-stone-50 text-center">Pg6</div>
				<div class="w-[32px] bg-stone-50 text-center">Pg7</div>
				<div class="w-[32px] bg-stone-50 text-center">Pg8</div>
			</div>
		</div>
	</div>

	<div class="mt-4 flex flex-col items-center gap-2">
		<p class="max-w-[300px] text-center text-[10px] leading-tight font-medium text-stone-500">
			If a bit is <span class="font-bold text-stone-900">1</span> in either mask A or B, the
			resulting bit flips to <span class="font-bold text-stone-900">1</span>.
		</p>
	</div>
</div>
