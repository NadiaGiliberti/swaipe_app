
export function formatDatum(iso: string | null) {
    if (!iso) return ''
    const d = new Date(iso)
    return `${d.getDate()}.${d.getMonth() + 1}.${String(d.getFullYear()).slice(-2)}`
}

export async function ladeTopAlle(supabase: any, limit = 10) {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) return { liste: [], eigenerRang: null, eigenerEintrag: null }

    const { data: topListe, error } = await supabase
        .from('profiles')
        .select('id, username, profilbild_url, highscore, highscore_datum')
        .gt('highscore', 0)
        .order('highscore', { ascending: false })
        .limit(limit)

    if (error || !topListe) return { liste: [], eigenerRang: null, eigenerEintrag: null }

    const topListeMitFlag = topListe.map((eintrag: any) => ({
        ...eintrag,
        istIch: eintrag.id === currentUser.id
    }))

    const eigenerInListe = topListeMitFlag.some((p: any) => p.istIch)

    if (eigenerInListe) {
        return { liste: topListeMitFlag, eigenerRang: null, eigenerEintrag: null }
    }

    const { data: eigenesProfil } = await supabase
        .from('profiles')
        .select('id, username, profilbild_url, highscore, highscore_datum')
        .eq('id', currentUser.id)
        .single()

    if (!eigenesProfil || eigenesProfil.highscore === 0) {
        return { liste: topListeMitFlag, eigenerRang: null, eigenerEintrag: null }
    }

    const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gt('highscore', eigenesProfil.highscore)

    return {
        liste: topListeMitFlag,
        eigenerRang: (count ?? 0) + 1,
        eigenerEintrag: { ...eigenesProfil, istIch: true }
    }
}

export async function ladeFreundeRanking(supabase: any, currentUserId?: string) {
    // Absicherung: falls keine gültige ID übergeben wurde, selbst aktiv nachfragen
    let userId = currentUserId

    if (!userId) {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (!currentUser) return []
        userId = currentUser.id
    }

    const { freunde } = await ladeFreundeUndAnfragen(supabase)

    const { data: eigenesProfil, error } = await supabase
        .from('profiles')
        .select('id, username, profilbild_url, highscore, highscore_datum')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Fehler beim Laden des eigenen Profils:', error)
    }

    const alleEintraege = [...freunde, eigenesProfil]
        .filter(Boolean)
        .map((eintrag: any) => ({
            ...eintrag,
            istIch: eintrag.id === userId
        }))
        .sort((a: any, b: any) => (b.highscore ?? 0) - (a.highscore ?? 0))

    return alleEintraege
}