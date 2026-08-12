/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, Song, Playlist, GolaFlavour, GolaTopping, GolaContainer, GolaDecoration, GolaRecipe, User, Feedback, BackgroundImage } from './types';
import {
  INITIAL_SONGS,
  INITIAL_PLAYLISTS,
  INITIAL_FLAVOURS,
  INITIAL_TOPPINGS,
  INITIAL_CONTAINERS,
  INITIAL_DECORATIONS,
  INITIAL_GOLA_RECIPES,
  INITIAL_FEEDBACK,
  INITIAL_BACKGROUND_IMAGES
} from './data/mockData';

import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signOut, 
  syncUserProfile, 
  collection, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  deleteDoc,
  doc, 
  getDocs,
  ADMIN_EMAIL 
} from './lib/firebase';

import { ArrowLeft, Disc, Music, ShoppingBag, Sparkles, Heart, Search, MessageSquarePlus, User as UserIcon, ShieldCheck } from 'lucide-react';
import { sendAdminEmailNotification } from './lib/emailService';

import { StreetEnvironment } from './components/StreetEnvironment';
import { MusicDiscovery } from './components/MusicDiscovery';
import { GolaCreator } from './components/GolaCreator';
import { MusicPlayer } from './components/MusicPlayer';
import { PlaylistsView } from './components/PlaylistsView';
import { UserProfile } from './components/UserProfile';
import { SearchView } from './components/SearchView';
import { FeedbackModal } from './components/FeedbackModal';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { GolaRecipeModal } from './components/GolaRecipeModal';

export default function App() {
  // Navigation State with History Stack
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [navigationHistory, setNavigationHistory] = useState<ActiveTab[]>([]);

  const handleSelectTab = (tab: ActiveTab) => {
    if (tab !== activeTab) {
      setNavigationHistory(prev => [...prev, activeTab]);
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 0) {
      const prevTab = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, prev.length - 1));
      setActiveTab(prevTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab('home');
    }
  };

  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'home': return 'Street Hub';
      case 'music': return 'All Songs & Beats';
      case 'gola': return 'Gola Maker';
      case 'playlists': return 'Playlists';
      case 'favorites': return 'Favorites';
      case 'search': return 'Search';
      case 'feedback': return 'Chai Stall Reviews';
      case 'profile': return 'User Profile';
      case 'admin': return 'Admin Control Center';
      default: return tab;
    }
  };

  // Application Data States
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [flavours, setFlavours] = useState<GolaFlavour[]>(INITIAL_FLAVOURS);
  const [toppings] = useState<GolaTopping[]>(INITIAL_TOPPINGS);
  const [containers] = useState<GolaContainer[]>(INITIAL_CONTAINERS);
  const [decorations] = useState<GolaDecoration[]>(INITIAL_DECORATIONS);
  const [savedGolas, setSavedGolas] = useState<GolaRecipe[]>(INITIAL_GOLA_RECIPES);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(INITIAL_FEEDBACK);
  const [registeredUsersCount, setRegisteredUsersCount] = useState<number>(1);

  // Background Image State (Randomly picks an image whenever user opens/refreshes website)
  const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>(INITIAL_BACKGROUND_IMAGES);
  const [currentBgImage, setCurrentBgImage] = useState<BackgroundImage | null>(() => {
    const randomIndex = Math.floor(Math.random() * INITIAL_BACKGROUND_IMAGES.length);
    return INITIAL_BACKGROUND_IMAGES[randomIndex] || null;
  });

  // Music Player State
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState<GolaRecipe | null>(null);

  // Real-time Firebase Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const appUser = await syncUserProfile(fbUser);
          setCurrentUser(appUser);

          // Fetch user's saved golas from Firestore subcollection
          const golaSnap = await getDocs(collection(db, 'users', fbUser.uid, 'golaRecipes'));
          const userGolas = golaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GolaRecipe));
          if (userGolas.length > 0) {
            setSavedGolas(userGolas);
          }
        } catch (err) {
          console.error("Error syncing user profile:", err);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Listeners for Feedback, Users, Songs & Playlists
  useEffect(() => {
    // 1. Feedback collection snapshot
    const unsubFeedback = onSnapshot(collection(db, 'feedback'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreFeedback = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Feedback));
        setFeedbackList(firestoreFeedback);
      }
    }, (err) => console.log("Feedback snapshot listener:", err));

    // 2. Users collection count snapshot
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setRegisteredUsersCount(Math.max(1, snapshot.size));
    }, (err) => console.log("Users count listener:", err));

    // 3. Songs collection snapshot
    const unsubSongs = onSnapshot(collection(db, 'songs'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreSongs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Song));
        setSongs(firestoreSongs);
      } else {
        setSongs([]);
      }
    }, (err) => {
      console.log("Songs snapshot listener:", err);
      setSongs([]);
    });

    // 4. Playlists collection snapshot
    const unsubPlaylists = onSnapshot(collection(db, 'playlists'), (snapshot) => {
      if (!snapshot.empty) {
        const firestorePlaylists = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Playlist));
        setPlaylists(firestorePlaylists);
      } else {
        setPlaylists([]);
      }
    }, (err) => console.log("Playlists snapshot listener:", err));

    // 5. Background images collection snapshot
    const unsubBgImages = onSnapshot(collection(db, 'background_images'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreBg = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BackgroundImage));
        const fsIds = new Set(firestoreBg.map(b => b.id));
        const combined = [...firestoreBg, ...INITIAL_BACKGROUND_IMAGES.filter(b => !fsIds.has(b.id))];
        setBackgroundImages(combined);
      }
    }, (err) => console.log("Background images snapshot listener:", err));

    return () => {
      unsubFeedback();
      unsubUsers();
      unsubSongs();
      unsubPlaylists();
      unsubBgImages();
    };
  }, []);

  // Ensure currentSong is initialized
  useEffect(() => {
    if (songs.length > 0) {
      if (!currentSong || !songs.some(s => s.id === currentSong.id)) {
        setCurrentSong(songs[0]);
      }
    } else {
      setCurrentSong(null);
    }
  }, [songs, currentSong]);

  // Maps for fast lookup
  const flavoursMap = React.useMemo(() => {
    const map: Record<string, GolaFlavour> = {};
    flavours.forEach(f => { map[f.id] = f; });
    return map;
  }, [flavours]);

  const toppingsMap = React.useMemo(() => {
    const map: Record<string, GolaTopping> = {};
    toppings.forEach(t => { map[t.id] = t; });
    return map;
  }, [toppings]);

  // Audio Play Handlers
  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleNextSong = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextSong = songs[(currentIndex + 1) % songs.length];
    setCurrentSong(nextSong);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevSong = songs[(currentIndex - 1 + songs.length) % songs.length];
    setCurrentSong(prevSong);
    setIsPlaying(true);
  };

  const handleToggleFavorite = (songId: string) => {
    if (favorites.includes(songId)) {
      setFavorites(favorites.filter(id => id !== songId));
    } else {
      setFavorites([...favorites, songId]);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // Save Gola Handler (Firestore Sync)
  const handleSaveGola = async (recipeData: Omit<GolaRecipe, 'id' | 'createdAt' | 'likes'>) => {
    const newRecipe: GolaRecipe = {
      ...recipeData,
      id: `gola_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentUser?.id || 'guest',
      createdByName: currentUser?.name || 'Desi Visitor',
      likes: 1
    };

    setSavedGolas([newRecipe, ...savedGolas]);
    setViewingRecipe(newRecipe);

    // If logged in, persist recipe to user's Firestore subcollection
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.id, 'golaRecipes', newRecipe.id), newRecipe);
      } catch (err) {
        console.error("Failed to save gola recipe to Firestore:", err);
      }
    }
  };

  // Add Song Admin Handler (Firestore Persisted)
  const handleAddSong = async (
    newSongData: Omit<Song, 'id' | 'playsCount' | 'likesCount'>,
    targetPlaylistId?: string
  ) => {
    const newSong: Song = {
      ...newSongData,
      id: `song_${Date.now()}`,
      playsCount: 1,
      likesCount: 0
    };

    setSongs(prev => [newSong, ...prev]);
    setCurrentSong(newSong);
    setIsPlaying(true);

    try {
      await setDoc(doc(db, 'songs', newSong.id), newSong);
    } catch (err) {
      console.error("Failed to save song to Firestore:", err);
    }

    if (targetPlaylistId) {
      const targetPl = playlists.find(p => p.id === targetPlaylistId);
      if (targetPl) {
        const updatedSongs = [...targetPl.songs, newSong];
        const updatedPl = { ...targetPl, songs: updatedSongs };
        setPlaylists(prev => prev.map(p => p.id === targetPlaylistId ? updatedPl : p));
        try {
          await setDoc(doc(db, 'playlists', targetPlaylistId), updatedPl);
        } catch (err) {
          console.error("Failed to update playlist in Firestore:", err);
        }
      }
    }
  };

  const handleDeleteSong = async (id: string) => {
    setSongs(prev => prev.filter(s => s.id !== id));
    try {
      await deleteDoc(doc(db, 'songs', id));
    } catch (err) {
      console.error("Failed to delete song from Firestore:", err);
    }
  };

  const handleToggleFlavourAvailability = (id: string) => {
    setFlavours(flavours.map(f => f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
  };

  // Feedback Submission (Firestore Persisted)
  const handleSubmitFeedback = async (fbData: Omit<Feedback, 'id' | 'createdAt' | 'status'>) => {
    const newFb: Feedback = {
      ...fbData,
      id: `fb_${Date.now()}`,
      userId: currentUser?.id,
      userName: currentUser?.name || fbData.userName || 'Visitor',
      userEmail: currentUser?.email || fbData.userEmail || '',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setFeedbackList([newFb, ...feedbackList]);

    try {
      await addDoc(collection(db, 'feedback'), {
        category: newFb.category,
        rating: newFb.rating,
        message: newFb.message,
        userId: newFb.userId || '',
        userName: newFb.userName,
        userEmail: newFb.userEmail,
        status: newFb.status,
        createdAt: newFb.createdAt
      });

      // Send email alert to swaritshukla125@gmail.com
      await sendAdminEmailNotification(
        'NEW_REVIEW',
        `New Chai Stall Review from ${newFb.userName} (${newFb.rating}★)`,
        `A new customer feedback/review was submitted!\n\nCategory: ${newFb.category}\nRating: ${newFb.rating}/5 Stars\nUser: ${newFb.userName} (${newFb.userEmail || 'No email'})\nMessage:\n"${newFb.message}"`,
        { feedbackId: newFb.id, category: newFb.category, rating: newFb.rating, userName: newFb.userName, userEmail: newFb.userEmail, message: newFb.message }
      );
    } catch (err) {
      console.error("Failed to save feedback to Firestore:", err);
    }
  };

  const handleUpdateFeedbackStatus = (id: string, status: 'pending' | 'reviewed' | 'resolved') => {
    setFeedbackList(feedbackList.map(f => f.id === id ? { ...f, status } : f));
  };

  // Background Image Handlers (Firestore Persisted)
  const handleAddBackgroundImage = async (bgData: { title: string; url: string }) => {
    const newBg: BackgroundImage = {
      id: `bg_${Date.now()}`,
      title: bgData.title,
      url: bgData.url,
      createdAt: new Date().toISOString().split('T')[0],
      addedBy: currentUser?.email || 'Admin'
    };
    try {
      await setDoc(doc(db, 'background_images', newBg.id), newBg);
    } catch (err) {
      console.error("Error saving background image doc to Firestore:", err);
    }
    setBackgroundImages(prev => [newBg, ...prev]);
    setCurrentBgImage(newBg);
  };

  const handleDeleteBackgroundImage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'background_images', id));
    } catch (err) {
      console.error("Error deleting background image doc from Firestore:", err);
    }
    const updated = backgroundImages.filter(b => b.id !== id);
    setBackgroundImages(updated);
    if (currentBgImage?.id === id) {
      if (updated.length > 0) {
        setCurrentBgImage(updated[Math.floor(Math.random() * updated.length)]);
      } else {
        setCurrentBgImage(null);
      }
    }
  };

  const handleShuffleBgImage = () => {
    if (backgroundImages.length === 0) return;
    const available = backgroundImages.filter(b => b.id !== currentBgImage?.id);
    const pool = available.length > 0 ? available : backgroundImages;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setCurrentBgImage(pool[randomIndex]);
  };

  // Create Playlist (Firestore Persisted)
  const handleCreatePlaylist = async (
    playlistData: Omit<Playlist, 'id' | 'createdAt'> | string,
    description?: string
  ) => {
    let newPl: Playlist;

    if (typeof playlistData === 'string') {
      newPl = {
        id: `pl_${Date.now()}`,
        title: playlistData,
        description: description || 'Street Playlist',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
        songs: songs.length > 0 ? [songs[0]] : [],
        createdBy: currentUser?.id || 'guest',
        createdByName: currentUser?.name || 'Desi Gola Lover',
        isPublic: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
    } else {
      newPl = {
        ...playlistData,
        id: `pl_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
    }

    setPlaylists(prev => [newPl, ...prev]);

    try {
      await setDoc(doc(db, 'playlists', newPl.id), newPl);
    } catch (err) {
      console.error("Failed to save playlist to Firestore:", err);
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'playlists', id));
    } catch (err) {
      console.error("Failed to delete playlist from Firestore:", err);
    }
  };

  // Calculated Real Analytics Stats
  const realStats = React.useMemo(() => {
    return {
      totalUsers: registeredUsersCount,
      activeUsers: registeredUsersCount,
      totalSongs: songs.length,
      totalPlaylists: playlists.length,
      totalPlays: songs.reduce((acc, s) => acc + s.playsCount, 0),
      totalGolasCreated: savedGolas.length,
      averageRating: feedbackList.length > 0 ? Number((feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)) : 5.0,
      topSongs: songs.slice(0, 5).map(s => ({ title: s.title, artist: s.artist, plays: s.playsCount })),
      topFlavours: flavours.slice(0, 5).map(f => ({ name: f.name, count: f.popularity || 10, color: f.color })),
      moodDistribution: []
    };
  }, [registeredUsersCount, songs, playlists, savedGolas, feedbackList, flavours]);

  return (
    <div className="w-full h-full min-h-screen bg-[#0c1319] text-[#e5dfd3] font-sans selection:bg-[#e0a96d] selection:text-[#0c1319]">
      
      {/* GLOBAL STICKY BACK & NAVIGATION BAR FOR ALL SUB-PAGES */}
      {activeTab !== 'home' && (
        <header className="sticky top-0 z-40 w-full bg-[#101921]/95 border-b border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            {/* Back Button */}
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-[#18242f] hover:bg-[#223240] text-[#e0a96d] border border-[#e0a96d]/30 rounded-full text-xs font-bold transition-all shadow-md group shrink-0"
              title="Go back to previous page"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>

            {/* Current Page Title */}
            <div className="flex sm:hidden text-xs font-semibold text-[#f5eedc]">
              <span className="text-[#e0a96d] font-hindi-display truncate">{getTabTitle(activeTab)}</span>
            </div>
          </div>

          {/* Desktop Page Title */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#f5eedc]">
            <span className="text-[#e0a96d] font-hindi-display">कानपुरिया बर्फ़ का गोला</span>
            <span className="text-[#6b7b8a]">&bull;</span>
            <span className="capitalize">{getTabTitle(activeTab)}</span>
          </div>

          {/* Quick Navigation Pills Bar */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap text-xs py-0.5 w-full sm:w-auto">
            {[
              { id: 'home', label: 'Street', icon: Disc },
              { id: 'music', label: 'Songs', icon: Music },
              { id: 'gola', label: 'Gola Mode', icon: ShoppingBag },
              { id: 'playlists', label: 'Playlists', icon: Sparkles },
              { id: 'favorites', label: 'Favorites', icon: Heart },
              { id: 'search', label: 'Search', icon: Search },
              { id: 'feedback', label: 'Chai Stall', icon: MessageSquarePlus },
              { id: 'profile', label: 'Profile', icon: UserIcon },
              { id: 'admin', label: 'Admin', icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id as ActiveTab)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#e0a96d] text-[#0c1319] font-bold shadow-sm'
                      : 'text-[#8a9aa8] hover:text-[#f5eedc] hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </header>
      )}

      {/* VIEW ROUTER BASED ON ACTIVE TAB */}
      <main className="w-full h-full">
        {activeTab === 'home' && (
          <StreetEnvironment
            currentSong={currentSong}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            currentMood={currentSong ? currentSong.mood : 'chill'}
            registeredUsersCount={registeredUsersCount}
            onGoBack={handleGoBack}
            canGoBack={navigationHistory.length > 0}
            currentBgImage={currentBgImage}
            onShuffleBgImage={handleShuffleBgImage}
          />
        )}

        {activeTab === 'music' && (
          <MusicDiscovery
            songs={songs}
            playlists={playlists}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={handlePlaySong}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onSelectPlaylist={(pl) => {
              if (pl.songs.length > 0) handlePlaySong(pl.songs[0]);
            }}
          />
        )}

        {activeTab === 'gola' && (
          <GolaCreator
            flavours={flavours.filter(f => f.isAvailable)}
            toppings={toppings}
            containers={containers}
            decorations={decorations}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNextSong={handleNextSong}
            onSaveGola={handleSaveGola}
          />
        )}

        {activeTab === 'playlists' && (
          <PlaylistsView
            playlists={playlists}
            onCreatePlaylist={handleCreatePlaylist}
            onPlaySong={handlePlaySong}
            onSelectPlaylist={(pl) => {
              if (pl.songs.length > 0) handlePlaySong(pl.songs[0]);
            }}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            songs={songs}
            playlists={playlists}
            golas={savedGolas}
            onPlaySong={handlePlaySong}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'favorites' && (
          <UserProfile
            user={currentUser}
            onLogout={handleLogout}
            savedGolas={savedGolas}
            favoriteSongs={songs.filter(s => favorites.includes(s.id))}
            allFlavoursMap={flavoursMap}
            allToppingsMap={toppingsMap}
            onPlaySong={handlePlaySong}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile
            user={currentUser}
            onLogout={handleLogout}
            savedGolas={savedGolas}
            favoriteSongs={songs.filter(s => favorites.includes(s.id))}
            allFlavoursMap={flavoursMap}
            allToppingsMap={toppingsMap}
            onPlaySong={handlePlaySong}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackModal onSubmitFeedback={handleSubmitFeedback} />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            stats={realStats}
            songs={songs}
            onAddSong={handleAddSong}
            onDeleteSong={handleDeleteSong}
            playlists={playlists}
            onCreatePlaylist={handleCreatePlaylist}
            onDeletePlaylist={handleDeletePlaylist}
            flavours={flavours}
            onToggleFlavour={handleToggleFlavourAvailability}
            feedback={feedbackList}
            onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
            currentUser={currentUser}
            onOpenAuth={() => setShowAuthModal(true)}
            backgroundImages={backgroundImages}
            onAddBackgroundImage={handleAddBackgroundImage}
            onDeleteBackgroundImage={handleDeleteBackgroundImage}
            currentBgImage={currentBgImage}
            onSetCurrentBgImage={setCurrentBgImage}
          />
        )}
      </main>

      {/* PERSISTENT GLOBAL MUSIC PLAYER AT BOTTOM */}
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNextSong={handleNextSong}
        onPrevSong={handlePrevSong}
        queue={queue}
        isFavorite={currentSong ? favorites.includes(currentSong.id) : false}
        onToggleFavorite={handleToggleFavorite}
        playlists={playlists}
        onAddToPlaylist={() => {}}
      />

      {/* AUTH MODAL */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user) => setCurrentUser(user)}
        />
      )}

      {/* GOLA RECIPE SHARE MODAL */}
      {viewingRecipe && (
        <GolaRecipeModal
          recipe={viewingRecipe}
          allFlavoursMap={flavoursMap}
          allToppingsMap={toppingsMap}
          containers={containers}
          decorations={decorations}
          onClose={() => setViewingRecipe(null)}
          onRemix={() => {
            setActiveTab('gola');
            setViewingRecipe(null);
          }}
        />
      )}
    </div>
  );
}
