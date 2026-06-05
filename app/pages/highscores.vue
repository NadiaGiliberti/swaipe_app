<template>
  <main class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.24),_transparent_28%),radial-gradient(circle_at_left,_rgba(124,58,237,0.28),_transparent_30%),linear-gradient(135deg,#241d31_0%,#342846_44%,#1b2b26_100%)] px-6 py-8 text-white">
    <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col gap-6">
      <header class="rounded-[2rem] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
        <p class="text-xs uppercase tracking-[0.35em] text-yellow-200/80">Highscore</p>
        <h1 class="mt-1 text-3xl font-black tracking-[0.08em] text-yellow-300">Bestenliste</h1>
      </header>

      <section class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <p class="text-sm uppercase tracking-[0.35em] text-yellow-200/80">Dein Stand</p>
          <div class="mt-5 rounded-3xl border border-white/10 bg-black/20 p-5">
            <p class="text-sm text-white/60">Aktuelle Punkte</p>
            <p class="mt-2 text-5xl font-black text-yellow-300">0</p>
          </div>
          <NuxtLink
            to="/spiele"
            class="button_gelb mt-6 w-full px-5 py-3.5"
          >
            ZURÜCK ZUM SPIEL
          </NuxtLink>
        </div>

        <div class="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div class="flex items-center justify-between gap-4">
            <p class="text-sm uppercase tracking-[0.35em] text-purple-200/80">Top 5</p>
            <NuxtLink to="/" class="text-sm font-semibold text-white/60 transition hover:text-white">Startseite</NuxtLink>
          </div>

          <div class="mt-5 space-y-3">
            <div class="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
              <span class="font-semibold">1. Alex</span>
              <span class="font-black text-yellow-300">1200</span>
            </div>
            <div class="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
              <span class="font-semibold">2. Mira</span>
              <span class="font-black text-yellow-300">980</span>
            </div>
            <div class="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
              <span class="font-semibold">3. Jonas</span>
              <span class="font-black text-yellow-300">860</span>
            </div>
            <div class="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
              <span class="font-semibold">4. Lea</span>
              <span class="font-black text-yellow-300">720</span>
            </div>
            <div class="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
              <span class="font-semibold">5. Noa</span>
              <span class="font-black text-yellow-300">640</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>