<script lang="ts">
	import SectionHeader from '$lib/components/section_header.svelte';
	import ReviewTabGroup from '$lib/components/review_tab.svelte';

	import Review from '$lib/content/locks/reviews/pghero/review.svelte';
	import Setup from '$lib/content/locks/reviews/pghero/setup.svelte';
</script>

<section class="troubleshooting_section">
	<SectionHeader>Review 7: PGHero (3/10)</SectionHeader>

	<ReviewTabGroup>
		{#snippet review()}
			<Review />
		{/snippet}

		{#snippet setup()}
			<Setup />
		{/snippet}
	</ReviewTabGroup>
</section>
