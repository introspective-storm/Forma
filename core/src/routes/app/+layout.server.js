// import { redirect } from '@sveltejs/kit'

// export const load = async({ locals: { safeGetSession, supabase }, cookies}) {
//     const { session, user } = await safeGetSession()
//     const userId = user?.id
//     if(!userId) {
//         redirect(303, '/')
//     }
// }