<script lang="ts">
	import SectionHeader from '$lib/components/section_header.svelte';
	import TabGroup from '$lib/components/tab.svelte';

	import CausesAndFixes from '$lib/content/locks/troubleshooting/deadlocks/causes_and_fixes.svelte';
	import Error from '$lib/content/locks/troubleshooting/deadlocks/error.svelte';
	import Understanding from '$lib/content/locks/troubleshooting/deadlocks/understanding.svelte';
</script>

<!-- PROBLEM 1: DEADLOCKS -->
<section class="troubleshooting_section">
	<SectionHeader>Problem 1: Deadlocks</SectionHeader>

	<TabGroup>
		{#snippet error()}
			<Error />
		{/snippet}

		{#snippet understanding()}
			<Understanding />
		{/snippet}

		{#snippet fixes()}
			<CausesAndFixes />
		{/snippet}
	</TabGroup>
</section>
