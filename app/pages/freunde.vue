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

const showEntfernenModal = ref(false)
const zuEntfernenderFreund = ref(null)

async function ladeAlles() {
    loading.value = true
    const result = await ladeFreundeUndAnfragen(supabase)
    freunde.value = result.freunde
    eingehendeAnfragen.value = result.eingehendeAnfragen
    ausgehendeAnfragen.value = result.ausgehendeAnfragen
    loading.value = false

    setTimeout(() => {
        markiereFreundschaftenAlsGesehen(supabase)
    }, 1500)
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

function oeffneEntfernenModal(freund) {
    zuEntfernenderFreund.value = freund
    showEntfernenModal.value = true
}

function schliesseEntfernenModal() {
    showEntfernenModal.value = false
    zuEntfernenderFreund.value = null
}

async function bestaetigeEntfernen() {
    if (!zuEntfernenderFreund.value) return
    await entferneFreund(supabase, zuEntfernenderFreund.value.freundschaftId)
    schliesseEntfernenModal()
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
                    <img v-if="freund.profilbild_url" :src="freund.profilbild_url" class="freund_avatar bild_umrandet" alt="Profil">
                    <div v-else class="freund_avatar avatar_placeholder" role="img" aria-label="Profil"></div>
                    <span class="freund_name_wrapper">
                        {{ freund.username }}
                        <span v-if="freund.istNeu" class="punkt_neu"></span>
                    </span>
                    <button class="button_entfernen" @click="oeffneEntfernenModal(freund)">
                        <span class="icon-mask icon-delete" role="img" aria-label="Entfernen"></span>
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
                        <img v-if="user.profilbild_url" :src="user.profilbild_url" class="freund_avatar bild_umrandet" alt="Profil">
                        <div v-else class="freund_avatar avatar_placeholder" role="img" aria-label="Profil"></div>
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
                    <img v-if="anfrage.profilbild_url" :src="anfrage.profilbild_url" class="freund_avatar bild_umrandet" alt="Profil">
                    <div v-else class="freund_avatar avatar_placeholder" role="img" aria-label="Profil"></div>
                    <span class="freund_name_wrapper">
                        {{ anfrage.username }}
                        <span v-if="anfrage.istNeu" class="punkt_neu"></span>
                    </span>
                    <button class="button_check" @click="handleAkzeptieren(anfrage.freundschaftId)">
                        <span class="icon-mask icon-check" role="img" aria-label="Annehmen"></span>
                    </button>
                    <button class="button_x" @click="handleAblehnen(anfrage.freundschaftId)">
                        <span class="icon-mask icon-close" role="img" aria-label="Ablehnen"></span>
                    </button>
                </div>
            </div>

            <div class="container_anfragen" v-if="ausgehendeAnfragen.length > 0">
                <h3>GESENDETE ANFRAGEN</h3>
                <div v-for="anfrage in ausgehendeAnfragen" :key="anfrage.freundschaftId" class="freund_item">
                    <img v-if="anfrage.profilbild_url" :src="anfrage.profilbild_url" class="freund_avatar bild_umrandet" alt="Profil">
                    <div v-else class="freund_avatar avatar_placeholder" role="img" aria-label="Profil"></div>
                    <span>{{ anfrage.username }}</span>
                    <button class="button_x" @click="handleAnfrageZurueckziehen(anfrage.freundschaftId)">
                        <span class="icon-mask icon-close" role="img" aria-label="Zurückziehen"></span>
                    </button>
                </div>
            </div>

            <p v-if="errorMsg" class="error_text">{{ errorMsg }}</p>
        </template>

        <buttonZurueck />

        <ModalBase :open="showEntfernenModal" title="FREUND ENTFERNEN" @close="schliesseEntfernenModal">
            <p v-if="zuEntfernenderFreund">
                Möchtest du {{ zuEntfernenderFreund.username }} wirklich aus deiner Freundesliste entfernen?
            </p>

            <div class="container_buttons_wm">
                <button class="button button_danger" @click="bestaetigeEntfernen">
                    ENTFERNEN
                </button>
                <button class="button button_abbrechen" @click="schliesseEntfernenModal">
                    ABBRECHEN
                </button>
            </div>
        </ModalBase>

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

.bild_umrandet {
    border: 2.5px solid var(--text-dunkel);
}

.freund_item span {
    text-transform: uppercase;
    flex: 1;
}

.freund_name_wrapper {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.freund_item span.punkt_neu {
    width: 8px;
    height: 8px;
    background: var(--gelb);
    border-radius: 50%;
    flex: 0 0 8px;
}

.button_entfernen,
.button_check,
.button_x {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.button_entfernen .icon-mask,
.button_check .icon-mask,
.button_x .icon-mask {
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
    margin-top: 0.5rem;
}

.suche_feld .formularfeld {
    flex: 1;
    padding-right: 3.5rem;
    border-radius: 100px;
    height: 2.5rem;
}

.button_suche {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: var(--braun);
    border: none;
    border-radius: 50%;
    width: 2.6rem;
    height: 2.6rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.button_suche img {
    width: 1.4rem;
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

.button_abbrechen {
    background: var(--braun);
    opacity: 0.6;
}

@media (min-width: 768px) {
    .container_freunde_liste,
    .container_anfragen {
        width: 100%;
        max-width: 520px;
        gap: 0.6rem;
    }

    .container_suche {
        width: 100%;
        max-width: 520px;
    }

    .freund_avatar {
        width: 40px;
        height: 40px;
    }

    .freund_item span {
        font-size: 1.1rem;
    }

    .hinweis_text {
        font-size: 1rem;
    }

    .hinweis_text_klein {
        font-size: 0.85rem;
    }

    .suche_feld .formularfeld {
        height: 3rem;
        font-size: 1rem;
    }

    .button_suche {
        width: 3rem;
        height: 3rem;
    }

    .button_klein_anfrage {
        font-size: 0.85rem;
        padding: 0.4rem 1rem;
    }
}

@media (min-width: 1024px) {
    .container_freunde_liste,
    .container_anfragen,
    .container_suche {
        max-width: 600px;
    }

    .freund_avatar {
        width: 44px;
        height: 44px;
    }
}
</style>