import json
import re

# Paths
data_js_path = r'c:\Users\Maurice\OneDrive - BFW-Leipzig\Mull\PythonLernen\js\data.js'
slides_json_path = r'c:\Users\Maurice\OneDrive - BFW-Leipzig\Mull\PythonLernen\js\tag1_slides.json'

def update_data_js():
    # Read new slides
    try:
        with open(slides_json_path, 'r', encoding='utf-8') as f:
            slides_data = json.load(f)
    except Exception as e:
        print(f"Error reading slides JSON: {e}")
        return

    # Read JS file
    try:
        with open(data_js_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
    except Exception as e:
        print(f"Error reading data.js: {e}")
        return

    # Find the start of the slides array for Day 1
    # We look for '"slides": [' inside the first day object
    # Since we know it's the first occurrence of '"slides": [', we can just find that.
    
    start_pattern = '"slides": ['
    start_index = js_content.find(start_pattern)

    if start_index == -1:
        print("Could not find 'slides': [ in data.js")
        return

    # Find the matching closing bracket
    bracket_count = 0
    end_index = -1
    
    # Start searching from the opening bracket of the array
    search_start = start_index + len('"slides":') 
    # Skip whitespace to find '['
    while search_start < len(js_content) and js_content[search_start] != '[':
        search_start += 1
        
    if search_start >= len(js_content):
        print("Could not find opening bracket [")
        return

    # Now count brackets
    for i in range(search_start, len(js_content)):
        char = js_content[i]
        if char == '[':
            bracket_count += 1
        elif char == ']':
            bracket_count -= 1
            
        if bracket_count == 0:
            end_index = i + 1 # include the closing bracket
            break
            
    if end_index == -1:
        print("Could not find matching closing bracket")
        return

    # Format the new JSON
    # We want it to look nice in the file, so we add indentation
    json_str = json.dumps(slides_data, indent=8, ensure_ascii=False)
    # The default indentation is for root level, we are deep inside
    # Let's just indent it properly
    indented_json = json_str.replace('\n', '\n\t\t\t\t\t') # simplistic indentation fix

    # Replace the old array with the new one
    new_content = js_content[:start_index] + '"slides": ' + indented_json + js_content[end_index:]

    # Write back
    try:
        with open(data_js_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully updated data.js")
    except Exception as e:
        print(f"Error writing to data.js: {e}")

if __name__ == "__main__":
    update_data_js()
