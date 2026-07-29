<script setup>
const supabase = useSupabaseClient()

const badges = ref([])
const loading = ref(true)

onMounted(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
        badges.value = await ladeBadgesMitStatus(supabase, currentUser.id)
    }
    loading.value = false
})
</script>

<template>
    <div class="badges_container">
        <h3>ABZEICHEN</h3>

        <p v-if="loading">Lädt...</p>

        <div v-else class="badges_grid">
            <div
                v-for="badge in badges"
                :key="badge.id"
                class="badge_item"
                :class="{ badge_item_gesperrt: !badge.erreicht }"
                :title="badge.beschreibung"
            >
                <img :src="badge.icon" class="badge_icon" :alt="badge.name">
                <span class="badge_name">{{ badge.name }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.badges_container {
    width: 100%;
    margin-top: 2rem;
}

.badges_grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    margin-top: 1rem;
}

.badge_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    text-align: center;
}

.badge_item_gesperrt {
    opacity: 0.25;
}

.badge_icon {
    width: 32px;
    height: 32px;
    color: var(--braun);
}

.badge_name {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.65rem;
    color: var(--text-dunkel);
}
</style>