
export const presetThemes = [
    { name: 'Default', colors: ['#f898c1', '#5aeaa2', '#920e36'] },
    { name: 'Darkmode', colors: ['#2b2d6e', '#e88bb3', '#0d0d1a'] },
]

export function applyTheme(colors: (string | null | undefined)[]) {
    if (!colors || colors.length < 3) return
    if (!colors[0] || !colors[1] || !colors[2]) return

    document.documentElement.style.setProperty('--background-1', colors[0] ?? '')
    document.documentElement.style.setProperty('--background-2', colors[1] ?? '')
    document.documentElement.style.setProperty('--background-3', colors[2] ?? '')
}

export async function loadAndApplyUserTheme(supabase: any, userId: string | undefined | null) {
    if (!userId) return

    const { data, error } = await supabase
        .from('profiles')
        .select('theme_background_1, theme_background_2, theme_background_3')
        .eq('id', userId)
        .single()

    if (error || !data) return

    applyTheme([data.theme_background_1, data.theme_background_2, data.theme_background_3])
}