<script>
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import { redirect } from '@sveltejs/kit';

    $: userTeams = $page.data?.userTeams || [];

    let showCreateTeamForm = false;
    let newTeamName= "";
    let newTeamDescription= "";

    const handleCreateTeam = () => {
        showCreateTeamForm = true;
    }

    const closeCreateTeamForm = () => {
        showCreateProjectForm = false;
        newTeamName="";
        newTeamDescription="";
    }
</script>

<h1>Teams</h1>

<div class="card.container">
    {#if userTeams.length > 0}
        {#each userTeams as team}
            <a href={redirect('308', `/${team?.name}`)}> //take team name and use as url
                <div class="card">
                    <h3>{team?.name}</h3>
                    <p>{team?.description}</p>
                    <p>Created: {team?.created}</p>
                </div>
            </a>
        {/each}
    {/if}
    <div class="button-container">
        <button onclick={handleCreateTeam}>Create Team</button>
    </div>
</div>

{#if showCreateTeamForm}
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
{/if}