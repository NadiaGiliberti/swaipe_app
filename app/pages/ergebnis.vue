<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const ergebnis = ref(null)
const top3Freunde = ref([])
const ladeFreundeLoading = ref(true)
const zeigePerfekteRunde = ref(false)

onMounted(async () => {
    const gespeichert = sessionStorage.getItem('swaipe_ergebnis')
    if (gespeichert) {
        ergebnis.value = JSON.parse(gespeichert)
    }

    if (ergebnis.value?.perfekteRunde) {
        zeigePerfekteRunde.value = true
        setTimeout(() => {
            zeigePerfekteRunde.value = false
        }, 2500)
    }

    if (ergebnis.value?.modus === 'score' && user.value) {
        const ranking = await ladeFreundeRanking(supabase, user.value.id)
        top3Freunde.value = ranking.slice(0, 3)
    }

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
            <template v-else>
                <h1>{{ ergebnis.korrekt }}/{{ ergebnis.gesamt }}</h1>
                <h3>RICHTIG</h3>
            </template>

            <div class="container_stats">
                <h2>STATS</h2>

                <div class="stat_zeile">
                    <span>BESTSERIE</span>
                    <span>{{ ergebnis.besteSerie }}</span>
                </div>
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
            </div>

            <div v-if="ergebnis.modus === 'score' && !ladeFreundeLoading && top3Freunde.length > 0" class="container_freunde_vergleich">
                <h2>FREUNDE</h2>

                <div
                    v-for="eintrag in top3Freunde"
                    :key="eintrag.id"
                    class="freund_vergleich_item"
                    :class="{ freund_vergleich_item_ich: eintrag.istIch }"
                >
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
                <NuxtLink to="/kategorien" class="button button_nochmal">NOCHMAL</NuxtLink>
                <NuxtLink to="/kategorien" class="button_klein button_kategorien_highscores">KATEGORIEN</NuxtLink>
                <NuxtLink to="/highscores" class="button_klein button_kategorien_highscores">HIGHSCORES</NuxtLink>
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
                    <button class="button_klein" @click="ergebnis.neueBadges = []">Weiter</button>
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

.freund_vergleich_item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-top: 0.8rem;
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
}

.badge_popup_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
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