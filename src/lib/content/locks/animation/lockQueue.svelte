<div
	class="mt-6 mb-10 rounded-2xl border border-stone-100 bg-white p-6 font-sans text-stone-600 shadow-sm md:p-10"
>
	<h5 class="mb-2 text-center text-xl font-bold text-stone-900">Lock Queue Mechanics</h5>
	<p class="mx-auto mb-12 max-w-md text-center text-sm text-stone-500">
		When a transaction holds an exclusive lock, others must wait. As soon as the lock is released,
		the next in line claims it.
	</p>

	<style>
		/* --- Global Config --- */
		:root {
			--anim-duration: 4s;
			/* Coordinate Map (Absolute Left Positions) */
			/* Box is 112px wide. Center is 56px. Ball is 40px (radius 20). */
			/* Pos 0 (Active Center): 56 - 20 = 36px */
			/* Pos 1 (Wait 1): 112 (box) + 8 (gap) = 120px */
			/* Pos 2 (Wait 2): 120 + 40 (ball) + 12 (gap) = 172px */
		}

		/* --- Animations --- */

		/* Lock Box Status Light */
		@keyframes lock-state-color {
			0%,
			45% {
				border-color: #ef4444;
				background-color: #fef2f2;
			} /* Red */
			50%,
			65% {
				border-color: #22c55e;
				background-color: #f0fdf4;
			} /* Green momentarily */
			70%,
			100% {
				border-color: #ef4444;
				background-color: #fef2f2;
			} /* Red */
		}

		/* Lock Label Text - Switching content and color */
		@keyframes lock-text-content {
			0%,
			45% {
				opacity: 1;
				content: 'locked';
				color: #dc2626;
			}
			50%,
			65% {
				opacity: 1;
				content: 'open';
				color: #16a34a;
			}
			70%,
			100% {
				opacity: 1;
				content: 'locked';
				color: #dc2626;
			}
		}

		/* Ball A: Active finishes and leaves */
		@keyframes active-vanish {
			0%,
			45% {
				transform: scale(1);
				opacity: 1;
			}
			50% {
				transform: scale(1.2);
				opacity: 0;
			}
			100% {
				transform: scale(0);
				opacity: 0;
			}
		}

		/* Ball B: First waiter enters box (-84px travel) and turns blue */
		@keyframes waiter-to-active {
			0%,
			50% {
				transform: translateX(0);
				background-color: #d6d3d1; /* stone-300 */
				box-shadow: none;
				color: #78716c;
			}
			60% {
				transform: translateX(-84px);
				background-color: #d6d3d1;
				box-shadow: none;
				color: #78716c;
			}
			/* It must finish EXACTLY looking like Ball A starts */
			70%,
			100% {
				transform: translateX(-84px);
				background-color: #3b82f6; /* blue-500 */
				box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
				color: white;
			}
		}

		/* Ball C: Scoots forward (-52px travel) */
		@keyframes queue-scoot {
			0%,
			50% {
				transform: translateX(0);
			}
			/* It must finish EXACTLY looking like Ball B starts */
			60%,
			100% {
				transform: translateX(-52px);
			}
		}

		/* Ball D: Spawns in at the back */
		@keyframes spawn-in {
			0%,
			60% {
				opacity: 0;
				transform: scale(0.5);
			}
			/* It must finish EXACTLY looking like Ball C starts */
			70% {
				opacity: 1;
				transform: scale(1.1);
			}
			100% {
				opacity: 1;
				transform: scale(1);
			}
		}

		/* Utilities */
		.bobbing {
			animation: bob 1.5s ease-in-out infinite;
		}
		@keyframes bob {
			0%,
			100% {
				margin-top: 0px;
			}
			50% {
				margin-top: -6px;
			}
		}
		.bob-delay-1 {
			animation-delay: 0.1s;
		}
		.bob-delay-2 {
			animation-delay: 0.2s;
		}

		.pulsing {
			animation: pulse-blue 2s infinite;
		}
		@keyframes pulse-blue {
			0%,
			100% {
				box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
			}
			50% {
				box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
			}
		}

		/* Class Assignments */
		.anim-lock-box {
			animation: lock-state-color var(--anim-duration) infinite;
		}
		/* Use ::after content to avoid layout shift from text width changes */
		.anim-lock-label::after {
			content: 'locked';
			animation: lock-text-content var(--anim-duration) infinite;
		}

		.ball-leaving {
			animation: active-vanish var(--anim-duration) infinite ease-in forwards;
		}
		.ball-entering {
			animation: waiter-to-active var(--anim-duration) infinite ease-in-out forwards;
		}
		.ball-scoot {
			animation: queue-scoot var(--anim-duration) infinite ease-in-out forwards;
		}
		.ball-spawn {
			animation: spawn-in var(--anim-duration) infinite ease-out forwards;
		}
	</style>

	<div class="flex w-full justify-center">
		<div class="relative h-[140px] w-[220px]">
			<div
				class="anim-lock-box absolute bottom-0 left-0 z-10 box-border flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-dashed"
			>
				<div class="absolute right-0 bottom-full left-0 mb-1 text-center">
					<span class="anim-lock-label text-sm font-bold"></span>
				</div>
			</div>

			<div class="absolute inset-0 z-20">
				<div class="absolute bottom-[36px] left-[36px]">
					<div
						class="ball-leaving pulsing flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/30"
					>
						Q1
					</div>
				</div>

				<div class="absolute bottom-[36px] left-[120px]">
					<div
						class="ball-entering flex h-10 w-10 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-500 shadow-sm"
					>
						Q2
					</div>
				</div>

				<div class="absolute bottom-[36px] left-[172px]">
					<div class="ball-scoot">
						<div
							class="bobbing bob-delay-1 flex h-10 w-10 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-500 shadow-sm"
						>
							Q3
						</div>
					</div>
				</div>

				<div class="absolute bottom-[36px] left-[172px]">
					<div class="ball-spawn">
						<div
							class="bobbing bob-delay-2 flex h-10 w-10 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-500 shadow-sm"
						>
							Q4
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div
		class="mt-10 flex items-center justify-center gap-6 border-t border-stone-100 pt-4 text-xs font-medium text-stone-500"
	>
		<div class="flex items-center gap-2">
			<div class="pulsing h-3 w-3 rounded-full bg-blue-500 shadow-sm"></div>
			<span>Active (Holding Lock)</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="h-3 w-3 rounded-full bg-stone-300 shadow-sm"></div>
			<span>Queued (Waiting)</span>
		</div>
	</div>
</div>
