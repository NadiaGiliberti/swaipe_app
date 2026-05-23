<template>
  <div class="min-h-screen gradient-bg flex flex-col items-center justify-between p-6 relative overflow-hidden">
    <!-- Header icons -->
    <div class="w-full flex justify-between items-start pt-8 max-w-2xl mx-auto">
      <!-- Hand icon (top left) -->
      <div class="relative">
        <svg class="w-16 h-16 text-amber-900" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50,10 L70,40 L60,50 L60,80 Q60,85 55,85 L45,85 Q40,85 40,80 L40,60 L30,60 L30,85 Q30,90 25,90 L15,90 Q10,90 10,85 L10,50 Q10,40 20,30 Z" />
        </svg>
        <span class="absolute top-2 left-12 bg-yellow-300 text-xs font-black px-2 py-1 rounded text-gray-900">SWIPE</span>
      </div>

      <!-- User icon (top right) -->
      <div class="relative">
        <div class="w-12 h-12 border-2 border-gray-800 rounded-full flex items-center justify-center bg-white/20">
          <svg class="w-7 h-7 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full border-2 border-white"></div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col items-center justify-center gap-6 w-full">
      <!-- Title -->
      <h1 class="text-8xl md:text-9xl font-black text-yellow-300 text-center drop-shadow-2xl" style="letter-spacing: 0.15em; text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">
        SWAIPE
      </h1>

      <!-- Subtitle -->
      <p class="text-center text-gray-800 text-base md:text-lg font-mono max-w-md px-4 drop-shadow-md" style="text-shadow: 1px 1px 2px rgba(255,255,255,0.5);">
        Real oder KI generiert? Zeige dein Können
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col gap-4 w-full max-w-xs pb-12">
      <button class="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-black py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95">
        SPIELEN
      </button>
      <button class="w-full bg-red-900 hover:bg-red-800 text-white font-black py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95">
        HIGHSCORES
      </button>
    </div>
  </div>
</template>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 25%, #86efac 75%, #6ee7b7 100%);
}
</style>

