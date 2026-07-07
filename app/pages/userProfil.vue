<script setup>
const username = ref('SPIELELELE123') // später aus deinem Auth/User-State

const showEmailModal = ref(false)
const showPasswordModal = ref(false)
const showDeleteModal = ref(false)

function handleEditAvatar() {
    // später: Datei-Upload / Avatar-Auswahl öffnen
}
</script>

<template>
    <main class="container_main">

        <h1 class="h1_black">PROFIL</h1>

        <div class="container_user">
            <div class="container_userbild">
                <img src="/icons/profil_icon.svg" id="profilbildUser" alt="Profilbild">
                <button class="button_edit" @click="handleEditAvatar">
                    <img src="/icons/edit_icon.svg" id="profilbildUserEdit" alt="Profilbild bearbeiten">
                </button>
            </div>

            <h3 class="h3_black">{{ username }}</h3>
        </div>

        <div class="container_aktionen">
            <button class="aktion" @click="showEmailModal = true">
                E-MAIL ÄNDERN
            </button>
            <button class="aktion" @click="showPasswordModal = true">
                PASSWORT ÄNDERN
            </button>
            <button class="aktion" @click="showDeleteModal = true">
                ACCOUNT LÖSCHEN
            </button>
        </div>

        <buttonZurueck />

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
</style>