
import sys
from pathlib import Path

filepath = r"c:/Users/Maurice/OneDrive - BFW-Leipzig/Mull/PythonLernen/WochenPlan/woche4_anwendungen.md"
redesign_dir = Path(r"C:/Users/Maurice/.gemini/antigravity/brain/fc9d73ae-70a4-496c-baa5-1076eac09bf3")

def get_content(filename):
    p = redesign_dir / filename
    return p.read_text(encoding="utf-8")

tag_22 = get_content("Tag_22_JSON_Redesigned.md")
tag_23 = get_content("Tag_23_CSV_Redesigned.md")
tag_24 = get_content("Tag_24_Datetime_Redesigned.md")
tag_25 = get_content("Tag_25_RandomSecrets_Redesigned.md")
tag_26 = get_content("Tag_26_Requests_Redesigned.md")
tag_27 = get_content("Tag_27_WebScraping_Redesigned.md")
tag_28 = get_content("Tag_28_SQLite_Redesigned.md")
tag_29 = get_content("Tag_29_FinanceProject_Redesigned.md")
tag_30 = get_content("Tag_30_FinalHub_Redesigned.md")

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False

tag_headers = {
    "## Tag 22:": tag_22,
    "## Tag 23:": tag_23,
    "## Tag 24:": tag_24
}

added_new_tags = False

for line in lines:
    found_header = False
    for header in tag_headers:
        if line.startswith(header):
            skip = True
            new_lines.append(tag_headers[header] + "\n---\n\n")
            found_header = True
            break
    
    if found_header:
        continue
    
    # Check for the end of old Tag 24
    if "*Die Datei wird fortgesetzt mit Tag 25-30" in line:
        skip = True
        if not added_new_tags:
            new_lines.append(tag_25 + "\n---\n\n")
            new_lines.append(tag_26 + "\n---\n\n")
            new_lines.append(tag_27 + "\n---\n\n")
            new_lines.append(tag_28 + "\n---\n\n")
            new_lines.append(tag_29 + "\n---\n\n")
            new_lines.append(tag_30 + "\n---\n\n")
            added_new_tags = True
        continue
    
    if not skip:
        new_lines.append(line)

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("✅ Successfully replaced Tag 22-24 and added Tag 25-30 in woche4_anwendungen.md.")
