<script setup>
const route = useRoute()
const supabase = useSupabaseClient()

const modus = route.query.modus === 'score' ? 'score' : 'uebung'
const kategorie = route.query.kategorie || null
const anzahlFragen = modus === 'score' ? 999 : 10

const ESKALATION_ALLE_X_RICHTIGE = 15
const PERFEKTE_RUNDE_BONUS = 500

const karten = ref([])
const aktuellerIndex = ref(0)
const punkte = ref(0)
const korrekt = ref(0)
const falsch = ref(0)
const aktuelleSerie = ref(0)
const besteSerie = ref(0)
const ladeFehler = ref('')
const bereit = ref(false)
const sofortZuruecksetzen = ref(false)

const userLevels = ref({ BILD: 1, VIDEO: 1, AUDIO: 1, MUSIK: 1 })
const kategorieStats = ref({})

const zeitVerbleibend = ref(60)
let timerInterval = null

const kartenPosition = ref({ x: 0, y: 0, rotation: 0 })
const wirdGezogen = ref(false)
const wirdWeggeworfen = ref(false)
let startX = 0
let startY = 0

const comboAnzeige = ref('')
let comboTimeout = null

// ===== AUDIO PLAYER =====
const audioRef = ref(null)
const audioIstAktiv = ref(false)
const audioAktuelleZeit = ref(0)
const audioGesamtZeit = ref(0)

// ===== VIDEO FADE-IN (gegen schwarzes Flackern beim Kartenwechsel) =====
const videoBereit = ref(false)

// ===== VERLASSEN-BESTÄTIGUNG =====
const spielBeendet = ref(false)
const zeigeVerlassenModal = ref(false)
let ausstehendeResolve = null

onBeforeRouteLeave(() => {
    if (spielBeendet.value || !bereit.value) return true

    return new Promise((resolve) => {
        ausstehendeResolve = resolve
        zeigeVerlassenModal.value = true
    })
})

function bestaetigeVerlassen() {
    spielBeendet.value = true
    zeigeVerlassenModal.value = false
    if (ausstehendeResolve) {
        ausstehendeResolve(true)
        ausstehendeResolve = null
    }
}

function abbrechenVerlassen() {
    zeigeVerlassenModal.value = false
    if (ausstehendeResolve) {
        ausstehendeResolve(false)
        ausstehendeResolve = null
    }
}

const aktuelleKarte = computed(() => karten.value[aktuellerIndex.value])
const naechsteKarte = computed(() => karten.value[aktuellerIndex.value + 1])
const fertig = computed(() => aktuellerIndex.value >= karten.value.length || (modus === 'score' && zeitVerbleibend.value <= 0))

const VORLADE_ANZAHL = 3
const vorausKarten = computed(() => karten.value.slice(aktuellerIndex.value + 2, aktuellerIndex.value + 2 + VORLADE_ANZAHL))

const zeitKnapp = computed(() => {
    return modus === 'score' && zeitVerbleibend.value <= 10 && zeitVerbleibend.value > 0
})

const echtHeaderOpacity = computed(() => {
    if (kartenPosition.value.x <= 0) return 1
    return Math.max(1 - kartenPosition.value.x / 150, 0)
})

const kiHeaderOpacity = computed(() => {
    if (kartenPosition.value.x >= 0) return 1
    return Math.max(1 - Math.abs(kartenPosition.value.x) / 150, 0)
})

const dragProgress = computed(() => {
    const maxDistanz = 300
    return Math.min(Math.abs(kartenPosition.value.x) / maxDistanz, 1)
})

const hintergrundScale = computed(() => {
    if (wirdWeggeworfen.value) return 1
    const basis = 0.94
    const ziel = 0.976
    return basis + (ziel - basis) * dragProgress.value
})

const hintergrundOpacity = computed(() => {
    if (wirdWeggeworfen.value) return 1
    const basis = 0.5
    const ziel = 0.8
    return basis + (ziel - basis) * dragProgress.value
})

function zeigeComboFalls(serie) {
    if (serie >= 3 && [3, 5, 10, 15, 20].includes(serie)) {
        comboAnzeige.value = `COMBO x${serie}`

        if (comboTimeout) clearTimeout(comboTimeout)
        comboTimeout = setTimeout(() => {
            comboAnzeige.value = ''
        }, 1000)
    }
}

// ===== AUDIO PLAYER FUNKTIONEN =====
function toggleAudioPlay() {
    if (!audioRef.value) return
    if (audioRef.value.paused) {
        audioRef.value.play()
    } else {
        audioRef.value.pause()
    }
}

function audioZeitUpdate() {
    if (audioRef.value) audioAktuelleZeit.value = audioRef.value.currentTime
}

function audioMetadataGeladen() {
    if (!audioRef.value) return

    const dauer = audioRef.value.duration

    // Fix für den bekannten Chrome-Bug: VBR-MP3s ohne Xing/Info-Header
    // melden duration = Infinity, bis der Browser die echte Dauer kennt.
    // Trick: kurz ans Ende springen zwingt den Browser, sie korrekt zu berechnen.
    if (dauer === Infinity || isNaN(dauer)) {
        audioRef.value.currentTime = 1e101
        audioRef.value.addEventListener('timeupdate', function korrigiereEinmal() {
            audioRef.value.removeEventListener('timeupdate', korrigiereEinmal)
            audioGesamtZeit.value = audioRef.value.duration
            audioRef.value.currentTime = 0
        }, { once: true })
    } else {
        audioGesamtZeit.value = dauer
    }
}

function audioSpulen(event) {
    if (audioRef.value) audioRef.value.currentTime = event.target.value
}

function formatZeit(sekunden) {
    if (!sekunden || isNaN(sekunden)) return '0:00'
    const min = Math.floor(sekunden / 60)
    const sek = Math.floor(sekunden % 60)
    return `${min}:${sek.toString().padStart(2, '0')}`
}

watch(aktuelleKarte, () => {
    audioAktuelleZeit.value = 0
    audioGesamtZeit.value = 0
    audioIstAktiv.value = false
    videoBereit.value = false
})

async function ladeUserLevel() {
    if (modus !== 'score') return

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return

    const { data } = await supabase
        .from('profiles')
        .select('level_bild, level_video, level_audio, level_musik')
        .eq('id', currentUser.id)
        .single()

    if (data) {
        userLevels.value = {
            BILD: data.level_bild ?? 1,
            VIDEO: data.level_video ?? 1,
            AUDIO: data.level_audio ?? 1,
            MUSIK: data.level_musik ?? 1
        }
    }
}

async function initSpiel() {
    await ladeUserLevel()

    const geladen = await ladeSpielkarten(supabase, kategorie, modus === 'score' ? 100 : anzahlFragen)

    if (geladen.length === 0) {
        ladeFehler.value = 'Keine Inhalte gefunden.'
        return
    }

    if (modus === 'score') {
        const startResolver = (karte) => levelZuStartSchwierigkeit(userLevels.value[karte.kategorie] ?? 1)
        karten.value = baueAusgeglicheneReihenfolge(geladen, startResolver)
    } else {
        karten.value = [...geladen].sort(() => Math.random() - 0.5).slice(0, anzahlFragen)
    }

    bereit.value = true

    if (modus === 'score') {
        timerInterval = setInterval(() => {
            zeitVerbleibend.value--
            if (zeitVerbleibend.value <= 0) {
                clearInterval(timerInterval)
                beendeSpiel()
            }
        }, 1000)
    }
}

function handleKeydown(event) {
    if (!bereit.value || !aktuelleKarte.value) return

    if (event.key === 'ArrowLeft') {
        buttonSwipe(false)
    } else if (event.key === 'ArrowRight') {
        buttonSwipe(true)
    }
}

onMounted(() => {
    initSpiel()
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
    if (comboTimeout) clearTimeout(comboTimeout)
    window.removeEventListener('keydown', handleKeydown)
})

function trackeKategorieStat(kategorieWert, warRichtig) {
    if (!kategorieStats.value[kategorieWert]) {
        kategorieStats.value[kategorieWert] = { korrekt: 0, gesamt: 0 }
    }
    kategorieStats.value[kategorieWert].gesamt++
    if (warRichtig) {
        kategorieStats.value[kategorieWert].korrekt++
    }
}

function beantworten(antwortIstKI) {
    if (!aktuelleKarte.value) return

    const karte = aktuelleKarte.value
    const warRichtig = (karte.herkunft === 'KI') === antwortIstKI

    if (modus === 'score') {
        trackeKategorieStat(karte.kategorie, warRichtig)
    }

    if (warRichtig) {
        korrekt.value++
        aktuelleSerie.value++
        if (aktuelleSerie.value > besteSerie.value) {
            besteSerie.value = aktuelleSerie.value
        }

        if (modus === 'score') {
            const kartenLevel = userLevels.value[karte.kategorie] ?? 1
            const kartenPunkte = berechneKartenPunkte(karte.schwierigkeit_aktuell, kartenLevel)
            punkte.value += kartenPunkte + (aktuelleSerie.value * 10)
            zeigeComboFalls(aktuelleSerie.value)
        }
    } else {
        falsch.value++
        aktuelleSerie.value = 0
    }

    speichereAntwort(supabase, karte.id, warRichtig)

    if (modus === 'score' && warRichtig && korrekt.value % ESKALATION_ALLE_X_RICHTIGE === 0) {
        const minSchwierigkeit = Math.min(1 + Math.floor(korrekt.value / ESKALATION_ALLE_X_RICHTIGE), 5)
        const restKarten = karten.value.slice(aktuellerIndex.value + 1)
        const neueRestKarten = baueErschwerteReihenfolge(restKarten, minSchwierigkeit)
        karten.value = [
            ...karten.value.slice(0, aktuellerIndex.value + 1),
            ...neueRestKarten
        ]
    }

    aktuellerIndex.value++

    if (fertig.value) {
        beendeSpiel()
    }
}

async function beendeSpiel() {
    spielBeendet.value = true

    if (timerInterval) clearInterval(timerInterval)

    const gesamtAntworten = korrekt.value + falsch.value
    let perfekteRunde = false

    if (modus === 'score' && gesamtAntworten > 0 && falsch.value === 0) {
        perfekteRunde = true
        punkte.value += PERFEKTE_RUNDE_BONUS
    }

    const ergebnis = {
        modus,
        kategorie,
        punkte: punkte.value,
        korrekt: korrekt.value,
        falsch: falsch.value,
        gesamt: gesamtAntworten,
        besteSerie: besteSerie.value,
        perfekteRunde,
        neueBadges: []
    }

    if (modus === 'score') {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

        if (userError || !currentUser) {
            await supabase.auth.signOut()
            await navigateTo('/login')
            return
        }

        const { data: profilData } = await supabase
            .from('profiles')
            .select('highscore, level_bild, level_video, level_audio, level_musik, gespielte_runden')
            .eq('id', currentUser.id)
            .single()

        const updates = {}

        if (profilData && punkte.value > profilData.highscore) {
            updates.highscore = punkte.value
            updates.highscore_datum = new Date().toISOString()
        }

        if (profilData) {
            for (const [kat, stats] of Object.entries(kategorieStats.value)) {
                if (stats.gesamt < 3) continue

                const spalte = KATEGORIE_LEVEL_SPALTE[kat]
                if (!spalte) continue

                const aktuellesLevel = profilData[spalte] ?? 1
                const genauigkeit = stats.korrekt / stats.gesamt
                let neuesLevel = aktuellesLevel

                if (genauigkeit >= 0.75) {
                    neuesLevel = Math.min(aktuellesLevel + 1, 10)
                } else if (genauigkeit <= 0.4) {
                    neuesLevel = Math.max(aktuellesLevel - 1, 1)
                }

                if (neuesLevel !== aktuellesLevel) {
                    updates[spalte] = neuesLevel
                }
            }
        }

        if (Object.keys(updates).length > 0) {
            await supabase.from('profiles').update(updates).eq('id', currentUser.id)
        }

        const neueGespielteRunden = (profilData?.gespielte_runden ?? 0) + 1
        await supabase
            .from('profiles')
            .update({ gespielte_runden: neueGespielteRunden })
            .eq('id', currentUser.id)

        const finalLevels = {
            BILD: updates.level_bild ?? profilData?.level_bild ?? 1,
            VIDEO: updates.level_video ?? profilData?.level_video ?? 1,
            AUDIO: updates.level_audio ?? profilData?.level_audio ?? 1,
            MUSIK: updates.level_musik ?? profilData?.level_musik ?? 1
        }

        const finalHighscore = updates.highscore ?? profilData?.highscore ?? 0

        const neueBadges = await pruefeUndVergebeBadges(supabase, currentUser.id, {
            perfekteRunde,
            besteSerie: besteSerie.value,
            levels: finalLevels,
            highscore: finalHighscore,
            gespielteRunden: neueGespielteRunden
        })

        ergebnis.neueBadges = neueBadges
    }

    sessionStorage.setItem('swaipe_ergebnis', JSON.stringify(ergebnis))
    await navigateTo('/ergebnis')
}

// ===== SWIPE / DRAG =====

function startDrag(event) {
    wirdGezogen.value = true
    const point = event.touches ? event.touches[0] : event
    startX = point.clientX
    startY = point.clientY
}

function onDrag(event) {
    if (!wirdGezogen.value) return
    const point = event.touches ? event.touches[0] : event
    const deltaX = point.clientX - startX
    const deltaY = point.clientY - startY

    kartenPosition.value = {
        x: deltaX,
        y: deltaY,
        rotation: deltaX * 0.05
    }
}

function endDrag() {
    if (!wirdGezogen.value) return
    wirdGezogen.value = false

    const schwelle = 100

    if (kartenPosition.value.x > schwelle) {
        swipeAbschliessen(true)
    } else if (kartenPosition.value.x < -schwelle) {
        swipeAbschliessen(false)
    } else {
        kartenPosition.value = { x: 0, y: 0, rotation: 0 }
    }
}

function swipeAbschliessen(antwortIstKI) {
    const richtung = antwortIstKI ? 400 : -400
    wirdWeggeworfen.value = true
    kartenPosition.value = { x: richtung, y: kartenPosition.value.y, rotation: antwortIstKI ? 30 : -30 }

    setTimeout(() => {
        sofortZuruecksetzen.value = true
        beantworten(antwortIstKI)
        kartenPosition.value = { x: 0, y: 0, rotation: 0 }

        nextTick(() => {
            sofortZuruecksetzen.value = false
            wirdWeggeworfen.value = false
        })
    }, 200)
}

function buttonSwipe(antwortIstKI) {
    swipeAbschliessen(antwortIstKI)
}
</script>

<template>
    <main class="container_main">

        <template v-if="ladeFehler">
            <p>{{ ladeFehler }}</p>
        </template>

        <template v-else-if="bereit">
            <div class="container_score_count">
                <div class="container_punkte" v-if="modus === 'score'">
                    <h4> PUNKTE </h4>
                    <p>{{ punkte }}</p>
                </div>

                <div class="container_korrekt">
                    <h4> KORREKT </h4>
                    <p>{{ korrekt }}</p>
                </div>
            </div>

            <div class="container_zeit" v-if="modus === 'score'">
                <h1 :class="{ zeit_knapp: zeitKnapp }">{{ zeitVerbleibend }}</h1>
                <h4> SEKUNDEN </h4>
            </div>
            <div class="container_zeit" v-else>
                <h1>{{ aktuellerIndex + 1 }}/{{ karten.length }}</h1>
            </div>

            <div class="container_swipe_header">
                <div class="swipe_header_seite" :style="{ opacity: echtHeaderOpacity }">
                    <span class="swipe_header_label">ECHT</span>
                    <img src="/icons/pfeil_links_icon.svg" alt="Nach links" class="swipe_header_pfeil">
                </div>
                <div class="swipe_header_seite" :style="{ opacity: kiHeaderOpacity }">
                    <span class="swipe_header_label">KI</span>
                    <img src="/icons/pfeil_rechts_icon.svg" alt="Nach rechts" class="swipe_header_pfeil">
                </div>
            </div>

            <div class="container_content">

                <Transition name="combo">
                    <div v-if="comboAnzeige" class="combo_anzeige">{{ comboAnzeige }}</div>
                </Transition>

                <div v-if="naechsteKarte" class="karte karte_hintergrund" :style="{
                    transform: `scale(${hintergrundScale})`,
                    opacity: hintergrundOpacity
                }">
                    <img v-if="naechsteKarte.kategorie === 'BILD'" :src="naechsteKarte.datei_url" class="karte_bild"
                        draggable="false">
                    <video v-else-if="naechsteKarte.kategorie === 'VIDEO'" :src="naechsteKarte.datei_url"
                        class="karte_video" preload="auto" fetchpriority="high" muted playsinline></video>
                    <div v-else class="karte_platzhalter"></div>
                </div>

                <div v-if="aktuelleKarte" class="karte" :key="aktuelleKarte.id" :style="{
                    transform: `translate(${kartenPosition.x}px, ${kartenPosition.y}px) rotate(${kartenPosition.rotation}deg)`,
                    transition: (wirdGezogen || sofortZuruecksetzen) ? 'none' : 'transform 0.3s ease'
                }" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag" @touchstart="startDrag"
                    @touchmove="onDrag" @touchend="endDrag">
                    <img v-if="aktuelleKarte.kategorie === 'BILD'" :src="aktuelleKarte.datei_url" class="karte_bild"
                        draggable="false">
                    <video v-else-if="aktuelleKarte.kategorie === 'VIDEO'" :src="aktuelleKarte.datei_url"
                        class="karte_video" :class="{ karte_video_bereit: videoBereit }"
                        preload="auto" fetchpriority="high" autoplay loop muted playsinline
                        @loadeddata="videoBereit = true"></video>

                    <div v-else-if="aktuelleKarte.kategorie === 'AUDIO' || aktuelleKarte.kategorie === 'MUSIK'"
                        class="audio_player">

                        <audio ref="audioRef" :src="aktuelleKarte.datei_url" preload="auto" autoplay loop
                            fetchpriority="high"
                            @play="audioIstAktiv = true" @pause="audioIstAktiv = false"
                            @timeupdate="audioZeitUpdate" @loadedmetadata="audioMetadataGeladen"></audio>

                        <button class="audio_play_button" @click.stop="toggleAudioPlay"
                            @mousedown.stop @touchstart.stop>
                            <svg v-if="!audioIstAktiv" viewBox="0 0 24 24" class="audio_icon">
                                <path d="M8 5v14l11-7z" fill="currentColor" />
                            </svg>
                            <svg v-else viewBox="0 0 24 24" class="audio_icon">
                                <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" />
                            </svg>
                        </button>

                        <div class="audio_progress_bereich" @mousedown.stop @touchstart.stop>
                            <input type="range" class="audio_progress" min="0" :max="audioGesamtZeit || 0"
                                :value="audioAktuelleZeit" @input="audioSpulen"
                                @click.stop @mousedown.stop @touchstart.stop>
                            <div class="audio_zeit">{{ formatZeit(audioAktuelleZeit) }} / {{ formatZeit(audioGesamtZeit) }}</div>
                        </div>
                    </div>

                    <p v-else>{{ aktuelleKarte.content_type }} / {{ aktuelleKarte.stil }}</p>
                </div>

                <div class="vorlade_bereich" aria-hidden="true">
                    <template v-for="(karte, i) in vorausKarten" :key="'vorlade-' + karte.id">
                        <img v-if="karte.kategorie === 'BILD'" :src="karte.datei_url"
                            :fetchpriority="i === 0 ? 'auto' : 'low'">
                        <video v-else-if="karte.kategorie === 'VIDEO'" :src="karte.datei_url"
                            :preload="i === 0 ? 'auto' : 'metadata'" fetchpriority="low" muted
                            playsinline></video>
                        <audio v-else-if="karte.kategorie === 'AUDIO' || karte.kategorie === 'MUSIK'"
                            :src="karte.datei_url" :preload="i === 0 ? 'auto' : 'metadata'"
                            fetchpriority="low"></audio>
                    </template>
                </div>
            </div>

            <div class="container_swipe_buttons">
                <button class="button_swipe button_swipe_echt" @click="buttonSwipe(false)">
                    ECHT
                </button>
                <button class="button_swipe button_swipe_ki" @click="buttonSwipe(true)">
                    KI
                </button>
            </div>

            <div class="container_swipe_info">
                <h4 class="swipe_info_handy">Swipe nach links für Real erstellt und nach rechts für KI generiert</h4>
                <h4 class="swipe_info_pc">Drücke die linke Pfeiltaste für Real erstellt und die rechte für KI generiert
                </h4>
            </div>
        </template>

        <template v-else>
            <p>Lädt...</p>
        </template>

        <Transition name="fade">
            <div v-if="zeigeVerlassenModal" class="verlassen_modal">
                <div class="verlassen_modal_inner">
                    <h3>Spiel verlassen?</h3>
                    <p>Dein Fortschritt in dieser Runde geht verloren, wenn du jetzt gehst.</p>
                    <div class="verlassen_modal_buttons">
                        <button class="button_klein verlassen_btn_weiter" @click="abbrechenVerlassen">WEITERSPIELEN</button>
                        <button class="button_klein verlassen_btn_raus" @click="bestaetigeVerlassen">VERLASSEN</button>
                    </div>
                </div>
            </div>
        </Transition>

    </main>
</template>

<style>
.container_score_count {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin-top: -5rem;
}

.container_punkte,
.container_korrekt {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.5rem;
}

.container_zeit {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    margin-top: 2rem;
}

.zeit_knapp {
    color: var(--background-3);
    animation: zeit-pulse 0.6s ease-in-out infinite;
}

@keyframes zeit-pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.15);
    }
}

.container_swipe_header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 80%;
    position: relative;
    z-index: 10;
}

.swipe_header_seite {
    position: relative;
    display: flex;
    flex-direction: column;
    transition: opacity 0.15s ease;
}

.swipe_header_label {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 2.3rem;
    position: relative;
    top: 2rem;
    text-align: center;
    color: var(--gelb);
    z-index: 2;
}

.swipe_header_pfeil {
    width: 4rem;
    display: block;
    position: relative;
    top: 1rem;
    z-index: 1;
}

.swipe_header_seite:first-child .swipe_header_pfeil {
    left: -1.8rem;
}

.swipe_header_seite:last-child .swipe_header_pfeil {
    right: -1.8rem;
}

.container_content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90vw;
    height: 40vh;
    background: #00000042;
    border-radius: 30px;
    margin: 2%;
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.combo_anzeige {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'DotGothic16', sans-serif;
    font-size: 2rem;
    font-weight: bold;
    color: var(--gelb);
    text-shadow: 2px 2px 0 var(--braun);
    z-index: 3;
    pointer-events: none;
}

.combo-enter-active {
    animation: combo-pop 0.3s ease-out;
}

.combo-leave-active {
    transition: opacity 0.3s ease;
}

.combo-leave-to {
    opacity: 0;
}

@keyframes combo-pop {
    0% {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
    }

    60% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 1;
    }

    100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
}

.karte {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    user-select: none;
    touch-action: none;
    position: relative;
    z-index: 1;
    background: rgb(0, 0, 0);
    border-radius: 30px;
    overflow: hidden;
}

.karte_hintergrund {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    cursor: default;
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.karte_platzhalter {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 30px;
}

.karte_bild {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 30px;
    pointer-events: none;
}

.vorlade_bereich {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
}

.karte_video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 30px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.karte_video_bereit {
    opacity: 1;
}

.audio_player {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.audio_play_button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gelb);
    padding: 0;
    display: flex;
}

.audio_icon {
    width: 4rem;
    height: 4rem;
}

.audio_progress_bereich {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
}

.audio_progress {
    width: 100%;
}

.audio_zeit {
    font-size: 0.9rem;
    color: var(--gelb);
}

.container_swipe_buttons {
    display: flex;
    gap: 1rem;
    width: 80%;
    margin-top: 1rem;
}

.button_swipe {
    flex: 1;
    padding: 0.8rem;
    border-radius: 30px;
    border: none;
    font-family: 'DotGothic16', sans-serif;
    font-size: 1.2rem;
    color: white;
    cursor: pointer;
}

.button_swipe_echt {
    background: var(--background-2);
}

.button_swipe_ki {
    background: var(--background-3);
}

.container_swipe_buttons {
    display: none;
}

.container_swipe_info {
    text-align: center;
    margin-top: 1rem;
    width: 80%;
}

.swipe_info_pc {
    display: none;
}

@media (min-width: 768px) {
    .container_swipe_buttons {
        display: flex;
    }

    .swipe_info_handy {
        display: none;
    }

    .swipe_info_pc {
        display: block;
    }
}

.verlassen_modal {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
}

.verlassen_modal_inner {
    background: var(--background-base);
    border-radius: 20px;
    padding: 2rem 1.5rem;
    max-width: 320px;
    text-align: center;
}

.verlassen_modal_inner p {
    font-size: 4vw;
    margin-top: 0.5rem;
}

.verlassen_modal_buttons {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 1.5rem;
}

.verlassen_btn_weiter {
    background: var(--braun);
}

.verlassen_btn_raus {
    background: var(--background-3);
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