<template>
    <main class="container_main">

        <h1>DATENSCHUTZ</h1>

        <div class="container_rechtstext">

            <section class="rechts_abschnitt">
                <h2>VERANTWORTLICHE PERSON</h2>
                <p class="rechts_text">
                    Diese App wird im Rahmen einer Bachelorarbeit an der FH Graubünden entwickelt und betrieben von
                    Nadia Giliberti. Bei Fragen zum Datenschutz kannst du dich per E-Mail an
                    <a href="mailto:deine-email@beispiel.ch">deine-email@beispiel.ch</a> wenden.
                </p>
            </section>

            <section class="rechts_abschnitt">
                <h2>WELCHE DATEN WERDEN GESAMMELT</h2>
                <p class="rechts_text">
                    Bei der Registrierung erfassen wir deine E-Mail-Adresse, deinen selbst gewählten Benutzernamen
                    und dein Passwort (verschlüsselt gespeichert). Optional kannst du ein Profilbild hochladen.
                </p>
                <p class="rechts_text">
                    Während des Spielens werden Spielstatistiken (Punktzahl, Genauigkeit, Fortschritt) gespeichert,
                    um Highscores, Level und Abzeichen anzeigen zu können.
                </p>
            </section>

            <section class="rechts_abschnitt">
                <h2>WOZU WERDEN DIE DATEN VERWENDET</h2>
                <p class="rechts_text">
                    Die Daten dienen ausschliesslich dem Betrieb der App: Login, Anzeige deines Profils,
                    Spielfortschritt, Highscores und Vergleich mit Freunden. Es findet keine Weitergabe an
                    Dritte zu Werbezwecken statt.
                </p>
            </section>

            <section class="rechts_abschnitt">
                <h2>DRITTANBIETER</h2>
                <p class="rechts_text">
                    Für Login und Datenspeicherung nutzen wir Supabase, für das Hosting Infomaniak. Beide
                    Anbieter verarbeiten Daten in unserem Auftrag und sind vertraglich zur Vertraulichkeit
                    verpflichtet.
                </p>
            </section>

            <section class="rechts_abschnitt">
                <h2>DEINE RECHTE</h2>
                <p class="rechts_text">
                    Du kannst jederzeit Auskunft über deine gespeicherten Daten verlangen, sie berichtigen lassen
                    oder deinen Account über die Profil-Einstellungen deaktivieren. Bei weiteren Fragen wende
                    dich an die oben genannte E-Mail-Adresse.
                </p>
            </section>

            <section class="rechts_abschnitt">
                <h2>SPEICHERDAUER</h2>
                <p class="rechts_text">
                    Deine Daten bleiben gespeichert, solange dein Account aktiv ist. Bei Deaktivierung des
                    Accounts kannst du eine vollständige Löschung deiner Daten per E-Mail beantragen.
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