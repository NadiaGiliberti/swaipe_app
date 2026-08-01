// app/composables/useFreunde.ts
export async function sucheUser(supabase: any, username: string) {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, profilbild_url')
        .ilike('username', `%${username}%`)
        .neq('id', currentUser.id)
        .limit(10)

    if (error) return []
    return data
}

export async function sendeFreundschaftsanfrage(supabase: any, empfaengerId: string) {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    return await supabase
        .from('freundschaften')
        .insert({
            anfragender_id: currentUser.id,
            empfaenger_id: empfaengerId,
            status: 'AUSSTEHEND'
        })
}

export async function akzeptiereAnfrage(supabase: any, freundschaftId: number) {
    return await supabase
        .from('freundschaften')
        .update({ status: 'AKZEPTIERT' })
        .eq('id', freundschaftId)
}

export async function lehneAnfrageAb(supabase: any, freundschaftId: number) {
    return await supabase
        .from('freundschaften')
        .delete()
        .eq('id', freundschaftId)
}

export async function entferneFreund(supabase: any, freundschaftId: number) {
    return await supabase
        .from('freundschaften')
        .delete()
        .eq('id', freundschaftId)
}

export async function ladeFreundeUndAnfragen(supabase: any) {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('freundschaften')
        .select(`
            id,
            status,
            anfragender_id,
            empfaenger_id,
            empfaenger_gesehen,
            anfragender_gesehen,
            anfragender:profiles!freundschaften_anfragender_id_fkey(id, username, profilbild_url, highscore, highscore_datum),
            empfaenger:profiles!freundschaften_empfaenger_id_fkey(id, username, profilbild_url, highscore, highscore_datum)
        `)
        .or(`anfragender_id.eq.${currentUser.id},empfaenger_id.eq.${currentUser.id}`)

    if (error || !data) return { freunde: [], eingehendeAnfragen: [], ausgehendeAnfragen: [] }

    const freunde = []
    const eingehendeAnfragen = []
    const ausgehendeAnfragen = []

    for (const eintrag of data) {
        const istAnfragender = eintrag.anfragender_id === currentUser.id
        const andererUser = istAnfragender ? eintrag.empfaenger : eintrag.anfragender

        if (eintrag.status === 'AKZEPTIERT') {
            // "neu" bedeutet: gerade erst akzeptiert und vom jeweiligen User noch nicht gesehen
            const istNeu = istAnfragender ? !eintrag.anfragender_gesehen : false
            freunde.push({ freundschaftId: eintrag.id, istNeu, ...andererUser })
        } else if (eintrag.status === 'AUSSTEHEND') {
            if (istAnfragender) {
                ausgehendeAnfragen.push({ freundschaftId: eintrag.id, ...andererUser })
            } else {
                eingehendeAnfragen.push({ freundschaftId: eintrag.id, istNeu: !eintrag.empfaenger_gesehen, ...andererUser })
            }
        }
    }

    return { freunde, eingehendeAnfragen, ausgehendeAnfragen }
}

// Zählt alles, was der aktuelle User noch nicht gesehen hat -> für den Punkt am Menü-Icon
export async function zaehleUngeseheneFreundschaftsereignisse(supabase: any) {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return 0

    const { count: eingehend } = await supabase
        .from('freundschaften')
        .select('id', { count: 'exact', head: true })
        .eq('empfaenger_id', currentUser.id)
        .eq('status', 'AUSSTEHEND')
        .eq('empfaenger_gesehen', false)

    const { count: akzeptiert } = await supabase
        .from('freundschaften')
        .select('id', { count: 'exact', head: true })
        .eq('anfragender_id', currentUser.id)
        .eq('status', 'AKZEPTIERT')
        .eq('anfragender_gesehen', false)

    return (eingehend ?? 0) + (akzeptiert ?? 0)
}

// Markiert alles als gesehen -> wird aufgerufen, sobald der User die Freunde-Seite besucht
export async function markiereFreundschaftenAlsGesehen(supabase: any) {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return

    await supabase
        .from('freundschaften')
        .update({ empfaenger_gesehen: true })
        .eq('empfaenger_id', currentUser.id)
        .eq('status', 'AUSSTEHEND')
        .eq('empfaenger_gesehen', false)

    await supabase
        .from('freundschaften')
        .update({ anfragender_gesehen: true })
        .eq('anfragender_id', currentUser.id)
        .eq('status', 'AKZEPTIERT')
        .eq('anfragender_gesehen', false)
}