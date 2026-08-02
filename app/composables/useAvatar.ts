// app/composables/useAvatar.ts
export function speichereAvatarCookie(url: string) {
    const cookie = useCookie('swaipe_avatar', { maxAge: 60 * 60 * 24 * 365 })
    cookie.value = url
}

export function ladeAvatarAusCookie(): string {
    const cookie = useCookie('swaipe_avatar')
    return (cookie.value as string) || ''
}

export async function ladeUndSpeichereAvatar(supabase: any): Promise<string> {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return ''

    const { data: profilData } = await supabase
        .from('profiles')
        .select('profilbild_url')
        .eq('id', currentUser.id)
        .single()

    const url = profilData?.profilbild_url || ''
    speichereAvatarCookie(url)
    return url
}