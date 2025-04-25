<script>
    let { data, children } = $props()
    let { supabase } = $derived(data)
  
    const logout = async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error(error)
      }
    }
  </script>
  
  <header>
      <nav>
        <a href="/">Home</a>
        <button onclick={logout}>Logout</button>
      </nav>
  </header>
  <main>
    {@render children()}
  </main>