import os

filepath = r"c:/Users/Maurice/OneDrive - BFW-Leipzig/Mull/PythonLernen/WochenPlan/woche2_strukturen.md"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
found_start = False
found_end = False

for i, line in enumerate(lines):
    # Marker for Start of Old Content (leftover)
    # Line 686 (was 686 in Step 357 view)
    if "**💡 Warum:** Daten in Dateien verstehen und verarbeiten" in line:
        print(f"DEBUG: Found start marker at line {i+1}")
        skip = True
        found_start = True
    
    # Marker for Start of Tag 12 (Stop Deleting)
    # Line 1107 in Step 364 view
    if "## Tag 12: Notiz-App (Dateien Schreiben)" in line:
        print(f"DEBUG: Found end marker at line {i+1}")
        skip = False
        found_end = True
        new_lines.append(line)
        continue # Process this line (Tag 12 header should be KEPT)
    
    if not skip:
        new_lines.append(line)

if found_start and found_end:
    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("✅ Successfully removed duplicate content.")
else:
    print("❌ Could not find markers. File confusion.")
    if not found_start: print("   - Start marker not found")
    if not found_end: print("   - End marker not found")
