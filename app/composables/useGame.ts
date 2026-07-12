// app/composables/useGame.ts
export interface Spielkarte {
    id: number
    kategorie: string
    datei_url: string
    herkunft: string
    content_type: string
    stil: string
}

export async function ladeSpielkarten(supabase: any, kategorie: string | null, anzahl: number): Promise<Spielkarte[]> {
    let query = supabase
        .from('spieldaten_live')
        .select('id, kategorie, datei_url, herkunft, content_type, stil')

    if (kategorie) {
        query = query.eq('kategorie', kategorie)
    }

    const { data, error } = await query.limit(50)

    if (error || !data) return []

    // Zufällig mischen und auf gewünschte Anzahl kürzen
    const gemischt = [...data].sort(() => Math.random() - 0.5)
    return gemischt.slice(0, anzahl)
}

export async function speichereAntwort(supabase: any, spielId: number, warRichtig: boolean) {
    await supabase.rpc('record_answer', { spiel_id: spielId, war_richtig: warRichtig })
}