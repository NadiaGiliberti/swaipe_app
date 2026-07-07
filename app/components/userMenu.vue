<script setup>
defineProps({
    open: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(["close"])

async function goTo(path) {
    await navigateTo(path)
    emit('close')
}

async function handleLogout() {
    const supabase = useSupabaseClient()
    await supabase.auth.signOut()
    await navigateTo('/login')
    emit('close')
}
</script>

<template>
    <Transition name="fade">
        <div v-if="open" class="overlay" @click.self="emit('close')">

            <Transition name="slide">
                <aside class="drawer">

                    <button class="button_close" @click="emit('close')">
                        <img src="/icons/close_icon.svg" alt="Schließen">
                    </button>

                    <nav class="container_menu">

                        <button class="menu_item" @click="goTo('/userProfil')">
                            <img src="/icons/profil_icon.svg">
                            <span>DEIN PROFIL</span>
                        </button>

                        <button class="menu_item" @click="goTo('/freunde')">
                            <img src="/icons/freunde_icon.svg">
                            <span>FREUNDE</span>
                        </button>

                        <button class="menu_item" @click="goTo('/einstellungen')">
                            <img src="/icons/einstellungen_icon.svg">
                            <span>EINSTELLUNGEN</span>
                        </button>

                        <button class="menu_item" @click="goTo('/hilfe')">
                            <img src="/icons/hilfe_icon.svg">
                            <span>HILFE</span>
                        </button>

                        <button class="menu_item" @click="handleLogout">
                            <img src="/icons/logout_icon.svg">
                            <span>LOGOUT</span>
                        </button>

                    </nav>

                </aside>
            </Transition>

        </div>
    </Transition>
</template>

<style scoped>
/* ===== OVERLAY ===== */

.overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;

    background: transparent;

    display: flex;
    justify-content: flex-end;
}

/* ===== DRAWER ===== */

.drawer {
    position: fixed;
    inset: 0;
    z-index: 99;
    overflow: hidden;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    padding: 1rem 2.5rem;

    background:
        radial-gradient(circle at 22% 18%, var(--background-1) 0%, transparent 70%),
        radial-gradient(circle at 80% 65%, var(--background-2) 0%, transparent 80%),
        radial-gradient(circle at 86% 12%, var(--background-3) 0%, transparent 70%),
        radial-gradient(circle at 10% 95%, var(--background-3) 0%, transparent 70%),
        var(--background-base);

    background-attachment: fixed;
}

.drawer::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;

    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" seed="10" result="noise"/></filter><filter id="noise2"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="3" seed="5" result="noise2"/></filter></defs><rect width="400" height="400" fill="%23000000" filter="url(%23noise)" opacity="0.72"/><rect width="400" height="400" fill="%23ffffff" filter="url(%23noise2)" opacity="0.55"/></svg>');

    mix-blend-mode: multiply;
}

.drawer::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;

    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><filter id="noise3"><feTurbulence type="fractalNoise" baseFrequency="3.2" numOctaves="2" seed="8"/></filter></defs><rect width="300" height="300" fill="%23000000" filter="url(%23noise3)" opacity="0.75"/></svg>');

    mix-blend-mode: overlay;
}

/* ===== CLOSE BUTTON ===== */

.button_close {
    position: absolute;
    top: 1rem;
    right: 1rem;

    background: none;
    border: none;
    cursor: pointer;
}

.button_close img {
    width: 28px;
    display: block;
}

/* ===== MENU ===== */

.container_menu {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-top: 25vh;
}

.menu_item {
    display: flex;
    align-items: center;
    gap: 1rem;

    background: none;
    border: none;
    padding: 0;

    cursor: pointer;
}

.menu_item img {
    width: 26px;
    display: block;
}

/* ===== TRANSITION SYSTEM (Vue) ===== */

.drawer-enter-from {
    transform: translateX(100%);
}

.drawer-enter-active {
    transition: transform 0.25s ease-out;
}

.drawer-enter-to {
    transform: translateX(0);
}

.drawer-leave-from {
    transform: translateX(0);
}

.drawer-leave-active {
    transition: transform 0.2s ease-in;
}

.drawer-leave-to {
    transform: translateX(100%);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>