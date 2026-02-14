import re
import json

def extract_day_info(content, start_line, tag_number):
    """
    Extrahiert Informationen für einen Tag aus dem Markdown-Content.
    """
    lines = content.split('\n')
    
    # Finde die Zeile mit dem Tag-Titel
    title_line = None
    for i, line in enumerate(lines):
        if f"## Tag {tag_number}:" in line:
            title_line = i
            break
    
    if title_line is None:
        return None
    
    # Extrahiere Titel (entferne "## Tag X: ")
    full_title = lines[title_line].replace(f"## Tag {tag_number}: ", "").strip()
    
    # Finde die Aufgabenbeschreibung (nach "### 📝 Aufgabe")
    task_desc = ""
    for i in range(title_line, min(title_line + 20, len(lines))):
        if "### 📝 Aufgabe" in lines[i]:
            # Nächste Zeile ist die Beschreibung
            if i + 1 < len(lines):
                task_desc = lines[i + 1].strip()
            break
    
    # Sammle die Schritte
    steps = []
    current_step = None
    in_step = False
    
    for i in range(title_line, len(lines)):
        line = lines[i]
        
        # Nächster Tag erreicht - stoppe
        if i > title_line and line.startswith("## Tag "):
            break
        
        # Neuer Schritt gefunden
        if "### 📍 Schritt" in line:
            if current_step:
                steps.append(current_step)
            
            # Extrahiere Schritt-Nummer und Titel
            match = re.search(r'### 📍 Schritt (\d+): (.+)', line)
            if match:
                step_num = int(match.group(1))
                step_title = match.group(2).strip()
                current_step = {
                    "number": step_num,
                    "title": step_title,
                    "goal": "",
                    "why": "",
                    "code": "",
                    "checkpoint": ""
                }
                in_step = True
        
        # Sammle Schritt-Details
        elif in_step and current_step:
            if "**🎯 Ziel:**" in line:
                current_step["goal"] = line.replace("**🎯 Ziel:**", "").strip()
            elif "**💡 Warum:**" in line:
                current_step["why"] = line.replace("**💡 Warum:**", "").strip()
            elif "```python" in line:
                # Code-Block beginnt
                code_lines = []
                j = i + 1
                while j < len(lines) and "```" not in lines[j]:
                    code_lines.append(lines[j])
                    j += 1
                current_step["code"] = '\n'.join(code_lines)
            elif "**✅ Checkpoint:**" in line:
                current_step["checkpoint"] = line.replace("**✅ Checkpoint:**", "").strip()
    
    # Füge letzten Schritt hinzu
    if current_step:
        steps.append(current_step)
    
    return {
        "title": full_title,
        "description": task_desc,
        "steps": steps
    }


def generate_data_js():
    """
    Generiert die vollständige data.js Datei aus allen Markdown-Dateien.
    """
    
    # Lade alle Wochen-Dateien
    wochen_dateien = [
        ('WochenPlan/woche1_grundlagen.md', 'Woche 1: Grundlagen', 'Die absoluten Grundlagen von Python', 'orange', range(1, 8)),
        ('WochenPlan/woche2_strukturen.md', 'Woche 2: Datenstrukturen', 'Listen, Dictionaries & Dateien', 'purple', range(8, 15)),
        ('WochenPlan/woche3_oop.md', 'Woche 3: OOP & Module', 'Objektorientierte Programmierung', 'yellow', range(15, 22)),
        ('WochenPlan/woche4_anwendungen.md', 'Woche 4: Real-World Apps', 'Praktische Anwendungen', 'green', range(22, 31))
    ]
    
    weeks = []
    
    for week_num, (filepath, title, description, color, day_range) in enumerate(wochen_dateien, 1):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            days = []
            for day_num in day_range:
                day_info = extract_day_info(content, 0, day_num)
                if day_info:
                    days.append({
                        "id": day_num - (week_num - 1) * 7,
                        "weekId": week_num,
                        "title": day_info["title"],
                        "duration": "10-15 Min",
                        "task": {
                            "title": day_info["title"],
                            "description": day_info["description"],
                            "goals": []  # Kann später ergänzt werden
                        },
                        "steps": day_info["steps"]
                    })
            
            weeks.append({
                "id": week_num,
                "title": title,
                "subtitle": title.split(": ")[1] if ": " in title else title,
                "description": description,
                "color": color,
                "days": days
            })
        
        except Exception as e:
            print(f"Error processing {filepath}: {e}")
    
    return weeks


if __name__ == "__main__":
    print("Extrahiere Kurs-Daten aus Markdown-Dateien...")
    weeks = generate_data_js()
    
    # Ausgabe als JSON zur Überprüfung
    with open('extracted_data.json', 'w', encoding='utf-8') as f:
        json.dump(weeks, f, ensure_ascii=False, indent=2)
    
    print(f"Erfolgreich {len(weeks)} Wochen extrahiert.")
    for week in weeks:
        print(f"  - {week['title']}: {len(week['days'])} Tage")
