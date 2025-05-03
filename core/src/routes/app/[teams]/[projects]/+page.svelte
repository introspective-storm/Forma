<script>
    import { page } from '$app/stores'

    import { Sparkles, SquareChartGantt } from '@lucide/svelte';
    const { data } = $props()
</script>
<h1 class="text-2xl font-semibold pl-15 pt-5 text-primary-400">{data.name}</h1>
<h3 class="text-5xl font-semibold pl-15 pb-15 pt-3">Dashboard</h3>

<div class="w-full h-screen grid grid-cols-3 gap-5 justify-center-safe pl-15 pr-15 mb-10">
    <div class="card bg-surface-900 col-span-1">
        <h4 class="flex flex-row gap-3 text-3xl font-semibold p-5 text-secondary-400"> Overview <SquareChartGantt/> </h4>
        <div class="grid grid-cols-3 gap-3 justify-center-safe pl-5 pr-5">
            <div class="card bg-surface-800">
                <h5>test</h5>
            </div>
            <div class="card bg-surface-800">
                <h5>test</h5>
            </div>
            <div class="card bg-surface-800">
                <h5>test</h5>
            </div>

        </div>

    </div>
    <div class="card bg-surface-900 col-span-2">
        <h4 class="flex flex-row gap-3 text-3xl font-semibold p-5 text-secondary-400"> Lumi <Sparkles/> </h4>
        <div class="grid grid-cols-5 gap-3 justify-center-safe pl-5 pr-5 mb-5">
            <div class="flex flex-col gap-2 card bg-surface-800 col-span-1">
                <h5 class="text-xl font-medium p-3"> Chats </h5>
                <p>test</p>
            </div>
            <div class="card bg-surface-800 col-span-4">

            </div>
            
        </div>
    </div>
    <div class="card bg-surface-900 col-span-3">
        <h4> test </h4>
    </div>

</div>