<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const aktiverTab = ref('freunde')
const loading = ref(true)

const topAlleListe = ref([])
const eigenerRang = ref(null)
const eigenerEintrag = ref(null)

const freundeRanking = ref([])
const freundeAlleAnzeigen = ref(false)

async function ladeAlle() {
  const result = await ladeTopAlle(supabase, 5)
  topAlleListe.value = result.liste
  eigenerRang.value = result.eigenerRang
  eigenerEintrag.value = result.eigenerEintrag
}

async function ladeFreunde() {
  if (!user.value) return
  freundeRanking.value = await ladeFreundeRanking(supabase, user.value.id)
}

onMounted(async () => {
  loading.value = true
  await Promise.all([ladeAlle(), ladeFreunde()])
  loading.value = false
})

const sichtbareFreunde = computed(() => {
  return freundeAlleAnzeigen.value ? freundeRanking.value : freundeRanking.value.slice(0, 5)
})

function istEigenerUser(id) {
  return user.value && id === user.value.id
}
</script>

<template>
  <main class="container_main">

    <h1>BESTENLISTE</h1>

    <div class="container_tabs">
      <button class="tab_button" :class="{ tab_button_aktiv: aktiverTab === 'freunde' }"
        @click="aktiverTab = 'freunde'">
        FREUNDE
      </button>
      <button class="tab_button" :class="{ tab_button_aktiv: aktiverTab === 'alle' }" @click="aktiverTab = 'alle'">
        GLOBAL
      </button>
    </div>

    <p v-if="loading">Lädt...</p>

    <template v-else>

      <!-- FREUNDE -->
      <div v-if="aktiverTab === 'freunde'" class="container_rangliste">
        <div v-for="(eintrag, index) in sichtbareFreunde" :key="eintrag.id" class="rang_item"
          :class="{ rang_item_ich: eintrag.istIch }">
          <span class="rang_nummer">{{ index + 1 }}.</span>
          <img v-if="eintrag.profilbild_url" :src="eintrag.profilbild_url" class="rang_avatar bild_umrandet">
          <div v-else class="rang_avatar avatar_placeholder" role="img" aria-label="Profil"></div>
          <span class="rang_name">
            {{ eintrag.istIch ? 'DU' : eintrag.username }}
            <span class="rang_datum">am {{ formatDatum(eintrag.highscore_datum) }}</span>
          </span>
          <span class="rang_score">{{ (eintrag.highscore ?? 0).toLocaleString('de-CH') }}</span>
        </div>

        <p v-if="freundeRanking.length === 0" class="hinweis_text">Noch keine Freunde.</p>

        <button v-if="freundeRanking.length > 5 && !freundeAlleAnzeigen" class="button_alle_anzeigen"
          @click="freundeAlleAnzeigen = true">
          alle Freunde anzeigen
        </button>
      </div>

      <!-- ALLE -->
<div v-if="aktiverTab === 'alle'" class="container_rangliste">
    <div v-for="(eintrag, index) in topAlleListe" :key="eintrag.id" class="rang_item"
        :class="{ rang_item_ich: eintrag.istIch }">
        <span class="rang_nummer">{{ index + 1 }}.</span>
        <img v-if="eintrag.profilbild_url" :src="eintrag.profilbild_url" class="rang_avatar bild_umrandet">
        <div v-else class="rang_avatar avatar_placeholder" role="img" aria-label="Profil"></div>
        <span class="rang_name">
            {{ eintrag.istIch ? 'DU' : eintrag.username }}
            <span class="rang_datum">am {{ formatDatum(eintrag.highscore_datum) }}</span>
        </span>
        <span class="rang_score">{{ (eintrag.highscore ?? 0).toLocaleString('de-CH') }}</span>
    </div>

    <template v-if="eigenerRang && eigenerEintrag">
        <div class="rang_trenner">...</div>
        <div class="rang_item rang_item_ich">
            <span class="rang_nummer">{{ eigenerRang }}.</span>
            <img v-if="eigenerEintrag.profilbild_url" :src="eigenerEintrag.profilbild_url" class="rang_avatar bild_umrandet">
            <div v-else class="rang_avatar avatar_placeholder" role="img" aria-label="Profil"></div>
            <span class="rang_name">
                DU
                <span class="rang_datum">am {{ formatDatum(eigenerEintrag.highscore_datum) }}</span>
            </span>
            <span class="rang_score">{{ (eigenerEintrag.highscore ?? 0).toLocaleString('de-CH') }}</span>
        </div>
    </template>
</div>
    </template>

    <buttonZurueck />

  </main>
</template>

<style>
.container_tabs {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.tab_button {
  background: none;
  border: none;
  font-family: 'DotGothic16', sans-serif;
  font-size: 1rem;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  color: var(--text-dunkel);
}

.tab_button_aktiv {
  background: rgba(255, 255, 255, 0.6);
  font-weight: bold;
}

.container_rangliste {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 85%;
  margin-top: 3rem;
}

.rang_item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.rang_item_ich .rang_name,
.rang_item_ich .rang_score {
  color: var(--gelb);
}

.rang_nummer {
  font-family: 'DotGothic16', sans-serif;
  font-size: 0.9rem;
  color: var(--text-dunkel);
  opacity: 0.7;
  min-width: 1.4rem;
}

.rang_avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.bild_umrandet {
  border: 1.5px solid var(--text-dunkel);
}

.rang_name {
  flex: 1;
  font-family: 'BarlowCondensed', sans-serif;
  font-size: 1.4rem;
  color: var(--text-dunkel);
  text-transform: uppercase;
}

.rang_datum {
  font-family: 'DotGothic16', sans-serif;
  font-size: 0.55rem;
  color: var(--text-dunkel);
  opacity: 0.7;
  margin-left: 0.4rem;
}

.rang_score {
  font-family: 'BarlowCondensed', sans-serif;
  font-size: 1.4rem;
  color: var(--text-dunkel);
}

.rang_trenner {
  text-align: center;
  color: var(--text-dunkel);
  opacity: 0.5;
}

.button_alle_anzeigen {
  background: none;
  border: none;
  color: var(--braun);
  font-family: 'DotGothic16', sans-serif;
  font-size: 0.75rem;
  text-align: right;
  cursor: pointer;
  margin-top: -0.5rem;
}

.hinweis_text {
  font-family: 'DotGothic16', sans-serif;
  font-size: 0.85rem;
  text-align: center;
}
</style>