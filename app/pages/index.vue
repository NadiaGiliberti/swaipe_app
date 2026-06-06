<template>
  <div class="container_startseite">

    <div class="container_swaipe">
      <img src="/logo_swaipe.svg" class="logo">
      <p class="subtitel">
        Real oder KI?</p>
    </div>

    <!-- Buttons -->
    <div class="container_buttons_startseite">
      <ButtonSpielen />
      <ButtonHighscores />
    </div>

  </div>
</template>

<style>
.container_startseite {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.container_swaipe {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.logo {
  width: 85vw;
}

.subtitel {
  font-family: 'DotGothic16', sans-serif;
  text-align: center;
  font-size: 1rem;
  color: var(--braun);
}

@media (min-width: 768px) {
  .logo {
    width: min(70vw, 34rem);
  }
}
</style>