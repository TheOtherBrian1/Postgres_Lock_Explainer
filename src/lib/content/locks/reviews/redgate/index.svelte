<script lang="ts">
	import Review from '$lib/content/locks/reviews/redgate/review.svelte';
</script>

<section class="troubleshooting_section">
	<div class="mb-8 overflow-hidden rounded-lg border border-stone-200 bg-white">
		<h4
			class="mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
		>
			Review 1: Redgate Monitor (No lock visibility)
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
<!-- 
<section class="troubleshooting_section">
	<h4
		class="mt-8 mb-4 rounded-xs border-l-2 bg-gray-50 p-2 text-lg font-bold text-stone-900 shadow-xs"
	>
		Review 1: Redgate Monitor (No lock visibility)
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
