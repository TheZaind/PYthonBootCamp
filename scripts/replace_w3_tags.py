
import sys
from pathlib import Path

filepath = r"c:/Users/Maurice/OneDrive - BFW-Leipzig/Mull/PythonLernen/WochenPlan/woche3_oop.md"
redesign_dir = Path(r"C:/Users/Maurice/.gemini/antigravity/brain/fc9d73ae-70a4-496c-baa5-1076eac09bf3")

def get_content(filename):
    p = redesign_dir / filename
    return p.read_text(encoding="utf-8")

tag_15 = get_content("Tag_15_ClassesBasics_Redesigned.md")
tag_16 = get_content("Tag_16_ClassesAdvanced_Redesigned.md")
tag_17 = get_content("Tag_17_AdvancedInheritance_Redesigned.md")
tag_18 = get_content("Tag_18_OSModule_Redesigned.md")
tag_19 = get_content("Tag_19_Pathlib_Redesigned.md")
tag_20 = get_content("Tag_20_Shutil_Redesigned.md")
tag_21 = get_content("Tag_21_Glob_Redesigned.md")

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False

tag_headers = {
    "## Tag 15:": tag_15,
    "## Tag 16:": tag_16,
    "## Tag 17:": tag_17,
    "## Tag 18:": tag_18,
    "## Tag 19:": tag_19,
    "## Tag 20:": tag_20,
    "## Tag 21:": tag_21
}

current_tag = None

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
        
    # Check for the start of Week 4 or any other tag after 21
    if line.startswith("## Tag 22:"):
        skip = False
    
    if not skip:
        new_lines.append(line)

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("✅ Successfully replaced Tag 15-21 in woche3_oop.md.")
