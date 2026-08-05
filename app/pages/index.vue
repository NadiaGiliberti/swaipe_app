<script setup>
const menuOpen = ref(false)
const supabase = useSupabaseClient()
const hatUngesehenes = ref(false)
const avatarUrl = ref('')

const { data: spiele, error } = await supabase
  .from('spieldaten_live')
  .select('*')

console.log('Fehler:', error)

onMounted(async () => {
  const anzahl = await zaehleUngeseheneFreundschaftsereignisse(supabase)
  hatUngesehenes.value = anzahl > 0

  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (currentUser) {
    const { data: profilData } = await supabase
      .from('profiles')
      .select('profilbild_url, hilfe_gesehen')
      .eq('id', currentUser.id)
      .single()

    if (profilData) {
      avatarUrl.value = profilData.profilbild_url || ''

      if (!profilData.hilfe_gesehen) {
        await supabase
          .from('profiles')
          .update({ hilfe_gesehen: true })
          .eq('id', currentUser.id)

        await navigateTo('/hilfe')
      }
    }
  }
})

</script>

<template>
  <main class="container_main">

    <!-- User Menü -->
    <UserMenu :open="menuOpen" :hat-ungesehenes="hatUngesehenes" :avatar-url="avatarUrl" @close="menuOpen = false" />

    <!-- Profil Icon -->
    <button v-if="!menuOpen" class="button_profile" @click="menuOpen = true">
      <img v-if="avatarUrl" :src="avatarUrl" class="bild_umrandet" alt="Profil">
      <span v-else class="avatar_placeholder" role="img" aria-label="Profil"></span>
      <span v-if="hatUngesehenes" class="punkt_neu"></span>
    </button>

    <div class="container_swaipe">
      <img src="/logo_swaipe.svg" class="logo" alt="SWAIPE Logo">

      <h4>
        Real oder KI?
      </h4>
    </div>

    <div class="container_buttons">
      <buttonSpielen />
      <buttonHighscores />
    </div>

  </main>
</template>

<style scoped>
.container_swaipe {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  margin-top: 4rem;
}

.logo {
  width: 80vw;
}

.button_profile {
  position: fixed;
  top: calc(1rem + env(safe-area-inset-top));
  right: calc(1rem + env(safe-area-inset-right));
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 10000;
}

.button_profile img,
.button_profile .avatar_placeholder {
  width: clamp(34px, 5vw, 44px);
  height: clamp(34px, 5vw, 44px);
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.bild_umrandet {
  border: 2px solid var(--text-dunkel);
}

.punkt_neu {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: var(--gelb);
  border-radius: 50%;
}

@media (min-width: 768px) {
  .container_swaipe {
    margin-top: 1.5rem;
  }

  .logo {
    width: 65vw;
  }

}

@media (min-width: 1024px) {
  .container_swaipe {
    margin-top: 1.75rem;
  }

  .logo {
    width: 50vw;
  }

  .container_buttons {
    margin-top: 3rem;
  }
}

</style>