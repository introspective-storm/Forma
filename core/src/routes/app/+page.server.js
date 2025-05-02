import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient.js'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const { window } = new JSDOM('')
const purify = DOMPurify(window)

export const load = async({ locals: { safeGetSession, supabase }, cookies}) => {
    const { session, user } = await safeGetSession()
    const userId = user?.id
    const userEmail = user?.email
    const userName = userEmail.slice(0, userEmail.lastIndexOf('@'))
    //console.log(userId)
    if (userId) {
        const {data: teamsData, error: teamsError} = await supabase
        .from('app_context')
        .select('teams, teams_created_on, teams_description, teams_url')
        .eq('user_id', userId)
        console.log("team data:",teamsData)
        if (teamsError) {
            console.log(teamsError)
            return { teams: [] }
        } else {
            //teamsData ? console.log("team found:", teamsData) : console.log("team not found")
            const teams = teamsData ? teamsData[0].teams : []
            const created = teamsData ? teamsData[0].teams_created_on : []
            const description = teamsData ? teamsData[0].teams_description : []
            const url = teamsData ? teamsData[0].teams_url : []

            const createdToDisplay = created.map((individualCreated)=>{
                const dateObject = new Date(individualCreated)
                
                return dateObject.toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    timeZoneName: 'short'})
            })
            console.log(createdToDisplay)
            console.log(created)
            const formattedTeams = teams.map((team, index) => ({
                name: team,
                created: createdToDisplay[index],
                description: description[index],
                url: url[index]
            }))
            console.log(formattedTeams)
            return { teams: formattedTeams, user: userName }
            } 
        } else {
        console.log("User not found")
        redirect(303, "/")
    }
}

export const actions = { 
    createTeam: async ({ request, locals: { safeGetSession, supabase }}) => {
        const formData = await request.formData()
        const nameSanitzed = purify.sanitize(formData.get('name')?.toString() || '') //santize team name
        const descriptionSanitized = purify.sanitize(formData.get('description')?.toString() || '') // santize description
        
        const name = nameSanitzed.trim()
        const description = descriptionSanitized.trim()
        const nameURL = name.toLowerCase().replace(/\s+/g, '-')

        const { session, user } = await safeGetSession()
        const userId = user?.id

        if (userId) {
            const { data: teamsNameData, error: teamsNameError } = await supabase.from('app_context').select('teams') // check across all users and their team names
            const { data: teamsNameDataByUser, error: teamsNameErrorByUser } = await supabase
            .from('app_context')
            .select('teams, teams_created_on, teams_description, teams_url')
            .eq('user_id', userId)

            const existingTeams = teamsNameDataByUser ? teamsNameDataByUser[0].teams : []
            const existingTeamsCreatedOn = teamsNameDataByUser ? teamsNameDataByUser[0].teams_created_on : []
            const existingTeamsDescriptions = teamsNameDataByUser ? teamsNameDataByUser[0].teams_description : []
            const existingTeamsURL = teamsNameDataByUser ? teamsNameDataByUser[0].teams_url : []
            console.log("teams data for all:",teamsNameData);
            console.log("teams data by user:",teamsNameDataByUser);
            console.log("existing teams:", teamsNameDataByUser[0].teams);
            
            //console.log(userId)

            const updatedTeams = [...existingTeams, name]
            const updatedTeamsDescriptions = [...existingTeamsDescriptions,description]
            const updatedTeamsURL = [...existingTeamsURL,nameURL]
            console.log(updatedTeams)

            /*
            TODO: For the love of god, we need to refactor this horrible, horrible code. However, it works right now, inefficently,
            but it fucking works. I'm sorry.
            */

            if (teamsNameError) {
                console.log(teamsNameError)
                return {status: "failed", error: "Error in adding team name"}
            } else if(teamsNameErrorByUser) {
                console.log(teamsNameErrorByUser)
                return {status: "failed", error: "Error in adding team name"}
            } else if(name.trim() === '' || !name) {
                console.log("Choose a team name")
                return {status: "failed", error: "Team name is required"}
            } else if(teamsNameData.length === 0) {
                const timestamp = new Date()
                const timestampISO = timestamp.toISOString();
                const updatedTeamsCreatedOn = [...existingTeamsCreatedOn, timestampISO]

                const {data: teamUpdateData, error: teamUpdateError } = await supabase.from('app_context').update({
                    teams: updatedTeams,
                    teams_created_on: updatedTeamsCreatedOn,
                    teams_description: updatedTeamsDescriptions,
                    teams_url: updatedTeamsURL //turn team name into proper url and store
                }).eq('user_id', userId).select()
                console.log("team update data:", teamUpdateData)

                
                if(teamUpdateError) {
                    console.log("Error in adding team")
                    return {status: "failed", error: "Error in adding team name"}
                }

                return {status: "success", error: "Team name succesfully added"}
            } else {
                for (let i=0; i < teamsNameData.length; i++) {
                    let checkIfTeamNameExistsByUser = teamsNameData[i].teams.includes(name)

                    if(checkIfTeamNameExistsByUser) {
                        console.log("Name already choosen")
                        return {status: "failed", error: "Team name has already been choosen, please choose a different one"}
                        break;
                    } else if((i === 1-teamsNameData.length) && (checkIfTeamNameExistsByUser == false)) {
                        const timestamp = new Date()
                        const timestampISO = timestamp.toISOString();
                        const updatedTeamsCreatedOn = [...existingTeamsCreatedOn, timestampISO]

                        const {data: teamUpdateData, error: teamUpdateError } = await supabase.from('app_context').update({
                            teams: updatedTeams,
                            teams_created_on: updatedTeamsCreatedOn,
                            teams_description: updatedTeamsDescriptions,
                            teams_url: updatedTeamsURL //turn team name into proper url and store
                        }).eq('user_id', userId).select()
                        console.log("team update data", teamUpdateData)
                        
                        if(teamUpdateError) {
                            console.log("Error in adding team")
                            return {status: "failed", error: "Error in adding team name"}
                        }

                        return {status: "success", error: "Team name succesfully added"}
                    }
                }
            }
        } else {
            console.log("something went wrong with the user")
            return {status: "failed", error: "User not authenticated"}
        }
    }
}