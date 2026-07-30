<template>
    <main class="container_main">

        <h1>DATENSCHUTZ</h1>

        <div class="container_rechtstext">

            <p class="rechts_text">
                SWAIPE wird im Rahmen einer Bachelorarbeit betrieben. Bei Fragen zum
                Datenschutz wende dich gerne an Nadia Giliberti.
            </p>

            <p class="rechts_text">
                Bei der Registrierung erfassen wir deine E-Mail-Adresse, deinen Benutzernamen und dein
                verschlüsseltes Passwort. Während des Spielens werden Spielstatistiken gespeichert, um
                Highscores, Level und Abzeichen anzuzeigen. Eine Weitergabe an Dritte zu Werbezwecken erfolgt
                nicht.
            </p>

            <p class="rechts_text">
                Du kannst jederzeit Auskunft über deine Daten verlangen oder deinen Account in den Profil-Einstellungen
                deaktivieren.
            </p>

        </div>

        <buttonZurueck />

    </main>
</template>

<style>
.container_rechtstext {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    width: 85%;
    margin-top: 2rem;
    margin-bottom: 6rem;
}

.rechts_text {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 4.5vw;
    color: var(--text-dunkel);
    text-align: left;
    line-height: 1.3;
}
</style>