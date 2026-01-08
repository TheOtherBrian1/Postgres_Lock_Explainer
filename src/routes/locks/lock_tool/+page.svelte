<script lang="ts">
	import { onMount } from 'svelte';
	import operations from '$lib/constants/sql_operations';
	import lockConflicts from '$lib/constants/locks';

	// COMPONENTS
	import SectionHeader from '$lib/components/section_header.svelte';
	import CodeBlock from '$lib/components/code_block.svelte';

	// STATE
	let activeIndex = $state<number | null>(1);
	let activeConnections = $state<{ order: number; level: string }[]>([]);
	let viewMode = $state<'list' | 'circular'>('circular');

	// VISUALIZATION SETTINGS (RADIAL)
	const RADIUS = 180;
	const TEXT_OFFSET = 25;

	// --- LOGIC ---

	const generateConnections = (ind: number) => {
		activeIndex = ind;
		const activeOp = operations[ind];
		const { mainRowLocksClaimed, mainTableLocksClaimed, refTableLocksClaimed, refRowLocksClaimed } =
			activeOp;

		const lockConflictMap = new Map(lockConflicts.map((lc) => [lc.lock, new Set(lc.conflicts)]));

		const getConflictingLocks = (claimedLocks: string[]) => {
			const conflicts = new Set<string>();
			for (const claimed of claimedLocks) {
				const lockConflicts = lockConflictMap.get(claimed);
				if (lockConflicts) {
					for (const conflict of lockConflicts) {
						conflicts.add(conflict);
					}
				}
			}
			return conflicts;
		};

		const conflictingMainTableLocks = getConflictingLocks(mainTableLocksClaimed);
		const conflictingRefTableLocks = getConflictingLocks(refTableLocksClaimed);
		const conflictingMainRowLocks = getConflictingLocks(mainRowLocksClaimed);
		const conflictingRefRowLocks = getConflictingLocks(refRowLocksClaimed);

		const blockedOp: { order: number; level: string }[] = [];

		for (let i = 0; i < operations.length; i++) {
			if (i === ind) continue;
			const op = operations[i];
			let blockedLevel = null;

			for (const lock of op.mainTableLocksClaimed)
				if (conflictingMainTableLocks.has(lock)) blockedLevel = 'main-table';
			if (!blockedLevel)
				for (const lock of op.refTableLocksClaimed)
					if (conflictingRefTableLocks.has(lock)) blockedLevel = 'ref-table';
			if (!blockedLevel)
				for (const lock of op.mainRowLocksClaimed)
					if (conflictingMainRowLocks.has(lock)) blockedLevel = 'main-row';
			if (!blockedLevel)
				for (const lock of op.refRowLocksClaimed)
					if (conflictingRefRowLocks.has(lock)) blockedLevel = 'ref-row';

			if (blockedLevel) {
				blockedOp.push({ order: i, level: blockedLevel });
			}
		}
		activeConnections = blockedOp;
	};

	const getLevelColor = (level: string) => {
		switch (level) {
			case 'main-table':
				return '#ef4444';
			case 'ref-table':
				return '#3b82f6';
			case 'main-row':
				return '#f59e0b';
			case 'ref-row':
				return '#8b5cf6';
			default:
				return '#94a3b8';
		}
	};

	const getLevelLabel = (level: string) => {
		switch (level) {
			case 'main-table':
				return 'Table Lock';
			case 'ref-table':
				return 'Ref Table Lock';
			case 'main-row':
				return 'Row Lock';
			case 'ref-row':
				return 'Ref Row Lock';
			default:
				return 'Lock';
		}
	};

	// Helper for Radial Math
	const getPos = (index: number, total: number) => {
		const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
		return {
			x: RADIUS * Math.cos(angle),
			y: RADIUS * Math.sin(angle),
			angle: angle
		};
	};

	onMount(async () => {
		generateConnections(0);
	});
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12 md:pr-4 md:pb-4"
>
	<section class="explainer_section">
		<SectionHeader>Interactive Lock Simulator</SectionHeader>
		<div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
			<div class="w-full">
				<p class="mt-2 font-bold text-stone-600">Pick a command to see what it blocks</p>
			</div>

			<div class="hidden rounded-lg border border-stone-200 bg-stone-100 p-1 md:flex">
				<button
					onclick={() => (viewMode = 'circular')}
					class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold transition-all"
					class:bg-white={viewMode === 'circular'}
					class:text-stone-900={viewMode === 'circular'}
					class:shadow-sm={viewMode === 'circular'}
					class:text-stone-500={viewMode !== 'circular'}
				>
					Circular
				</button>
				<button
					onclick={() => (viewMode = 'list')}
					class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold transition-all"
					class:bg-white={viewMode === 'list'}
					class:text-stone-900={viewMode === 'list'}
					class:shadow-sm={viewMode === 'list'}
					class:text-stone-500={viewMode !== 'list'}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path></svg
					>
					List
				</button>
			</div>
		</div>

		<div class="flex flex-col-reverse gap-6 md:flex-row">
			<div
				class="flex w-full flex-col overflow-y-auto rounded-xl border border-stone-200 bg-stone-50 shadow-sm md:h-[600px] md:w-5/12"
			>
				{#if activeIndex !== null}
					<div class="space-y-6 p-6">
						<div class="block">
							<label class="mb-2 block text-xs font-bold tracking-wider text-stone-500 uppercase">
								Pick an Operation
							</label>
							<div class="relative">
								<select
									class="w-full appearance-none rounded-lg border border-stone-300 bg-white px-4 py-2 font-bold text-stone-900 shadow-sm outline-none focus:border-[#FF3E00] focus:ring-1 focus:ring-[#FF3E00]"
									bind:value={activeIndex}
									onchange={() => generateConnections(activeIndex || 0)}
								>
									{#each operations as op, i}
										<option value={i}>{op.operation}</option>
									{/each}
								</select>
								<div
									class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500"
								>
									<svg
										class="h-4 w-4 fill-current"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										><path
											d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
										/></svg
									>
								</div>
							</div>
						</div>

						<div class="rounded-lg border border-stone-100 bg-white p-4 shadow-sm">
							<p class="text-sm leading-relaxed text-stone-600">
								{operations[activeIndex].description}
							</p>
						</div>

						{#key activeIndex}
							<CodeBlock label="Example Query">
								{operations[activeIndex].exampleQuery}
							</CodeBlock>
						{/key}

						{#if activeConnections.length > 0}
							<div class="pt-2">
								<div class="flex flex-col">
									<h3
										class="mb-0 flex items-center gap-2 text-xs font-bold text-stone-500 uppercase"
									>
										<span
											class="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600"
										>
											{activeConnections.length}
										</span>
										Blocked Operations
									</h3>
									<div class="mb-2 flex space-x-2 rounded-md pt-1">
										<span class="text-[8px]">Sources: </span>
										{#each operations[activeIndex]?.sources as source, i}
											<a class="text-[8px] font-light text-gray-900 underline" href={source.link}
												>{source.title}</a
											>
											{#if i >= operations[activeIndex]?.sources.length}
												,
											{/if}
										{/each}
									</div>
								</div>
								<div class="flex flex-col gap-2">
									{#each activeConnections as conn}
										<div
											class="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-3 shadow-sm transition-all hover:border-stone-300"
										>
											<div class="flex flex-col">
												<span class="text-sm font-bold text-stone-800">
													{operations[conn.order].operation}
												</span>
												<span class="text-[10px] text-stone-400">
													Blocked by {getLevelLabel(conn.level)}
												</span>
											</div>
											<div
												class="h-2 w-2 rounded-full"
												style:background-color={getLevelColor(conn.level)}
											></div>
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<div class="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
								<p class="flex items-center gap-2 text-xs font-bold text-emerald-700">
									Non-blocking operation
								</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<div
				class="relative hidden w-full overflow-hidden rounded-xl border border-stone-200 bg-white md:block md:h-[600px] md:w-7/12"
			>
				{#if viewMode === 'circular'}
					<div class="flex h-full w-full items-center justify-center">
						<svg viewBox="-350 -350 700 700" class="h-full w-full select-none">
							<circle cx="0" cy="0" r={RADIUS} fill="none" stroke="#f5f5f4" stroke-width="1" />

							{#if activeIndex !== null}
								{@const start = getPos(activeIndex, operations.length)}
								{#each activeConnections as conn}
									{@const end = getPos(conn.order, operations.length)}
									{@const color = getLevelColor(conn.level)}
									<path
										d="M {start.x} {start.y} Q 0 0 {end.x} {end.y}"
										fill="none"
										stroke={color}
										stroke-width="2"
										opacity="0.6"
										class="pointer-events-none transition-all duration-500 ease-out"
									/>
								{/each}
							{/if}

							{#each operations as op, i}
								{@const pos = getPos(i, operations.length)}
								{@const isActive = activeIndex === i}
								{@const isBlocked = activeConnections.some((c) => c.order === i)}
								{@const connection = activeConnections.find((c) => c.order === i)}

								{@const angleDeg = (pos.angle * 180) / Math.PI}
								{@const isLeft = angleDeg > 90 || angleDeg < -90}
								{@const finalRotation = isLeft ? angleDeg + 180 : angleDeg}
								{@const textAnchor = isLeft ? 'end' : 'start'}
								{@const xOff = isLeft ? -TEXT_OFFSET : TEXT_OFFSET}

								<g
									class="cursor-pointer transition-all duration-300"
									class:opacity-100={isActive || isBlocked}
									class:grayscale={!isActive && !isBlocked}
									class:opacity-60={!isActive && !isBlocked}
									onclick={() => generateConnections(i)}
								>
									<circle cx={pos.x} cy={pos.y} r="20" fill="transparent" />

									<circle
										cx={pos.x}
										cy={pos.y}
										r={isActive ? 8 : 5}
										fill="white"
										stroke={isActive
											? '#FF3E00'
											: isBlocked && connection
												? getLevelColor(connection.level)
												: '#d6d3d1'}
										stroke-width={isActive ? 3 : 2}
										class="transition-all duration-300"
									/>

									<text
										x={0}
										y={0}
										transform="translate({pos.x}, {pos.y}) rotate({finalRotation}) translate({xOff}, 4)"
										text-anchor={textAnchor}
										class="fill-current text-[10px] font-medium tracking-wide transition-colors duration-200 md:text-xs"
										class:text-[#FF3E00]={isActive}
										class:font-bold={isActive}
										class:text-stone-900={isBlocked}
										class:text-stone-400={!isActive && !isBlocked}
									>
										{op.operation}
									</text>
								</g>
							{/each}
							<circle cx="0" cy="0" r="4" fill="#f5f5f4" />
						</svg>
					</div>
				{:else}
					<div class="h-full overflow-y-scroll p-4 pr-32">
						<div class="flex min-w-[300px] flex-col items-start pt-4 pb-12">
							{#each operations as operation, outerInd}
								{@const isActive = activeIndex === outerInd}
								{@const isBlocked =
									activeIndex !== outerInd && activeConnections.some((c) => c.order === outerInd)}
								{@const connection = activeConnections.find((c) => c.order === outerInd)}

								<button
									class="group relative flex h-12 w-full cursor-pointer items-center justify-end space-x-4 transition-all duration-300"
									class:opacity-60={activeIndex !== null && !isActive && !isBlocked}
									class:grayscale={activeIndex !== null && !isActive && !isBlocked}
									onclick={() => generateConnections(outerInd)}
								>
									<div
										class="text-right text-sm whitespace-nowrap transition-colors duration-200"
										class:font-bold={isActive || isBlocked}
										class:text-[#FF3E00]={isActive}
										class:text-stone-900={isBlocked}
										class:text-stone-500={!isActive && !isBlocked}
									>
										{operation.operation}
									</div>

									{#if activeIndex === outerInd}
										{@const sortedConnections = activeConnections.slice().sort((a, b) => {
											const distanceA = Math.abs(outerInd - a.order);
											const distanceB = Math.abs(outerInd - b.order);
											return distanceA - distanceB;
										})}

										{#each sortedConnections as conn, i}
											{@const isBelow = conn.order > outerInd}
											{@const distance = Math.abs(outerInd - conn.order)}
											{@const baseWidth = 20}
											{@const spacing = 6}
											{@const lineWidth = baseWidth + i * spacing}

											<div
												class="pointer-events-none absolute z-0 rounded-r-md opacity-80"
												style:left="calc(100% - 8px)"
												style:top={isBelow ? 'calc(50% - 1px)' : 'auto'}
												style:bottom={!isBelow ? 'calc(50% - 1px)' : 'auto'}
												style:width="{lineWidth}px"
												style:height="calc({distance * 100}% + 2px)"
												style:border-top="2px solid {getLevelColor(conn.level)}"
												style:border-right="2px solid {getLevelColor(conn.level)}"
												style:border-bottom="2px solid {getLevelColor(conn.level)}"
												style:border-left="none"
											></div>
										{/each}
									{/if}

									<div
										class="relative z-10 h-4 w-4 rounded-full border-2 shadow-sm transition-all duration-300"
										class:bg-[#FF3E00]={isActive}
										class:border-[#FF3E00]={isActive}
										class:scale-125={isActive}
										class:bg-white={!isActive}
										style:border-color={isBlocked && connection
											? getLevelColor(connection.level)
											: isActive
												? '#FF3E00'
												: '#d6d3d1'}
									></div>
								</button>
							{/each}
						</div>
					</div>
				{/if}

				{#if viewMode === 'circular'}
					<div
						class="absolute top-4 right-4 z-20 flex w-[240px] gap-2 rounded-lg border border-stone-200 bg-white/90 p-2 text-[10px] shadow-sm backdrop-blur"
					>
						<!-- <div class=" text-xs font-bold text-stone-500 uppercase">Lock Types</div> -->
						<!-- <div class="flex w-full justify-between"> -->
						<div class="flex items-center gap-1">
							<span class="h-1 w-1 rounded-full bg-red-500"></span>Table Lock
						</div>
						<div class="flex items-center gap-1">
							<span class="h-1 w-1 rounded-full bg-blue-500"></span>Ref Table Lock
						</div>
						<div class="flex items-center gap-1">
							<span class="h-1 w-1 rounded-full bg-amber-500"></span>Row Lock
						</div>
						<!-- </div> -->
					</div>
				{/if}
			</div>
		</div>
	</section>
</article>
