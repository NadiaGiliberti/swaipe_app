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

export type MinSchwierigkeitResolver = number | ((karte: Spielkarte) => number)

function resolveMin(resolver: MinSchwierigkeitResolver, karte: Spielkarte): number {
    return typeof resolver === 'function' ? resolver(karte) : resolver
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

// Wie stark die Position innerhalb der gleichmäßigen Verteilung zufällig
// verschoben werden darf, relativ zum kleineren der beiden Fortschritts-Schritte.
// 0 = starr nach Anteil verteilt (z.B. exaktes E,K,E,K bei 50/50), höhere Werte
// = natürlicher wirkende Streuung. 1 ist ein guter Mittelwert (siehe Tests).
const VERTEILUNGS_JITTER = 1

// Mischt zwei nach Herkunft getrennte Kartenlisten so zusammen, dass beide
// Herkünfte gleichmäßig über die gesamte Reihenfolge verteilt sind (proportional
// zu ihrer jeweiligen Anzahl), statt stur 1:1 abzuwechseln oder eine Gruppe erst
// komplett auszuspielen. Ein kleiner Zufalls-Jitter sorgt dafür, dass es nicht wie
// ein starres Muster wirkt, ohne dass eine Gruppe vorzeitig "aufgebraucht" wird
// (was sonst am Ende zu einer langen Kette der übrig gebliebenen Gruppe führt).
function interleaveGewichtet(echt: Spielkarte[], ki: Spielkarte[]): Spielkarte[] {
    const ergebnis: Spielkarte[] = []
    let ei = 0
    let kiI = 0

    const echtSchritt = echt.length > 0 ? 1 / echt.length : Infinity
    const kiSchritt = ki.length > 0 ? 1 / ki.length : Infinity
    const minSchritt = Math.min(echtSchritt, kiSchritt)

    while (ei < echt.length || kiI < ki.length) {
        const jitter = (Math.random() - 0.5) * VERTEILUNGS_JITTER * minSchritt
        const echtFortschritt = ei < echt.length ? (ei + 1) * echtSchritt + jitter : Infinity
        const kiFortschritt = kiI < ki.length ? (kiI + 1) * kiSchritt - jitter : Infinity

        if (echtFortschritt <= kiFortschritt) {
            ergebnis.push(echt[ei]!)
            ei++
        } else {
            ergebnis.push(ki[kiI]!)
            kiI++
        }
    }

    return ergebnis
}

// Baut eine Reihenfolge, die ECHT und KI gemischt ausspielt (nicht starr abwechselnd).
// minSchwierigkeit kann eine feste Zahl sein, oder eine Funktion pro Karte
// (für kategoriespezifische Startschwierigkeit).
export function baueAusgeglicheneReihenfolge(karten: Spielkarte[], minSchwierigkeit: MinSchwierigkeitResolver = 1): Spielkarte[] {
    const echt = karten.filter((k: Spielkarte) => k.herkunft === 'ECHT')
    let ki = karten.filter((k: Spielkarte) => k.herkunft === 'KI' && (k.schwierigkeit_aktuell ?? 2) >= resolveMin(minSchwierigkeit, k))

    if (ki.length === 0) {
        ki = karten.filter((k: Spielkarte) => k.herkunft === 'KI')
    }

    // KI-Karten bleiben nach Schwierigkeit aufsteigend vorsortiert, damit die
    // Schwierigkeitsprogression innerhalb der KI-Karten erhalten bleibt.
    const kiSortiert = [...ki].sort((a: Spielkarte, b: Spielkarte) => {
        const diff = (a.schwierigkeit_aktuell ?? 2) - (b.schwierigkeit_aktuell ?? 2)
        if (diff !== 0) return diff
        return Math.random() - 0.5
    })

    const echtGemischt = [...echt].sort(() => Math.random() - 0.5)

    return interleaveGewichtet(echtGemischt, kiSortiert)
}

export function baueErschwerteReihenfolge(restKarten: Spielkarte[], minSchwierigkeit: number): Spielkarte[] {
    const echt = restKarten.filter((k: Spielkarte) => k.herkunft === 'ECHT')
    let ki = restKarten.filter((k: Spielkarte) => k.herkunft === 'KI' && (k.schwierigkeit_aktuell ?? 2) >= minSchwierigkeit)

    if (ki.length === 0) {
        ki = restKarten.filter((k: Spielkarte) => k.herkunft === 'KI')
    }

    return baueAusgeglicheneReihenfolge([...echt, ...ki])
}

// Kategorie (BILD/VIDEO/AUDIO/MUSIK) -> passende profiles-Spalte
export const KATEGORIE_LEVEL_SPALTE: Record<string, string> = {
    BILD: 'level_bild',
    VIDEO: 'level_video',
    AUDIO: 'level_audio',
    MUSIK: 'level_musik',
}

// Userlevel (1-10) -> Startschwierigkeit für KI-Karten (1-5)
export function levelZuStartSchwierigkeit(level: number): number {
    return Math.min(1 + Math.floor((level - 1) / 2), 5)
}

// Level-Multiplikator: höheres Level = mehr Punkte pro richtiger Antwort
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
// Gesamtlevel wird nicht separat gespeichert, sondern aus den 4 Kategorie-Leveln berechnet
export function berechneGesamtlevel(levels: { BILD: number, VIDEO: number, AUDIO: number, MUSIK: number }): number {
    const werte = [levels.BILD, levels.VIDEO, levels.AUDIO, levels.MUSIK]
    const durchschnitt = werte.reduce((sum, w) => sum + w, 0) / werte.length
    return Math.round(durchschnitt)
}