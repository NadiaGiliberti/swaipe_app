<template>
  <div class="min-h-screen gradient-bg flex flex-col items-center justify-between p-6 relative overflow-hidden">
    <!-- Top logo icon -->
    <div class="w-full flex justify-center pt-6 relative z-10">
      <img
        src="/icon_swaipe.svg"
        alt="SWAIPE Icon"
        class="h-20 w-20 md:h-24 md:w-24 object-contain drop-shadow-2xl"
      >
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col items-center justify-center gap-6 w-full relative z-10">
      <!-- Title logo -->
      <img
        src="/logo_swaipe.svg"
        alt="SWAIPE"
        class="w-[min(85vw,26rem)] md:w-[min(70vw,34rem)] drop-shadow-2xl"
      >

      <!-- Subtitle -->
      <p class="text-center text-gray-800 text-base md:text-lg font-mono max-w-md px-4 drop-shadow-md" style="text-shadow: 1px 1px 2px rgba(255,255,255,0.5);">
        Real oder KI generiert? Zeige dein Können
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col gap-4 w-full max-w-xs pb-12 relative z-10">
      <NuxtLink
        to="/login"
        class="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-black py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95 text-center"
      >
        SPIELEN
      </NuxtLink>
      <NuxtLink
        to="/highscores"
        class="w-full bg-red-900 hover:bg-red-800 text-white font-black py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95 text-center"
      >
        HIGHSCORES
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.gradient-bg {
  background:
    radial-gradient(circle at 22% 18%, rgba(246, 193, 214, 0.92) 0%, rgba(246, 193, 214, 0) 70%),
    radial-gradient(circle at 86% 12%, rgba(145, 29, 101, 0.92) 0%, rgba(145, 29, 101, 0) 70%),
    radial-gradient(circle at 72% 72%, rgba(28, 164, 82, 0.98) 0%, rgba(28, 164, 82, 0) 70%),
    radial-gradient(circle at 10% 92%, rgba(126, 32, 92, 0.9) 0%, rgba(126, 32, 92, 0) 70%),
    #f4d9e6;
  background-attachment: fixed;
  position: relative;
}

.gradient-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="6" seed="2" result="noise" /></filter><filter id="noise2"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed="5" result="noise2" /></filter></defs><rect width="400" height="400" fill="%23000000" filter="url(%23noise)" opacity="0.6"/><rect width="400" height="400" fill="%23ffffff" filter="url(%23noise2)" opacity="0.5"/></svg>');
  background-size: 400px 400px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: soft-light;
}

.gradient-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><filter id="noise3"><feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="3" seed="8" /></filter></defs><rect width="300" height="300" fill="%23000000" filter="url(%23noise3)" opacity="0.55"/></svg>');
  background-size: 300px 300px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: 2;
  mix-blend-mode: overlay;
}
</style>

