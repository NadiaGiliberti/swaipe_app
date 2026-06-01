<template>
  <main class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(110,231,183,0.28),_transparent_30%),radial-gradient(circle_at_right,_rgba(124,58,237,0.3),_transparent_28%),linear-gradient(135deg,#172720_0%,#223430_45%,#271742_100%)] px-6 py-8 text-white">
    <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-between gap-6">
      <header class="flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-emerald-200/80">Spielseite</p>
          <h1 class="mt-1 text-2xl font-black tracking-[0.08em] text-yellow-300">SWAIPE</h1>
        </div>
        <div class="flex gap-3 text-sm font-semibold">
          <NuxtLink to="/highscores" class="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">Highscores</NuxtLink>
          <NuxtLink to="/login" class="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">Login</NuxtLink>
        </div>
      </header>

      <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <p class="text-sm uppercase tracking-[0.35em] text-emerald-200/80">Spielmodus</p>
          <h2 class="mt-3 text-4xl font-black">Bereit für Runde 1?</h2>
          <p class="mt-4 max-w-xl text-white/75">
            Hier kommt später die eigentliche Swipe-Mechanik rein. Für jetzt ist das deine Spielfläche, auf der du das Spielsystem anschließen kannst.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            <div class="rounded-3xl border border-white/10 bg-black/20 p-5">
              <p class="text-sm text-white/60">Richtige Treffer</p>
              <p class="mt-2 text-3xl font-black text-yellow-300">0</p>
            </div>
            <div class="rounded-3xl border border-white/10 bg-black/20 p-5">
              <p class="text-sm text-white/60">Fehlversuche</p>
              <p class="mt-2 text-3xl font-black text-pink-200">0</p>
            </div>
          </div>
        </div>

        <aside class="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <p class="text-sm uppercase tracking-[0.35em] text-purple-200/80">Nächster Schritt</p>
          <ul class="mt-4 space-y-3 text-sm leading-6 text-white/75">
            <li>• Karten-Logik für „Real oder KI“ einbauen</li>
            <li>• Swipe-Interaktion verbinden</li>
            <li>• Punkte speichern und an Highscore schicken</li>
          </ul>

          <NuxtLink
            to="/highscores"
            class="mt-6 inline-flex w-full items-center justify-center rounded-full bg-yellow-300 px-5 py-3.5 font-black text-gray-900 transition hover:bg-yellow-200"
          >
            ZU DEN HIGHSCORES
          </NuxtLink>
        </aside>
      </section>

      <footer class="pb-2 text-center text-xs uppercase tracking-[0.3em] text-white/45">
        Swipe, entscheide, sammle Punkte
      </footer>
    </div>
  </main>
</template>