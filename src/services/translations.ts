export type SupportedLanguage = 'en' | 'ml' | 'hi';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  step1Title: string;
  step1Subtitle: string;
  step2Title: string;
  step2Subtitle: string;
  step3Title: string;
  step3Subtitle: string;
  step4Title: string;
  step4Subtitle: string;
  step5Title: string;
  genreHistory: string;
  genreMystery: string;
  genreRomance: string;
  genreAdventure: string;
  genreHorror: string;
  genreFantasy: string;
  realStories: string;
  realStoriesDesc: string;
  fictionalStories: string;
  fictionalStoriesDesc: string;
  startLocation: string;
  destination: string;
  availableTime: string;
  travelMode: string;
  budgetTier: string;
  budgetFree: string;
  budgetAuto: string;
  budgetTour: string;
  walking: string;
  driving: string;
  startAdventure: string;
  hintsRemaining: string;
  solveRiddle: string;
  submitAnswer: string;
  scavengerTask: string;
  takePhoto: string;
  viewStorybook: string;
  freeTravelPass: string;
  passUnlockedMsg: string;
  points: string;
  languageSelect: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'Wanderlore',
    appTagline: 'Kozhikode UNESCO City of Literature Adventure',
    step1Title: 'Choose Your Genre 🍃',
    step1Subtitle: 'What kind of story are you in the mood for? Select a genre and let the adventure begin.',
    step2Title: 'Story Origin & Mode 📜',
    step2Subtitle: 'Choose between real historical archives or generative fictional mysteries.',
    step3Title: 'Select Your Expedition 🗺️',
    step3Subtitle: 'Explore verified Kozhikode historical narratives and community memoirs.',
    step4Title: 'Plan Your Route & Budget 📍',
    step4Subtitle: 'Enter your start location, destination, available time, and travel budget.',
    step5Title: 'Active Live Quest 🧭',
    genreHistory: 'History',
    genreMystery: 'Mystery',
    genreRomance: 'Romance',
    genreAdventure: 'Adventure',
    genreHorror: 'Horror',
    genreFantasy: 'Fantasy',
    realStories: 'Real Historical Stories',
    realStoriesDesc: 'Based on verified archives from the Zamorin kingdom, S.M. Street, and Kozhikode maritime heritage.',
    fictionalStories: 'Fictional AI Mysteries',
    fictionalStoriesDesc: 'Dynamic AI-crafted fictional mysteries woven across real-world Kozhikode landmarks.',
    startLocation: 'Starting Location',
    destination: 'Destination',
    availableTime: 'Available Time',
    travelMode: 'Travel Mode',
    budgetTier: 'Budget Tier',
    budgetFree: 'Free (₹0)',
    budgetAuto: 'Auto (₹50-100)',
    budgetTour: 'Tour (₹150+)',
    walking: 'Walking',
    driving: 'Driving',
    startAdventure: 'Generate Route & Begin Quest',
    hintsRemaining: 'Hints Available',
    solveRiddle: 'Solve Observation Riddle',
    submitAnswer: 'Verify Answer',
    scavengerTask: 'On-Site Physical Observation',
    takePhoto: 'Take On-Site Photo Proof',
    viewStorybook: 'View Journey Storybook',
    freeTravelPass: 'Free Travel Pass Wallet',
    passUnlockedMsg: 'Unlocked at 1,000 XP: 100% Free Travel Across Kozhikode!',
    points: 'XP Points',
    languageSelect: 'Language',
  },
  ml: {
    appName: 'വാണ്ടർലോർ',
    appTagline: 'കോഴിക്കോട് യുനെസ്‌കോ സാഹിത്യ നഗര പര്യവേക്ഷണം',
    step1Title: 'കഥാ വിഭാഗം തിരഞ്ഞെടുക്കുക 🍃',
    step1Subtitle: 'ഏത് തരത്തിലുള്ള അനുഭവമാണ് നിങ്ങൾ ആഗ്രഹിക്കുന്നത്? ഒരു വിഭാഗം തിരഞ്ഞെടുക്കൂ.',
    step2Title: 'കഥയുടെ സ്വഭാവം 📜',
    step2Subtitle: 'യഥാർത്ഥ ചരിത്ര രേഖകളോ ഭാവനാ രഹസ്യങ്ങളോ തിരഞ്ഞെടുക്കുക.',
    step3Title: 'യാത്രാ വഴി തിരഞ്ഞെടുക്കുക 🗺️',
    step3Subtitle: 'കോഴിക്കോടിന്റെ പ്രശസ്തമായ പൈതൃക കഥകളിലൂടെ സഞ്ചരിക്കൂ.',
    step4Title: 'വഴിയും ബജറ്റും ക്രമീകരിക്കുക 📍',
    step4Subtitle: 'തുടങ്ങുന്ന സ്ഥലം, ലക്ഷ്യസ്ഥാനം, സമയം, ബജറ്റ് എന്നിവ നൽകുക.',
    step5Title: 'തത്സമയ പര്യവേക്ഷണം 🧭',
    genreHistory: 'ചരിത്രം',
    genreMystery: 'രഹസ്യം',
    genreRomance: 'പ്രണയം',
    genreAdventure: 'സാഹസികത',
    genreHorror: 'ഭയം',
    genreFantasy: 'മാന്ത്രികം',
    realStories: 'യഥാർത്ഥ ചരിത്ര കഥകൾ',
    realStoriesDesc: 'സാമൂതിരി രാജവംശം, മിഠായി തെരുവ്, കടപ്പുറം എന്നിവയുടെ ചരിത്ര രേഖകൾ.',
    fictionalStories: 'ഭാവനാ കഥകൾ (AI)',
    fictionalStoriesDesc: 'യഥാർത്ഥ കോഴിക്കോട് സ്ഥലങ്ങളിൽ ഒരുക്കിയ അത്ഭുത രഹസ്യങ്ങൾ.',
    startLocation: 'തുടങ്ങുന്ന സ്ഥലം',
    destination: 'ലക്ഷ്യസ്ഥാനം',
    availableTime: 'ലഭ്യമായ സമയം',
    travelMode: 'യാത്രാ രീതി',
    budgetTier: 'ബജറ്റ് തരം',
    budgetFree: 'സൗജന്യം (₹0)',
    budgetAuto: 'ഓട്ടോ (₹50-100)',
    budgetTour: 'ടൂർ ബസ് (₹150+)',
    walking: 'നടത്തം',
    driving: 'വാഹനം',
    startAdventure: 'യാത്ര ആരംഭിക്കുക',
    hintsRemaining: 'സൂചനകൾ',
    solveRiddle: 'കടങ്കഥ പരിഹരിക്കുക',
    submitAnswer: 'ഉത്തരം നൽകുക',
    scavengerTask: 'സ്ഥലത്തെ നേരിട്ടുള്ള നിരീക്ഷണം',
    takePhoto: 'ഫോട്ടോ എടുക്കുക',
    viewStorybook: 'യാത്രാ പുസ്തകം കാണുക',
    freeTravelPass: 'സൗജന്യ യാത്രാ പാസ്',
    passUnlockedMsg: '1,000 XP നേടി: കോഴിക്കോട് മുഴുവൻ സൗജന്യ യാത്ര!',
    points: 'പോയിന്റുകൾ',
    languageSelect: 'ഭാഷ',
  },
  hi: {
    appName: 'वांडरलोर',
    appTagline: 'कोझिकोड यूनेस्को साहित्य नगरी एडवेंचर',
    step1Title: 'अपनी शैली चुनें 🍃',
    step1Subtitle: 'आप किस प्रकार की कहानी की खोज करना चाहते हैं? शैली चुनें और यात्रा शुरू करें।',
    step2Title: 'कहानी का प्रकार 📜',
    step2Subtitle: 'वास्तविक ऐतिहासिक अभिलेखागार या काल्पनिक रहस्यों में से चुनें।',
    step3Title: 'अपनी यात्रा चुनें 🗺️',
    step3Subtitle: 'कोझिकोड के प्रामाणिक इतिहास और स्थानीय संस्मरणों का अन्वेषण करें।',
    step4Title: 'मार्ग और बजट की योजना 📍',
    step4Subtitle: 'शुरुआती स्थान, गंतव्य, समय और यात्रा बजट दर्ज करें।',
    step5Title: 'सक्रिय खोज 🧭',
    genreHistory: 'इतिहास',
    genreMystery: 'रहस्य',
    genreRomance: 'रोमांस',
    genreAdventure: 'साहसिक कार्य',
    genreHorror: 'भय',
    genreFantasy: 'काल्पनिक',
    realStories: 'वास्तविक ऐतिहासिक कहानियां',
    realStoriesDesc: 'ज़मोरिन साम्राज्य, एस.एम. स्ट्रीट और कालीकट बंदरगाह के सत्यापित तथ्य।',
    fictionalStories: 'काल्पनिक AI रहस्य',
    fictionalStoriesDesc: 'वास्तविक कोझिकोड स्थलों पर बुने गए रोमांचक रहस्य।',
    startLocation: 'शुरुआती स्थान',
    destination: 'गंतव्य',
    availableTime: 'उपलब्ध समय',
    travelMode: 'यात्रा का साधन',
    budgetTier: 'बजट विकल्प',
    budgetFree: 'निःशुल्क (₹0)',
    budgetAuto: 'ऑटो (₹50-100)',
    budgetTour: 'टूर बस (₹150+)',
    walking: 'पैदल',
    driving: 'गाड़ी',
    startAdventure: 'मार्ग बनाएं और यात्रा शुरू करें',
    hintsRemaining: 'संकेत शेष',
    solveRiddle: 'पहेली सुलझाएं',
    submitAnswer: 'उत्तर सत्यापित करें',
    scavengerTask: 'प्रत्यक्ष स्थल अवलोकन',
    takePhoto: 'स्थल का फोटो लें',
    viewStorybook: 'यात्रा स्टोरीबुक देखें',
    freeTravelPass: 'मुफ़्त यात्रा पास वॉलेट',
    passUnlockedMsg: '1,000 XP प्राप्त: पूरे कोझिकोड में 100% मुफ़्त यात्रा!',
    points: 'अंक (XP)',
    languageSelect: 'भाषा',
  },
};
