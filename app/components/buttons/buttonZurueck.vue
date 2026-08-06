<script setup>
const router = useRouter()

defineProps({
    label: {
        type: String,
        default: 'ZURÜCK'
    }
})

function goBack() {
    router.back()
}
</script>

<template>
    <div class="container_back_button">
        <button class="button button_zurueck" @click="goBack">
            {{ label }}
        </button>
    </div>
</template>

<style>
.button_zurueck {
    background: var(--braun);
    padding: 0.1rem;
    margin-bottom: 1rem;
    width: 100%;
    font-size: 1.5rem;
}
</style>