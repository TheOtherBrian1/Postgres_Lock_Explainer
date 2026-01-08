<script lang="ts">
	import SectionHeader from '$lib/components/section_header.svelte';
	import ReviewTabGroup from '$lib/components/review_tab.svelte';

	import Review from '$lib/content/locks/reviews/datadog/review.svelte';
	import Setup from '$lib/content/locks/reviews/datadog/setup.svelte';
</script>

<section class="troubleshooting_section">
	<SectionHeader>Review 2: Datadog (9.9/10)</SectionHeader>

	<ReviewTabGroup>
		{#snippet review()}
			<Review />
		{/snippet}

		{#snippet setup()}
			<Setup />
		{/snippet}
	</ReviewTabGroup>
</section>
