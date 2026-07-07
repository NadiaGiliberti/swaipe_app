export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    const oeffentlicheSeiten = ['/login', '/registrieren']

    // Nicht eingeloggt und will auf eine geschützte Seite → zu Login schicken
    if (!user.value && !oeffentlicheSeiten.includes(to.path)) {
        return navigateTo('/login')
    }

    // Eingeloggt, will aber auf Login/Registrieren → direkt zur Startseite
    if (user.value && oeffentlicheSeiten.includes(to.path)) {
        return navigateTo('/')
    }
    
})