// app/composables/useHighscores.ts
export function formatDatum(iso: string | null) {
    if (!iso) return ''
    const d = new Date(iso)
    return `${d.getDate()}.${d.getMonth() + 1}.${String(d.getFullYear()).slice(-2)}`
}

export async function ladeTopAlle(supabase: any, limit = 10) {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    const { data: topListe, error } = await supabase
        .from('profiles')
        .select('id, username, profilbild_url, highscore, highscore_datum')
        .order('highscore', { ascending: false })
        .limit(limit)

    if (error || !topListe) return { liste: [], eigenerRang: null, eigenerEintrag: null }

    const eigenerInListe = topListe.some((p: any) => p.id === currentUser.id)

    if (eigenerInListe) {
        return { liste: topListe, eigenerRang: null, eigenerEintrag: null }
    }

    const { data: eigenesProfil } = await supabase
        .from('profiles')
        .select('id, username, profilbild_url, highscore, highscore_datum')
        .eq('id', currentUser.id)
        .single()

    const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gt('highscore', eigenesProfil.highscore)

    return {
        liste: topListe,
        eigenerRang: (count ?? 0) + 1,
        eigenerEintrag: eigenesProfil
    }
}

export async function ladeFreundeRanking(supabase: any) {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    const { freunde } = await ladeFreundeUndAnfragen(supabase)

    const { data: eigenesProfil } = await supabase
        .from('profiles')
        .select('id, username, profilbild_url, highscore, highscore_datum')
        .eq('id', currentUser.id)
        .single()

    const alleEintraege = [...freunde, eigenesProfil]
        .filter(Boolean)
        .sort((a: any, b: any) => (b.highscore ?? 0) - (a.highscore ?? 0))

    return alleEintraege
}