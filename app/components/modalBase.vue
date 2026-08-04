<!-- components/ModalBase.vue -->
<script setup>
defineProps({
    open: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['close'])
</script>

<template>
    <Transition name="fade">
        <div v-if="open" class="modal_overlay" @click.self="emit('close')">
            <div class="modal_box">
                <button class="modal_close" @click="emit('close')">
                    <span class="icon-mask icon-close" role="img" aria-label="Schließen"></span>
                </button>

                <h3>{{ title }}</h3>

                <slot />
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal_overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;

    background: rgba(0, 0, 0, 0.5);

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
}

.modal_box {
    position: relative;
    width: 100%;
    max-width: 400px;

    background: var(--background-base);
    border-radius: 20px;
    padding: 2rem 1.5rem;

    /* Popups haben immer weißen Hintergrund -> Text/Icons müssen immer braun bleiben,
       unabhängig vom personalisierten Theme (HELL/Darkmode würde sonst weiß = unsichtbar). */
    --text-dunkel: var(--braun);
}

.modal_close {
    position: absolute;
    top: 1rem;
    right: 1rem;

    background: none;
    border: none;
    cursor: pointer;
}

.modal_close .icon-mask {
    width: 20px;
    display: block;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal_box h3 {
    color: var(--braun);
}

@media (min-width: 768px) {
    .modal_box {
        max-width: 420px;
        padding: 2.5rem 2rem;
    }
}
</style>