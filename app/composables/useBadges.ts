export interface BadgeKontext {
    perfekteRunde: boolean
    besteSerie: number
    levels: { BILD: number, VIDEO: number, AUDIO: number, MUSIK: number }
    highscore: number
    gespielteRunden: number
}

export async function pruefeUndVergebeBadges(supabase: any, userId: string, kontext: BadgeKontext) {
    const codes: string[] = []

    if (kontext.gespielteRunden === 1) codes.push('ERSTER_SIEG')
    if (kontext.perfekteRunde) codes.push('PERFEKTIONIST')
    if (kontext.besteSerie >= 10) codes.push('KOMBO_MEISTER')
    if (kontext.besteSerie >= 20) codes.push('UNSTOPPBAR')

    if (kontext.levels.BILD >= 5) codes.push('BILD_EXPERTE')
    if (kontext.levels.VIDEO >= 5) codes.push('VIDEO_EXPERTE')
    if (kontext.levels.AUDIO >= 5) codes.push('AUDIO_EXPERTE')
    if (kontext.levels.MUSIK >= 5) codes.push('MUSIK_EXPERTE')

    if (kontext.levels.BILD >= 10) codes.push('BILD_MEISTER')
    if (kontext.levels.VIDEO >= 10) codes.push('VIDEO_MEISTER')
    if (kontext.levels.AUDIO >= 10) codes.push('AUDIO_MEISTER')
    if (kontext.levels.MUSIK >= 10) codes.push('MUSIK_MEISTER')

    const alleFuenf = kontext.levels.BILD >= 5 && kontext.levels.VIDEO >= 5 && kontext.levels.AUDIO >= 5 && kontext.levels.MUSIK >= 5
    if (alleFuenf) codes.push('ALLROUNDER')

    const alleZehn = kontext.levels.BILD === 10 && kontext.levels.VIDEO === 10 && kontext.levels.AUDIO === 10 && kontext.levels.MUSIK === 10
    if (alleZehn) codes.push('MEISTER')

    if (kontext.highscore >= 10000) codes.push('PUNKTEJAEGER')

    if (codes.length === 0) return []

    const { data: badges } = await supabase
        .from('badges')
        .select('id, code, name, beschreibung, icon')
        .in('code', codes)

    if (!badges || badges.length === 0) return []

    const { data: bereitsVorhanden } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', userId)
        .in('badge_id', badges.map((b: any) => b.id))

    const vorhandenIds = new Set((bereitsVorhanden ?? []).map((v: any) => v.badge_id))
    const neueBadges = badges.filter((b: any) => !vorhandenIds.has(b.id))

    if (neueBadges.length === 0) return []

    const rows = neueBadges.map((b: any) => ({ user_id: userId, badge_id: b.id }))
    await supabase.from('user_badges').insert(rows)

    return neueBadges
}

export async function ladeBadgesMitStatus(supabase: any, userId: string) {
    const { data: alleBadges } = await supabase
        .from('badges')
        .select('id, code, name, beschreibung, icon')
        .order('id', { ascending: true })

    const { data: eigene } = await supabase
        .from('user_badges')
        .select('badge_id, erreicht_am')
        .eq('user_id', userId)

    const erreichtMap = new Map((eigene ?? []).map((e: any) => [e.badge_id, e.erreicht_am]))

    return (alleBadges ?? []).map((b: any) => ({
        ...b,
        erreicht: erreichtMap.has(b.id),
        erreicht_am: erreichtMap.get(b.id) ?? null
    }))
}