<script setup>
const supabase = useSupabaseClient()
const { volume, loadVolume, setVolume } = useVolume()

const profil = ref(null)
const loading = ref(true)
const errorMsg = ref('')

const showThemeModal = ref(false)
const themeSaving = ref(false)
const themeError = ref('')

const customColor1 = ref('#f898c1')
const customColor2 = ref('#5aeaa2')
const customColor3 = ref('#920e36')

async function ladeProfil() {
    loading.value = true
    errorMsg.value = ''

    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

    if (userError || !currentUser) {
        errorMsg.value = 'Nicht eingeloggt.'
        loading.value = false
        return
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

    if (error) {
        errorMsg.value = error.message
    } else {
        profil.value = data
        customColor1.value = data.theme_background_1 || '#f898c1'
        customColor2.value = data.theme_background_2 || '#5aeaa2'
        customColor3.value = data.theme_background_3 || '#920e36'
    }

    loading.value = false
}

onMounted(() => {
    loadVolume()
    ladeProfil()
})

function closeThemeModal() {
    showThemeModal.value = false
    themeError.value = ''
}

async function saveThemeColors(colors) {
    themeSaving.value = true
    themeError.value = ''

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('profiles')
        .update({
            theme_background_1: colors[0],
            theme_background_2: colors[1],
            theme_background_3: colors[2]
        })
        .eq('id', currentUser.id)

    themeSaving.value = false

    if (error) {
        themeError.value = error.message
        return
    }

    applyTheme(colors)

    profil.value.theme_background_1 = colors[0]
    profil.value.theme_background_2 = colors[1]
    profil.value.theme_background_3 = colors[2]
}

async function choosePreset(theme) {
    await saveThemeColors(theme.colors)
    showThemeModal.value = false
}

async function saveCustomTheme() {
    await saveThemeColors([customColor1.value, customColor2.value, customColor3.value])
    showThemeModal.value = false
}
</script>

<template>
    <main class="container_main">

        <h1>EINSTELLUNGEN</h1>

        <div class="container_lautstaerke">
            <img src="/icons/sound_on_icon.svg" alt="Lautstärke an">
            <input
                type="range"
                min="0"
                max="100"
                class="slider_lautstaerke"
                :value="volume"
                @input="setVolume(Number($event.target.value))"
            >
            <img src="/icons/sound_off_icon.svg" alt="Lautstärke aus">
        </div>

        <div class="container_aktionen">
            <button class="aktion" @click="showThemeModal = true">
                THEME
            </button>
            <button class="aktion">
                PUSH-NACHRICHTEN
                <span class="aktion_hinweis">(zb. Highscore geschlagen, come back etc.)</span>
            </button>
            <button class="aktion">
                DATENSCHUTZ
            </button>
            <button class="aktion">
                AGBs
            </button>
        </div>

        <buttonZurueck />

        <ModalBase :open="showThemeModal" title="THEME WÄHLEN" @close="closeThemeModal">
            <div class="container_themes">
                <button
                    v-for="theme in presetThemes"
                    :key="theme.name"
                    class="theme_option"
                    :disabled="themeSaving"
                    @click="choosePreset(theme)"
                >
                    <div class="theme_swatches">
                        <span :style="{ background: theme.colors[0] }"></span>
                        <span :style="{ background: theme.colors[1] }"></span>
                        <span :style="{ background: theme.colors[2] }"></span>
                    </div>
                    <span class="theme_name">{{ theme.name }}</span>
                </button>
            </div>

            <div class="container_custom_theme">
                <span class="theme_name">EIGENE FARBEN</span>

                <div class="container_color_pickers">
                    <input type="color" v-model="customColor1">
                    <input type="color" v-model="customColor2">
                    <input type="color" v-model="customColor3">
                </div>

                <button class="button" :disabled="themeSaving" @click="saveCustomTheme">
                    {{ themeSaving ? 'SPEICHERT...' : 'EIGENE FARBEN ÜBERNEHMEN' }}
                </button>
            </div>

            <p v-if="themeError" class="error_text">{{ themeError }}</p>
        </ModalBase>

    </main>
</template>

<style>
.container_lautstaerke {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 80%;
    margin-top: 5vh;
}

.container_lautstaerke img {
    width: 24px;
}

.slider_lautstaerke {
    flex: 1;
    accent-color: var(--background-3);
}

.container_aktionen {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
    margin-top: 10vh;
    width: 80%;
}

.aktion {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 6vw;
    text-align: left;
}

.aktion_hinweis {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 2.8vw;
    display: block;
}

.container_themes {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
}

.theme_option {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: none;
    border: 1px solid var(--braun);
    border-radius: 12px;
    padding: 0.7rem 1rem;
    cursor: pointer;
}

.theme_swatches {
    display: flex;
    gap: 4px;
}

.theme_swatches span {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: block;
}

.theme_name {
    font-family: 'DotGothic16', sans-serif;
    font-size: 1rem;
}

.container_custom_theme {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--braun);
}

.container_color_pickers {
    display: flex;
    gap: 1rem;
}

.container_color_pickers input[type="color"] {
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
}
</style>