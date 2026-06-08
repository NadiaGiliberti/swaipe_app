<template>
  <button class="button button_zurueck" @click="goBack">
    ZURÜCK
  </button>
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
}
</style>