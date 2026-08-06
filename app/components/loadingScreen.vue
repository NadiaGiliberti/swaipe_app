<script setup>
const frames = [
    '/loading/frame_00.png',
    '/loading/frame_01.png',
    '/loading/frame_02.png',
    '/loading/frame_03.png',
    '/loading/frame_04.png',
    '/loading/frame_05.png',
    '/loading/frame_06.png',
    '/loading/frame_07.png',
    '/loading/frame_08.png',
    '/loading/frame_09.png',
]

const appReady = useAppReady()

const aktuellerFrame = ref(0)
const ausblenden = ref(false)
const sichtbar = ref(true)

let animationInterval = null

function starteAusblenden() {
    const wartezeit = Math.max(0, (frames.length - aktuellerFrame.value) * 40 + 150)

    setTimeout(() => {
        ausblenden.value = true
        setTimeout(() => {
            sichtbar.value = false
            if (animationInterval) clearInterval(animationInterval)
        }, 400)
    }, wartezeit)
}

onMounted(() => {
    animationInterval = setInterval(() => {
        if (aktuellerFrame.value < frames.length - 1) {
            aktuellerFrame.value++
        }
    }, 40)

    // Falls appReady schon true ist, bevor diese Komponente gemounted wurde
    if (appReady.value) {
        starteAusblenden()
    }
})

watch(appReady, (istBereit) => {
    if (istBereit) {
        starteAusblenden()
    }
})

onUnmounted(() => {
    if (animationInterval) clearInterval(animationInterval)
})
</script>

<template>
    <div v-if="sichtbar" class="loading_overlay" :class="{ loading_overlay_ausblenden: ausblenden }">
        <img :src="frames[aktuellerFrame]" alt="Lädt..." class="loading_bild">
    </div>
</template>

<style scoped>
.loading_overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    overflow: hidden;
    isolation: isolate;

    display: flex;
    align-items: center;
    justify-content: center;

    background:
        radial-gradient(circle at 22% 18%, var(--background-1) 0%, transparent 70%),
        radial-gradient(circle at 80% 65%, var(--background-2) 0%, transparent 80%),
        radial-gradient(circle at 86% 12%, var(--background-3) 0%, transparent 70%),
        radial-gradient(circle at 10% 95%, var(--background-3) 0%, transparent 70%),
        var(--background-base);

    transition: opacity 0.4s ease;
    opacity: 1;
}

/* Darkmode: derselbe 4-Farben-Verlauf wie in main.css für den body, hier
   zusätzlich für den Ladebildschirm hinterlegt, da er seinen Hintergrund
   komplett eigenständig definiert (erbt nicht von body). Greift automatisch,
   sobald applyTheme() die "theme-darkmode"-Klasse am <html>-Element setzt. */
html.theme-darkmode .loading_overlay {
    background:
        radial-gradient(circle at 60% 30%, var(--background-2) 0%, transparent 40%),
        radial-gradient(circle at 55% 28%, var(--background-1) 0%, transparent 50%),
        radial-gradient(circle at 65% 45%, var(--background-4) 0%, transparent 40%),
        radial-gradient(circle at 5% 95%, var(--background-2) 0%, transparent 25%),
        radial-gradient(circle at 15% 85%, var(--background-1) 0%, transparent 40%),
        var(--background-3);
}

@media (min-width: 768px) {
    .loading_overlay {
        background-attachment: fixed;
    }

    .loading_bild {
        max-width: 240px;
    }
}

@media (min-width: 1024px) {
    .loading_bild {
        max-width: 260px;
    }
}

.loading_overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;

    background-image: url('/textures/noise-main.webp');
    background-repeat: repeat;

    mix-blend-mode: multiply;
}

.loading_overlay::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;

    background-image: url('/textures/noise-overlay.webp');
    background-repeat: repeat;

    mix-blend-mode: overlay;
}

.loading_overlay_ausblenden {
    opacity: 0;
    pointer-events: none;
}

.loading_bild {
    width: 90vw;
    max-width: 200px;
    position: relative;
    z-index: 1;
}
</style>