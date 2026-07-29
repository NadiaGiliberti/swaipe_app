// app/composables/useGame.ts
export interface Spielkarte {
    id: number
    kategorie: string
    datei_url: string
    herkunft: string
    content_type: string
    stil: string
    schwierigkeit_aktuell: number
}

export async function ladeSpielkarten(supabase: any, kategorie: string | null, anzahl: number): Promise<Spielkarte[]> {
    let query = supabase
        .from('spieldaten_live')
        .select('id, kategorie, datei_url, herkunft, content_type, stil, schwierigkeit_aktuell')

    if (kategorie) {
        query = query.eq('kategorie', kategorie)
    }

    const { data, error } = await query

    if (error || !data) return []

    const gemischt = [...data].sort(() => Math.random() - 0.5)
    return gemischt.slice(0, anzahl)
}

// Baut eine Reihenfolge, die ECHT und KI abwechselnd ausspielt.
// KI wird ab startMinSchwierigkeit gefiltert und aufsteigend sortiert.
export function baueAusgeglicheneReihenfolge(karten: Spielkarte[], startMinSchwierigkeit = 1): Spielkarte[] {
    const echt = karten.filter((k: Spielkarte) => k.herkunft === 'ECHT')
    let ki = karten.filter((k: Spielkarte) => k.herkunft === 'KI' && (k.schwierigkeit_aktuell ?? 2) >= startMinSchwierigkeit)

    if (ki.length === 0) {
        ki = karten.filter((k: Spielkarte) => k.herkunft === 'KI')
    }

    const kiSortiert = [...ki].sort((a: Spielkarte, b: Spielkarte) => {
        const diff = (a.schwierigkeit_aktuell ?? 2) - (b.schwierigkeit_aktuell ?? 2)
        if (diff !== 0) return diff
        return Math.random() - 0.5
    })

    const echtGemischt = [...echt].sort(() => Math.random() - 0.5)

    const ergebnis: Spielkarte[] = []
    let ei = 0
    let kiI = 0

    while (ei < echtGemischt.length || kiI < kiSortiert.length) {
        if (ei < echtGemischt.length) {
            ergebnis.push(echtGemischt[ei]!)
            ei++
        }
        if (kiI < kiSortiert.length) {
            ergebnis.push(kiSortiert[kiI]!)
            kiI++
        }
    }

    return ergebnis
}

export function baueErschwerteReihenfolge(restKarten: Spielkarte[], minSchwierigkeit: number): Spielkarte[] {
    const echt = restKarten.filter((k: Spielkarte) => k.herkunft === 'ECHT')
    let ki = restKarten.filter((k: Spielkarte) => k.herkunft === 'KI' && (k.schwierigkeit_aktuell ?? 2) >= minSchwierigkeit)

    if (ki.length === 0) {
        ki = restKarten.filter((k: Spielkarte) => k.herkunft === 'KI')
    }

    return baueAusgeglicheneReihenfolge([...echt, ...ki])
}

// Userlevel (1-10) -> Startschwierigkeit für KI-Karten (1-5)
export function levelZuStartSchwierigkeit(level: number): number {
    return Math.min(1 + Math.floor((level - 1) / 2), 5)
}

// Level-Multiplikator: höheres Level = mehr Punkte pro richtiger Antwort (gilt für ECHT + KI)
export function levelMultiplikator(level: number): number {
    return 1 + (level - 1) * 0.05
}

// Schwierigkeits-Multiplikator: schwerere Karten geben mehr Punkte
export function schwierigkeitMultiplikator(schwierigkeit: number): number {
    return 0.7 + ((schwierigkeit ?? 2) - 1) * 0.15
}

export function berechneKartenPunkte(schwierigkeit: number, userLevel: number): number {
    const basis = 100
    return Math.round(basis * schwierigkeitMultiplikator(schwierigkeit) * levelMultiplikator(userLevel))
}

export async function speichereAntwort(supabase: any, spielId: number, warRichtig: boolean) {
    await supabase.rpc('record_answer', { spiel_id: spielId, war_richtig: warRichtig })
}