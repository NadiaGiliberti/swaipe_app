<script setup>
const { isIos, zeigeBanner, erkenneUmgebung, initListener, installieren, verwerfen } = usePwaInstall()

onMounted(() => {
    erkenneUmgebung()
    initListener()
})
</script>

<template>
    <Transition name="install-banner">
        <div v-if="zeigeBanner" class="install_banner">
            <img src="/icon_swaipe.svg" class="install_banner_icon" alt="SWAIPE">

            <div class="install_banner_text">
                <p class="install_banner_titel">SWAIPE als App installieren</p>
                <p v-if="isIos" class="install_banner_hinweis">
                    Tippe unten auf <strong>Teilen</strong> und dann auf <strong>„Zum Home-Bildschirm"</strong>.
                </p>
                <p v-else class="install_banner_hinweis">
                    Schneller Zugriff direkt vom Home-Bildschirm aus.
                </p>
            </div>

            <button v-if="!isIos" class="install_banner_button" @click="installieren">
                INSTALLIEREN
            </button>

            <button class="install_banner_close" @click="verwerfen" aria-label="Schliessen">
                <img src="/icons/close_icon.svg" alt="">
            </button>
        </div>
    </Transition>
</template>

<style>
.install_banner {
    position: fixed;
    left: 50%;
    bottom: calc(1rem + env(safe-area-inset-bottom));
    transform: translateX(-50%);
    z-index: 9500;

    display: flex;
    align-items: center;
    gap: 0.8rem;

    width: 90%;
    max-width: 420px;
    padding: 0.8rem 1rem;
    border-radius: 20px;

    background: var(--background-base);
    border: 1px solid var(--braun);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.install_banner_icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
}

.install_banner_text {
    flex: 1;
    min-width: 0;
}

.install_banner_titel {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.85rem;
    color: var(--text-dunkel);
    text-align: left;
    margin: 0;
}

.install_banner_hinweis {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 0.85rem;
    color: var(--text-dunkel);
    text-align: left;
    margin: 0.2rem 0 0;
}

.install_banner_button {
    flex-shrink: 0;
    background: var(--gelb);
    color: var(--braun);
    border: none;
    border-radius: 30px;
    padding: 0.5rem 0.8rem;
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.7rem;
    white-space: nowrap;
    cursor: pointer;
}

.install_banner_close {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 0.2rem;
    cursor: pointer;
    align-self: flex-start;
}

.install_banner_close img {
    width: 14px;
    display: block;
}

.install-banner-enter-active,
.install-banner-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.install-banner-enter-from,
.install-banner-leave-to {
    transform: translateX(-50%) translateY(120%);
    opacity: 0;
}
</style>
