<div
	class="mt-4 mb-8 rounded-xl border border-stone-100 bg-white p-4 font-sans text-stone-600 shadow-sm md:p-6"
	style="--bhs-speed: 15s;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Bitmap Heap Scan: Targeted Access
	</h5>

	<style>
		/* BITMAP SCANNER MOVEMENT (Only highlights active 1s) */
		@keyframes scan-bitmap {
			0%,
			25% {
				transform: translateX(0);
				opacity: 1;
			} /* Bit 1 (Active) */
			25.1%,
			25.9% {
				transform: translateX(0);
				opacity: 0;
			}
			26%,
			41% {
				transform: translateX(72px);
				opacity: 1;
			} /* Bit 3 (Active) */
			41.1%,
			41.9% {
				transform: translateX(72px);
				opacity: 0;
			}
			42%,
			57% {
				transform: translateX(144px);
				opacity: 1;
			} /* Bit 5 (Active) */
			57.1%,
			100% {
				transform: translateX(144px);
				opacity: 0;
			}
		}

		/* PAGE SWAPPING IN MEMORY (Driven by bitmap matches) */
		@keyframes page-p1-flow {
			0%,
			7% {
				transform: translateY(15px);
				opacity: 0;
			}
			10%,
			25% {
				transform: translateY(0);
				opacity: 1;
			}
			28%,
			100% {
				transform: translateY(-15px);
				opacity: 0;
			}
		}
		@keyframes page-p3-flow {
			0%,
			23% {
				transform: translateY(15px);
				opacity: 0;
			}
			26%,
			41% {
				transform: translateY(0);
				opacity: 1;
			}
			44%,
			100% {
				transform: translateY(-15px);
				opacity: 0;
			}
		}
		@keyframes page-p5-flow {
			0%,
			39% {
				transform: translateY(15px);
				opacity: 0;
			}
			42%,
			57% {
				transform: translateY(0);
				opacity: 1;
			}
			60%,
			100% {
				transform: translateY(-15px);
				opacity: 0;
			}
		}

		/* IN-PAGE ROW SCANNER MOVEMENTS */
		@keyframes scan-rows {
			0%,
			10% {
				opacity: 0;
				transform: translateY(30px);
			}
			13%,
			17% {
				opacity: 1;
				transform: translateY(30px);
			} /* Row 1 */
			20%,
			24% {
				opacity: 1;
				transform: translateY(58px);
			} /* Row 2 */
			27%,
			100% {
				opacity: 0;
				transform: translateY(58px);
			}
		}

		/* ROW MATCH HIGHLIGHTS (Specific to data) */
		@keyframes match-p1-r1 {
			0%,
			12% {
				background-color: white;
				border-color: transparent;
			}
			13%,
			17% {
				background-color: #f0fdf4;
				border-color: #bbf7d0;
			} /* Pg1 R1 Match! */
			18%,
			100% {
				background-color: white;
				border-color: transparent;
			}
		}
		@keyframes match-p3-r2 {
			0%,
			45% {
				background-color: white;
				border-color: transparent;
			}
			46%,
			50% {
				background-color: #f0fdf4;
				border-color: #bbf7d0;
			} /* Pg3 R2 Match! */
			51%,
			100% {
				background-color: white;
				border-color: transparent;
			}
		}
		@keyframes match-p5-r1 {
			0%,
			61% {
				background-color: white;
				border-color: transparent;
			}
			62%,
			66% {
				background-color: #f0fdf4;
				border-color: #bbf7d0;
			} /* Pg5 R1 Match! */
			67%,
			100% {
				background-color: white;
				border-color: transparent;
			}
		}

		/* DISK HIGHLIGHTS (Targeted access) */
		@keyframes disk-active {
			0%,
			7% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
			10%,
			57% {
				border-color: #3b82f6;
				background-color: #eff6ff;
			} /* Active while bitmap is processing pages */
			60%,
			100% {
				border-color: #e5e7eb;
				background-color: #f9fafb;
			}
		}

		/* CLASS ASSIGNMENTS */
		.bit-high {
			background-color: #1c1917;
			color: white;
			border-color: #1c1917;
		}
		.bit-low {
			background-color: white;
			color: #a8a29e;
			border-color: #d6d3d1;
		}

		.bhs-bitmap-scan {
			animation: scan-bitmap var(--bhs-speed) infinite linear;
		}

		.bhs-page-p1 {
			animation: page-p1-flow var(--bhs-speed) infinite ease-in-out;
		}
		.bhs-page-p3 {
			animation: page-p3-flow var(--bhs-speed) infinite ease-in-out;
		}
		.bhs-page-p5 {
			animation: page-p5-flow var(--bhs-speed) infinite ease-in-out;
		}

		.bhs-row-scan {
			animation: scan-rows 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
			animation-delay: 1.5s;
		} /* Row scan cycle relative to page load */
		.bhs-page-p1 .bhs-row-scan {
			animation-delay: 1.5s;
		}
		.bhs-page-p3 .bhs-row-scan {
			animation-delay: 3.9s;
		}
		.bhs-page-p5 .bhs-row-scan {
			animation-delay: 6.3s;
		}

		.m-p1-r1 {
			animation: match-p1-r1 3s infinite;
			animation-delay: 1.5s;
		}
		.m-p3-r2 {
			animation: match-p3-r2 3s infinite;
			animation-delay: 3.9s;
		}
		.m-p5-r1 {
			animation: match-p5-r1 3s infinite;
			animation-delay: 6.3s;
		}

		.disk-tgt {
			animation: disk-active var(--bhs-speed) infinite;
		}
	</style>

	<div class="relative mx-auto flex max-w-sm flex-col items-center gap-4">
		<div
			class="relative flex h-[70px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 p-2"
		>
			<div
				class="absolute top-1.5 left-2 z-10 text-[9px] font-bold tracking-tight text-stone-400 uppercase"
			>
				Input Bitmap (Pages)
			</div>

			<div class="relative mt-4 flex gap-1 font-mono text-[12px] font-bold">
				<div
					class="bhs-bitmap-scan pointer-events-none absolute -top-1 -left-1 z-20 h-9 w-9 rounded border-2 border-blue-500 bg-blue-500/5 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
				></div>

				<div class="bit-high flex h-7 w-8 items-center justify-center rounded border-2 shadow-sm">
					1
				</div>
				<div class="bit-low flex h-7 w-8 items-center justify-center rounded border">0</div>
				<div class="bit-high flex h-7 w-8 items-center justify-center rounded border-2 shadow-sm">
					1
				</div>
				<div class="bit-low flex h-7 w-8 items-center justify-center rounded border">0</div>
				<div class="bit-high flex h-7 w-8 items-center justify-center rounded border-2 shadow-sm">
					1
				</div>
				<div class="bit-low flex h-7 w-8 items-center justify-center rounded border">0</div>
				<div class="bit-low flex h-7 w-8 items-center justify-center rounded border">0</div>
				<div class="bit-low flex h-7 w-8 items-center justify-center rounded border">0</div>
			</div>
		</div>

		<div class="mt-2 h-4 text-stone-200">
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

		<div
			class="relative flex h-[160px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 p-3"
		>
			<div class="absolute top-2 left-3 z-10 flex w-[calc(100%-24px)] items-center justify-between">
				<div class="text-[9px] font-bold tracking-tight text-stone-400 uppercase">
					Memory Buffer
				</div>
				<div class="rounded bg-stone-800 px-1.5 py-0.5 font-mono text-[9px] text-blue-300">
					Table Scan
				</div>
			</div>

			<div class="relative mt-6 h-[96px] w-full">
				<div
					class="bhs-page-p1 absolute inset-0 flex flex-col space-y-1 rounded border border-stone-200 bg-white p-1 font-mono text-[10px] shadow-sm"
				>
					<div
						class="bhs-row-scan pointer-events-none absolute right-1 left-1 z-20 h-[28px] rounded border-2 border-blue-500 bg-blue-500/5 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
					></div>
					<div
						class="mb-1 flex h-[24px] shrink-0 items-center justify-between rounded bg-stone-100 px-2"
					>
						<span class="font-bold text-stone-600">Page 1 (from Bitmap Bit 1)</span>
					</div>
					<div
						class="m-p1-r1 flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="font-bold text-stone-800">0: &#123; id: 1, name: "Alex"... &#125;</span
						><span class="font-bold text-green-500">✓ Match</span>
					</div>
					<div
						class="flex h-[28px] items-center justify-between rounded border border-transparent px-2 text-stone-400"
					>
						1: &#123; id: 2, name: "Samira"... &#125; ✕
					</div>
				</div>

				<div
					class="bhs-page-p3 absolute inset-0 flex flex-col space-y-1 rounded border border-stone-200 bg-white p-1 font-mono text-[10px] shadow-sm"
				>
					<div
						class="bhs-row-scan pointer-events-none absolute right-1 left-1 z-20 h-[28px] rounded border-2 border-blue-500 bg-blue-500/5 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
					></div>
					<div
						class="mb-1 flex h-[24px] shrink-0 items-center justify-between rounded bg-stone-100 px-2"
					>
						<span class="font-bold text-stone-600">Page 3 (from Bitmap Bit 3)</span>
					</div>
					<div
						class="flex h-[28px] items-center justify-between rounded border border-transparent px-2 text-stone-400"
					>
						4: &#123; id: 5, name: "Casey"... &#125; ✕
					</div>
					<div
						class="m-p3-r2 flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="font-bold text-stone-800"
							>5: &#123; id: 6, name: "Riley"... &#125;
						</span><span class="font-bold text-green-500">✓ Match</span>
					</div>
				</div>

				<div
					class="bhs-page-p5 absolute inset-0 flex flex-col space-y-1 rounded border border-stone-200 bg-white p-1 font-mono text-[10px] shadow-sm"
				>
					<div
						class="bhs-row-scan pointer-events-none absolute right-1 left-1 z-20 h-[28px] rounded border-2 border-blue-500 bg-blue-500/5 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
					></div>
					<div
						class="mb-1 flex h-[24px] shrink-0 items-center justify-between rounded bg-stone-100 px-2"
					>
						<span class="font-bold text-stone-600">Page 5 (from Bitmap Bit 5)</span>
					</div>
					<div
						class="m-p5-r1 flex h-[28px] items-center justify-between rounded border border-transparent px-2"
					>
						<span class="font-bold text-stone-800">8: &#123; id: 9, name: "Casey"... &#125;</span
						><span class="font-bold text-green-500">✓ Match</span>
					</div>
					<div
						class="flex h-[28px] items-center justify-between rounded border border-transparent px-2 text-stone-400"
					>
						9: &#123; id: 10, name: "Morgan"... &#125; ✕
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
				<div class="rounded bg-blue-50 px-1 text-[8px] font-bold text-blue-600 uppercase">
					Targeted Access via Bitmap
				</div>
			</div>

			<div class="grid grid-cols-4 gap-2 font-mono text-[9px] text-stone-500">
				<div
					class="disk-tgt disk-tgt-1 flex h-10 items-center justify-center rounded border-2 font-bold shadow-sm"
				>
					Page 1
				</div>
				<div
					class="flex h-10 items-center justify-center rounded border border-stone-100 bg-stone-50 text-stone-300"
				>
					Page 2
				</div>
				<div
					class="disk-tgt disk-tgt-3 flex h-10 items-center justify-center rounded border-2 font-bold shadow-sm"
				>
					Page 3
				</div>
				<div
					class="flex h-10 items-center justify-center rounded border border-stone-100 bg-stone-50 text-stone-300"
				>
					Page 4
				</div>
				<div
					class="disk-tgt disk-tgt-5 flex h-10 items-center justify-center rounded border-2 font-bold shadow-sm"
				>
					Page 5
				</div>
				<div
					class="flex h-10 items-center justify-center rounded border border-stone-100 bg-stone-50 text-stone-300"
				>
					Page 6
				</div>
				<div
					class="flex h-10 items-center justify-center rounded border border-stone-100 bg-stone-50 text-stone-300"
				>
					Page 7
				</div>
				<div
					class="flex h-10 items-center justify-center rounded border border-stone-100 bg-stone-50 text-stone-300"
				>
					Page 8
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 flex flex-col items-center gap-1">
		<div class="text-[10px] font-medium tracking-widest text-stone-400 uppercase">
			Algorithm: <span class="text-stone-600">Bitmap Heap Scan</span>
		</div>
		<div class="h-1 w-32 overflow-hidden rounded-full bg-stone-100">
			<div
				class="h-full bg-blue-500"
				style="animation: bhs-progress var(--bhs-speed) infinite linear;"
			></div>
		</div>
	</div>

	<style>
		@keyframes bhs-progress {
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
