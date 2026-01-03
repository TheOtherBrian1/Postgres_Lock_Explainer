<script lang="ts">
	const { title, subtitle } = $props<{ title: string; subtitle: string }>();
</script>

<div class="mx-auto mb-12 max-w-5xl px-6 pt-14 text-center">
	<h1 class="mb-8 font-serif text-xl font-bold tracking-tight text-stone-950 md:text-6xl">
		{title}
	</h1>
	<p class="mx-auto max-w-2xl text-xl leading-relaxed font-light text-stone-500">
		{subtitle}
	</p>
</div>
