<template>
  <div class="container_icon">
    <img
      src="/icon_swaipe.svg"
      alt="SWAIPE Icon"
      class="icon_swaipe"
    >
  </div>
</template>

<style>
.container_icon {
  width: 100%;

  display: flex;
  justify-content: center;

  padding-top: 1.5rem;

  position: relative;
  z-index: 10;
}

.icon_swaipe {
  height: 5rem;
  width: 5rem;

  object-fit: contain;

  filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));
}

@media (min-width: 768px) {
  .icon_swaipe {
    height: 6rem;
    width: 6rem;
  }
}
</style>