#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Konvertiert das extrahierte JSON in JavaScript data.js Format
"""

import json
import os

# Wochen-Metadaten
week_metadata = [
    {
        'id': 1,
        'title': 'Woche 1: Grundlagen',
        'subtitle': 'Die absoluten Grundlagen von Python',
        'description': 'Das Fundament für alles Weitere! Lerne Variablen, Schleifen, Bedingungen und Funktionen.',
        'color': 'orange'
    },
    {
        'id': 2,
        'title': 'Woche 2: Datenstrukturen',
        'subtitle': 'Listen, Dictionaries & Dateien',
        'description': 'Fortgeschrittene Datenstrukturen und wie man mit Dateien arbeitet.',
        'color': 'purple'
    },
    {
        'id': 3,
        'title': 'Woche 3: OOP & Module',
        'subtitle': 'Objektorientierte Programmierung',
        'description': 'Lerne Classes, Vererbung und wie man eigene Module erstellt.',
        'color': 'yellow'
    },
    {
        'id': 4,
        'title': 'Woche 4: Real-World Apps',
        'subtitle': 'Praktische Anwendungen',
        'description': 'APIs, Web Scraping, Datenbanken und vollständige Projekte.',
        'color': 'green'
    }
]

def json_to_js_string(obj, indent=0):
    """Konvertiert Python-Objekt zu JavaScript-kompatibler String"""
    spaces = '  ' * indent
    
    if isinstance(obj, dict):
        items = []
        for key, value in obj.items():
            js_value = json_to_js_string(value, indent + 1)
            items.append(f'{spaces}  {key}: {js_value}')
        return '{\n' + ',\n'.join(items) + f'\n{spaces}}}'
    
    elif isinstance(obj, list):
        if not obj:
            return '[]'
        items = [json_to_js_string(item, indent + 1) for item in obj]
        return '[\n' + ',\n'.join(f'{spaces}  {item}' for item in items) + f'\n{spaces}]'
    
    elif isinstance(obj, str):
        # Escape Backslashes und Quotes
        escaped = obj.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        return f'"{escaped}"'
    
    elif isinstance(obj, bool):
        return 'true' if obj else 'false'
    
    elif obj is None:
        return 'null'
    
    else:
        return str(obj)

def main():
    # JSON laden
    with open('extracted_full_content.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # JavaScript-Datei generieren
    js_lines = []
    js_lines.append('// ============================================')
    js_lines.append('// COURSE DATA - VOLLSTÄNDIG AUS MARKDOWN EXTRAHIERT')
    js_lines.append('// Alle 30 Tage mit detaillierten Schritten')
    js_lines.append('// ============================================')
    js_lines.append('')
    js_lines.append('const courseData = {')
    js_lines.append('  weeks: [')
    
    # Für jede Woche
    for week_data in data:
        week_num = week_data['weekNum']
        metadata= week_metadata[week_num - 1]
        
        js_lines.append('    {')
        js_lines.append(f'      id: {metadata["id"]},')
        js_lines.append(f'      title: "{metadata["title"]}",')
        js_lines.append(f'      subtitle: "{metadata["subtitle"]}",')
        js_lines.append(f'      description: "{metadata["description"]}",')
        js_lines.append(f'      color: "{metadata["color"]}",')
        js_lines.append('      days: [')
        
            # Für jeden Tag - Struktur für UI anpassen
        for day_idx, day_data in enumerate(week_data['days'], 1):
            # UI erwartet diese Struktur:
            # {
            #   id, weekId, title, duration,
            #   task: { title, description, goals },
            #   steps: [...]
            # }
            
            ui_day = {
                "id": day_idx,
                "weekId": week_num,
                "title": day_data.get("title", "Unbenannt"),
                "duration": "45-60 min",  # Default
                "task": {
                    "title": day_data.get("title", "Unbenannt"),
                    "description": day_data.get("description", ""),
                    "goals": day_data.get("goals", [])
                },
                "steps": day_data.get("steps", [])
            }
            
            # JSON formatieren
            js_day = json.dumps(ui_day, ensure_ascii=False, indent=8)
            # Indent korrigieren (+ 4 spaces)
            js_day_lines = js_day.split('\n')
            js_day = '\n'.join('        ' + line for line in js_day_lines)
            js_lines.append(js_day + ',')
        
        js_lines.append('      ]')
        js_lines.append('    },')
    
    js_lines.append('  ]')
    js_lines.append('};')
    js_lines.append('')
    js_lines.append('// Helper functions')
    js_lines.append('const getData = {')
    js_lines.append('  getWeek(weekId) {')
    js_lines.append('    return courseData.weeks.find(w => w.id === weekId);')
    js_lines.append('  },')
    js_lines.append('  ')
    js_lines.append('  getDay(weekId, dayId) {')
    js_lines.append('    const week = this.getWeek(weekId);')
    js_lines.append('    if (!week) return null;')
    js_lines.append('    return week.days.find(d => d.id === dayId);')
    js_lines.append('  },')
    js_lines.append('  ')
    js_lines.append('  getTotalDays() {')
    js_lines.append('    return courseData.weeks.reduce((total, week) => total + week.days.length, 0);')
    js_lines.append('  },')
    js_lines.append('  ')
    js_lines.append('  getAllDays() {')
    js_lines.append('    const allDays = [];')
    js_lines.append('    courseData.weeks.forEach(week => {')
    js_lines.append('      week.days.forEach(day => {')
    js_lines.append('        allDays.push({ weekId: week.id, dayId: day.id, ...day });')
    js_lines.append('      });')
    js_lines.append('    });')
    js_lines.append('    return allDays;')
    js_lines.append('  }')
    js_lines.append('};')
    
    # Speichern
    output = '\n'.join(js_lines)
    
    with open('js/data.js', 'w', encoding='utf-8') as f:
        f.write(output)
    
    print("✅ data.js erstellt!")
    
    # Stats
    total_days = sum(len(w['days']) for w in data)
    total_steps = sum(len(d['steps']) for w in data for d in w['days'])
    total_goals = sum(len(d['goals']) for w in data for d in w['days'])
    
    print(f"\n📊 Statistik:")
    print(f"  - {total_days} Tage")
    print(f"  - {total_steps} Schritte")
    print(f"  - {total_goals} Lernziele")
    print(f"  - Durchschnitt: {total_steps/total_days:.1f} Schritte/Tag")
    
    # Dateigröße
    size_kb = len(output.encode('utf-8')) / 1024
    print(f"  - Dateigröße: {size_kb:.1f} KB")

if __name__ == "__main__":
    main()
