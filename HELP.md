# WeR Jugend App – Hilfe & Wartung

## Projektübersicht

Technologie:
- React + Vite
- PWA (installierbar auf iPhone & Android)
- Hosting: Vercel
- Versionsverwaltung: GitHub

Struktur:
src/
 ├── components/
 ├── data/
 │    ├── events.json
 │    └── articles.json
 ├── services/
 ├── i18n.js
 ├── data.js
 └── App.jsx


----------------------------------------
LOKAL ENTWICKELN
----------------------------------------

In Projektordner wechseln:

    F:
    cd \WeR\wer-wiki-pwa

App starten:

    npm run dev

Im Browser öffnen:

    http://localhost:5173

Server stoppen:

    Ctrl + C


----------------------------------------
SPIELPLAN ODER TEXTE ÄNDERN
----------------------------------------

1. Datei bearbeiten:
   - src/data/events.json
   - src/data/articles.json

2. Änderungen hochladen:

    git add .
    git commit -m "Spielplan Update"
    git push

Nach ca. 30 Sekunden ist die App online aktualisiert.


----------------------------------------
MEHRSPRACHIGKEIT
----------------------------------------

Sprachen werden verwaltet in:

    src/i18n.js

Inhalte sind mehrsprachig in:

    events.json
    articles.json

Fallback-Reihenfolge:
- Gewählte Sprache
- Deutsch
- Englisch
- Russisch


----------------------------------------
WIEDERKEHRENDE TERMINE
----------------------------------------

Beispiel:

{
  "weekday": 5,
  "intervalDays": 14,
  "from": "2026-01-01",
  "to": "2026-12-31",
  "startTime": "18:00",
  "endTime": "20:00",
  "i18n": {
    "de": { "title": "...", "location": "..." },
    "en": { "title": "...", "location": "..." },
    "ru": { "title": "...", "location": "..." }
  }
}

weekday:
1 = Montag
2 = Dienstag
3 = Mittwoch
4 = Donnerstag
5 = Freitag
6 = Samstag
7 = Sonntag


----------------------------------------
NEUES FEATURE ENTWICKELN
----------------------------------------

Nach Installation neuer Pakete:

    npm install

Nach Codeänderung immer:

    git add .
    git commit -m "Beschreibung"
    git push


----------------------------------------
WICHTIG
----------------------------------------

Die App wird automatisch von Vercel deployed,
wenn Code auf GitHub gepusht wird.

Repository:
https://github.com/Fulgu-dev666/wer-wiki-pwa

Hosting:
https://wer-wiki-pwa.vercel.app
