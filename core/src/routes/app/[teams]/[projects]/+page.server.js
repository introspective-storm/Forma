import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient.js'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { SvelteURLSearchParams } from 'svelte/reactivity'

import { GoogleGenAI } from '@google/genai'
import { AI_SYSTEM_INSTRUCTIONS, GOOGLE_AI_KEY } from '$env/static/private'

const ai = new GoogleGenAI({apiKey: GOOGLE_AI_KEY})

async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "What is your name?",
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTIONS,
        tools: [{
            functionDeclarations: []
        }]
      }
    });
    console.log(response.text);
  }
  
  main();

export const load = async({ locals: {safeGetSession, supabase }, cookies, params }) => {
    const teamSlug = params.teams
    const projectSlug = params.projects

    const teamName = teamSlug[0].toUpperCase() + teamSlug.substring(1)
    const projectName = projectSlug[0].toUpperCase() + projectSlug.substring(1)

    return {name: teamName + ' / ' + projectName}
}

export const actions = async({ locals: {safeGetSession, supabase }, cookies, params }) => {

}