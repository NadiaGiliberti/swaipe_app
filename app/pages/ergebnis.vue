<script setup>
const ergebnis = ref(null)

onMounted(() => {
    const gespeichert = sessionStorage.getItem('swaipe_ergebnis')
    if (gespeichert) {
        ergebnis.value = JSON.parse(gespeichert)
    }
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
                <h1>{{ ergebnis.punkte }}</h1>
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

.button_nochmal {
    background: var(--gelb);
    color: white;
}

.button_kategorien_highscores {
    background: var(--braun);
}
</style>