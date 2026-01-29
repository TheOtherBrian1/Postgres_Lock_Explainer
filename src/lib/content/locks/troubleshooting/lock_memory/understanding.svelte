<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
</script>

<p class="p">
	Object locks (locks on tables and indexes) are stored in memory for the duration of a transaction.
	The amount of memory used is fairly low and frankly negligible (maybe 200 bytes on most
	architectures). However, to still be considerate of resource consumption and prevent excessive locking, PG limits the
	amount of object locks the DB can use at any given time. There are two settings that control the limit:
</p>

<ul class="mb-10 ml-4 list-disc space-y-2">
	<li class="pl-4">
		<strong class="mb-1 block text-stone-900">
			<a
				class=" underline decoration-2 underline-offset-2 transition-colors hover:text-[#ff6b35]"
				href="https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-DEADLOCK-TIMEOUT"
				>max_connections</a
			>
		</strong>

		Determines the maximum amount of server connections Postgres can sustain at any given time
	</li>

	<li class="pl-4">
		<strong class="mb-1 block text-stone-900">
			<a
				class=" underline decoration-2 underline-offset-2 transition-colors hover:text-[#ff6b35]"
				href="https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-MAX-LOCKS-PER-TRANSACTION"
				>max_locks_per_transaction</a
			>
		</strong>

		Determines the maximum amount of object locks allowed per transaction on average
	</li>
</ul>

<p class="p">
	The maximum amount of locks allowed is: <CodeHighlight
		>max_locks_per_transaction * max_connections</CodeHighlight
	>. The default values for both these settings are 64 and 100, respectively, so 6,400 in total.
</p>

<p class="p">
	In this example case, it's okay if on query claims 1,000 locks and another claims 5,400. However,
	if a third query then claimed another lock (6,401) that would violate the limits. Once that
	happens, the unfortunate query will encounter the error:
</p>

<!-- prettier-ignore -->
<CodeBlock>
ERROR: out of shared memory 
SQL state: 53200 
Hint: You might need to increase max_locks_per_transaction.
</CodeBlock>
