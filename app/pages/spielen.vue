<template>
  <main class="container_main">

    <div class="container_score_count">
      <div class="container_punkte">
        <h4> PUNKTE </h4>
        <p> 20000 </p>
      </div>

      <div class="container_korrekt">
        <h4> KORREKT </h4>
        <p> 15 </p>
      </div>
    </div>

    <div class="container_zeit">
      <h1> 60 </h1>
      <h4> SEKUNDEN </h4>
    </div>

    <div class="container_content">

    </div>

    <div class="container_swipe_info">
      <h4>Swipe nach links für Real erstellt und nach rechts für KI generiert</h4>
    </div>

  </main>
</template>




<style>

.container_score_count {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin-top: -5rem;
}

.container_punkte,
.container_korrekt {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container_zeit {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-top: 2rem;
}


.container_content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90vw;
  height: 40vh;
  background: #00000042;
  border-radius: 30px;
  margin: 2%
}


.container_swipe_info {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin-top: 2rem;
}

</style>