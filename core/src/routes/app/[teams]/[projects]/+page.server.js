import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient.js'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { SvelteURLSearchParams } from 'svelte/reactivity'

export const load = async({ locals: {safeGetSession, supabase }, cookies, params }) => {
    const teamSlug = params.teams
    const projectSlug = params.projects

    const teamName = teamSlug[0].toUpperCase() + teamSlug.substring(1)
    const projectName = projectSlug[0].toUpperCase() + projectSlug.substring(1)

    return {name: teamName + ' / ' + projectName}
}