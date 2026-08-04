<script setup>
import { ref, watch } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const userInput = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function login() {
  errorMsg.value = ''

  if (!userInput.value || !password.value) {
    errorMsg.value = 'Bitte E-Mail und Passwort ausfüllen.'
    return
  }

  loading.value = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: userInput.value,
    password: password.value
  })

  if (error) {
    loading.value = false
    if (error.message === 'Email not confirmed') {
      errorMsg.value = 'Bitte bestätige zuerst deine E-Mail-Adresse. Wir haben dir einen Link geschickt.'
    } else if (error.message === 'Invalid login credentials') {
      errorMsg.value = 'E-Mail oder Passwort falsch.'
    } else {
      errorMsg.value = error.message
    }
    return
  }

  const { data: profilData, error: profilError } = await supabase
    .from('profiles')
    .select('aktiv')
    .eq('id', data.user.id)
    .single()

  if (profilError || (profilData && profilData.aktiv === false)) {
    await supabase.auth.signOut()
    loading.value = false
    errorMsg.value = 'Dieser Account wurde deaktiviert. Bitte kontaktiere den Support.'
    return
  }

  if (!user.value) {
    await new Promise((resolve) => {
      const stopWatching = watch(user, (val) => {
        if (val) {
          stopWatching()
          resolve()
        }
      })
    })
  }

  loading.value = false
  await navigateTo('/')
}
</script>


<template>
  <main class="container_main">

    <form class="container_form" @submit.prevent="login">
      <h1>LOGIN</h1>

      <div class="container_formularfeld">
        <label for="email">E-MAIL</label>
        <input v-model="userInput" class="formularfeld" id="email" name="username" type="email" autocomplete="username"
          placeholder="E-Mail eingeben" required>
      </div>

      <div class="container_formularfeld">
        <label for="password">PASSWORT</label>
        <input v-model="password" class="formularfeld" id="password" name="password" type="password"
          autocomplete="current-password" placeholder="Passwort eingeben" required>
      </div>

      <a href="/registrieren">Registrieren</a>


      <div class="container_buttons">
        <button type="submit" class="button button_login" :disabled="loading">
          {{ loading ? 'LÄDT...' : 'LOGIN' }}
        </button>
      </div>

      <p v-if="errorMsg" class="error_text">{{ errorMsg }}</p>

    </form>


  </main>
</template>


<style>
.button_login {
  background: var(--braun);
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
  .button_login {
    margin-top: 1.5rem;
  }

  .error_text {
    font-size: 1rem;
  }
}
</style>