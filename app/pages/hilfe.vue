<script setup>
const route = useRoute()
const istErstmalig = computed(() => route.query.erstmalig === 'true')
</script>

<template>
    <main class="container_main">

        <h1>HILFE</h1>

        <div class="container_hilfe">

            <section class="hilfe_abschnitt">
                <h2>SPIEL STEUERUNG</h2>
                <p class="hilfe_text hilfe_text_handy">
                    Wische mit dem Finger nach links oder rechts, um zu entscheiden, ob es sich um "Echt" oder
                    "KI" handelt.
                </p>
                <p class="hilfe_text hilfe_text_pc">
                    Klicke auf die Pfeiltasten oder die Buttons, um zu entscheiden, ob es sich um "Echt" oder
                    "KI" handelt.
                </p>
            </section>

            <section class="hilfe_abschnitt">
                <h2>SOUND ON</h2>
                <p class="hilfe_text">
                    Inhalte des Spiels sind teilweise auch audiell zu unterscheiden.
                </p>
            </section>

            <section class="hilfe_abschnitt">
                <h2>DEFINITION ECHT UND KI</h2>
                <p class="hilfe_text">
                    Unter dem Begriff "Echt" werden alle Inhalte verstanden, die echte festgehaltene Dinge oder von Menschen
                    echt erstellte Inhalte sind, sei es Kunst, Zeichnungen, Fotografien, Videos, Musik oder Texte.
                </p>
                <p class="hilfe_text">
                    Unter dem Begriff "KI" werden alle Inhalte verstanden, die von einer Künstlichen Intelligenz
                    (synthetisch) erstellt wurden. KI kann dabei auf verschiedene Arten eingesetzt werden, um Inhalte zu
                    erstellen.
                </p>
            </section>

            <section class="hilfe_abschnitt">
                <h2>VERSCHIEDENE SPIELMODI</h2>
                <p class="hilfe_text">
                    Im Punkte-Modus hast du 60 Sekunden Zeit, um so viele Inhalte wie möglich richtig zuzuordnen
                    und deinen Highscore oder den deiner Freunde zu schlagen.
                </p>
                <p class="hilfe_text">
                    Im Überlebensmodus gibt es kein Zeitlimit, dafür endet die Runde sofort bei der ersten
                    falschen Antwort. Inhalte aus allen Kategorien werden zufällig gemischt und die Schwierigkeit
                    steigt laufend an. Schau, wie viele du in Folge richtig erkennen kannst, und miss dich mit
                    deinem eigenen Bestwert oder dem deiner Freunde.
                </p>
                <p class="hilfe_text">
                    Im Üben-Modus kannst du gezielt eine Kategorie wählen und ohne Zeitdruck trainieren.
                </p>
            </section>

        </div>

        <buttonZurueck :label="istErstmalig ? 'OK' : 'ZURÜCK'" />

    </main>
</template>

<style>
.container_hilfe {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 85%;
    margin-top: 1rem;
    margin-bottom: 3rem;
}

.hilfe_abschnitt h2 {
    text-align: left;
    font-size: 8vw;
}


.hilfe_text {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 4.5vw;
    color: var(--text-dunkel);
    text-align: left;
    margin-top: 0.5rem;
}



/* Standard: Handy-Text sichtbar, PC-Text versteckt */
.hilfe_text_pc {
    display: none;
}

.hilfe_text_handy {
    display: block;
}


/* Ab Tablet/Desktop-Breite: umgekehrt */
@media (min-width: 768px) {
    .hilfe_text_pc {
        display: block;
    }

    .hilfe_text_handy {
        display: none;
    }

    .container_hilfe {
        width: 85%;
        max-width: 760px;
        gap: 2.2rem;
    }

    .hilfe_abschnitt h2 {
        font-size: 1.8rem;
    }

    .hilfe_text {
        font-size: 1.1rem;
    }
}

@media (min-width: 1024px) {
    .container_hilfe {
        max-width: 880px;
    }

    .hilfe_abschnitt h2 {
        font-size: 2rem;
    }

    .hilfe_text {
        font-size: 1.15rem;
    }
}

@media (min-width: 1440px) {
    .container_hilfe {
        max-width: 960px;
    }

    .hilfe_text {
        font-size: 1.2rem;
    }
}
</style>