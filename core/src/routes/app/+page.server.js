import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient.js'

export const load = async({ locals: { safeGetSession }, cookies}) => {
    const { session, user } = await safeGetSession()
    const userId = user?.id
    if (userId) {
        const { data: teamsData, error: teamsError } = await supabase.from('app_context').select().eq('user_id', userId)

        if (teamsError) {
            console.log(teamsError)
            return { teams: [] }
        } else {
            teamsData ? console.log("team found") : console.log("team not found")
            return { teams: teamsData?.teams || [], created: teamsData?.teams_created_on || [], description: teamsData?.teams_description || [] }
        }

    } else {
        console.log("User not found")
        redirect(303, "/")
    }
}

export const action = async({}) => {
    
}