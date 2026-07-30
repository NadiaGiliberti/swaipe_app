# SWAIPE Applikation
Ein Projekt von Nadia Giliberti

## Kurzbeschreibung
SWAIPE ist eine mobile-first Web-App, mit der spielerisch trainiert wird, echte von KI-generierten Medieninhalten zu unterscheiden. Nach dem Vorbild der Swipe-Mechanik bekannter Dating-Apps wird pro Runde ein Inhalt (Bild, Video, Audio oder Musik) angezeigt, den man per Wischgeste (oder Pfeiltasten/Buttons am Desktop) als „Echt" oder „KI" einordnet.

Es gibt zwei Spielmodi:
- **Punkte-Modus**: 60 Sekunden Zeit, um so viele Inhalte wie möglich richtig zuzuordnen. Punkte hängen von der Schwierigkeit des Inhalts und dem eigenen Level in der jeweiligen Kategorie ab, Serien (Combos) geben zusätzliche Bonuspunkte, eine fehlerfreie Runde wird extra belohnt.
- **Üben-Modus**: eine Kategorie (Bild/Video/Audio/Musik) wird gezielt und ohne Zeitdruck trainiert.

Darüber hinaus bietet die App ein Level- und Highscore-System pro Kategorie, ein Freundschaftssystem mit globalem und freundesbezogenem Ranking, ein Achievement-System (Abzeichen) sowie ein personalisierbares Farb-Theme pro Nutzer:in.

## Learnings
- **Nuxt / Vue**: Arbeiten mit dem Composition API, dateibasiertem Routing, globalen Middlewares (Auth-Guard) und Komponenten-Autoimports; Verständnis dafür entwickelt, wann Logik in Seiten und wann in wiederverwendbare Composables gehört.
- **Supabase**: Aufbau einer relationalen Postgres-Datenbank inklusive Views, Enums und einer serverseitigen RPC-Funktion; Nutzung von Supabase Auth (E-Mail/Passwort) und automatisch generierten TypeScript-Types aus dem Datenbankschema.
- **PWA**: Auseinandersetzung mit mobile-first Design, Touch-Gesten (Drag/Swipe für Maus und Touch gleichermassen) und den Grundlagen, was eine Web-App installierbar/PWA-fähig macht (Manifest, Service Worker) – als nächster Ausbauschritt vorgesehen, aktuell noch nicht umgesetzt.
- **Freunde-Funktion**: Modellierung einer many-to-many-Beziehung zwischen Nutzer:innen über eine eigene Zwischentabelle mit Status (ausstehend/akzeptiert) für Anfragen, Annahme und Ablehnung.
- **Node.js Projekt aufsetzen und mit Server verbinden**: Einrichtung eines Node/Nuxt-Projekts, Verwaltung von Umgebungsvariablen (`.env`) und Anbindung an ein extern gehostetes Supabase-Backend als Datenquelle.

## Schwierigkeiten
*(Entwurf – bitte prüfen/ergänzen mit deiner eigenen Erfahrung)*
- Herausfinden, wie Nuxt, Vue und Supabase zusammenspielen, da alle drei Technologien neu waren.
- Ausbalancieren der Schwierigkeitskurve im Punkte-Modus (abwechselnde Echt/KI-Reihenfolge, Eskalation der Schwierigkeit nach richtigen Antworten, Level-abhängiger Einstieg pro Kategorie).
- Einheitliche Steuerung der Swipe-Geste für Maus- und Touch-Eingabe sowie das Zusammenspiel mit den alternativen Buttons/Pfeiltasten.
- Umsetzung des individuellen Farb-Themes über CSS-Variablen, inklusive Speicherung in der Datenbank und in einem Cookie für den ersten Render vor dem Laden der Nutzerdaten.

### Known Bugs
*(am Schluss ausfüllen – hier deine aktuell bekannten Bugs eintragen)*

## Datenstruktur
Die Daten werden vollständig in **Supabase** (Postgres) verwaltet. Das Schema besteht aus folgenden zentralen Tabellen:

- **profiles**: Ein Datensatz pro Nutzer:in mit Username, Profilbild, Highscore (inkl. Datum), Anzahl gespielter Runden, individuellem Level pro Kategorie (`level_bild`, `level_video`, `level_audio`, `level_musik`) sowie den gewählten Theme-Farben.
- **spieldaten**: Die eigentlichen Spielinhalte – Datei-URL, Kategorie (`BILD`/`VIDEO`/`AUDIO`/`MUSIK`), Herkunft (`ECHT`/`KI`), Stil, initiale Schwierigkeit sowie Zähler für Nutzung und richtige Antworten.
- **spieldaten_live** (View): Erweitert `spieldaten` um eine dynamisch berechnete `schwierigkeit_aktuell`, die sich aus dem bisherigen Antwortverhalten ergibt – dadurch werden häufig richtig erratene KI-Inhalte mit der Zeit automatisch als "leichter" markiert.
- **freundschaften**: Bildet Freundschaftsbeziehungen zwischen zwei `profiles` ab, inkl. Status (`AUSSTEHEND`/`AKZEPTIERT`) für Anfragen.
- **badges** und **user_badges**: Definition der verfügbaren Achievements sowie die Zuordnung, welche Nutzer:in welches Abzeichen wann erreicht hat.
- **record_answer** (RPC-Funktion): Serverseitige Funktion, die eine Spielantwort speichert und die Statistik der jeweiligen Karte (`spieldaten`) aktualisiert.

Die Spieldaten (Dateien) selbst liegen als Medien-Dateien und werden über `datei_url` referenziert.

## Ressourcen
### Schriftarten
- **DotGothic16** – Pixel-/Retro-Schrift für Überschriften, Labels und Zahlenanzeigen (Punkte, Timer).
- **Barlow Condensed** – schmale Schrift für Fliesstext und Statistiken.

Beide Schriften sind lokal als `.woff`/`.woff2`/`.eot` unter `public/fonts` eingebunden und über `app/assets/css/fonts.css` eingerichtet.

### Technologien
- **Nuxt 4** (Vue 3) als Frontend-Framework
- **Supabase** (Postgres-Datenbank, Authentifizierung, Datenhaltung) als Backend
- **Tailwind CSS** für Utility-Styling

### Spieldaten
Die im Spiel verwendeten Inhalte stammen aus verschiedenen Open-Source-Quellen:
- Echte Inhalte: Unsplash, Pixabay, Pexels, Mixkit
- KI-generierte Inhalte: Suno (Musik), ElevenLabs (Audio/Stimme) sowie weitere KI-Bild-/Video-Generatoren

## Projekt-Setup
### Voraussetzungen
- Node.js (v20.19.0 oder v22.12.0+)
- npm (wird mit Node.js installiert)
- Ein Supabase-Projekt mit den Umgebungsvariablen `NUXT_PUBLIC_SUPABASE_URL` und `NUXT_PUBLIC_SUPABASE_KEY` in einer `.env`-Datei im Projektroot

Um die TypeScript-Types nach Änderungen am Datenbankschema neu zu generieren:
```bash
npm run update-types
```

### Setup
```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```
