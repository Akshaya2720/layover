import os
import sys
import json
import argparse
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check for Google GenAI library
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
HAS_GENAI = False
try:
    from google import genai
    from google.genai import types
    if GEMINI_KEY and GEMINI_KEY != "YOUR_GEMINI_API_KEY_HERE":
        HAS_GENAI = True
except Exception as e:
    HAS_GENAI = False

KOZHIKODE_KNOWLEDGE_ARCHIVE = """
AUTHENTIC KOZHIKODE (CALICUT) HERITAGE CONTEXT:
1. UNESCO City of Literature (designated in 2023 - first in India):
   - Celebrates literary giant S.K. Pottekkatt, author of 'Oru Desathinte Katha' and 'Oru Theruvinte Katha'.
   - Bronze statue of S.K. Pottekkatt stands at the entrance of S.M. Street (Mittai Theruvu).
2. S.M. Street (Sweet Meat Street / Mittai Theruvu):
   - Famous for authentic Kozhikodan Halwa (black halwa made with jaggery, coconut oil, tender cashew).
   - Historic bakeries: Sankaran Bakery, Royal Halwa stall, Bombay Hotel (operating since 1949, renowned for Sulaimani black tea & banana fritters).
3. Kozhikode Beach & Sea Pier:
   - Historic 1871 sea pier ruins stretching into the Arabian Sea.
   - Marine ground where Zamorin's sailors met Arab, Chinese, and Venetian merchants.
   - Lion's Park and lighthouse overlooking the Malabar coast.
4. Mananchira Square & Coronation Lake:
   - Fresh-water reservoir built in the 14th century by King Rama Varma (Zamorin/Samoothiri).
   - Surrounded by Commonwealth Trust tile factories, Town Hall, and traditional Kerala laterite architecture with intricately carved wooden gables.
5. Kappad Beach:
   - Historical spot 16 km north where Vasco da Gama landed on 20 May 1498 in three caravels.
6. Mishkal Mosque & Kuttichira:
   - Built in 1300s by Arab shipowner Nakhuda Mishkal. Four-tiered wooden temple-style gopuram architecture.
7. Beypore Port:
   - Legendary port 10 km south where master carpenters (Khalasis) handcraft massive wooden ocean-going dhows called 'Uru' for Arab merchants.
"""

def generate_ai_quest(params: Dict[str, Any]) -> Dict[str, Any]:
    genre = params.get("genre", "mystery")
    story_type = params.get("story_type", "real")
    start_loc = params.get("start_location", "Kozhikode Beach, Beach Road")
    destination = params.get("destination", "Mananchira Square, Kozhikode")
    budget = params.get("budget", "free")
    language = params.get("language", "en") # en, ml, hi

    prompt = f"""
You are the master Kerala Game Master AI for Wanderlore in Kozhikode (UNESCO City of Literature).
Create an authentic, immersive, real-world 3-checkpoint adventure game.
Input parameters:
- Genre: {genre}
- Story Type: {story_type} (Use genuine Calicut history and local legends)
- Start: {start_loc}
- Destination: {destination}
- Budget Tier: {budget} (free walking, auto rickshaw ₹50-100, heritage transit)
- Language: {language}

Reference historical facts:
{KOZHIKODE_KNOWLEDGE_ARCHIVE}

CRITICAL RULES:
1. Checkpoint 1 must be near {start_loc}.
2. Checkpoint 2 must be intermediate along the real walking route (e.g., S.M. Street / Sweet Meat Street or Kuttichira).
3. Checkpoint 3 must be near {destination}.
4. Provide a genuine physical observation task for each place (e.g. identify the nearby bakery name, find the year inscribed on the pier, observe the carved red laterite gate).
5. Output ONLY valid JSON matching this structure:
{{
  "id": "py-quest-{genre}-{int(1000)}",
  "title": "Quest Title",
  "genre": "{genre}",
  "storyType": "{story_type}",
  "destination": "{destination}",
  "startLocation": "{start_loc}",
  "budget": "{budget}",
  "introNarrative": "A rich story narrative introducing the expedition.",
  "routeDistanceKm": 2.8,
  "estimatedDurationMins": 45,
  "routeWaypoints": [[11.2588, 75.7686], [11.2541, 75.7765], [11.2514, 75.7808]],
  "chapters": [
    {{
      "id": "chap-1",
      "number": 1,
      "title": "Chapter 1 Title",
      "subtitle": "Subtitle",
      "status": "active",
      "unlockCondition": "Observe local site and solve initial clue",
      "narrativeText": "Story context for this spot",
      "checkpoint": {{
        "id": "cp-1",
        "number": 1,
        "name": "Kozhikode Beach Pier Heritage Spot",
        "subtitle": "Arabian Sea Coastline",
        "lat": 11.2588,
        "lng": 75.7686,
        "distanceFromStartKm": 0.6,
        "estimatedMins": 12,
        "description": "Standing near the 1871 iron pier ruins.",
        "photoUrl": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80",
        "onSiteScavengerTask": {{
          "prompt": "Look towards Beach Road: Name the famous restaurant founded in 1949 renowned for Sulaimani tea.",
          "targetObject": "Bombay Hotel",
          "requiredAction": "answer_and_photo",
          "targetPhotoClue": "Photo facing Beach Road cafe or pier beams"
        }},
        "riddle": {{
          "question": "I brew the darkest Sulaimani since 1949 on Beach Road. What is my name?",
          "answer": "bombay hotel",
          "acceptedAnswers": ["bombay hotel", "bombay", "the bombay hotel"],
          "hints": ["Look across the street from the pier", "It begins with B and is named after an Indian metropolis", "Bombay Hotel"]
        }},
        "collectibleArtifact": {{
          "id": "art-1",
          "name": "Zamorin Brass Spice Weight",
          "description": "Used by 15th-century pepper merchants",
          "modelType": "coin",
          "historicSignificance": "Standard trade weight of the Calicut naval court"
        }},
        "culturalFact": {{
          "fact": "Kozhikode was known as the 'City of Spices' and later earned UNESCO City of Literature status in 2023.",
          "source": "Kerala State Archives & UNESCO Creative Cities Network",
          "category": "Literature & Heritage"
        }},
        "arHint": "Scan the ground to project the 3D Zamorin Spice Weight"
      }}
    }},
    {{
      "id": "chap-2",
      "number": 2,
      "title": "Chapter 2 Title",
      "subtitle": "Sweet Meat Street Bazaar",
      "status": "locked",
      "unlockCondition": "Solve Checkpoint 1 on-site challenge",
      "narrativeText": "Story continues in S.M. Street",
      "checkpoint": {{
        "id": "cp-2",
        "number": 2,
        "name": "S.M. Street (Mittai Theruvu)",
        "subtitle": "UNESCO Literature Corridor",
        "lat": 11.2541,
        "lng": 75.7765,
        "distanceFromStartKm": 1.4,
        "estimatedMins": 18,
        "description": "The bustling pedestrian spine of Calicut's sweet and book heritage.",
        "photoUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        "onSiteScavengerTask": {{
          "prompt": "Find the historic bakery display selling layered dark jaggery Halwa.",
          "targetObject": "Kozhikodan Halwa",
          "requiredAction": "answer_and_photo",
          "targetPhotoClue": "Photo of sweet meat glass shelf or S.K. Pottekkatt statue"
        }},
        "riddle": {{
          "question": "What gelatinous black delicacy boiled in copper vats gives this street its colonial nickname?",
          "answer": "halwa",
          "acceptedAnswers": ["halwa", "kozhikodan halwa", "sweet meat"],
          "hints": ["Made with pure jaggery and coconut oil", "Known across South India as Calicut's signature sweet", "Halwa"]
        }},
        "collectibleArtifact": {{
          "id": "art-2",
          "name": "Antique Halwa Copper Ladle",
          "description": "Hand-forged ladle used to stir boiling jaggery syrup",
          "modelType": "amulet",
          "historicSignificance": "Artifact from Calicut's confectionery guilds"
        }},
        "culturalFact": {{
          "fact": "Novelist S.K. Pottekkatt wrote his celebrated novel 'Oru Theruvinte Katha' based on the daily lives of shopkeepers on this very street.",
          "source": "Sahitya Akademi Archives",
          "category": "Literature"
        }},
        "arHint": "Point your camera towards the shop signs to unlock the 3D copper ladle"
      }}
    }},
    {{
      "id": "chap-3",
      "number": 3,
      "title": "Chapter 3: The King's Coronation Water",
      "subtitle": "Mananchira Square Sanctuary",
      "status": "locked",
      "unlockCondition": "Solve Checkpoint 2 on-site challenge",
      "narrativeText": "The conclusion of the historical quest",
      "checkpoint": {{
        "id": "cp-3",
        "number": 3,
        "name": "Mananchira Square",
        "subtitle": "Historic Zamorin Royal Tank",
        "lat": 11.2514,
        "lng": 75.7808,
        "distanceFromStartKm": 2.8,
        "estimatedMins": 15,
        "description": "The grand man-made lake built by Zamorin King Mana Vikrama.",
        "photoUrl": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
        "onSiteScavengerTask": {{
          "prompt": "Observe the grand red stone entryway. What type of Kerala stone was used to sculpt the gateway?",
          "targetObject": "Laterite Stone",
          "requiredAction": "answer_and_photo",
          "targetPhotoClue": "Photo of the red stone entrance arch or lake perimeter"
        }},
        "riddle": {{
          "question": "I am the sacred coronation pool carved from red laterite earth by King Mana Vikrama. What is my name?",
          "answer": "mananchira",
          "acceptedAnswers": ["mananchira", "mananchira square", "mananchira lake"],
          "hints": ["It is named after King Mana Vikrama", "It surrounds a quiet green park in the city center", "Mananchira"]
        }},
        "collectibleArtifact": {{
          "id": "art-3",
          "name": "Zamorin Royal Seal of Justice",
          "description": "Seal bearing the twin crossed swords and floral wreath",
          "modelType": "relic",
          "historicSignificance": "Decree emblem from the Samoothiri palace court"
        }},
        "culturalFact": {{
          "fact": "Mananchira lake was strictly protected as a pristine drinking water reservoir for over six centuries, demonstrating ancient rainwater harvesting.",
          "source": "District Heritage Conservation Board",
          "category": "Civic History"
        }},
        "arHint": "Scan the open waters to reveal the floating 3D Royal Seal"
      }}
    }}
  ],
  "finalMystery": {{
    "title": "The UNESCO Crown of Calicut",
    "riddle": "From Arabian trade ships to Sweet Meat Street and the King's sacred pool, what singular international honor did Kozhikode receive in 2023 for its centuries of storytelling?",
    "question": "What UNESCO title was bestowed upon Kozhikode in 2023?",
    "answer": "city of literature",
    "acceptedAnswers": ["city of literature", "unesco city of literature", "literature city", "sahitya nagaram"],
    "hints": ["Honors its legendary writers like S.K. Pottekkatt and Vaikom Muhammad Basheer", "Awarded by UNESCO Creative Cities Network in 2023", "City of Literature"],
    "resolutionLore": "In October 2023, Kozhikode became India's very first UNESCO City of Literature. The journey through its streets connects the spice sailors of 1498 with the writers of modern Kerala."
  }},
  "completionRewards": {{
    "badge": "UNESCO Literature Envoy",
    "badgeIcon": "📜",
    "xp": 1000,
    "unlockItem": "Wanderlore All-Corridor Free Travel Pass"
  }}
}}
"""

    if HAS_GENAI:
        try:
            client = genai.Client(api_key=GEMINI_KEY)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                )
            )
            data = json.loads(response.text)
            return data
        except Exception as e:
            sys.stderr.write(f"[Python AI] Gemini generation error: {e}. Falling back to authentic archive.\n")

    # High fidelity authentic fallback matching exact Kozhikode lore per genre
    import time
    t_id = int(time.time())
    g = (genre or "mystery").lower()
    is_default_start = not start_loc or "kozhikode beach" in start_loc.lower() or start_loc == "Current Location"
    is_default_dest = not destination or "mananchira square" in destination.lower()

    if g == "history":
        return {
            "id": f"py-quest-history-{t_id}",
            "title": "The Zamorins' Sovereign Heritage Trail",
            "genre": "history",
            "storyType": story_type,
            "destination": destination if (destination and not is_default_dest) else "Mananchira Square, Kozhikode",
            "startLocation": start_loc if (start_loc and not is_default_start) else "Mishkal Mosque, Kuttichira, Kozhikode",
            "budget": budget,
            "introNarrative": "Step into the golden age of the Samoothiri (Zamorin) dynasty. For over 600 years, Kozhikode was the epicenter of world trade and communal brotherhood. Journey through the timber halls of Kuttichira, the intellectual debate arena of Tali Temple, and the royal reservoir of Mananchira!",
            "routeDistanceKm": 2.9,
            "estimatedDurationMins": 48,
            "routeWaypoints": [[11.2443, 75.7766], [11.2464, 75.7865], [11.2514, 75.7808]],
            "chapters": [
                {
                    "id": "chap-1",
                    "number": 1,
                    "title": "Chapter 1: The Timber Sentinels of Mishkal",
                    "subtitle": "Mishkal Mosque & Kuttichira",
                    "status": "active",
                    "unlockCondition": "Solve Kuttichira architectural clue",
                    "narrativeText": "Standing before the four-tiered wooden roof of Mishkal Mosque built in the 1300s by Nakhuda Mishkal. Notice the absence of domes or minarets, blending with traditional Malabar temple carpentry.",
                    "checkpoint": {
                        "id": "cp-1",
                        "number": 1,
                        "name": "Mishkal Mosque & Kuttichira Heritage Quarter",
                        "subtitle": "14th-Century Wooden Architecture",
                        "lat": 11.2443,
                        "lng": 75.7766,
                        "distanceFromStartKm": 0.4,
                        "estimatedMins": 10,
                        "description": "Constructed with 24 teakwood pillars from Nilambur forests, defended by the Zamorin's army in 1510.",
                        "photoUrl": "/genres/history.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Look at the stepped granite ablution pool (Kuttichira Kulam): Name the wealthy Arab merchant who built this sanctuary in the 1300s.",
                            "targetObject": "Nakhuda Mishkal",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo facing four-tier timber roof or Kuttichira pond"
                        },
                        "riddle": {
                            "question": "Built in the 1300s without dome or minaret, my four tiers of wooden roofs mimic Malabar temples. What landmark am I?",
                            "answer": "mishkal mosque",
                            "acceptedAnswers": ["mishkal mosque", "mishkal", "mishkal palli"],
                            "hints": ["Located in Kuttichira", "Built by Nakhuda Mishkal", "Mishkal Mosque"]
                        },
                        "collectibleArtifact": {
                            "id": "art-hist-1",
                            "name": "Nilambur Teakwood Edict Plaque",
                            "description": "Carved teakwood tablet commemorating communal brotherhood in 1510",
                            "modelType": "tablet",
                            "historicSignificance": "Symbol of interfaith harmony under the Samoothiri"
                        },
                        "culturalFact": {
                            "fact": "In 1510, Zamorin's Nair soldiers and Muslim mariners united to defend Mishkal Mosque from Portuguese attack.",
                            "source": "Logan's Malabar Manual",
                            "category": "Interfaith Heritage"
                        },
                        "arHint": "Project the 3D Teakwood Edict Tablet in AR"
                    }
                },
                {
                    "id": "chap-2",
                    "number": 2,
                    "title": "Chapter 2: The Hall of Philosophers at Tali",
                    "subtitle": "Tali Shiva Temple",
                    "status": "locked",
                    "unlockCondition": "Solve Chapter 1",
                    "narrativeText": "Arrive at Tali Shiva Temple where the Zamorin hosted the famous Revathi Pattathanam tournament of Vedic scholars.",
                    "checkpoint": {
                        "id": "cp-2",
                        "number": 2,
                        "name": "Tali Shiva Temple & Pattathanam Arena",
                        "subtitle": "Granite Temple & Scholarly Tournament",
                        "lat": 11.2464,
                        "lng": 75.7865,
                        "distanceFromStartKm": 1.6,
                        "estimatedMins": 20,
                        "description": "Intricate laterite carvings and the historic hall where philosophers debated for sacks of gold coins.",
                        "photoUrl": "/genres/history.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Observe the grand eastern gateway: What was the prize presented in a silk bag by the Zamorin to the winning scholar?",
                            "targetObject": "Kizhi (Silk Purse of Gold Coins)",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of eastern temple gateway or brass lamp"
                        },
                        "riddle": {
                            "question": "For seven days every year, philosophers competed before the Zamorin here. What was this prestigious tournament called?",
                            "answer": "revathi pattathanam",
                            "acceptedAnswers": ["revathi pattathanam", "pattathanam"],
                            "hints": ["Held in the month of Thulam", "Prize was a purse of gold called Kizhi", "Revathi Pattathanam"]
                        },
                        "collectibleArtifact": {
                            "id": "art-hist-2",
                            "name": "Scholar's Royal Silk Purse (Kizhi)",
                            "description": "Silk pouch filled with Zamorin fanam gold coins",
                            "modelType": "coin",
                            "historicSignificance": "Highest academic accolade of medieval South India"
                        },
                        "culturalFact": {
                            "fact": "Revathi Pattathanam welcomed scholars from all philosophical traditions, judged solely on logic and truth.",
                            "source": "Zamorin Royal Archives",
                            "category": "Intellectual Heritage"
                        },
                        "arHint": "View the 3D Silk Kizhi Purse in AR"
                    }
                },
                {
                    "id": "chap-3",
                    "number": 3,
                    "title": "Chapter 3: The Royal Seat of Mana Vikrama",
                    "subtitle": "Mananchira Square",
                    "status": "locked",
                    "unlockCondition": "Solve Chapter 2",
                    "narrativeText": "Reach Mananchira Square, the administrative and civic heart constructed by King Mana Vikrama.",
                    "checkpoint": {
                        "id": "cp-3",
                        "number": 3,
                        "name": "Mananchira Square & Royal Palace Gateway",
                        "subtitle": "Zamorin Administrative Center",
                        "lat": 11.2514,
                        "lng": 75.7808,
                        "distanceFromStartKm": 2.9,
                        "estimatedMins": 18,
                        "description": "The four-acre fresh-water lake surrounded by traditional laterite archways.",
                        "photoUrl": "/genres/history.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Look at the carved gateway: What red porous stone native to Kerala were these entrance pillars sculpted from?",
                            "targetObject": "Laterite Stone",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of carved red stone arch or park gate"
                        },
                        "riddle": {
                            "question": "Carved from red laterite earth by King Mana Vikrama to quench the thirst of travelers. What royal reservoir am I?",
                            "answer": "mananchira",
                            "acceptedAnswers": ["mananchira", "mananchira square", "mananchira tank"],
                            "hints": ["Named after Mana Vikrama", "Central lake of Kozhikode", "Mananchira"]
                        },
                        "collectibleArtifact": {
                            "id": "art-hist-3",
                            "name": "Zamorin Mana Vikrama Royal Seal",
                            "description": "Brass seal bearing the twin crossed swords and sun crest",
                            "modelType": "seal",
                            "historicSignificance": "Royal decree emblem from 1350 to 1800 CE"
                        },
                        "culturalFact": {
                            "fact": "Mananchira's water was held in such high reverence that no leather footwear was allowed near its stone steps for 400 years.",
                            "source": "Calicut Heritage Records",
                            "category": "Ancient Engineering"
                        },
                        "arHint": "Inspect the 3D Zamorin Royal Seal in AR"
                    }
                }
            ],
            "finalMystery": {
                "title": "The Sovereign Throne of the Zamorin",
                "riddle": "What royal title, meaning 'Lord of the Sea and Mountains', did the rulers of Kozhikode proudly carry?",
                "question": "What is the authentic Malayalam royal title of the Kozhikode ruler?",
                "answer": "samoothiri",
                "acceptedAnswers": ["samoothiri", "zamorin", "samoothiri raja"],
                "hints": ["English pronunciation is Zamorin", "Malayalam title starts with S", "Samoothiri"],
                "resolutionLore": "You have completed the Sovereign Heritage Trail of Kozhikode, walking where kings held court and international merchants traded in truth!"
            },
            "completionRewards": {
                "badge": "Zamorin Royal Chronicler",
                "badgeIcon": "🏛️",
                "xp": 800,
                "unlockItem": "Wanderlore All-Corridor Free Travel Pass"
            }
        }

    elif g == "adventure":
        return {
            "id": f"py-quest-adventure-{t_id}",
            "title": "The Voyage of the Beypore Titans",
            "genre": "adventure",
            "storyType": story_type,
            "destination": destination if (destination and not is_default_dest) else "Kallai River Estuary, Kozhikode",
            "startLocation": start_loc if (start_loc and not is_default_start) else "Beypore Port & Uru Yard, Kozhikode",
            "budget": budget,
            "introNarrative": "Venture south to Beypore, where master shipwrights (Khalasis) have hand-built massive wooden ocean vessels called Urus for over a thousand years. Walk the granite sea path of Pulimuttu into the ocean waves and follow the timber rafters down Kallai river!",
            "routeDistanceKm": 4.5,
            "estimatedDurationMins": 65,
            "routeWaypoints": [[11.1663, 75.8080], [11.1610, 75.8010], [11.2280, 75.7950]],
            "chapters": [
                {
                    "id": "chap-1",
                    "number": 1,
                    "title": "Chapter 1: The Wooden Giants of Beypore",
                    "subtitle": "Beypore Uru Boatyards",
                    "status": "active",
                    "unlockCondition": "Inspect the teakwood shipyard",
                    "narrativeText": "Stand before the massive wooden skeleton of an ocean-going Uru ship. Master Khalasi craftsmen use no blueprints, only sacred geometry passed down through centuries.",
                    "checkpoint": {
                        "id": "cp-1",
                        "number": 1,
                        "name": "Beypore Uru Wooden Shipbuilding Yard",
                        "subtitle": "1500-Year Living Maritime Craft",
                        "lat": 11.1663,
                        "lng": 75.8080,
                        "distanceFromStartKm": 0.5,
                        "estimatedMins": 15,
                        "description": "Legendary shipyard on the Chaliyar estuary where luxury wooden vessels are hand-crafted for Gulf royalty.",
                        "photoUrl": "/genres/adventure.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Look at the massive wooden ships being built along the Chaliyar riverbank: What is the traditional name for these wooden dhows?",
                            "targetObject": "Uru (or Dhow)",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of wooden ship hull or timber scaffold"
                        },
                        "riddle": {
                            "question": "Crafted from Malabar teak with brass spikes and no modern blueprints, I sail the Arabian Sea for Arab sheikhs. What wooden vessel am I?",
                            "answer": "uru",
                            "acceptedAnswers": ["uru", "beypore uru", "dhow"],
                            "hints": ["Three letters: U _ _", "Handcrafted in Beypore", "Uru"]
                        },
                        "collectibleArtifact": {
                            "id": "art-adv-1",
                            "name": "Handcrafted Teak Uru Keel Pin",
                            "description": "Miniature brass and teakwood pin used by Beypore Khalasis",
                            "modelType": "ship",
                            "historicSignificance": "Symbol of Kerala's world-renowned naval architecture"
                        },
                        "culturalFact": {
                            "fact": "Beypore Urus take 50 master craftsmen up to two years to complete, constructed from seasoned Nilambur teak.",
                            "source": "Beypore Shipbuilders Guild",
                            "category": "Maritime Craft"
                        },
                        "arHint": "Spawn the 3D Beypore Uru ship in AR mode"
                    }
                },
                {
                    "id": "chap-2",
                    "number": 2,
                    "title": "Chapter 2: The Two-Kilometer Sea Walk",
                    "subtitle": "Beypore Pulimuttu",
                    "status": "locked",
                    "unlockCondition": "Solve Chapter 1",
                    "narrativeText": "Trek along the granite breakwater extending 2 kilometers straight into the open Arabian Sea.",
                    "checkpoint": {
                        "id": "cp-2",
                        "number": 2,
                        "name": "Beypore Pulimuttu Sea Walk & Marine Beacon",
                        "subtitle": "2km Granite Ocean Promenade",
                        "lat": 11.1610,
                        "lng": 75.8010,
                        "distanceFromStartKm": 2.2,
                        "estimatedMins": 25,
                        "description": "Granite boulders lined with sea spray, separating Chaliyar river mouth from the Arabian Sea.",
                        "photoUrl": "/genres/adventure.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Walk towards the tip of the stone sea pier: What river merges with the Arabian Sea right beside the Pulimuttu?",
                            "targetObject": "Chaliyar River",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of granite sea pier extending into waves"
                        },
                        "riddle": {
                            "question": "I am a two-kilometer bridge of stone without arches, surrounded by ocean on left and river on right. What pathway am I?",
                            "answer": "pulimuttu",
                            "acceptedAnswers": ["pulimuttu", "beypore pulimuttu", "breakwater", "sea walk"],
                            "hints": ["Malayalam name for stone sea pier", "Located in Beypore", "Pulimuttu"]
                        },
                        "collectibleArtifact": {
                            "id": "art-adv-2",
                            "name": "Navigator's Granite Beacon Amulet",
                            "description": "Etched stone medallion commemorating ocean journeys",
                            "modelType": "amulet",
                            "historicSignificance": "Guide for monsoon mariners entering Calicut"
                        },
                        "culturalFact": {
                            "fact": "Beypore was one of the earliest ports mentioned by Greek geographer Ptolemy as 'Tyndis' in the 1st century CE.",
                            "source": "Maritime Archaeological Society",
                            "category": "Ancient Ports"
                        },
                        "arHint": "View the 3D Beacon Amulet in AR"
                    }
                },
                {
                    "id": "chap-3",
                    "number": 3,
                    "title": "Chapter 3: The Log Rafters of Kallai",
                    "subtitle": "Kallai River Estuary",
                    "status": "locked",
                    "unlockCondition": "Solve Chapter 2",
                    "narrativeText": "Travel north along the Kallai river basin, once the second-largest timber trade hub in all of Asia.",
                    "checkpoint": {
                        "id": "cp-3",
                        "number": 3,
                        "name": "Kallai River Historic Timber Yard",
                        "subtitle": "Asia's Historic Teak Trading Hub",
                        "lat": 11.2280,
                        "lng": 75.7950,
                        "distanceFromStartKm": 4.5,
                        "estimatedMins": 25,
                        "description": "Where massive teak logs floated down from Western Ghats forests were sorted and exported globally.",
                        "photoUrl": "/genres/adventure.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Look at the water beside the railway bridge: What prized hardwood timber from Nilambur made Kallai famous across the world?",
                            "targetObject": "Teak Wood (Malabar Teak)",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of Kallai river bridge or water banks"
                        },
                        "riddle": {
                            "question": "In the 19th and 20th centuries, I was Asia's second busiest river for floating golden hardwood. What river am I?",
                            "answer": "kallai",
                            "acceptedAnswers": ["kallai", "kallai river", "കല്ലായി"],
                            "hints": ["Famous river of Kozhikode", "Starts with K", "Kallai"]
                        },
                        "collectibleArtifact": {
                            "id": "art-adv-3",
                            "name": "Kallai Timber Guild Brass Marking Hammer",
                            "description": "Miniature inspection hammer used by 19th-century timber inspectors",
                            "modelType": "tool",
                            "historicSignificance": "Emblem of Calicut's industrial golden age"
                        },
                        "culturalFact": {
                            "fact": "Nilambur teak floated down Kallai was exported to build the deck of British Royal Navy flagship HMS Trincomalee in 1817.",
                            "source": "Kerala Forest Department Archives",
                            "category": "Industrial History"
                        },
                        "arHint": "Project the 3D Timber Marking Hammer in AR"
                    }
                }
            ],
            "finalMystery": {
                "title": "The Secret of the Master Khalasis",
                "riddle": "What is the name of the traditional rope and wooden pulley mechanism used by 50 men to haul a 500-ton Uru into the water?",
                "question": "What is the legendary rope and winch system called?",
                "answer": "kappal dabba",
                "acceptedAnswers": ["kappal dabba", "dabba", "pulley", "winch", "khalasi mechanism"],
                "hints": ["Traditional manual winch system", "Used by Khalasis", "Dabba"]
            },
            "completionRewards": {
                "badge": "Titan of the Malabar Coast",
                "badgeIcon": "⛵",
                "xp": 900,
                "unlockItem": "Wanderlore All-Corridor Free Travel Pass"
            }
        }

    elif g == "romance":
        return {
            "id": f"py-quest-romance-{t_id}",
            "title": "Whispers of the Malabar Sunset: Basheer's Seaside Serenade",
            "genre": "romance",
            "storyType": story_type,
            "destination": destination if (destination and not is_default_dest) else "Sarovaram Bio Park, Kozhikode",
            "startLocation": start_loc if (start_loc and not is_default_start) else "South Beach Promenade, Kozhikode",
            "budget": budget,
            "introNarrative": "Kozhikode's twilight ocean breezes inspired Kerala's beloved writer Vaikom Muhammad Basheer. Walk along South Beach where love stories met the tide, observe the 1907 lighthouse beacon, and stroll the serene lotus boardwalks of Sarovaram Bio Park!",
            "routeDistanceKm": 3.8,
            "estimatedDurationMins": 52,
            "routeWaypoints": [[11.2485, 75.7685], [11.2615, 75.7670], [11.2720, 75.8030]],
            "chapters": [
                {
                    "id": "chap-1",
                    "number": 1,
                    "title": "Chapter 1: The Sultan of Beypore's Sunset",
                    "subtitle": "South Beach Promenade",
                    "status": "active",
                    "unlockCondition": "Observe the casuarina trees on South Beach",
                    "narrativeText": "Under the rustling casuarina pines of South Beach, Vaikom Muhammad Basheer listened to his gramophone playing old songs and wrote beloved romantic stories.",
                    "checkpoint": {
                        "id": "cp-1",
                        "number": 1,
                        "name": "Kozhikode South Beach Promenade",
                        "subtitle": "Quiet Sunset Sanctuary",
                        "lat": 11.2485,
                        "lng": 75.7685,
                        "distanceFromStartKm": 0.6,
                        "estimatedMins": 12,
                        "description": "Quieter and more reflective than main beach, cherished for twilight views.",
                        "photoUrl": "/genres/romance.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Look towards the beachfront tea kiosks: What fragrant spiced black tea infused with cardamom and lemon do couples share at dusk?",
                            "targetObject": "Sulaimani Tea",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of sunset horizon over South Beach"
                        },
                        "riddle": {
                            "question": "Known as the Sultan of Beypore, which Malayalam author wrote romantic stories like Premalekhanam while living in Kozhikode?",
                            "answer": "basheer",
                            "acceptedAnswers": ["basheer", "vaikom muhammad basheer", "ബഷീർ"],
                            "hints": ["Known as Beypore Sultan", "Wrote Balyakalasakhi", "Basheer"]
                        },
                        "collectibleArtifact": {
                            "id": "art-rom-1",
                            "name": "Basheer's Vintage Gramophone",
                            "description": "Miniature brass gramophone honoring the writer of love stories",
                            "modelType": "music",
                            "historicSignificance": "Emblem of Kozhikode's romantic literary heritage"
                        },
                        "culturalFact": {
                            "fact": "Basheer wrote Premalekhanam while imprisoned for fighting British colonial rule, turning love into quiet defiance.",
                            "source": "Kerala Sahitya Akademi",
                            "category": "Literature"
                        },
                        "arHint": "Spawn the 3D Gramophone on the beach in AR"
                    }
                },
                {
                    "id": "chap-2",
                    "number": 2,
                    "title": "Chapter 2: The Beacon of the Arabian Sea",
                    "subtitle": "Kozhikode Lighthouse",
                    "status": "locked",
                    "unlockCondition": "Solve Chapter 1",
                    "narrativeText": "Standing 33 meters tall on Beach Road, the 1907 lighthouse has cast its guiding beam across the waves for over a century.",
                    "checkpoint": {
                        "id": "cp-2",
                        "number": 2,
                        "name": "Historic Kozhikode Lighthouse",
                        "subtitle": "1907 Coastal Masonry Beacon",
                        "lat": 11.2615,
                        "lng": 75.7670,
                        "distanceFromStartKm": 2.1,
                        "estimatedMins": 22,
                        "description": "Built in 1907, flashing its beam every 15 seconds across 16 nautical miles.",
                        "photoUrl": "/genres/romance.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Observe the historic plaque at the lighthouse entrance: In what year was this masonry lighthouse commissioned?",
                            "targetObject": "1907",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of lighthouse tower against the sky"
                        },
                        "riddle": {
                            "question": "Standing tall on Beach Road since 1907, my revolving eye sweeps the night ocean every fifteen seconds. What landmark am I?",
                            "answer": "lighthouse",
                            "acceptedAnswers": ["lighthouse", "light house", "kozhikode lighthouse"],
                            "hints": ["Tall white tower", "Guides ships at sea", "Lighthouse"]
                        },
                        "collectibleArtifact": {
                            "id": "art-rom-2",
                            "name": "Miniature Brass Fresnel Lens",
                            "description": "Model of the revolving glass beacon lens",
                            "modelType": "lens",
                            "historicSignificance": "Guiding light for generations of seafarers"
                        },
                        "culturalFact": {
                            "fact": "The original optical lamp operated on vaporized petroleum gas before being electrified in the 1950s.",
                            "source": "Directorate General of Lighthouses",
                            "category": "Maritime History"
                        },
                        "arHint": "View the 3D Fresnel Lens in AR"
                    }
                },
                {
                    "id": "chap-3",
                    "number": 3,
                    "title": "Chapter 3: The Lotus Canals of Sarovaram",
                    "subtitle": "Sarovaram Bio Park",
                    "status": "locked",
                    "unlockCondition": "Solve Chapter 2",
                    "narrativeText": "Wooden boardwalks thread through protected mangrove wetlands, surrounded by lotus ponds and gentle breeze.",
                    "checkpoint": {
                        "id": "cp-3",
                        "number": 3,
                        "name": "Sarovaram Bio Park Lotus Boardwalk",
                        "subtitle": "Urban Wetland Conservation Park",
                        "lat": 11.2720,
                        "lng": 75.8030,
                        "distanceFromStartKm": 3.8,
                        "estimatedMins": 18,
                        "description": "Kerala's premier urban wetland conservation park with walking trails over water.",
                        "photoUrl": "/genres/romance.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Look at the lotus ponds: What sacred aquatic flower blossoms here, celebrated in Malayalam poetry?",
                            "targetObject": "Lotus Flower (Thamarappoo)",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of wetland wooden boardwalk or water lilies"
                        },
                        "riddle": {
                            "question": "Floating on wetland canals, my pink and white petals open at dawn and close at dusk. What sacred flower am I?",
                            "answer": "lotus",
                            "acceptedAnswers": ["lotus", "lotus flower", "thamarappoo", "താമര"],
                            "hints": ["Sacred bloom of South Asia", "Starts with L", "Lotus"]
                        },
                        "collectibleArtifact": {
                            "id": "art-rom-3",
                            "name": "Handcrafted Rosewood Lotus Blossom",
                            "description": "Delicately carved wooden lotus blossom",
                            "modelType": "flower",
                            "historicSignificance": "Symbol of enduring affection and serenity"
                        },
                        "culturalFact": {
                            "fact": "Sarovaram protects over 200 species of migratory birds that fly across continents to rest in Kozhikode's wetlands.",
                            "source": "Kerala Biodiversity Board",
                            "category": "Eco-Conservation"
                        },
                        "arHint": "View the glowing 3D Rosewood Lotus in AR"
                    }
                }
            ],
            "finalMystery": {
                "title": "The Golden Sunset of Malabar",
                "riddle": "What is the famous evening snack of steamed sweet plantain fried in golden batter that sweetens twilight walks in Kozhikode?",
                "question": "What is the iconic golden banana fritter called in Malayalam?",
                "answer": "pazham pori",
                "acceptedAnswers": ["pazham pori", "pazham baji", "banana fritters", "പഴം പൊരി"],
                "hints": ["Made with ripe Nendran bananas", "Fried golden brown", "Pazham Pori"]
            },
            "completionRewards": {
                "badge": "Poet of the Calicut Shoreline",
                "badgeIcon": "🌅",
                "xp": 750,
                "unlockItem": "Wanderlore All-Corridor Free Travel Pass"
            }
        }

    elif g == "horror":
        return {
            "id": f"py-quest-horror-{t_id}",
            "title": "The Shadows of French Loge & South Pier Phantom",
            "genre": "horror",
            "storyType": story_type,
            "destination": destination if (destination and not is_default_dest) else "Kozhikode South Beach Sunken Pier",
            "startLocation": start_loc if (start_loc and not is_default_start) else "St. Mary's English Cemetery, Beach Road",
            "budget": budget,
            "introNarrative": "When coastal sea fog settles over Kozhikode at midnight, forgotten 18th-century colonial graves whisper secrets, crumbling French walls cast deep shadows, and fishermen speak of the phantom ship whistle from the 1902 cyclone!",
            "routeDistanceKm": 2.6,
            "estimatedDurationMins": 42,
            "routeWaypoints": [[11.2492, 75.7710], [11.2570, 75.7680], [11.2470, 75.7690]],
            "chapters": [
                {
                    "id": "chap-1",
                    "number": 1,
                    "title": "Chapter 1: The Whispering Epitaphs",
                    "subtitle": "St. Mary's European Cemetery",
                    "status": "active",
                    "unlockCondition": "Inspect the basalt colonial headstones",
                    "narrativeText": "Moss-covered basalt vaults from the 1700s stand along Beach Road, holding forgotten merchants and naval captains who died of tropical fevers.",
                    "checkpoint": {
                        "id": "cp-1",
                        "number": 1,
                        "name": "St. Mary's Historic European Cemetery",
                        "subtitle": "18th-Century Basalt Vaults",
                        "lat": 11.2492,
                        "lng": 75.7710,
                        "distanceFromStartKm": 0.4,
                        "estimatedMins": 10,
                        "description": "Historic colonial cemetery documented in William Logan's 1887 Malabar Manual.",
                        "photoUrl": "/genres/horror.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Observe the weathered stone boundary: What centuries-old colonial cemetery lies beside Beach Road?",
                            "targetObject": "St. Mary's Cemetery (European Cemetery)",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of moss-grown stone pillars or wrought iron gate"
                        },
                        "riddle": {
                            "question": "Beneath creeping moss and basalt vaults on Beach Road, forgotten officers of the British East India Company sleep. What site is this?",
                            "answer": "st marys cemetery",
                            "acceptedAnswers": ["st marys cemetery", "english cemetery", "european cemetery", "cemetery"],
                            "hints": ["Colonial burial ground", "Contains 18th-century epitaphs", "St Mary's Cemetery"]
                        },
                        "collectibleArtifact": {
                            "id": "art-hor-1",
                            "name": "Weathered Basalt Epitaph Rubbing",
                            "description": "Stone inscription imprint from an 18th-century sea merchant's vault",
                            "modelType": "stone",
                            "historicSignificance": "Chronicle of maritime casualties during the Malabar monsoons"
                        },
                        "culturalFact": {
                            "fact": "William Logan documented over 120 inscriptions here dating back to 1740 in his famous Malabar Manual.",
                            "source": "Malabar Inscriptions, 1887",
                            "category": "Colonial Archaeology"
                        },
                        "arHint": "Reveal the spectral 3D Basalt Epitaph in AR"
                    }
                },
                {
                    "id": "chap-2",
                    "number": 2,
                    "title": "Chapter 2: The French Enclave in Calicut",
                    "subtitle": "Ruins of the French Loge",
                    "status": "locked",
                    "unlockCondition": "Solve Chapter 1",
                    "narrativeText": "For centuries, a small six-acre enclave on Beach Road belonged entirely to France, serving as a clandestine outpost until 1947.",
                    "checkpoint": {
                        "id": "cp-2",
                        "number": 2,
                        "name": "The Ruins of the French Loge",
                        "subtitle": "18th-Century French Sovereign Enclave",
                        "lat": 11.2570,
                        "lng": 75.7680,
                        "distanceFromStartKm": 1.5,
                        "estimatedMins": 16,
                        "description": "The enigmatic enclave ceded by the Zamorin to the French East India Company in 1722.",
                        "photoUrl": "/genres/horror.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Find the historic heritage marker near Beach Road: Which European nation maintained this tiny sovereign trade enclave in Kozhikode until 1947?",
                            "targetObject": "France (French Loge)",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of French Loge stone compound or road sign"
                        },
                        "riddle": {
                            "question": "A tiny six-acre territory on Calicut Beach where the French tricolor flew until 1947. What was this secret enclave called?",
                            "answer": "french loge",
                            "acceptedAnswers": ["french loge", "loge", "french enclave", "ഫ്രഞ്ച് ലോഗ്"],
                            "hints": ["French outpost in Kozhikode", "Known as the Loge", "French Loge"]
                        },
                        "collectibleArtifact": {
                            "id": "art-hor-2",
                            "name": "Fleur-de-Lis Wax Seal of the French Loge",
                            "description": "Antique wax seal of the French merchant consul in Calicut",
                            "modelType": "seal",
                            "historicSignificance": "Decree emblem from the French Indian territories"
                        },
                        "culturalFact": {
                            "fact": "Even during British colonial rule, British police could not legally enter the French Loge to arrest suspects.",
                            "source": "Treaty of Paris (1814) & Calicut Archives",
                            "category": "Diplomatic History"
                        },
                        "arHint": "Inspect the 3D French Fleur-de-Lis Seal in AR"
                    }
                },
                {
                    "id": "chap-3",
                    "number": 3,
                    "title": "Chapter 3: The Sunken Pillars of 1902",
                    "subtitle": "South Beach Sunken Pier",
                    "status": "locked",
                    "unlockCondition": "Solve Chapter 2",
                    "narrativeText": "Rusted iron pillars submerged under crashing waves mark the pier destroyed during the terrifying 1902 Malabar cyclone.",
                    "checkpoint": {
                        "id": "cp-3",
                        "number": 3,
                        "name": "The Sunken Pillars of South Pier",
                        "subtitle": "Ruins of the 1902 Maritime Cyclone",
                        "lat": 11.2470,
                        "lng": 75.7690,
                        "distanceFromStartKm": 2.6,
                        "estimatedMins": 16,
                        "description": "Barnacle-encrusted iron stumps where nocturnal fishermen still report hearing phantom steamer bells.",
                        "photoUrl": "/genres/horror.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Look out into the breaking surf: What natural disaster destroyed this massive iron cargo pier in November 1902?",
                            "targetObject": "Cyclone / Great Storm of 1902",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of rusted iron pier ruins standing in sea surf"
                        },
                        "riddle": {
                            "question": "In November 1902, a furious tempest from the sea shattered my iron deck, leaving only rusted fangs in the water. What natural disaster struck me?",
                            "answer": "cyclone",
                            "acceptedAnswers": ["cyclone", "storm", "1902 cyclone", "great cyclone", "ചുഴലിക്കാറ്റ്"],
                            "hints": ["Violent tropical storm", "Struck the Malabar Coast in 1902", "Cyclone"]
                        },
                        "collectibleArtifact": {
                            "id": "art-hor-3",
                            "name": "Barnacle-Encrusted Shipwreck Bell",
                            "description": "Miniature brass ship's bell recovered from the 1902 storm ruins",
                            "modelType": "bell",
                            "historicSignificance": "Relic of maritime perils along the Malabar roadstead"
                        },
                        "culturalFact": {
                            "fact": "The 1902 cyclone destroyed over 80 vessels anchored off Calicut port in a single night.",
                            "source": "Malabar Gazette (1903 edition)",
                            "category": "Maritime Disasters"
                        },
                        "arHint": "Ring the 3D Shipwreck Bell in AR mode"
                    }
                }
            ],
            "finalMystery": {
                "title": "The Phantom Steamer of the Malabar Coast",
                "riddle": "What is the name of the iron steamer that disappeared into coastal fog off Calicut during the great 1902 cyclone?",
                "question": "What cargo vessel was lost to the sea?",
                "answer": "sir john lawrence",
                "acceptedAnswers": ["sir john lawrence", "john lawrence", "ss john lawrence", "steamer"],
                "hints": ["Named after a British governor", "SS Sir John...", "Sir John Lawrence"]
            },
            "completionRewards": {
                "badge": "Phantom Hunter of the Malabar Coast",
                "badgeIcon": "🕯️",
                "xp": 850,
                "unlockItem": "Wanderlore All-Corridor Free Travel Pass"
            }
        }

    elif g == "fantasy":
        return {
            "id": f"py-quest-fantasy-{t_id}",
            "title": "The Enchanted Groves of Valayanad",
            "genre": "fantasy",
            "storyType": story_type,
            "destination": destination if (destination and not is_default_dest) else "Mananchira Sacred Gateway, Kozhikode",
            "startLocation": start_loc if (start_loc and not is_default_start) else "Valayanad Devi Temple Sacred Grove, Kozhikode",
            "budget": budget,
            "introNarrative": "Explore the mystical folklore of Kerala: sacred serpent groves (Sarpa Kavu), enchanted temple pools, and the guardian spirits that protected the Zamorin kingdom for generations!",
            "routeDistanceKm": 3.4,
            "estimatedDurationMins": 48,
            "routeWaypoints": [[11.2360, 75.8090], [11.2464, 75.7865], [11.2514, 75.7808]],
            "chapters": [
                {
                    "id": "chap-1",
                    "number": 1,
                    "title": "Chapter 1: The Whispering Serpent Grove",
                    "subtitle": "Valayanad Sacred Grove",
                    "status": "active",
                    "unlockCondition": "Observe the ancient sacred grove trees",
                    "narrativeText": "Deep within the Valayanad temple precinct lies a primeval Sarpa Kavu, where massive banyan roots protect stone serpent idols.",
                    "checkpoint": {
                        "id": "cp-1",
                        "number": 1,
                        "name": "Valayanad Sacred Grove (Sarpa Kavu)",
                        "subtitle": "Primeval Serpent Sanctuary",
                        "lat": 11.2360,
                        "lng": 75.8090,
                        "distanceFromStartKm": 0.5,
                        "estimatedMins": 12,
                        "description": "Where the Zamorin kings prayed before battle, protected by sacred mangrove trees.",
                        "photoUrl": "/genres/fantasy.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Look into the protected green grove: What mythical deity is carved into the ancient laterite stones beneath the trees?",
                            "targetObject": "Naga (Serpent Deity)",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of sacred grove banyan roots or temple courtyard"
                        },
                        "riddle": {
                            "question": "I am an untouched forest pocket where serpent deities dwell in peace beneath banyan trees. What sacred sanctuary am I?",
                            "answer": "sarpa kavu",
                            "acceptedAnswers": ["sarpa kavu", "kavu", "sacred grove", "സർപ്പക്കാവ്"],
                            "hints": ["Traditional Kerala sacred grove", "Dedicated to serpents", "Sarpa Kavu"]
                        },
                        "collectibleArtifact": {
                            "id": "art-fan-1",
                            "name": "Carved Stone Naga Guardian Idol",
                            "description": "Miniature stone amulet of the five-headed guardian serpent",
                            "modelType": "naga",
                            "historicSignificance": "Symbol of ecological protection in Kerala folklore"
                        },
                        "culturalFact": {
                            "fact": "Sacred groves in Kerala act as natural micro-climates, conserving rare medicinal herbs and ground water tables.",
                            "source": "Kerala Folklore Academy",
                            "category": "Sacred Ecology"
                        },
                        "arHint": "Spawn the glowing 3D Naga Amulet in AR"
                    }
                },
                {
                    "id": "chap-2",
                    "number": 2,
                    "title": "Chapter 2: The Temple of the Eternal Flame",
                    "subtitle": "Tali Kulam Sacred Pool",
                    "status": "locked",
                    "unlockCondition": "Solve Chapter 1",
                    "narrativeText": "Proceed to the sacred granite steps of Tali Kulam where thousands of oil lamps reflect in emerald water during festivals.",
                    "checkpoint": {
                        "id": "cp-2",
                        "number": 2,
                        "name": "Tali Kulam Sacred Temple Tank",
                        "subtitle": "Granite Stepped Sacred Reservoir",
                        "lat": 11.2464,
                        "lng": 75.7865,
                        "distanceFromStartKm": 1.9,
                        "estimatedMins": 20,
                        "description": "Centuries-old stone water sanctuary that mirrors temple towers and ritual oil lamps.",
                        "photoUrl": "/genres/fantasy.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Observe the grand stepped tank: What multi-tiered brass lamp tower stands before the temple sanctum?",
                            "targetObject": "Deepastambham (Brass Lamp Tower)",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of stepped temple pond water or brass lamp"
                        },
                        "riddle": {
                            "question": "Fed by natural underground springs, my green granite steps have mirrored temple oil lamps for six hundred years. What sacred water body am I?",
                            "answer": "tali kulam",
                            "acceptedAnswers": ["tali kulam", "tali tank", "temple pond", "തളിക്കുളം"],
                            "hints": ["Pond beside Tali temple", "Starts with Tali", "Tali Kulam"]
                        },
                        "collectibleArtifact": {
                            "id": "art-fan-2",
                            "name": "Ancient Temple Deepam Oil Lamp",
                            "description": "Miniature brass multi-wick lamp blessed in the temple sanctum",
                            "modelType": "lamp",
                            "historicSignificance": "Symbol of spiritual enlightenment in Kerala tradition"
                        },
                        "culturalFact": {
                            "fact": "Underground laterite aquifers keep Tali Kulam brimming with fresh water even during drought months.",
                            "source": "State Archaeology Department",
                            "category": "Sacred Hydrology"
                        },
                        "arHint": "Light the 3D Brass Deepam in AR"
                    }
                },
                {
                    "id": "chap-3",
                    "number": 3,
                    "title": "Chapter 3: The Gateway of the Sovereign Spirit",
                    "subtitle": "Mananchira Sacred Pool",
                    "status": "locked",
                    "unlockCondition": "Solve Chapter 2",
                    "narrativeText": "Reach the sacred red laterite gates of Mananchira, where legend speaks of a royal guardian spirit protecting the city.",
                    "checkpoint": {
                        "id": "cp-3",
                        "number": 3,
                        "name": "Mananchira Sacred Stone Pool",
                        "subtitle": "Royal Freshwater Sanctuary",
                        "lat": 11.2514,
                        "lng": 75.7808,
                        "distanceFromStartKm": 3.4,
                        "estimatedMins": 16,
                        "description": "The sacred heart of the kingdom surrounded by carved laterite gateway posts.",
                        "photoUrl": "/genres/fantasy.jpg",
                        "onSiteScavengerTask": {
                            "prompt": "Look at the carved laterite gateway: What protective mythical motifs are sculpted into the boundary pillars?",
                            "targetObject": "Laterite Sacred Gateway",
                            "requiredAction": "answer_and_photo",
                            "targetPhotoClue": "Photo of carved stone entryway pillars"
                        },
                        "riddle": {
                            "question": "Four acres of crystal water carved from red earth by the royal sword of King Mana Vikrama. What sacred lake am I?",
                            "answer": "mananchira",
                            "acceptedAnswers": ["mananchira", "mananchira square", "mananchira pool", "മനാഞ്ചിറ"],
                            "hints": ["Built by Mana Vikrama", "Heart of Kozhikode", "Mananchira"]
                        },
                        "collectibleArtifact": {
                            "id": "art-fan-3",
                            "name": "Enchanted Lotus Blossom Relic",
                            "description": "Crystalline lotus flower said to glow under the full moon",
                            "modelType": "flower",
                            "historicSignificance": "Symbol of serenity and renewal"
                        },
                        "culturalFact": {
                            "fact": "Folklore says subterranean laterite tunnels linked Mananchira pool to the Zamorin palace inner chambers.",
                            "source": "Calicut Oral Heritage Archives",
                            "category": "Living Folklore"
                        },
                        "arHint": "Reveal the glowing 3D Enchanted Lotus in AR"
                    }
                }
            ],
            "finalMystery": {
                "title": "The Awakening of the Zamorin's Guardian Spirit",
                "riddle": "What sacred curved sword of Kerala was blessed at Valayanad and held by the Zamorin during coronation rites?",
                "question": "What is the royal sword called in Malayalam tradition?",
                "answer": "odi val",
                "acceptedAnswers": ["odi val", "royal sword", "val", "വാൾ", "sword of the zamorin"],
                "hints": ["Traditional sacred curved sword", "Starts with O: Odi V...", "Odi Val"]
            },
            "completionRewards": {
                "badge": "Sorcerer of the Malabar Grove",
                "badgeIcon": "🔮",
                "xp": 850,
                "unlockItem": "Wanderlore All-Corridor Free Travel Pass"
            }
        }

    # Default: mystery (Kozhikode Beach Pier -> SM Street -> Mananchira)
    return {
        "id": f"py-quest-mystery-{t_id}",
        "title": "The Lost Zamorin Spice Ledger",
        "genre": "mystery",
        "storyType": story_type,
        "destination": destination or "Mananchira Square, Kozhikode",
        "startLocation": start_loc or "Kozhikode Beach, Beach Road",
        "budget": budget,
        "introNarrative": f"As the salty Arabian Sea breeze washes over {start_loc or 'Kozhikode Beach'}, an encrypted 15th-century ledger from the Samoothiri dynasty guides your footsteps towards {destination or 'Mananchira Square'}. Each checkpoint challenges you with on-site observations in India's first UNESCO City of Literature.",
        "routeDistanceKm": 2.8,
        "estimatedDurationMins": 45,
        "routeWaypoints": [[11.2588, 75.7686], [11.2541, 75.7765], [11.2514, 75.7808]],
        "chapters": [
            {
                "id": "chap-1",
                "number": 1,
                "title": "Chapter 1: The Sea Merchant's First Ledger",
                "subtitle": "Kozhikode Beach Pier Heritage Spot",
                "status": "active",
                "unlockCondition": "Solve Beach Road on-site observation",
                "narrativeText": "Begin at the historic coastline where Arab dhows dropped anchor centuries ago. Look across Beach Road to decode the first clue.",
                "checkpoint": {
                    "id": "cp-1",
                    "number": 1,
                    "name": "Kozhikode Beach Pier Heritage Spot",
                    "subtitle": "Arabian Sea Coastline",
                    "lat": 11.2588,
                    "lng": 75.7686,
                    "distanceFromStartKm": 0.6,
                    "estimatedMins": 12,
                    "description": "Historic sea pier ruins built in 1871 where spice merchant ships unloaded cargo.",
                    "photoUrl": "/genres/mystery.jpg",
                    "onSiteScavengerTask": {
                        "prompt": "Look towards Beach Road: Name the famous restaurant founded in 1949 renowned for Sulaimani tea.",
                        "targetObject": "Bombay Hotel",
                        "requiredAction": "answer_and_photo",
                        "targetPhotoClue": "Photo of Beach Road cafe or pier beams"
                    },
                    "riddle": {
                        "question": "I brew the darkest Sulaimani since 1949 on Beach Road. What is my name?",
                        "answer": "bombay hotel",
                        "acceptedAnswers": ["bombay hotel", "bombay", "the bombay hotel"],
                        "hints": ["Look across the street from the pier", "It begins with B and is named after an Indian metropolis", "Bombay Hotel"]
                    },
                    "collectibleArtifact": {
                        "id": "art-1",
                        "name": "Zamorin Brass Spice Weight",
                        "description": "Used by 15th-century pepper merchants",
                        "modelType": "coin",
                        "historicSignificance": "Standard trade weight of the Calicut naval court"
                    },
                    "culturalFact": {
                        "fact": "Kozhikode was designated as India's very first UNESCO City of Literature in October 2023.",
                        "source": "UNESCO Creative Cities Network",
                        "category": "Literature & Heritage"
                    },
                    "arHint": "Scan the ground to project the 3D Zamorin Spice Weight"
                }
            },
            {
                "id": "chap-2",
                "number": 2,
                "title": "Chapter 2: The Sweet Meat Street Confectioners",
                "subtitle": "S.M. Street (Mittai Theruvu)",
                "status": "locked",
                "unlockCondition": "Solve Checkpoint 1 on-site challenge",
                "narrativeText": "Follow the scent of cardamom, pure jaggery, and roasting cashews into the historic pedestrian avenue.",
                "checkpoint": {
                    "id": "cp-2",
                    "number": 2,
                    "name": "S.M. Street (Mittai Theruvu)",
                    "subtitle": "UNESCO Literature Corridor",
                    "lat": 11.2541,
                    "lng": 75.7765,
                    "distanceFromStartKm": 1.4,
                    "estimatedMins": 18,
                    "description": "Calicut's iconic heritage commercial street, immortalized in Malayalam literature.",
                    "photoUrl": "/genres/mystery.jpg",
                    "onSiteScavengerTask": {
                        "prompt": "Find the historic bakery display selling layered dark jaggery Halwa.",
                        "targetObject": "Kozhikodan Halwa",
                        "requiredAction": "answer_and_photo",
                        "targetPhotoClue": "Photo of sweet meat display or S.K. Pottekkatt statue"
                    },
                    "riddle": {
                        "question": "What gelatinous black delicacy boiled in copper vats gives this street its colonial nickname?",
                        "answer": "halwa",
                        "acceptedAnswers": ["halwa", "kozhikodan halwa", "sweet meat"],
                        "hints": ["Made with pure jaggery and coconut oil", "Known across South India as Calicut's signature sweet", "Halwa"]
                    },
                    "collectibleArtifact": {
                        "id": "art-2",
                        "name": "Antique Halwa Copper Ladle",
                        "description": "Hand-forged ladle used to stir boiling jaggery syrup",
                        "modelType": "amulet",
                        "historicSignificance": "Artifact from Calicut's confectionery guilds"
                    },
                    "culturalFact": {
                        "fact": "Novelist S.K. Pottekkatt won the Jnanpith Award for 'Oru Desathinte Katha', capturing the life of this bazaar.",
                        "source": "Sahitya Akademi Archives",
                        "category": "Literature"
                    },
                    "arHint": "Point your camera towards the shop signs to unlock the 3D copper ladle"
                }
            },
            {
                "id": "chap-3",
                "number": 3,
                "title": "Chapter 3: The King's Coronation Water",
                "subtitle": "Mananchira Square Sanctuary",
                "status": "locked",
                "unlockCondition": "Solve Checkpoint 2 on-site challenge",
                "narrativeText": "Reach the sacred heart of the city where the Zamorin kings performed purification rites.",
                "checkpoint": {
                    "id": "cp-3",
                    "number": 3,
                    "name": "Mananchira Square",
                    "subtitle": "Historic Zamorin Royal Tank",
                    "lat": 11.2514,
                    "lng": 75.7808,
                    "distanceFromStartKm": 2.8,
                    "estimatedMins": 15,
                    "description": "The grand man-made lake built by Zamorin King Mana Vikrama in the 14th century.",
                    "photoUrl": "/genres/mystery.jpg",
                    "onSiteScavengerTask": {
                        "prompt": "Observe the grand red stone entryway. What type of Kerala stone was used to sculpt the gateway?",
                        "targetObject": "Laterite Stone",
                        "requiredAction": "answer_and_photo",
                        "targetPhotoClue": "Photo of the red stone entrance arch or lake perimeter"
                    },
                    "riddle": {
                        "question": "I am the sacred coronation pool carved from red laterite earth by King Mana Vikrama. What is my name?",
                        "answer": "mananchira",
                        "acceptedAnswers": ["mananchira", "mananchira square", "mananchira lake"],
                        "hints": ["It is named after King Mana Vikrama", "It surrounds a quiet green park in the city center", "Mananchira"]
                    },
                    "collectibleArtifact": {
                        "id": "art-3",
                        "name": "Zamorin Royal Seal of Justice",
                        "description": "Seal bearing the twin crossed swords and floral wreath",
                        "modelType": "relic",
                        "historicSignificance": "Decree emblem from the Samoothiri palace court"
                    },
                    "culturalFact": {
                        "fact": "Mananchira lake was strictly protected as a pristine drinking water reservoir for over six centuries, demonstrating ancient rainwater harvesting.",
                        "source": "District Heritage Conservation Board",
                        "category": "Civic History"
                    },
                    "arHint": "Scan the open waters to reveal the floating 3D Royal Seal"
                }
            }
        ],
        "finalMystery": {
            "title": "The UNESCO Crown of Calicut",
            "riddle": "From Arabian trade ships to Sweet Meat Street and the King's sacred pool, what singular international honor did Kozhikode receive in 2023 for its centuries of storytelling?",
            "question": "What UNESCO title was bestowed upon Kozhikode in 2023?",
            "answer": "city of literature",
            "acceptedAnswers": ["city of literature", "unesco city of literature", "literature city", "sahitya nagaram"],
            "hints": ["Honors its legendary writers like S.K. Pottekkatt and Vaikom Muhammad Basheer", "Awarded by UNESCO Creative Cities Network in 2023", "City of Literature"],
            "resolutionLore": "In October 2023, Kozhikode became India's very first UNESCO City of Literature. The journey through its streets connects the spice sailors of 1498 with the writers of modern Kerala."
        },
        "completionRewards": {
            "badge": "UNESCO Literature Envoy",
            "badgeIcon": "📜",
            "xp": 1000,
            "unlockItem": "Wanderlore All-Corridor Free Travel Pass"
        }
    }

def main():
    parser = argparse.ArgumentParser(description="Wanderlore Python AI Engine")
    parser.add_argument("--action", choices=["quest", "chat", "health"], default="quest")
    parser.add_argument("--payload", type=str, default="")
    args = parser.parse_args()

    if args.action == "health":
        print(json.dumps({
            "status": "ok",
            "engine": "Python AI Engine (Google GenAI 2.29)",
            "geminiConfigured": HAS_GENAI,
            "archiveKnowledge": "Kozhikode UNESCO Literature & Zamorin History"
        }))
        return

    payload = {}
    if args.payload and args.payload.strip():
        try:
            payload = json.loads(args.payload)
        except Exception:
            pass

    if not payload:
        try:
            if not sys.stdin.isatty():
                stdin_data = sys.stdin.read().strip()
                if stdin_data:
                    payload = json.loads(stdin_data)
        except Exception:
            pass

    if args.action == "quest":
        result = generate_ai_quest(payload)
        print(json.dumps(result))
    elif args.action == "chat":
        # Conversational guide AI response
        user_message = payload.get("message", "Hello")
        context = payload.get("context", "Kozhikode Adventure")
        if HAS_GENAI:
            try:
                client = genai.Client(api_key=GEMINI_KEY)
                resp = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=f"You are Cara, the Anam AI guide for Wanderlore in Kozhikode. User says: '{user_message}'. Game Context: {context}. Keep reply conversational and under 2 sentences."
                )
                print(json.dumps({"reply": resp.text.strip()}))
                return
            except Exception as e:
                pass
        print(json.dumps({"reply": f"Welcome explorer! I am Cara, your Anam AI guide in Kozhikode. You are near {context}. Look closely at your surroundings to solve the riddle!"}))

if __name__ == "__main__":
    main()
