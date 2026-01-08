<script lang="ts">
	import SectionHeader from '$lib/components/section_header.svelte';
	import ReviewTabGroup from '$lib/components/review_tab.svelte';

	import Review from '$lib/content/locks/reviews/pganalyze/review.svelte';
	import Setup from '$lib/content/locks/reviews/pganalyze/setup.svelte';
</script>

<section class="troubleshooting_section">
	<SectionHeader>Review 3: PGAnalyze (9.8/10)</SectionHeader>

	<ReviewTabGroup>
		{#snippet review()}
			<Review />
		{/snippet}

		{#snippet setup()}
			<Setup />
		{/snippet}
	</ReviewTabGroup>
</section>
