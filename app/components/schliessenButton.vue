<!-- app/components/SchliessenButton.vue -->
<script setup>
const route = useRoute()
const versteckenAuf = ['/', '/login', '/registrieren']
const sichtbar = computed(() => !versteckenAuf.includes(route.path))
</script>

<template>
    <button v-if="sichtbar" class="schliessen_button" @click="navigateTo('/')">
        <img src="/icons/close_icon.svg" alt="Schliessen">
    </button>
</template>

<style scoped>
.schliessen_button {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9000;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.schliessen_button img {
    width: clamp(34px, 5vw, 44px);
    display: block;
}
</style>