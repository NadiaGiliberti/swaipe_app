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

    background-attachment: fixed;

    transition: opacity 0.4s ease;
    opacity: 1;
}

.loading_overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;

    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" seed="10" result="noise"/></filter><filter id="noise2"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="3" seed="5" result="noise2"/></filter></defs><rect width="400" height="400" fill="%23000000" filter="url(%23noise)" opacity="0.72"/><rect width="400" height="400" fill="%23ffffff" filter="url(%23noise2)" opacity="0.55"/></svg>');

    mix-blend-mode: multiply;
}

.loading_overlay::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;

    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><filter id="noise3"><feTurbulence type="fractalNoise" baseFrequency="3.2" numOctaves="2" seed="8"/></filter></defs><rect width="300" height="300" fill="%23000000" filter="url(%23noise3)" opacity="0.75"/></svg>');

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