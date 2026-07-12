// app/plugins/theme.client.ts
export default defineNuxtPlugin(async () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const appReady = useAppReady()

    const cookieTheme = ladeThemeAusCookie()
    if (cookieTheme) {
        applyTheme(cookieTheme.colors, cookieTheme.textDunkel, cookieTheme.textHell, cookieTheme.textSchwarz)
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (currentUser) {
        await loadAndApplyUserTheme(supabase, currentUser.id)
    }

    appReady.value = true

    watch(user, async (neuerUser) => {
        if (neuerUser) {
            await loadAndApplyUserTheme(supabase, neuerUser.id)
        }
    })
})