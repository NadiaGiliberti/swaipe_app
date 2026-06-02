<template>
  <div class="min-h-screen gradient-bg flex flex-col items-center justify-between p-6 relative overflow-hidden">
    <!-- Top logo icon -->
    <div class="w-full flex justify-center pt-6 relative z-10">
      <img src="/icon_swaipe.svg" alt="SWAIPE Icon" class="h-20 w-20 md:h-24 md:w-24 object-contain drop-shadow-2xl">
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col items-center justify-center gap-6 w-full relative z-10">
      <!-- Title logo -->
      <img src="/logo_swaipe.svg" alt="SWAIPE" class="w-[min(85vw,26rem)] md:w-[min(70vw,34rem)] drop-shadow-2xl">

      <!-- Subtitle -->
      <p class="text-center text-gray-800 text-base md:text-lg font-mono max-w-md px-4 drop-shadow-md"
        style="text-shadow: 1px 1px 2px rgba(255,255,255,0.5);">
        Real oder KI generiert? Zeige dein Können
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col gap-4 w-full max-w-xs pb-12 relative z-10">
      <NuxtLink to="/login"
        class="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-black py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95 text-center">
        SPIELEN
      </NuxtLink>
      <NuxtLink to="/highscores"
        class="w-full bg-red-900 hover:bg-red-800 text-white font-black py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95 text-center">
        HIGHSCORES
      </NuxtLink>
    </div>
  </div>
</template>
