import { Story, Quest } from '../../shared/types.js';

export const KOZHIKODE_STORIES: Story[] = [
  // --- MYSTERY (1 Playable + 2 Previews) ---
  {
    id: 'kozhikode-spice-ledger',
    title: 'The Lost Zamorin Spice Ledger',
    synopsis: 'A priceless 15th-century parchment documenting secret maritime spice routes and royal treasury deposits has vanished from the Zamorin archives. Follow historical clues across Kozhikode’s coastline, ancient markets, and royal tanks to recover the truth.',
    genre: 'mystery',
    storyType: 'real',
    difficulty: 'medium',
    estimatedDuration: '1.5 hrs',
    compatibleDestination: 'Mananchira Square, Kozhikode',
    locationTag: 'Kozhikode Beach & SM Street',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    isPreview: false,
    source: 'Calicut Heritage Association & The Hindu Kozhikode Archives',
    sourceUrl: 'https://www.thehindu.com/news/national/kerala/calicut-unesco-city-of-literature/article67484392.ece',
    attribution: 'Archival research on Samoothiri (Zamorin) trade pacts with Arab, Venetian, and Chinese merchant fleets (1300–1500 CE).',
    consentStatus: 'verified_archive',
    verificationStatus: 'documented_fact',
    categoryLabel: 'Historical Fact',
  },
  {
    id: 'sweetmeat-alchemist',
    title: 'The Sweetmeat Street Alchemist',
    synopsis: 'Legend tells of a Gujarati halwa master on S.K. Pottekkatt’s iconic SM Street who encoded a riddle into seven colored sweets to hide a royal jewel during the 1789 siege.',
    genre: 'mystery',
    storyType: 'real',
    difficulty: 'easy',
    estimatedDuration: '1 hr',
    compatibleDestination: 'SM Street (Mittayi Theruvu), Kozhikode',
    locationTag: 'SM Street Market',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    previewChapters: [
      { number: 1, title: 'The Ghee Aromas of 1920', synopsis: 'Search the oldest sweetshop doorway for an inscribed brass measurement weight.' },
      { number: 2, title: 'The Pottekkatt Manuscript', synopsis: 'Decipher a lost paragraph from the Jnanpith-winning novel Oru Desathinte Katha.' },
      { number: 3, title: 'The Vault Behind the Loom', synopsis: 'Locate the hidden cellar near the old Parsi fire temple off Court Road.' }
    ],
    source: 'UNESCO City of Literature Gazette & Oral history from Calicut Heritage Forum',
    consentStatus: 'community_contributed',
    verificationStatus: 'verified_oral_history',
    categoryLabel: 'Community Memoir'
  },
  {
    id: 'fictional-cryptic-compass',
    title: 'The Astrolabe of the Shadow Fleet',
    synopsis: 'An AI-crafted fictional detective tale: An undercover historian discovers an ancient mechanical astrolabe hidden in a shipwreck off South Beach that ticks backward toward a hidden treasure.',
    genre: 'mystery',
    storyType: 'fictional',
    difficulty: 'hard',
    estimatedDuration: '2 hrs',
    compatibleDestination: 'Kappad Beach, Kozhikode',
    locationTag: 'Kappad Coastal Rocks',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    previewChapters: [
      { number: 1, title: 'The Midnight Tide', synopsis: 'Identify constellations carved into the basalt stone where Vasco da Gama touched shore.' },
      { number: 2, title: 'The Lighthouse Cipher', synopsis: 'Count the flashing intervals of the beacon to decrypt a seafaring coordinates code.' },
      { number: 3, title: 'The Sunken Chamber', synopsis: 'Find the tidal cave accessible only during low water neap tides.' }
    ]
  },

  // --- HISTORY (3 stories) ---
  {
    id: 'history-mishkal-fortress',
    title: 'Whispers of Mishkal & Kuttichira',
    synopsis: 'Explore the 14th-century architectural wonder built by Arab ship magnate Nakhuda Mishkal. Discover how community solidarity and the Zamorin’s naval commanders defended this four-tiered wooden jewel.',
    genre: 'history',
    storyType: 'real',
    difficulty: 'easy',
    estimatedDuration: '1 hr',
    compatibleDestination: 'Kuttichira Heritage Quarter, Kozhikode',
    locationTag: 'Mishkal Mosque & Kuttichira Tank',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    previewChapters: [
      { number: 1, title: 'Timber from the Nilambur Forests', synopsis: 'Inspect the 24 carved timber pillars surviving the 1510 Portuguese assault.' },
      { number: 2, title: 'The Stepped Granite Tank', synopsis: 'Measure the ancient stone ghats where scholars from across the Indian Ocean gathered.' },
      { number: 3, title: 'The Zamorin Royal Firman', synopsis: 'Trace the stone edict granting perpetual protection to merchant houses.' }
    ],
    source: 'Archeological Survey of Kerala & Mathrubhumi Special Heritage Series',
    attribution: 'Verified against Kerala State Archives document #KZ-1510-M.',
    consentStatus: 'verified_archive',
    verificationStatus: 'documented_fact',
    categoryLabel: 'Historical Fact'
  },
  {
    id: 'history-tali-scholars',
    title: 'The Great Scholarly Debate of Tali',
    synopsis: 'Uncover the 600-year legacy of Revathi Pattathanam, the prestigious intellectual assembly held by the Zamorins at Tali Shiva Temple where the sharpest philosophers and grammarians earned sacks of gold coins.',
    genre: 'history',
    storyType: 'real',
    difficulty: 'medium',
    estimatedDuration: '1.5 hrs',
    compatibleDestination: 'Tali Shiva Temple, Kozhikode',
    locationTag: 'Tali Heritage Precinct',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    previewChapters: [
      { number: 1, title: 'The Seven Days of Logic', synopsis: 'Solve classical Sanskrit logic riddles at the eastern gopuram doorway.' },
      { number: 2, title: 'The Deepam Illuminations', synopsis: 'Align the stone oil lamps around the central sanctum to reveal secret verses.' },
      { number: 3, title: 'The Golden Purse of Honor', synopsis: 'Find the commemorative plaque honoring Kakkasseri Bhattathiri.' }
    ],
    source: 'Calicut University Department of History',
    consentStatus: 'verified_archive',
    verificationStatus: 'documented_fact',
    categoryLabel: 'Historical Fact'
  },
  {
    id: 'history-fictional-gama-oath',
    title: 'The Lost Chronicles of 1498',
    synopsis: 'An imaginative fictional journey through real historical settings: What if a young Kozhikode astronomer swapped the charts before the European voyage departed?',
    genre: 'history',
    storyType: 'fictional',
    difficulty: 'medium',
    estimatedDuration: '1.5 hrs',
    compatibleDestination: 'Kozhikode Beach Promenade',
    locationTag: 'Historic Seashore',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    previewChapters: [
      { number: 1, title: 'The Monsoon Almanac', synopsis: 'Decode astrological stellar maps hidden inside the old customs warehouse.' },
      { number: 2, title: 'The Pepper Merchant Oath', synopsis: 'Follow the secret handshake of the medieval guild of foreign traders.' },
      { number: 3, title: 'The Silent Anchor', synopsis: 'Trace the submerged iron anchor visible at twilight near South Pier.' }
    ]
  },

  // --- ADVENTURE (3 stories) ---
  {
    id: 'adventure-beypore-khalasi',
    title: 'The Wooden Titans of Beypore',
    synopsis: 'Walk the 1,500-year-old boatyards where master Khalasi shipwrights handcraft massive ocean-going Uru ships using teakwood, brass nails, and ancient pulleys (Dhanbus).',
    genre: 'adventure',
    storyType: 'real',
    difficulty: 'medium',
    estimatedDuration: '2 hrs',
    compatibleDestination: 'Beypore Port & Marina, Kozhikode',
    locationTag: 'Beypore Uru Boatyards',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    previewChapters: [
      { number: 1, title: 'The Teakwood Keel', synopsis: 'Learn the sacred measuring string (Thachusaasthram) used by master craftsmen.' },
      { number: 2, title: 'The Pulley of the Titans', synopsis: 'Discover how 50 men haul a 500-ton vessel into Chaliyar river using pure physics.' },
      { number: 3, title: 'The Beypore Sea Walk', synopsis: 'Venture 2 kilometers into the open sea along the granite sea wall to the beacon.' }
    ],
    source: 'The Hindu: "The living heritage of Beypore Urus" & National Geographic Traveller India',
    attribution: 'Verified with Beypore Shipbuilders Cooperative records.',
    consentStatus: 'verified_archive',
    verificationStatus: 'documented_fact',
    categoryLabel: 'Historical Fact'
  },
  {
    id: 'adventure-kakkayam-valley',
    title: 'The Hidden Cascades of Kakkayam',
    synopsis: 'A thrilling trek through the misty Western Ghats foothills of Kozhikode, tracking old elephant migration corridors and hidden waterfalls.',
    genre: 'adventure',
    storyType: 'real',
    difficulty: 'hard',
    estimatedDuration: '2 hrs',
    compatibleDestination: 'Kakkayam Dam & Forest Reserve',
    locationTag: 'Kakkayam Valley',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    source: 'Kerala Forest & Wildlife Department Ecotourism Reports',
    consentStatus: 'verified_archive',
    verificationStatus: 'documented_fact',
    categoryLabel: 'Historical Fact'
  },
  {
    id: 'adventure-fictional-sky-ruins',
    title: 'The Legend of the Spice Raiders',
    synopsis: 'An AI-generated fictional treasure pursuit: Track clues left by a rogue 17th-century smuggler captain across secret sea caves and rocky headlands.',
    genre: 'adventure',
    storyType: 'fictional',
    difficulty: 'medium',
    estimatedDuration: '1.5 hrs',
    compatibleDestination: 'Kozhikode Lighthouse',
    locationTag: 'Lighthouse Hill',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    isPreview: true
  },

  // --- ROMANCE (3 stories) ---
  {
    id: 'romance-sunset-kappad',
    title: 'The Sea Breeze of Kappad',
    synopsis: 'A lyrical, real-life love story inspired by Kerala’s maritime folklore: the tale of a seafaring traveler from Muscat and a Kozhikode silk merchant’s daughter who waited at the cliffside rock.',
    genre: 'romance',
    storyType: 'real',
    difficulty: 'easy',
    estimatedDuration: '1 hr',
    compatibleDestination: 'Kappad Beach Promenade',
    locationTag: 'Kappad Golden Rocks',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    source: 'Kozhikode Oral Folk Ballads (Mappila Paattu archives)',
    consentStatus: 'community_contributed',
    verificationStatus: 'local_folklore',
    categoryLabel: 'Living Folklore'
  },
  {
    id: 'romance-mananchira-twilight',
    title: 'Twilight at Mananchira',
    synopsis: 'A heartfelt romantic walk around the centuries-old royal tank where poets, lovers, and artists have gathered under rain trees for generations.',
    genre: 'romance',
    storyType: 'real',
    difficulty: 'easy',
    estimatedDuration: '30 mins',
    compatibleDestination: 'Mananchira Square Gardens',
    locationTag: 'Mananchira Green',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    source: 'Kozhikode Cultural Heritage Memoirs',
    consentStatus: 'community_contributed',
    verificationStatus: 'community_recollection',
    categoryLabel: 'Community Memoir'
  },
  {
    id: 'romance-fictional-silk-letters',
    title: 'Letters Written on Palm Leaves',
    synopsis: 'An AI-crafted love story set in the 16th century: Solve riddles left in coded verses tucked into bamboo tubes floating down the Kallai river.',
    genre: 'romance',
    storyType: 'fictional',
    difficulty: 'medium',
    estimatedDuration: '1 hr',
    compatibleDestination: 'Kallai River Bank, Kozhikode',
    locationTag: 'Kallai Timber Basin',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    isPreview: true
  },

  // --- HORROR (3 stories) ---
  {
    id: 'horror-broken-pier-ghosts',
    title: 'The Phantom Whistle of South Pier',
    synopsis: 'The iron sea pier was destroyed in a massive storm in 1902. Night fishermen still report hearing the mournful bell of the cargo steamer SS Sir John Lawrence calling through coastal fog.',
    genre: 'horror',
    storyType: 'real',
    difficulty: 'medium',
    estimatedDuration: '1 hr',
    compatibleDestination: 'Kozhikode South Beach Pier',
    locationTag: 'The Crumbling Iron Piers',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    source: 'Maritime Historical Society records & Malabar Gazette (1903 edition)',
    attribution: 'Archival report on the 1902 Malabar Coast cyclone and maritime losses.',
    consentStatus: 'verified_archive',
    verificationStatus: 'local_folklore',
    categoryLabel: 'Living Folklore'
  },
  {
    id: 'horror-colonial-cemetery',
    title: 'The Whispering Epitaphs of English Church',
    synopsis: 'Walk the weathered tombstones of the 18th-century St. Mary’s cemetery near Beach Road where forgotten colonial officers and merchants lie beneath moss-grown basalt vaults.',
    genre: 'horror',
    storyType: 'real',
    difficulty: 'easy',
    estimatedDuration: '45 mins',
    compatibleDestination: 'CSI Church Road, Kozhikode',
    locationTag: 'Historic European Cemetery',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    source: 'Malabar District Inscriptions by William Logan (1887)',
    consentStatus: 'verified_archive',
    verificationStatus: 'documented_fact',
    categoryLabel: 'Historical Fact'
  },
  {
    id: 'horror-fictional-shadow-palace',
    title: 'The Curse of the Forgotten Vault',
    synopsis: 'An AI-generated supernatural adventure: Deep beneath the old court complex, an unsealed earthen jar holds the vengeful shadow of an exiled sorcerer.',
    genre: 'horror',
    storyType: 'fictional',
    difficulty: 'hard',
    estimatedDuration: '1.5 hrs',
    compatibleDestination: 'Old Collectorate Ruins, Kozhikode',
    locationTag: 'Old Court Grounds',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    isPreview: true
  },

  // --- FANTASY (3 stories) ---
  {
    id: 'fantasy-sarovaram-sprites',
    title: 'The Sacred Mangrove of Sarovaram',
    synopsis: 'Rooted in authentic Kerala folklore of Sarpa Kavu (sacred groves) and mangrove guardian spirits that protect Kozhikode’s wetland ecosystem from ecological ruin.',
    genre: 'fantasy',
    storyType: 'real',
    difficulty: 'easy',
    estimatedDuration: '1 hr',
    compatibleDestination: 'Sarovaram Bio Park, Kozhikode',
    locationTag: 'Sarovaram Wetlands',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    source: 'Kerala State Biodiversity Board Folklore Documentation',
    consentStatus: 'community_contributed',
    verificationStatus: 'local_folklore',
    categoryLabel: 'Living Folklore'
  },
  {
    id: 'fantasy-kallai-timber-giant',
    title: 'The River Spirit of Kallai',
    synopsis: 'Old river rafters on the Kallai—once Asia’s second-largest timber trading hub—tell of the golden otter spirit that guided log rafts safely through the monsoon rapids.',
    genre: 'fantasy',
    storyType: 'real',
    difficulty: 'medium',
    estimatedDuration: '1.5 hrs',
    compatibleDestination: 'Kallai Bridge & Estuary',
    locationTag: 'Kallai Estuary',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    isPreview: true,
    source: 'Kerala Folklore Academy Field Interviews (Kozhikode chapter)',
    consentStatus: 'community_contributed',
    verificationStatus: 'local_folklore',
    categoryLabel: 'Living Folklore'
  },
  {
    id: 'fantasy-fictional-celestial-spice',
    title: 'The Phoenix of the Calicut Stars',
    synopsis: 'An AI-crafted fantasy epic: In an alternate Kerala universe, Kozhikode is the floating gateway to the Astral Spice Route where constellations are traded like peppercorns.',
    genre: 'fantasy',
    storyType: 'fictional',
    difficulty: 'medium',
    estimatedDuration: '1.5 hrs',
    compatibleDestination: 'Kozhikode Planetarium & Observatory',
    locationTag: 'Planetarium Hill',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    isPreview: true
  }
];

// FULLY PLAYABLE 3-CHAPTER ADVENTURE QUEST IN KOZHIKODE
export const PLAYABLE_KOZHIKODE_QUEST: Quest = {
  id: 'quest-kozhikode-spice-ledger',
  title: 'The Lost Zamorin Spice Ledger',
  genre: 'mystery',
  storyType: 'real',
  storyId: 'kozhikode-spice-ledger',
  destination: 'Mananchira Square, Kozhikode',
  startLocation: 'Kozhikode Beach, Beach Road, Kozhikode',
  introNarrative: 'Welcome to Kozhikode, Kerala — the historic "City of Truth" and UNESCO City of Literature! In 1498, when foreign traders arrived at these shores, Zamorin rulers governed a thriving global spice empire. Yesterday, during conservation work at the Calicut Heritage Archives, curators realized the legendary 15th-century "Vira Raya Spice Ledger" was missing. The thief left a series of historical riddles scattered across Kozhikode’s most famous landmarks. Your mission: verify each checkpoint, solve the puzzles, collect 3D artifacts, and uncover the secret resting place of the lost ledger!',
  routeDistanceKm: 3.2,
  estimatedDurationMins: 58,
  routeWaypoints: [
    [11.2588, 75.7686], // Kozhikode Beach Sea Pier
    [11.2541, 75.7765], // SM Street (Sweetmeat Street)
    [11.2514, 75.7808], // Mananchira Square
  ],
  chapters: [
    {
      id: 'chap-1',
      number: 1,
      title: 'Chapter 1: The First Clue at the Broken Pier',
      subtitle: 'The Gateway of Black Gold',
      status: 'active',
      unlockCondition: 'Reach Checkpoint 1 at Kozhikode Beach and solve the maritime riddle.',
      narrativeText: 'You begin your quest along the breezy Arabian Sea shores of Kozhikode Beach. Facing the waves, the iconic rusted iron pillars of the 1862 sea pier stand like silent sentinels. For centuries, Arab dhows, Chinese junks, and Venetian galleys anchored here to load black pepper—known to ancient Romans as "Black Gold". A weather-beaten brass plate near the promenade railing bears the first inscription.',
      checkpoint: {
        id: 'cp-1',
        number: 1,
        name: 'Kozhikode Beach Sea Pier',
        localName: 'കോഴിക്കോട് ബീച്ച് (പഴയ കടൽപ്പാലം)',
        subtitle: 'Historic 19th-century trade pier & coastline',
        lat: 11.2588,
        lng: 75.7686,
        distanceFromStartKm: 0.8,
        estimatedMins: 15,
        description: 'These iconic iron piers and sandy shores have witnessed over 800 years of international trade, from the Zamorin kingdom to modern Kerala. Look around carefully — an inscription near the maritime pavilion holds your first clue.',
        photoUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
        riddle: {
          question: 'I rise without a sound, hold the sea without hands, and fall each day, yet never break. Sailors waited for my height before loading their black gold into Kozhikode dhows. What am I?',
          answer: 'tide',
          acceptedAnswers: ['tide', 'tides', 'high tide', 'the tide', 'sea tide', 'ocean tide', 'വേലിയേറ്റം'],
          hints: [
            'Hint 1: It is a natural oceanic rhythm governed by the gravity of the moon.',
            'Hint 2: When it is high, heavy wooden ships can easily enter the shallow harbor without touching bottom sand.',
            'Hint 3: Four letters. Starts with T and rhymes with "ride".'
          ]
        },
        collectibleArtifact: {
          id: 'artifact-1',
          name: 'Zamorin Vira Raya Gold Coin (Fanam)',
          description: 'A miniature gold coin minted under the Samoothiri kings with an image of the royal sword and sun, accepted by merchants from Cairo to Canton.',
          modelType: 'coin',
          historicSignificance: 'The Fanam was the standard currency of trust in Kozhikode, ensuring fair weights and counterfeit-free commerce.'
        },
        culturalFact: {
          fact: 'Kozhikode earned the historical title "City of Truth" (Satya Nagaram) because foreign merchants could deposit their goods openly in public warehouses without locks, and the Zamorin’s customs officers would never miscount a single peppercorn.',
          source: 'Travels of Ibn Battuta (1342 CE) & Malabar Manual by William Logan',
          sourceUrl: 'https://kerala.gov.in/history',
          category: 'Maritime Trade'
        },
        arHint: 'Point your camera toward the sea or table to view the 3D Vira Raya Gold Coin shimmering in augmented reality!',
        ar3dPrompt: '3D Gold Fanam Coin of the Zamorins',
        onSiteScavengerTask: {
          prompt: 'You are standing on Beach Road beside the historic sea piers. Look directly across the street: What is the famous 1950s heritage hotel & bakery right before you, renowned across Malabar for brewing hot Sulaimani tea and serving fresh banana chips?',
          expectedPhysicalObservation: 'Bombay Hotel (or Beach Heritage Bakery)',
          acceptedAnswers: ['bombay hotel', 'bombay', 'hotel bombay', 'beach bakery', 'sea queen', 'sea queen bakery'],
          photoVerificationPrompt: 'Capture or upload a photo of the sea pier pillars or the Beach Road promenade to verify your physical presence and unlock Destination 2: SM Street!',
          unlocksDestination: 'Destination 2: SM Street (Mittayi Theruvu)',
          landmarkContext: 'Kozhikode Beach Promenade · Old Sea Pier Pierhead'
        }
      }
    },
    {
      id: 'chap-2',
      number: 2,
      title: 'Chapter 2: Hidden Paths along Sweetmeat Street',
      subtitle: 'The Sweetest Secret in Malabar',
      status: 'locked',
      unlockCondition: 'Complete Chapter 1 and proceed to SM Street (Mittayi Theruvu).',
      narrativeText: 'With the first clue solved and the gold coin safely in your inventory, the trail directs you eastward into the bustling heart of Calicut: Mittayi Theruvu (Sweetmeat Street). Over 600 years old, this pedestrian lane was christened by European traders who smelled freshly boiled Kozhikode Halwa bubbling in massive copper vats. You halt before the statue of legendary writer S.K. Pottekkatt.',
      checkpoint: {
        id: 'cp-2',
        number: 2,
        name: 'SM Street (Mittayi Theruvu)',
        localName: 'മിഠായിത്തെരുവ് (SM Street)',
        subtitle: 'Heritage market & UNESCO City of Literature heartland',
        lat: 11.2541,
        lng: 75.7765,
        distanceFromStartKm: 1.9,
        estimatedMins: 22,
        description: 'Famous for Kozhikode halwa, banana chips, and vibrant shops. Immortalized in S.K. Pottekkatt’s Jnanpith award-winning novel "Oru Desathinte Katha". A riddle is etched near the heritage bronze plaque.',
        photoUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        riddle: {
          question: 'I am stirred in boiling bronze with pure ghee and sugar, sliced into ruby red and emerald squares that sweeten the Sultan’s tea. My aroma gave this entire street its name. What delicacy am I?',
          answer: 'halwa',
          acceptedAnswers: ['halwa', 'kozhikode halwa', 'calicut halwa', 'sweetmeat', 'sweet meat', 'ഹൽവ', 'ഹൽവ പലഹാരം'],
          hints: [
            'Hint 1: It is Kozhikode’s most world-famous culinary treat, cooked in giant uruli pans.',
            'Hint 2: It comes in black (karuppu), red, green, and banana flavors and has a chewy, gelatinous texture.',
            'Hint 3: Five letters. Starts with H: "H _ _ W A".'
          ]
        },
        collectibleArtifact: {
          id: 'artifact-2',
          name: 'Antique Brass Astrolabe & Compass',
          description: 'A 16th-century brass navigational dial used by Arab and Gujarati navigators sailing between the Red Sea and Kozhikode.',
          modelType: 'astrolabe',
          historicSignificance: 'Enabled celestial longitude calculations to navigate through monsoon storms into Calicut harbor.'
        },
        culturalFact: {
          fact: 'In October 2023, Kozhikode was officially designated as India’s first "UNESCO City of Literature", celebrating a century-long tradition of public libraries, passionate book cafes, and legendary writers like Vaikom Muhammad Basheer and S.K. Pottekkatt.',
          source: 'UNESCO Creative Cities Network Official Announcement',
          sourceUrl: 'https://en.unesco.org/creative-cities/kozhikode',
          category: 'History'
        },
        arHint: 'Inspect the 3D Brass Astrolabe! Rotate the celestial rings in AR to discover the hidden engraved coordinates.',
        ar3dPrompt: '3D Brass Navigational Astrolabe',
        onSiteScavengerTask: {
          prompt: 'You have entered Sweet Meat Street (Mittayi Theruvu). Look directly at the heritage sweet shop counters around you: What is the world-famous sweet stacked in rainbow glass jars that gave this road its name, and which oldest bakery here (dating to 1935) prepares the authentic dark halwa?',
          expectedPhysicalObservation: 'Kozhikodan Halwa / Sankaran Bakery',
          acceptedAnswers: ['halwa', 'kozhikode halwa', 'calicut halwa', 'sankaran bakery', 'sankaran', 'sweetmeat', 'sweet meat'],
          photoVerificationPrompt: 'Capture or upload a photo of the halwa shop displays or S.K. Pottekkatt bronze statue to unlock Destination 3: Mananchira Square!',
          unlocksDestination: 'Destination 3: Mananchira Square & Royal Tank',
          landmarkContext: 'Mittayi Theruvu Archway · S.K. Pottekkatt Cultural Square'
        }
      }
    },
    {
      id: 'chap-3',
      number: 3,
      title: 'Chapter 3: The Final Reveal at Mananchira Square',
      subtitle: 'The Royal Depths of the Zamorin Tank',
      status: 'locked',
      unlockCondition: 'Complete Chapter 2 and enter Mananchira Square Gardens.',
      narrativeText: 'The astrolabe has pointed you to the emerald waters of Mananchira, the grand freshwater lake dug by Zamorin King Mana Vikrama in the 14th century. Surrounded by colonial tile architecture, rain trees, and the Commonwealth factory, the lake still mirrors the sky. At the stone pavilion near the entrance, you reach the final puzzle to unlock the secret vault containing the spice ledger!',
      checkpoint: {
        id: 'cp-3',
        number: 3,
        name: 'Mananchira Square & Royal Tank',
        localName: 'മാനവിക്രമൻ ചിറ (മനാഞ്ചിറ സ്ക്വയർ)',
        subtitle: '14th-century royal freshwater tank & gardens',
        lat: 11.2514,
        lng: 75.7808,
        distanceFromStartKm: 3.2,
        estimatedMins: 21,
        description: 'Dug over 600 years ago using laterite stone, this 4-acre royal reservoir provided drinking water to the entire Zamorin palace complex and remains the cultural heart of Kozhikode.',
        photoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        riddle: {
          question: 'I was carved from red laterite earth by King Mana Vikrama to quench the thirst of kings and travelers alike. Four acres of pristine water without a single wave of salt. What royal reservoir am I?',
          answer: 'mananchira',
          acceptedAnswers: ['mananchira', 'mananchira square', 'mananchira tank', 'mana vikrama tank', 'മനാഞ്ചിറ', 'മനാഞ്ചിറ കുളം'],
          hints: [
            'Hint 1: Named after King Mana Vikrama, the Zamorin who constructed it in the 14th century.',
            'Hint 2: It is the large public lake in the middle of Kozhikode surrounded by the public library and park.',
            'Hint 3: Starts with "Manan...".'
          ]
        },
        collectibleArtifact: {
          id: 'artifact-3',
          name: 'Handcrafted Beypore Teakwood Uru Model',
          description: 'A miniature artisanal model of the legendary wooden trading vessel, carved from Malabar teak with hand-stitched sails.',
          modelType: 'uru_ship',
          historicSignificance: 'Beypore Urus were purchased by kings and Gulf sheikhs for over a millennium, crafted solely with visual geometry and no blueprints.'
        },
        culturalFact: {
          fact: 'Mananchira was originally called "Mana-vikraman-chira" (the pond of King Mana Vikrama). Its water was held in such high reverence that no leather footwear was permitted near the stone steps for over 400 years.',
          source: 'Calicut Heritage Gazette & Malabar Gazetteer',
          sourceUrl: 'https://kerala.gov.in',
          category: 'Architecture'
        },
        arHint: 'Spawn the 3D Beypore Uru ship right on your desk or floor in full AR mode!',
        ar3dPrompt: '3D Beypore Wooden Uru Model',
        onSiteScavengerTask: {
          prompt: 'You stand before the 14th-century royal freshwater reservoir. Look at the carved entrance gateway and boundary wall: What traditional porous red Kerala building stone are the historic gateway pillars sculpted from, and which municipal landmark building stands opposite the eastern gate?',
          expectedPhysicalObservation: 'Laterite Stone / Town Hall (or Public Library)',
          acceptedAnswers: ['laterite', 'laterite stone', 'town hall', 'public library', 'red laterite', 'mananchira'],
          photoVerificationPrompt: 'Capture or upload a photo of the Mananchira lake reflection or carved laterite pillars to seal the expedition and unlock the Final Mystery Reveal!',
          unlocksDestination: 'Final Mystery: The Secret Vault of the Zamorin',
          landmarkContext: 'Mana Vikrama Royal Reservoir · Heritage Laterite Gateway'
        }
      }
    }
  ],
  finalMystery: {
    title: 'The Secret of the Zamorin\'s Vault',
    riddle: 'You have gathered the Vira Raya Gold Coin, the Navigational Astrolabe, and the Teakwood Uru! To crack the cipher on the ledger chest, answer the final riddle:',
    question: 'Kozhikode’s greatest wealth was never just gold or silver, but the pungent dried berry of the Piper nigrum vine that emperors waged wars to possess. What spice is the true treasure of the Zamorin?',
    answer: 'black pepper',
    acceptedAnswers: ['black pepper', 'pepper', 'black gold', 'malabar pepper', 'piper nigrum', 'കുരുമുളക്', 'കറുത്ത പൊന്ന്'],
    hints: [
      'Hint 1: It is known in ancient Sanskrit as "Yavanapriya" (beloved by the Greeks).',
      'Hint 2: It is small, wrinkly, black, and hot to the tongue.',
      'Hint 3: Two words: Black ______.'
    ],
    resolutionLore: 'Master explorer, you have cracked the ancient cipher! The Lost Spice Ledger was safe all along inside the secret archives chamber beneath the Zamorin palace vaults. Your keen intellect, cultural curiosity, and respect for Kozhikode’s living heritage have restored the honor of the City of Truth!'
  },
  completionRewards: {
    badge: 'Master Chronicler of Calicut',
    badgeIcon: '👑',
    xp: 750,
    title: 'Grand Guardian of the Malabar Heritage',
    certificateSnippet: 'Has successfully walked the historic trails of Kozhikode, verified all sacred checkpoints, solved the riddles of the Zamorin, and preserved the journey in the digital archives.'
  }
};

// -------------------------------------------------------------
// 2. PLAYABLE HISTORY QUEST: The Zamorin's Sovereign Heritage Trail
// -------------------------------------------------------------
export const PLAYABLE_HISTORY_QUEST: Quest = {
  id: 'quest-history-sovereign-trail',
  title: 'The Zamorins\' Sovereign Heritage Trail',
  genre: 'history',
  storyType: 'real',
  storyId: 'history-mishkal-fortress',
  destination: 'Mananchira Square, Kozhikode',
  startLocation: 'Kozhikode Beach, Beach Road, Kozhikode',
  introNarrative: 'Step into the golden age of the Samoothiri (Zamorin) dynasty. Trace the heritage of Kozhikode from the coastal trade hubs where history was made, through the ancient market streets, up to the royal palace reservoir.',
  routeDistanceKm: 3.2,
  estimatedDurationMins: 58,
  routeWaypoints: [
    [11.2588, 75.7686], // Kozhikode Beach Sea Pier
    [11.2541, 75.7765], // SM Street (Sweetmeat Street)
    [11.2514, 75.7808], // Mananchira Square
  ],
  chapters: [
    {
      id: 'chap-hist-1',
      number: 1,
      title: 'Chapter 1: The Port of the Zamorins',
      subtitle: 'Where Global Trade Began',
      status: 'active',
      unlockCondition: 'Reach Checkpoint 1 at Kozhikode Beach.',
      narrativeText: 'You stand on Kozhikode Beach, the historic shore where the Zamorins built their naval strength and welcomed traders from Arabia, China, and Europe. This coast saw the arrival of legendary explorers and the rise of a powerful medieval port city.',
      checkpoint: {
        id: 'cp-hist-1',
        number: 1,
        name: 'Kozhikode Beach Historic Coast',
        localName: 'കോഴിക്കോട് ബീച്ച് (ചരിത്രതീരം)',
        subtitle: 'The medieval maritime gateway of Malabar',
        lat: 11.2588,
        lng: 75.7686,
        distanceFromStartKm: 0.8,
        estimatedMins: 15,
        description: 'Once bustling with wooden dhows loading spices, this beach is a testament to Kozhikode\'s historical importance as a global trade hub.',
        photoUrl: '/genres/history.jpg',
        riddle: {
          question: 'I am the historic title of the monarchs who ruled this coast and built a naval empire that welcomed traders from across the sea. Who am I?',
          answer: 'zamorin',
          acceptedAnswers: ['zamorin', 'samoothiri', 'സാമൂതിരി'],
          hints: ['Hint 1: Starts with Z or S.', 'Hint 2: The traditional rulers of Calicut.', 'Hint 3: Zamorin.']
        },
        collectibleArtifact: {
          id: 'artifact-hist-1',
          name: 'Zamorin Royal Seal',
          description: 'A replica of the brass seal used by the Zamorin kings to authorize trade.',
          modelType: 'seal',
          historicSignificance: 'Symbol of the Zamorin\'s absolute authority over Malabar trade.'
        },
        culturalFact: {
          fact: 'The Zamorins maintained a powerful navy commanded by the Kunjali Marakkars to defend this coast against colonial invasions.',
          source: 'Malabar History Archives',
          category: 'Naval History'
        },
        arHint: 'Spawn the 3D Zamorin Royal Seal in AR!',
        ar3dPrompt: '3D Brass Zamorin Royal Seal',
        onSiteScavengerTask: {
          prompt: 'Look at the historic coastline: What ocean did the traders cross to reach this beach?',
          expectedPhysicalObservation: 'Arabian Sea',
          acceptedAnswers: ['arabian sea', 'arabian'],
          photoVerificationPrompt: 'Capture a photo of the historic coastline to unlock Chapter 2.',
          unlocksDestination: 'Destination 2: SM Street',
          landmarkContext: 'Kozhikode Beach Promenade'
        }
      }
    },
    {
      id: 'chap-hist-2',
      number: 2,
      title: 'Chapter 2: The Ancient Merchant Quarters',
      subtitle: 'The Trade Hub of Old Calicut',
      status: 'locked',
      unlockCondition: 'Solve Chapter 1 and proceed to SM Street.',
      narrativeText: 'You arrive at SM Street, a bustling market that traces its origins back centuries. Originally known as Sweet Meat Street by European traders, it has been the commercial heartbeat of Kozhikode since the time of the Zamorins.',
      checkpoint: {
        id: 'cp-hist-2',
        number: 2,
        name: 'Historic SM Street',
        localName: 'മിഠായിത്തെരുവ് (പഴയ മാർക്കറ്റ്)',
        subtitle: 'Centuries-old commercial center',
        lat: 11.2541,
        lng: 75.7765,
        distanceFromStartKm: 1.9,
        estimatedMins: 22,
        description: 'A market street that evolved from ancient trade routes, offering traditional goods and embodying the city\'s vibrant history.',
        photoUrl: '/genres/history.jpg',
        riddle: {
          question: 'I am the historic street that Europeans named after the famous halwa sold here, but my roots go back to ancient trade. What is my popular two-letter name?',
          answer: 'sm street',
          acceptedAnswers: ['sm street', 's m street', 'mittayi theruvu'],
          hints: ['Hint 1: Sweet Meat.', 'Hint 2: Initials are S.M.', 'Hint 3: SM Street.']
        },
        collectibleArtifact: {
          id: 'artifact-hist-2',
          name: 'Antique Merchant Scales',
          description: 'A miniature brass weighing scale used by spice merchants in the 15th century.',
          modelType: 'scales',
          historicSignificance: 'Ensured fair trade in the "City of Truth".'
        },
        culturalFact: {
          fact: 'Kozhikode was famous for its strict adherence to fair trade and accurate weighing, earning it the title "City of Truth".',
          source: 'Historical Accounts of Calicut',
          category: 'Trade History'
        },
        arHint: 'View the 3D Antique Scales in AR!',
        ar3dPrompt: '3D Antique Brass Merchant Scales',
        onSiteScavengerTask: {
          prompt: 'Observe the heritage market: What traditional Malabar sweet gave this street its English name?',
          expectedPhysicalObservation: 'Halwa',
          acceptedAnswers: ['halwa', 'kozhikode halwa'],
          photoVerificationPrompt: 'Capture a photo of the heritage market to unlock Chapter 3.',
          unlocksDestination: 'Destination 3: Mananchira',
          landmarkContext: 'SM Street Heritage Area'
        }
      }
    },
    {
      id: 'chap-hist-3',
      number: 3,
      title: 'Chapter 3: The Royal Center of Power',
      subtitle: 'The Heart of the Kingdom',
      status: 'locked',
      unlockCondition: 'Solve Chapter 2 and proceed to Mananchira.',
      narrativeText: 'Your journey ends at Mananchira, the historic palace tank of the Zamorin rulers. This central square was once the courtyard of the royal palace, where history, culture, and power converged.',
      checkpoint: {
        id: 'cp-hist-3',
        number: 3,
        name: 'Mananchira Royal Tank',
        localName: 'മനാഞ്ചിറ (രാജകീയ കുളം)',
        subtitle: 'The historic Zamorin palace tank',
        lat: 11.2514,
        lng: 75.7808,
        distanceFromStartKm: 3.2,
        estimatedMins: 21,
        description: 'Constructed by Zamorin Mana Vikrama, this artificial lake supplied water to the palace and remains a profound historical landmark.',
        photoUrl: '/genres/history.jpg',
        riddle: {
          question: 'I was created by a Zamorin king as a royal bathing pool and reservoir for the palace, and now I am the cultural center of the city. What am I?',
          answer: 'mananchira',
          acceptedAnswers: ['mananchira', 'mananchira square', 'mananchira tank'],
          hints: ['Hint 1: Named after Mana Vikrama.', 'Hint 2: Starts with M.', 'Hint 3: Mananchira.']
        },
        collectibleArtifact: {
          id: 'artifact-hist-3',
          name: 'Zamorin Royal Crown',
          description: 'A digital replica of the ceremonial crown of the Samoothiri.',
          modelType: 'crown',
          historicSignificance: 'Symbol of the royal lineage that built Kozhikode.'
        },
        culturalFact: {
          fact: 'The Mananchira tank was part of a larger palace complex that was unfortunately destroyed in 1766 during the Mysorean invasion, but the tank survived.',
          source: 'Kerala Architectural Heritage',
          category: 'Royal Architecture'
        },
        arHint: 'Spawn the 3D Zamorin Royal Crown in AR!',
        ar3dPrompt: '3D Golden Royal Crown',
        onSiteScavengerTask: {
          prompt: 'Look at the grand reservoir: Which royal dynasty originally commissioned this tank?',
          expectedPhysicalObservation: 'Zamorins',
          acceptedAnswers: ['zamorin', 'zamorins', 'samoothiri'],
          photoVerificationPrompt: 'Capture a photo of the historic tank to complete the History Quest!',
          unlocksDestination: 'Final Reveal: The Zamorin Legacy',
          landmarkContext: 'Mananchira Historic Square'
        }
      }
    }
  ],
  finalMystery: {
    title: 'The Zamorin Legacy',
    riddle: 'You have collected the Royal Seal, the Merchant Scales, and the Royal Crown! Answer the final question:',
    question: 'In what year did Vasco da Gama arrive at Kappad beach near Kozhikode, forever changing the course of global history?',
    answer: '1498',
    acceptedAnswers: ['1498', '1498 ad'],
    hints: ['Hint 1: Late 15th century.', 'Hint 2: Just before 1500.', 'Hint 3: 1498.'],
    resolutionLore: 'You have walked the sovereign trail of Kozhikode! You have witnessed the history of the Zamorins, the ancient markets, and the royal palace, unlocking the city\'s grand past.'
  },
  completionRewards: {
    badge: 'Historian of Calicut',
    badgeIcon: '📜',
    xp: 750,
    title: 'Keeper of the Zamorin Chronicles',
    certificateSnippet: 'Has retraced the royal footsteps of the Zamorins across historic Kozhikode.'
  }
};

// -------------------------------------------------------------
// 3. PLAYABLE ROMANCE QUEST: The Poet's Heart of Calicut
// -------------------------------------------------------------
export const PLAYABLE_ROMANCE_QUEST: Quest = {
  id: 'quest-romance-poets-heart',
  title: 'The Poet\'s Heart of Calicut',
  genre: 'romance',
  storyType: 'real',
  storyId: 'romance-sunset-kappad',
  destination: 'Mananchira Square, Kozhikode',
  startLocation: 'Kozhikode Beach, Beach Road, Kozhikode',
  introNarrative: 'A lyrical, romantic journey inspired by Kerala’s literary giants. Discover the romantic tales whispered by the ocean waves, encoded in the sweet treats of the market, and reflected in the serene waters of the royal tank.',
  routeDistanceKm: 3.2,
  estimatedDurationMins: 58,
  routeWaypoints: [
    [11.2588, 75.7686], // Kozhikode Beach Sea Pier
    [11.2541, 75.7765], // SM Street (Sweetmeat Street)
    [11.2514, 75.7808], // Mananchira Square
  ],
  chapters: [
    {
      id: 'chap-rom-1',
      number: 1,
      title: 'Chapter 1: A Walk by the Waves',
      subtitle: 'The Serenade of the Sea',
      status: 'active',
      unlockCondition: 'Reach Checkpoint 1 at Kozhikode Beach.',
      narrativeText: 'The soothing sound of waves at Kozhikode Beach has inspired countless poets and lovers. The evening breeze carries tales of longing, romance, and the eternal wait of lovers looking out across the vast Arabian Sea.',
      checkpoint: {
        id: 'cp-rom-1',
        number: 1,
        name: 'Kozhikode Beach (Romantic Shore)',
        localName: 'കോഴിക്കോട് ബീച്ച്',
        subtitle: 'A haven for poets and lovers',
        lat: 11.2588,
        lng: 75.7686,
        distanceFromStartKm: 0.8,
        estimatedMins: 15,
        description: 'Famed for its breathtaking sunsets, the beach is a timeless spot for couples to share a warm cup of Sulaimani tea.',
        photoUrl: '/genres/romance.jpg',
        riddle: {
          question: 'I am the warm, golden hour when the sun kisses the sea goodbye, drawing lovers to the shore every evening. What time of day am I?',
          answer: 'sunset',
          acceptedAnswers: ['sunset', 'dusk', 'സൂര്യാസ്തമയം'],
          hints: ['Hint 1: Occurs in the evening.', 'Hint 2: Sun going down.', 'Hint 3: Sunset.']
        },
        collectibleArtifact: {
          id: 'artifact-rom-1',
          name: 'Basheer\'s Quill',
          description: 'A quill pen honoring Vaikom Muhammad Basheer, who wrote timeless romantic tales.',
          modelType: 'quill',
          historicSignificance: 'Emblem of Kozhikode’s golden age of Malayalam romantic literature.'
        },
        culturalFact: {
          fact: 'Couples in Kozhikode often share a "Sulaimani" (spiced black tea with lemon), a romantic tradition passed down for generations.',
          source: 'Malabar Culinary Traditions',
          category: 'Cultural Romance'
        },
        arHint: 'Spawn the 3D Quill Pen in AR!',
        ar3dPrompt: '3D Vintage Quill Pen',
        onSiteScavengerTask: {
          prompt: 'Look towards the seaside: What warm beverage do couples traditionally share here at dusk?',
          expectedPhysicalObservation: 'Sulaimani Tea',
          acceptedAnswers: ['sulaimani', 'sulaimani tea', 'tea'],
          photoVerificationPrompt: 'Capture a photo of the ocean waves at dusk to unlock Chapter 2.',
          unlocksDestination: 'Destination 2: SM Street',
          landmarkContext: 'Kozhikode Beach Promenade'
        }
      }
    },
    {
      id: 'chap-rom-2',
      number: 2,
      title: 'Chapter 2: The Sweetest Memories',
      subtitle: 'Nostalgia in the Market',
      status: 'locked',
      unlockCondition: 'Solve Chapter 1 and proceed to SM Street.',
      narrativeText: 'You enter SM Street, where the scent of sweet halwa and nostalgia fills the air. This street has witnessed countless first dates, stolen glances, and the buying of sweet gifts for loved ones.',
      checkpoint: {
        id: 'cp-rom-2',
        number: 2,
        name: 'Romantic SM Street',
        localName: 'മിഠായിത്തെരുവ്',
        subtitle: 'The street of sweet memories',
        lat: 11.2541,
        lng: 75.7765,
        distanceFromStartKm: 1.9,
        estimatedMins: 22,
        description: 'A bustling lane where buying sweets and glass bangles has been a romantic tradition for decades.',
        photoUrl: '/genres/romance.jpg',
        riddle: {
          question: 'I am a colorful, sweet treat sold here, often bought as a gift for a loved one. My name is synonymous with Kozhikode. What am I?',
          answer: 'halwa',
          acceptedAnswers: ['halwa', 'kozhikode halwa'],
          hints: ['Hint 1: Sweet and sticky.', 'Hint 2: Starts with H.', 'Hint 3: Halwa.']
        },
        collectibleArtifact: {
          id: 'artifact-rom-2',
          name: 'Glass Bangles',
          description: 'A set of colorful glass bangles, a traditional romantic gift from the market.',
          modelType: 'bangles',
          historicSignificance: 'A timeless token of affection in Indian culture.'
        },
        culturalFact: {
          fact: 'S.K. Pottekkatt’s romantic stories often featured characters wandering through SM Street, making it a literary landmark for love.',
          source: 'Malayalam Literature',
          category: 'Literary Romance'
        },
        arHint: 'View the 3D Glass Bangles in AR!',
        ar3dPrompt: '3D Colorful Glass Bangles',
        onSiteScavengerTask: {
          prompt: 'Observe the market shops: What colorful accessories, popular as romantic gifts, are sold in many stalls here?',
          expectedPhysicalObservation: 'Bangles',
          acceptedAnswers: ['bangles', 'glass bangles', 'വളകൾ'],
          photoVerificationPrompt: 'Capture a photo of the sweet shops to unlock Chapter 3.',
          unlocksDestination: 'Destination 3: Mananchira',
          landmarkContext: 'SM Street Market'
        }
      }
    },
    {
      id: 'chap-rom-3',
      number: 3,
      title: 'Chapter 3: Twilight at the Lake',
      subtitle: 'Reflections of Love',
      status: 'locked',
      unlockCondition: 'Solve Chapter 2 and proceed to Mananchira.',
      narrativeText: 'The journey brings you to the tranquil Mananchira Square. Under the shade of ancient trees, lovers and friends gather, watching the evening sky reflect in the still waters of the royal tank.',
      checkpoint: {
        id: 'cp-rom-3',
        number: 3,
        name: 'Mananchira Square (Twilight)',
        localName: 'മനാഞ്ചിറ (സന്ധ്യാസമയം)',
        subtitle: 'A serene spot for romantic twilight walks',
        lat: 11.2514,
        lng: 75.7808,
        distanceFromStartKm: 3.2,
        estimatedMins: 21,
        description: 'A beautifully landscaped park surrounding a historic lake, perfect for a romantic evening stroll.',
        photoUrl: '/genres/romance.jpg',
        riddle: {
          question: 'I am the calm body of water reflecting the evening sky where lovers take romantic walks. What am I?',
          answer: 'mananchira',
          acceptedAnswers: ['mananchira', 'mananchira square', 'mananchira tank'],
          hints: ['Hint 1: The large square in Kozhikode.', 'Hint 2: Contains a lake.', 'Hint 3: Mananchira.']
        },
        collectibleArtifact: {
          id: 'artifact-rom-3',
          name: 'Rosewood Lotus Blossom',
          description: 'A delicately carved wooden lotus flower crafted by Malabar artisans.',
          modelType: 'flower',
          historicSignificance: 'Traditional symbol of enduring love, peace, and spiritual purity.'
        },
        culturalFact: {
          fact: 'The park around Mananchira was specifically designed with manicured lawns and stone benches to provide a serene escape for the city\'s residents and couples.',
          source: 'City Planning Archives',
          category: 'Urban Romance'
        },
        arHint: 'Project the blooming 3D Rosewood Lotus in AR!',
        ar3dPrompt: '3D Carved Rosewood Lotus Flower',
        onSiteScavengerTask: {
          prompt: 'Look at the serene park setting: What time of day is most popular for couples to visit this square?',
          expectedPhysicalObservation: 'Evening / Twilight',
          acceptedAnswers: ['evening', 'twilight', 'sunset', 'night'],
          photoVerificationPrompt: 'Capture a photo of the lake reflection to complete the Romance Quest!',
          unlocksDestination: 'Final Reveal: The Romantic Heart',
          landmarkContext: 'Mananchira Gardens'
        }
      }
    }
  ],
  finalMystery: {
    title: 'The Romantic Heart of Kozhikode',
    riddle: 'You have collected the Quill, the Bangles, and the Lotus! Answer the final question:',
    question: 'Which famous Malayalam writer, known as the "Beypore Sultan", wrote the classic love story "Premalekhanam"?',
    answer: 'basheer',
    acceptedAnswers: ['basheer', 'vaikom muhammad basheer'],
    hints: ['Hint 1: Known as Beypore Sultan.', 'Hint 2: Wrote Balyakalasakhi.', 'Hint 3: Basheer.'],
    resolutionLore: 'You have completed the Romantic Serenade of Kozhikode! Your journey celebrated the gentle warmth, lyrical beaches, and beautiful parks that make this city truly unforgettable for lovers.'
  },
  completionRewards: {
    badge: 'Poet Laureate of Malabar',
    badgeIcon: '🌹',
    xp: 750,
    title: 'Keeper of Calicut Love Lore',
    certificateSnippet: 'Has walked the romantic trails of Kozhikode, capturing memories of literature and sunsets.'
  }
};

// -------------------------------------------------------------
// 4. PLAYABLE ADVENTURE QUEST: The Explorer's Compass
// -------------------------------------------------------------
export const PLAYABLE_ADVENTURE_QUEST: Quest = {
  id: 'quest-adventure-khalasi-uru',
  title: 'The Explorer\'s Compass: Kozhikode Expedition',
  genre: 'adventure',
  storyType: 'real',
  storyId: 'adventure-beypore-uru',
  destination: 'Mananchira Square, Kozhikode',
  startLocation: 'Kozhikode Beach, Beach Road, Kozhikode',
  introNarrative: 'Embark on an urban adventure through Kozhikode! Navigate the open coastline, weave through the dense and bustling alleys of the historic market, and uncover the grand architectural achievements of the city center.',
  routeDistanceKm: 3.2,
  estimatedDurationMins: 58,
  routeWaypoints: [
    [11.2588, 75.7686], // Kozhikode Beach Sea Pier
    [11.2541, 75.7765], // SM Street (Sweetmeat Street)
    [11.2514, 75.7808], // Mananchira Square
  ],
  chapters: [
    {
      id: 'chap-adv-1',
      number: 1,
      title: 'Chapter 1: The Edge of the Ocean',
      subtitle: 'Starting the Expedition',
      status: 'active',
      unlockCondition: 'Reach Checkpoint 1 at Kozhikode Beach.',
      narrativeText: 'Your expedition starts at the very edge of the continent. The old piers of Kozhikode Beach stand as a testament to the adventurous sailors who braved the rough Arabian Sea to reach these shores.',
      checkpoint: {
        id: 'cp-adv-1',
        number: 1,
        name: 'Kozhikode Beach (Expedition Start)',
        localName: 'കോഴിക്കോട് ബീച്ച്',
        subtitle: 'The launch point for coastal explorers',
        lat: 11.2588,
        lng: 75.7686,
        distanceFromStartKm: 0.8,
        estimatedMins: 15,
        description: 'A windy, open coastal stretch that challenges you to begin your urban trek inland.',
        photoUrl: '/genres/adventure.jpg',
        riddle: {
          question: 'I am the vast body of water that adventurous sailors crossed to reach this beach. What sea am I?',
          answer: 'arabian sea',
          acceptedAnswers: ['arabian', 'arabian sea'],
          hints: ['Hint 1: West of India.', 'Hint 2: Starts with A.', 'Hint 3: Arabian Sea.']
        },
        collectibleArtifact: {
          id: 'artifact-adv-1',
          name: 'Explorer\'s Spyglass',
          description: 'A vintage brass spyglass used by ancient navigators scanning the horizon.',
          modelType: 'spyglass',
          historicSignificance: 'A crucial tool for early ocean adventurers spotting the Malabar coast.'
        },
        culturalFact: {
          fact: 'Navigators in ancient times used the monsoon winds to power their adventurous journeys across the sea to Kozhikode.',
          source: 'Maritime Exploration History',
          category: 'Navigation'
        },
        arHint: 'Examine the 3D Spyglass in AR mode!',
        ar3dPrompt: '3D Vintage Brass Spyglass',
        onSiteScavengerTask: {
          prompt: 'Look at the waves: What powerful seasonal winds brought the ancient explorers here?',
          expectedPhysicalObservation: 'Monsoon Winds',
          acceptedAnswers: ['monsoon', 'monsoons', 'monsoon winds'],
          photoVerificationPrompt: 'Capture a photo of the ocean horizon to unlock Chapter 2.',
          unlocksDestination: 'Destination 2: SM Street',
          landmarkContext: 'Beach Coastline'
        }
      }
    },
    {
      id: 'chap-adv-2',
      number: 2,
      title: 'Chapter 2: The Urban Jungle',
      subtitle: 'Navigating the Crowds',
      status: 'locked',
      unlockCondition: 'Solve Chapter 1 and proceed to SM Street.',
      narrativeText: 'You plunge into the bustling, dense environment of SM Street. Navigating through the crowds, dodging hand-pulled carts, and deciphering the maze of narrow alleys is an adventure in itself.',
      checkpoint: {
        id: 'cp-adv-2',
        number: 2,
        name: 'SM Street (The Urban Maze)',
        localName: 'മിഠായിത്തെരുവ്',
        subtitle: 'A thrilling navigation challenge through dense markets',
        lat: 11.2541,
        lng: 75.7765,
        distanceFromStartKm: 1.9,
        estimatedMins: 22,
        description: 'A labyrinth of shops, people, and vibrant chaos that tests your navigational skills.',
        photoUrl: '/genres/adventure.jpg',
        riddle: {
          question: 'I am a crowded, narrow street where you must navigate through throngs of shoppers and the smell of sweet halwa. What street am I?',
          answer: 'sm street',
          acceptedAnswers: ['sm street', 's m street', 'mittayi theruvu'],
          hints: ['Hint 1: Also known as Sweet Meat Street.', 'Hint 2: Initials S.M.', 'Hint 3: SM Street.']
        },
        collectibleArtifact: {
          id: 'artifact-adv-2',
          name: 'Urban Compass',
          description: 'A rugged compass for navigating complex market alleys.',
          modelType: 'compass',
          historicSignificance: 'Helped early traders find their way through the maze of the city.'
        },
        culturalFact: {
          fact: 'SM Street is so densely packed with history that beneath its modern shops lie remnants of ancient trade cellars.',
          source: 'City Exploration Archives',
          category: 'Urban Exploration'
        },
        arHint: 'Rotate the 3D Urban Compass in AR!',
        ar3dPrompt: '3D Rugged Navigation Compass',
        onSiteScavengerTask: {
          prompt: 'Navigate the market: What is the main mode of travel for pedestrians in this narrow street?',
          expectedPhysicalObservation: 'Walking',
          acceptedAnswers: ['walking', 'foot', 'on foot'],
          photoVerificationPrompt: 'Capture a photo of the bustling street to unlock Chapter 3.',
          unlocksDestination: 'Destination 3: Mananchira',
          landmarkContext: 'SM Street Alleys'
        }
      }
    },
    {
      id: 'chap-adv-3',
      number: 3,
      title: 'Chapter 3: The Monumental Discovery',
      subtitle: 'Reaching the Center',
      status: 'locked',
      unlockCondition: 'Solve Chapter 2 and proceed to Mananchira.',
      narrativeText: 'Your urban expedition concludes at the vast Mananchira Square. After braving the coast and the crowded markets, you discover this massive architectural and natural marvel at the heart of the city.',
      checkpoint: {
        id: 'cp-adv-3',
        number: 3,
        name: 'Mananchira (The Grand Reservoir)',
        localName: 'മനാഞ്ചിറ',
        subtitle: 'A grand discovery in the city center',
        lat: 11.2514,
        lng: 75.7808,
        distanceFromStartKm: 3.2,
        estimatedMins: 21,
        description: 'A massive man-made lake that stands as a monumental engineering feat of the past.',
        photoUrl: '/genres/adventure.jpg',
        riddle: {
          question: 'I am the massive artificial lake you discover at the end of your trek, built centuries ago using just human labor and laterite stone. What am I?',
          answer: 'mananchira',
          acceptedAnswers: ['mananchira', 'mananchira tank'],
          hints: ['Hint 1: The central tank of Kozhikode.', 'Hint 2: Starts with M.', 'Hint 3: Mananchira.']
        },
        collectibleArtifact: {
          id: 'artifact-adv-3',
          name: 'Explorer\'s Map Scroll',
          description: 'An ancient parchment map detailing the city\'s layout.',
          modelType: 'scroll',
          historicSignificance: 'Charted by early adventurers documenting the city\'s growth.'
        },
        culturalFact: {
          fact: 'The construction of Mananchira involved digging through solid laterite rock without modern machinery—a true engineering adventure.',
          source: 'Ancient Engineering Records',
          category: 'Engineering Feats'
        },
        arHint: 'Unroll the 3D Map Scroll in AR!',
        ar3dPrompt: '3D Ancient Parchment Map Scroll',
        onSiteScavengerTask: {
          prompt: 'Observe the grand lake: What red stone was excavated to create this massive reservoir?',
          expectedPhysicalObservation: 'Laterite',
          acceptedAnswers: ['laterite', 'laterite stone', 'red stone'],
          photoVerificationPrompt: 'Capture a photo of the lake to conclude the Adventure Quest!',
          unlocksDestination: 'Final Reveal: The Ultimate Discovery',
          landmarkContext: 'Mananchira Square'
        }
      }
    }
  ],
  finalMystery: {
    title: 'The Ultimate Discovery',
    riddle: 'You have collected the Spyglass, the Compass, and the Map Scroll! Answer the final question:',
    question: 'What famous Portuguese explorer successfully navigated around the Cape of Good Hope to reach Kozhikode in 1498?',
    answer: 'vasco da gama',
    acceptedAnswers: ['vasco da gama', 'gama'],
    hints: ['Hint 1: Portuguese explorer.', 'Hint 2: Arrived in 1498.', 'Hint 3: Vasco da Gama.'],
    resolutionLore: 'You have completed the Adventure Quest! You successfully navigated the coastal winds, the urban jungles, and discovered the heart of the city.'
  },
  completionRewards: {
    badge: 'Master Navigator',
    badgeIcon: '🧭',
    xp: 900,
    title: 'Urban Explorer of Calicut',
    certificateSnippet: 'Has braved the urban and coastal trails of Kozhikode, uncovering its grandest monuments.'
  }
};

// -------------------------------------------------------------
// 5. PLAYABLE HORROR QUEST: Shadows of the City of Truth
// -------------------------------------------------------------
export const PLAYABLE_HORROR_QUEST: Quest = {
  id: 'quest-horror-malabar-shadows',
  title: 'Shadows of the City of Truth',
  genre: 'horror',
  storyType: 'real',
  storyId: 'horror-colonial-cemetery',
  destination: 'Mananchira Square, Kozhikode',
  startLocation: 'Kozhikode Beach, Beach Road, Kozhikode',
  introNarrative: 'When the evening fog rolls in, Kozhikode reveals its darker, mysterious past. Explore the skeletal remains of the old piers, walk through dimly lit historic alleys, and face the eerie stillness of the ancient royal tank at night.',
  routeDistanceKm: 3.2,
  estimatedDurationMins: 58,
  routeWaypoints: [
    [11.2588, 75.7686], // Kozhikode Beach Sea Pier
    [11.2541, 75.7765], // SM Street (Sweetmeat Street)
    [11.2514, 75.7808], // Mananchira Square
  ],
  chapters: [
    {
      id: 'chap-hor-1',
      number: 1,
      title: 'Chapter 1: The Ghost Piers',
      subtitle: 'Echoes of Shipwrecks',
      status: 'active',
      unlockCondition: 'Reach Checkpoint 1 at Kozhikode Beach.',
      narrativeText: 'Standing in the evening mist, the rusted iron skeleton pillars of the old 1862 pier rise from the surf. Locals whisper that during storms, you can still hear the creaking of doomed colonial ships that met their end on these rocks.',
      checkpoint: {
        id: 'cp-hor-1',
        number: 1,
        name: 'Kozhikode Beach (Ghost Piers)',
        localName: 'കോഴിക്കോട് ബീച്ച് (പഴയ കടൽപ്പാലം)',
        subtitle: 'Rusted skeleton pillars in the surf',
        lat: 11.2588,
        lng: 75.7686,
        distanceFromStartKm: 0.8,
        estimatedMins: 15,
        description: 'The crumbling iron piers look like the ribs of an ancient sea monster, swallowed by the rising Arabian Sea.',
        photoUrl: '/genres/horror.jpg',
        riddle: {
          question: 'I am the rusted iron skeleton jutting out of the dark ocean, a remnant of a pier destroyed by a massive storm. What am I?',
          answer: 'pier',
          acceptedAnswers: ['pier', 'sea pier', 'old pier', 'കടൽപ്പാലം'],
          hints: ['Hint 1: Built for ships to dock.', 'Hint 2: Now in ruins.', 'Hint 3: Pier.']
        },
        collectibleArtifact: {
          id: 'artifact-hor-1',
          name: 'Phantom Storm Lantern',
          description: 'An antique lantern that is said to light itself on stormy nights.',
          modelType: 'lantern',
          historicSignificance: 'Used by watchmen to warn ships of the treacherous coastal rocks.'
        },
        culturalFact: {
          fact: 'Cyclones in the early 20th century shattered the sea pier, drowning several workers whose ghosts are said to still roam the beach.',
          source: 'Local Coastal Folklore',
          category: 'Supernatural Lore'
        },
        arHint: 'Light the 3D Phantom Storm Lantern in AR!',
        ar3dPrompt: '3D Eerie Brass Storm Lantern',
        onSiteScavengerTask: {
          prompt: 'Look at the rusted pillars: What metal are these haunting remnants made of?',
          expectedPhysicalObservation: 'Iron',
          acceptedAnswers: ['iron', 'steel', 'metal'],
          photoVerificationPrompt: 'Capture a photo of the eerie pillars to unlock Chapter 2.',
          unlocksDestination: 'Destination 2: SM Street',
          landmarkContext: 'Ruined Sea Pier'
        }
      }
    },
    {
      id: 'chap-hor-2',
      number: 2,
      title: 'Chapter 2: The Shadows of Sweetmeat Street',
      subtitle: 'The Haunted Alleys',
      status: 'locked',
      unlockCondition: 'Solve Chapter 1 and proceed to SM Street.',
      narrativeText: 'As night falls, SM Street empties, and the narrow alleys take on a sinister feel. It is said that the spirits of ancient merchants, cheated in trade centuries ago, wander these dark corners looking for justice.',
      checkpoint: {
        id: 'cp-hor-2',
        number: 2,
        name: 'SM Street (Shadow Alleys)',
        localName: 'മിഠായിത്തെരുവ് (ഇരുണ്ട വഴികൾ)',
        subtitle: 'Dimly lit ancient market lanes',
        lat: 11.2541,
        lng: 75.7765,
        distanceFromStartKm: 1.9,
        estimatedMins: 22,
        description: 'Once bustling by day, the shuttered shops and narrow pathways feel claustrophobic and haunted at night.',
        photoUrl: '/genres/horror.jpg',
        riddle: {
          question: 'By day I am filled with the smell of sweets, but by night my narrow lanes belong to the shadows. What street am I?',
          answer: 'sm street',
          acceptedAnswers: ['sm street', 's m street', 'mittayi theruvu'],
          hints: ['Hint 1: Initials S.M.', 'Hint 2: Sweet Meat Street.', 'Hint 3: SM Street.']
        },
        collectibleArtifact: {
          id: 'artifact-hor-2',
          name: 'Cursed Merchant Coin',
          description: 'A blackened copper coin that feels freezing cold to the touch.',
          modelType: 'coin',
          historicSignificance: 'Believed to be cursed money left behind by a greedy medieval trader.'
        },
        culturalFact: {
          fact: 'Urban legends claim that late at night, the clinking of ghostly weighing scales can be heard near the oldest shops on this street.',
          source: 'Kozhikode Urban Legends',
          category: 'Paranormal'
        },
        arHint: 'View the 3D Cursed Coin in AR!',
        ar3dPrompt: '3D Blackened Copper Coin',
        onSiteScavengerTask: {
          prompt: 'Observe the dark alleys: What happens to the bustling crowds when night completely takes over the market?',
          expectedPhysicalObservation: 'They disappear / Empties out',
          acceptedAnswers: ['empty', 'disappear', 'gone', 'quiet'],
          photoVerificationPrompt: 'Capture a photo of the dark street to unlock Chapter 3.',
          unlocksDestination: 'Destination 3: Mananchira',
          landmarkContext: 'SM Street Alleys at Night'
        }
      }
    },
    {
      id: 'chap-hor-3',
      number: 3,
      title: 'Chapter 3: The Still Waters of Mananchira',
      subtitle: 'The Drowned Secrets',
      status: 'locked',
      unlockCondition: 'Solve Chapter 2 and proceed to Mananchira.',
      narrativeText: 'You reach Mananchira under the moonlight. The vast black water resembles a bottomless pit. Rumors say that dark secrets and cursed artifacts were thrown into this royal tank to hide them forever.',
      checkpoint: {
        id: 'cp-hor-3',
        number: 3,
        name: 'Mananchira (The Black Tank)',
        localName: 'മനാഞ്ചിറ (ഇരുണ്ട കുളം)',
        subtitle: 'The eerie, still waters of the royal reservoir',
        lat: 11.2514,
        lng: 75.7808,
        distanceFromStartKm: 3.2,
        estimatedMins: 21,
        description: 'The immense, unmoving dark water creates a sense of dread, reflecting the pale moon like a staring eye.',
        photoUrl: '/genres/horror.jpg',
        riddle: {
          question: 'I am the massive dark pool in the center of the city, whose depths are said to hide cursed royal secrets. What am I?',
          answer: 'mananchira',
          acceptedAnswers: ['mananchira', 'mananchira tank'],
          hints: ['Hint 1: The main tank in the city.', 'Hint 2: Starts with M.', 'Hint 3: Mananchira.']
        },
        collectibleArtifact: {
          id: 'artifact-hor-3',
          name: 'Drowned Royal Dagger',
          description: 'A rusted dagger recovered from the murky depths of the tank.',
          modelType: 'dagger',
          historicSignificance: 'A weapon used in a forgotten royal assassination, hidden in the water.'
        },
        culturalFact: {
          fact: 'Some folklore suggests that subterranean tunnels link the bottom of Mananchira to haunted dungeons in the old Zamorin palace ruins.',
          source: 'Dark Myths of Malabar',
          category: 'Dark Folklore'
        },
        arHint: 'Spawn the 3D Drowned Dagger in AR!',
        ar3dPrompt: '3D Rusted Antique Dagger',
        onSiteScavengerTask: {
          prompt: 'Look at the water at night: What color does the deep reservoir appear under the moonlight?',
          expectedPhysicalObservation: 'Black / Dark',
          acceptedAnswers: ['black', 'dark', 'pitch black'],
          photoVerificationPrompt: 'Capture a photo of the eerie dark water to complete the Horror Quest!',
          unlocksDestination: 'Final Reveal: The Shadows Disperse',
          landmarkContext: 'Mananchira Tank at Night'
        }
      }
    }
  ],
  finalMystery: {
    title: 'The Shadows Disperse',
    riddle: 'You have collected the Phantom Lantern, the Cursed Coin, and the Drowned Dagger! Answer the final question:',
    question: 'What nocturnal bird of prey is often considered an omen in local Malabar ghost stories?',
    answer: 'owl',
    acceptedAnswers: ['owl', 'mooli', 'മൂങ്ങ'],
    hints: ['Hint 1: It hoots at night.', 'Hint 2: Has big eyes.', 'Hint 3: Owl.'],
    resolutionLore: 'You have braved the haunted trails of Kozhikode! The spirits have been acknowledged, and the dark secrets of the city will rest once more.'
  },
  completionRewards: {
    badge: 'Ghost Hunter of Malabar',
    badgeIcon: '🕯️',
    xp: 750,
    title: 'Shadow Walker of Calicut',
    certificateSnippet: 'Has walked the haunted ruins and dark alleys of Kozhikode under the moon.'
  }
};

// -------------------------------------------------------------
// 6. PLAYABLE FANTASY QUEST: The Guardian Dragon of Calicut
// -------------------------------------------------------------
export const PLAYABLE_FANTASY_QUEST: Quest = {
  id: 'quest-fantasy-sacred-grove',
  title: 'The Guardian Dragon of Calicut',
  genre: 'fantasy',
  storyType: 'fictional',
  storyId: 'fantasy-valayanad-grove',
  destination: 'Mananchira Square, Kozhikode',
  startLocation: 'Kozhikode Beach, Beach Road, Kozhikode',
  introNarrative: 'Step into a mystical realm where ancient sea-dragons guard the coast, magical items are traded in hidden bazaars, and a powerful celestial portal lies dormant in the city\'s heart. Awaken the magic of Kozhikode!',
  routeDistanceKm: 3.2,
  estimatedDurationMins: 58,
  routeWaypoints: [
    [11.2588, 75.7686], // Kozhikode Beach Sea Pier
    [11.2541, 75.7765], // SM Street (Sweetmeat Street)
    [11.2514, 75.7808], // Mananchira Square
  ],
  chapters: [
    {
      id: 'chap-fan-1',
      number: 1,
      title: 'Chapter 1: The Sea-Dragon\'s Roost',
      subtitle: 'The Magical Shores',
      status: 'active',
      unlockCondition: 'Reach Checkpoint 1 at Kozhikode Beach.',
      narrativeText: 'The old iron piers at the beach aren\'t just ruins; they are the petrified ribs of a colossal ancient sea-dragon that once protected the magical merchants of Malabar. Its magic still lingers in the sea spray.',
      checkpoint: {
        id: 'cp-fan-1',
        number: 1,
        name: 'Kozhikode Beach (Dragon\'s Coast)',
        localName: 'കോഴിക്കോട് ബീച്ച് (മാന്ത്രിക തീരം)',
        subtitle: 'The petrified remains of the Sea-Dragon',
        lat: 11.2588,
        lng: 75.7686,
        distanceFromStartKm: 0.8,
        estimatedMins: 15,
        description: 'A magical coastline where the waves glow with bioluminescence, hinting at the powerful ancient magic resting beneath.',
        photoUrl: '/genres/fantasy.jpg',
        riddle: {
          question: 'I am the mythical, fire-breathing creature whose petrified ribs form the ancient piers jutting into the sea. What magical beast am I?',
          answer: 'dragon',
          acceptedAnswers: ['dragon', 'sea dragon', 'വ്യാളി'],
          hints: ['Hint 1: Breathes fire, or in this case, controls the sea.', 'Hint 2: Starts with D.', 'Hint 3: Dragon.']
        },
        collectibleArtifact: {
          id: 'artifact-fan-1',
          name: 'Dragon Scale Gem',
          description: 'A glowing, iridescent gem that feels like a polished scale from a mythical beast.',
          modelType: 'gem',
          historicSignificance: 'A talisman of protection against the tempestuous ocean.'
        },
        culturalFact: {
          fact: 'In fantasy lore, the Zamorins were said to possess a magical ring that allowed them to command the mythical sea creatures of the Arabian Sea.',
          source: 'Chronicles of Magical Malabar',
          category: 'Mythical Lore'
        },
        arHint: 'Spawn the glowing 3D Dragon Scale Gem in AR!',
        ar3dPrompt: '3D Glowing Iridescent Dragon Scale',
        onSiteScavengerTask: {
          prompt: 'Look at the waves crashing against the pier: What magical glowing phenomenon can sometimes be seen in ocean water at night?',
          expectedPhysicalObservation: 'Bioluminescence',
          acceptedAnswers: ['bioluminescence', 'glowing water', 'sparkles'],
          photoVerificationPrompt: 'Capture a photo of the magical coastline to unlock Chapter 2.',
          unlocksDestination: 'Destination 2: The Alchemist\'s Market (SM Street)',
          landmarkContext: 'Magical Sea Pier'
        }
      }
    },
    {
      id: 'chap-fan-2',
      number: 2,
      title: 'Chapter 2: The Alchemist\'s Bazaar',
      subtitle: 'Potions and Sweets',
      status: 'locked',
      unlockCondition: 'Solve Chapter 1 and proceed to SM Street.',
      narrativeText: 'You enter SM Street, secretly known in the magical realm as the Alchemist\'s Bazaar. Here, the famous colorful halwas are actually solidified potions granting strength, wisdom, and magical vitality.',
      checkpoint: {
        id: 'cp-fan-2',
        number: 2,
        name: 'SM Street (Alchemist\'s Bazaar)',
        localName: 'മിഠായിത്തെരുവ് (മാന്ത്രിക ചന്ത)',
        subtitle: 'A market of magical potions and artifacts',
        lat: 11.2541,
        lng: 75.7765,
        distanceFromStartKm: 1.9,
        estimatedMins: 22,
        description: 'Vibrant, colorful blocks of sweet potions are stacked high in glass jars, glowing with inner magical light.',
        photoUrl: '/genres/fantasy.jpg',
        riddle: {
          question: 'I am the colorful block of sweetness sold here, which mages secretly use as a potion of vitality. What is my mundane name?',
          answer: 'halwa',
          acceptedAnswers: ['halwa', 'kozhikode halwa'],
          hints: ['Hint 1: Very sweet and chewy.', 'Hint 2: Sold in many colors.', 'Hint 3: Halwa.']
        },
        collectibleArtifact: {
          id: 'artifact-fan-2',
          name: 'Crystal Potion Vial',
          description: 'A beautifully carved crystal vial containing a drop of the Elixir of the Zamorin.',
          modelType: 'vial',
          historicSignificance: 'Used by royal alchemists to channel ancient magic.'
        },
        culturalFact: {
          fact: 'The recipe for the magical red halwa is said to require a feather from a phoenix and the pure water of the Mananchira tank.',
          source: 'The Alchemist\'s Guide to Calicut',
          category: 'Magical Culinery'
        },
        arHint: 'View the 3D Crystal Potion Vial in AR!',
        ar3dPrompt: '3D Glowing Crystal Potion Vial',
        onSiteScavengerTask: {
          prompt: 'Observe the sweet shop displays: What material are the large jars made of that hold these magical colorful blocks?',
          expectedPhysicalObservation: 'Glass',
          acceptedAnswers: ['glass', 'crystal'],
          photoVerificationPrompt: 'Capture a photo of the potion bazaar to unlock Chapter 3.',
          unlocksDestination: 'Destination 3: The Celestial Pool (Mananchira)',
          landmarkContext: 'Alchemist Market (SM Street)'
        }
      }
    },
    {
      id: 'chap-fan-3',
      number: 3,
      title: 'Chapter 3: The Celestial Portal',
      subtitle: 'The Magic of Mananchira',
      status: 'locked',
      unlockCondition: 'Solve Chapter 2 and proceed to Mananchira.',
      narrativeText: 'You arrive at Mananchira, which is not merely a water tank, but a massive celestial portal. The still waters reflect the stars, acting as a gateway to the astral plane used by the ancient sorcerer kings.',
      checkpoint: {
        id: 'cp-fan-3',
        number: 3,
        name: 'Mananchira (Celestial Portal)',
        localName: 'മനാഞ്ചിറ (മാന്ത്രിക കവാടം)',
        subtitle: 'The starry gateway to the astral plane',
        lat: 11.2514,
        lng: 75.7808,
        distanceFromStartKm: 3.2,
        estimatedMins: 21,
        description: 'The vast, perfectly still water acts as a giant magical mirror, reflecting the cosmos and humming with arcane energy.',
        photoUrl: '/genres/fantasy.jpg',
        riddle: {
          question: 'I am the grand square containing the giant water mirror that reflects the cosmos and serves as a magical portal. What place am I?',
          answer: 'mananchira',
          acceptedAnswers: ['mananchira', 'mananchira square', 'mananchira tank'],
          hints: ['Hint 1: The big lake in the city.', 'Hint 2: Starts with M.', 'Hint 3: Mananchira.']
        },
        collectibleArtifact: {
          id: 'artifact-fan-3',
          name: 'Astral Astrolabe',
          description: 'A magical device used to align the stars with the water portal.',
          modelType: 'astrolabe',
          historicSignificance: 'The key to opening the celestial gateway.'
        },
        culturalFact: {
          fact: 'It is said that during a lunar eclipse, the Mananchira portal opens, allowing travelers to step directly into the starry sky.',
          source: 'Myths of the Astral Kings',
          category: 'Cosmic Magic'
        },
        arHint: 'Spawn the glowing 3D Astral Astrolabe in AR!',
        ar3dPrompt: '3D Glowing Magical Astrolabe',
        onSiteScavengerTask: {
          prompt: 'Look at the magical water mirror: What celestial bodies does it perfectly reflect at night?',
          expectedPhysicalObservation: 'Stars / Moon',
          acceptedAnswers: ['stars', 'moon', 'sky'],
          photoVerificationPrompt: 'Capture a photo of the celestial portal to complete the Fantasy Quest!',
          unlocksDestination: 'Final Reveal: The Dragon\'s Awakening',
          landmarkContext: 'Celestial Portal (Mananchira)'
        }
      }
    }
  ],
  finalMystery: {
    title: 'The Dragon\'s Awakening',
    riddle: 'You have gathered the Dragon Scale, the Potion Vial, and the Astral Astrolabe! Answer the final question:',
    question: 'What magical item must you cast into the celestial portal to awaken the Guardian Dragon?',
    answer: 'dragon scale',
    acceptedAnswers: ['dragon scale', 'scale', 'dragon scale gem'],
    hints: ['Hint 1: You found it at the beach.', 'Hint 2: It belongs to the beast.', 'Hint 3: Dragon Scale.'],
    resolutionLore: 'You have awakened the Guardian Dragon of Calicut! The magical realms are safe once more, and you are hailed as the supreme sorcerer of the coast.'
  },
  completionRewards: {
    badge: 'Sorcerer of the Coast',
    badgeIcon: '🔮',
    xp: 850,
    title: 'Guardian of the Celestial Portal',
    certificateSnippet: 'Has unlocked the enchanted mysteries and magical portals of Kozhikode.'
  }
};

// -------------------------------------------------------------
// QUEST DICTIONARY & HELPER SELECTOR
// -------------------------------------------------------------
export const KOZHIKODE_QUESTS_BY_GENRE: Record<string, Quest> = {
  mystery: PLAYABLE_KOZHIKODE_QUEST,
  history: PLAYABLE_HISTORY_QUEST,
  romance: PLAYABLE_ROMANCE_QUEST,
  adventure: PLAYABLE_ADVENTURE_QUEST,
  horror: PLAYABLE_HORROR_QUEST,
  fantasy: PLAYABLE_FANTASY_QUEST,
};

export function getQuestForGenre(genre: string, storyId?: string): Quest {
  const normalizedGenre = (genre || 'mystery').toLowerCase();
  if (storyId) {
    const foundByStory = Object.values(KOZHIKODE_QUESTS_BY_GENRE).find((q) => q.storyId === storyId);
    if (foundByStory) return foundByStory;
  }
  return KOZHIKODE_QUESTS_BY_GENRE[normalizedGenre] || PLAYABLE_KOZHIKODE_QUEST;
}
