<!-- 
	Hello dear reader, 
	You are probably wondering how this animation was made.
	Well, it was generated with Gemini. 
	
	I'm generally sceptical of AI coding, 
	but I figured it was harmless for dealing with a basic HTML/CSS prop where 
	data integrity and user security isn't at risk. The code was reviewed and edited by me, 
	@theotherbrian1, so, yeah, human insight was involved. 
-->

<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-8"
>
	<h5 class="mb-6 text-center text-xl font-bold text-stone-900">Visualizing the Conflict</h5>

	<style>
		/* Total animation loop duration: 8s */

		/* --- Stage 1: DELETE "Bob Oden" (Faster: 0s - 2s / 0% - 25%) --- */
		/* Define unique vanishing points for 8 characters spaced over the first 25% */
		@keyframes vanish-c1 {
			0%,
			1% {
				opacity: 1;
			}
			3%,
			100% {
				opacity: 0;
			}
		} /* B */
		@keyframes vanish-c2 {
			0%,
			4% {
				opacity: 1;
			}
			6%,
			100% {
				opacity: 0;
			}
		} /* o */
		@keyframes vanish-c3 {
			0%,
			7% {
				opacity: 1;
			}
			9%,
			100% {
				opacity: 0;
			}
		} /* b */
		@keyframes vanish-c4 {
			0%,
			10% {
				opacity: 1;
			}
			12%,
			100% {
				opacity: 0;
			}
		} /* [space] */
		@keyframes vanish-c5 {
			0%,
			13% {
				opacity: 1;
			}
			15%,
			100% {
				opacity: 0;
			}
		} /* O */
		@keyframes vanish-c6 {
			0%,
			16% {
				opacity: 1;
			}
			18%,
			100% {
				opacity: 0;
			}
		} /* d */
		@keyframes vanish-c7 {
			0%,
			19% {
				opacity: 1;
			}
			21%,
			100% {
				opacity: 0;
			}
		} /* e */
		@keyframes vanish-c8 {
			0%,
			22% {
				opacity: 1;
			}
			25%,
			100% {
				opacity: 0;
			}
		} /* n */

		/* Highlight Writer Card during deletion phase */
		@keyframes writer-highlight {
			0%,
			25% {
				border-color: #ff3e00;
				background-color: #fff5f2; /* Very light orange tint */
				box-shadow:
					0 4px 6px -1px rgba(255, 62, 0, 0.1),
					0 2px 4px -1px rgba(255, 62, 0, 0.06);
			}
			25.1%,
			100% {
				/* Reset to default styles */
				border-color: #e7e5e4; /* stone-200 */
				background-color: #fafaf9; /* stone-50 */
				box-shadow: none;
			}
		}

		/* --- Stage 2: Pause (2s - 3s / 25% - 37.5%) --- */

		/* --- Stage 3: Reader reads what is left (3s - 5s / 37.5% - 62.5%) --- */
		@keyframes read-highlight {
			0%,
			37.5% {
				background-color: transparent;
			}
			37.6%,
			62.5% {
				background-color: rgba(255, 62, 0, 0.15);
				border-radius: 4px;
			}
			62.6%,
			100% {
				background-color: transparent;
			}
		}

		/* --- Stage 4: Warning appears (5s - 8s / 62.5% - 100%) --- */
		@keyframes warning-appear {
			0%,
			62.5% {
				opacity: 0;
				transform: scale(0.8);
			}
			62.6%,
			67.5% {
				opacity: 1;
				transform: scale(1.1);
			}
			67.6%,
			100% {
				opacity: 1;
				transform: scale(1);
			}
		}

		/* Shared animation properties for synchronization */
		.sync-anim {
			animation-duration: 8s;
			animation-iteration-count: infinite;
			animation-timing-function: linear;
			animation-fill-mode: both;
		}

		/* Assign animations to classes */
		.anim-writer-card {
			animation-name: writer-highlight;
		}
		.anim-read-overlay {
			animation-name: read-highlight;
		}
		.anim-warning {
			animation-name: warning-appear;
		}
		.anim-v1 {
			animation-name: vanish-c1;
		}
		.anim-v2 {
			animation-name: vanish-c2;
		}
		.anim-v3 {
			animation-name: vanish-c3;
		}
		.anim-v4 {
			animation-name: vanish-c4;
		}
		.anim-v5 {
			animation-name: vanish-c5;
		}
		.anim-v6 {
			animation-name: vanish-c6;
		}
		.anim-v7 {
			animation-name: vanish-c7;
		}
		.anim-v8 {
			animation-name: vanish-c8;
		}
	</style>

	<div class="mx-auto w-full max-w-4xl">
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div
				class="sync-anim anim-writer-card rounded-xl border border-stone-200 bg-stone-50 p-5 transition-colors"
			>
				<div class="mb-4 flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-200 font-bold text-stone-700"
					>
						U1
					</div>
					<div>
						<div class="leading-tight font-bold text-stone-900">Writer</div>
						<div class="text-sm text-stone-500">Deleting row...</div>
					</div>
				</div>
				<div class="overflow-x-auto rounded-lg bg-[#1d1c21] p-3 shadow-inner">
					<code class="block font-mono text-sm text-stone-200">
						DELETE FROM actors<br />WHERE row_id = 1;
					</code>
				</div>
			</div>

			<div class="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-5">
				<div
					class="sync-anim anim-read-overlay pointer-events-none absolute inset-0 bg-[#ff3e00]/5 mix-blend-multiply"
				></div>

				<div class="relative z-10 mb-4 flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-200 font-bold text-stone-700"
					>
						U2
					</div>
					<div>
						<div class="leading-tight font-bold text-stone-900">Reader</div>
						<div class="text-sm text-stone-500">Reading row...</div>
					</div>
				</div>
				<div class="relative z-10 overflow-x-auto rounded-lg bg-[#1d1c21] p-3 shadow-inner">
					<code class="block font-mono text-sm text-stone-200">
						SELECT name FROM actors<br />WHERE row_id = 1;
					</code>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-xl border border-stone-200 bg-white">
			<div class="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-4 py-3">
				<svg class="h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
					></path>
				</svg>
				<h2 class="font-semibold text-stone-700">Database: actors table</h2>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full border-collapse text-left">
					<thead class="bg-stone-100 text-sm font-semibold tracking-wider text-stone-600 uppercase">
						<tr>
							<th class="w-24 border-r border-b border-stone-200 px-4 py-2">row_id</th>
							<th class="border-b border-stone-200 px-4 py-2">name</th>
						</tr>
					</thead>
					<tbody class="font-mono text-stone-800">
						<tr class="relative bg-orange-50/50">
							<td class="border-r border-stone-200 px-4 py-3 text-stone-500"> 1 </td>
							<td class="relative px-4 py-3">
								<div class="flex items-center justify-between">
									<div
										class="sync-anim anim-read-overlay relative inline-block px-2 py-1 font-bold transition-all"
									>
										<span class="sync-anim anim-v1 text-[#ff3e00]">B</span><span
											class="sync-anim anim-v2 text-[#ff3e00]">o</span
										><span class="sync-anim anim-v3 text-[#ff3e00]">b</span><span
											class="sync-anim anim-v4 text-[#ff3e00]">&nbsp;</span
										><span class="sync-anim anim-v5 text-[#ff3e00]">O</span><span
											class="sync-anim anim-v6 text-[#ff3e00]">d</span
										><span class="sync-anim anim-v7 text-[#ff3e00]">e</span><span
											class="sync-anim anim-v8 text-[#ff3e00]">n</span
										><span>kirk</span>
									</div>

									<div
										class="sync-anim anim-warning flex items-center gap-1 rounded-full bg-[#ff3e00]/10 px-2 py-1 text-xs font-bold text-[#ff3e00] opacity-0"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="h-4 w-4"
										>
											<path
												fill-rule="evenodd"
												d="M8.485 2.495c.966-1.272 2.864-1.272 3.83 0l6.364 8.382c1.24 1.636.09 4.123-1.915 4.123H3.236c-2.005 0-3.155-2.487-1.915-4.123l6.364-8.382zm1.67 3.47a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0v-5zm-1.5 9.25a1 1 0 112 0 1 1 0 01-2 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Partial Data Read
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
