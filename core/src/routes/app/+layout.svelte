<script>
  import { Navigation } from '@skeletonlabs/skeleton-svelte';
    let { data, children } = $props()
    let { supabase } = $derived(data)
    let value = $state('files');
  
    const logout = async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error(error)
      }
    }
  </script>
  <div class="grid h-screen grid-cols-[auto_1fr]">
  <aside class="fixed col-span-1 top-0 z-10 flex flex-col bg-surface-900 h-full p-3">
    <Navigation.Rail {value} onValueChange={(newValue)=>(value=newValue)}>
      {#snippet tiles()}
      <Navigation.Tile label="Home" href="/"></Navigation.Tile>
      <Navigation.Tile> <button onclick={logout}>Logout</button> </Navigation.Tile>
        
      {/snippet}
    </Navigation.Rail>
  </aside>
  <main class="col-span-2 ml-15">
    {@render children()}
  </main>
  </div>