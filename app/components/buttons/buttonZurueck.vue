<template>
  <div class="container_back_button">
    <button class="button button_zurueck" @click="goBack">
      ZURÜCK
    </button>
  </div>
</template>

<script setup>
const router = useRouter()

function goBack() {
  router.back()
}
</script>


<style>
.button_zurueck {
  background: var(--braun);
  padding: 0.1rem;
  width: 100%;
  font-size: 1.5rem;
}
</style>
