<script setup>
const menuOpen = ref(false)

const supabase = useSupabaseClient()

const { data: spiele, error } = await supabase
  .from('spieldaten_live')
  .select('*')

console.log('Spieldaten:', spiele)
console.log('Fehler:', error)
</script>

<template>
  <main class="container_main">

    <!-- User Menü -->
    <UserMenu :open="menuOpen" @close="menuOpen = false" />

    <!-- Profil Icon -->
    <button v-if="!menuOpen" class="button_profile" @click="menuOpen = true">
      <img src="/icons/profil_icon.svg" alt="Profil">
    </button>

    <div class="container_swaipe">
      <img src="/logo_swaipe.svg" class="logo">

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
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 10000;
}

.button_profile img {
  width: 28px;
  display: block;
}
@media (min-width:768px) {


}
</style>