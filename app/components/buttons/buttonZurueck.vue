

<script setup>
const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <!-- Teleport statt position:fixed: der Button wird an #back_button_slot im
       Layout verschoben (siehe layouts/default.vue), also ausserhalb von
       .scroll_area. Dadurch reserviert er dort ganz normal als Flex-Element
       automatisch seinen eigenen (echten) Platz - kein Platzhalter, kein
       geschätzter Höhenwert nötig, und Content kann strukturell nie hinter
       ihn geraten, bei keiner Scrollposition. Optisch bleibt er unverändert
       am unteren Bildschirmrand "kleben". -->
  <Teleport to="#back_button_slot">
    <div class="container_back_button">
      <button class="button button_zurueck" @click="goBack">
        ZURÜCK
      </button>
    </div>
  </Teleport>
</template>

<style>
.button_zurueck {
  background: var(--braun);
  padding: 0.1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  font-size: 1.5rem;
}
</style>
