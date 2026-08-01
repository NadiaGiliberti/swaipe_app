<script setup>
import { ref } from 'vue'

const supabase = useSupabaseClient()

const user = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const erfolgsmeldung = ref('')

async function registrieren() {
  if (!user.value || !email.value || !password.value) {
    alert('Bitte alle Felder ausfüllen.')
    return
  }

  if (user.value.length > 15) {
    alert('Der Username darf maximal 15 Zeichen lang sein.')
    return
  }

  loading.value = true
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        username: user.value
      }
    }
  })

  loading.value = false

  if (error) {
    alert(error.message)
    return
  }

  erfolgsmeldung.value = 'Fast geschafft! Wir haben dir einen Bestätigungslink an deine E-Mail-Adresse geschickt. Bitte klicke darauf, um deinen Account zu aktivieren.'
}
</script>



<template>
  <main class="container_main">

    <template v-if="!erfolgsmeldung">
      <form class="container_form" @submit.prevent="registrieren">
        <h1>REGISTRIEREN</h1>

        <div class="container_formularfeld">
          <label for="user">USERNAME</label>
          <input v-model="user" class="formularfeld" id="user" name="off" type="text" autocomplete="off"
            placeholder="Benutzername eingeben" maxlength="15" required>
        </div>

        <div class="container_formularfeld">
          <label for="email">E-MAIL</label>
          <input v-model="email" class="formularfeld" id="email" name="username" type="email" autocomplete="username"
            placeholder="E-Mail eingeben" required>
        </div>


        <div class="container_formularfeld">
          <label for="password">PASSWORT</label>
          <input v-model="password" class="formularfeld" id="password" name="new-password" type="password"
            autocomplete="new-password" placeholder="Passwort eingeben" required>
        </div>

        <a href="/login">Account vorhanden? Hier einloggen.</a>


        <div class="container_buttons_wm">
          <button type="submit" class="button button_registrieren" :disabled="loading">
            {{ loading ? 'LÄDT...' : 'REGISTRIEREN' }}
          </button>
        </div>

      </form>
    </template>

    <template v-else>
      <h1>REGISTRIEREN</h1>
      <p class="erfolg_text">{{ erfolgsmeldung }}</p>
      <div class="container_buttons_wm">
        <NuxtLink to="/login" class="button button_registrieren">ZUM LOGIN</NuxtLink>
      </div>
    </template>

  </main>
</template>


<style>
.button_registrieren {
  background: var(--braun);
  font-size: 1.5rem;
  margin-top: 10%;
}

.erfolg_text {
  font-family: 'BarlowCondensed', sans-serif;
  font-size: 5vw;
  color: var(--text-dunkel);
  text-align: center;
  width: 85%;
  margin-top: 2rem;
}
</style>