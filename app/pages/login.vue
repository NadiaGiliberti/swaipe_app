<script setup>
import { ref } from 'vue'

const supabase = useSupabaseClient()

const user = ref('')
const password = ref('')
const loading = ref(false)

async function login() {
  if (!user.value || !password.value) {
    alert('Bitte Benutzername/E-Mail und Passwort ausfüllen.')
    return
  }

  loading.value = true

  const { error } = await supabase.auth.signInWithPassword({
    email: user.value,
    password: password.value
  })

  loading.value = false

  if (error) {
    alert(error.message)
    return
  }

  await navigateTo('/')
}
</script>


<template>
  <main class="container_main">

    <form class="container_form" @submit.prevent="login">
      <h1>LOGIN</h1>

      <div class="container_formularfeld">
        <label for="user">USER</label>
        <input v-model="user" class="formularfeld" id="user" type="text" placeholder="Benutzername oder E-Mail eingeben"
          required>
      </div>

      <div class="container_formularfeld">
        <label for="password">PASSWORT</label>
        <input v-model="password" class="formularfeld" id="password" type="password" placeholder="Passwort eingeben"
          required>
      </div>

      <a href="/registrieren">Registrieren</a>


      <div class="container_buttons">
        <button type="submit" class="button button_login" :disabled="loading">
          {{ loading ? 'LÄDT...' : 'LOGIN' }}
        </button>
      </div>

    </form>


  </main>
</template>


<style>
.button_login {
  background: var(--braun);
  margin-top: 1rem;
}
</style>