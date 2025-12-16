<script lang='ts'>
    const { title, subtitle } = $props<{ title: string; subtitle: string }>();
</script>

<div class="max-w-5xl mx-auto pt-20 px-6 mb-20 text-center">
    <div class="inline-flex items-center gap-3 mb-6">
        <div class="h-px w-8 bg-[#FF3E00]"></div>
        <span class="font-mono text-xs uppercase tracking-widest text-[#FF3E00]">Chapter 3</span>
        <div class="h-px w-8 bg-[#FF3E00]"></div>
    </div>
    <h1 class="font-serif text-xl md:text-6xl font-bold tracking-tight mb-6 text-stone-950">
         {title}
    </h1>
    <p class="text-xl text-stone-500 font-light max-w-2xl mx-auto leading-relaxed">
         {subtitle}
    </p>
</div>