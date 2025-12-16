<script lang="ts">
	import SectionHeader from '$lib/components/section_header.svelte';
	import TabGroup from '$lib/components/tab.svelte';

	import CausesAndFixes from '$lib/content/locks/troubleshooting/blocked/causes_and_fixes.svelte';
	import Error from '$lib/content/locks/troubleshooting/blocked/error.svelte';
	import Understanding from '$lib/content/locks/troubleshooting/blocked/understanding.svelte';
</script>

<section class="troubleshooting_section">
	<SectionHeader>Problem 4: Completely Blocked</SectionHeader>

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
