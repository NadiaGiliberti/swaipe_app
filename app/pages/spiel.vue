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

const userLevels = ref({ BILD: 1, VIDEO: 1, AUDIO: 1, MUSIK: 1 })
const kategorieStats = ref({})

const zeitVerbleibend = ref(60)
let timerInterval = null

const kartenPosition = ref({ x: 0, y: 0, rotation: 0 })
const wirdGezogen = ref(false)
let startX = 0
let startY = 0

const comboAnzeige = ref('')
let comboTimeout = null

const aktuelleKarte = computed(() => karten.value[aktuellerIndex.value])
const fertig = computed(() => aktuellerIndex.value >= karten.value.length || (modus === 'score' && zeitVerbleibend.value <= 0))

const labelKiOpacity = computed(() => {
    return Math.min(Math.max(kartenPosition.value.x / 150, 0), 1)
})

const labelEchtOpacity = computed(() => {
    return Math.min(Math.max(-kartenPosition.value.x / 150, 0), 1)
})

const zeitKnapp = computed(() => {
    return modus === 'score' && zeitVerbleibend.value <= 10 && zeitVerbleibend.value > 0
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

async function beantworten(antwortIstKI) {
    if (!aktuelleKarte.value) return

    const warRichtig = (aktuelleKarte.value.herkunft === 'KI') === antwortIstKI

    if (modus === 'score') {
        trackeKategorieStat(aktuelleKarte.value.kategorie, warRichtig)
    }

    if (warRichtig) {
        korrekt.value++
        aktuelleSerie.value++
        if (aktuelleSerie.value > besteSerie.value) {
            besteSerie.value = aktuelleSerie.value
        }

        if (modus === 'score') {
            const kartenLevel = userLevels.value[aktuelleKarte.value.kategorie] ?? 1
            const kartenPunkte = berechneKartenPunkte(aktuelleKarte.value.schwierigkeit_aktuell, kartenLevel)
            punkte.value += kartenPunkte + (aktuelleSerie.value * 10)
            zeigeComboFalls(aktuelleSerie.value)
        }
    } else {
        falsch.value++
        aktuelleSerie.value = 0
    }

    await speichereAntwort(supabase, aktuelleKarte.value.id, warRichtig)

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
        perfekteRunde
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
            .select('highscore, level_bild, level_video, level_audio, level_musik')
            .eq('id', currentUser.id)
            .single()

        const updates = {}

        if (profilData && punkte.value > profilData.highscore) {
            updates.highscore = punkte.value
            updates.highscore_datum = new Date().toISOString()
        }


        // Kategoriespezifische Level, jeweils nur wenn genug Antworten in dieser Kategorie
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
    kartenPosition.value = { x: richtung, y: kartenPosition.value.y, rotation: antwortIstKI ? 30 : -30 }

    setTimeout(() => {
        beantworten(antwortIstKI)
        kartenPosition.value = { x: 0, y: 0, rotation: 0 }
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

            <div class="container_content">
                <div class="label_swipe label_echt" :style="{ opacity: labelEchtOpacity }">ECHT</div>
                <div class="label_swipe label_ki" :style="{ opacity: labelKiOpacity }">KI</div>

                <Transition name="combo">
                    <div v-if="comboAnzeige" class="combo_anzeige">{{ comboAnzeige }}</div>
                </Transition>

                <div v-if="aktuelleKarte" class="karte" :style="{
                    transform: `translate(${kartenPosition.x}px, ${kartenPosition.y}px) rotate(${kartenPosition.rotation}deg)`,
                    transition: wirdGezogen ? 'none' : 'transform 0.3s ease'
                }" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag"
                    @touchstart="startDrag" @touchmove="onDrag" @touchend="endDrag">
                    <img v-if="aktuelleKarte.kategorie === 'BILD'" :src="aktuelleKarte.datei_url" class="karte_bild"
                        draggable="false">
                    <video v-else-if="aktuelleKarte.kategorie === 'VIDEO'" :src="aktuelleKarte.datei_url"
                        class="karte_video" autoplay loop muted playsinline></video>
                    <audio v-else-if="aktuelleKarte.kategorie === 'AUDIO' || aktuelleKarte.kategorie === 'MUSIK'"
                        :src="aktuelleKarte.datei_url" class="karte_audio" autoplay controls loop></audio>
                    <p v-else>{{ aktuelleKarte.content_type }} / {{ aktuelleKarte.stil }}</p>
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
                <h4 class="swipe_info_pc">Drücke die linke Pfeiltaste für Real erstellt und die rechte für KI generiert</h4>
            </div>
        </template>

        <template v-else>
            <p>Lädt...</p>
        </template>

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
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.15);
    }
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
}

.label_swipe {
    position: absolute;
    top: 1rem;
    font-family: 'DotGothic16', sans-serif;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    z-index: 2;
    pointer-events: none;
}

.label_echt {
    left: 1rem;
}

.label_ki {
    right: 1rem;
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
}

.karte_bild {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 30px;
    pointer-events: none;
}

.karte_video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 30px;
    pointer-events: none;
}

.karte_audio {
    width: 90%;
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
</style>