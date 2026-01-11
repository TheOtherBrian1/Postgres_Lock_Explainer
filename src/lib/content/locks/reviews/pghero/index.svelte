<script lang="ts">
	import SectionHeader from '$lib/components/section_header.svelte';
	import ReviewTabGroup from '$lib/components/review_tab.svelte';

	import Review from '$lib/content/locks/reviews/pghero/review.svelte';
	import Setup from '$lib/content/locks/reviews/pghero/setup.svelte';
</script>

<section class="troubleshooting_section">
	<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white">
		<h4
			class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			Review 7: PGHero (3/10)
		</h4>
		<!-- Tab Headers -->
		<div class="flex border-b border-stone-200 bg-stone-50">
			<div class="min-h-[300px] bg-white p-6 md:p-8">
				<Review />
			</div>
		</div>
	</div>
</section>

<!-- <section class="troubleshooting_section">
	<h4
		class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
	>
		Review 7: PGHero (3/10)
	</h4>
	<ReviewTabGroup>
		{#snippet review()}
			<Review />
		{/snippet}

		{#snippet setup()}
			<Setup />
		{/snippet}
	</ReviewTabGroup>
</section> -->
