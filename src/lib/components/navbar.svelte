<script lang="ts">
	// import img from '$lib/assets/pg_book.png';
</script>

<nav class="  pt-6 font-sans text-[#1c1c1c] selection:bg-[#FF3E00] selection:text-white">
	<div
		class="mb-5 flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm md:px-10 md:py-5"
	>
		<div class="flex items-center gap-3">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff3e00] to-[#ff6b35] text-lg font-bold text-white"
			>
				Pg
			</div>
			<span class="text-2xl font-bold text-stone-900 md:text-3xl"> The Postgres Cookbook </span>
		</div>
		<button
			class="group relative flex cursor-pointer items-center gap-3 rounded-lg border-2 border-stone-200 px-5 py-2.5 font-medium text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
		>
			<div class="flex flex-col gap-1">
				<span class="h-0.5 w-5 rounded bg-current"></span>
				<span class="h-0.5 w-5 rounded bg-current"></span>
				<span class="h-0.5 w-5 rounded bg-current"></span>
			</div>
			<span class="hidden sm:inline">Chapters</span>
			<div
				class="absolute top-12 right-0 hidden h-72 w-72 cursor-default rounded-md border-2 border-stone-200 bg-white p-2 shadow-2xl group-focus-within:block"
			>
				<p class="p text-left">
					I haven't written any other chapters yet. This is a work in progress. I decided to release
					it early for review. As for why this is chapter 3, I figured chapter 1 would be connection
					management, chapter 2 would be vacuum management, finally chapter 3 would be locks. The
					project became much broader than I thought it was going to be
				</p>
			</div>
		</button>
	</div>
</nav>
