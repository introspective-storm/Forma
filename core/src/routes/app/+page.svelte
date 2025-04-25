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

<h1>Teams</h1>

<div class="card-container">
        {#each data.teams as team}
        <div class="card">
            <a href={`./app/${team.url}`}>
                <div class="card-content">
                    <h3>{team.name}</h3>
                    <p class="description">{team.description}</p>
                    <p class="created">Created: {team.created}</p>
                </div>
            </a>
        </div>
        {/each}
</div>

<div class="button-container">
    <button onclick={()=>(showModal=true)}>Create Team</button>
</div>

<Modal bind:showModal>
    <div>
        <h2>Create Team</h2>
        <form method="POST" action="?/createTeam" use:enhance>
            <div>
                <label for="name">Project Name:</label>
                <input type="text" id="name" name="name" bind:value={newTeamName} required>
            </div>
            <div>
                <label for="description">Description:</label>
                <textarea id="description" name="description" bind:value={newTeamDescription}></textarea>
            </div>
            <div class="modal-buttons">
                <button type="submit">Create</button>
                <button type="button" onclick={closeCreateTeamForm}>Cancel</button>
            </div>
        </form>
    </div>
</Modal>