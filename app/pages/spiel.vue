<script setup>
const route = useRoute()
const supabase = useSupabaseClient()

const modus = route.query.modus === 'score' ? 'score' : 'uebung'
const kategorie = route.query.kategorie || null
const anzahlFragen = modus === 'score' ? 999 : 10 // score = zeitbasiert, uebung = feste Anzahl

const karten = ref([])
const aktuellerIndex = ref(0)
const punkte = ref(0)
const korrekt = ref(0)
const falsch = ref(0)
const ladeFehler = ref('')
const bereit = ref(false)

const zeitVerbleibend = ref(60)
let timerInterval = null

const kartenPosition = ref({ x: 0, y: 0, rotation: 0 })
const wirdGezogen = ref(false)
let startX = 0
let startY = 0

const aktuelleKarte = computed(() => karten.value[aktuellerIndex.value])
const fertig = computed(() => aktuellerIndex.value >= karten.value.length || (modus === 'score' && zeitVerbleibend.value <= 0))

const labelKiOpacity = computed(() => {
    return Math.min(Math.max(kartenPosition.value.x / 150, 0), 1)
})

const labelEchtOpacity = computed(() => {
    return Math.min(Math.max(-kartenPosition.value.x / 150, 0), 1)
})

async function initSpiel() {
    karten.value = await ladeSpielkarten(supabase, kategorie, modus === 'score' ? 50 : anzahlFragen)

    if (karten.value.length === 0) {
        ladeFehler.value = 'Keine Inhalte gefunden.'
        return
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

onMounted(() => {
    initSpiel()
})

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
})

async function beantworten(antwortIstKI) {
    if (!aktuelleKarte.value) return

    const warRichtig = (aktuelleKarte.value.herkunft === 'KI') === antwortIstKI

    if (warRichtig) {
        korrekt.value++
        if (modus === 'score') punkte.value += 100
    } else {
        falsch.value++
    }

    await speichereAntwort(supabase, aktuelleKarte.value.id, warRichtig)

    aktuellerIndex.value++

    if (fertig.value) {
        beendeSpiel()
    }
}

async function beendeSpiel() {
    if (timerInterval) clearInterval(timerInterval)

    const ergebnis = {
        modus,
        kategorie,
        punkte: punkte.value,
        korrekt: korrekt.value,
        falsch: falsch.value,
        gesamt: korrekt.value + falsch.value
    }

    if (modus === 'score' && punkte.value > 0) {
        const { data: { user: currentUser } } = await supabase.auth.getUser()

        const { data: profilData } = await supabase
            .from('profiles')
            .select('highscore')
            .eq('id', currentUser.id)
            .single()

        if (profilData && punkte.value > profilData.highscore) {
            await supabase
                .from('profiles')
                .update({ highscore: punkte.value })
                .eq('id', currentUser.id)
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
        swipeAbschliessen(true) // rechts = KI
    } else if (kartenPosition.value.x < -schwelle) {
        swipeAbschliessen(false) // links = ECHT
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
                <h1>{{ zeitVerbleibend }}</h1>
                <h4> SEKUNDEN </h4>
            </div>
            <div class="container_zeit" v-else>
                <h1>{{ aktuellerIndex + 1 }}/{{ karten.length }}</h1>
            </div>

            <div class="container_content">
                <div class="label_swipe label_echt" :style="{ opacity: labelEchtOpacity }">ECHT</div>
                <div class="label_swipe label_ki" :style="{ opacity: labelKiOpacity }">KI</div>

                <div
                    v-if="aktuelleKarte"
                    class="karte"
                    :style="{
                        transform: `translate(${kartenPosition.x}px, ${kartenPosition.y}px) rotate(${kartenPosition.rotation}deg)`,
                        transition: wirdGezogen ? 'none' : 'transform 0.3s ease'
                    }"
                    @mousedown="startDrag"
                    @mousemove="onDrag"
                    @mouseup="endDrag"
                    @mouseleave="endDrag"
                    @touchstart="startDrag"
                    @touchmove="onDrag"
                    @touchend="endDrag"
                >
                    <img
                        v-if="aktuelleKarte.kategorie === 'BILD'"
                        :src="aktuelleKarte.datei_url"
                        class="karte_bild"
                        draggable="false"
                    >
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
                <h4>Swipe nach links für Real erstellt und nach rechts für KI generiert</h4>
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

.container_swipe_info {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    margin-top: 2rem;
}
</style>