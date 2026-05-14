<script lang="ts">
	let { children } = $props();
</script>

<div class="  mb-6 w-full rounded-lg border-b border-stone-100 bg-blue-100 backdrop-blur-sm">
	<h4 class=" flex items-center gap-2 text-xl font-bold text-stone-900 md:text-2xl">
		<span class="h-20 w-2 rounded-full bg-blue-400"></span>
		{@render children()}
	</h4>
</div>
