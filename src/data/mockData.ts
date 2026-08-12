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

export const INITIAL_SONGS: Song[] = [];

export const INITIAL_PLAYLISTS: Playlist[] = [];

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

