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
            anfragender:profiles!freundschaften_anfragender_id_fkey(id, username, profilbild_url),
            empfaenger:profiles!freundschaften_empfaenger_id_fkey(id, username, profilbild_url)
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
            freunde.push({ freundschaftId: eintrag.id, ...andererUser })
        } else if (eintrag.status === 'AUSSTEHEND') {
            if (istAnfragender) {
                ausgehendeAnfragen.push({ freundschaftId: eintrag.id, ...andererUser })
            } else {
                eingehendeAnfragen.push({ freundschaftId: eintrag.id, ...andererUser })
            }
        }
    }

    return { freunde, eingehendeAnfragen, ausgehendeAnfragen }
}