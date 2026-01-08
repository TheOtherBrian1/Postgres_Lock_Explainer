<script lang="ts">
	import SectionHeader from '$lib/components/section_header.svelte';
	import ReviewTabGroup from '$lib/components/review_tab.svelte';

	import Review from '$lib/content/locks/reviews/redgate/review.svelte';
	import Setup from '$lib/content/locks/reviews/redgate/setup.svelte';
</script>

<section class="troubleshooting_section">
	<SectionHeader>Review 1: Redgate Monitor (No lock visibility)</SectionHeader>

	<ReviewTabGroup>
		{#snippet review()}
			<Review />
		{/snippet}

		{#snippet setup()}
			<Setup />
		{/snippet}
	</ReviewTabGroup>
</section>
