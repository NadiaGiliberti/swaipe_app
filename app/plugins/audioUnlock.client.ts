// Safari (iOS und macOS) blockiert die automatische Wiedergabe von
// unstummgeschalteten <audio autoplay>-Elementen (siehe spiel.vue,
// Audio-/Musik-Karten), solange der Nutzer noch nicht selbst mit der Seite
// interagiert hat - eine reine autoplay-Attribut-Zuweisung reicht Safari
// nicht als "echte" Nutzergeste. Chrome/Edge/Firefox (und damit Windows +
// Android, wo bisher getestet wurde) sind hier grosszügiger, daher fiel das
// dort nie auf.
//
// Fix: Beim allerersten Tap/Klick/Tastendruck irgendwo in der App wird eine
// winzige, lautlose Audiodatei kurz abgespielt und sofort wieder pausiert.
// Das zählt für Safari als Nutzergeste und "entsperrt" Audiowiedergabe für
// den Rest der Seiten-Session (SPA-Navigation, kein Reload nötig) - danach
// darf auch das automatische Abspielen der Audio-/Musik-Karten im Spiel
// starten, ohne dass man vorher manuell auf Play tippen muss.
//
// Rein additiv: greift nirgends in bestehende Abläufe ein, verändert auf
// Windows/Android nichts (dort war ohnehin schon alles erlaubt).
export default defineNuxtPlugin(() => {
    let entsperrt = false

    function audioEntsperren() {
        if (entsperrt) return
        entsperrt = true

        try {
            const stille = new Audio(
                'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='
            )
            stille.volume = 0
            stille.play().then(() => stille.pause()).catch(() => {})
        } catch {
            // Ältere/exotische Browser ohne Audio-Unterstützung: einfach ignorieren
        }
    }

    window.addEventListener('pointerdown', audioEntsperren, { once: true, passive: true })
    window.addEventListener('keydown', audioEntsperren, { once: true })
})
