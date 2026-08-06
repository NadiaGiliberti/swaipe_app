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
const customTextMode = ref('dunkel') // 'dunkel' oder 'hell'

const volumeVorMute = ref(40)

const showMuteHinweisModal = ref(false)
const MUTE_HINWEIS_KEY = 'swaipe_mute_hinweis_gesehen'

const soundIcon = computed(() => {
    return volume.value === 0 ? '/icons/sound_off_icon.svg' : '/icons/sound_on_icon.svg'
})

watch(volume, (neu, alt) => {
    if (neu === 0 && alt > 0 && !sessionStorage.getItem(MUTE_HINWEIS_KEY)) {
        showMuteHinweisModal.value = true
        sessionStorage.setItem(MUTE_HINWEIS_KEY, 'true')
    }
})

function toggleMute() {
    if (volume.value === 0) {
        setVolume(volumeVorMute.value > 0 ? volumeVorMute.value : 40)
    } else {
        volumeVorMute.value = volume.value
        setVolume(0)
    }
}

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
        customTextMode.value = data.theme_text_schwarz === '#ffffff' ? 'hell' : 'dunkel'
    }

    loading.value = false
}

onMounted(() => {
    loadVolume()
    if (volume.value > 0) {
        volumeVorMute.value = volume.value
    }
    ladeProfil()
})

function closeThemeModal() {
    showThemeModal.value = false
    themeError.value = ''
}

function closeMuteHinweisModal() {
    showMuteHinweisModal.value = false
}

async function saveTheme(colors, textDunkel, textHell, textSchwarz) {
    themeSaving.value = true
    themeError.value = ''

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('profiles')
        .update({
            theme_background_1: colors[0],
            theme_background_2: colors[1],
            theme_background_3: colors[2],
            theme_background_4: colors[3] ?? null,
            theme_text_dunkel: textDunkel,
            theme_text_hell: textHell,
            theme_text_schwarz: textSchwarz
        })
        .eq('id', currentUser.id)

    themeSaving.value = false

    if (error) {
        themeError.value = error.message
        return
    }

    applyTheme(colors, textDunkel, textHell, textSchwarz)
    speichereThemeCookie(colors, textDunkel, textHell, textSchwarz)

    profil.value.theme_background_1 = colors[0]
    profil.value.theme_background_2 = colors[1]
    profil.value.theme_background_3 = colors[2]
    profil.value.theme_background_4 = colors[3] ?? null
    profil.value.theme_text_dunkel = textDunkel
    profil.value.theme_text_hell = textHell
    profil.value.theme_text_schwarz = textSchwarz
}

async function choosePreset(theme) {
    await saveTheme(theme.colors, theme.textDunkel, theme.textHell, theme.textSchwarz)
    showThemeModal.value = false
}

async function saveCustomTheme() {
    const istHell = customTextMode.value === 'hell'

    const textDunkel = istHell ? '#ffffff' : '#560000'
    const textHell = istHell ? '#000000' : '#ffffff'
    const textSchwarz = istHell ? '#ffffff' : '#000000'

    await saveTheme(
        [customColor1.value, customColor2.value, customColor3.value],
        textDunkel,
        textHell,
        textSchwarz
    )
    showThemeModal.value = false
}
</script>

<template>
    <main class="container_main">

        <h1>EINSTELLUNGEN</h1>

        <div class="container_lautstaerke">
            <button class="button_sound_toggle" @click="toggleMute">
                <span class="icon-mask" role="img" aria-label="Lautstärke"
                    :style="{ maskImage: `url(${soundIcon})`, '-webkit-mask-image': `url(${soundIcon})` }"></span>
            </button>
            <input type="range" min="0" max="100" class="slider_lautstaerke" :value="volume"
                @input="setVolume(Number($event.target.value))">
        </div>

        <div class="container_aktionen">
            <button class="aktion" @click="showThemeModal = true">
                THEME
            </button>
            <NuxtLink to="/datenschutz" class="aktion">
                DATENSCHUTZ
            </NuxtLink>
            <NuxtLink to="/agb" class="aktion">
                AGBs
            </NuxtLink>
        </div>

        <buttonZurueck />

        <ModalBase :open="showThemeModal" title="THEME WÄHLEN" @close="closeThemeModal">
            <div class="container_themes">
                <button v-for="theme in presetThemes" :key="theme.name" class="theme_option" :disabled="themeSaving"
                    @click="choosePreset(theme)">
                    <div class="theme_swatches">
                        <span :style="{ background: theme.colors[0] }"></span>
                        <span :style="{ background: theme.colors[1] }"></span>
                        <span :style="{ background: theme.colors[2] }"></span>
                    </div>
                    <span class="theme_name">{{ theme.name }}</span>
                </button>
            </div>

            <div class="container_custom_theme">
                <span class="theme_name">EIGENES DESIGN ZUSAMMENSTELLEN</span>

                <div class="container_color_pickers">
                    <input type="color" v-model="customColor1">
                    <input type="color" v-model="customColor2">
                    <input type="color" v-model="customColor3">
                </div>

                <div class="container_text_toggle">
                    <span class="toggle_label">SCHRIFTFARBE</span>
                    <div class="toggle_buttons">
                        <button type="button" class="toggle_btn"
                            :class="{ toggle_btn_aktiv: customTextMode === 'dunkel' }"
                            @click="customTextMode = 'dunkel'">
                            DUNKEL
                        </button>
                        <button type="button" class="toggle_btn"
                            :class="{ toggle_btn_aktiv: customTextMode === 'hell' }" @click="customTextMode = 'hell'">
                            HELL
                        </button>
                    </div>
                </div>

                <button class="button" :disabled="themeSaving" @click="saveCustomTheme">
                    {{ themeSaving ? 'SPEICHERT...' : 'MEIN DESIGN ÜBERNEHMEN' }}
                </button>
            </div>

            <p v-if="themeError" class="error_text">{{ themeError }}</p>
        </ModalBase>

        <ModalBase :open="showMuteHinweisModal" title="LAUTSTÄRKE" @close="closeMuteHinweisModal">
            <p class="mute_hinweis_text">
                Achtung: <br> das Spiel im Score- und Überlebensmodus enthält auch Audio- und Musik Inhalte. Bei
                ausgeschaltetem Ton kannst du
                diese Inhalte nicht beurteilen.
            </p>

            <button class="button" @click="closeMuteHinweisModal">
                VERSTANDEN
            </button>
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

.button_sound_toggle {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.container_lautstaerke .icon-mask {
    width: 24px;
    display: block;
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
    margin-top: 0;
    color: var(--text-dunkel);
}

/* Hover nur auf Geräten mit echtem Maus-Hover - sonst bleibt der Zustand auf
   Touch-Geräten (v.a. iOS Safari) nach dem Antippen "hängen". */
@media (hover: hover) and (pointer: fine) {
    .aktion:hover {
        color: var(--gelb);
    }
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

/* Runde Farbkacheln, die die Farbe wirklich komplett ausfüllen:
   input[type=color] hat browserintern ein eigenes "Swatch"-Element mit
   eigenem Padding/Radius - border-radius auf dem input selbst reicht nicht,
   die tatsächliche Farbfläche muss separat angesprochen werden. */
.container_color_pickers input[type="color"] {
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    overflow: hidden;
}

.container_color_pickers input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 50%;
}

.container_color_pickers input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
}

.container_color_pickers input[type="color"]::-moz-color-swatch {
    border: none;
    border-radius: 50%;
}

.container_text_toggle {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.toggle_label {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.85rem;
}

.toggle_buttons {
    display: flex;
    gap: 0.5rem;
}

.toggle_btn {
    flex: 1;
    padding: 0.5rem;
    border-radius: 10px;
    border: 1px solid var(--braun);
    background: none;
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
}

.toggle_btn_aktiv {
    background: var(--braun);
    color: white;
}

.mute_hinweis_text {
    margin-top: 1rem;
    margin-bottom: 2rem;

}

@media (min-width: 768px) {

    .container_lautstaerke,
    .container_aktionen {
        width: 100%;
        max-width: 420px;
    }

    .aktion {
        font-size: 1.8rem;
    }

    .theme_name {
        font-size: 1.1rem;
    }
}

@media (min-width: 1024px) {

    .container_lautstaerke,
    .container_aktionen {
        max-width: 460px;
    }

    .aktion {
        font-size: 2rem;
    }
}
</style>