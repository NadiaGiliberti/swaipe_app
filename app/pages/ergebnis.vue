<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const ergebnis = ref(null)
const top3Freunde = ref([])
const ladeFreundeLoading = ref(true)

onMounted(async () => {
    const gespeichert = sessionStorage.getItem('swaipe_ergebnis')
    if (gespeichert) {
        ergebnis.value = JSON.parse(gespeichert)
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
                    <img :src="eintrag.profilbild_url || '/icons/profil_icon.svg'" class="freund_vergleich_avatar">
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
</style>