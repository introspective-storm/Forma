import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient.js'

export const actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')

    const { error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      console.error(signUpError)
      redirect(303, '/login/error')
    } else {
      redirect(303, '/')
    }
  },

  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      console.error(loginError)
      redirect(303, '/login/error')
    } else {

      const userId = loginData.user?.id
      console.log(userId)

      if (userId) {
        const {data: checkIfUserExists, error: userCheckError} = await supabase.from('app_context').select().eq('user_id', userId)
        console.log(checkIfUserExists)
        if (checkIfUserExists.length == 0 ) {
          const { error: appContextError } = await supabase
          .from('app_context')
          .insert({ user_id: userId, teams: [] , projects: []});

          if(appContextError) {
            console.error("Error creating row for new user", appContextError)
          } else {
            console.log("New user added to app_context");
          }

        }

      } else {
        console.warn("User ID not found");
      }

      redirect(303, '/app')
    }
  },
}