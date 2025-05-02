<script>
  import '../app.css';
  //import '@skeletonlabs/skeleton'
  import '../forma-theme.css'
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let { data, children } = $props();
  let { session, supabase } = $derived(data);
  
  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });
  
    return () => data.subscription.unsubscribe();
  });
</script>

  <svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet">
  </svelte:head>
  
  {@render children()}
