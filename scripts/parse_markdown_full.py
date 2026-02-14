#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extrahiert VOLLSTÄNDIGE Lektion-Daten aus den Markdown-Dateien.
Keine Vereinfachung - 1:1 Übernahme aller Schritte und Texte.
"""

import re
import json
import os

def clean_markdown_formatting(text):
    """Entfernt Markdown-Formatierung für saubere Ausgabe."""
    # Entferne ** ** für Bold
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    return text.strip()

def extract_complete_day(content, tag_number):
    """
    Extrahiert VOLLSTÄNDIGEN Tag mit allen Schritten und Details.
    """
    lines = content.split('\n')
    
    # Finde Tag-Header
    tag_start = None
    for i, line in enumerate(lines):
        if f"## Tag {tag_number}:" in line:
            tag_start = i
            print(f"DEBUG: Found Tag {tag_number} at line {i}: {line}")
            break
    
    if tag_start is None:
        print(f"DEBUG: Tag {tag_number} NOT found")
        return None
    
    # Finde Ende (nächster Tag oder Dateiende)
    tag_end = len(lines)
    for i in range(tag_start + 1, len(lines)):
        if lines[i].startswith("## Tag ") and lines[i] != lines[tag_start]:
            tag_end = i
            print(f"DEBUG: Tag {tag_number} ends at line {i}")
            break
    
    tag_content = '\n'.join(lines[tag_start:tag_end])
    
    # Extrahiere Titel
    title_match = re.search(r'## Tag \d+: (.+)', lines[tag_start])
    title = title_match.group(1).strip() if title_match else "Unbekannt"
    
    # Extrahiere Aufgabenbeschreibung
    task_desc = ""
    for i in range(tag_start, min(tag_start + 30, tag_end)):
        if "### 📝 Aufgabe" in lines[i]:
            if i + 1 < len(lines):
                task_desc = lines[i + 1].strip()
            break
    
    # Extrahiere Lernziele (Was du gelernt hast Sektion)
    goals = []
    in_goals = False
    for i in range(tag_start, tag_end):
        if "### 📚 Was du gelernt hast:" in lines[i] or "**Was du gelernt hast:**" in lines[i]:
            in_goals = True
            continue
        if in_goals:
            if lines[i].startswith("- ✅"):
                goal = lines[i].replace("- ✅", "").strip()
                goal = clean_markdown_formatting(goal)
                goals.append(goal)
            elif lines[i].startswith("###") or lines[i].startswith("##"):
                break
    
    # Extrahiere ALLE Schritte vollständig
    steps = []
    current_step = None
    in_code_block = False
    code_lines = []
    
    for i in range(tag_start, tag_end):
        line = lines[i]
        
        # Neuer Schritt
        if "### 📍 Schritt" in line:
            # Speichere vorherigen Schritt
            if current_step and code_lines:
                current_step['code'] = '\n'.join(code_lines)
            if current_step:
                steps.append(current_step)
            
            # Parse Schritt-Nummer und Titel
            match = re.search(r'### 📍 Schritt (\d+): (.+)', line)
            if match:
                step_num = int(match.group(1))
                step_title = match.group(2).strip()
                current_step = {
                    'number': step_num,
                    'title': step_title,
                    'goal': '',
                    'why': '',
                    'instruction': '',
                    'code': '',
                    'checkpoint': ''
                }
                code_lines = []
                in_code_block = False
        
        elif current_step:
            # Ziel
            if "**🎯 Ziel:**" in line:
                current_step['goal'] = line.replace("**🎯 Ziel:**", "").strip()
            
            # Warum
            elif "**💡 Warum:**" in line:
                current_step['why'] = line.replace("**💡 Warum:**", "").strip()
            
            # Anleitung (mehrere Zeilen nach **📝 Anleitung:**)
            elif "**📝 Anleitung:**" in line:
                inst_lines = []
                j = i + 1
                while j < tag_end and not lines[j].startswith("**"):
                    if lines[j].strip() and not lines[j].startswith("```"):
                        inst_lines.append(lines[j].strip())
                    j += 1
                current_step['instruction'] = '\n'.join(inst_lines)
            
            # Code-Block
            elif "```python" in line:
                in_code_block = True
            elif "```" in line and in_code_block:
                in_code_block = False
            elif in_code_block:
                code_lines.append(line)
            
            # Checkpoint
            elif "**✅ Checkpoint:**" in line:
                checkpoint_text = line.replace("**✅ Checkpoint:**", "").strip()
                # Sammle auch folgende Zeilen bis zum nächsten ** oder neuen Schritt
                j = i + 1
                while j < tag_end and not lines[j].startswith("**") and not lines[j].startswith("###"):
                    if lines[j].strip():
                        checkpoint_text += " " + lines[j].strip()
                    else:
                        break
                    j += 1
                current_step['checkpoint'] = checkpoint_text
    
    # Speichere letzten Schritt
    if current_step:
        if code_lines:
            current_step['code'] = '\n'.join(code_lines)
        steps.append(current_step)
    
    return {
        'title': title,
        'description': task_desc,
        'goals': goals,
        'steps': steps
    }

def main():
    wochen_config = [
        ('WochenPlan/woche1_grundlagen.md', 1, range(1, 8)),
        ('WochenPlan/woche2_strukturen.md', 2, range(8, 15)),
        ('WochenPlan/woche3_oop.md', 3, range(15, 22)),
        ('WochenPlan/woche4_anwendungen.md', 4, range(22, 31))
    ]
    
    all_weeks_data = []
    
    for filepath, week_num, day_range in wochen_config:
        print(f"\n📖 Verarbeite {filepath}...")
        
        if not os.path.exists(filepath):
            print(f"  ❌ Datei nicht gefunden!")
            continue
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        week_days = []
        for global_day_num in day_range:
            print(f"  Extrahiere Tag {global_day_num}...", end=" ")
            
            day_data = extract_complete_day(content, global_day_num)
            
            if day_data and day_data['steps']:
                local_day_num = global_day_num - (week_num - 1) * 7
                week_days.append({
                    'id': local_day_num,
                    'weekId': week_num,
                    'globalId': global_day_num,
                    'title': day_data['title'],
                    'description': day_data['description'],
                    'goals': day_data['goals'],
                    'steps': day_data['steps']
                })
                print(f"✅ ({len(day_data['steps'])} Schritte)")
            else:
                print(f"⚠️  Keine Daten gefunden")
        
        all_weeks_data.append({
            'weekNum': week_num,
            'days': week_days
        })
    
    # Speichere als JSON
    output_file = 'extracted_full_content.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_weeks_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Vollständige Daten gespeichert in: {output_file}")
    
    # Statistik
    total_days = sum(len(w['days']) for w in all_weeks_data)
    total_steps = sum(len(d['steps']) for w in all_weeks_data for d in w['days'])
    print(f"\n📊 Statistik:")
    print(f"  - Tage extrahiert: {total_days}")
    print(f"  - Schritte gesamt: {total_steps}")
    print(f"  - Durchschnitt: {total_steps/total_days:.1f} Schritte/Tag")

if __name__ == "__main__":
    main()
