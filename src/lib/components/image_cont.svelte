<script lang="ts">
	interface Props {
		src: string;
		alt: string;
	}
	let { src, alt }: Props = $props();
	console.log(src);
</script>

<div class="my-4 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm md:p-6">
	<img class="m-auto w-auto rounded-sm shadow-sm" {src} {alt} />
</div>
