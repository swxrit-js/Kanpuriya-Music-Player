export type MusicMood = 
  | 'party' 
  | 'chill' 
  | 'romantic' 
  | 'sad' 
  | 'workout' 
  | 'roadtrip' 
  | 'latenight' 
  | 'nostalgia' 
  | 'desivibes';

export type MusicLanguage = 
  | 'Hindi' 
  | 'Punjabi' 
  | 'Bhojpuri' 
  | 'Haryanvi' 
  | 'Rajasthani' 
  | 'Marathi' 
  | 'Bengali' 
  | 'Gujarati' 
  | 'Tamil' 
  | 'Telugu';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  audioUrl: string;
  coverUrl: string;
  genre: string;
  language: MusicLanguage;
  mood: MusicMood;
  lyrics?: string;
  featured?: boolean;
  trending?: boolean;
  playsCount: number;
  likesCount: number;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  bio: string;
  genre: string;
  followersCount: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year: number;
  tracksCount: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  isFeatured?: boolean;
  songs: Song[];
  createdBy: string;
  createdByName: string;
  isPublic: boolean;
  createdAt: string;
}

export interface GolaFlavour {
  id: string;
  name: string;
  color: string; // primary hex or css color
  secondaryColor?: string;
  tasteNote: string;
  sweetnessLevel: number; // 1 to 5
  description: string;
  isAvailable: boolean;
  icon?: string;
  popularity: number;
}

export interface GolaTopping {
  id: string;
  name: string;
  color: string;
  type: 'crunch' | 'jelly' | 'candy' | 'fruit' | 'syrup';
  description: string;
  isAvailable: boolean;
  icon?: string;
}

export interface GolaContainer {
  id: string;
  name: string;
  type: 'paper_cup' | 'glass' | 'steel_bowl' | 'stick_traditional' | 'stick_wooden' | 'stick_colourful' | 'stick_decorative';
  icon?: string;
  description: string;
}

export interface GolaDecoration {
  id: string;
  name: string;
  type: 'umbrella' | 'cherry' | 'mint' | 'candy_flag' | 'straw';
  icon?: string;
}

export interface SelectedFlavour {
  flavourId: string;
  quantity: number; // 1 (light) to 3 (extra)
}

export interface GolaRecipe {
  id: string;
  name: string;
  baseIce: 'crushed' | 'snow' | 'fine';
  flavours: SelectedFlavour[];
  toppings: string[]; // topping ids
  containerId: string;
  decorationId: string;
  songPlayedId?: string;
  songPlayedTitle?: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  likes: number;
  tags?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  favorites: string[]; // song ids
  favoriteGolas: string[]; // gola ids
  savedGolas: GolaRecipe[];
  playlists: Playlist[];
  listeningHistory: { songId: string; timestamp: string }[];
}

export type FeedbackCategory = 
  | 'general' 
  | 'bug' 
  | 'request' 
  | 'feature' 
  | 'flavour' 
  | 'complaint' 
  | 'ui';

export interface Feedback {
  id: string;
  category: FeedbackCategory;
  rating: number; // 1 to 5
  message: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface AnalyticsStats {
  totalUsers: number;
  activeUsers: number;
  totalSongs: number;
  totalPlaylists: number;
  totalPlays: number;
  totalGolasCreated: number;
  averageRating: number;
  topSongs: { title: string; artist: string; plays: number }[];
  topFlavours: { name: string; count: number; color: string }[];
  moodDistribution: { mood: MusicMood; count: number }[];
}

export type ActiveTab = 
  | 'home' 
  | 'music' 
  | 'gola' 
  | 'playlists' 
  | 'favorites' 
  | 'search' 
  | 'profile' 
  | 'admin' 
  | 'feedback';

export interface BackgroundImage {
  id: string;
  title: string;
  url: string;
  createdAt?: string;
  addedBy?: string;
}

