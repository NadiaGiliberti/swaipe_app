<template>
    <main class="container_main">

        <div class="container_kategorien">

            <div class="container_punktemodus">
                <h2> PUNKTE MODUS</h2>
                <h4> Schlage den Bestwert</h4>
                <div class="container_buttons_wm">
                    <NuxtLink to="/spiel?modus=score" class="button button_gelb">
                        START
                    </NuxtLink>
                </div>
            </div>

            <div class="container_ueben">
                <h3> ÜBEN</h3>
                <h4> Wähle eine Kategorie</h4>
                <div class="container_buttons_ueben">
                    <NuxtLink to="/spiel?modus=uebung&kategorie=BILD" class="button_klein button_bilder">
                        BILDER
                    </NuxtLink>

                    <NuxtLink to="/spiel?modus=uebung&kategorie=VIDEO" class="button_klein button_videos">
                        VIDEOS
                    </NuxtLink>

                    <NuxtLink to="/spiel?modus=uebung&kategorie=AUDIO" class="button_klein button_audio">
                        AUDIO
                    </NuxtLink>

                    <NuxtLink to="/spiel?modus=uebung&kategorie=MUSIK" class="button_klein button_musik">
                        MUSIK
                    </NuxtLink>
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

/** BUTTONS KATEGORIEN */

.button_gelb {
    background: var(--gelb);
}

.button_videos {
    background: var(--braun);
}

.button_bilder {
    background: var(--braun);
}

.button_audio {
    background: var(--braun);
}

.button_musik {
    background: var(--braun);
}
</style>