<template>
    <main class="container_main">

        <h1>AGBs</h1>

        <div class="container_rechtstext">

            <section class="rechts_abschnitt">
                <h2>GELTUNGSBEREICH</h2>
                <p class="rechts_text">
                    Diese Nutzungsbedingungen gelten für die Nutzung der App SWAIPE, einem im Rahmen einer
                    Bachelorarbeit entwickelten Spiel zur Unterscheidung von echten und KI-generierten Inhalten.
                </p>
            </section>

            <section class="rechts_abschnitt">
                <h2>NUTZUNG DER APP</h2>
                <p class="rechts_text">
                    Die Nutzung der App ist kostenlos. Für die Registrierung ist eine gültige E-Mail-Adresse
                    erforderlich. Mit der Registrierung bestätigst du, dass die angegebenen Daten korrekt sind.
                </p>
            </section>

            <section class="rechts_abschnitt">
                <h2>INHALTE</h2>
                <p class="rechts_text">
                    Die in der App gezeigten Bilder, Videos und Audiodateien dienen ausschliesslich dem
                    spielerischen und wissenschaftlichen Zweck dieser Bachelorarbeit. Eine kommerzielle Nutzung
                    der App oder ihrer Inhalte ist nicht gestattet.
                </p>
            </section>

            <section class="rechts_abschnitt">
                <h2>VERHALTEN DER NUTZENDEN</h2>
                <p class="rechts_text">
                    Nutzer:innen verpflichten sich, keine beleidigenden oder unangemessenen Benutzernamen oder
                    Profilbilder zu verwenden. Bei Verstössen kann der Zugang eingeschränkt werden.
                </p>
            </section>

            <section class="rechts_abschnitt">
                <h2>HAFTUNG</h2>
                <p class="rechts_text">
                    Die App wird im Rahmen eines studentischen Projekts betrieben. Es wird keine Gewähr für
                    ständige Verfügbarkeit oder Fehlerfreiheit übernommen. Eine Haftung für Schäden durch die
                    Nutzung der App ist ausgeschlossen, soweit gesetzlich zulässig.
                </p>
            </section>

            <section class="rechts_abschnitt">
                <h2>ÄNDERUNGEN</h2>
                <p class="rechts_text">
                    Diese Nutzungsbedingungen können jederzeit angepasst werden. Änderungen werden auf dieser
                    Seite veröffentlicht.
                </p>
            </section>

        </div>

        <buttonZurueck />

    </main>
</template>

<style>
.container_rechtstext {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 85%;
    margin-top: 2rem;
    margin-bottom: 6rem;
}

.rechts_abschnitt h2 {
    text-align: left;
    font-size: 8vw;
}

.rechts_text {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 4.5vw;
    color: var(--text-dunkel);
    text-align: left;
    margin-top: 0.5rem;
    line-height: 1.3;
}

.rechts_text + .rechts_text {
    margin-top: 0.8rem;
}
</style>