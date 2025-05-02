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

<h1 class="text-7xl font-semibold pl-15 pb-10 pt-5">Projects</h1>

<div class="w-full grid grid-cols-3 gap-5 justify-center-safe pl-15 pr-15">
        {#each data.projects as project}
        <div class="card p-4 bg-surface-900 card-hover">
            <a href={`./${project.url}`}>
                <div>
                    <h3 class="text-3xl font-semibold pt-1 pb-2">{project.name}</h3>
                    <p class="text-base pb-8 text-surface-200">{project.description}</p>
                    <hr class="hr border-solid border-primary-500">
                    <p class="text-xs text-surface-500 pt-2">Created: {project.created}</p>
                </div>
            </a>
        </div>
        {/each}
</div>

<div class="w-full grid grid-cols-1 gap-10 justify-center-safe pl-15 pr-15 mt-10 mb-5">
    <div class="card p-6 bg-surface-900 flex flex-col items-center">
        <button class="btn-md btn preset-filled-primary-500" onclick={()=>(showModal=true)}>Create project</button>
    </div>
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