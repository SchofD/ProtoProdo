import requests
from bs4 import BeautifulSoup
import time
import json

# Basis-URL
BASE_URL = "https://thrawnsrevenge.fandom.com"
CATEGORY_URL = f"{BASE_URL}/wiki/Category:Space_Units"

# Funktion: alle Schiff-Links sammeln
def get_ship_links():
    response = requests.get(CATEGORY_URL)
    soup = BeautifulSoup(response.text, "html.parser")
    links = []
    for link in soup.select('.category-page__member-link'):
        href = link.get('href')
        full_url = BASE_URL + href
        links.append(full_url)
    return links

# Funktion: Einzelnes Schiff scrapen
def scrape_ship(url):
    print(f"Scraping {url} ...")
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Titel (Ship Name)
    ship_name_el = soup.select_one('h1.page-header__title')
    if not ship_name_el:
        print("Kein Ship Name gefunden, überspringe...")
        return None
    ship_name = ship_name_el.text.strip()

    # Infobox
    info_box = soup.select_one('.portable-infobox')
    if not info_box:
        print(f"Keine Infobox für {ship_name}, überspringe...")
        return None
    
    # Start-Dictionary
    ship_data = {
        "Ship Name": ship_name,
        "Fraktion": [],
        "Funktion": "",
        "Pop Verbrauch": "",
        "Kosten": "",
        "Bauzeit": "",
        "Besatzung": "",
        "Energieschild": "",
        "Trefferpunkte": "",
        "Geschwindigkeit": "",
        "Bewaffnung": []
    }
    
    # Infobox parsen
    for row in info_box.select('.pi-data'):
        label = row.select_one('.pi-data-label')
        value = row.select_one('.pi-data-value')
        
        if not label or not value:
            continue
        
        label_text = label.text.strip()
        value_text = value.text.strip()
        
        # Mapping
        if label_text == "Factions":
            factions = [li.text.strip() for li in value.select('li')] or [value_text]
            ship_data["Fraktion"] = factions
        elif label_text == "Ship Class":
            ship_data["Funktion"] = value_text
        elif label_text == "Pop Value":
            ship_data["Pop Verbrauch"] = value_text
        elif label_text == "Cost":
            ship_data["Kosten"] = value_text
        elif label_text == "Build Time":
            ship_data["Bauzeit"] = value_text
        elif label_text == "Ship Crews":
            ship_data["Besatzung"] = value_text
        elif label_text == "Shield Points":
            ship_data["Energieschild"] = value_text
        elif label_text == "Hull Points":
            ship_data["Trefferpunkte"] = value_text
        elif label_text == "Speed":
            ship_data["Geschwindigkeit"] = value_text
        elif label_text == "Armament":
            armament = [li.text.strip() for li in value.select('li')] or [value_text]
            ship_data["Bewaffnung"] = armament
    
    return ship_data

# MAIN
if __name__ == "__main__":
    print("Schiff-Links sammeln...")
    ship_links = get_ship_links()
    print(f"Gefundene Schiffe: {len(ship_links)}")

    all_ship_data = []

    for idx, url in enumerate(ship_links, 1):
        print(f"[{idx}/{len(ship_links)}]")
        ship_data = scrape_ship(url)
        if ship_data:
            all_ship_data.append(ship_data)
        time.sleep(1) 

    # JSON speichern
    output_file = "ships_data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_ship_data, f, indent=4, ensure_ascii=False)

    print(f"Fertig! {len(all_ship_data)} Schiffe gespeichert in {output_file}.")