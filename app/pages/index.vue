<template>


  <!-- Main content -->
  <div class="landing-page">
    <div class="container_swaipe">
      <img src="/logo_swaipe.svg" class="logo">

      <!-- Subtitel -->
      <p id="subtitel">
        Real oder KI generiert? Zeige dein Können
      </p>
    </div>

    <!-- Buttons -->
    <div class="container_buttons">
      <ButtonSpielen />
      <ButtonHighscores />
    </div>

  </div>
</template>

<style>
.landing-page {
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  padding: 1.5rem;

  position: relative;
  overflow: hidden;
}

.container_swaipe {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 1.5rem;
  width: 100%;

  position: relative;
  z-index: 10;
}

.logo {
  width: min(85vw, 26rem);
}

#subtitel {
  font-family: 'DotGothic16', sans-serif;
  text-align: center;
  max-width: 30rem;
}

@media (min-width: 768px) {
  .landing-logo {
    width: min(70vw, 34rem);
  }
}
</style>