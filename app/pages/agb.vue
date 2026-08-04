<template>
    <main class="container_main">

        <h1>AGBs</h1>

        <div class="container_rechtstext">

            <p class="rechts_text">
                SWAIPE ist ein im Rahmen einer Bachelorarbeit entwickeltes Spiel zur Unterscheidung von echten
                und KI-generierten Inhalten. Die Nutzung ist kostenlos, eine kommerzielle Nutzung der App oder
                ihrer Inhalte ist nicht gestattet.
            </p>

            <p class="rechts_text">
                Nutzer:innen verpflichten sich, keine beleidigenden Benutzernamen oder Profilbilder zu
                verwenden. Bei Verstössen kann der Zugang eingeschränkt werden.
            </p>

            <p class="rechts_text">
                Die App wird im Rahmen eines studentischen Projekts betrieben. Es besteht kein Anspruch auf
                ständige Verfügbarkeit oder Fehlerfreiheit. Diese Bedingungen können jederzeit angepasst
                werden.
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
    margin-bottom: 2rem;
}

.rechts_text {
    font-family: 'BarlowCondensed', sans-serif;
    font-size: 4.5vw;
    color: var(--text-dunkel);
    text-align: left;
    line-height: 1.3;
}

@media (min-width: 768px) {
    .container_rechtstext {
        width: 85%;
        max-width: 760px;
        gap: 1.4rem;
    }

    .rechts_text {
        font-size: 1.1rem;
        line-height: 1.5;
    }
}

@media (min-width: 1024px) {
    .container_rechtstext {
        max-width: 880px;
    }

    .rechts_text {
        font-size: 1.15rem;
    }
}

@media (min-width: 1440px) {
    .container_rechtstext {
        max-width: 960px;
    }

    .rechts_text {
        font-size: 1.2rem;
    }
}
</style>