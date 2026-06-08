<template>
    <main class="container_main">

        <div class="container_kategorien">

            <div class="container_punktemodus">
                <h2> PUNKTE MODUS</h2>
                <h4> Schlage den Bestwert</h4>
                <div class="container_buttons_wm">
                    <buttonStart />
                </div>
            </div>

            <div class="container_ueben">
                <h3> ÜBEN</h3>
                <h4> Wähle eine Kategorie</h4>
                <div class="container_buttons_ueben">
                    <buttonKatBilder />
                    <buttonKatVideos />
                    <buttonKatAudio />
                    <buttonKatMusik />
                </div>

            </div>

        </div>

        <buttonZurueck />

    </main>
</template>

<style>
.container_kategorien {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.container_punktemodus,
.container_ueben {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.container_ueben {
    margin-top: 15%;
}

.container_buttons_ueben {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    flex-wrap: wrap;
    gap: 5%;
}

</style>