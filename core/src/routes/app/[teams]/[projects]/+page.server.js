import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient.js'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { SvelteURLSearchParams } from 'svelte/reactivity'

import { lumi } from '$lib/lumiModel.js'

// import { GoogleGenAI, Type } from '@google/genai'
// import { AI_SYSTEM_INSTRUCTIONS, GOOGLE_AI_KEY } from '$env/static/private'

// const ai = new GoogleGenAI({apiKey: GOOGLE_AI_KEY})

// async function main() {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: "What is your name?",
//       config: {
//         systemInstruction: AI_SYSTEM_INSTRUCTIONS,
//         // tools: [{
//         //     functionDeclarations: []
//         // }]
//       }
//     });
//     console.log(response.text);
//   }
  
//   main();
let conversationHistory = []


export const load = async({ locals: {safeGetSession, supabase }, cookies, params }) => {
    const teamSlug = params.teams
    const projectSlug = params.projects

    const teamName = teamSlug[0].toUpperCase() + teamSlug.substring(1)
    const projectName = projectSlug[0].toUpperCase() + projectSlug.substring(1)

    return {name: teamName + ' / ' + projectName}
}

export const actions = {
    chat: async({request, locals: {safeGetSession, supabase }, cookies, params }) => {
      // get chat data
      const chatData = await request.formData()
      const userChat = chatData?.get('userChat')
      console.log(userChat)

      if(userChat) {
        console.log("start of the session:",conversationHistory)
        const chatResponse = await lumi(userChat, conversationHistory)
        chatResponse ? console.log(chatResponse.latestModelResponse.parts) : console.log("chatResponse is not there")
        conversationHistory = chatResponse.conversationHistory
        console.log("end of the session:", conversationHistory, chatResponse.functionResult)
      } else {
        console.log("Error in receiving user chat");
      }
    }
}