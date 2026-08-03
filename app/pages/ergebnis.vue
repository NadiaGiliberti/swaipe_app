<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const ergebnis = ref(null)
const top3Freunde = ref([])
const ladeFreundeLoading = ref(true)
const zeigePerfekteRunde = ref(false)

const perzentilBesser = ref(null)
const communityGenauigkeit = ref(null)
const eigenerUeberlebensHighscore = ref(null)

function persistErgebnis() {
    if (ergebnis.value) {
        sessionStorage.setItem('swaipe_ergebnis', JSON.stringify(ergebnis.value))
    }
}

function nochmal() {
    if (!ergebnis.value) {
        navigateTo('/kategorien')
        return
    }

    if (ergebnis.value.modus === 'score') {
        navigateTo('/spiel?modus=score')
    } else if (ergebnis.value.modus === 'ueberleben') {
        navigateTo('/spiel?modus=ueberleben')
    } else if (ergebnis.value.kategorie) {
        navigateTo(`/spiel?modus=uebung&kategorie=${ergebnis.value.kategorie}`)
    } else {
        navigateTo('/kategorien')
    }
}

function schliesseBadgePopup() {
    ergebnis.value.neueBadges = []
    persistErgebnis()
}

async function ladeFreundeVergleich() {
    if (!ergebnis.value) return

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return

    if (ergebnis.value.modus === 'score') {
        const ranking = await ladeFreundeRanking(supabase, currentUser.id)
        top3Freunde.value = ranking.slice(0, 3)
        return
    }

    if (ergebnis.value.modus === 'ueberleben') {
        const { data: freundschaften } = await supabase
            .from('freundschaften')
            .select('anfragender_id, empfaenger_id')
            .eq('status', 'AKZEPTIERT')
            .or(`anfragender_id.eq.${currentUser.id},empfaenger_id.eq.${currentUser.id}`)

        const freundeIds = (freundschaften || []).map(f =>
            f.anfragender_id === currentUser.id ? f.empfaenger_id : f.anfragender_id
        )

        const { data: profile } = await supabase
            .from('profiles')
            .select('id, username, profilbild_url, ueberlebens_highscore, ueberlebens_highscore_datum')
            .in('id', [...freundeIds, currentUser.id])

        if (profile) {
            top3Freunde.value = profile
                .map(p => ({
                    id: p.id,
                    username: p.username,
                    profilbild_url: p.profilbild_url,
                    highscore: p.ueberlebens_highscore,
                    highscore_datum: p.ueberlebens_highscore_datum,
                    istIch: p.id === currentUser.id
                }))
                .sort((a, b) => (b.highscore ?? 0) - (a.highscore ?? 0))
                .slice(0, 3)
        }
    }
}

async function ladeEigenerUeberlebensHighscore() {
    if (!ergebnis.value || ergebnis.value.modus !== 'ueberleben') return

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return

    const { data } = await supabase
        .from('profiles')
        .select('ueberlebens_highscore')
        .eq('id', currentUser.id)
        .single()

    if (data) {
        eigenerUeberlebensHighscore.value = data.ueberlebens_highscore ?? 0
    }
}

async function ladePerzentil() {
    if (!ergebnis.value || (ergebnis.value.modus !== 'score' && ergebnis.value.modus !== 'ueberleben')) return

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    const spalte = ergebnis.value.modus === 'score' ? 'highscore' : 'ueberlebens_highscore'

    const { data, error } = await supabase
        .from('profiles')
        .select(`id, ${spalte}`)
        .eq('aktiv', true)
        .gt(spalte, 0)

    if (!error && data && data.length > 0) {
        const andere = data.filter(p => p.id !== currentUser?.id)
        const eigenerWert = ergebnis.value.modus === 'score' ? ergebnis.value.punkte : ergebnis.value.korrekt

        if (andere.length > 0) {
            const besser = andere.filter(p => p[spalte] > eigenerWert).length
            perzentilBesser.value = Math.round((besser / andere.length) * 100)
        }
    }
}

async function ladeCommunityGenauigkeit() {
    if (!ergebnis.value || ergebnis.value.modus !== 'uebung' || !ergebnis.value.kategorie) return

    const { data, error } = await supabase
        .from('spieldaten')
        .select('counter_richtig, used_counter')
        .eq('kategorie', ergebnis.value.kategorie)
        .gte('used_counter', 10)

    if (!error && data && data.length > 0) {
        const summeRichtig = data.reduce((summe, d) => summe + d.counter_richtig, 0)
        const summeVersuche = data.reduce((summe, d) => summe + d.used_counter, 0)

        if (summeVersuche > 0) {
            communityGenauigkeit.value = Math.round((summeRichtig / summeVersuche) * 100)
        }
    }
}

onMounted(async () => {
    const gespeichert = sessionStorage.getItem('swaipe_ergebnis')
    if (gespeichert) {
        ergebnis.value = JSON.parse(gespeichert)
    }

    if (ergebnis.value?.perfekteRunde) {
        zeigePerfekteRunde.value = true
        ergebnis.value.perfekteRunde = false
        persistErgebnis()
        setTimeout(() => {
            zeigePerfekteRunde.value = false
        }, 2500)
    }

    if (ergebnis.value?.modus === 'score' || ergebnis.value?.modus === 'ueberleben') {
        await ladeFreundeVergleich()
    }

    await ladeEigenerUeberlebensHighscore()
    await ladePerzentil()
    await ladeCommunityGenauigkeit()

    ladeFreundeLoading.value = false
})

const genauigkeit = computed(() => {
    if (!ergebnis.value || ergebnis.value.gesamt === 0) return 0
    return Math.round((ergebnis.value.korrekt / ergebnis.value.gesamt) * 100)
})
</script>

<template>
    <main class="container_main">

        <template v-if="ergebnis">
            <template v-if="ergebnis.modus === 'score'">
                <h1>{{ ergebnis.punkte.toLocaleString('de-CH') }}</h1>
                <h3>PUNKTE</h3>
            </template>
            <template v-else-if="ergebnis.modus === 'ueberleben'">
                <h1>{{ ergebnis.korrekt }}</h1>
                <h3>ÜBERLEBT</h3>
            </template>
            <template v-else>
                <h1>{{ ergebnis.korrekt }}/{{ ergebnis.gesamt }}</h1>
                <h3>RICHTIG</h3>
            </template>

            <div class="container_stats">
                <h2>STATS</h2>

                <div class="stat_zeile">
                    <span>BESTSERIE</span>
                    <span>{{ ergebnis.modus === 'ueberleben' ? (eigenerUeberlebensHighscore ?? '-') : ergebnis.besteSerie }}</span>
                </div>

                <template v-if="ergebnis.modus !== 'ueberleben'">
                    <div class="stat_zeile">
                        <span>RICHTIG</span>
                        <span>{{ ergebnis.korrekt }}/{{ ergebnis.gesamt }}</span>
                    </div>
                    <div class="stat_zeile">
                        <span>FALSCH</span>
                        <span>{{ ergebnis.falsch }}/{{ ergebnis.gesamt }}</span>
                    </div>
                    <div class="stat_zeile">
                        <span>GENAUIGKEIT</span>
                        <span>{{ genauigkeit }}%</span>
                    </div>
                </template>
            </div>

            <div v-if="(ergebnis.modus === 'score' || ergebnis.modus === 'ueberleben') && perzentilBesser !== null" class="container_perzentil">
                <p>{{ perzentilBesser }}% der Spieler haben einen höheren Highscore erzielt als dieses Ergebnis.</p>
            </div>

            <div v-else-if="ergebnis.modus === 'uebung' && communityGenauigkeit !== null" class="container_perzentil">
                <p>Durchschnittliche Trefferquote aller Spieler in dieser Kategorie: {{ communityGenauigkeit }}%</p>
            </div>

            <div v-if="ergebnis.modus === 'uebung' && ergebnis.falscheKarten && ergebnis.falscheKarten.length > 0"
                class="container_falsche_karten">
                <h2>DAS WAR FALSCH</h2>

                <div v-for="karte in ergebnis.falscheKarten" :key="karte.id" class="falsche_karte_item">
                    <div v-if="karte.kategorie === 'AUDIO' || karte.kategorie === 'MUSIK'" class="falsche_karte_media_audio">
                        <audio :src="karte.datei_url" class="falsche_karte_audio" controls preload="metadata"
                            controlsList="nodownload noplaybackrate" @contextmenu.prevent></audio>
                    </div>
                    <div v-else class="falsche_karte_media">
                        <img v-if="karte.kategorie === 'BILD'" :src="karte.datei_url" class="falsche_karte_bild">
                        <video v-else-if="karte.kategorie === 'VIDEO'" :src="karte.datei_url" class="falsche_karte_bild"
                            controls preload="metadata" playsinline></video>
                    </div>
                    <span class="falsche_karte_label" :class="{ falsche_karte_label_ki: karte.herkunft === 'KI' }">
                        WAR {{ karte.herkunft === 'KI' ? 'KI-GENERIERT' : 'ECHT' }}
                    </span>
                </div>
            </div>

            <div v-if="(ergebnis.modus === 'score' || ergebnis.modus === 'ueberleben') && !ladeFreundeLoading && top3Freunde.length > 0" class="container_freunde_vergleich">
                <h2>FREUNDE</h2>

                <div
                    v-for="(eintrag, index) in top3Freunde"
                    :key="eintrag.id"
                    class="freund_vergleich_item"
                    :class="{ freund_vergleich_item_ich: eintrag.istIch }"
                >
                    <span class="freund_vergleich_nummer">{{ index + 1 }}.</span>
                    <img v-if="eintrag.profilbild_url" :src="eintrag.profilbild_url" class="freund_vergleich_avatar bild_umrandet">
                    <div v-else class="freund_vergleich_avatar avatar_placeholder" role="img" aria-label="Profil"></div>
                    <span class="freund_vergleich_name">
                        {{ eintrag.istIch ? 'DU' : eintrag.username }}
                        <span class="freund_vergleich_datum">am {{ formatDatum(eintrag.highscore_datum) }}</span>
                    </span>
                    <span class="freund_vergleich_score">{{ (eintrag.highscore ?? 0).toLocaleString('de-CH') }}</span>
                </div>
            </div>

            <div class="container_buttons">
                <button class="button button_nochmal" @click="nochmal">NOCHMAL</button>
                <NuxtLink to="/kategorien" class="button_klein button_kategorien_highscores">KATEGORIEN</NuxtLink>
                <NuxtLink v-if="ergebnis.modus !== 'ueberleben'" to="/highscores" class="button_klein button_kategorien_highscores">HIGHSCORES</NuxtLink>
            </div>
        </template>

        <template v-else>
            <p>Kein Ergebnis gefunden.</p>
            <buttonZurueck />
        </template>

        <Transition name="toast">
            <div v-if="zeigePerfekteRunde" class="perfekte_runde_toast">
                PERFEKTE RUNDE! +500
            </div>
        </Transition>

        <Transition name="fade">
            <div v-if="ergebnis?.neueBadges && ergebnis.neueBadges.length > 0" class="badge_popup">
                <div class="badge_popup_inner">
                    <h3>NEUE ABZEICHEN!</h3>
                    <div v-for="badge in ergebnis.neueBadges" :key="badge.id" class="badge_popup_item">
                        <img :src="badge.icon" class="badge_popup_icon" :alt="badge.name">
                        <span class="badge_popup_name">{{ badge.name }}</span>
                        <span class="badge_popup_beschreibung">{{ badge.beschreibung }}</span>
                    </div>
                    <button class="button_klein" id="badge_weiter_button" @click="schliesseBadgePopup">OK</button>
                </div>
            </div>
        </Transition>

    </main>
</template>

<style>
.container_stats {
    width: 80%;
    margin-top: 3rem;
}

.stat_zeile {
    display: flex;
    justify-content: space-between;
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 5vw;
    color: var(--text-dunkel);
    margin-top: 0.5rem;
}

.container_freunde_vergleich {
    width: 80%;
    margin-top: 3rem;
}

.container_perzentil {
    width: 80%;
    margin-top: 1.5rem;
    text-align: center;
}

.container_perzentil p {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 4.5vw;
    color: var(--text-dunkel);
}

.container_falsche_karten {
    width: 85%;
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.falsche_karte_item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.2rem;
}

.falsche_karte_media {
    width: 100%;
    max-width: 320px;
    aspect-ratio: 3 / 4;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.15);
}

.falsche_karte_bild {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.falsche_karte_media_audio {
    width: 100%;
    max-width: 320px;
}

.falsche_karte_audio {
    width: 100%;
    display: block;
}

.falsche_karte_label {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.85rem;
    color: var(--background-2);
    margin-top: 0.5rem;
    letter-spacing: 0.03rem;
}

.falsche_karte_label_ki {
    color: var(--background-3);
}

.freund_vergleich_item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-top: 0.8rem;
}

.freund_vergleich_nummer {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.8rem;
    color: var(--text-dunkel);
    opacity: 0.7;
    min-width: 1.2rem;
}

.freund_vergleich_item_ich .freund_vergleich_name,
.freund_vergleich_item_ich .freund_vergleich_score {
    color: var(--gelb);
}

.freund_vergleich_avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
}

.bild_umrandet {
    border: 2.5px solid var(--text-dunkel);
}

.freund_vergleich_name {
    flex: 1;
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 1.2rem;
    color: var(--text-dunkel);
    text-transform: uppercase;
}

.freund_vergleich_datum {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.5rem;
    color: var(--text-dunkel);
    opacity: 0.7;
    margin-left: 0.4rem;
}

.freund_vergleich_score {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 1.2rem;
    color: var(--text-dunkel);
}

.button_nochmal {
    background: var(--gelb);
    color: white;
}

.button_kategorien_highscores {
    background: var(--braun);
}

.perfekte_runde_toast {
    position: fixed;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9000;

    background: var(--braun);
    color: white;
    font-family: 'DotGothic16', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.05rem;
    padding: 0.8rem 1.5rem;
    border-radius: 30px;
    white-space: nowrap;
}

.toast-enter-active {
    animation: toast-pop 0.3s ease-out;
}

.toast-leave-active {
    transition: opacity 0.4s ease;
}

.toast-leave-to {
    opacity: 0;
}

@keyframes toast-pop {
    0% {
        transform: translateX(-50%) translateY(-10px) scale(0.8);
        opacity: 0;
    }
    60% {
        transform: translateX(-50%) translateY(0) scale(1.05);
        opacity: 1;
    }
    100% {
        transform: translateX(-50%) translateY(0) scale(1);
        opacity: 1;
    }
}

.badge_popup {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
}

.badge_popup_inner {
    background: var(--background-base);
    border-radius: 20px;
    padding: 2rem 1.5rem;
    max-width: 320px;
    text-align: center;

    /* Weisser Hintergrund wie bei ModalBase -> Text muss immer braun bleiben,
       unabhängig vom personalisierten Theme (HELL/Darkmode würde sonst weiß = unsichtbar). */
    --text-dunkel: var(--braun);
}

.badge_popup_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

#badge_weiter_button {
    width: 80%;
}

.badge_popup_icon {
    width: 40px;
    height: 40px;
    margin-bottom: 0.4rem;
}

.badge_popup_name {
    font-family: 'DotGothic16', sans-serif;
    font-size: 1.1rem;
    color: var(--gelb);
}

.badge_popup_beschreibung {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 1rem;
    color: var(--text-dunkel);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>