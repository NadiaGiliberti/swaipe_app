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

// Refs für den Avatar-Upload
const fileInput = ref(null)
const avatarLoading = ref(false)

// Refs für das Bearbeiten des Usernamens
const isEditingUsername = ref(false)
const editUsernameInput = ref('')
const usernameError = ref('')
const usernameSaving = ref(false)

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
        editUsernameInput.value = data.username
    }

    loading.value = false
}

onMounted(() => {
    ladeProfil()
})

// Triggert den Klick auf das versteckte Datei-Auswahl-Feld
function handleEditAvatar() {
    if (fileInput.value) {
        fileInput.value.click()
    }
}

// Hilfsfunktion: Komprimiert das Bild mit Hilfe eines HTML Canvas Elementes
function compressImage(file, maxWidth = 400, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target.result
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width)
                    width = maxWidth
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob)
                    } else {
                        reject(new Error('Kompression fehlgeschlagen.'))
                    }
                }, 'image/jpeg', quality)
            }
            img.onerror = (err) => reject(err)
        }
        reader.onerror = (err) => reject(err)
    })
}

// Verarbeitet das ausgewählte Bild, komprimiert es und lädt es hoch
async function handleAvatarUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    avatarLoading.value = true
    errorMsg.value = ''

    try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (!currentUser) throw new Error('Nicht eingeloggt.')

        const compressedBlob = await compressImage(file, 400, 0.7)
        const fileName = `avatar_${Date.now()}.jpg`
        const filePath = `${currentUser.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, compressedBlob, {
                contentType: 'image/jpeg',
                upsert: true
            })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        const { error: dbError } = await supabase
            .from('profiles')
            .update({ profilbild_url: publicUrl })
            .eq('id', currentUser.id)

        if (dbError) throw dbError

        profil.value.profilbild_url = publicUrl

    } catch (error) {
        errorMsg.value = `Avatar-Fehler: ${error.message || error}`
    } finally {
        avatarLoading.value = false
    }
}

// Aktiviert den Bearbeitungsmodus für den Usernamen
function startEditingUsername() {
    editUsernameInput.value = profil.value.username
    usernameError.value = ''
    isEditingUsername.value = true
}

// Speichert den neuen Usernamen, wenn er geändert wurde
async function saveUsername() {
    if (usernameSaving.value) return
    usernameSaving.value = true

    const cleanedName = editUsernameInput.value.trim()

    if (!cleanedName || cleanedName === profil.value.username) {
        isEditingUsername.value = false
        usernameSaving.value = false
        return
    }

    if (cleanedName.length > 15) {
        usernameError.value = 'Der Username darf maximal 15 Zeichen lang sein.'
        usernameSaving.value = false
        return
    }

    try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (!currentUser) throw new Error('Nicht eingeloggt.')

        const { error } = await supabase
            .from('profiles')
            .update({ username: cleanedName })
            .eq('id', currentUser.id)

        if (error) {
            if (error.code === '23505') {
                usernameError.value = 'Dieser Username ist bereits vergeben.'
            } else {
                usernameError.value = `Fehler beim Speichern: ${error.message}`
            }
            return
        }

        profil.value.username = cleanedName
        isEditingUsername.value = false
        usernameError.value = ''
    } catch (error) {
        usernameError.value = `Fehler beim Speichern: ${error.message}`
    } finally {
        usernameSaving.value = false
    }
}

function cancelEditingUsername() {
    editUsernameInput.value = profil.value.username
    isEditingUsername.value = false
    usernameError.value = ''
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
        errorMsg.value = error.message
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
const vFocus = {
    mounted: (el) => el.focus()
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
                    <img :src="profil.profilbild_url || '/icons/profil_icon.svg'" id="profilbildUser"
                        :style="{ opacity: avatarLoading ? 0.5 : 1 }" alt="Profilbild">

                    <input type="file" ref="fileInput" style="display: none" accept="image/png, image/jpeg, image/webp"
                        @change="handleAvatarUpload">

                    <button class="button_edit" :disabled="avatarLoading" @click="handleEditAvatar">
                        <img src="/icons/edit_icon.svg" id="profilbildUserEdit" alt="Profilbild bearbeiten">
                    </button>
                </div>

                <div class="container_username_edit">
                    <input v-if="isEditingUsername" v-model="editUsernameInput" type="text" class="input_username"
                        maxlength="15" @keydown.enter="saveUsername" @keydown.esc="cancelEditingUsername"
                        @blur="saveUsername" v-focus>
                    <h3 v-else class="h3_black username_clickable" @click="startEditingUsername">
                        {{ profil.username }}
                    </h3>
                </div>
                <p v-if="isEditingUsername && usernameError" class="error_text">{{ usernameError }}</p>
            </div>

            <badgesListe />

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

        <ModalBase :open="showEmailModal" title="E-MAIL ÄNDERN" @close="closeEmailModal">
            <div class="container_formularfeld">
                <label for="new-email">NEUE E-MAIL</label>
                <input id="new-email" v-model="newEmail" type="email" class="formularfeld" required>
            </div>

            <p v-if="actionError" class="error_text">{{ actionError }}</p>
            <p v-if="actionSuccess" class="success_text">{{ actionSuccess }}</p>

            <div class="container_buttons_wm">
                <button class="button" :disabled="actionLoading" @click="handleEmailChange">
                    {{ actionLoading ? 'LÄDT...' : 'SPEICHERN' }}
                </button>
            </div>
        </ModalBase>

        <ModalBase :open="showPasswordModal" title="PASSWORT ÄNDERN" @close="closePasswordModal">
            <div class="container_formularfeld">
                <label for="new-password">NEUES PASSWORT</label>
                <input id="new-password" v-model="newPassword" type="password" class="formularfeld" minlength="6"
                    required>
            </div>

            <p v-if="actionError" class="error_text">{{ actionError }}</p>
            <p v-if="actionSuccess" class="success_text">{{ actionSuccess }}</p>

            <div class="container_buttons_wm">
                <button class="button" :disabled="actionLoading" @click="handlePasswordChange">
                    {{ actionLoading ? 'LÄDT...' : 'SPEICHERN' }}
                </button>
            </div>
        </ModalBase>

        <ModalBase :open="showDeleteModal" title="ACCOUNT DEAKTIVIEREN" @close="closeDeleteModal">
            <p>Wichtiger Hinweis: Dein Account wird deaktiviert und du wirst automatisch abgemeldet. Danach hast du
                keinen
                Zugriff mehr auf dein Profil. Falls du es dir später anders überlegst, kann dir unser Support beim
                Reaktivieren
                helfen.</p>

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
/* Trick für CSS-Validierung im Kombi-Block */

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
    height: 25vw;
    border-radius: 50%;
    object-fit: cover;
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

/* NEUE STYLES FÜR DEN USERNAME-EDIT */
.container_username_edit {
    margin-top: 2vh;
    min-height: 40px;
    /* Verhindert Springen des Layouts */
    display: flex;
    align-items: center;
    justify-content: center;
}

.username_clickable {
    cursor: pointer;
    transition: opacity 0.2s;
    text-transform: uppercase;
}

@media (hover: hover) and (pointer: fine) {
    .username_clickable:hover {
        opacity: 0.7;
        /* Gibt dem User visuelles Feedback, dass es klickbar ist */
    }
}

.input_username {
    font-family: 'BarlowCondensed', sans-serif;
    /* Gleiche Schriftart wie deine h3_black */
    font-size: 1.17em;
    /* Ungefähre h3-Größe */
    font-weight: bold;
    text-align: center;
    border: none;
    border-bottom: 2px solid var(--braun, #000);
    /* Kleiner Unterstrich beim Editieren */
    text-transform: uppercase;
    outline: none;
    background: transparent;
    padding: 2px;
    width: 60vw;
}

.container_aktionen {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-bottom: 8rem;
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