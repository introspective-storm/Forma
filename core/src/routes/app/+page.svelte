<script>
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import { redirect } from '@sveltejs/kit';
    // import { props } from 'svelte';
    import Modal from './Modal.svelte'
    
    const { data } = $props()
    const { teams } = data
    //$: userTeams = $page.data || [];

    let showModal = $state(false);

    let showCreateTeamForm = false;
    let newTeamName= $state("");
    let newTeamDescription= $state("");

    const handleCreateTeam = () => {
        showCreateTeamForm = true;
    }

    const closeCreateTeamForm = () => {
        showCreateTeamForm = false;
        newTeamName="";
        newTeamDescription="";
    }
</script>

<h1 class="text-2xl font-semibold pl-15 pt-5 text-primary-400">Hi, {data.user}</h1>
<h3 class="text-5xl font-semibold pl-15 pb-15 pt-3">Teams</h3>

<div class="w-full grid grid-cols-3 gap-5 justify-center-safe pl-15 pr-15">
        {#each data.teams as team}
        <div class="card p-4 bg-surface-900 card-hover">
            <a href={`./app/${team.url}`}>
                <div>
                    <h3 class="text-3xl font-semibold pt-1 pb-2">{team.name}</h3>
                    <p class="text-base pb-8 text-surface-200">{team.description}</p>
                    <hr class="hr border-solid border-primary-500">
                    <p class="text-xs text-surface-500 pt-2">Created: {team.created}</p>
                </div>
            </a>
        </div>
        {/each}
</div>

<div class="w-full grid grid-cols-1 gap-10 justify-center-safe pl-15 pr-15 mt-10 mb-5">
    <div class="card p-6 bg-surface-900 flex flex-col items-center">
        <button class="btn-md btn preset-filled-primary-500" onclick={()=>(showModal=true)}>Create Team</button>
    </div>
</div>

<Modal bind:showModal>
    <div>
        <h2>Create Team</h2>
        <form method="POST" action="?/createTeam" use:enhance>
            <div class="team-input">
                <label for="name">Project Name:</label>
                <input type="text" id="name" name="name" bind:value={newTeamName} required>
            </div>
            <div class="description-input">
                <label for="description">Description:</label>
                <textarea
                 id="description" 
                 name="description" 
                 bind:value={newTeamDescription}
                 cols="15"
                 rows="10"
                 ></textarea>
            </div>
            <div class="modal-buttons">
                <button type="submit">Create</button>
                <button type="button" onclick={closeCreateTeamForm}>Cancel</button>
            </div>
        </form>
    </div>
</Modal>