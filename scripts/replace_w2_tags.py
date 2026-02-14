
import sys

filepath = r"c:/Users/Maurice/OneDrive - BFW-Leipzig/Mull/PythonLernen/WochenPlan/woche2_strukturen.md"

tag_12_content = """## Tag 12: Notiz-App (Dateien Schreiben)

### 📝 Aufgabe
Entwickle eine App, die sich Dinge merken kann, auch wenn du den Computer ausschaltest.

---

### 📍 Schritt 1: Das mentale Modell (Der Schreiber)

**🎯 Ziel:** Den Unterschied zwischen `w` (Write) und `a` (Append) verstehen.

**💡 Warum:** 
`w` ist aggressiv: Es löscht den alten Inhalt SOFORT. Wie eine Tafel wischen.
`a` ist sanft: Es hängt Neues hinten an. Wie ein Tagebuch fortführen.

**💻 Code:**
```python
# DAS EXPERIMENT

# 1. Wir schreiben etwas (w)
with open("tagebuch.txt", "w", encoding="utf-8") as f:
    f.write("Tag 1: Ich habe Python gelernt.\\n")

# 2. Wir nutzen wieder 'w' (ACHTUNG!)
with open("tagebuch.txt", "w", encoding="utf-8") as f:
    f.write("Tag 2: Alles ist weg!\\n")

# -- Datei prüfen --
with open("tagebuch.txt", "r", encoding="utf-8") as f:
    print(f"Inhalt nach 'w':\\n{f.read()}")

# 3. Wir nutzen 'a' (Append)
with open("tagebuch.txt", "a", encoding="utf-8") as f:
    f.write("Tag 3: Das hier bleibt.\\n")

# -- Datei prüfen --
with open("tagebuch.txt", "r", encoding="utf-8") as f:
    print(f"Inhalt nach 'a':\\n{f.read()}")
```

**✅ Checkpoint:**
Nutze `w` nur, wenn du **neu anfangen** willst. Nutze `a` für Logs oder Listen.

---

### 📍 Schritt 2: Strukturierte Daten (JSON)

**🎯 Ziel:** Listen und Dictionaries speichern.

**💡 Warum:** Du kannst eine Liste ["Apfel", "Banane"] nicht einfach mit f.write() speichern (das erwartet String).
Wir nutzen **JSON** (JavaScript Object Notation) - das Standardformat im Web.

**💻 Code:**
```python
import json

daten = {
    "highscore": 9999,
    "benutzer": "Mario",
    "items": ["Pilz", "Blume", "Stern"],
    "level_beendet": True
}

# SPEICHERN (Dump)
with open("spielstand.json", "w", encoding="utf-8") as f:
    json.dump(daten, f, indent=4) # indent=4 macht es schön lesbar

print("✅ Spielstand gespeichert!")

# LADEN (Load)
with open("spielstand.json", "r", encoding="utf-8") as f:
    geladen = json.load(f)

print(f"Geladener Highscore: {geladen['highscore']}")
print(f"Items: {geladen['items']}")
```

**✅ Checkpoint:**
json.dump() speichert, json.load() lädt. Es verwandelt Python-Objekte automatisch in Text und zurück!

---

### 📍 Schritt 3: Die To-Do App (Projekt)

**🎯 Ziel:** Eine echte Anwendung bauen.

**📝 Anleitung:**
Wir brauchen:
1.  Eine laden() Funktion.
2.  Eine speichern() Funktion.
3.  Eine Schleife für User-Input.

**💻 Code:**
```python
import json
import os

DATEI = "todos.json"

def lade_todos():
    if not os.path.exists(DATEI):
        return [] # Leere Liste wenn Datei fehlt
    with open(DATEI, "r", encoding="utf-8") as f:
        return json.load(f)

def speichere_todos(todos):
    with open(DATEI, "w", encoding="utf-8") as f:
        json.dump(todos, f, indent=4)

# Hauptprogramm
todos = lade_todos()
print(f"📅 Willkommen! Du hast {len(todos)} Aufgaben.")

while True:
    print("\\n1. Anzeigen | 2. Hinzufügen | 3. Löschen | 4. Ende")
    wahl = input("Auswahl: ")
    
    if wahl == "1":
        for i, todo in enumerate(todos, 1):
            status = "[x]" if todo['erledigt'] else "[ ]"
            print(f"{i}. {status} {todo['text']}")
            
    elif wahl == "2":
        text = input("Aufgabe: ")
        todos.append({"text": text, "erledigt": False})
        speichere_todos(todos) # Sofort speichern!
        print("✅ Gespeichert.")
        
    elif wahl == "3":
        nummer = int(input("Nummer löschen: "))
        if 0 < nummer <= len(todos):
            geloescht = todos.pop(nummer - 1)
            speichere_todos(todos)
            print(f"🗑️ '{geloescht['text']}' gelöscht.")
            
    elif wahl == "4":
        print("👋 Bye!")
        break
```

**✅ Checkpoint:**
Starte das Programm, füge etwas hinzu, beende es. Starte es NEU. Deine Daten sind noch da! Das ist **Persistenz**.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Erledigen**
Füge Option "5. Erledigen" hinzu. Der User gibt eine Nummer ein, und der Status ändert sich von False auf True ([x]).

**Level 2: Highscore-Liste**
Schreibe ein kleines Zahlen-Ratespiel (aus Tag 6), das den Highscore (wenigste Versuche) in highscore.txt speichert. Beim Start soll der aktuelle Rekord angezeigt werden.

**Level 3: Das Logbuch**
Erstelle logger.py. Jedes Mal wenn du es ausführst (python logger.py "Hallo"), soll es Datum + Uhrzeit + Nachricht in logbuch.txt ANHÄNGEN.

---

### 📚 Was du gelernt hast:

- ✅ **`w` vs `a`:** Überschreiben vs Anhängen.
- ✅ **JSON:** Der Goldstandard für Daten-Speicherung.
- ✅ **Persistenz:** Daten überleben den Programm-Absturz.
- ✅ **`os.path.exists`:** Prüfen bevor man lädt.

---
"""

tag_13_content = """## Tag 13: Robuster Code (Error Handling)

### 📝 Aufgabe
Mache deine Programme unzerstörbar. Lerne, wie du Fehler abfängst, bevor sie zum Absturz führen.

---

### 📍 Schritt 1: Das mentale Modell (Das Sicherheitsnetz)

**🎯 Ziel:** Verstehen, warum Programme abstürzen und wie man es verhindert.

**💡 Warum:** 
Normaler Code ist wie ein Seiltänzer ohne Netz. Ein Stolperer (z.B. eine falsche Benutzereingabe) und das Programm stürzt ab.
**Error Handling** ist das Sicherheitsnetz. Wenn der Tänzer fällt, wird er aufgefangen und kann weitergehen.

**💻 Code:**
```python
# DAS EXPERIMENT: Was passiert beim Absturz?
# zahl = int(input("Gib eine Zahl ein: ")) # Wenn ich "hallo" tippe -> CRASH!

# DIE RETTUNG: try-except
try:
    eingabe = input("Gib eine Zahl ein: ")
    zahl = int(eingabe)
    print(f"Super! Deine Zahl ist {zahl}")
except ValueError:
    # Das hier passiert NUR, wenn oben ein ValueError auftritt
    print("❌ Ups! Das war keine Zahl. Bitte probier es nochmal.")

print("Programm läuft sicher weiter...")
```

**✅ Checkpoint:**
Der Code im `try`-Block wird "ausprobiert". Wenn ein Fehler passiert, springt Python sofort in den `except`-Block.

---

### 📍 Schritt 2: Spezifische Fangnetze

**🎯 Ziel:** Verschiedene Fehler unterschiedlich behandeln.

**💡 Warum:** Eine Division durch Null ist ein anderes Problem als eine fehlende Datei. Wir wollen genau wissen, was schiefgelaufen ist.

**💻 Code:**
```python
def teile_zahlen():
    try:
        a = float(input("Zahl 1: "))
        b = float(input("Zahl 2: "))
        ergebnis = a / b
        print(f"Ergebnis: {ergebnis}")
    except ValueError:
        print("❌ Bitte nur Zahlen eingeben!")
    except ZeroDivisionError:
        print("❌ Du kannst nicht durch Null teilen!")
    except Exception as e:
        # Der "Joker": Fängt alles andere ab
        print(f"❓ Unerwarteter Fehler: {e}")

teile_zahlen()
```

**✅ Checkpoint:**
Man kann beliebig viele `except`-Blöcke untereinander schreiben. Python nimmt den ersten, der passt.

---

### 📍 Schritt 3: Aufräumen mit `finally`

**🎯 Ziel:** Sicherstellen, dass Code IMMER ausgeführt wird.

**💡 Warum:** Wenn du eine Datei öffnest, musst du sie schließen – egal ob ein Fehler passiert ist oder nicht. `finally` ist die Aufräum-Kolonne.

**💻 Code:**
```python
try:
    f = open("geheim.txt", "w")
    f.write("Das ist ein Test.")
    # Stell dir vor, hier passiert ein Fehler...
    x = 1 / 0
except ZeroDivisionError:
    print("Fehler berechnet!")
finally:
    f.close()
    print("🧹 Datei wurde sicher geschlossen.")
```

**✅ Checkpoint:**
Der `finally`-Block läuft **immer**, egal ob ein Fehler passiert ist, abgefangen wurde oder das Programm glatt lief.

---

### 📍 Schritt 4: Alarm schlagen (`raise`)

**🎯 Ziel:** Eigene Fehler auslösen.

**💡 Warum:** Manchmal ist für Python alles okay, aber für deine App nicht (z.B. ein Alter von -5 Jahren). Dann kannst du selbst einen Fehler "werfen".

**💻 Code:**
```python
def setze_alter(alter):
    if alter < 0:
        # Wir lösen manuell einen Fehler aus
        raise ValueError("Alter kann nicht negativ sein!")
    print(f"Alter gesetzt auf {alter}")

try:
    setze_alter(-10)
except ValueError as e:
    print(f"🚫 Fehler im Programm: {e}")
```

**✅ Checkpoint:**
Mit `raise` signalisierst du: "Stopp! Hier stimmt etwas logisch nicht."

---

### 📍 Schritt 5: Challenge Time!

**Level 1: Der Robuste Rechner**
Schreibe eine Endlosschleife, die zwei Zahlen addiert. Fange `ValueError` ab, falls der User keine Zahl eingibt, damit das Programm nicht beendet wird.

**Level 2: Datei-Check**
Frage den User nach einem Dateinamen. Versuche die Datei zu öffnen und den Inhalt anzuzeigen. Fange den `FileNotFoundError` ab und gib eine freundliche Meldung aus.

**Level 3: Eigene Validierung**
Schreibe eine Funktion `check_passwort(pw)`. Wenn das Passwort kürzer als 8 Zeichen ist, löse einen `ValueError` mit einer passenden Nachricht aus.

---

### 📚 Was du gelernt hast:

- ✅ **try-except:** Das Sicherheitsnetz für deinen Code.
- ✅ **Spezifische Errors:** Gezielte Hilfe für den User (ValueError, ZeroDivisionError).
- ✅ **finally:** Der Aufräum-Meister.
- ✅ **raise:** Selbst die Kontrolle über Fehler übernehmen.
- ✅ **Stabilität:** Programme schreiben, die niemals crashen.

---
"""

tag_14_content = """## Tag 14: Der Werkzeugkasten (Module & Imports)

### 📝 Aufgabe
Höre auf, alles selbst zu schreiben! Lerne, wie du fertige Bausteine nutzt und deinen Code in eigene "Werkzeuge" aufteilst.

---

### 📍 Schritt 1: Das mentale Modell (Der LEGO-Baukasten)

**🎯 Ziel:** Verstehen, was Module sind.

**💡 Warum:** 
Stell dir vor, du müsstest für jedes LEGO-Haus die Plastiksteine erst selbst gießen. Unmöglich! 
In Python sind **Module** fertige Boxen mit Steinen (Funktionen & Klassen). 
Ein Profi nutzt, was schon da ist, und baut nur die speziellen Teile selbst.

**💻 Code:**
```python
# Die Werkzeugkiste öffnen (Standard Library)
import random
import math
import time

# Ein fertiges Werkzeug nutzen
print("🎲 Würfeln...", end="", flush=True)
time.sleep(1) # Kurze Pause
ergebnis = random.randint(1, 6)
print(f" {ergebnis}!")

# Mathematische Profi-Werkzeuge
radius = 5
flaeche = math.pi * radius**2
print(f"⭕ Fläche des Kreises: {flaeche:.2f}")
```

**✅ Checkpoint:**
`import` lädt eine ganze Kiste voller Werkzeuge. Um ein Werkzeug zu nutzen, schreibst du `Kiste.Werkzeug`.

---

### 📍 Schritt 2: Gezielter Zugriff

**🎯 Ziel:** Nur das importieren, was man wirklich braucht.

**💡 Warum:** Wenn du nur einen Hammer brauchst, schleppst du nicht den ganzen Werkstatt-Schrank mit. Das spart Tipparbeit und macht den Code sauberer.

**💻 Code:**
```python
# Nur zwei Steine aus der Box holen
from math import sqrt, ceil

# Wir brauchen kein "math." mehr davor!
wurzel = sqrt(16)
aufgerundet = ceil(4.2)

print(f"Wurzel: {wurzel}, Aufgerundet: {aufgerundet}")

# Profi-Tipp: Eigenen Namen geben (Alias)
import datetime as dt
jetzt = dt.datetime.now()
print(f"📅 Datum: {jetzt}")
```

**✅ Checkpoint:**
`from Modul import Funktion` holt das Werkzeug direkt in deinen Code. Aber Vorsicht: Wenn du eine eigene Funktion mit dem gleichen Namen hast, gibt es Chaos!

---

### 📍 Schritt 3: Die eigene Werkstatt (Eigene Module)

**🎯 Ziel:** Code über mehrere Dateien verteilen.

**💡 Warum:** Wenn dein Programm 1000 Zeilen lang wird, verlierst du den Überblick. Du lagerst Funktionen in eigene Dateien aus.

**📝 Anleitung:**
1. Erstelle eine Datei `mein_werkzeug.py`.
2. Erstelle eine zweite Datei `hauptprogramm.py`.

**💻 Code:**
*Datei: `mein_werkzeug.py`*
```python
def sag_hallo(name):
    return f"Moin {name}! Wie läuft das Programmieren?"

def quadrat(zahl):
    return zahl * zahl
```

*Datei: `hauptprogramm.py`*
```python
import mein_werkzeug

print(mein_werkzeug.sag_hallo("Coder"))
print(f"Das Quadrat von 8 ist {mein_werkzeug.quadrat(8)}")
```

**✅ Checkpoint:**
Jede `.py` Datei in deinem Ordner ist automatisch ein Modul, das du importieren kannst.

---

### 📍 Schritt 4: Das Geheimnis von `__main__`

**🎯 Ziel:** Verhindern, dass Module von selbst losrollen.

**💡 Warum:** Wenn du ein Modul importierst, führt Python den Code darin aus. Wenn du dort Test-Prints hast, erscheinen die plötzlich in deinem Hauptprogramm. Das wollen wir verhindern.

**💻 Code:**
*Datei: `rechner.py`*
```python
def addiere(a, b):
    return a + b

# Dieser Block wird NUR ausgeführt, wenn du rechner.py DIREKT startest,
# aber NICHT, wenn du es importierst!
if __name__ == "__main__":
    print("--- Selbsttest des Rechners ---")
    print(f"Test: 2 + 2 = {addiere(2, 2)}")
```

**✅ Checkpoint:**
Nutze diesen "Zauber-Satz" immer, wenn du Test-Code in deinen Modulen behalten willst.

---

### 📍 Schritt 5: Challenge Time!

**Level 1: Zufalls-Menü**
Importiere random. Erstelle eine Liste mit 5 Gerichten. Importiere auch time. Gib eine Meldung aus "Der Chefkoch überlegt...", warte 2 Sekunden mit sleep(), und gib dann ein zufälliges Gericht aus.

**Level 2: Die Geometrie-Box**
Erstelle ein eigenes Modul geometrie.py mit Funktionen für den Umfang eines Kreises und die Fläche eines Quadrats. Importiere es in ein main.py und nutze die Funktionen.

**Level 3: Feiertags-Scanner**
Recherche online: Welches Modul nutzt man in Python, um das aktuelle Jahr auszugeben? Baue ein Programm, das prüft, wie viele Tage es noch bis zum 24. Dezember sind.

---

### 📚 Was du gelernt hast:

- ✅ **Standard-Lib:** Die riesige Schatzkiste von Python nutzen.
- ✅ **from / import:** Gezielter Zugriff auf Werkzeuge.
- ✅ **Module bauen:** Code modular und übersichtlich halten.
- ✅ **Abstraktion:** Funktionen in Dateien auslagern und wiederverwenden.
- ✅ **Standard-Muster:** Den professionellen Aufbau von Scripts (if __name__ == "__main__":).

---
"""

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
tag_12_added = False
tag_13_added = False
tag_14_added = False

for line in lines:
    if "## Tag 12: Notiz-App (Dateien Schreiben)" in line:
        skip = True
        if not tag_12_added:
            new_lines.append(tag_12_content + "\n")
            tag_12_added = True
        continue
    
    if "## Tag 13: Robuster Datei-Reader (Error Handling)" in line:
        skip = True
        if not tag_13_added:
            new_lines.append(tag_13_content + "\n")
            tag_13_added = True
        continue

    if "## Tag 14: Eigenes Tool-Modul (Module & Imports)" in line:
        skip = True
        if not tag_14_added:
            new_lines.append(tag_14_content + "\n")
            tag_14_added = True
        continue
    
    # Check for the end of Tag 14 / start of Week 3
    if "## Tag 15:" in line:
        skip = False
    
    if not skip:
        new_lines.append(line)

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("✅ Successfully replaced Tag 12, 13, and 14.")
