# 🐍 30-Tage Python Kurs - Woche 4: Real-World Applications

## 📖 Über Woche 4

**Was du diese Woche lernst:**
Echte Anwendungen mit externen Daten und komplexen Projekten!

**Themen:**
- ✅ Tag 22: JSON (Konfigurations-Manager)
- ✅ Tag 23: CSV (Ausgaben-Tracker)
- ✅ Tag 24: Datetime (Geburtstags-Reminder)
- ✅ Tag 25: Random & Secrets (Passwort-Generator)
- ✅ Tag 26: Requests (Wetter-App mit API)
- ✅ Tag 27: Web Scraping (News-Headlines)
- ✅ Tag 28: SQLite (Aufgaben-Datenbank)
- ✅ Tag 29: Mini-Projekt (Ausgaben-Manager)
- ✅ Tag 30: Abschlussprojekt (Produktivitäts-Hub)

**Zeitaufwand:** 9 Tage × 10-20 Minuten = ca. 2-3 Stunden gesamt

---

## Tag 22: Der Universal-Übersetzer (JSON)

### 📝 Aufgabe
Lerne JSON kennen – die Sprache, in der das Internet spricht. Schreibe einen Manager, der die Einstellungen deiner Apps speichert.

---

### 📍 Schritt 1: Das mentale Modell (Der Übersetzer)

**🎯 Ziel:** Verstehen, warum JSON für Datenaustausch wichtig ist.

**💡 Warum:** 
Python liebt **Dictionaries**. JavaScript liebt **Objekte**. Aber wie schicken sie sich Daten? 
**JSON** (JavaScript Object Notation) ist wie Englisch: Fast jeder Computer versteht es. Es ist einfach ein langer Text, der wie ein Python-Dict aussieht.

**💻 Code:**
```python
import json

daten = {
    "benutzer": "Coder123",
    "level": 5,
    "online": True,
    "freunde": ["Anna", "Ben"]
}

# 1. Dict -> JSON Text (Senden)
json_text = json.dumps(daten, indent=4)
print(f"📡 Als JSON-Text:\n{json_text}")

# 2. JSON Text -> Dict (Empfangen)
neue_daten = json.loads(json_text)
print(f"📥 Zurück als Python Dict: {neue_daten['benutzer']}")
```

**✅ Checkpoint:**
`dumps` (dump string) macht Text aus Daten. `loads` (load string) macht Daten aus Text.

---

### 📍 Schritt 2: In Dateien speichern (`dump` & `load`)

**🎯 Ziel:** JSON dauerhaft auf der Festplatte sichern.

**💡 Warum:** Strings sind flüchtig. Dateien sind für die Ewigkeit. Für Dateien lassen wir das "s" am Ende weg.

**💻 Code:**
```python
import json

einstellungen = {"theme": "dark", "vol": 80}

# In Datei SCHREIBEN
with open("config.json", "w") as f:
    json.dump(einstellungen, f)

# Aus Datei LESEN
with open("config.json", "r") as f:
    geladen = json.load(f)

print(f"Die Lautstärke ist: {geladen['vol']}%")
```

**✅ Checkpoint:**
Ohne "s" am Ende (`dump`/`load`) arbeitest du direkt mit Datei-Objekten.

---

### 📍 Schritt 3: Der Konfigurations-Manager (Klasse)

**🎯 Ziel:** Eine saubere Zentrale für App-Einstellungen bauen.

**💡 Warum:** In einer echten App willst du nicht überall `open()` und `json.load()` schreiben. Eine Klasse erledigt das für dich.

**💻 Code:**
```python
class Settings:
    def __init__(self, datei="app_settings.json"):
        self.datei = datei
        self.daten = self.laden()

    def laden(self):
        try:
            with open(self.datei, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return {"user": "Gast", "lang": "de"} # Standardwerte

    def speichern(self):
        with open(self.datei, "w") as f:
            json.dump(self.daten, f, indent=4)

# Nutzung
s = Settings()
print(f"Hallo {s.daten['user']}")
s.daten['user'] = "Pro_Coder"
s.speichern() # Jetzt ist es in der Datei gespeichert!
```

**✅ Checkpoint:**
Eine Klasse kapselt die JSON-Logik. Dein restlicher Code muss nur noch `s.daten` ändern.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Das Personen-Register**
Erstelle ein Dictionary mit Name, Alter und Stadt. Verwandle es in JSON und achte darauf, dass Umlaute (ä, ö, ü) korrekt angezeigt werden (`ensure_ascii=False`).

**Level 2: Inventar-Backup**
Lade eine Liste von Items aus einer `items.json`. Füge ein neues Item hinzu und speichere die Liste wieder ab.

**Level 3: Fehler-Abfangjäger**
Was passiert, wenn die JSON-Datei beschädigt ist (z.B. eine Klammer fehlt)? Nutze `try-except` mit `json.JSONDecodeError`, um ein Backup oder einen Reset auszuführen.

---

### 📚 Was du gelernt hast:

- ✅ **dumps / loads:** Datenaustausch über Text-Strings.
- ✅ **dump / load:** Datenspeicherung in Dateien.
- ✅ **Standard-Datentypen:** In JSON werden Python-Listen zu Arrays und `None` zu `null`.
- ✅ **indent:** JSON für Menschen lesbar machen.
- ✅ **Kapselung:** JSON-Logik in Klassen verstecken.

---

## Tag 23: Die Tabellen-Kraft (CSV)

### 📝 Aufgabe
Lerne, wie du Daten speicherst, die du in Excel oder Google Sheets öffnen kannst. Baue einen Tracker für deine täglichen Ausgaben.

---

### 📍 Schritt 1: Das mentale Modell (Das linierte Blatt)

**🎯 Ziel:** Verstehen, wie CSV-Tabellen funktionieren.

**💡 Warum:** 
JSON ist super für Computer, aber Menschen lieben Tabellen. 
**CSV** (Comma-Separated Values) ist das einfachste Tabellenformat der Welt: Jede Zeile ist eine neue Reihe, jedes Komma trennt die Spalten.

**💻 Code:**
```python
import csv

daten = [
    ["Name", "Beruf", "Gehalt"],
    ["Anna", "Entwicklerin", 5000],
    ["Ben", "Designer", 4500]
]

# 1. SCHREIBEN
with open("gehalt.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerows(daten)

# 2. LESEN
with open("gehalt.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for zeile in reader:
        print(f"Spalte 1: {zeile[0]}, Spalte 2: {zeile[1]}")
```

**✅ Checkpoint:**
`newline=""` ist wichtig, damit unter Windows keine doppelten Leerzeilen entstehen.

---

### 📍 Schritt 2: Der Profi-Modus (DictReader)

**🎯 Ziel:** Spalten mit Namen ansprechen statt mit Nummern.

**💡 Warum:** In einer Tabelle mit 20 Spalten verlierst du mit `zeile[14]` den Überblick. `DictReader` macht aus jeder Zeile ein Dictionary.

**💻 Code:**
```python
import csv

with open("gehalt.csv", "r", encoding="utf-8") as f:
    # Nutzt die erste Zeile automatisch als "Keys"
    reader = csv.DictReader(f)
    for zeile in reader:
        print(f"{zeile['Name']} verdient {zeile['Gehalt']} €.")
```

**✅ Checkpoint:**
Mit `DictReader` sagst du einfach `zeile['Name']`. Das ist viel sicherer und lesbarer!

---

### 📍 Schritt 3: Der Ausgaben-Tracker (Projekt)

**🎯 Ziel:** Daten an eine bestehende CSV-Datei anhängen.

**💡 Warum:** Wir wollen unsere Ausgaben nacheinander eintragen, ohne die alten zu löschen.

**💻 Code:**
```python
import csv
from datetime import datetime

def log_ausgabe(kategorie, betrag):
    datum = datetime.now().strftime("%Y-%m-%d")
    
    # "a" für Append (Anhängen)
    with open("ausgaben.csv", "a", newline="", encoding="utf-8") as f:
        spalten = ["Datum", "Kategorie", "Betrag"]
        writer = csv.DictWriter(f, fieldnames=spalten)
        
        # Falls Datei leer, Header schreiben
        if f.tell() == 0:
            writer.writeheader()
            
        writer.writerow({"Datum": datum, "Kategorie": kategorie, "Betrag": betrag})
    print(f"✅ {betrag} € für {kategorie} gespeichert.")

# Test
log_ausgabe("Essen", 12.50)
log_ausgabe("Kino", 15.00)
```

**✅ Checkpoint:**
`f.tell() == 0` prüft, ob die Datei ganz am Anfang steht (also neu/leer ist), um nur einmal den Header zu schreiben.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Der Summen-Rechner**
Lies die `ausgaben.csv` ein und addiere alle Beträge in einer Schleife. Gib zum Schluss die Gesamtsumme aus. (Tipp: `float(zeile['Betrag'])` nutzen!)

**Level 2: Filter-Station**
Schreibe eine Funktion, die nur Ausgaben einer bestimmten Kategorie (z.B. "Essen") auf dem Bildschirm anzeigt.

**Level 3: Semikolon-Spezialist**
Manchmal nutzt CSV ein `;` statt ein `,` (typisch für deutsches Excel). Ändere deine Schreib-Funktion so ab, dass sie das Semikolon nutzt: `csv.writer(f, delimiter=';')`.

---

### 📚 Was du gelernt hast:

- ✅ **CSV Format:** Rohdaten in Zeilen und Spalten.
- ✅ **csv.reader/writer:** Der direkte Weg für Listen.
- ✅ **DictReader/DictWriter:** Der saubere Weg mit Spaltennamen.
- ✅ **Append-Modus:** Daten hinzufügen, ohne Altes zu löschen.
- ✅ **Datentypen:** Achtung! CSV liest alles als String – Zahlen musst du umwandeln.

---

## Tag 24: Die Zeitmaschine (Datetime)

### 📝 Aufgabe
Lerne, wie Python mit Zeit und Datum umgeht. Baue einen Countdown, der dir sagt, wie viele Tage es noch bis zu deinem nächsten Geburtstag sind.

---

### 📍 Schritt 1: Das mentale Modell (Der Zeitstempel)

**🎯 Ziel:** Die aktuelle Zeit abrufen und verstehen.

**💡 Warum:** 
Im Computer ist Zeit oft nur eine lange Zahl (Sekunden seit 1970). Damit wir damit arbeiten können, nutzen wir das `datetime`-Modul. Es macht aus der Zeit ein Objekt mit Jahr, Monat, Tag, Stunde und Minute.

**💻 Code:**
```python
from datetime import datetime

# 1. Jetzt!
jetzt = datetime.now()
print(f"Es ist gerade: {jetzt}")

# 2. Einzelne Teile
print(f"Jahr: {jetzt.year}")
print(f"Monat: {jetzt.month}")
print(f"Stunde: {jetzt.hour}")

# 3. Ein eigenes Datum erstellen
geburtstag = datetime(2000, 5, 20, 14, 30)
print(f"Erstellt: {geburtstag}")
```

**✅ Checkpoint:**
`datetime.now()` ist wie ein Foto der aktuellen Zeit. Du kannst jederzeit darauf zugreifen.

---

### 📍 Schritt 2: Die Uhr stellen (Formatierung)

**🎯 Ziel:** Datum in schönen Text verwandeln (und zurück).

**💡 Warum:** `2024-05-20 14:12:05.123456` sieht hässlich aus. Wir wollen vielleicht nur `20. Mai`. Dafür gibt es Codes:
- `%d` = Day (Tag)
- `%m` = Month (Monat)
- `%Y` = Year (Jahr, 4-stellig)

**💻 Code:**
```python
jetzt = datetime.now()

# 1. Datum -> Text (strftime = String From Time)
schoener_text = jetzt.strftime("%d.%m.%Y - %H:%M")
print(f"📅 Formatiert: {schoener_text}")

# 2. Text -> Datum (strptime = String Parse Time)
text_datum = "24.12.2024"
weihnachten = datetime.strptime(text_datum, "%d.%m.%Y")
print(f"🎄 Objekt erstellt: {weihnachten}")
```

**✅ Checkpoint:**
`strftime` ist für die Anzeige. `strptime` ist, wenn der User ein Datum eintippt und du es in Python "verstehbar" machen musst.

---

### 📍 Schritt 3: Rechnen mit der Zeit (Timedelta)

**🎯 Ziel:** Wissen, was in der Zukunft oder Vergangenheit liegt.

**💡 Warum:** Wie viel Uhr ist es in 100 Stunden? Welches Datum war vor 45 Tagen? `timedelta` erledigt das Rechnen für dich.

**💻 Code:**
```python
from datetime import datetime, timedelta

heute = datetime.now()

# 1. 10 Tage in die Zukunft
in_10_tagen = heute + timedelta(days=10)
print(f"In 10 Tagen: {in_10_tagen.strftime('%d.%m.')}")

# 2. Diferenz berechnen
weihnachten = datetime(heute.year, 12, 24)
differenz = weihnachten - heute

print(f"⏳ Noch {differenz.days} Tage bis Weihnachten!")
```

**✅ Checkpoint:**
Wenn du zwei `datetime`-Objekte voneinander abziehst, erhältst du ein `timedelta`. Das sagt dir genau die Tage, Stunden und Sekunden Unterschied.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Die Digitaluhr**
Schreibe eine Endlosschleife, die jede Sekunde die aktuelle Uhrzeit im Format `HH:M M:SS` ausgibt. Nutze `time.sleep(1)` für die Pause.

**Level 2: Alters-Rechner**
Frage den User nach seinem Geburtsdatum (Tag, Monat, Jahr). Berechne, wie viele Tage dieser Mensch schon auf der Erde lebt.

**Level 3: Der Wochentags-Finder**
An welchem Wochentag hast du Geburtstag? Nutze `.strftime("%A")`. *Zusatz: Bekommst du den Namen auch auf Deutsch raus?*

---

### 📚 Was du gelernt hast:

- ✅ **datetime.now():** Den aktuellen Moment einfangen.
- ✅ **strftime:** Zeit für Menschen lesbar machen.
- ✅ **strptime:** Texteingaben in Zeit-Objekte verwandeln.
- ✅ **timedelta:** Mit Tagen, Stunden und Minuten rechnen.
- ✅ **Zeit-Differenz:** Countdowns und Abstände berechnen.

---

## Tag 25: Der Würfelbecher (Random & Secrets)

### 📝 Aufgabe
Generiere Zufallszahlen für Spiele und lerne, wie du absolut sichere Passwörter erstellst, die kein Hacker erraten kann.

---

### 📍 Schritt 1: Das mentale Modell (Der Spiele-Zufall)

**🎯 Ziel:** Zufällige Entscheidungen im Code treffen.

**💡 Warum:** 
Bisher war dein Code immer vorhersehbar. In Spielen oder Simulationen wollen wir Überraschung! 
**random** ist für alles, was Spaß macht (Würfeln, Listen mischen).

**💻 Code:**
```python
import random

# 1. Eine Zahl zwischen 1 und 6 (Würfel)
wuerfel = random.randint(1, 6)
print(f"🎲 Du hast eine {wuerfel} gewürfelt!")

# 2. Ein Element aus einer Liste wählen
farben = ["Rot", "Blau", "Grün", "Gelb"]
wahl = random.choice(farben)
print(f"🎨 Die Glücksfarbe ist: {wahl}")

# 3. Eine Liste durchmischen
karten = [7, 8, 9, 10, "Bube", "Dame", "König", "Ass"]
random.shuffle(karten)
print(f"🃏 Gemischte Karten: {karten}")
```

**✅ Checkpoint:**
`random` ist super für Spiele, aber es hat ein Geheimnis: Es ist "pseudo-zufällig". Ein Super-Computer könnte die Zahlen vorausberechnen.

---

### 📍 Schritt 2: Der Sicherheits-Zufall (Secrets)

**🎯 Ziel:** Echten Zufall für Passwörter nutzen.

**💡 Warum:** 
Wenn es um Sicherheit geht (Passwörter, Token), reicht `random` nicht aus. Dafür gibt es das Modul **secrets**. Es nutzt die Hardware deines Computers, um Chaos zu erzeugen, das niemand berechnen kann.

**💻 Code:**
```python
import secrets
import string

# 1. Ein zufälliges Passwort-Zeichen wählen
zeichen = string.ascii_letters + string.digits + "!@#$%^&*"
einzel_zeichen = secrets.choice(zeichen)

# 2. Ein sicheres Token für eine Web-URL (wie bei Passwort-Reset)
token = secrets.token_urlsafe(16)
print(f"🔗 Sicherheits-Token: {token}")
```

**✅ Checkpoint:**
Regel: Nutze `random` für Spiele. Nutze `secrets` für Passwörter!

---

### 📍 Schritt 3: Der Passwort-Generator (Projekt)

**🎯 Ziel:** Ein Tool bauen, das komplexe Passwörter ausspuckt.

**💻 Code:**
```python
import secrets
import string

def generiere_passwort(laenge=12):
    # Alle möglichen Zeichen kombinieren
    pool = string.ascii_letters + string.digits + string.punctuation
    
    # laenge-mal ein Zeichen aus dem Pool ziehen
    passwort = "".join(secrets.choice(pool) for _ in range(laenge))
    
    return passwort

# Test
mein_pw = generiere_passwort(16)
print(f"🔐 Dein neues sicheres Passwort:\n{mein_pw}")
```

**✅ Checkpoint:**
`"".join(...)` klebt die vielen einzelnen Zeichen zu einem fertigen Wort zusammen.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Münzwurf**
Schreibe ein Programm, das "Kopf" oder "Zahl" ausgibt. Lass es 10-mal werfen und zähle, wie oft was kam.

**Level 2: Lotto-Simulator**
Generiere 6 zufällige Zahlen zwischen 1 und 49. **Wichtig:** Eine Zahl darf nicht doppelt vorkommen! (Tipp: `random.sample()`).

**Level 3: Wort-Würfel**
Erstelle eine Liste mit 20 Adjektiven und 20 Nomen. Generiere daraus zufällige Benutzernamen wie `CoolerElefant42` oder `SchnellerBlitz11`.

---

### 📚 Was du gelernt hast:

- ✅ **random.randint:** Zahlenbereiche auswürfeln.
- ✅ **random.choice / sample:** Aus Listen wählen.
- ✅ **secrets:** Sicherheit geht vor.
- ✅ **string-Modul:** Schneller Zugriff auf ABC und 123.
- ✅ **Join-Trick:** Einzelne Zeichen zu einem Passwort verschmelzen.

---

## Tag 26: Die Internet-Brücke (Requests & APIs)

### 📝 Aufgabe
Verbinde dein Programm mit der Welt. Lerne, wie du Daten von Webseiten abrufst und eine echte Wetter-App baust.

---

### 📍 Schritt 1: Das mentale Modell (Der digitale Kellner)

**🎯 Ziel:** Eine Webseite mit Python "aufrufen".

**💡 Warum:** 
Bisher war dein Code auf deinen Computer begrenzt. Mit **Requests** schickst du einen Bot ins Internet. Er besucht eine URL für dich und bringt den Inhalt zurück.

**💻 Code:**
```python
import requests

# Eine Bestellung abschicken
antwort = requests.get("https://www.google.com")

# Hat es geklappt? (200 bedeutet OK)
print(f"Status Code: {antwort.status_code}")

# Den "Quellcode" der Seite zeigen (nur die ersten 100 Zeichen)
print(f"Inhalt: {antwort.text[:100]}...")
```

**✅ Checkpoint:**
`requests.get(url)` ist das wichtigste Werkzeug. Der Status-Code `200` ist dein grünes Licht.

---

### 📍 Schritt 2: JSON aus dem Web (Die API)

**🎯 Ziel:** Strukturierte Daten (kein HTML) empfangen.

**💡 Warum:** 
Webseiten sind für Menschen (viel bunter Code). **APIs** sind Webseiten für Computer. Sie liefern saubere JSON-Daten (erinnerst du dich an Tag 22?).

**💻 Code:**
```python
import requests

# Eine kostenlose API für Astronauten-Daten
url = "http://api.open-notify.org/astros.json"

antwort = requests.get(url)

if antwort.status_code == 200:
    daten = antwort.json() # Verwandelt den Text-Salat sofort in ein Dict!
    anzahl = daten["number"]
    print(f"🚀 Aktuell sind {anzahl} Menschen im Weltraum!")
    
    for person in daten["people"]:
        print(f"  - {person['name']} (auf der {person['craft']})")
```

**✅ Checkpoint:**
Die Methode `.json()` ist die magische Brücke, die Internet-Daten direkt in Python-Verzeichnisse verwandelt.

---

### 📍 Schritt 3: Die Wetter-Station (Projekt)

**🎯 Ziel:** Live-Wetterdaten für deine Stadt abrufen.

**💡 Warum:** Wir nutzen die kostenlose *Open-Meteo* API. Sie braucht keinen Account und keinen Key!

**💻 Code:**
```python
import requests

def hol_wetter(lat, lon):
    # URL mit Koordinaten (hier Berlin: 52.52, 13.41)
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
    
    antwort = requests.get(url)
    if antwort.status_code == 200:
        w = antwort.json()["current_weather"]
        temp = w["temperature"]
        wind = w["windspeed"]
        print(f"🌡️ Aktuelle Temperatur: {temp}°C")
        print(f"💨 Windgeschwindigkeit: {wind} km/h")
    else:
        print("❌ Wetterdaten konnten nicht geladen werden.")

# Test Berlin
hol_wetter(52.52, 13.41)
```

**✅ Checkpoint:**
In der URL-Zeile werden oft Parameter (wie Breitengrad/Längengrad) mitgeschickt. Python kann diese mit F-Strings leicht zusammenbauen.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Status-Tester**
Schreibe ein Programm, das eine Liste von 3 Webseiten (z.B. Google, GitHub, Deine-Hobby-Seite) prüft und für jede ausgibt: "✅ Online" (Status 200) oder "❌ Probleme" (alles andere).

**Level 2: ISS-Tracker**
Suche online nach der API für die "ISS Position". Lasse dir die aktuellen Breitengrad (`latitude`) und Längengrad (`longitude`) der Raumstation anzeigen.

**Level 3: Universal-Wetter**
Erweitere die Wetter-App. Frage den User nach dem Breitengrad und Längengrad und gib das Wetter für diesen Ort aus.

---

### 📚 Was du gelernt hast:

- ✅ **requests.get:** Webseiten und Daten anfordern.
- ✅ **Status Codes:** Was uns das Internet mitteilen will (200=OK, 404=Nicht gefunden).
- ✅ **API:** Die Schnittstelle für Computer-Kommunikation.
- ✅ **.json():** Daten direkt im Code weiterverarbeiten.
- ✅ **Parameter:** Informationen in der URL mitschicken.

---

## Tag 27: Das digitale Sieb (Web Scraping)

### 📝 Aufgabe
Lade Informationen von Webseiten herunter, die keine API haben. Extrahiere automatisch Schlagzeilen oder Preise.

---

### 📍 Schritt 1: Das mentale Modell (Die Lupe)

**🎯 Ziel:** HTML-Code in Python analysieren.

**💡 Warum:** 
Viele Webseiten bieten keine saubere API an. Du siehst die Infos im Browser, aber dein Programm sieht nur einen riesigen Haufen HTML-Text. **BeautifulSoup** ist wie eine Lupe, die dir hilft, genau die richtigen Stellen in diesem Haufen zu finden.

**💻 Code:**
```python
import requests
from bs4 import BeautifulSoup

# Wir simulieren eine einfache Webseite als Text
html_code = """
<html>
    <body>
        <h1 id='titel'>Willkommen in meinem Blog</h1>
        <p class='text'>Erster Beitrag über Python.</p>
        <p class='text'>Zweiter Beitrag über Scraping.</p>
        <a href='http://example.com'>Mehr lesen</a>
    </body>
</html>
"""

# Die "Suppe" kochen (HTML analysieren)
soup = BeautifulSoup(html_code, "html.parser")

# Gezielt suchen
ueberschrift = soup.find("h1").text
print(f"📌 Titel gefunden: {ueberschrift}")

beitraege = soup.find_all("p", class_="text")
for b in beitraege:
    print(f"📝 Beitrag: {b.text}")
```

**✅ Checkpoint:**
`soup.find` sucht das erste Vorkommen. `soup.find_all` sucht alle. Mit `text` bekommst du den reinen Inhalt ohne die HTML-Klammern.

---

### 📍 Schritt 2: Echte Webseiten anzapfen

**🎯 Ziel:** Live-Daten aus dem Web laden.

**💡 Warum:** Du kannst jede URL laden und "scrapen". Wir brauchen aber einen Trick: Die Webseite muss denken, wir sind ein normaler Browser (kein Bot). Dafür nutzen wir `headers`.

**💻 Code:**
```python
import requests
from bs4 import BeautifulSoup

url = "https://www.wikipedia.org"
header = {"User-Agent": "Mozilla/5.0"}

reaktion = requests.get(url, headers=header)
soup = BeautifulSoup(reaktion.text, "html.parser")

# Wir suchen die Sprachen auf der Wikipedia-Startseite
sprachen = soup.find_all("strong") # Wikipedia nutzt strong für die Top-Sprachen

print("🌍 Top Sprachen auf Wikipedia:")
for s in sprachen[:10]:
    print(f"  - {s.text}")
```

**✅ Checkpoint:**
Der `User-Agent` Header sagt der Webseite: "Hallo, ich bin ein Firefox Browser". Das verhindert oft, dass dein Programm blockiert wird.

---

### 📍 Schritt 3: Der News-Ticker (Projekt)

**🎯 Ziel:** Automatisch Schlagzeilen sammeln.

**📝 Anleitung:**
Wir gehen auf eine Beispiel-Seite (oder eine echte News-Seite deiner Wahl) und sammeln alle Links in den Überschriften (`<a>` Tags innerhalb von `<h2>` oder `<h3>`).

**💻 Code:**
```python
import requests
from bs4 import BeautifulSoup

URL = "https://news.ycombinator.com/" # Hacker News (sehr einfach zu scrapen)

def hole_schlagzeilen():
    r = requests.get(URL)
    soup = BeautifulSoup(r.text, "html.parser")
    
    # Auf Hacker News haben alle Titel die Klasse 'titleline'
    links = soup.select(".titleline a")
    
    print("🔥 TOP NEWS HEUTE:")
    for i, link in enumerate(links[:15], 1):
        # Nur der erste Link im titleline-Containter ist die Schlagzeile
        if "https" in link.get("href"):
             print(f"{i}. {link.text}")
             print(f"   🔗 {link.get('href')}\n")

hole_schlagzeilen()
```

**✅ Checkpoint:**
`soup.select` kann CSS-Editoren nutzen (wie `.klasse` oder `#id`). Das ist oft profimäßiger und schneller.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Link-Sammler**
Schreibe ein Programm, das eine URL deiner Wahl lädt und ALLE Links (`<a href="...">`) auf dieser Seite ausdruckt.

**Level 2: Preis-Check**
Suche dir einen Online-Shop (Achtung: Erlaubnis prüfen!). Versuche den Preis eines bestimmten Artikels zu finden, indem du nach dem `id` oder der `class` des Preis-Elements suchst.

**Level 3: HTML-Downloader**
Baue ein Skript, das den kompletten Text (ohne HTML-Tags) einer Webseite in einer Datei `webpage_content.txt` speichert. Nutze `soup.get_text()`.

---

### 📚 Was du gelernt hast:

- ✅ **BeautifulSoup:** Die Struktur hinter dem HTML verstehen.
- ✅ **find / find_all:** Gezielte Jagd auf Tags.
- ✅ **select:** CSS-Selektoren im Python-Code nutzen.
- ✅ **attributes:** Wie man Links (`href`) und Klassen ausliest.
- ✅ **Ethik:** Webseiten nicht durch zu viele Anfragen überlasten.

---

## Tag 28: Der Datentresor (SQLite)

### 📝 Aufgabe
Höre auf, Daten in Textdateien zu speichern. Lerne SQLite kennen und baue eine echte Datenbank für deine Aufgaben.

---

### 📍 Schritt 1: Das mentale Modell (Der Datentresor)

**🎯 Ziel:** Eine Datenbank erstellen und Tabellen anlegen.

**💡 Warum:** 
CSV und JSON sind okay für kleine Mengen. Aber wenn du 10.000 Einträge hast, werden sie langsam. Eine **Datenbank** ist wie ein perfekt organisierter Aktenschrank. Du kannst blitzschnell nach einer bestimmten Sache suchen, ohne alles durchlesen zu müssen.

**💻 Code:**
```python
import sqlite3

# 1. Verbindung herstellen (Erstellt die Datei, falls sie nicht existiert)
verbindung = sqlite3.connect("mein_planer.db")

# 2. Ein Cursor ist wie ein kleiner Roboter, der Befehle ausführt
cursor = verbindung.cursor()

# 3. Eine Tabelle erstellen (SQL-Sprache)
cursor.execute("""
CREATE TABLE IF NOT EXISTS aufgaben (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT,
    status TEXT
)
""")

# 4. Speichern und Schließen
verbindung.commit()
verbindung.close()
print("✅ Datenbank ist bereit!")
```

**✅ Checkpoint:**
`sqlite3` ist in Python eingebaut. Es speichert alles in einer einzigen `.db` Datei. `commit()` ist der "Speichern-Knopf" – ohne ihn wird nichts dauerhaft übernommen.

---

### 📍 Schritt 2: Informationen speichern und abrufen

**🎯 Ziel:** Daten in die Tabelle schreiben (INSERT) und lesen (SELECT).

**💡 Warum:** Du fütterst den Tresor mit Daten und fragst später gezielt danach.

**💻 Code:**
```python
import sqlite3

conn = sqlite3.connect("mein_planer.db")
c = conn.cursor()

# Daten EINFÜGEN
aufgabe = ("Python lernen", "offen")
c.execute("INSERT INTO aufgaben (titel, status) VALUES (?, ?)", aufgabe)
conn.commit()

# Daten LESEN
c.execute("SELECT * FROM aufgaben")
alle_aufgaben = c.fetchall()

for spalte in alle_aufgaben:
    print(f"ID: {spalte[0]} | Titel: {spalte[1]} | Status: {spalte[2]}")

conn.close()
```

**✅ Checkpoint:**
Nutze niemals F-Strings für SQL-Befehle (Sicherheitsrisiko!). Nutze das Fragezeichen `?` und übergib die Daten als Tupel.

---

### 📍 Schritt 3: Aktualisieren und Löschen (CRUD)

**🎯 Ziel:** Bestehende Einträge ändern oder entfernen.

**💡 Warum:** Aufgaben werden fertiggestellt (Update) oder man hat sich verschrieben (Delete).

**💻 Code:**
```python
import sqlite3

conn = sqlite3.connect("mein_planer.db")
c = conn.cursor()

# 1. UPDATE: Status ändern (Wo die ID 1 ist)
c.execute("UPDATE aufgaben SET status = 'erledigt' WHERE id = 1")

# 2. DELETE: Eine Aufgabe löschen
# c.execute("DELETE FROM aufgaben WHERE id = 1")

conn.commit()
conn.close()
print("✅ Update erfolgreich.")
```

**✅ Checkpoint:**
Das `WHERE` ist extrem wichtig! Ohne `WHERE` würde `DELETE` alle Zeilen in der Tabelle löschen.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Die Bücher-Datenbank**
Erstelle eine neue Datenbank `bibliothek.db` mit einer Tabelle `buecher`. Speichere 3 deiner Lieblingsbücher mit Titel und Autor.

**Level 2: Der Preis-Vergleicher**
Schreibe ein Programm, das Produkte und ihre Preise speichert. Nutze SQL, um nur Produkte anzuzeigen, die mehr als 50 € kosten (`SELECT * FROM produkte WHERE preis > 50`).

**Level 3: Interaktives Menü**
Kombiniere dein Wissen aus Tag 12 (Eingabe-Schleife) mit der Datenbank. Baue ein Menü: 1. Anzeigen, 2. Hinzufügen, 3. Löschen.

---

### 📚 Was du gelernt hast:

- ✅ **sqlite3:** Die eingebaute Datenbank von Python.
- ✅ **SQL Basics:** CREATE, INSERT, SELECT, UPDATE, DELETE.
- ✅ **Cursor:** Der Befehlsausführer für Datenbanken.
- ✅ **commit:** Den Tresor sicher abschließen.
- ✅ **Sicherheit:** Parameter (`?`) statt F-Strings in SQL nutzen.

---

## Tag 29: Das Schweizer Taschenmesser (Finanz-Projekt)

### 📝 Aufgabe
Kombiniere alles, was du gelernt hast (Listen, Dictionaries, Dateien, Zeit), zu einer nützlichen App: Einem persönlichen Finanz-Manager.

---

### 📍 Schritt 1: Die App-Architektur

**🎯 Ziel:** Daten und Logik trennen.

**💡 Warum:** 
Professionelle Programme werfen nicht alles in einen Topf. Wir teilen die App auf:
1.  **Speicher:** Wo liegen die Daten?
2.  **Logik:** Wie rechnen wir?
3.  **Benutzer-Interface:** Wie interagiert der Mensch?

**💻 Code:**
```python
import json
from datetime import datetime

class FinanzManager:
    def __init__(self, datei="meine_finanzen.json"):
        self.datei = datei
        self.ausgaben = self._laden()

    def _laden(self):
        try:
            with open(self.datei, "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def speichern(self):
        with open(self.datei, "w") as f:
            json.dump(self.ausgaben, f, indent=4)
```

**✅ Checkpoint:**
Die private Methode `_laden()` kümmert sich um den Dateizugriff, sodass du im restlichen Programm nur noch mit `self.ausgaben` arbeitest.

---

### 📍 Schritt 2: Die Logik (Rechnen & Hinzufügen)

**🎯 Ziel:** Funktionen zum Verarbeiten der Daten einbauen.

**💻 Code:**
```python
    def neue_ausgabe(self, titel, betrag, kategorie):
        eintrag = {
            "datum": datetime.now().strftime("%Y-%m-%d"),
            "titel": titel,
            "betrag": float(betrag),
            "kategorie": kategorie
        }
        self.ausgaben.append(eintrag)
        self.speichern()

    def gesamt_summe(self):
        return sum(item["betrag"] for item in self.ausgaben)

    def stats_nach_kategorie(self):
        stats = {}
        for item in self.ausgaben:
            kat = item["kategorie"]
            stats[kat] = stats.get(kat, 0) + item["betrag"]
        return stats
```

**✅ Checkpoint:**
Hier nutzen wir Dictionaries (Tag 8), Listen-Manipulation (Tag 4) und Summen-Generation.

---

### 📍 Schritt 3: Das Terminal-Interface (Das Gehirn)

**🎯 Ziel:** Alles zusammenfügen und steuerbar machen.

**💻 Code:**
```python
def main():
    manager = FinanzManager()
    
    while True:
        print("\n--- 💰 FINANZ-MANAGER ---")
        print(f"Aktueller Kontostand: -{manager.gesamt_summe():.2f} €")
        print("1. Neue Ausgabe | 2. Verlauf | 3. Statistiken | 4. Ende")
        
        wahl = input("Auswahl: ")
        
        if wahl == "1":
            t = input("Was hast du gekauft? ")
            b = input("Wie viel hat es gekostet? ")
            k = input("Kategorie (Essen/Freizeit/...): ")
            manager.neue_ausgabe(t, b, k)
            
        elif wahl == "2":
            for a in manager.ausgaben:
                print(f"[{a['datum']}] {a['titel']}: -{a['betrag']} € ({a['kategorie']})")
                
        elif wahl == "3":
            for kat, summe in manager.stats_nach_kategorie().items():
                print(f"📍 {kat}: {summe:.2f} €")
                
        elif wahl == "4":
            print("👋 Spar schön weiter!")
            break

if __name__ == "__main__":
    main()
```

**✅ Checkpoint:**
Diese `main()` Funktion ist das Herzstück. Sie verbindet deine Logik mit der echten Welt (dem Benutzer).

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Die Lösch-Funktion**
Füge eine Option "Eintrag löschen" hinzu. Der User gibt den Namen eines Titels ein, und dieser wird aus der Liste entfernt.

**Level 2: Zeit-Filter**
Schreibe eine Funktion, die nur die Ausgaben des aktuellen Monats anzeigt. Nutze `datetime` Wissen, um das Datum zu vergleichen.

**Level 3: CSV-Export**
Baue eine Funktion `export_csv()`, die alle Daten in eine Excel-lesbare `finanzen.csv` schreibt (Nutze `csv.DictWriter` von Tag 23).

---

### 📚 Was du gelernt hast:

- ✅ **Integration:** Wie verschiedene Themen (JSON, Datetime, Klassen) zusammen eine App ergeben.
- ✅ **Code-Struktur:** Warum OOP (Klassen) für wachsende Programme besser ist.
- ✅ **Data Processing:** Daten filtern, summieren und gruppieren.
- ✅ **User Experience:** Ein einfaches Menü flüssig bedienbar machen.
- ✅ **Persistenz:** Eine echte App bauen, die ihre Daten niemals vergisst.

---

## Tag 30: Das Finale (Produktivitäts-Hub)

### 📝 Aufgabe
HERZLICHEN GLÜCKWUNSCH! Du hast 30 Tage durchgezogen. Heute baust du dein Meisterwerk: Eine modulare Zentrale, die all deine bisherigen Tools an einem Ort vereint.

---

### 📍 Schritt 1: Das mentale Modell (Die Kommando-Zentrale)

**🎯 Ziel:** Eine Oberfläche für mehrere Module bauen.

**💡 Warum:** 
Bisher hattest du viele kleine Skripte. Heute erschaffen wir einen "Hub". Er ist das Betriebssystem deiner eigenen Tools. Du startest EIN Programm und hast Zugriff auf dein Wetter, deine Finanzen und deine Notizen.

**💻 Code:**
```python
# DAS GERÜST
import os

class MyHabitHub:
    def __init__(self):
        self.username = "Python-Held"
        self.modules = ["Wetter", "Finanzen", "Notizen", "Passwort-Gen"]

    def zeige_willkommen(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print("=" * 40)
        print(f"🌟 WILLKOMMEN IM HUB, {self.username.upper()} 🌟")
        print("=" * 40)
```

---

### 📍 Schritt 2: Module integrieren

**🎯 Ziel:** Vorhandene Skripte als Funktionen oder Klassen einbinden.

**💡 Warum:** Du musst das Rad nicht neu erfinden. Wir nutzen den Code von Tag 26 (Wetter), Tag 29 (Finanzen) und Tag 12 (Notizen) und fügen sie hier ein.

**💻 Code:**
```python
    # Beispiel Integration Wetter (von Tag 26)
    def wetter_modul(self):
        print("\n🌤️ Lade Live-Wetter...")
        # Hier käme dein requests-Code von Tag 26 hin!
        print("Status: 22°C (Sonnig) in Berlin.")
        input("\n[Enter] zum Hub zurück...")

    # Beispiel Integration Finanzen (von Tag 29)
    def finanz_modul(self):
        print("\n💰 Finanzübersicht:")
        # Hier käme deine FinanzManager-Klasse hin!
        input("\n[Enter] zum Hub zurück...")
```

---

### 📍 Schritt 3: Die Hauptschleife (Der Motor)

**🎯 Ziel:** Ein flüssiges App-Gefühl erzeugen.

**💻 Code:**
```python
    def run(self):
        while True:
            self.zeige_willkommen()
            for i, mod in enumerate(self.modules, 1):
                print(f"{i}. {mod}")
            print("0. Beenden")
            
            wahl = input("\nWas möchtest du tun? ")
            
            if wahl == "1": self.wetter_modul()
            elif wahl == "2": self.finanz_modul()
            elif wahl == "0": 
                print("👋 Bis morgen!")
                break
```

---

### 📍 Schritt 4: Dein Abschluss-Zertifikat

**🎯 Ziel:** Eigenständig eine NEUE Funktion hinzufügen.

**📝 Deine letzte Aufgabe:**
Füge dem Hub ein Modul hinzu, das es noch nicht gab.
- Vielleicht ein **Währungsrechner**? (Nutze `requests` für Kurse)
- Einen **Vokabeltrainer**? (Nutze eine CSV-Datei)
- Ein **Mini-Game**? (Nutze `random`)

---

### 📚 Was du in 30 Tagen geschafft hast:

- ✅ **Woche 1:** Die Basics (Variablen, Listen, Schleifen, Funktionen). Du hast sprechen gelernt.
- ✅ **Woche 2:** Daten-Strukturen & Dateien. Du hast ein Gedächtnis bekommen.
- ✅ **Woche 3:** OOP & System-Tools. Du hast gelernt, wie man wie ein Profi-Architekt baut.
- ✅ **Woche 4:** APIs & Reale Welt. Du hast gelernt, deinen Computer mit der ganzen Welt zu vernetzen.

**Du bist jetzt kein Anfänger mehr. Du bist ein Problemlöser.**

---

### 🏆 DAS FINALE
Teile deinen Hub mit anderen oder nutze ihn jeden Tag. Python ist jetzt dein Werkzeug. Was wirst du als Nächstes bauen?

**ENDE DER 30-TAGE-REISE.**
**Viel Erfolg beim weiteren Coden! 🐍✨**

---

