<div
	class="mt-4 mb-8 rounded-xl border border-stone-100 bg-white p-4 font-sans text-stone-600 shadow-sm md:p-6"
>
	<h5 class="mb-4 text-center text-sm font-bold tracking-widest text-stone-900 uppercase">
		Naive File Loading
	</h5>

	<style>
		:root {
			--load-speed: 2.8s;
		}

		/* Disk fades slightly as data is "pulled" out */
		@keyframes disk-fade {
			0%,
			10%,
			90%,
			100% {
				opacity: 1;
				filter: grayscale(0.5);
			}
			40%,
			60% {
				opacity: 0.3;
				filter: grayscale(1);
			}
		}

		/* Solid block that covers the label entirely */
		@keyframes block-transfer-opaque {
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

		@keyframes border-pulse {
			0%,
			35%,
			75%,
			100% {
				border-color: #e7e5e4;
			}
			40%,
			65% {
				border-color: #3b82f6;
			}
		}

		.disk-unit {
			animation: disk-fade var(--load-speed) infinite ease-in-out;
		}

		.transfer-block {
			animation: block-transfer-opaque var(--load-speed) infinite ease-in-out;
			background-color: #3b82f6; /* Solid Blue */
			z-index: 20;
		}

		.mem-zone {
			animation: border-pulse var(--load-speed) infinite;
		}
	</style>

	<div class="relative mx-auto flex max-w-xs flex-col items-center gap-4">
		<div
			class="mem-zone relative flex h-20 w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-stone-200 bg-stone-50"
		>
			<div class="z-0 text-[10px] font-bold tracking-tighter text-stone-300 uppercase">
				Application RAM
			</div>

			<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div class="transfer-block flex h-full w-full items-center justify-center shadow-inner">
					<div class="flex flex-col items-center">
						<span class="font-mono text-[10px] font-bold tracking-tight text-white">CSV DATA</span>
						<span class="font-mono text-[8px] text-blue-200">[Object Object] x 3</span>
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
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					><path d="M21 12V7H3v10h10" /><circle cx="18" cy="18" r="3" /><path d="M15 18h6" /></svg
				>
				Disk: users.csv
			</div>

			<div class="space-y-0.5 font-mono text-[8px] leading-none text-stone-400">
				<div class="text-stone-600">ID,Name,Email,Password</div>
				<div>1,Alex Rivers,alex@demo.com,pass123</div>
				<div>2,Samira Khan,samira@demo.com,sun88</div>
				<div>3,Jordan Lee,jlee@demo.com,open99</div>
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
		<div class="flex items-center gap-1">
			<div class="h-2 w-2 rounded-sm bg-blue-500"></div>
			<span>Active Memory</span>
		</div>
	</div>
</div>
