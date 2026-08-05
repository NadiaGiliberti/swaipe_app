// app/composables/useTheme.ts
export const presetThemes = [
    { name: 'SWAIPE', colors: ['#f898c1', '#5aeaa2', '#920e36'], textDunkel: '#560000', textSchwarz: '#000000', textHell: '#ffffff' },
    { name: 'DARKMODE', colors: ['#2b2d6e', '#e88bb3', '#0d0d1a', '#e8a86b'], textDunkel: '#ffffff', textSchwarz: '#ffffff', textHell: '#000000' },
]

export function applyTheme(
    colors: (string | null | undefined)[],
    textDunkel?: string,
    textHell?: string,
    textSchwarz?: string
) {
    if (!colors || colors.length < 3) return
    if (!colors[0] || !colors[1] || !colors[2]) return

    document.documentElement.style.setProperty('--background-1', colors[0] ?? '')
    document.documentElement.style.setProperty('--background-2', colors[1] ?? '')
    document.documentElement.style.setProperty('--background-3', colors[2] ?? '')

    // Die 4. Farbe wird nur für den Darkmode-Verlauf gebraucht. Sobald eine
    // vierte Farbe mitgegeben wird, schaltet main.css über die
    // "theme-darkmode"-Klasse auf den alternativen 4-Farben-Verlauf um.
    // Default- und eigene 3-Farben-Themes bleiben davon komplett unberührt,
    // da dort colors[3] schlicht nicht existiert.
    if (colors[3]) {
        document.documentElement.style.setProperty('--background-4', colors[3] ?? '')
        document.documentElement.classList.add('theme-darkmode')
    } else {
        document.documentElement.classList.remove('theme-darkmode')
    }

    if (textDunkel) {
        document.documentElement.style.setProperty('--text-dunkel', textDunkel)
    }
    if (textHell) {
        document.documentElement.style.setProperty('--text-hell', textHell)
    }
    if (textSchwarz) {
        document.documentElement.style.setProperty('--text-schwarz', textSchwarz)
    }
}

export async function loadAndApplyUserTheme(supabase: any, userId: string | undefined | null) {
    if (!userId) return

    const { data, error } = await supabase
        .from('profiles')
        .select('theme_background_1, theme_background_2, theme_background_3, theme_background_4, theme_text_dunkel, theme_text_hell, theme_text_schwarz')
        .eq('id', userId)
        .single()

    if (error || !data) return

    applyTheme(
        [data.theme_background_1, data.theme_background_2, data.theme_background_3, data.theme_background_4],
        data.theme_text_dunkel,
        data.theme_text_hell,
        data.theme_text_schwarz
    )

    speichereThemeCookie(
        [data.theme_background_1, data.theme_background_2, data.theme_background_3, data.theme_background_4],
        data.theme_text_dunkel,
        data.theme_text_hell,
        data.theme_text_schwarz
    )
}

export function speichereThemeCookie(colors: (string | null | undefined)[], textDunkel: string, textHell: string, textSchwarz: string) {
    const cookie = useCookie('swaipe_theme', { maxAge: 60 * 60 * 24 * 365 })
    cookie.value = JSON.stringify({ colors, textDunkel, textHell, textSchwarz })
}

export function ladeThemeAusCookie() {
    const cookie = useCookie('swaipe_theme')
    if (!cookie.value) return null
    try {
        return JSON.parse(cookie.value as string)
    } catch {
        return null
    }
}