# 🐍 30-Tage Python Kurs - Woche 3: OOP & Dateimanagement

## 📖 Über Woche 3

**Was du diese Woche lernst:**
Objektorientierte Programmierung (OOP) und praktische Datei-Management-Tools!

**Themen:**
- ✅ Tag 15: Classes Basics (Bankkonto-Simulator)
- ✅ Tag 16: Classes Advanced (Spielcharakter-System)
- ✅ Tag 17: Vererbung (Tier-Hierarchie)
- ✅ Tag 18: OS-Modul (Ordner-Organizer)
- ✅ Tag 19: Pathlib (Datei-Scanner)
- ✅ Tag 20: Shutil (Backup-Tool)
- ✅ Tag 21: Glob & Batch-Operationen (Batch-Renamer)

**Zeitaufwand:** 7 Tage × 5-15 Minuten = ca. 1-2 Stunden gesamt

---

## Tag 15: Dein erster Bauplan (Klassen Basics)

### 📝 Aufgabe
Höre auf, nur Funktionen zu schreiben. Lerne, wie du eigene "Dinge" (Objekte) erschaffst, die Daten und Aktionen kombinieren.

---

### 📍 Schritt 1: Das mentale Modell (Der Keks-Ausstecher)

**🎯 Ziel:** Den Unterschied zwischen Klasse und Objekt verstehen.

**💡 Warum:** 
Bisher hast du Daten (Variablen) und Aktionen (Funktionen) getrennt behandelt. In der echten Welt gehört das aber zusammen. 
Ein **Konto** hat einen **Betrag** (Daten) und man kann **einzahlen** (Aktion).
Die **Klasse** ist der **Bauplan** (oder Keks-Ausstecher).
Das **Objekt** ist das **fertige Haus** (oder der Keks).

**💻 Code:**
```python
# DER BAUPLAN (Klasse)
class Bankkonto:
    # Die Geburtsstunde eines Objekts
    def __init__(self, besitzer, kontostand=0):
        self.besitzer = besitzer      # Daten speichern
        self.kontostand = kontostand  # Daten speichern
        print(f"✅ Konto für {besitzer} wurde eröffnet.")

# DAS PRODUKT (Objekt)
konto_mario = Bankkonto("Mario", 100)
konto_luigi = Bankkonto("Luigi", 50)

print(f"{konto_mario.besitzer} hat {konto_mario.kontostand} €")
```

**✅ Checkpoint:**
`__init__` ist die Funktion, die Python automatisch aufruft, wenn du ein neues Objekt erstellst.

---

### 📍 Schritt 2: Das Geheimnis von `self`

**🎯 Ziel:** Verstehen, warum `self` überall steht.

**💡 Warum:** 
Wenn du 100 Konten hast und sagst "Zahle Geld ein", muss Python wissen: "In welches Konto?". 
`self` ist wie ein Finger, der auf das aktuelle Objekt zeigt. Es sagt: "Meine Daten", "Meine Aktionen".

**💻 Code:**
```python
class Hund:
    def __init__(self, name):
        self.name = name # "Mein Name ist..."

    def bellen(self):
        print(f"{self.name} sagt: Wuff! Wuff!")

mein_hund = Hund("Bello")
mein_hund.bellen() # Python macht daraus intern: bellen(mein_hund)
```

**✅ Checkpoint:**
Jede Funktion (Methode) innerhalb einer Klasse muss `self` als ersten Parameter haben.

---

### 📍 Schritt 3: Aktionen ausführen (Methoden)

**🎯 Ziel:** Funktionen in Klassen einbauen.

**💡 Warum:** Ein Objekt ohne Aktionen ist nur eine Daten-Sammlung. Erst Methoden machen es lebendig.

**💻 Code:**
```python
class Bankkonto:
    def __init__(self, besitzer, kontostand=0):
        self.besitzer = besitzer
        self.kontostand = kontostand

    def einzahlen(self, betrag):
        self.kontostand += betrag
        print(f"💰 {betrag} € eingezahlt. Neuer Stand: {self.kontostand} €")

    def abheben(self, betrag):
        if betrag <= self.kontostand:
            self.kontostand -= betrag
            print(f"💸 {betrag} € ausgezahlt.")
        else:
            print("❌ Nicht genug Guthaben!")

# Testen
mein_konto = Bankkonto("Ich", 500)
mein_konto.einzahlen(200)
mein_konto.abheben(1000) # Fehlermeldung
```

**✅ Checkpoint:**
Methoden greifen über `self.variable` auf die Daten des Objekts zu.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Die Auto-Klasse**
Erstelle eine Klasse `Auto` mit `marke` und `farbe`. Füge eine Methode `hupen()` hinzu, die den Text ausgibt: "Die [marke] hupt: Beep Beep!".

**Level 2: Das Game-Inventar**
Erstelle eine Klasse `Held` mit `name` und `energie` (100). Füge Methoden `trinke_trank()` (+20 Energie) und `kaempfe()` (-10 Energie) hinzu. Die Energie darf nie über 100 steigen!

**Level 3: Das digitale Buch**
Erstelle eine Klasse `Buch` mit `titel` und `seiten`. Füge ein Attribut `aktuelle_seite` hinzu. Baue eine Methode `umblaettern()`, die die Seite um 1 erhöht, bis die letzte Seite erreicht ist.

---

### 📚 Was du gelernt hast:

- ✅ **class:** Der Bauplan für neue Dinge.
- ✅ **__init__:** Wo alles beginnt (Konstruktor).
- ✅ **self:** Der Fingerzeig auf das eigene Objekt.
- ✅ **Atrribute:** Die Daten, die ein Objekt speichert.
- ✅ **Methoden:** Die Aktionen, die ein Objekt ausführen kann.

---

## Tag 16: Das Level-Up (Vererbung & RPG System)

### 📝 Aufgabe
Verschwende keine Zeit mit doppeltem Code. Lerne, wie Klassen von anderen Klassen "erben" und sich spezialisieren.

---

### 📍 Schritt 1: Das mentale Modell (Die Evolution)

**🎯 Ziel:** Verstehen, wie man Code-Wiederholung vermeidet.

**💡 Warum:** 
Wenn du ein Spiel baust, haben ein Krieger und ein Magier viel gemeinsam: Beide haben einen Namen, Lebenspunkte und können sich bewegen. 
Statt alles doppelt zu schreiben, erstellen wir eine **Basis-Klasse** (Eltern) und spezialisieren sie in **Unterklassen** (Kinder).

**💻 Code:**
```python
# DIE ELTERN-KLASSE
class Charakter:
    def __init__(self, name, leben):
        self.name = name
        self.leben = leben

    def bewegen(self):
        print(f"🏃 {self.name} läuft einen Schritt vorwärts.")

# DIE KIND-KLASSE (erbt von Charakter)
class Krieger(Charakter):
    def schlag(self):
        print(f"⚔️ {self.name} schwingt das Schwert!")

# DIE ANDERE KIND-KLASSE
class Magier(Charakter):
    def zauber(self):
        print(f"✨ {self.name} wirft einen Feuerball!")

# Testen
held1 = Krieger("Arthur", 100)
held1.bewegen() # Kommt von Charakter
held1.schlag()  # Eigene Methode
```

**✅ Checkpoint:**
`class Kind(Eltern):` bedeutet, dass das Kind alles bekommt, was die Eltern haben.

---

### 📍 Schritt 2: Die Spezial-Kraft (`super()`)

**🎯 Ziel:** Die Eltern-Methoden erweitern statt sie komplett zu ersetzen.

**💡 Warum:** 
Ein Magier braucht vielleicht zusätzlich zum Namen auch noch "Mana" (Zauberkraft). Wir wollen den `__init__` der Eltern nicht neu schreiben, sondern nur etwas hinzufügen. Dafür gibt es `super()`.

**💻 Code:**
```python
class Magier(Charakter):
    def __init__(self, name, leben, mana):
        # Rufe den Konstruktor der Eltern auf
        super().__init__(name, leben)
        self.mana = mana
        print(f"🧙 Magier {name} mit {mana} Mana erschaffen.")

    def zauber(self):
        if self.mana >= 10:
            self.mana -= 10
            print(f"🔥 Feuerball! (Mana übrig: {self.mana})")
        else:
            print("❌ Zu wenig Mana!")

mario = Magier("Merlin", 80, 50)
mario.zauber()
```

**✅ Checkpoint:**
`super()` greift auf die Eltern-Klasse zu. So nutzen wir bewährten Code einfach weiter.

---

### 📍 Schritt 3: Das Team-Register (Klassen-Variablen)

**🎯 Ziel:** Daten speichern, die für ALLE Objekte der Klasse gelten.

**💡 Warum:** 
Manchmal willst du wissen, wie viele Helden insgesamt schon erstellt wurden. Eine normale Variable (`self.count`) würde bei jedem Helden neu bei 0 anfangen. Eine **Klassen-Variable** gehört der Klasse selbst.

**💻 Code:**
```python
class Held:
    helden_anzahl = 0 # Diese Zahl gehört der KLASSE

    def __init__(self, name):
        self.name = name
        # Wir erhöhen die Zahl bei JEDEM neuen Objekt
        Held.helden_anzahl += 1
        print(f"🛡️ Ein neuer Held erscheint: {name}")

h1 = Held("A")
h2 = Held("B")
h3 = Held("C")

print(f"Gesamtanzahl Helden: {Held.helden_anzahl}")
```

**✅ Checkpoint:**
Klassen-Variablen werden ohne `self` am Anfang der Klasse definiert. Sie sind wie ein gemeinsames Gedächtnis aller Objekte.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Der Zoo**
Erstelle eine Klasse `Tier` mit `name` und `laut_geben()`. Erstelle die Unterklassen `Hund` und `Katze`. In `Hund` soll `laut_geben()` "Wuff!" und in `Katze` "Miau!" ausgeben.

**Level 2: Die Fahrzeug-Flotte**
Erstelle `Fahrzeug` mit `marke`. Erstelle `Auto` (erbt von Fahrzeug) mit `tueren` und `LKW` (erbt von Fahrzeug) mit `ladeflaeche_kg`. Nutze `super()`, um die Marke im `__init__` zu setzen.

**Level 3: Game Master**
Erstelle eine Klasse `Spieler` mit einer Klassenvariable `highscore`. Jedes Mal, wenn ein Spieler eine Methode `neuer_rekord(punkte)` aufruft, soll geprüft werden: Wenn `punkte > highscore`, dann ist der neue Highscore gesetzt.

---

### 📚 Was du gelernt hast:

- ✅ **Vererbung:** Code-Recycling auf Profi-Niveau.
- ✅ **super():** Den Eltern-Code clever erweitern.
- ✅ **Overriding:** Methoden der Eltern im Kind neu definieren.
- ✅ **Klassen-Variablen:** Ein gemeinsames Gedächtnis für alle Instanzen.
- ✅ **System-Design:** Komplexe Hierarchien einfach strukturieren.

---

## Tag 17: Die Library der Natur (Abstrakte Klassen)

### 📝 Aufgabe
Lerne, wie du feste Regeln für deine Klassen festlegst und wie ein Objekt mehrere "Spezial-Fähigkeiten" (Mixins) gleichzeitig haben kann.

---

### 📍 Schritt 1: Das mentale Modell (Die abstrakte Idee)

**🎯 Ziel:** Verstehen, was eine "Abstract Base Class" (ABC) ist.

**💡 Warum:** 
Zähle alle Tiere auf, die du kennst: Hund, Katze, Pinguin. Aber niemand hat jemals ein "Tier" gesehen. "Tier" ist nur ein Konzept. 
In Python nutzen wir **ABCs**, um dieses Konzept zu bauen. Man kann kein "Tier" direkt erstellen, aber man kann festlegen, dass jedes Tier eine Methode `laut_geben()` haben MUSS.

**💻 Code:**
```python
from abc import ABC, abstractmethod

class Tier(ABC):
    @abstractmethod
    def laut_geben(self):
        # Wir schreiben hier keinen Code!
        # Jedes Kind MUSS diese Methode selbst bauen.
        pass

# FEHLER: einTier = Tier() # Python sagt: Stop! Tier ist abstrakt.

class Hund(Tier):
    def laut_geben(self):
        print("Wuff!")

bello = Hund()
bello.laut_geben()
```

**✅ Checkpoint:**
`@abstractmethod` ist wie ein Vertrag: "Wenn du ein Tier sein willst, MUSST du bellen, miauen oder piepsen können."

---

### 📍 Schritt 2: Spezial-Fähigkeiten (Mixins)

**🎯 Ziel:** Einer Klasse mehrere Talente beibringen.

**💡 Warum:** 
Eine Ente ist ein Tier, aber sie kann auch schwimmen UND fliegen. 
Statt alles in eine riesige Klasse zu quetschen, bauen wir kleine "Fähigkeits-Module" (Mixins).

**💻 Code:**
```python
class Schwimmer:
    def schwimmen(self):
        print(f"{self.name} schwimmt durch das Wasser.")

class Flieger:
    def fliegen(self):
        print(f"{self.name} hebt ab in die Lüfte!")

class Ente(Tier, Schwimmer, Flieger):
    def __init__(self, name):
        self.name = name
    
    def laut_geben(self):
        print("Quak!")

donald = Ente("Donald")
donald.schwimmen()
donald.fliegen()
```

**✅ Checkpoint:**
Klassen können in Python von beliebig vielen anderen Klassen erben. Das nennt man Mehrfachvererbung.

---

### 📍 Schritt 3: Wer bist du eigentlich? (`isinstance`)

**🎯 Ziel:** Den Stammbaum eines Objekts prüfen.

**💡 Warum:** 
Manchmal bekommst du ein Objekt und musst wissen: "Kann das eigentlich fliegen?". 

**💻 Code:**
```python
def check_talent(obj):
    print(f"Check für {type(obj).__name__}:")
    if isinstance(obj, Flieger):
        print("✅ Kann fliegen!")
    if isinstance(obj, Schwimmer):
        print("✅ Kann schwimmen!")
    if isinstance(obj, Tier):
        print("✅ Ist ein Tier!")

check_talent(donald)
```

**✅ Checkpoint:**
`isinstance(obj, Klasse)` gibt `True` zurück, wenn das Objekt von dieser Klasse (oder einer Unterklasse) abstammt.

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Die Musik-Instrumente**
Erstelle eine abstrakte Klasse `Instrument` mit der abstrakten Methode `spielen()`. Erstelle die Unterklassen `Gitarre` und `Klavier`.

**Level 2: Das Smart-Home**
Erstelle Mixins: `StromSparer` (Methode: `eco_modus()`) und `WiFiGeraet` (Methode: `verbinden()`). Erstelle eine Klasse `Saugroboter`, die beides nutzt, und eine Klasse `Kuehlschrank`, die nur `StromSparer` nutzt.

**Level 3: Der Cyber-Zoo**
Baue eine Liste mit verschiedenen Tieren (Enten, Pinguine, Hunde). Laufe durch die Liste und lass nur die Tiere fliegen, die das `Flieger`-Modul haben.

---

### 📚 Was du gelernt hast:

- ✅ **ABC:** Abstrakte Klassen als Bauplan-Vorgabe.
- ✅ **@abstractmethod:** Zwingt Unterklassen zum Handeln.
- ✅ **Mixins:** Modulare Fähigkeiten für Klassen.
- ✅ **isinstance:** Den Überblick im Stammbaum behalten.
- ✅ **Software-Architektur:** Saubere Trennung von Konzept und Umsetzung.

---

## Tag 18: Der digitale Hausmeister (OS-Modul)

### 📝 Aufgabe
Schreibe ein Skript, das deinen Computer aufräumt. Lerne, wie du mit Python Ordner erstellst, Dateien suchst und sie verschiebst.

---

### 📍 Schritt 1: Das mentale Modell (Der Hausmeister)

**🎯 Ziel:** Verstehen, wie Python auf das Dateisystem zugreift.

**💡 Warum:** 
Bisher war dein Code in einer "Box". Mit dem `os`-Modul bekommt dein Programm einen Schlüsselbund. 
Es kann in andere Ordner schauen, neue Räume (Ordner) bauen oder Kisten (Dateien) umbenennen.

**💻 Code:**
```python
import os

# Wo bin ich gerade?
hier = os.getcwd()
print(f"📍 Ich befinde mich in: {hier}")

# Was liegt hier alles rum?
inhalt = os.listdir()
print(f"📂 Hier liegen {len(inhalt)} Dateien/Ordner.")

# Nur die ersten 5 anzeigen
for item in inhalt[:5]:
    print(f"  - {item}")
```

**✅ Checkpoint:**
`getcwd` = "Get Current Working Directory" (Aktueller Standort).
`listdir` = "List Directory" (Inhalt anzeigen).

---

### 📍 Schritt 2: Der sichere Pfadbau

**🎯 Ziel:** Pfade bauen, die auf Windows, Mac und Linux funktionieren.

**💡 Warum:** 
Windows nutzt `\` für Ordner, Mac und Linux nutzen `/`. 
Wenn du ein Programm schreibst, willst du nicht, dass es nur bei dir funktioniert. Wir nutzen `os.path.join`.

**💻 Code:**
```python
ordner = "Downloads"
datei = "foto.jpg"

# SCHLECHT (funktioniert nur auf Windows):
# pfad = ordner + "\\" + datei

# PROFI-WEG (funktioniert überall):
pfad = os.path.join(ordner, datei)
print(f"🔗 Sicherer Pfad: {pfad}")

# Check: Existiert das eigentlich?
if os.path.exists(pfad):
    print("✅ Datei gefunden!")
else:
    print("❌ Pfad existiert nicht.")
```

**✅ Checkpoint:**
Nutze **immer** `os.path.join`, um Pfade zu kombinieren. Es erkennt automatisch dein Betriebssystem.

---

### 📍 Schritt 3: Aufräum-Aktionen

**🎯 Ziel:** Ordner erstellen und Dateien umbenennen.

**💡 Warum:** Automatisierung ist die Superkraft von Python. Warum 100 Dateien von Hand sortieren, wenn ein Skript das in einer Sekunde macht?

**💻 Code:**
```python
base = "Aufräum_Test"

# 1. Ordner bauen
if not os.path.exists(base):
    os.mkdir(base)
    print(f"📁 Ordner '{base}' erstellt.")

# 2. Eine Testdatei hineinlegen (Tag 12 Wissen!)
datei_pfad = os.path.join(base, "müll.txt")
with open(datei_pfad, "w") as f:
    f.write("Ich bin eine unwichtige Datei.")

# 3. Umbenennen
neuer_pfad = os.path.join(base, "wichtig.txt")
os.rename(datei_pfad, neuer_pfad)
print("📝 Datei umbenannt!")
```

**✅ Checkpoint:**
`os.mkdir` = Make Directory.
`os.rename(alt, neu)` verschiebt oder benennt Dateien um.

---

### 📍 Schritt 4: Projekt - Der Dateisortierer

**🎯 Ziel:** Ein echtes nützliches Tool bauen.

**📝 Anleitung:**
Wir suchen alle `.txt` Dateien und verschieben sie in einen "Dokumente" Ordner.

**💻 Code:**
```python
import os

def sortiere_ordner(ziel_ordner):
    # Ziel-Ordner erstellen
    doku_pfad = os.path.join(ziel_ordner, "Dokumente")
    if not os.path.exists(doku_pfad):
        os.mkdir(doku_pfad)

    # Alle Dateien durchgehen
    for dateiname in os.listdir(ziel_ordner):
        # Nur Dateien, keine Ordner
        voller_pfad = os.path.join(ziel_ordner, dateiname)
        if os.path.isfile(voller_pfad) and dateiname.endswith(".txt"):
            ziel = os.path.join(doku_pfad, dateiname)
            os.rename(voller_pfad, ziel)
            print(f"🚚 Verschiebe {dateiname} -> Dokumente/")

# Testlauf im aktuellen Ordner (VORSICHT!)
# sortiere_ordner(".") 
```

**✅ Checkpoint:**
Kombiniere `os.listdir` mit `endswith` und `os.rename`, um Dateien massenhaft zu sortieren.

---

### 📍 Schritt 5: Challenge Time!

**Level 1: Verzeichnis-Scanner**
Schreibe ein Programm, das alle Dateien im aktuellen Ordner auflistet und dazu sagt, wie groß sie sind (`os.path.getsize()`).

**Level 2: Der Foto-Organizer**
Erstelle ein Skript, das alle `.jpg` und `.png` Dateien sucht und in einen neuen Ordner "Bilder" verschiebt.

**Level 3: Das Backup-Skript**
Kopieren ist mit `os` schwierig, aber Umbenennen einfach. Erstelle eine Sicherheitskopie einer Datei, indem du sie liest und unter `[original]_backup.txt` neu speicherst.

---

### 📚 Was du gelernt hast:

- ✅ **os.getcwd:** Den Standort bestimmen.
- ✅ **os.path.join:** Plattform-unabhängiges Programmieren.
- ✅ **os.mkdir / os.rename:** Das Dateisystem gestalten.
- ✅ **Automatisierung:** Zeit sparen durch kluge Skripte.

---

## Tag 19: Pfade mit Superkräften (Pathlib)

### 📝 Aufgabe
Vergiss komplizierte String-Basteleien. Nutze `pathlib`, um Pfade wie echte Objekte zu behandeln – sauberer, schneller und moderner.

---

### 📍 Schritt 1: Das mentale Modell (Das Objekt-GPS)

**🎯 Ziel:** Verstehen, warum `Path` besser ist als ein einfacher String.

**💡 Warum:** 
Bisher war ein Dateipfad für Python nur ein Text: `"C:/Ordner/Datei.txt"`. Wenn du die Endung wissen wolltest, musstest du den Text mühsam zerteilen. 
Mit **Pathlib** wird der Pfad zu einem intelligenten Objekt mit "Gehirn". Er weiß selbst, wie er heißt und wo er hingehört.

**💻 Code:**
```python
from pathlib import Path

# Wir erstellen ein Path-Objekt
pfad = Path("mein_projekt/notizen.txt")

print(f"📄 Dateiname: {pfad.name}")
print(f"🏠 Ordner: {pfad.parent}")
print(f"🏷️ Endung: {pfad.suffix}")
print(f"🆔 Name ohne Endung: {pfad.stem}")

# Check ohne os.path!
if pfad.exists():
    print("✅ Gefunden!")
else:
    print("❌ Nicht da.")
```

**✅ Checkpoint:**
`Path` macht aus einem Text ein Werkzeug. Du musst keine Schrägstriche mehr zählen.

---

### 📍 Schritt 2: Der moderne Datei-Zugriff

**🎯 Ziel:** Dateien lesen und schreiben ohne `with open`.

**💡 Warum:** Für einfache Textdateien ist der `with open`-Block oft viel zu viel Code. `pathlib` bietet eine Abkürzung.

**💻 Code:**
```python
p = Path("hallo.txt")

# Schnell SCHREIBEN (Überschreibt alles)
p.write_text("Python mit Pathlib ist super!", encoding="utf-8")

# Schnell LESEN
inhalt = p.read_text(encoding="utf-8")
print(f"Inhalt der Datei: {inhalt}")
```

**✅ Checkpoint:**
`write_text` und `read_text` erledigen das Öffnen und Schließen der Datei automatisch im Hintergrund. Perfekt für kleine Dateien!

---

### 📍 Schritt 3: Den Computer scannen

**🎯 Ziel:** Alle Dateien eines Typs finden.

**💡 Warum:** Stell dir vor, du suchst alle Python-Dateien in einem riesigen Ordner. Mit `pathlib` geht das in einer Zeile.

**💻 Code:**
```python
aktueller_ordner = Path(".")

print("🐍 Deine Python-Scripts:")
# rglob = rekursive Suche (auch in Unterordnern)
for datei in aktueller_ordner.rglob("*.py"):
    print(f" gefunden: {datei.name}")
```

**✅ Checkpoint:**
`rglob("*.py")` ist wie eine Suchfunktion: "Suche überall nach Dateien, die auf .py enden."

---

### 📍 Schritt 4: Projekt - Extension-Scanner

**🎯 Ziel:** Statistiken über deine Dateien erstellen.

**📝 Anleitung:**
Wir zählen, wie viele Dateien von jedem Typ (`.py`, `.txt`, `.jpg` etc.) wir im Ordner haben.

**💻 Code:**
```python
from pathlib import Path
from collections import Counter

def scan_extensions(ordner_name):
    ordner = Path(ordner_name)
    # Alle Endungen einsammeln
    endungen = [f.suffix for f in ordner.iterdir() if f.is_file()]
    
    # Zählen
    statistik = Counter(endungen)
    
    print(f"📊 Datei-Statistik für '{ordner_name}':")
    for ext, anzahl in statistik.items():
        label = ext if ext else "(Keine Endung)"
        print(f"  {label:10} : {anzahl} Dateien")

scan_extensions(".")
```

**✅ Checkpoint:**
Nutze `iterdir()`, um durch einen Ordner zu gehen. `f.is_file()` prüft, ob es eine echte Datei ist (kein Ordner).

---

### 📍 Schritt 5: Challenge Time!

**Level 1: Der Dateinamens-Umbauer**
Lies alle Dateien im aktuellen Ordner. Wenn eine Datei mit `.txt` endet, erstelle einen neuen Namen, indem du `BACKUP_` davor hängst. (Nur den Namen ausgeben, noch nicht umbenennen).

**Level 2: Die Größen-Warnung**
Scanne einen Ordner. Gib alle Dateinamen aus, die größer als 1 MB sind. Nutze `f.stat().st_size`.

**Level 3: Mini-Organizer (Pathlib Edition)**
Schreibe den Organizer von gestern (Tag 18) mit `pathlib` um. Nutze `pfad.rename()` und `Path.mkdir(exist_ok=True)`. Merkst du, wie viel sauberer der Code wird?

---

### 📚 Was du gelernt hast:

- ✅ **Path-Objekte:** Pfade sind keine einfachen Strings mehr.
- ✅ **read_text / write_text:** Blitzschneller Dateizugriff.
- ✅ **rglob:** Intelligente Dateisuche mit Wildcards (`*`).
- ✅ **Metadaten:** Einfacher Zugriff auf Endungen, Namen und Ordner.
- ✅ **Sauberer Code:** Warum `pathlib` das alte `os.path` ablöst.

---

## Tag 20: Der Schwerlast-Transporter (Shutil)

### 📝 Aufgabe
Lerne, wie du ganze Ordner kopierst, löschst und in ZIP-Archive verpackst. Baue dein eigenes automatisches Backup-System.

---

### 📍 Schritt 1: Das mentale Modell (Der Packer)

**🎯 Ziel:** Verstehen, warum wir `shutil` zusätzlich zu `os` brauchen.

**💡 Warum:** 
`os` und `pathlib` sind gut für einzelne Dateien. Aber was, wenn du einen Ordner mit 1000 Unterordnern kopieren willst? Das wäre mit `os` eine endlose Schleife.
**Shutil** (Shell Utility) ist der Spezialist für die "groben" Aufgaben. Er ist wie ein Umzugsunternehmen mit großem LKW.

**💻 Code:**
```python
import shutil
from pathlib import Path

# 1. Eine Datei kopieren (Behält Metadaten wie Uhrzeit)
# shutil.copy2("quelle.txt", "ziel.txt")

# 2. Einen GANZEN ORDNER kopieren (Inklusive Inhalt!)
try:
    shutil.copytree("mein_projekt", "mein_projekt_backup")
    print("✅ Ganzer Ordner wurde kopiert!")
except FileExistsError:
    print("❌ Backup existiert bereits.")
```

**✅ Checkpoint:**
`copytree` kopiert alles: Dateien, Unterordner, Unter-Unterordner. Ein Befehl für alles.

---

### 📍 Schritt 2: Die ZIP-Maschine

**🎯 Ziel:** Platz sparen durch Archivierung.

**💡 Warum:** Backups verbrauchen viel Platz. Es ist klüger, alles in eine einzige, komprimierte ZIP-Datei zu packen.

**💻 Code:**
```python
import shutil

# Syntax: make_archive(Name_der_ZIP, Format, Welcher_Ordner)
shutil.make_archive("Projekt_Backup_2024", "zip", "mein_projekt")

print("📦 Projekt wurde erfolgreich gezippt!")
```

**✅ Checkpoint:**
`make_archive` verwandelt einen ganzen Ordner in eine einzige Datei. Das ist perfekt zum Verschicken oder Aufbewahren.

---

### 📍 Schritt 3: Achtung, Abrissbirne! (`rmtree`)

**🎯 Ziel:** Ordner unwiderruflich löschen.

**💡 Warum:** `os.remove()` kann nur leere Ordner löschen. Wenn du einen Ordner mit Inhalt löschen willst, brauchst du `shutil.rmtree`. **VORSICHT:** Die Dateien landen NICHT im Papierkorb. Sie sind weg.

**💻 Code:**
```python
import shutil
import os

folder = "test_muell"

if os.path.exists(folder):
    # LÖSCHT ALLES IM ORDNER - Ohne Rückfrage!
    # shutil.rmtree(folder) 
    print(f"💣 {folder} wurde rücksichtslos gelöscht.")
```

**✅ Checkpoint:**
Nutze `rmtree` ("Remove Tree") mit Bedacht. Ein Tippfehler im Pfad kann katastrophal sein.

---

### 📍 Schritt 4: Projekt - Das Auto-Backup Tool

**🎯 Ziel:** Ein Skript, das täglich deine Arbeit sichert.

**💻 Code:**
```python
import shutil
from datetime import datetime
from pathlib import Path

def erstelle_backup(quell_ordner, backup_ziel):
    # 1. Zeitstempel erstellen
    zeit = datetime.now().strftime("%Y-%m-%d_%H-%M")
    name = f"Backup_{zeit}"
    
    # 2. Pfad bauen
    ziel_pfad = Path(backup_ziel) / name
    
    # 3. Zippen
    print(f"🚀 Starte Backup von {quell_ordner}...")
    shutil.make_archive(str(ziel_pfad), "zip", quell_ordner)
    print(f"✨ Fertig! Archiv gespeichert: {name}.zip")

# Beispiel Aufruf:
# erstelle_backup("meine_skripte", "backups")
```

**✅ Checkpoint:**
Durch die Kombination mit `datetime` bekommt jedes Backup einen eigenen Namen. So überschreibst du nichts Altes.

---

### 📍 Schritt 5: Challenge Time!

**Level 1: Der Sicherheits-Kopierer**
Schreibe ein Skript, das prüft, ob eine Datei existiert. Falls ja, erstelle eine Kopie mit der Endung `.old`.

**Level 2: Der Cleaner**
Erstelle einen Ordner "Temp". Kopiere 5 Dateien hinein. Lösche dann per Skript den gesamten Ordner inklusive Inhalt mit `shutil.rmtree`.

**Level 3: Das Cloud-Simulations-Tool**
Schreibe ein Programm, das alle 10 Sekunden prüft, ob sich im Ordner "Projekt" eine neue Datei befindet. Falls ja, kopiere sie sofort in einen Ordner "Cloud_Sync".

---

### 📚 Was du gelernt hast:

- ✅ **shutil.copy2:** Kopieren wie ein Profi (mit Zeitstempeln).
- ✅ **shutil.copytree:** Ganze Verzeichnisse klonen.
- ✅ **shutil.make_archive:** Die Welt in ZIPs packen.
- ✅ **shutil.rmtree:** Effektives (aber gefährliches) Löschen.
- ✅ **Automatisches Backup:** Datenverlust verhindern.

---

## Tag 21: Das magische Lasso (Glob & Batch-Rename)

### 📝 Aufgabe
Sammle hunderte Dateien gleichzeitig ein und benenne sie in Sekunden um. Nutze "Wildcards", um genau die Dateien zu finden, die du suchst.

---

### 📍 Schritt 1: Das mentale Modell (Das magische Lasso)

**🎯 Ziel:** Muster nutzen, um Dateigruppen zu finden.

**💡 Warum:** 
Du willst nicht wissen, wie EINE Datei heißt, sondern du willst ALLE Bilder oder ALLE Textdateien. 
Der **Stern (*)** ist dein wichtigstes Werkzeug. 
`*.jpg` bedeutet: "Egal wie der Name ist (Stern), Hauptsache die Endung ist .jpg".

**💻 Code:**
```python
from pathlib import Path

# Wir erzeugen ein Path-Objekt für den aktuellen Ordner
ordner = Path(".")

# Das magische Lasso werfen: Alle Python-Dateien
python_dateien = list(ordner.glob("*.py"))

print(f"🐍 Ich habe {len(python_dateien)} Python-Scripts gefunden.")

# Nur die anzeigen, die mit 'T' anfangen
for datei in ordner.glob("T*.*"):
    print(f" Found: {datei.name}")
```

**✅ Checkpoint:**
`*` ersetzt beliebig viele Zeichen. `T*` findet "Test", "Tagebuch", "Tabelle".

---

### 📍 Schritt 2: Präzisions-Suche (`?` und `[]`)

**🎯 Ziel:** Noch genauer filtern.

**💡 Warum:** 
Manchmal ist der Stern zu ungenau. 
Der **Punkt (?)** ersetzt genau EINE Stelle. 
**Klammern ([abc])** suchen nach einem der Buchstaben im Inneren.

**💻 Code:**
```python
# Sucht nach: Bild01, Bild02, BildAA... (Muss genau 2 Zeichen am Ende haben)
for datei in ordner.glob("Bild??.*"):
    print(f"Gefunden: {datei.name}")

# Sucht nach: Log_A.txt, Log_B.txt, Log_C.txt (Nichts anderes!)
for datei in ordner.glob("Log_[ABC].txt"):
    print(f"Wichtiger Log: {datei.name}")
```

**✅ Checkpoint:**
`?` = genau ein Zeichen. `[ABC]` = Einer dieser drei Buchstaben.

---

### 📍 Schritt 3: Das große Umbenennen (Batch-Rename)

**🎯 Ziel:** Viele Dateien gleichzeitig bearbeiten.

**💡 Warum:** Du hast 100 Fotos vom Handy (`IMG_202401.jpg`) und willst sie `Urlaub_01.jpg` etc. nennen. Python macht das für dich.

**💻 Code:**
```python
from pathlib import Path

def batch_rename(ordner_name, prefix):
    ordner = Path(ordner_name)
    # Alle .jpg Dateien finden
    dateien = list(ordner.glob("*.jpg"))
    
    # Sortieren, damit die Reihenfolge stimmt
    dateien.sort()
    
    for i, datei in enumerate(dateien, 1):
        neuer_name = f"{prefix}_{i:02d}{datei.suffix}" # :02d macht 01 statt 1
        neuer_pfad = datei.parent / neuer_name
        
        # Umbenennen
        # datei.rename(neuer_pfad) 
        print(f"✏️  Wäre umbenannt: {datei.name} -> {neuer_name}")

# Beispiel:
# batch_rename("Fotos", "Urlaub")
```

**✅ Checkpoint:**
Nutze `enumerate(liste, 1)`, um bequem hochzuzählen. Das `:02d` sorgt für führende Nullen bei Nummern (01, 02...).

---

### 📍 Schritt 4: Challenge Time!

**Level 1: Der Endungs-Wechsler**
Finde alle `.txt` Dateien in einem Ordner und gib aus, wie sie hießen, wenn sie plötzlich `.pdf` hießen. (Nutze `.with_suffix(".pdf")`).

**Level 2: Leerzeichen-Killer**
Oft machen Leerzeichen in Dateinamen Probleme. Suche alle Dateien, die ein Leerzeichen im Namen haben, und ersetze es durch einen Unterstrich (`_`).

**Level 3: Die Zeit-Kapsel**
Suche alle Dateien im aktuellen Ordner. Benenne sie so um, dass das heutige Datum VOR dem Dateinamen steht (z.B. `2024-05-20_test.py`).

---

### 📚 Was du gelernt hast:

- ✅ **Glob-Patterns:** Suchen mit `*`, `?` und `[]`.
- ✅ **Wildcards:** Die Macht der Mustererkennung.
- ✅ **Batch-Processing:** Hunderte Aufgaben in einer Schleife erledigen.
- ✅ **F-Strings:** Fortgeschrittene Formatierung (führende Nullen).
- ✅ **Wochen-Finale:** Du kannst jetzt das Dateisystem deines Computers komplett mit Python steuern!

---

