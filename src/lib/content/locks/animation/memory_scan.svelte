<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-10"
>
	<h5 class="mb-2 text-center text-xl font-bold text-stone-900">Sequential Table Scan</h5>
	<p class="mx-auto mb-12 max-w-md text-center text-sm text-stone-500">
		The database engine reads the table from disk into the memory buffer, processing each row
		sequentially.
	</p>

	<style>
		:root {
			--scan-duration: 4s;
		}

		/* The moving laser line */
		@keyframes laser-scan {
			0% {
				top: 0%;
				opacity: 0;
			}
			5% {
				opacity: 1;
			}
			90% {
				opacity: 1;
			}
			95%,
			100% {
				top: 100%;
				opacity: 0;
			}
		}

		/* Highlighting rows as the scan passes */
		@keyframes row-highlight {
			0%,
			100% {
				background-color: transparent;
			}
			10%,
			25% {
				background-color: #eff6ff;
			} /* blue-50 */
		}

		/* Data chunks appearing in memory */
		@keyframes memory-fill {
			0% {
				transform: scale(0.8);
				opacity: 0;
				background-color: #e7e5e4;
			}
			20% {
				transform: scale(1);
				opacity: 1;
				background-color: #3b82f6;
			}
			100% {
				transform: scale(1);
				opacity: 1;
				background-color: #3b82f6;
			}
		}

		.scan-container {
			position: relative;
		}

		.laser {
			position: absolute;
			left: 0;
			right: 0;
			height: 2px;
			background: linear-gradient(90deg, transparent, #3b82f6, transparent);
			box-shadow: 0 0 8px #3b82f6;
			z-index: 30;
			pointer-events: none;
			animation: laser-scan var(--scan-duration) infinite linear;
		}

		.row-anim {
			animation: row-highlight var(--scan-duration) infinite;
		}
		.row-1 {
			animation-delay: 0.4s;
		}
		.row-2 {
			animation-delay: 0.8s;
		}
		.row-3 {
			animation-delay: 1.2s;
		}
		.row-4 {
			animation-delay: 1.6s;
		}
		.row-5 {
			animation-delay: 2s;
		}

		.mem-chunk {
			width: 12px;
			height: 12px;
			border-radius: 2px;
			animation: memory-fill var(--scan-duration) infinite;
			opacity: 0;
		}
	</style>

	<div class="flex flex-col items-start justify-center gap-8 lg:flex-row">
		<div class="scan-container w-full max-w-xl flex-1">
			<div class="laser"></div>
			<table
				class="w-full border-collapse overflow-hidden rounded-lg border border-stone-200 text-left shadow-sm"
			>
				<thead class="bg-stone-100 text-xs font-semibold text-stone-500 uppercase">
					<tr>
						<th class="w-12 border-r border-b border-stone-200 px-3 py-2">ID</th>
						<th class="border-b border-stone-200 px-3 py-2">Name</th>
						<th class="text-hidden border-b border-stone-200 px-3 py-2 md:block">Email</th>
						<th class="border-b border-stone-200 px-3 py-2">Pass</th>
					</tr>
				</thead>
				<tbody class="bg-white font-mono text-[11px] md:text-sm">
					<tr class="row-anim row-1 border-b border-stone-100">
						<td class="border-r border-stone-200/50 px-3 py-2 text-stone-400">1</td>
						<td class="px-3 py-2 font-bold text-stone-800">Alex Rivers</td>
						<td class="px-3 py-2 text-stone-500">alex@demo.com</td>
						<td class="px-3 py-2 text-stone-800">pass123</td>
					</tr>
					<tr class="row-anim row-2 border-b border-stone-100">
						<td class="border-r border-stone-200/50 px-3 py-2 text-stone-400">2</td>
						<td class="px-3 py-2 font-bold text-stone-800">Samira Khan</td>
						<td class="px-3 py-2 text-stone-500">sam@demo.com</td>
						<td class="px-3 py-2 text-stone-800">sun88</td>
					</tr>
					<tr class="row-anim row-3 border-b border-stone-100">
						<td class="border-r border-stone-200/50 px-3 py-2 text-stone-400">3</td>
						<td class="px-3 py-2 font-bold text-stone-800">Jordan Lee</td>
						<td class="px-3 py-2 text-stone-500">jlee@demo.com</td>
						<td class="px-3 py-2 text-stone-800">opennow</td>
					</tr>
					<tr class="row-anim row-4 border-b border-stone-100">
						<td class="border-r border-stone-200/50 px-3 py-2 text-stone-400">4</td>
						<td class="px-3 py-2 font-bold text-stone-800">Casey Wright</td>
						<td class="px-3 py-2 text-stone-500">case@demo.com</td>
						<td class="px-3 py-2 text-stone-800">qwert24</td>
					</tr>
					<tr class="row-anim row-5">
						<td class="border-r border-stone-200/50 px-3 py-2 text-stone-400">5</td>
						<td class="px-3 py-2 font-bold text-stone-800">Morgan Smith</td>
						<td class="px-3 py-2 text-stone-500">morg@demo.com</td>
						<td class="px-3 py-2 text-stone-800">secure!</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="w-full rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 p-4 lg:w-48">
			<span
				class="mb-3 block text-center text-[10px] font-bold tracking-widest text-stone-400 uppercase"
				>Memory Buffer</span
			>
			<div class="grid grid-cols-6 gap-2">
				<div class="mem-chunk row-1"></div>
				<div class="mem-chunk row-1" style="animation-delay: 0.45s"></div>
				<div class="mem-chunk row-2" style="animation-delay: 0.8s"></div>
				<div class="mem-chunk row-2" style="animation-delay: 0.85s"></div>
				<div class="mem-chunk row-3" style="animation-delay: 1.2s"></div>
				<div class="mem-chunk row-3" style="animation-delay: 1.25s"></div>
				<div class="mem-chunk row-4" style="animation-delay: 1.6s"></div>
				<div class="mem-chunk row-4" style="animation-delay: 1.65s"></div>
				<div class="mem-chunk row-5" style="animation-delay: 2.0s"></div>
				<div class="mem-chunk row-5" style="animation-delay: 2.05s"></div>
				<div class="mem-chunk bg-stone-200 opacity-20"></div>
				<div class="mem-chunk bg-stone-200 opacity-20"></div>
			</div>
			<div class="mt-4 h-1 w-full overflow-hidden rounded-full bg-stone-200">
				<div
					class="h-full bg-blue-500"
					style="animation: load-bar var(--scan-duration) infinite linear;"
				></div>
			</div>
			<style>
				@keyframes load-bar {
					0% {
						width: 0%;
					}
					80% {
						width: 100%;
					}
					100% {
						width: 100%;
					}
				}
			</style>
		</div>
	</div>

	<div
		class="mt-8 flex items-center justify-center gap-6 border-t border-stone-100 pt-4 text-xs font-medium text-stone-500"
	>
		<div class="flex items-center gap-2">
			<div class="h-3 w-3 rounded-sm bg-blue-500"></div>
			<span>Cached in RAM</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="h-0.5 w-4 bg-blue-400 shadow-[0_0_4px_#3b82f6]"></div>
			<span>Disk I/O Read Head</span>
		</div>
	</div>
</div>
