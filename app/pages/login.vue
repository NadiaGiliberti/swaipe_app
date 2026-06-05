<template>
  <main class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.3),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.32),_transparent_34%),linear-gradient(135deg,#241735_0%,#33294d_45%,#172c26_100%)] text-white px-6 py-8">
    <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center gap-6">
      <div class="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
        <p class="text-sm uppercase tracking-[0.35em] text-pink-200/80">Login</p>
        <h1 class="mt-3 text-4xl font-black tracking-[0.08em] text-yellow-300">Willkommen zurück</h1>
        <p class="mt-3 text-sm leading-6 text-white/75">
          Melde dich an, um direkt zu spielen und deine Ergebnisse zu speichern.
        </p>

        <form class="mt-8 space-y-4">
          <label class="block">
            <span class="mb-2 block text-sm font-semibold text-white/80">E-Mail</span>
            <input
              type="email"
              placeholder="name@beispiel.de"
              class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-pink-300/60 focus:bg-black/30"
            >
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-semibold text-white/80">Passwort</span>
            <input
              type="password"
              placeholder="••••••••"
              class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-pink-300/60 focus:bg-black/30"
            >
          </label>

            <button
              type="submit"
              class="button_gelb w-full px-5 py-3.5"
          >
            EINLOGGEN
          </button>
        </form>
      </div>

      <div class="flex flex-col gap-3 text-center text-sm text-white/75">
        <NuxtLink to="/spiele" class="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold transition hover:bg-white/10">
          Direkt als Gast spielen
        </NuxtLink>
        <NuxtLink to="/" class="text-white/60 transition hover:text-white">
          Zur Startseite
        </NuxtLink>
      </div>
    </div>
  </main>
</template>