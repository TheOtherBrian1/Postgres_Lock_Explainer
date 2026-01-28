<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from "$lib/components/code_highlight.svelte";
	import DropDown from '$lib/components/drop_down.svelte';
</script>

<p>
	A query exceeded the <a
		class="a"
		href="https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LOCK-TIMEOUT"
		>lock_timeout</a
	>
	setting, so it was terminated.
</p>
<!-- prettier-ignore -->
<CodeBlock>
canceling statement due to lock timeout
</CodeBlock>


<DropDown title='Real world example'>
	<p>
		A user was issuing migrations with a CLI tool that automatically added a <CodeHighlight>lock_timeout</CodeHighlight>. They encountered the issue, and did not recognize the error. They found the default timeout disruptive to the migration they were trying to run.
	</p>
	<p>
		The solution was to set a custom timeout for the migration:
	</p>

	<!-- prettier-ignore -->
	<CodeBlock>
-- just for a transaction 
BEGIN; 
	SET LOCAL lock_timeout TO '10s';

	-- migration...

COMMIT;
	</CodeBlock>

	<p>
		It was actually this user interaction that eventually led me to create this site. I realized that it was necessary to create a tool to outline what operations block each other to help explain the concept. Then, it kind of spiraled out of control into an entire review of locks.
	</p>
</DropDown>