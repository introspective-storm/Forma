<script>
    import { page } from '$app/stores'
    import { Sparkles, SquareChartGantt, Send } from '@lucide/svelte';

    const { data } = $props()
    let userMessage = $state('')
    let chatMessages = $state([{messageIsUser: false, text: 'Hi'},{messageIsUser: true, text: 'Hi'}])
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
            <div class="card bg-surface-800 col-span-4 scroll-smooth">
                <div>
                    {#each chatMessages as message }
                        {#if message.messageIsUser}
                            <div class="card border border-solid border-secondary-500 ml-120 mr-5 mt-5 p-2">
                                <p>{message.text}</p>
                            </div>
                        {:else}
                            <div class="card preset-gradient-one mr-105 ml-5 mt-5 p-2">
                                <p class="font-semibold text-surface-800">{message.text}</p>
                            </div>
                        {/if}
                    {/each}
                </div>
                <form class="row-span-1">
                    <div class="grid grid-cols-4 mt-10 w-150 ml-45">
                        <div class="card border border-primary-400 col-span-3 m-3 p-1">
                            <textarea class="input resize-y scroll-smooth" bind:value={userMessage} placeholder="Chat with Lumi"> </textarea>
                        </div>
                        <button class=" btn preset-filled-primary-500 col-span-1 justify-self-start m-7 ml-1" type="submit"><Send/></button>
                    </div>
                </form>
            </div>
            
        </div>
    </div>
    <div class="card bg-surface-900 col-span-3">
        <h4> test </h4>
    </div>

</div>