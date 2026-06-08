<template>
  <div class="container_main">

    <div class="container_swaipe">
      <img src="/logo_swaipe.svg" class="logo">
      <h4>
        Real oder KI?</h4>
    </div>

    <!-- Buttons -->
    <div class="container_buttons">
      <buttonSpielen />
      <buttonHighscores />
    </div>

  </div>
</template>

<style>

.container_swaipe {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.logo {
  width: 80vw;
}




@media (min-width: 768px) {
  .logo {
    width: min(70vw, 34rem);
  }
}
</style>