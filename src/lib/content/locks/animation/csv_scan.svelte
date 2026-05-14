<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-10"
>
	<h5 class="mb-8 text-center text-xl font-bold text-stone-900">Naive File Loading</h5>

	<style>
		:root {
			--load-duration: 3s;
		}

		/* The entire disk file "lifting" */
		@keyframes file-lift {
			0%,
			10% {
				transform: translateY(0);
				opacity: 1;
				filter: grayscale(1);
			}
			40% {
				transform: translateY(-20px);
				opacity: 0;
			}
			80%,
			100% {
				transform: translateY(0);
				opacity: 1;
				filter: grayscale(1);
			}
		}

		/* The entire block moving into memory */
		@keyframes block-transfer {
			0%,
			10% {
				transform: translate(-50%, 0) scale(0.9);
				opacity: 0;
			}
			40%,
			60% {
				transform: translate(-50%, -80px) scale(1);
				opacity: 1;
				background-color: #3b82f6;
			}
			90%,
			100% {
				transform: translate(-50%, -140px) scale(0.9);
				opacity: 0;
			}
		}

		/* Memory container flash */
		@keyframes memory-glow {
			0%,
			40% {
				border-color: #e7e5e4;
				background-color: transparent;
			}
			50%,
			70% {
				border-color: #3b82f6;
				background-color: #eff6ff;
			}
			100% {
				border-color: #e7e5e4;
				background-color: transparent;
			}
		}

		.file-block {
			animation: file-lift var(--load-duration) infinite ease-in-out;
		}

		.transfer-ghost {
			animation: block-transfer var(--load-duration) infinite ease-in-out;
		}

		.memory-container {
			animation: memory-glow var(--load-duration) infinite;
		}
	</style>

	<div class="relative mx-auto flex max-w-md flex-col items-center gap-12 py-12">
		<div
			class="memory-container relative flex h-32 w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-stone-200"
		>
			<div class="mb-2 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
				Application RAM
			</div>
			<div class="font-mono text-[10px] text-stone-300">Heap Allocation: 1024KB</div>

			<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div
					class="transfer-ghost flex h-16 w-4/5 items-center justify-center rounded border border-blue-400 bg-blue-500/20"
				>
					<span class="font-mono text-[10px] font-bold text-white">ALL_USERS_ARRAY</span>
				</div>
			</div>
		</div>

		<div class="text-stone-200">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg
			>
		</div>

		<div class="file-block w-full rounded-lg border border-stone-200 bg-stone-50 p-4 shadow-sm">
			<div
				class="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-widest text-stone-400 uppercase"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path
						d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
					/><polyline points="14 2 14 8 20 8" /></svg
				>
				users.csv
			</div>
			<div class="space-y-1 font-mono text-[9px] leading-tight text-stone-500">
				<div>ID,Name,Email,Password</div>
				<div>1,Alex Rivers,alex@demo.com,pass123</div>
				<div>2,Samira Khan,samira@demo.com,sun88</div>
				<div>3,Jordan Lee,jlee@demo.com,open99</div>
			</div>
		</div>
	</div>

	<div class="mt-4 text-center">
		<span
			class="inline-block rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[10px] font-bold tracking-tight text-orange-600 uppercase"
		>
			Inefficient: Whole File Read
		</span>
	</div>
</div>
