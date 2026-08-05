<script setup>
</script>

<template>
    <main class="container_main">

        <div class="container_kategorien">

            <div class="container_punktemodus">
                <h2> PUNKTE MODUS</h2>
                <h3 class="h4"> Schlage den Bestwert</h3>
                <div class="container_buttons_wm">
                    <NuxtLink to="/spiel?modus=score" class="button button_gelb">
                        START
                    </NuxtLink>
                </div>
            </div>

            <div class="container_ueberlebensmodus">
                <h2> ÜBERLEBEN</h2>
                <h3 class="h4"> Wie lange überlebst du?</h3>
                <div class="container_buttons_wm">
                    <NuxtLink to="/spiel?modus=ueberleben" class="button button_braun">
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
.container_ueberlebensmodus,
.container_ueben {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.container_ueberlebensmodus {
    margin-top: 10%;
}

.container_ueben {
    margin-top: 15%;
    margin-bottom: 5rem;

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

.button_braun {
    background: var(--braun);
}

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

@media (min-width: 768px) {
    .container_punktemodus,
    .container_ueberlebensmodus,
    .container_ueben {
        max-width: 480px;
        margin-left: auto;
        margin-right: auto;
    }

    .container_buttons_ueben {
        max-width: 420px;
    }
}

@media (min-width: 1024px) {
    .container_punktemodus,
    .container_ueberlebensmodus,
    .container_ueben {
        max-width: 540px;
    }

    .container_buttons_ueben {
        max-width: 460px;
    }
}
</style>