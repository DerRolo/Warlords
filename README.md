# Warlords: Schlachtlinien

Browserspiel (Fantasy-Schlachten, Kampagne, Gefechte). Läuft am PC und am Handy.

## Ordner

| Pfad | Inhalt |
|---|---|
| `index.html` | Seitengerüst (Menüs, Bildschirme), lädt alles andere |
| `css/style.css` | Aussehen |
| `js/01…12-*.js` | Spielcode, wird **in dieser Reihenfolge** geladen |
| `audio/*.mp3` | Die Lieder (eine Datei pro Lied, Name = ID in der Liste `MTR`) |
| `data/*.js` | Kampfgeräusche, Fanfaren, Wikinger-Schlachtlied (Base64) |
| `icons/`, `manifest.webmanifest` | Installation als App |
| `sw.js` | Offline-Modus. Spielcode wird online immer frisch geladen. `VERSION` nur hochzählen, wenn Dateien in `audio/`, `data/` oder `icons/` geändert wurden |

Neues Lied: MP3 nach `audio/`, Eintrag in `MTR` (`js/06-dateimusik.js`) ergänzen,
Dateiname = `id` + `.mp3`, und in `sw.js` nichts weiter nötig.

## Online stellen (GitHub Pages)

1. Neues Repository auf github.com anlegen, alle Dateien hochladen.
2. Settings → Pages → Branch `main`, Ordner `/ (root)` → Save.
3. Nach 1 bis 2 Minuten läuft es unter `https://DEINNAME.github.io/REPONAME/`.
4. Am Handy (Chrome): Seite öffnen → Menü → „App installieren“ / „Zum Startbildschirm“.
   Am PC: Installieren-Symbol in der Adressleiste.
