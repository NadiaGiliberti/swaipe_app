<template>
  <main class="container_main">

    <h1>BESTENLISTE</h1>
    <div class="container_highscores_liste">

      <div>
        <li class="container_vergleich">
          <ul>FREUNDE</ul>
          <ul>GLOBAL</ul>
        </li>
      </div>

      <div class="container_scores">

      </div>

    </div>

    <buttonZurueck />

  </main>
</template>


<style>
.container_vergleich {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;
}
</style>