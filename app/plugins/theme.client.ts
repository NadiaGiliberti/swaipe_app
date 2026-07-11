// app/plugins/theme.client.ts
export default defineNuxtPlugin(async () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    watch(user, async (neuerUser) => {
        if (neuerUser) {
            await loadAndApplyUserTheme(supabase, neuerUser.id)
        }
    }, { immediate: true })
})