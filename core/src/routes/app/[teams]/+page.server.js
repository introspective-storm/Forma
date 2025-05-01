import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient.js'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { SvelteURLSearchParams } from 'svelte/reactivity'

const { window } = new JSDOM('')
const purify = DOMPurify(window)

export const load = async({ locals: { safeGetSession, supabase }, cookies, params}) => {
    const teamSlug = params.teams
    console.log(teamSlug)
    const { session, user } = await safeGetSession()
    const userId = user?.id
    //console.log(userId)
    if (userId) {
        const {data: projectsData, error: projectsError} = await supabase
        .from('app_context')
        .select('projects, projects_created_on, projects_description, projects_url')
        .eq('user_id', userId)

        console.log("project data:",projectsData)
        if (projectsError) {
            console.log(projectsError)
            return { projects: [] }
        } else if (projectsData) {
            const filteredProjectsData = projectsData.map(item => ({
                projects: item.projects?.filter((p, index) => item.projects_url?.[index]?.startsWith(`${teamSlug}/`)) || [],
                created: item.projects_created_on?.filter((_, index) => item.projects_url?.[index]?.startsWith(`${teamSlug}/`)) || [],
                description: item.projects_description?.filter((_, index) => item.projects_url?.[index]?.startsWith(`${teamSlug}/`)) || [],
                url: item.projects_url?.filter(url => url?.startsWith(`${teamSlug}/`)) || [],
            }));
            console.log("filtered projects:", filteredProjectsData)
            //projectsData ? console.log("project found:", projectsData) : console.log("project not found")
            const projects = projectsData ? projectsData[0].projects : []
            const created = projectsData ? projectsData[0].projects_created_on : []
            const description = projectsData ? projectsData[0].projects_description : []
            const url = projectsData ? projectsData[0].projects_url : []

            const projectsToDisplay = filteredProjectsData[0].projects.map((project) => {
                if (project.length == 0) {
                    return project
                } else {
                    return project.replace(`${teamSlug}-`, '')
                }
            })
            console.log("Projects to display: ", projectsToDisplay)

            const createdToDisplay = filteredProjectsData[0].created.map((individualCreated)=>{
                const dateObject = new Date(individualCreated)
                
                return dateObject.toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    timeZoneName: 'short'})
            })

            //console.log(projectsToDisplay)
            //console.log(urlToDisplay)

            const formattedprojects = filteredProjectsData[0].projects.map((project, index) => ({
                name: projectsToDisplay[index],
                created: createdToDisplay[index],
                description: filteredProjectsData[0].description[index],
                url: filteredProjectsData[0].url[index]
            }))
            console.log("formatedProjects:",formattedprojects)
            return { projects: formattedprojects }
            } 
        } else {
        console.log("User not found")
        redirect(303, "/")
    }
}

export const actions = { 
    createproject: async ({ request, locals: { safeGetSession, supabase }, params}) => {
        const teamSlug = params.teams
        const formData = await request.formData()
        const nameSanitzed = purify.sanitize(formData.get('name')?.toString() || '') //santize project name
        const descriptionSanitized = purify.sanitize(formData.get('description')?.toString() || '') // santize description
        console.log(teamSlug)
        
        const name = nameSanitzed.trim()
        const description = descriptionSanitized.trim()
        const nameURL = name.toLowerCase().replace(/\s+/g, '-')

        const { session, user } = await safeGetSession()
        const userId = user?.id

        if (userId) {
            const { data: projectsNameData, error: projectsNameError } = await supabase.from('app_context').select('projects') // check across all users and their project names
            const { data: projectsNameDataByUser, error: projectsNameErrorByUser } = await supabase
            .from('app_context')
            .select('projects, projects_created_on, projects_description, projects_url')
            .eq('user_id', userId)

            const existingprojects = projectsNameDataByUser ? projectsNameDataByUser[0].projects : []
            const existingprojectsCreatedOn = projectsNameDataByUser ? projectsNameDataByUser[0].projects_created_on : []
            const existingprojectsDescriptions = projectsNameDataByUser ? projectsNameDataByUser[0].projects_description : []
            const existingprojectsURL = projectsNameDataByUser ? projectsNameDataByUser[0].projects_url : []
            console.log("projects data for all:",projectsNameData);
            console.log("projects data by user:",projectsNameDataByUser);
            console.log("existing projects:", projectsNameDataByUser[0].projects);
            
            //console.log(userId)

            const updatedprojects = [...existingprojects, teamSlug + "-" + name]
            const updatedprojectsDescriptions = [...existingprojectsDescriptions,description]
            const updatedprojectsURL = [...existingprojectsURL, teamSlug + "/" + nameURL]
            console.log(updatedprojects)

            /*
            TODO: For the love of god, we need to refactor this horrible, horrible code. However, it works right now, inefficently,
            but it fucking works. I'm sorry.
            */

            if (projectsNameError) {
                console.log(projectsNameError)
                return {status: "failed", error: "Error in adding project name"}
            } else if(projectsNameErrorByUser) {
                console.log(projectsNameErrorByUser)
                return {status: "failed", error: "Error in adding project name"}
            } else if(name.trim() === '' || !name) {
                console.log("Choose a project name")
                return {status: "failed", error: "project name is required"}
            } else if(projectsNameData.length === 0) {
                const timestamp = new Date()
                const timestampISO = timestamp.toISOString();
                const updatedprojectsCreatedOn = [...existingprojectsCreatedOn, timestampISO]

                const {data: projectUpdateData, error: projectUpdateError } = await supabase.from('app_context').update({
                    projects: updatedprojects,
                    projects_created_on: updatedprojectsCreatedOn,
                    projects_description: updatedprojectsDescriptions,
                    projects_url: updatedprojectsURL //turn project name into proper url and store
                }).eq('user_id', userId).select()
                console.log("project update data:", projectUpdateData)

                
                if(projectUpdateError) {
                    console.log("Error in adding project")
                    return {status: "failed", error: "Error in adding project name"}
                }

                return {status: "success", error: "project name succesfully added"}
            } else {
                for (let i=0; i < projectsNameData.length; i++) {
                    let checkIfprojectNameExistsByUser = projectsNameData[i].projects.includes(name)

                    if(checkIfprojectNameExistsByUser) {
                        console.log("Name already choosen")
                        return {status: "failed", error: "project name has already been choosen, please choose a different one"}
                        break;
                    } else if((i === 1-projectsNameData.length) && (checkIfprojectNameExistsByUser == false)) {
                        const timestamp = new Date()
                        const timestampISO = timestamp.toISOString();
                        const updatedprojectsCreatedOn = [...existingprojectsCreatedOn, timestampISO]

                        const {data: projectUpdateData, error: projectUpdateError } = await supabase.from('app_context').update({
                            projects: updatedprojects,
                            projects_created_on: updatedprojectsCreatedOn,
                            projects_description: updatedprojectsDescriptions,
                            projects_url: updatedprojectsURL //turn project name into proper url and store
                        }).eq('user_id', userId).select()
                        console.log("project update data", projectUpdateData)
                        
                        if(projectUpdateError) {
                            console.log("Error in adding project")
                            return {status: "failed", error: "Error in adding project name"}
                        }

                        return {status: "success", error: "project name succesfully added"}
                    }
                }
            }
        } else {
            console.log("something went wrong with the user")
            return {status: "failed", error: "User not authenticated"}
        }
    }
}