<script>
  import { Navigation } from '@skeletonlabs/skeleton-svelte';
  import { Home } from '@lucide/svelte'
  import { LogOut } from '@lucide/svelte'
  import { redirect } from '@sveltejs/kit'

    let { data, children } = $props()
    let { supabase } = $derived(data)
    let value = $state('files');
  
    const logout = async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error(error)
      }
      redirect(307, '/')
    }
  </script>
  <div class="grid h-screen grid-cols-[auto_1fr]">
  <aside class="fixed col-span-1 top-0 z-10 flex flex-col bg-surface-900 h-full p-3">
    <Navigation.Rail {value} onValueChange={(newValue)=>(value=newValue)}>
      {#snippet tiles()}
      <Navigation.Tile label="Home" href="/"> <Home /> </Navigation.Tile>
    <Navigation.Tile onclick={logout} href="/"> <LogOut /> </Navigation.Tile>
        
      {/snippet}
    </Navigation.Rail>
  </aside>
  <main class="col-span-2 ml-15">
    {@render children()}
  </main>
  </div>