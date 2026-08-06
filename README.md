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
- **PWA**
- **Node.js Projekt im Server aufsetzen und verbinden**

Bis auf die kurzen Vorstellungsrunden im Major kannte ich diese Dinge noch nicht wirklich. 

## Schwierigkeiten

- Zurechtfinden in der "neuen Welt" von Nuxt, Vue und Supabase zusammenspielen.
- Optimierung der Ladezeiten bei grösseren Spielinhalten (insbesondere Videos). Trotz verschiedener Optimierungsmassnahmen, wie dem Vorladen der nächsten Inhalte, können in einzelnen Situationen weiterhin längere Ladezeiten auftreten.
  
## Known Bugs

- Je nach Netzwerkverbindung und Gerät kann es beim Laden der App und bei einzelnen Spielinhalten zu eher längeren Wartezeiten kommen.
- Bei einigen Audiodateien ist das Spulen während des Spiels möglich, bei anderen hingegen nicht. Das konnte nicht behoben werden, da ich den Fehler irgendwie nicht gefunden habe. 

**Testing-Einschränkung (Apple-Geräte):** Die App wurde primär auf Windows / Android (Samsung) getestet, da ich keine Apple Geräte in meinem Umfeld habe. Sowohl das Verhalten im Safari-Browser als auch PWA-spezifisches Verhalten unter iOS konnten dementsprechend leider nicht final geprüft werden.

## Datenstruktur

Die Daten werden vollständig in **Supabase** (Postgres) verwaltet. Das Schema besteht aus folgenden zentralen Tabellen:

- **profiles**: Enthält die Benutzerdaten wie Username, Profilbild, Highscores (inkl. Datum), Spielstatistiken, Level pro Kategorie sowie die gewählten Theme-Farben.
- **spieldaten**: Enthält alle Spielinhalte mit Datei-URL, Kategorie, Herkunft (KI oder Echt), Stil, Schwierigkeit sowie Statistiken zur Nutzung und den Spielergebnissen.
- **freundschaften**: Verwaltet Freundschaftsanfragen und bestehende Freundschaften zwischen Nutzer:innen.
- **badges** und **user_badges**: Definieren die verfügbaren Achievements und speichern, welche Nutzer:innen diese erreicht haben.

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

Da die KI-Inhalte initial nach Schwierigkeit (1–5) eingestuft werden mussten, bevor genügend Spielerdaten für die dynamische Berechnung vorlagen, habe ich mir dafür ein kleines internes Tool gebaut. Es zeigt nacheinander alle KI-Inhalte einer Kategorie mit Fortschrittsanzeige (z. B. „1/365"), lässt sich per Tastatur (Zifferntasten 1–5 zum Bewerten, Pfeiltasten zum Blättern) durchgehen. So ging das ganze etwas einfacher als wenn ich jede Spieldatei manuell hinterlegt hätte. Nach der Bewertung der Spieldaten wurde die Subpage wieder entfernt.

![Internes Tool zur Bewertung der KI-Inhalte nach Schwierigkeit](./docs/screenshots/bewertungstool.png)

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
