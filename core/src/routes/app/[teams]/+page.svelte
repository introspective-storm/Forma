<script>
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import { redirect } from '@sveltejs/kit';
    // import { props } from 'svelte';
    import Modal from './Modal.svelte'
    
    const { data } = $props()
    const { projects } = data
    //$: userprojects = $page.data || [];

    let showModal = $state(false);

    let showCreateprojectForm = false;
    let newprojectName= $state("");
    let newprojectDescription= $state("");

    const handleCreateproject = () => {
        showCreateprojectForm = true;
    }

    const closeCreateprojectForm = () => {
        showCreateprojectForm = false;
        newprojectName="";
        newprojectDescription="";
    }
</script>

<h1>projects</h1>

<div class="card-container">
        {#each data.projects as project}
        <div class="card">
            <a href={`./${project.url}`}>
                <div class="card-content">
                    <h3>{project.name}</h3>
                    <p class="description">{project.description}</p>
                    <p class="created">Created: {project.created}</p>
                </div>
            </a>
        </div>
        {/each}
</div>

<div class="button-container">
    <button onclick={()=>(showModal=true)}>Create project</button>
</div>

<Modal bind:showModal>
    <div>
        <h2>Create project</h2>
        <form method="POST" action="?/createproject" use:enhance>
            <div class="project-input">
                <label for="name">Project Name:</label>
                <input type="text" id="name" name="name" bind:value={newprojectName} required>
            </div>
            <div class="description-input">
                <label for="description">Description:</label>
                <textarea
                 id="description" 
                 name="description" 
                 bind:value={newprojectDescription}
                 cols="15"
                 rows="10"
                 ></textarea>
            </div>
            <div class="modal-buttons">
                <button type="submit">Create</button>
                <button type="button" onclick={closeCreateprojectForm}>Cancel</button>
            </div>
        </form>
    </div>
</Modal>