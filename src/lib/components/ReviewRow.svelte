<script lang="ts">
	interface Props {
		tool: string;
		score: string;
		setup: string;
		url?: string; // Link to your review (e.g. #datadog)
		demoUrl?: string; // New: Link to external live demo
		visibility: 'Excellent' | 'Good' | 'Moderate' | 'Low' | 'None';
		visibilityNotes?: string;
		isTopPick?: boolean;
		highlightSetup?: boolean;
		warnSetup?: boolean;
	}

	let {
		tool,
		score,
		setup,
		url,
		demoUrl,
		visibility,
		visibilityNotes = '',
		isTopPick = false,
		highlightSetup = false,
		warnSetup = false
	}: Props = $props();

	const badgeStyles = {
		Excellent: 'bg-emerald-100 text-emerald-800',
		Good: 'bg-amber-100 text-amber-800',
		Moderate: 'bg-stone-100 text-stone-600',
		Low: 'bg-stone-100 text-stone-600',
		None: 'bg-rose-100 text-rose-800'
	};

	const badgeColor = badgeStyles[visibility] || badgeStyles.Moderate;
</script>

<tr
	class="group transition-colors hover:bg-stone-50/80 {isTopPick
		? 'bg-amber-50/40 hover:bg-amber-50/60'
		: ''}"
>
	<td class="px-6 py-4">
		<div class="flex flex-col items-start">
			<div class="flex items-center gap-2 font-bold text-stone-900">
				{#if url}
					<a
						href={url}
						class="underline decoration-stone-300 underline-offset-4 transition-colors hover:text-amber-700 hover:decoration-amber-400"
					>
						{tool}
					</a>
				{:else}
					{tool}
				{/if}

				{#if isTopPick}
					<span
						class="rounded border border-amber-200 bg-white px-1.5 py-0.5 text-[10px] font-normal tracking-wide text-amber-600 uppercase"
					>
						Top Pick
					</span>
				{/if}
			</div>

			{#if demoUrl}
				<a
					href={demoUrl}
					target="_blank"
					rel="noreferrer"
					class="mt-1 flex items-center gap-1 text-[11px] font-medium text-stone-400 transition-colors hover:text-amber-600"
				>
					Live Demo
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-3"
					>
						<path
							fill-rule="evenodd"
							d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
							clip-rule="evenodd"
						/>
						<path
							fill-rule="evenodd"
							d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
			{/if}
		</div>
	</td>

	<td class="px-6 py-4 align-top">
		<span
			class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {badgeColor}"
		>
			{visibility}
		</span>
		{#if visibilityNotes}
			<div class="mt-1 text-xs text-stone-500">{visibilityNotes}</div>
		{/if}
	</td>

	<td class="px-6 py-4 align-top">
		<span
			class:text-emerald-700={highlightSetup}
			class:text-rose-700={warnSetup}
			class:font-medium={highlightSetup || warnSetup}
		>
			{setup}
		</span>
	</td>

	<td class="px-6 py-4 align-top font-bold whitespace-nowrap text-stone-900">
		{score}
	</td>
</tr>
