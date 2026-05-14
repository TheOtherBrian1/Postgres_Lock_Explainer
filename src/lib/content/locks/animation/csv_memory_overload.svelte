<div
	class="mt-4 mb-8 rounded-xl border border-stone-100 bg-white p-4 font-sans text-stone-600 shadow-sm md:p-6"
>
	<h5
		class="mb-4 rounded bg-red-100/50 p-1 text-center text-sm font-bold tracking-widest text-red-950 uppercase"
	>
		Problematic File Loading
	</h5>

	<div class="relative mx-auto flex max-w-xs flex-col items-center gap-4">
		<div
			class="mem-zone relative flex h-20 w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-stone-200 bg-red-50/50"
		>
			<div class="z-0 text-[10px] font-bold tracking-tighter text-red-900/30 uppercase">
				Application RAM
			</div>

			<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div class="transfer-block flex h-full w-full items-center justify-center shadow-inner">
					<div class="flex flex-col items-center">
						<span class="font-mono text-[11px] font-bold tracking-tight text-white"
							>MEMORY OVERLOAD</span
						>
						<span class="rounded bg-red-950/20 p-0.5 font-mono text-[9px] text-red-100"
							>60,000,000 Records</span
						>
					</div>
				</div>
			</div>
		</div>

		<div class="h-4 text-red-300">
			<svg
				xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg
			>
		</div>

		<div class="disk-unit w-full rounded border border-stone-200 bg-white p-3 shadow-sm">
			<div
				class="mb-2 flex items-center gap-1.5 border-b border-stone-100 pb-1 text-[9px] font-bold text-stone-500 uppercase"
			>
				<svg
					xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
					width="10"
					height="10"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					><path d="M21 12V7H3v10h10" /><circle cx="18" cy="18" r="3" /><path d="M15 18h6" /></svg
				>
				Disk: big_data.csv (60M entries)
			</div>

			<div class="space-y-0.5 font-mono text-[8px] leading-none text-stone-400">
				<div class="text-stone-600">ID,Name,Email,Password</div>
				<div>1,Alex Rivers,alex@demo.com,pass123</div>
				<div>... (59,999,998 rows)</div>
				<div>60000000,Morgan Smith,m@demo.com,secure99</div>
			</div>
		</div>
	</div>

	<div
		class="mt-6 flex justify-center gap-4 text-[9px] font-bold tracking-widest text-stone-400 uppercase"
	>
		<div class="flex items-center gap-1">
			<div class="h-2 w-2 rounded-sm bg-stone-200"></div>
			<span>File Storage</span>
		</div>
		<div class="flex items-center gap-1 rounded border border-red-200 bg-red-50 p-1 px-2">
			<div class="h-2 w-2 rounded-sm bg-red-500"></div>
			<span class="text-red-600">Memory Exhaustion (OOM)</span>
		</div>
	</div>
</div>

<style>
	:root {
		/* Keep the same speed, but the effects are now synchronized to show failure */
		--load-speed: 2.8s;
	}

	@keyframes disk-exhaust {
		0%,
		10%,
		90%,
		100% {
			opacity: 1;
			filter: grayscale(0.5);
		}
		40%,
		60% {
			opacity: 0.1;
			filter: grayscale(1);
		} /* More extreme fade */
	}

	/* Large block transfer */
	@keyframes block-transfer-heavy {
		0%,
		10% {
			transform: translateY(80px);
			opacity: 0;
		}
		40%,
		65% {
			transform: translateY(0);
			opacity: 1;
		}
		90%,
		100% {
			transform: translateY(-40px);
			opacity: 0;
		}
	}

	/* RAM zone border flashes red/danger and shakes */
	@keyframes danger-pulse {
		0%,
		35%,
		75%,
		100% {
			border-color: #e7e5e4;
			transform: translateX(0);
			box-shadow: none;
		}
		40% {
			transform: translateX(-4px) rotate(-1deg);
		}
		45% {
			transform: translateX(4px) rotate(1deg);
		}
		50% {
			transform: translateX(-3px) rotate(-0.5deg);
		}
		55% {
			transform: translateX(3px) rotate(0.5deg);
		}
		60% {
			transform: translateX(0);
		}
		40%,
		65% {
			border-color: #ef4444; /* red-500 */
			box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
		}
	}

	.disk-unit {
		animation: disk-exhaust var(--load-speed) infinite ease-in-out;
	}

	.transfer-block {
		animation: block-transfer-heavy var(--load-speed) infinite ease-in-out;
		background-color: #ef4444; /* DANGER RED */
		z-index: 20;
	}

	.mem-zone {
		animation: danger-pulse var(--load-speed) infinite;
	}
</style>
