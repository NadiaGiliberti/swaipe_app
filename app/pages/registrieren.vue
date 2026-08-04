<script setup>
import { ref } from 'vue'

const supabase = useSupabaseClient()

const user = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const erfolgsmeldung = ref('')
const errorMsg = ref('')
const resendLoading = ref(false)
const resendMeldung = ref('')

async function registrieren() {
  errorMsg.value = ''

  if (!user.value || !email.value || !password.value) {
    errorMsg.value = 'Bitte alle Felder ausfüllen.'
    return
  }

  if (user.value.length > 15) {
    errorMsg.value = 'Der Username darf maximal 15 Zeichen lang sein.'
    return
  }

  loading.value = true

  // Username-Verfügbarkeit vorab prüfen (case-insensitive)
  const { data: vorhandenerUsername } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', user.value.trim())
    .maybeSingle()

  if (vorhandenerUsername) {
    loading.value = false
    errorMsg.value = 'Dieser Username ist bereits vergeben.'
    return
  }

  const { data, error } = await supabase.auth.signUp({
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
    console.error('Registrierungsfehler:', error)
    if (error.message.includes('rate limit')) {
        errorMsg.value = 'Zu viele Versuche in kurzer Zeit. Bitte warte einen Moment und versuche es erneut.'
    } else {
        errorMsg.value = 'Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuche es erneut.'
    }
    return
}

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    errorMsg.value = 'Diese E-Mail-Adresse ist bereits registriert. Bitte logge dich ein oder nutze eine andere E-Mail.'
    return
  }

  erfolgsmeldung.value = 'Fast geschafft! Wir haben dir einen Bestätigungslink an deine E-Mail-Adresse geschickt. Bitte klicke darauf, um deinen Account zu aktivieren.'
}

async function linkErneutSenden() {
  resendLoading.value = true
  resendMeldung.value = ''

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.value
  })

  resendLoading.value = false

  if (error) {
    resendMeldung.value = error.message
    return
  }

  resendMeldung.value = 'Neuer Bestätigungslink wurde gesendet.'
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

        <p v-if="errorMsg" class="error_text">{{ errorMsg }}</p>

      </form>
    </template>

    <template v-else>
      <h1>REGISTRIEREN</h1>
      <p class="erfolg_text">{{ erfolgsmeldung }}</p>

      <p class="erfolg_text_klein">
        Keine E-Mail erhalten? Schau auch im Spam-Ordner nach, oder fordere einen neuen Link an.
      </p>

      <div class="container_buttons_wm">
        <button class="button_klein" :disabled="resendLoading" @click="linkErneutSenden">
          {{ resendLoading ? 'SENDET...' : 'LINK ERNEUT SENDEN' }}
        </button>
      </div>

      <p v-if="resendMeldung" class="erfolg_text_klein">{{ resendMeldung }}</p>

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

.erfolg_text_klein {
  font-family: 'DotGothic16', sans-serif;
  font-size: 0.8rem;
  color: var(--text-dunkel);
  text-align: center;
  width: 85%;
  margin-top: 1rem;
}

.error_text {
  color: var(--background-3);
  font-family: 'DotGothic16', sans-serif;
  font-size: 0.85rem;
  text-align: center;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .button_registrieren {
    font-size: 1.6rem;
    margin-top: 2rem;
  }

  .erfolg_text {
    font-size: 1.5rem;
    max-width: 460px;
  }

  .erfolg_text_klein {
    font-size: 1rem;
    max-width: 460px;
  }

  .error_text {
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .erfolg_text {
    max-width: 500px;
  }

  .erfolg_text_klein {
    max-width: 500px;
  }
}
</style>