<div
	class="mt-4 mb-8 rounded-xl border border-stone-200 bg-white p-4 font-sans text-stone-600 shadow-md md:p-6"
	style="--anim-speed: 5s; --page-blue: #3b82f6; --hash-purple: #a855f7;"
>
	<h5 class="mb-6 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Access Strategy: Hash Lookup vs. Seq Scan
	</h5>

	<style>
		/* Sequential Scan: Iterates through every slot */
		@keyframes seq-pointer {
			0%,
			5% {
				transform: translateY(0);
				opacity: 1;
			}
			10%,
			15% {
				transform: translateY(28px);
				opacity: 1;
			}
			20%,
			25% {
				transform: translateY(56px);
				opacity: 1;
			}
			30%,
			35% {
				transform: translateY(84px);
				opacity: 1;
			}
			40%,
			60% {
				transform: translateY(112px);
				opacity: 1;
				border-color: #22c55e;
			}
			70%,
			100% {
				opacity: 0;
			}
		}

		/* Hash Lookup: Highlights the specific key in place */
		@keyframes hash-highlight {
			0%,
			10% {
				opacity: 0;
			}
			15%,
			60% {
				opacity: 1;
				border-color: #7e22ce;
				background-color: rgba(168, 85, 247, 0.1);
			}
			70%,
			100% {
				opacity: 0;
			}
		}

		/* Arrow: Appears when the hash lookup resolves */
		@keyframes arrow-fade {
			0%,
			15% {
				opacity: 0;
			}
			20%,
			60% {
				opacity: 1;
			}
			70%,
			100% {
				opacity: 0;
			}
		}

		.scan-indicator {
			animation: seq-pointer var(--anim-speed) infinite ease-in-out;
		}

		.hash-indicator {
			animation: hash-highlight var(--anim-speed) infinite ease-in-out;
		}

		.pointer-arrow {
			animation: arrow-fade var(--anim-speed) infinite ease-in-out;
		}
	</style>

	<div class="relative mx-auto flex max-w-md flex-col items-center gap-8">
		<div class="flex w-full justify-between gap-4">
			<div
				class="relative flex flex-1 flex-col rounded-lg border border-purple-100 bg-purple-50/50 p-3"
			>
				<div
					class="mb-3 flex items-center gap-1 text-[9px] font-black tracking-tighter text-purple-700 uppercase"
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
					Hash Index (O:1)
				</div>

				<div class="space-y-1 font-mono text-[9px]">
					<div
						class="flex justify-between rounded border border-purple-100 bg-white px-2 py-1 text-purple-400 opacity-40"
					>
						<span>key: "alex@demo.com"</span> <span>ptr: 0x1</span>
					</div>

					<div
						class="relative flex justify-between rounded border-2 border-purple-400 bg-white px-2 py-1 font-bold text-purple-700 shadow-sm"
					>
						<span>key: "jlee@demo.com"</span> <span>ptr: 0x5</span>

						<div
							class="hash-indicator pointer-events-none absolute -top-1 -left-1 z-30 h-[calc(100%+8px)] w-[calc(100%+8px)] rounded-md border-2"
						></div>

						<div
							class="pointer-arrow pointer-events-none absolute top-1/2 left-[102%] z-40 h-[84px] w-[16px] rounded-bl-xl border-b-2 border-l-2 border-dashed border-purple-500 md:w-[24px]"
						>
							<svg
								class="absolute -right-1.5 bottom-[-5px] h-3 w-3 fill-purple-500"
								viewBox="0 0 24 24"
							>
								<path d="M5 3l14 9-14 9z" />
							</svg>
						</div>
					</div>
				</div>

				<div class="mt-4 text-[8px] leading-tight font-medium text-purple-400 italic">
					Maps "jlee@demo.com" directly to Page 5
				</div>

				<div class="mt-auto pt-4">
					<div class="rounded border border-purple-200/50 bg-white p-2 text-center shadow-sm">
						<p class="text-[8px] font-bold tracking-tight text-purple-800 uppercase">
							Index Penalty
						</p>
						<p class="mt-0.5 pr-2 text-[8px] leading-tight text-purple-600">
							<span>
								<strong>O(N) Space:</strong>Extra storage required for redundant keys & pointers.
								Index must also be maintained when entries are modified.</span
							>
						</p>
					</div>
				</div>
			</div>

			<div class="relative flex-1 rounded-lg border border-stone-200 bg-stone-50 p-3">
				<div
					class="mb-3 flex items-center gap-1 text-[9px] font-black tracking-tighter text-stone-500 uppercase"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="10"
						height="10"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						><path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" /><path d="M9 2v3" /><path
							d="M15 2v3"
						/><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M2 12h20" /><path
							d="M7 12v9"
						/><path d="M17 12v9" /></svg
					>
					Table Pages (O:N)
				</div>

				<div class="relative space-y-1 font-mono text-[9px]">
					<div
						class="scan-indicator pointer-events-none absolute right-0 left-0 z-20 h-[24px] rounded border-2 border-blue-500 bg-blue-500/10"
					></div>

					{#each [1, 2, 3, 4] as p}
						<div
							class="flex items-center rounded border border-stone-200 bg-white px-2 py-1 text-stone-300"
						>
							Page {p} <span class="ml-auto opacity-30">...</span>
						</div>
					{/each}

					<div
						class="flex items-center rounded border-2 border-stone-300 bg-white px-2 py-1 font-bold text-stone-900"
					>
						Page 5 <span class="ml-auto text-blue-500 underline">MATCH</span>
					</div>
				</div>
			</div>
		</div>

		<div class="flex w-full justify-center gap-8 border-t border-stone-100 pt-4">
			<div class="flex flex-col items-center">
				<span class="text-[10px] font-black text-stone-400 uppercase">Seq Scan</span>
				<span class="font-mono text-[9px] text-stone-500">5 Page Reads</span>
			</div>
			<div class="flex flex-col items-center">
				<span class="text-[10px] font-black text-purple-600 uppercase">Index Lookup</span>
				<span class="font-mono text-[9px] text-purple-500">1 Hash + 1 Page Read</span>
			</div>
		</div>
	</div>
</div>
