<script setup>
const supabase = useSupabaseClient()

const profil = ref(null)
const loading = ref(true)
const errorMsg = ref('')

const showEmailModal = ref(false)
const showPasswordModal = ref(false)
const showDeleteModal = ref(false)

const newEmail = ref('')
const newPassword = ref('')
const actionError = ref('')
const actionSuccess = ref('')
const actionLoading = ref(false)

async function ladeProfil() {
    loading.value = true
    errorMsg.value = ''

    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

    if (userError || !currentUser) {
        errorMsg.value = 'Nicht eingeloggt.'
        loading.value = false
        return
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

    if (error) {
        errorMsg.value = error.message
    } else {
        profil.value = data
    }

    loading.value = false
}

onMounted(() => {
    ladeProfil()
})

function handleEditAvatar() {
    // später: Datei-Upload / Avatar-Auswahl öffnen
}

function resetActionState() {
    actionError.value = ''
    actionSuccess.value = ''
}

function closeEmailModal() {
    showEmailModal.value = false
    newEmail.value = ''
    resetActionState()
}

function closePasswordModal() {
    showPasswordModal.value = false
    newPassword.value = ''
    resetActionState()
}

function closeDeleteModal() {
    showDeleteModal.value = false
    resetActionState()
}

async function handleEmailChange() {
    resetActionState()
    actionLoading.value = true

    const { error } = await supabase.auth.updateUser({ email: newEmail.value })

    actionLoading.value = false

    if (error) {
        actionError.value = error.message
        return
    }

    actionSuccess.value = 'Bestätigungslink wurde an die neue E-Mail gesendet.'
}

async function handlePasswordChange() {
    resetActionState()
    actionLoading.value = true

    const { error } = await supabase.auth.updateUser({ password: newPassword.value })

    actionLoading.value = false

    if (error) {
        actionError.value = error.message
        return
    }

    actionSuccess.value = 'Passwort erfolgreich geändert.'
    newPassword.value = ''
}

async function handleDeactivateAccount() {
    resetActionState()
    actionLoading.value = true

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('profiles')
        .update({ aktiv: false })
        .eq('id', currentUser.id)

    if (error) {
        actionError.value = error.message
        actionLoading.value = false
        return
    }

    await supabase.auth.signOut()
    await navigateTo('/login')
}
</script>

<template>
    <main class="container_main">

        <h1 class="h1_black">PROFIL</h1>

        <p v-if="loading">Lädt...</p>
        <p v-else-if="errorMsg">{{ errorMsg }}</p>

        <template v-else-if="profil">
            <div class="container_user">
                <div class="container_userbild">
                    <img
                        :src="profil.profilbild_url || '/icons/profil_icon.svg'"
                        id="profilbildUser"
                        alt="Profilbild"
                    >
                    <button class="button_edit" @click="handleEditAvatar">
                        <img src="/icons/edit_icon.svg" id="profilbildUserEdit" alt="Profilbild bearbeiten">
                    </button>
                </div>

                <h3 class="h3_black">{{ profil.username }}</h3>
            </div>

            <div class="container_aktionen">
                <button class="aktion" @click="showEmailModal = true">
                    E-MAIL ÄNDERN
                </button>
                <button class="aktion" @click="showPasswordModal = true">
                    PASSWORT ÄNDERN
                </button>
                <button class="aktion" @click="showDeleteModal = true">
                    ACCOUNT DEAKTIVIEREN
                </button>
            </div>
        </template>

        <buttonZurueck />

        <!-- E-Mail ändern -->
        <ModalBase :open="showEmailModal" title="E-MAIL ÄNDERN" @close="closeEmailModal">
            <div class="container_formularfeld">
                <label for="new-email">NEUE E-MAIL</label>
                <input
                    id="new-email"
                    v-model="newEmail"
                    type="email"
                    class="formularfeld"
                    required
                >
            </div>

            <p v-if="actionError" class="error_text">{{ actionError }}</p>
            <p v-if="actionSuccess" class="success_text">{{ actionSuccess }}</p>

            <div class="container_buttons_wm">
                <button class="button" :disabled="actionLoading" @click="handleEmailChange">
                    {{ actionLoading ? 'LÄDT...' : 'SPEICHERN' }}
                </button>
            </div>
        </ModalBase>

        <!-- Passwort ändern -->
        <ModalBase :open="showPasswordModal" title="PASSWORT ÄNDERN" @close="closePasswordModal">
            <div class="container_formularfeld">
                <label for="new-password">NEUES PASSWORT</label>
                <input
                    id="new-password"
                    v-model="newPassword"
                    type="password"
                    class="formularfeld"
                    minlength="6"
                    required
                >
            </div>

            <p v-if="actionError" class="error_text">{{ actionError }}</p>
            <p v-if="actionSuccess" class="success_text">{{ actionSuccess }}</p>

            <div class="container_buttons_wm">
                <button class="button" :disabled="actionLoading" @click="handlePasswordChange">
                    {{ actionLoading ? 'LÄDT...' : 'SPEICHERN' }}
                </button>
            </div>
        </ModalBase>

        <!-- Account deaktivieren -->
        <ModalBase :open="showDeleteModal" title="ACCOUNT DEAKTIVIEREN" @close="closeDeleteModal">
            <p>Dein Account wird deaktiviert und du wirst ausgeloggt. Melde dich beim Support, falls du reaktivieren möchtest.</p>

            <p v-if="actionError" class="error_text">{{ actionError }}</p>

            <div class="container_buttons_wm">
                <button class="button button_danger" :disabled="actionLoading" @click="handleDeactivateAccount">
                    {{ actionLoading ? 'DEAKTIVIERT...' : 'JETZT DEAKTIVIEREN' }}
                </button>
            </div>
        </ModalBase>

    </main>
</template>

<style>
.container_user {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5vh;
}

.container_userbild {
    position: relative;
    display: inline-block;
}

#profilbildUser {
    width: 25vw;
    display: block;
}

.button_edit {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -1.4vw;
    right: -1.4vw;
    cursor: pointer;
    padding: 0;
}

#profilbildUserEdit {
    width: 4.5vw;
    display: block;
}

.container_aktionen {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 10vh;
    width: 80%;
}

.aktion {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 6vw;
}

.error_text {
    color: var(--background-3);
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.85rem;
    margin-top: 0.5rem;
}

.success_text {
    color: var(--braun);
    font-family: 'DotGothic16', sans-serif;
    font-size: 0.85rem;
    margin-top: 0.5rem;
}

.button_danger {
    background: var(--background-3);
}
</style>