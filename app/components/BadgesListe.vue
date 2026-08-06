<script setup>
const supabase = useSupabaseClient()

const badges = ref([])
const levels = ref({ BILD: 1, VIDEO: 1, AUDIO: 1, MUSIK: 1 })
const loading = ref(true)

const kategorieLabels = {
    BILD: 'BILDER',
    VIDEO: 'VIDEOS',
    AUDIO: 'AUDIO',
    MUSIK: 'MUSIK'
}

onMounted(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (currentUser) {
        badges.value = await ladeBadgesMitStatus(supabase, currentUser.id)

        const { data: profilData } = await supabase
            .from('profiles')
            .select('level_bild, level_video, level_audio, level_musik')
            .eq('id', currentUser.id)
            .single()

        if (profilData) {
            levels.value = {
                BILD: profilData.level_bild ?? 1,
                VIDEO: profilData.level_video ?? 1,
                AUDIO: profilData.level_audio ?? 1,
                MUSIK: profilData.level_musik ?? 1
            }
        }
    }

    loading.value = false
})

function fortschrittProzent(level) {
    return Math.min((level / 10) * 100, 100)
}
</script>

<template>
    <div class="badges_container">


        <h3 class="h3_black">FORTSCHRITT</h3>

        <div v-if="!loading" class="fortschritt_liste">
            <div v-for="(label, kat) in kategorieLabels" :key="kat" class="fortschritt_zeile">
                <div class="fortschritt_kopf">
                    <span class="fortschritt_label">{{ label }}</span>
                    <span class="fortschritt_level">Level {{ levels[kat] }}</span>
                </div>

                <div class="fortschritt_balken_hintergrund">
                    <div class="fortschritt_balken_fuellung" :style="{ width: fortschrittProzent(levels[kat]) + '%' }">
                    </div>
                </div>
            </div>
        </div>

        <h3 class="h3_black">ABZEICHEN</h3>

        <p v-if="loading">Lädt...</p>

        <div v-else class="badges_grid">
            <div v-for="badge in badges" :key="badge.id" class="badge_item" :title="badge.beschreibung">
                <div class="badge_icon"
                    :class="{ badge_icon_erreicht: badge.erreicht, badge_icon_gesperrt: !badge.erreicht }"
                    :style="{ '-webkit-mask-image': `url(${badge.icon})`, maskImage: `url(${badge.icon})` }"></div>
                <span class="badge_name" :class="{ badge_name_gesperrt: !badge.erreicht }">{{ badge.name }}</span>
            </div>
        </div>


        <div class="badges_trennlinie"></div>


    </div>

</template>

<style scoped>
.badges_container {
    width: 80%;
    margin: 0 auto;
    margin-top: 6rem;
    padding-bottom: 3rem;
}

.badges_trennlinie {
    width: 100%;
    height: 1px;
    background: rgba(0, 0, 0, 0.15);
    margin-bottom: 1rem;
    margin-top: 5rem;
}


.fortschritt_liste {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-top: 1rem;
    margin-bottom: 2.5rem;
}

.fortschritt_zeile {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.fortschritt_kopf {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.fortschritt_label {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.8rem;
    color: var(--text-dunkel);
}

.fortschritt_level {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.7rem;
    color: var(--gelb);
}

.fortschritt_balken_hintergrund {
    width: 100%;
    height: 8px;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    overflow: hidden;
}

.fortschritt_balken_fuellung {
    height: 100%;
    background: var(--gelb);
    border-radius: 10px;
    transition: width 0.4s ease;
}

.badges_container h3 {
    text-align: left;
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

.badge_icon {
    width: 32px;
    height: 32px;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
}

.badge_icon_erreicht {
    background-color: var(--gelb);
}

.badge_icon_gesperrt {
    background-color: var(--text-dunkel);
    opacity: 0.25;
}

.badge_name {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.65rem;
    color: var(--text-dunkel);
}

.badge_name_gesperrt {
    opacity: 0.4;
}

@media (min-width: 768px) {
    .badges_container {
        max-width: 620px;
    }

    .fortschritt_liste {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem 2rem;
    }

    .fortschritt_label {
        font-size: 0.95rem;
    }

    .fortschritt_level {
        font-size: 0.85rem;
    }

    .badges_grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.8rem;
    }

    .badge_icon {
        width: 42px;
        height: 42px;
    }

    .badge_name {
        font-size: 0.8rem;
    }
}

@media (min-width: 1024px) {
    .badges_container {
        max-width: 720px;
    }

    .fortschritt_liste {
        gap: 1.6rem 2.5rem;
    }

    .badges_grid {
        grid-template-columns: repeat(5, 1fr);
        gap: 2rem;
    }

    .badge_icon {
        width: 46px;
        height: 46px;
    }

    .badge_name {
        font-size: 0.85rem;
    }
}

@media (min-width: 1440px) {
    .badges_container {
        max-width: 820px;
    }

    .badges_grid {
        grid-template-columns: repeat(6, 1fr);
    }
}
</style>