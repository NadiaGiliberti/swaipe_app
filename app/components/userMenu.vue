<script setup>
defineProps({
    open: {
        type: Boolean,
        default: false
    },
    hatUngesehenes: {
        type: Boolean,
        default: false
    },
    avatarUrl: {
        type: String,
        default: ''
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
                        <span class="icon-mask icon-close" role="img" aria-label="Schließen"></span>
                    </button>

                    <nav class="container_menu">

                        <button class="menu_item" @click="goTo('/userProfil')">
                            <img v-if="avatarUrl" :src="avatarUrl" class="menu_avatar bild_umrandet">
                            <div v-else class="menu_avatar avatar_placeholder" role="img" aria-label="Profil"></div>
                            <span>DEIN PROFIL</span>
                        </button>

                        <button class="menu_item" @click="goTo('/freunde')">
                            <span class="icon-mask icon-freunde" role="img" aria-label="Freunde"></span>
                            <span>FREUNDE</span>
                            <span v-if="hatUngesehenes" class="punkt_neu"></span>
                        </button>

                        <button class="menu_item" @click="goTo('/einstellungen')">
                            <span class="icon-mask icon-einstellungen" role="img" aria-label="Einstellungen"></span>
                            <span>EINSTELLUNGEN</span>
                        </button>

                        <button class="menu_item" @click="goTo('/hilfe')">
                            <span class="icon-mask icon-hilfe" role="img" aria-label="Hilfe"></span>
                            <span>HILFE</span>
                        </button>

                        <button class="menu_item" @click="handleLogout">
                            <span class="icon-mask icon-logout" role="img" aria-label="Logout"></span>
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
}

@media (min-width: 768px) {
    .overlay {
        background: rgba(0, 0, 0, 0.4);
    }

    .drawer {
        background-attachment: fixed;
        left: auto;
        width: 400px;
        max-width: 85vw;
        padding: 1.5rem 3rem;
        box-shadow: -8px 0 30px rgba(0, 0, 0, 0.3);
    }

    .container_menu {
        margin-top: 22vh;
        gap: 1.6rem;
    }

    .menu_item .icon-mask,
    .menu_avatar {
        width: 30px;
        height: 30px;
    }
}

@media (min-width: 1024px) {
    .drawer {
        width: 440px;
        padding: 2rem 3.5rem;
    }
}

.drawer::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;

    background-image: url('/textures/noise-main.webp');
    background-repeat: repeat;

    mix-blend-mode: multiply;
}

.drawer::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;

    background-image: url('/textures/noise-overlay.webp');
    background-repeat: repeat;

    mix-blend-mode: overlay;
}

/* ===== CLOSE BUTTON ===== */

.button_close {
    position: absolute;
    top: calc(1rem + env(safe-area-inset-top));
    right: calc(1rem + env(safe-area-inset-right));

    background: none;
    border: none;
    cursor: pointer;
}

.button_close .icon-mask {
    width: clamp(34px, 5vw, 44px);
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
    position: relative;

    background: none;
    border: none;
    padding: 0;

    cursor: pointer;
}

.menu_item .icon-mask {
    width: 26px;
    display: block;
}

.menu_avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
}

.menu_avatar.bild_umrandet {
    border: 1.5px solid var(--text-dunkel);
}

.punkt_neu {
    width: 10px;
    height: 10px;
    background: var(--gelb);
    border-radius: 50%;
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