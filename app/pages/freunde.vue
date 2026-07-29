<script setup>
const supabase = useSupabaseClient()

const freunde = ref([])
const eingehendeAnfragen = ref([])
const ausgehendeAnfragen = ref([])
const loading = ref(true)
const errorMsg = ref('')

const sucheInput = ref('')
const sucheErgebnisse = ref([])
const sucheLaeuft = ref(false)

async function ladeAlles() {
    loading.value = true
    const result = await ladeFreundeUndAnfragen(supabase)
    freunde.value = result.freunde
    eingehendeAnfragen.value = result.eingehendeAnfragen
    ausgehendeAnfragen.value = result.ausgehendeAnfragen
    loading.value = false
}

onMounted(() => {
    ladeAlles()
})

function bereitsAngefragt(userId) {
    return ausgehendeAnfragen.value.some(a => a.id === userId)
}

function istBereitsFreund(userId) {
    return freunde.value.some(f => f.id === userId)
}

async function handleSuche() {
    if (!sucheInput.value.trim()) {
        sucheErgebnisse.value = []
        return
    }

    sucheLaeuft.value = true
    sucheErgebnisse.value = await sucheUser(supabase, sucheInput.value.trim())
    sucheLaeuft.value = false
}

async function handleAnfrageSenden(userId) {
    errorMsg.value = ''
    const { error } = await sendeFreundschaftsanfrage(supabase, userId)
    if (error) {
        errorMsg.value = error.message
        return
    }
    await ladeAlles()
}

async function handleAnfrageZurueckziehen(freundschaftId) {
    await lehneAnfrageAb(supabase, freundschaftId)
    await ladeAlles()
}

async function handleAkzeptieren(freundschaftId) {
    await akzeptiereAnfrage(supabase, freundschaftId)
    await ladeAlles()
}

async function handleAblehnen(freundschaftId) {
    await lehneAnfrageAb(supabase, freundschaftId)
    await ladeAlles()
}

async function handleEntfernen(freundschaftId) {
    await entferneFreund(supabase, freundschaftId)
    await ladeAlles()
}
</script>

<template>
    <main class="container_main">

        <h1>FREUNDE</h1>

        <p v-if="loading">Lädt...</p>

        <template v-else>
            <div class="container_freunde_liste">
                <div v-for="freund in freunde" :key="freund.freundschaftId" class="freund_item">
                    <img :src="freund.profilbild_url || '/icons/profil_icon.svg'" class="freund_avatar">
                    <span>{{ freund.username }}</span>
                    <button class="button_entfernen" @click="handleEntfernen(freund.freundschaftId)">
                        <img src="/icons/delete_icon.svg" alt="Entfernen">
                    </button>
                </div>
                <p v-if="freunde.length === 0" class="hinweis_text">Noch keine Freunde hinzugefügt.</p>
            </div>

            <div class="container_suche">
                <h3>FREUNDE EINLADEN</h3>
                <div class="suche_feld">
                    <input v-model="sucheInput" type="text" class="formularfeld" placeholder="Username eingeben"
                        @keyup.enter="handleSuche">
                    <button class="button_suche" @click="handleSuche">
                        <img src="/icons/search_icon.svg" alt="Suchen">
                    </button>
                </div>

                <div v-if="sucheErgebnisse.length > 0" class="container_suchergebnisse">
                    <div v-for="user in sucheErgebnisse" :key="user.id" class="freund_item">
                        <img :src="user.profilbild_url || '/icons/profil_icon.svg'" class="freund_avatar">
                        <span>{{ user.username }}</span>

                        <span v-if="istBereitsFreund(user.id)" class="hinweis_text_klein">Bereits Freunde</span>
                        <span v-else-if="bereitsAngefragt(user.id)" class="hinweis_text_klein">Angefragt</span>
                        <button v-else class="button_klein_anfrage" @click="handleAnfrageSenden(user.id)">
                            HINZUFÜGEN
                        </button>
                    </div>
                </div>
                <p v-else-if="sucheLaeuft">Suche läuft...</p>
            </div>

            <div class="container_anfragen" v-if="eingehendeAnfragen.length > 0">
                <h3>ANFRAGEN</h3>
                <div v-for="anfrage in eingehendeAnfragen" :key="anfrage.freundschaftId" class="freund_item">
                    <img :src="anfrage.profilbild_url || '/icons/profil_icon.svg'" class="freund_avatar">
                    <span>{{ anfrage.username }}</span>
                    <button class="button_check" @click="handleAkzeptieren(anfrage.freundschaftId)">
                        <img src="/icons/check_icon.svg" alt="Annehmen">
                    </button>
                    <button class="button_x" @click="handleAblehnen(anfrage.freundschaftId)">
                        <img src="/icons/close_icon.svg" alt="Ablehnen">
                    </button>
                </div>
            </div>

            <div class="container_anfragen" v-if="ausgehendeAnfragen.length > 0">
                <h3>GESENDETE ANFRAGEN</h3>
                <div v-for="anfrage in ausgehendeAnfragen" :key="anfrage.freundschaftId" class="freund_item">
                    <img :src="anfrage.profilbild_url || '/icons/profil_icon.svg'" class="freund_avatar">
                    <span>{{ anfrage.username }}</span>
                    <button class="button_x" @click="handleAnfrageZurueckziehen(anfrage.freundschaftId)">
                        <img src="/icons/close_icon.svg" alt="Zurückziehen">
                    </button>
                </div>
            </div>

            <p v-if="errorMsg" class="error_text">{{ errorMsg }}</p>
        </template>

        <buttonZurueck />

    </main>
</template>

<style>
.container_freunde_liste {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    width: 85%;
    margin-top: 3rem;
}

.freund_item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.freund_avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

.freund_item span {
    text-transform: uppercase;
    flex: 1;
}

.button_entfernen,
.button_check,
.button_x {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.button_entfernen img,
.button_check img,
.button_x img {
    width: 20px;
    display: block;
}

.container_suche {
    width: 80%;
    margin-top: 3rem;
}

.suche_feld {
    position: relative;
    display: flex;
    align-items: center;
}

.suche_feld .formularfeld {
    flex: 1;
    margin-top: 0;
    padding-right: 3.5rem;
    border-radius: 100px;
    height: 3rem;
    /* feste Höhe, damit du sie kennst */
}

.button_suche {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: var(--braun);
    border: none;
    border-radius: 50%;
    width: 3.1rem;
    /* etwas GRÖSSER als .formularfeld Höhe (3rem) */
    height: 3.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.button_suche img {
    width: 2rem;
    display: block;
}

.container_suchergebnisse {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
}

.button_klein_anfrage {
    background: var(--braun);
    color: white;
    border: none;
    border-radius: 20px;
    padding: 0.3rem 0.8rem;
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.75rem;
    cursor: pointer;
}

.hinweis_text {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.85rem;
    text-align: center;
}

.hinweis_text_klein {
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.75rem;
    color: var(--braun);
}

.container_anfragen {
    width: 85%;
    margin-top: 3rem;
}
</style>