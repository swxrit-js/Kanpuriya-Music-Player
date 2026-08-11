import { Song, Artist, Album, Playlist, GolaFlavour, GolaTopping, GolaContainer, GolaDecoration, GolaRecipe, Feedback, AnalyticsStats, BackgroundImage } from '../types';

export const INITIAL_FLAVOURS: GolaFlavour[] = [
  {
    id: 'kala_khatta',
    name: 'Kala Khatta',
    color: '#3B0764',
    secondaryColor: '#581C87',
    tasteNote: 'Tangy, Sweet & Nostalgic Jamun',
    sweetnessLevel: 4,
    description: 'The undisputed king of Desi Golas. Deep purple jamun syrup with black salt punch.',
    isAvailable: true,
    icon: '🍇',
    popularity: 98
  },
  {
    id: 'mango',
    name: 'Aam Panna / Mango',
    color: '#EAB308',
    secondaryColor: '#F59E0B',
    tasteNote: 'Ripe Alphonso & Raw Mango Twist',
    sweetnessLevel: 5,
    description: 'Juicy Alphonso sweetness blended with spicy cumin and mint splash.',
    isAvailable: true,
    icon: '🥭',
    popularity: 95
  },
  {
    id: 'strawberry',
    name: 'Mahabaleshwar Strawberry',
    color: '#EC4899',
    secondaryColor: '#BE185D',
    tasteNote: 'Lush Fresh Berry Delight',
    sweetnessLevel: 4,
    description: 'Bright red hill-fresh strawberry reduction with a smooth sweet finish.',
    isAvailable: true,
    icon: '🍓',
    popularity: 88
  },
  {
    id: 'blue_lagoon',
    name: 'Blue Lagoon',
    color: '#06B6D4',
    secondaryColor: '#0284C7',
    tasteNote: 'Ice Cold Citrus Splash',
    sweetnessLevel: 3,
    description: 'Electric turquoise citrus flavor that transports you straight to ocean waves.',
    isAvailable: true,
    icon: '🌊',
    popularity: 91
  },
  {
    id: 'orange',
    name: 'Nagpur Orange',
    color: '#F97316',
    secondaryColor: '#C2410C',
    tasteNote: 'Zesty Citrus Blast',
    sweetnessLevel: 4,
    description: 'Tangy sunshine citrus loaded with vitamin energy and zesty aroma.',
    isAvailable: true,
    icon: '🍊',
    popularity: 82
  },
  {
    id: 'rose',
    name: 'Gulab / Rose Syrup',
    color: '#F43F5E',
    secondaryColor: '#9F1239',
    tasteNote: 'Fragrant Mughal Royal Rose',
    sweetnessLevel: 5,
    description: 'Classic crimson Rooh-style rose extract infused with cardamom hints.',
    isAvailable: true,
    icon: '🌹',
    popularity: 85
  },
  {
    id: 'lemon',
    name: 'Shikanji Lime',
    color: '#84CC16',
    secondaryColor: '#4D7C0F',
    tasteNote: 'Spiced Mint & Lime Punch',
    sweetnessLevel: 2,
    description: 'Super refreshing roasted cumin, rock salt, and squeezed green lime.',
    isAvailable: true,
    icon: '🍋',
    popularity: 79
  },
  {
    id: 'pineapple',
    name: 'Ananas Punch',
    color: '#FACC15',
    secondaryColor: '#CA8A04',
    tasteNote: 'Tropical Sweet & Tart',
    sweetnessLevel: 4,
    description: 'Golden pineapple nectar with tropical notes and crushed mint.',
    isAvailable: true,
    icon: '🍍',
    popularity: 76
  },
  {
    id: 'green_apple',
    name: 'Kaccha Aam / Green Apple',
    color: '#22C55E',
    secondaryColor: '#15803D',
    tasteNote: 'Crisp & Sour Zing',
    sweetnessLevel: 3,
    description: 'Fiery green sour punch that tickles your tongue on every bite.',
    isAvailable: true,
    icon: '🍏',
    popularity: 80
  },
  {
    id: 'cola',
    name: 'Desi Cola',
    color: '#78350F',
    secondaryColor: '#451A03',
    tasteNote: 'Fizzy Masala Cola',
    sweetnessLevel: 4,
    description: 'Retro spiced street cola syrup with chaat masala magic.',
    isAvailable: true,
    icon: '🥤',
    popularity: 86
  },
  {
    id: 'litchi',
    name: 'Muzaffarpur Litchi',
    color: '#FCE7F3',
    secondaryColor: '#F472B6',
    tasteNote: 'Exotic Floral Sweetness',
    sweetnessLevel: 5,
    description: 'Silky smooth translucent floral litchi nectar.',
    isAvailable: true,
    icon: '🌸',
    popularity: 74
  },
  {
    id: 'guava',
    name: 'Peru / Chilli Guava',
    color: '#FB7185',
    secondaryColor: '#E11D48',
    tasteNote: 'Spiced Pink Guava',
    sweetnessLevel: 3,
    description: 'Pink guava syrup dusted with red chilli powder and rock salt.',
    isAvailable: true,
    icon: '🍈',
    popularity: 90
  }
];

export const INITIAL_TOPPINGS: GolaTopping[] = [
  {
    id: 'tutti_frutti',
    name: 'Colorful Tutti Frutti',
    color: '#F43F5E',
    type: 'candy',
    description: 'Chewy Candied Papaya Cubes in vivid colors.',
    isAvailable: true,
    icon: '🍬'
  },
  {
    id: 'jelly',
    name: 'Mango & Berry Jelly Cubes',
    color: '#10B981',
    type: 'jelly',
    description: 'Soft translucent jelly cubes that melt in mouth.',
    isAvailable: true,
    icon: '🍧'
  },
  {
    id: 'sprinkles',
    name: 'Rainbow Sprinkles',
    color: '#A855F7',
    type: 'crunch',
    description: 'Crunchy colorful sugar confetti.',
    isAvailable: true,
    icon: '✨'
  },
  {
    id: 'choco_chips',
    name: 'Dark Choco Chips',
    color: '#451A03',
    type: 'crunch',
    description: 'Rich Cocoa chips that add chocolatey crunch.',
    isAvailable: true,
    icon: '🍫'
  },
  {
    id: 'coconut',
    name: 'Shredded Coconut Flakes',
    color: '#F8FAFC',
    type: 'crunch',
    description: 'Toasted snowy coconut flakes for coastal flavor.',
    isAvailable: true,
    icon: '🥥'
  },
  {
    id: 'fresh_mint',
    name: 'Fresh Pudina Leaves',
    color: '#16A34A',
    type: 'fruit',
    description: 'Aromatic cool mint sprig.',
    isAvailable: true,
    icon: '🌿'
  },
  {
    id: 'glazed_cherry',
    name: 'Glazed Maraschino Cherry',
    color: '#DC2626',
    type: 'fruit',
    description: 'Classic glossy red cherry topper.',
    isAvailable: true,
    icon: '🍒'
  },
  {
    id: 'falooda',
    name: 'Falooda Vermicelli',
    color: '#FCD34D',
    type: 'jelly',
    description: 'Silky falooda noodles drizzled with rabri syrup.',
    isAvailable: true,
    icon: '🍜'
  },
  {
    id: 'silver_varak',
    name: 'Chandi Varak (Silver Leaf)',
    color: '#CBD5E1',
    type: 'candy',
    description: 'Edible pure silver foil for royal touch.',
    isAvailable: true,
    icon: '👑'
  }
];

export const INITIAL_CONTAINERS: GolaContainer[] = [
  {
    id: 'stick_traditional',
    name: 'Traditional Wooden Stick',
    type: 'stick_traditional',
    description: 'Classic handmade bamboo gola stick.',
    icon: '🥢'
  },
  {
    id: 'paper_cup',
    name: 'Desi Eco Paper Cup',
    type: 'paper_cup',
    description: 'Biodegradable printed cup with spoon.',
    icon: '🥤'
  },
  {
    id: 'glass',
    name: 'Crystal Soda Glass',
    type: 'glass',
    description: 'Tall heavy soda glass for layered slush.',
    icon: '🍷'
  },
  {
    id: 'steel_bowl',
    name: 'Retro Steel Katori',
    type: 'steel_bowl',
    description: 'Authentic Indian stainless steel bowl.',
    icon: '🥣'
  },
  {
    id: 'stick_colourful',
    name: 'Neon Party Stick',
    type: 'stick_colourful',
    description: 'Glow-in-the-dark colorful acrylic stick.',
    icon: '🥢'
  }
];

export const INITIAL_DECORATIONS: GolaDecoration[] = [
  {
    id: 'mini_umbrella',
    name: 'Cocktail Umbrella',
    type: 'umbrella',
    icon: '☂️'
  },
  {
    id: 'cherry_stem',
    name: 'Twin Cherries',
    type: 'cherry',
    icon: '🍒'
  },
  {
    id: 'mint_crown',
    name: 'Mint Crown',
    type: 'mint',
    icon: '🌿'
  },
  {
    id: 'desival_flag',
    name: 'Desi Tricolour Flag',
    type: 'candy_flag',
    icon: '🚩'
  },
  {
    id: 'spiral_straw',
    name: 'Twisty Neon Straw',
    type: 'straw',
    icon: '🧃'
  }
];

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song_1',
    title: 'Gola & Chai Highway',
    artist: 'Raju & The Streetbeats',
    album: 'Monsoon Nights Vol. 1',
    duration: 214,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
    genre: 'Desi Fusion',
    language: 'Hindi',
    mood: 'chill',
    lyrics: `(Intro - Sitar & Whistle)
NIGHT TIME PAR CHAI AUR GOLA
Mera dil tu aake khola
Highway ki hawa mein chill hai
Gola khake mood chill hai!

(Chorus)
Gaane suno, gola banao!
Kala khatta syrup giraao!
Doston ko bhi bulaao,
Bhai mood banao, mood banao!`,
    featured: true,
    trending: true,
    playsCount: 14200,
    likesCount: 3890
  },
  {
    id: 'song_2',
    title: 'Kala Khatta Groove',
    artist: 'DJ Desi Beats ft. Simran',
    album: 'Gola Party Anthems',
    duration: 188,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tropical-house-110008.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
    genre: 'Punjabi Pop',
    language: 'Punjabi',
    mood: 'party',
    lyrics: `Kala khatta vich thoda salt mila!
Bass bajao, speaker hilao!
Giddha pao kudiye,
Bhangra pao mundeo!

Gola thanda hai,
Te beat hot hai!
Sadda mood tight hai!`,
    featured: true,
    trending: true,
    playsCount: 28900,
    likesCount: 7120
  },
  {
    id: 'song_3',
    title: 'Baarish & Ice Sparkle',
    artist: 'Aarav Sharma',
    album: 'Dusk Melodies',
    duration: 245,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7f858.mp3?filename=acoustic-guitars-ambient-124488.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=60',
    genre: 'Acoustic Indie',
    language: 'Hindi',
    mood: 'romantic',
    lyrics: `Boondein giri hain sadak pe,
Dukaan pe hum baithe hain.
Ek hi gola do straw,
Bolo kya hum keh rahe hain...

Syrup ki mehek,
Tere baalon ki chhao,
Gaane suno, gola banao.`,
    featured: true,
    trending: false,
    playsCount: 9800,
    likesCount: 2450
  },
  {
    id: 'song_4',
    title: 'Raat Ki Chai & Rickshaw',
    artist: 'The Street Ghazal Club',
    album: 'Midnight Banter',
    duration: 270,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a816a7.mp3?filename=soft-rain-ambient-10515.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60',
    genre: 'Semi-Classical Ghazal',
    language: 'Hindi',
    mood: 'latenight',
    lyrics: `Raat gehri hai,
Sadak sunsaan hai.
Gola wale bhaiya ki dukaan hai.
Pichli yaadein pighal rahi hain...
Barf ki tarah.`,
    featured: false,
    trending: true,
    playsCount: 18400,
    likesCount: 4210
  },
  {
    id: 'song_5',
    title: 'Bhojpuri Blast (Barf Masala)',
    artist: 'Manoj & Gang',
    album: 'Purvanchal Express',
    duration: 195,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c3614d9b15.mp3?filename=energetic-indie-rock-126203.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60',
    genre: 'Bhojpuri Folk Electro',
    language: 'Bhojpuri',
    mood: 'party',
    lyrics: `Raja ho, Raja ho!
Aam panna gola laao!
Mirchi aur chatpata chhidkao!
Dholak baje ghana ghan,
Gola chuse man bhabhan!`,
    featured: true,
    trending: true,
    playsCount: 31200,
    likesCount: 9500
  },
  {
    id: 'song_6',
    title: 'Desert Echoes (Chilli Guava)',
    artist: 'Desert Nomads',
    album: 'Thar Folk Sessions',
    duration: 230,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92288.mp3?filename=folk-acoustic-115160.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60',
    genre: 'Rajasthani Folk',
    language: 'Rajasthani',
    mood: 'desivibes',
    lyrics: `Mhare hiwda mein naache mor,
Rebaria re mhara gola chor!
Mitha syrup, teekha swaad,
Aave yaad, aave yaad!`,
    featured: false,
    trending: false,
    playsCount: 8700,
    likesCount: 2100
  },
  {
    id: 'song_7',
    title: 'Hostel Room Midnight Maggi',
    artist: 'Backbenchers',
    album: 'Backbench Memories',
    duration: 205,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1e00.mp3?filename=upbeat-acoustic-111122.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?w=500&auto=format&fit=crop&q=60',
    genre: 'College Acoustic',
    language: 'Hindi',
    mood: 'nostalgia',
    lyrics: `Exams khatam hue hain aaj,
Sare dosto ka hai raaj.
Gola cart pe line lagi hai,
Life kitni chill lagi hai!`,
    featured: true,
    trending: false,
    playsCount: 16500,
    likesCount: 4900
  },
  {
    id: 'song_8',
    title: 'Haryanvi Dhaakad Ice',
    artist: 'Jaat & Swag',
    album: 'Dhaakad Beats',
    duration: 180,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_2c918381dd.mp3?filename=rock-beat-125866.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=60',
    genre: 'Haryanvi Hip Hop',
    language: 'Haryanvi',
    mood: 'workout',
    lyrics: `Gola khaave dhaakad chhori,
Syrup ki na ho koi chori!
Full power, no stress!
Aapan karega rock hard mess!`,
    featured: false,
    trending: true,
    playsCount: 22100,
    likesCount: 6800
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl_1',
    title: 'Hostel Nights & Late Talks',
    description: 'Perfect background tunes for post-exam late night chill sessions with golas and tea.',
    coverUrl: 'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?w=500&auto=format&fit=crop&q=60',
    isFeatured: true,
    songs: [INITIAL_SONGS[0], INITIAL_SONGS[3], INITIAL_SONGS[6]],
    createdBy: 'admin_1',
    createdByName: 'Desi Gola Master',
    isPublic: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'pl_2',
    title: 'Chai + Kala Khatta Vibe',
    description: 'A spicy mixture of tangy Kala Khatta beats and warm lo-fi instruments.',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
    isFeatured: true,
    songs: [INITIAL_SONGS[1], INITIAL_SONGS[4], INITIAL_SONGS[7]],
    createdBy: 'admin_1',
    createdByName: 'Desi Gola Master',
    isPublic: true,
    createdAt: '2026-08-05'
  },
  {
    id: 'pl_3',
    title: 'Highway Monsoon Drive',
    description: 'Long road trips, open windows, cool rain mist, and sweet strawberry gola.',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=60',
    isFeatured: true,
    songs: [INITIAL_SONGS[2], INITIAL_SONGS[5], INITIAL_SONGS[0]],
    createdBy: 'admin_1',
    createdByName: 'Desi Gola Master',
    isPublic: true,
    createdAt: '2026-08-08'
  }
];

export const INITIAL_GOLA_RECIPES: GolaRecipe[] = [
  {
    id: 'gola_1',
    name: 'Swarit Special Triple Blast',
    baseIce: 'crushed',
    flavours: [
      { flavourId: 'kala_khatta', quantity: 3 },
      { flavourId: 'mango', quantity: 2 },
      { flavourId: 'strawberry', quantity: 2 }
    ],
    toppings: ['tutti_frutti', 'sprinkles', 'glazed_cherry'],
    containerId: 'paper_cup',
    decorationId: 'mini_umbrella',
    songPlayedId: 'song_1',
    songPlayedTitle: 'Gola & Chai Highway',
    createdAt: '2026-08-10',
    createdBy: 'user_1',
    createdByName: 'Swarit Shukla',
    likes: 42
  },
  {
    id: 'gola_2',
    name: 'Blue Lagoon Electric Crunch',
    baseIce: 'fine',
    flavours: [
      { flavourId: 'blue_lagoon', quantity: 3 },
      { flavourId: 'lemon', quantity: 2 }
    ],
    toppings: ['jelly', 'coconut', 'fresh_mint'],
    containerId: 'glass',
    decorationId: 'spiral_straw',
    songPlayedId: 'song_2',
    songPlayedTitle: 'Kala Khatta Groove',
    createdAt: '2026-08-11',
    createdBy: 'user_2',
    createdByName: 'Priya Sharma',
    likes: 29
  }
];

export const INITIAL_FEEDBACK: Feedback[] = [
  {
    id: 'fb_1',
    category: 'general',
    rating: 5,
    message: 'Love the night street aesthetic! The music sync with the glowing gola is incredible.',
    userName: 'Aman V.',
    status: 'reviewed',
    createdAt: '2026-08-09'
  },
  {
    id: 'fb_2',
    category: 'flavour',
    rating: 5,
    message: 'Please add Rabri Falooda Malai gola flavour in next update!',
    userName: 'Sanya R.',
    status: 'pending',
    createdAt: '2026-08-10'
  }
];

export const INITIAL_ANALYTICS: AnalyticsStats = {
  totalUsers: 1240,
  activeUsers: 890,
  totalSongs: 8,
  totalPlaylists: 3,
  totalPlays: 48290,
  totalGolasCreated: 3410,
  averageRating: 4.9,
  topSongs: [
    { title: 'Bhojpuri Blast (Barf Masala)', artist: 'Manoj & Gang', plays: 31200 },
    { title: 'Kala Khatta Groove', artist: 'DJ Desi Beats', plays: 28900 },
    { title: 'Haryanvi Dhaakad Ice', artist: 'Jaat & Swag', plays: 22100 },
    { title: 'Raat Ki Chai & Rickshaw', artist: 'The Street Ghazal Club', plays: 18400 }
  ],
  topFlavours: [
    { name: 'Kala Khatta', count: 1840, color: '#3B0764' },
    { name: 'Aam Panna / Mango', count: 1420, color: '#EAB308' },
    { name: 'Blue Lagoon', count: 1100, color: '#06B6D4' },
    { name: 'Strawberry', count: 980, color: '#EC4899' },
    { name: 'Chilli Guava', count: 850, color: '#FB7185' }
  ],
  moodDistribution: [
    { mood: 'party', count: 42 },
    { mood: 'chill', count: 28 },
    { mood: 'romantic', count: 15 },
    { mood: 'latenight', count: 10 },
    { mood: 'desivibes', count: 5 }
  ]
};

export const INITIAL_BACKGROUND_IMAGES: BackgroundImage[] = [
  {
    id: 'bg_kanpur_central',
    title: 'Kanpur Central Station Dusk (Nostalgic Art)',
    url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1920&auto=format&fit=crop',
    createdAt: '2026-08-11',
    addedBy: 'Kanpuriya Admin'
  },
  {
    id: 'bg_street_stall',
    title: 'Kanpur Night Street Gola Stall',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920&auto=format&fit=crop',
    createdAt: '2026-08-11',
    addedBy: 'Kanpuriya Admin'
  },
  {
    id: 'bg_ganga_ghat',
    title: 'Ganga Ghat Twilight Lanterns',
    url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1920&auto=format&fit=crop',
    createdAt: '2026-08-11',
    addedBy: 'Kanpuriya Admin'
  },
  {
    id: 'bg_night_market',
    title: 'Desi Street Market & Warm Lights',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop',
    createdAt: '2026-08-11',
    addedBy: 'Kanpuriya Admin'
  },
  {
    id: 'bg_rickshaw_glow',
    title: 'Kanpur Chowk Rickshaw Dusk',
    url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1920&auto=format&fit=crop',
    createdAt: '2026-08-11',
    addedBy: 'Kanpuriya Admin'
  }
];

