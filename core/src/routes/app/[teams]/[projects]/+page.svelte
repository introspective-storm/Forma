<script>
    import { page } from '$app/stores'
    import { Sparkles, SquareChartGantt, Send, Upload } from '@lucide/svelte';

    const { data } = $props()
    let userMessage = $state('')
    let chatMessages = $state([])
    const obj=[{messageIsUser: false, text: 'Hi'},{messageIsUser: true, text: 'Hi'}]
</script>
<h1 class="text-2xl font-semibold pl-15 pt-5 text-primary-400">{data.name}</h1>
<h3 class="text-5xl font-semibold pl-15 pb-15 pt-3">Dashboard</h3>

<div class="w-full h-screen grid grid-cols-5 grid-rows-6 gap-5 justify-center-safe pl-15 pr-15 mb-10">
    <div class="card bg-surface-900 col-span-1 row-span-4">
        <h4 class="flex flex-row gap-3 text-3xl font-semibold p-5 text-secondary-400"> Overview <SquareChartGantt/> </h4>
        <div class="grid grid-cols-2 gap-3 justify-center-safe pl-5 pr-5">
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

    <div class="card bg-surface-900 col-span-4 row-span-4">
        <h4 class="flex flex-row gap-3 text-3xl font-semibold p-5 text-secondary-400"> Lumi <Sparkles/> </h4>
        <!-- Chat Interface -->
        <div class="w-full h-130 grid grid-cols-[auto_1fr] gap-5">
            <!--Three Row Layout for lefthand column-->
            <div class="h-full grid grid-rows-[auto_1fr_auto] gap-3 pr-5 pl-5">
                <div class="p-1 pr-3 pl-3">
                    new chat
                </div>
                <div class="p-3 border-t border-b border-surface-700">
                    list
                </div>
                <div class="p-1 pr-3 pl-3">
                    footer
                </div>
            </div>
            <!--Two Row Layout for righthand column, first the main chat, then the prompt-->

            <!--The main feed/chat-->
            <div class="h-full grid grid-rows-[1fr_auto] gap-3 border-l border-primary-500 pr-5 pl-5">
                <div class="overflow-y-auto">
                    {#if chatMessages.length == 0}
                        <div class="justify-self-center">
                            <h5 class="font-semibold text-5xl preset-gradient-one bg-clip-text text-transparent">Hi! I'm Lumi</h5>
                            <p class="text-xl">What can I help you with?</p>
                        </div>
                    {:else}
                        <div>
                            {#each chatMessages as message }
                                {#if message.messageIsUser}
                                    <div class="card border border-secondary-500 p-3 m-3 mr-15 max-w-95 justify-self-end">
                                        <p>{message.text}</p>
                                    </div>
                                {:else}
                                    <div class="card preset-gradient-one p-3 m-3 ml-5 max-w-115 justify-self-start">
                                        <p class="text-surface-800">{message.text}</p>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    {/if}
                </div>
                <!--The prompt-->
                <div class="justify-self-center">
                    <form class="input-group grid-cols-[auto_1fr_auto]" action="">
                        <button class="ig-cell preset-filled-primary-500"><Upload /></button>
                        <textarea class="ig-input resize-y max-h-70 min-h-12 h-12 w-140 border border-surface-500"></textarea>
                        <button class="ig-btn preset-filled-primary-500" type="submit"><Send/></button>
                    </form>
                </div>
            </div>

        </div>
    </div>

    <div class="card bg-surface-900 col-span-5 row-span-2">
        <h4> test </h4>
    </div>

</div>