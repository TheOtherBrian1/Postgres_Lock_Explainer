<script lang="ts">
	import SectionHeader from '$lib/components/section_header.svelte';
	import ReviewTabGroup from '$lib/components/review_tab.svelte';

	import Review from '$lib/content/locks/reviews/datadog/review.svelte';
	import Setup from '$lib/content/locks/reviews/datadog/setup.svelte';
</script>

<section class="troubleshooting_section">
	<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white">
		<h4
			class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			Review 2: Datadog (9.9/10)
		</h4>
		<!-- Tab Headers -->
		<div class="flex border-b border-stone-200 bg-stone-50">
			<div class="min-h-[300px] bg-white p-6 md:p-8">
				<Review />
			</div>
		</div>
	</div>
	<!-- <ReviewTabGroup>
		{#snippet review()}
			<Review />
		{/snippet}

		{#snippet setup()}
			<Setup />
		{/snippet}
	</ReviewTabGroup> -->
</section>
