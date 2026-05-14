<div
	class="mt-4 mb-8 rounded-xl border border-stone-100 bg-white p-4 font-sans text-stone-600 shadow-md md:p-6"
	style="--flood-speed: 0.6s; --page-blue: #3b82f6;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Fragmentation Flood (0.1KB Pages)
	</h5>

	<style>
		/* Rapid fire entrance and exit */
		@keyframes page-flood {
			0% {
				transform: translateY(40px) scale(0.5);
				opacity: 0;
			}
			20% {
				transform: translateY(0) scale(1);
				opacity: 1;
			}
			80% {
				transform: translateY(0) scale(1);
				opacity: 1;
			}
			100% {
				transform: translateY(-40px) scale(0.5);
				opacity: 0;
			}
		}

		/* Rapid arrow movement representing constant I/O requests */
		@keyframes io-blink {
			0%,
			100% {
				color: #d6d3d1;
				transform: scale(1);
			}
			50% {
				color: #3b82f6;
				transform: scale(1.2);
			}
		}

		/* Warning text pulse */
		@keyframes warning-pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		.flood-page {
			animation: page-flood var(--flood-speed) infinite linear;
			border: 1px solid #2563eb;
			background-color: var(--page-blue);
		}

		.io-arrow {
			animation: io-blink 0.2s infinite;
		}

		.thrashing-text {
			animation: warning-pulse 0.4s infinite;
		}
	</style>

	<div class="relative mx-auto flex max-w-sm flex-col items-center gap-4">
		<div
			class="relative flex h-32 w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-stone-300 bg-stone-50"
		>
			<div
				class="absolute top-2 left-3 z-10 text-[9px] font-black tracking-widest text-stone-400 uppercase"
			>
				Active RAM (Thrashing)
			</div>

			<div class="relative flex w-full items-center justify-center gap-1 px-4">
				{#each Array(5) as _, i}
					<div
						class="flood-page flex h-10 w-10 flex-col items-center justify-center rounded text-white shadow-sm"
						style="animation-delay: {i * 0.12}s"
					>
						<span class="font-mono text-[7px] font-bold">p.{100 + i}</span>
						<span class="font-mono text-[6px] opacity-80">0.1kB</span>
					</div>
				{/each}
			</div>

			<div
				class="thrashing-text absolute right-2 bottom-1 text-[8px] font-black text-red-500 uppercase"
			>
				OS Overhead Spike
			</div>
		</div>

		<div class="io-arrow h-6">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="4"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg
			>
		</div>

		<div class="w-full rounded border border-stone-200 bg-white p-3 shadow-sm">
			<div class="mb-2 flex items-center justify-between border-b border-stone-100 pb-1">
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
					Fragmented Disk
				</div>
			</div>

			<div class="grid grid-cols-10 gap-1">
				{#each Array(20) as _, i}
					<div
						class="flex h-4 items-center justify-center rounded-sm border border-stone-200 bg-stone-100"
					>
						<div class="h-1 w-1 rounded-full bg-stone-300"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="mt-6 flex flex-col items-center gap-2">
		<div
			class="inline-flex items-center gap-2 rounded border border-amber-200 bg-amber-50 px-2 py-1"
		>
			<span class="text-[10px] font-black tracking-tight text-amber-700 uppercase"
				>Too Small: Excessive OS Context Switching</span
			>
		</div>
		<p class="max-w-xs text-center font-mono text-[9px] text-stone-400">
			System is overwhelmed by 1,000,000+ tiny read requests. CPU is idling while waiting for the
			I/O handshake.
		</p>
	</div>
</div>
