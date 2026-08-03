# SWAIPE Applikation
Ein Projekt von Nadia Giliberti

## Kurzbeschreibung

SWAIPE ist eine mobile-first Web-App, mit der spielerisch trainiert wird, echte von KI-generierten Medieninhalten zu unterscheiden. Nach dem Vorbild der Swipe-Mechanik bekannter Dating-Apps wird pro Runde ein Inhalt (Bild, Video, Audio oder Musik) angezeigt, den man per Wischgeste (oder Pfeiltasten/Buttons am Desktop) als „Echt" oder „KI" einordnet.

Es gibt drei Spielmodi:
- **Punkte-Modus**: 60 Sekunden Zeit, um so viele Inhalte wie möglich richtig zuzuordnen. Punkte hängen von der Schwierigkeit des Inhalts und dem eigenen Level in der jeweiligen Kategorie ab, Serien (Combos) geben zusätzliche Bonuspunkte, eine fehlerfreie Runde wird extra belohnt. Bestwerte können bei den Highscores angeschaut werden.
- **Überlebensmodus**: kein Zeitlimit, dafür endet die Runde sofort bei der ersten falschen Antwort. Inhalte aus allen vier Kategorien werden zufällig gemischt, die Schwierigkeit steigt analog zum Punkte-Modus laufend an. Gewertet wird, wie viele Inhalte in Folge richtig erkannt wurden. Der eigene Bestwert wird gespeichert und mit Freund:innen verglichen.
- **Üben-Modus**: eine Kategorie (Bild/Video/Audio/Musik) wird gezielt und ohne Zeitdruck trainiert. Nach der Runde werden alle falsch beantworteten Inhalte nochmals mit der korrekten Auflösung angezeigt, damit gezielt aus den eigenen Fehlern gelernt werden kann.

Darüber hinaus bietet die App ein Level- und Highscore-System pro Kategorie, ein Freundschaftssystem mit globalem und freundesbezogenem Ranking (getrennt für Punkte- und Überlebensmodus), ein Achievement-System (Abzeichen), Vergleichswerte zu anderen Spieler:innen (z. B. „X % der Spieler haben einen höheren Highscore erzielt") sowie ein personalisierbares Farb-Theme pro Nutzer:in.

## Learnings

- **Nuxt / Vue**
- **Supabase**
- **PWA**: 
- **Node.js Projekt im Server aufsetzen und verbinden**
  
## Schwierigkeiten

- Herausfinden, wie Nuxt, Vue und Supabase zusammenspielen, da alle drei Technologien neu waren.
- Umsetzung des individuellen Farb-Themes über CSS-Variablen
  
## Known Bugs

*(am Schluss ausfüllen wenn noch was auftaucht)*

**Testing-Einschränkung (Apple-Geräte):** Die App wurde primär auf Windows / Android (Samsung) getestet, da keine Apple Geräte in meinem Umfeld. Sowohl das Verhalten im Safari-Browser als auch PWA-spezifisches Verhalten unter iOS konnten dementsprechend nicht verifiziert werden.

## Datenstruktur

Die Daten werden vollständig in **Supabase** (Postgres) verwaltet. Das Schema besteht aus folgenden zentralen Tabellen:

- **profiles**: Ein Datensatz pro Nutzer:in mit Username, Profilbild, Highscore für den Punkte-Modus (inkl. Datum), Highscore für den Überlebensmodus (inkl. Datum), Anzahl gespielter Runden, individuellem Level pro Kategorie (`level_bild`, `level_video`, `level_audio`, `level_musik`) sowie den gewählten Theme-Farben.
- **spieldaten**: Die eigentlichen Spielinhalte – Datei-URL, Kategorie (`BILD`/`VIDEO`/`AUDIO`/`MUSIK`), Herkunft (`ECHT`/`KI`), Stil, initiale Schwierigkeit sowie Zähler für Nutzung und richtige Antworten.
- **spieldaten_live** (View): Erweitert `spieldaten` um eine dynamisch berechnete `schwierigkeit_aktuell`, die sich aus dem bisherigen Antwortverhalten ergibt – dadurch werden häufig richtig erratene KI-Inhalte mit der Zeit automatisch als "leichter" markiert. Für echte Inhalte wird pauschal eine mittlere Schwierigkeit angenommen; nur KI-Inhalte wurden initial manuell nach Schwierigkeit eingestuft, bevor genügend Spielerdaten für die dynamische Berechnung vorlagen.
- **freundschaften**: Bildet Freundschaftsbeziehungen zwischen zwei `profiles` ab, inkl. Status (`AUSSTEHEND`/`AKZEPTIERT`) für Anfragen.
- **badges** und **user_badges**: Definition der verfügbaren Achievements sowie die Zuordnung, welche Nutzer:in welches Abzeichen wann erreicht hat.
- **record_answer** (RPC-Funktion): Serverseitige Funktion, die eine Spielantwort speichert und die Statistik der jeweiligen Karte (`spieldaten`) aktualisiert.


## Ressourcen

### Schriftarten

- **DotGothic16** – Pixel-/Retro-Schrift für Überschriften, Labels und Zahlenanzeigen (Punkte, Timer).
- **Barlow Condensed** – schmale Schrift für Fliesstext und Statistiken.

Beide Schriften sind lokal als `.woff`/`.woff2`/`.eot` unter `public/fonts` eingebunden und über `app/assets/css/fonts.css` eingerichtet.

### Technologien

- **Nuxt 4** (Vue 3) als Frontend-Framework
- **Supabase** (Postgres-Datenbank, Authentifizierung, Datenhaltung) als Backend
- **Infomaniak** (Node.js-Hosting) für das Live-Deployment

### Spieldaten

Die im Spiel verwendeten Inhalte stammen aus verschiedenen Open-Source-Quellen wie Unsplash, Pixabay, Pexels, Mixkit, Suno, ElevenLabs.

## Projekt-Setup

### Voraussetzungen

- Node.js (v20.19.0 oder v22.12.0+)
- npm (wird mit Node.js installiert)
- Ein Supabase-Projekt mit folgenden Umgebungsvariablen in einer `.env`-Datei im Projektroot:
  - `NUXT_PUBLIC_SUPABASE_URL`
  - `NUXT_PUBLIC_SUPABASE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (für serverseitige Admin-Funktionen)

### Installation & Entwicklung

```bash
npm install
npm run dev
```

Um die TypeScript-Types nach Änderungen am Datenbankschema neu zu generieren:

```bash
npm run update-types
```
