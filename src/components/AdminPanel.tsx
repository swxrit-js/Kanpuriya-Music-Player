import React, { useState, useEffect } from 'react';
import { Song, Playlist, GolaFlavour, Feedback, User, BackgroundImage } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ShieldCheck, Music, ShoppingBag, MessageSquarePlus, Users, BarChart3, Plus, Trash2, Lock, UserCheck, Sparkles, Check, Play, Pause, Mail, Image as ImageIcon, RefreshCw, Shuffle, Upload, Wand2, FolderPlus, CheckCircle2, Volume2, FileAudio } from 'lucide-react';
import { db, collection, getDocs, onSnapshot, ADMIN_EMAIL } from '../lib/firebase';

interface AdminPanelProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalSongs: number;
    totalPlaylists: number;
    totalPlays: number;
    totalGolasCreated: number;
    averageRating: number;
    topSongs: { title: string; artist: string; plays: number }[];
    topFlavours: { name: string; count: number; color: string }[];
  };
  songs: Song[];
  onAddSong: (song: Omit<Song, 'id' | 'playsCount' | 'likesCount'>, targetPlaylistId?: string) => void;
  onDeleteSong: (id: string) => void;
  playlists: Playlist[];
  onCreatePlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt'>) => void;
  onDeletePlaylist: (id: string) => void;
  flavours: GolaFlavour[];
  onToggleFlavour: (id: string) => void;
  feedback: Feedback[];
  onUpdateFeedbackStatus: (id: string, status: 'pending' | 'reviewed' | 'resolved') => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  backgroundImages?: BackgroundImage[];
  onAddBackgroundImage?: (bg: { title: string; url: string }) => Promise<void>;
  onDeleteBackgroundImage?: (id: string) => Promise<void>;
  currentBgImage?: BackgroundImage | null;
  onSetCurrentBgImage?: (bg: BackgroundImage) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  stats,
  songs,
  onAddSong,
  onDeleteSong,
  playlists,
  onCreatePlaylist,
  onDeletePlaylist,
  flavours,
  onToggleFlavour,
  feedback,
  onUpdateFeedbackStatus,
  currentUser,
  onOpenAuth,
  backgroundImages = [],
  onAddBackgroundImage,
  onDeleteBackgroundImage,
  currentBgImage,
  onSetCurrentBgImage
}) => {
  const [adminTab, setAdminTab] = useState<'dashboard' | 'users' | 'songs' | 'playlists' | 'gola' | 'feedback' | 'emailAlerts' | 'backgrounds'>('dashboard');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [emailAlerts, setEmailAlerts] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Background Image Form State
  const [bgTitle, setBgTitle] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [isAddingBg, setIsAddingBg] = useState(false);

  // Real-time listener for Email Notifications sent to swaritshukla125@gmail.com
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'email_notifications'), (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      alerts.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setEmailAlerts(alerts);
    }, err => console.log("Email alerts listener:", err));

    return () => unsub();
  }, []);

  // New Song Form State
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('Desi Pop');
  const [language, setLanguage] = useState<any>('Hindi');
  const [mood, setMood] = useState<any>('party');
  const [audioUrl, setAudioUrl] = useState('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500');
  const [selectedPlaylistForSong, setSelectedPlaylistForSong] = useState<string>('');

  // New Playlist Form State
  const [showAddPlaylistModal, setShowAddPlaylistModal] = useState(false);
  const [plTitle, setPlTitle] = useState('');
  const [plDesc, setPlDesc] = useState('');
  const [plCoverUrl, setPlCoverUrl] = useState('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [isFeaturedPl, setIsFeaturedPl] = useState(true);

  // Fetch real registered users from Firestore when tab is users/dashboard
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const snap = await getDocs(collection(db, 'users'));
          const usersList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRegisteredUsers(usersList);
        } catch (err) {
          console.error("Failed to load users from Firestore:", err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [currentUser]);

  // Access Control check
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  if (!isAdmin) {
    return (
      <div className="w-full h-full min-h-screen bg-[#0c1319] text-[#e5dfd3] p-8 flex flex-col items-center justify-center">
        <div className="bg-[#121c23] border border-amber-500/30 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[#e0a96d] border border-amber-500/30 flex items-center justify-center text-3xl mx-auto shadow-inner">
            <Lock className="w-8 h-8 text-[#e0a96d]" />
          </div>
          <h2 className="text-xl md:text-2xl font-normal text-[#f5eedc] font-hindi-display">
            एडमिन पैनल (Admin Privileges Required)
          </h2>
          <p className="text-xs text-[#8a9aa8]">
            This admin dashboard is restricted strictly to the owner (<strong className="text-[#e0a96d]">{ADMIN_EMAIL}</strong>).
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAuth}
              className="w-full py-3 bg-[#e0a96d] text-[#0c1319] font-bold text-xs rounded-xl shadow-md hover:brightness-110 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Log in as Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddSongSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) return;

    onAddSong({
      title,
      artist,
      album: album || 'Single',
      duration: 180,
      audioUrl,
      coverUrl,
      genre,
      language,
      mood,
      featured: true,
      trending: true
    }, selectedPlaylistForSong || undefined);

    setTitle('');
    setArtist('');
    setAlbum('');
    setSelectedPlaylistForSong('');
    setShowAddSongModal(false);
  };

  const handleAddPlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plTitle.trim()) return;

    const chosenSongs = songs.filter(s => selectedSongIds.includes(s.id));

    onCreatePlaylist({
      title: plTitle,
      description: plDesc || 'Official Admin Curated Playlist',
      coverUrl: plCoverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
      isFeatured: isFeaturedPl,
      songs: chosenSongs.length > 0 ? chosenSongs : (songs.length > 0 ? [songs[0]] : []),
      createdBy: currentUser?.id || 'admin',
      createdByName: currentUser?.name || 'Street Admin',
      isPublic: true
    });

    setPlTitle('');
    setPlDesc('');
    setSelectedSongIds([]);
    setShowAddPlaylistModal(false);
  };

  const toggleSongSelection = (songId: string) => {
    if (selectedSongIds.includes(songId)) {
      setSelectedSongIds(selectedSongIds.filter(id => id !== songId));
    } else {
      setSelectedSongIds([...selectedSongIds, songId]);
    }
  };

  const COLORS = ['#e0a96d', '#38bdf8', '#f43f5e', '#a855f7', '#10b981'];

  return (
    <div className="w-full h-full min-h-screen bg-[#0c1319] text-[#e5dfd3] p-3 sm:p-6 md:p-8 pb-36 md:pb-28">
      
      {/* ADMIN HEADER */}
      <div className="bg-[#121c23] border border-white/10 p-4 sm:p-6 rounded-3xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#e0a96d]/10 text-[#e0a96d] border border-[#e0a96d]/30 flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg shrink-0">
            👑
          </div>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-normal text-[#f5eedc] font-hindi-display flex items-center gap-2">
              कानपुरिया गोला एडमिन कंट्रोल सेंटर
            </h1>
            <p className="text-xs text-[#8a9aa8]">
              Real user management, songs catalog, playlist curator & live store operations
            </p>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: `Users (${registeredUsers.length || stats.totalUsers})`, icon: Users },
            { id: 'songs', label: `Songs (${songs.length})`, icon: Music },
            { id: 'playlists', label: `Playlists (${playlists.length})`, icon: Sparkles },
            { id: 'gola', label: 'Flavours', icon: ShoppingBag },
            { id: 'feedback', label: `Reviews (${feedback.length})`, icon: MessageSquarePlus },
            { id: 'emailAlerts', label: `Email Alerts (${emailAlerts.length})`, icon: Mail },
            { id: 'backgrounds', label: `Backgrounds (${backgroundImages.length})`, icon: ImageIcon }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-full font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#e0a96d] text-[#0c1319] shadow-md font-bold'
                    : 'bg-[#18232c] text-[#a8b5c0] border border-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {adminTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* REAL STAT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#131d25] border border-white/10">
              <span className="text-xs text-[#8a9aa8] font-semibold uppercase tracking-wider block">Registered Users</span>
              <p className="text-3xl font-bold text-[#f5eedc] mt-1">{registeredUsers.length || stats.totalUsers}</p>
              <span className="text-[10px] text-emerald-400 mt-1 block">Real Firestore Accounts</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#131d25] border border-white/10">
              <span className="text-xs text-[#8a9aa8] font-semibold uppercase tracking-wider block">Golas Created</span>
              <p className="text-3xl font-bold text-[#e0a96d] mt-1">{stats.totalGolasCreated}</p>
              <span className="text-[10px] text-[#8a9aa8] mt-1 block">Saved by Users</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#131d25] border border-white/10">
              <span className="text-xs text-[#8a9aa8] font-semibold uppercase tracking-wider block">Catalog Songs</span>
              <p className="text-3xl font-bold text-[#38bdf8] mt-1">{songs.length}</p>
              <span className="text-[10px] text-[#8a9aa8] mt-1 block">Active Beats</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#131d25] border border-white/10">
              <span className="text-xs text-[#8a9aa8] font-semibold uppercase tracking-wider block">Chai Stall Reviews</span>
              <p className="text-3xl font-bold text-emerald-400 mt-1">{feedback.length}</p>
              <span className="text-[10px] text-[#8a9aa8] mt-1 block">Customer Submissions</span>
            </div>
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Songs Chart */}
            <div className="p-5 rounded-3xl bg-[#131d25] border border-white/10">
              <h3 className="text-sm font-semibold text-[#f5eedc] uppercase tracking-wider mb-4 font-hindi-display">Most Played Songs</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topSongs}>
                    <XAxis dataKey="title" stroke="#8a9aa8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#8a9aa8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0c1319', borderColor: '#22303c', borderRadius: '12px', fontSize: '12px', color: '#f5eedc' }} />
                    <Bar dataKey="plays" fill="#e0a96d" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Flavours Chart */}
            <div className="p-5 rounded-3xl bg-[#131d25] border border-white/10">
              <h3 className="text-sm font-semibold text-[#38bdf8] uppercase tracking-wider mb-4 font-hindi-display">Gola Flavour Popularity</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.topFlavours} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {stats.topFlavours.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0c1319', borderColor: '#22303c', borderRadius: '12px', fontSize: '12px', color: '#f5eedc' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTERED USERS TAB */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-normal text-[#f5eedc] font-hindi-display flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#e0a96d]" /> Registered Real Users ({registeredUsers.length})
            </h3>
          </div>

          {loadingUsers ? (
            <div className="p-8 text-center text-xs text-[#8a9aa8]">Loading users from Firestore...</div>
          ) : registeredUsers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#131d25] border border-white/10 text-center text-xs text-[#8a9aa8]">
              No registered user accounts found in Firestore yet. User accounts created via Sign Up or Google Login will appear here automatically.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {registeredUsers.map((u, i) => (
                <div key={u.id || i} className="p-4 rounded-2xl bg-[#131d25] border border-white/10 flex items-center gap-3">
                  <img
                    src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`}
                    alt={u.name}
                    className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#f5eedc] truncate">{u.name || 'Desi User'}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        u.role === 'admin' ? 'bg-[#e0a96d]/20 text-[#e0a96d] border border-[#e0a96d]/30' : 'bg-white/5 text-[#8a9aa8]'
                      }`}>
                        {u.role || 'user'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8a9aa8] truncate mt-0.5">{u.email}</p>
                    <p className="text-[10px] text-[#6b7b8a] mt-1 font-mono">
                      Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SONGS MANAGEMENT TAB */}
      {adminTab === 'songs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131d25] border border-white/10 p-4 rounded-3xl">
            <div>
              <h3 className="text-base font-bold text-[#f5eedc] font-hindi-display flex items-center gap-2">
                <Music className="w-5 h-5 text-[#e0a96d]" /> Songs Catalog ({songs.length})
              </h3>
              <p className="text-xs text-[#8a9aa8]">Easily add, test, or manage songs. Choose local files or paste MP3 links.</p>
            </div>
            <button
              onClick={() => setShowAddSongModal(true)}
              className="px-5 py-2.5 bg-[#e0a96d] text-[#0c1319] font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Song</span>
            </button>
          </div>

          {/* DIRECT AUDIO FILE UPLOADER BANNER */}
          <div className="bg-[#121c23] border border-[#e0a96d]/30 p-4 sm:p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#e0a96d]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#f5eedc]">Upload Audio Tracks From Your Device</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e0a96d]/20 text-[#e0a96d] border border-[#e0a96d]/30 font-mono">
                MP3 / WEBM / MP4 / M4A
              </span>
            </div>
            <p className="text-xs text-[#8a9aa8]">
              Upload any audio track from your computer or phone. The title and artist will be automatically extracted, saved, and ready to play across all devices!
            </p>
            <button
              onClick={() => setShowAddSongModal(true)}
              className="px-4 py-2 bg-[#e0a96d]/10 hover:bg-[#e0a96d]/20 text-[#e0a96d] border border-[#e0a96d]/40 text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Audio Track Now</span>
            </button>
          </div>

          {/* CURRENT CATALOG SONGS LIST */}
          {songs.length === 0 ? (
            <div className="p-8 text-center bg-[#131d25] border border-white/10 rounded-3xl space-y-2">
              <p className="text-xs text-[#8a9aa8]">No songs found in catalog. Click <strong>"Add New Song"</strong> or <strong>"Import"</strong> above!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#8a9aa8] uppercase tracking-wider px-1">Active Song Catalog ({songs.length})</h4>
              {songs.map(s => (
                <div key={s.id} className="p-3 rounded-2xl bg-[#131d25] border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img src={s.coverUrl} alt={s.title} className="w-10 h-10 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs md:text-sm font-bold text-[#f5eedc] truncate">{s.title}</h4>
                        <span className="px-1.5 py-0.2 text-[9px] rounded bg-[#1c2832] text-[#e0a96d] border border-[#e0a96d]/20 uppercase shrink-0 font-mono">
                          {s.mood}
                        </span>
                      </div>
                      <p className="text-[10px] md:text-xs text-[#8a9aa8] truncate mt-0.5">
                        {s.artist} &bull; {s.genre} &bull; {s.language}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onDeleteSong(s.id)}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Remove Song"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADD SONG SMART MODAL */}
          {showAddSongModal && (
            <div className="fixed inset-0 z-[100] bg-[#070c10]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 pb-28 sm:pb-24 overflow-y-auto">
              <div className="bg-[#121c23] border border-[#e0a96d]/40 p-5 sm:p-6 rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-4 my-auto relative">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-3 sticky top-0 bg-[#121c23] z-10 pt-1">
                  <h3 className="text-base font-bold text-[#f5eedc] font-hindi-display flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-[#e0a96d]" /> Smart Add Song
                  </h3>
                  <button onClick={() => setShowAddSongModal(false)} className="text-[#8a9aa8] hover:text-white text-xs font-bold w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">✕</button>
                </div>

                <form onSubmit={handleAddSongSubmit} className="space-y-3.5 text-xs">
                  
                  {/* UPLOAD & AUTO-EXTRACT BOX */}
                  <div className="p-3.5 bg-[#0c1319] border border-dashed border-[#e0a96d]/40 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#e0a96d] flex items-center gap-1.5">
                        <FileAudio className="w-4 h-4" /> Upload Local Audio File
                      </span>
                      <span className="text-[10px] text-[#8a9aa8]">Auto-Extracts Title & Artist</span>
                    </div>

                    <label className="cursor-pointer bg-[#18232c] hover:bg-[#1f2d38] border border-white/10 p-3 rounded-xl text-center text-[#f5eedc] text-xs transition-colors flex flex-col items-center justify-center gap-1">
                      <Upload className="w-5 h-5 text-[#e0a96d]" />
                      <span className="font-semibold text-xs">Choose MP3 / WEBM / MP4 / M4A file</span>
                      <span className="text-[10px] text-[#8a9aa8]">Or drag and drop audio file here</span>
                      <input
                        type="file"
                        accept="audio/*,video/mp4,video/webm,.webm,.mp4,.mp3,.m4a"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Smart auto-parse Title & Artist from filename!
                            let rawName = file.name.replace(/\.[^/.]+$/, "");
                            rawName = rawName.replace(/_(256|320)kbps|official_audio|official_video|official|live_from.*|a_song_on_the_ukulele_low/gi, "");
                            
                            let extractedArtist = 'Desi Artist';
                            let extractedTitle = rawName;

                            if (rawName.includes('_-_')) {
                              const parts = rawName.split('_-_');
                              extractedArtist = parts[0].replace(/_/g, ' ').trim();
                              extractedTitle = parts[1].replace(/_/g, ' ').trim();
                            } else if (rawName.includes(' - ')) {
                              const parts = rawName.split(' - ');
                              extractedArtist = parts[0].trim();
                              extractedTitle = parts[1].trim();
                            } else if (rawName.includes('_')) {
                              extractedTitle = rawName.replace(/_/g, ' ').trim();
                            }

                            setTitle(extractedTitle);
                            setArtist(extractedArtist);

                            setIsUploadingAudio(true);
                            const reader = new FileReader();
                            reader.onload = async (event) => {
                              const dataUrl = event.target?.result as string;
                              try {
                                const res = await fetch('/api/upload-audio', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ filename: file.name, dataUrl })
                                });
                                const data = await res.json();
                                if (data.success && data.audioUrl) {
                                  setAudioUrl(data.audioUrl);
                                } else {
                                  setAudioUrl(dataUrl);
                                }
                              } catch (err) {
                                setAudioUrl(dataUrl);
                              } finally {
                                setIsUploadingAudio(false);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {isUploadingAudio && (
                      <p className="text-[11px] text-[#e0a96d] font-bold text-center animate-pulse mt-1">
                        Uploading audio track to server...
                      </p>
                    )}
                  </div>

                  {/* TITLE & ARTIST AUTO-FILLED FIELDS */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#8a9aa8] block mb-1">Song Title *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Alag Aasmaan"
                        className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc] focus:outline-none focus:border-[#e0a96d]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[#8a9aa8] block mb-1">Artist Name *</label>
                      <input
                        type="text"
                        value={artist}
                        onChange={e => setArtist(e.target.value)}
                        placeholder="e.g. Anuv Jain"
                        className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc] focus:outline-none focus:border-[#e0a96d]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[#8a9aa8] block mb-1">Album / Single</label>
                      <input type="text" value={album} onChange={e => setAlbum(e.target.value)} placeholder="Single" className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc]" />
                    </div>
                    <div>
                      <label className="text-[#8a9aa8] block mb-1">Genre</label>
                      <select value={genre} onChange={e => setGenre(e.target.value)} className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc]">
                        <option value="Desi Pop">Desi Pop</option>
                        <option value="Desi Fusion">Desi Fusion</option>
                        <option value="Punjabi Pop">Punjabi Pop</option>
                        <option value="Acoustic Indie">Acoustic Indie</option>
                        <option value="Semi-Classical Ghazal">Semi-Classical Ghazal</option>
                        <option value="Bhojpuri Folk Electro">Bhojpuri Folk Electro</option>
                        <option value="Haryanvi Hip Hop">Haryanvi Hip Hop</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[#8a9aa8] block mb-1">Language</label>
                      <select value={language} onChange={e => setLanguage(e.target.value as any)} className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc]">
                        <option value="Hindi">Hindi</option>
                        <option value="Punjabi">Punjabi</option>
                        <option value="Bhojpuri">Bhojpuri</option>
                        <option value="Haryanvi">Haryanvi</option>
                        <option value="Rajasthani">Rajasthani</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[#8a9aa8] block mb-1">Mood Vibe</label>
                    <select value={mood} onChange={e => setMood(e.target.value as any)} className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc]">
                      <option value="chill">Chill / Relaxing</option>
                      <option value="party">Party / High Energy</option>
                      <option value="romantic">Romantic / Sweet</option>
                      <option value="latenight">Late Night / Solitude</option>
                      <option value="nostalgia">Nostalgia / Old Days</option>
                      <option value="workout">Workout / Power</option>
                    </select>
                  </div>

                  {/* AUDIO URL / PRESET TRACKS */}
                  <div>
                    <label className="text-[#8a9aa8] block mb-1 font-mono">Audio URL or Path</label>
                    <input
                      type="text"
                      value={audioUrl}
                      onChange={e => setAudioUrl(e.target.value)}
                      placeholder="/song/filename.mp3 OR https://.../song.mp3"
                      className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc] font-mono text-[11px]"
                      required
                    />
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-[#8a9aa8] mt-1">
                      <span>Quick Test Links:</span>
                      <button
                        type="button"
                        onClick={() => setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')}
                        className="px-2 py-0.5 rounded bg-[#18232c] hover:bg-[#223240] text-[#e0a96d] border border-white/10"
                      >
                        🎵 SoundHelix 1
                      </button>
                      <button
                        type="button"
                        onClick={() => setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3')}
                        className="px-2 py-0.5 rounded bg-[#18232c] hover:bg-[#223240] text-[#e0a96d] border border-white/10"
                      >
                        🔥 SoundHelix 2
                      </button>
                      <button
                        type="button"
                        onClick={() => setAudioUrl('/song/Anuv_Jain_-_ALAG_AASMAAN_a_song_on_the_ukulele_low.mp4')}
                        className="px-2 py-0.5 rounded bg-[#18232c] hover:bg-[#223240] text-[#e0a96d] border border-white/10"
                      >
                        🎸 Local Alag Aasmaan
                      </button>
                    </div>
                  </div>

                  {/* COVER IMAGE */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#8a9aa8] font-mono">Cover Image URL</label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCoverUrl('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600')}
                          className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded hover:bg-white/10 text-[#e0a96d]"
                        >
                          Guitars
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverUrl('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600')}
                          className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded hover:bg-white/10 text-[#e0a96d]"
                        >
                          Concert
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverUrl('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600')}
                          className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded hover:bg-white/10 text-[#e0a96d]"
                        >
                          Street Vibe
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={coverUrl}
                      onChange={e => setCoverUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc] font-mono text-[11px]"
                      required
                    />
                  </div>

                  {playlists.length > 0 && (
                    <div>
                      <label className="text-[#8a9aa8] block mb-1">Add directly to Playlist (Optional)</label>
                      <select value={selectedPlaylistForSong} onChange={e => setSelectedPlaylistForSong(e.target.value)} className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc]">
                        <option value="">-- Standalone Song --</option>
                        {playlists.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="sticky bottom-0 bg-[#121c23] pt-3 pb-2 border-t border-white/10 flex justify-end gap-2 mt-4 z-10">
                    <button type="button" onClick={() => setShowAddSongModal(false)} className="px-4 py-2 bg-[#18232c] text-[#8a9aa8] rounded-full hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-[#e0a96d] text-[#0c1319] font-bold rounded-full shadow-[0_0_15px_rgba(224,169,109,0.3)] hover:brightness-110 active:scale-95 transition-all">
                      Save & Publish Song
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PLAYLISTS MANAGEMENT TAB */}
      {adminTab === 'playlists' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-normal text-[#f5eedc] font-hindi-display">Official Street Playlists ({playlists.length})</h3>
              <p className="text-xs text-[#8a9aa8]">Create and edit featured playlists that users can stream directly on the platform.</p>
            </div>
            <button
              onClick={() => setShowAddPlaylistModal(true)}
              className="px-4 py-2 bg-[#e0a96d] text-[#0c1319] font-bold text-xs rounded-full flex items-center gap-1.5 shadow-md hover:brightness-110"
            >
              <Plus className="w-4 h-4" /> Create Official Playlist
            </button>
          </div>

          {playlists.length === 0 ? (
            <div className="p-8 text-center bg-[#131d25] border border-white/10 rounded-2xl space-y-2">
              <p className="text-xs text-[#8a9aa8]">No playlists found in the database. Click <strong>"Create Official Playlist"</strong> above to make one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map(pl => (
                <div key={pl.id} className="p-4 rounded-2xl bg-[#131d25] border border-white/10 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <img src={pl.coverUrl} alt={pl.title} className="w-16 h-16 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-[#f5eedc] truncate">{pl.title}</h4>
                      <p className="text-xs text-[#8a9aa8] line-clamp-2 mt-0.5">{pl.description}</p>
                      <span className="inline-block mt-2 text-[10px] bg-[#18232c] text-[#e0a96d] px-2 py-0.5 rounded-full font-mono">
                        {pl.songs.length} Tracks
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-[#6b7b8a]">By {pl.createdByName || 'Admin'}</span>
                    <button
                      onClick={() => onDeletePlaylist(pl.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Delete Playlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADD PLAYLIST MODAL */}
          {showAddPlaylistModal && (
            <div className="fixed inset-0 z-50 bg-[#070c10]/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#121c23] border border-white/15 p-6 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-base font-normal text-[#f5eedc] mb-4 font-hindi-display flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#e0a96d]" /> Create Official Street Playlist
                </h3>
                <form onSubmit={handleAddPlaylistSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="text-[#8a9aa8] block mb-1">Playlist Title *</label>
                    <input
                      type="text"
                      value={plTitle}
                      onChange={e => setPlTitle(e.target.value)}
                      placeholder="e.g. Monsoon Chai & Gola Mix"
                      className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc] focus:outline-none focus:border-[#e0a96d]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[#8a9aa8] block mb-1">Description</label>
                    <textarea
                      value={plDesc}
                      onChange={e => setPlDesc(e.target.value)}
                      placeholder="Describe the mood of this playlist..."
                      className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc] focus:outline-none focus:border-[#e0a96d] h-16"
                    />
                  </div>

                  <div>
                    <label className="text-[#8a9aa8] block mb-1 font-mono">Cover Image URL</label>
                    <input
                      type="text"
                      value={plCoverUrl}
                      onChange={e => setPlCoverUrl(e.target.value)}
                      className="w-full bg-[#0c1319] border border-white/10 p-2.5 rounded-xl text-[#f5eedc] font-mono text-[11px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[#8a9aa8] block mb-2 font-semibold">Select Songs to Include in Playlist ({selectedSongIds.length} selected)</label>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-[#0c1319] border border-white/10 rounded-xl">
                      {songs.map(song => {
                        const isSelected = selectedSongIds.includes(song.id);
                        return (
                          <div
                            key={song.id}
                            onClick={() => toggleSongSelection(song.id)}
                            className={`p-2 rounded-lg flex items-center justify-between cursor-pointer border transition-colors ${
                              isSelected
                                ? 'bg-[#e0a96d]/15 border-[#e0a96d]/40 text-[#f5eedc]'
                                : 'bg-[#121c23] border-white/5 text-[#8a9aa8] hover:text-[#f5eedc]'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img src={song.coverUrl} alt={song.title} className="w-7 h-7 rounded-md object-cover" />
                              <div className="min-w-0">
                                <p className="text-xs font-medium truncate">{song.title}</p>
                                <p className="text-[10px] text-[#8a9aa8] truncate">{song.artist}</p>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${isSelected ? 'bg-[#e0a96d] border-[#e0a96d] text-[#0c1319]' : 'border-white/20'}`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={isFeaturedPl}
                      onChange={e => setIsFeaturedPl(e.target.checked)}
                      className="rounded accent-[#e0a96d]"
                    />
                    <label htmlFor="isFeatured" className="text-[#f5eedc] text-xs cursor-pointer">
                      Mark as Featured Playlist on Home Page
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                    <button type="button" onClick={() => setShowAddPlaylistModal(false)} className="px-4 py-2 bg-[#18232c] text-[#8a9aa8] rounded-full">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-[#e0a96d] text-[#0c1319] font-bold rounded-full shadow-md hover:brightness-110">Create Playlist</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GOLA FLAVOURS MANAGEMENT */}
      {adminTab === 'gola' && (
        <div>
          <h3 className="text-base font-normal text-[#f5eedc] font-hindi-display mb-4">Gola Flavours Menu Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flavours.map(f => (
              <div key={f.id} className="p-4 rounded-2xl bg-[#131d25] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-white/30" style={{ backgroundColor: f.color }} />
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-[#f5eedc]">{f.name}</h4>
                    <p className="text-[10px] md:text-xs text-[#8a9aa8]">{f.tasteNote}</p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFlavour(f.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    f.isAvailable ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {f.isAvailable ? 'Available' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEEDBACK REVIEWS TAB */}
      {adminTab === 'feedback' && (
        <div>
          <h3 className="text-base font-normal text-[#f5eedc] font-hindi-display mb-4">Chai Stall Customer Reviews</h3>
          <div className="space-y-3">
            {feedback.map(fb => (
              <div key={fb.id} className="p-4 rounded-2xl bg-[#131d25] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#e0a96d] text-xs">{"⭐".repeat(fb.rating)}</span>
                    <span className="text-[10px] bg-[#18232c] text-[#e0a96d] px-2 py-0.5 rounded-full uppercase">{fb.category}</span>
                  </div>
                  <p className="text-xs md:text-sm text-[#f5eedc]">{fb.message}</p>
                  <p className="text-[10px] text-[#8a9aa8] mt-1">By: {fb.userName || 'Anonymous'} • {fb.userEmail || ''} • {fb.createdAt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateFeedbackStatus(fb.id, 'resolved')}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      fb.status === 'resolved' ? 'bg-emerald-500 text-[#0c1319]' : 'bg-[#18232c] text-[#8a9aa8]'
                    }`}
                  >
                    {fb.status === 'resolved' ? 'Resolved ✓' : 'Mark Resolved'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMAIL ALERTS DISPATCH LOGS TAB */}
      {adminTab === 'emailAlerts' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-normal text-[#f5eedc] font-hindi-display flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e0a96d]" />
                Admin Email Dispatch Logs ({emailAlerts.length})
              </h3>
              <p className="text-xs text-[#8a9aa8] mt-0.5">
                All user signups & customer reviews automatically dispatched to <strong className="text-[#e0a96d]">{ADMIN_EMAIL}</strong>
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono">
              Live Firestore Sync Active
            </span>
          </div>

          {emailAlerts.length === 0 ? (
            <div className="p-8 text-center bg-[#131d25] border border-white/10 rounded-2xl">
              <Mail className="w-8 h-8 text-[#8a9aa8] mx-auto mb-2 opacity-50" />
              <p className="text-xs text-[#8a9aa8]">No email notifications logged yet. New user signups or reviews will appear here instantly!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {emailAlerts.map(alert => (
                <div key={alert.id} className="p-4 rounded-2xl bg-[#131d25] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <h4 className="text-xs md:text-sm font-bold text-[#f5eedc]">{alert.subject}</h4>
                    </div>
                    <span className="text-[10px] text-[#8a9aa8] font-mono">{alert.createdAt || 'Just now'}</span>
                  </div>

                  <div className="text-xs text-[#c8d4df] space-y-1 font-mono bg-[#0c1319] p-3 rounded-xl border border-white/5">
                    <p><strong className="text-[#e0a96d]">To:</strong> {alert.to}</p>
                    <p><strong className="text-[#e0a96d]">Type:</strong> {alert.type}</p>
                    {alert.data && alert.data.email && <p><strong className="text-[#e0a96d]">User Email:</strong> {alert.data.email}</p>}
                    {alert.data && alert.data.name && <p><strong className="text-[#e0a96d]">User Name:</strong> {alert.data.name}</p>}
                    {alert.data && alert.data.message && <p><strong className="text-[#e0a96d]">Review Text:</strong> "{alert.data.message}"</p>}
                    {alert.data && alert.data.rating && <p><strong className="text-[#e0a96d]">Rating:</strong> {alert.data.rating} ⭐</p>}
                    <p className="pt-1 text-[10px] text-emerald-400 font-sans">✓ Sent & logged to admin inbox</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BACKGROUND WALLPAPERS TAB */}
      {adminTab === 'backgrounds' && (
        <div className="space-y-6">
          <div className="bg-[#121c23] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#f5eedc] font-hindi-display flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#e0a96d]" />
                Main Box Background Wallpapers
              </h3>
              <p className="text-xs text-[#8a9aa8] mt-1 max-w-2xl">
                Set images outside the main "Kanpuriya Barf Ka Gola" box. Whenever any user opens or refreshes the website, an image is randomly chosen to cover the whole screen flexibly.
              </p>
            </div>

            <button
              onClick={() => setIsAddingBg(!isAddingBg)}
              className="px-4 py-2 bg-[#e0a96d] text-[#0c1319] font-bold text-xs rounded-full hover:bg-[#d89753] transition-all flex items-center gap-1.5 shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingBg ? 'Close Form' : 'Add New Wallpaper'}</span>
            </button>
          </div>

          {/* Add Background Form */}
          {isAddingBg && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!bgUrl.trim()) return;
                try {
                  if (onAddBackgroundImage) {
                    await onAddBackgroundImage({
                      title: bgTitle.trim() || 'Kanpuriya Street Background',
                      url: bgUrl.trim()
                    });
                  }
                  setBgTitle('');
                  setBgUrl('');
                  setIsAddingBg(false);
                } catch (err) {
                  console.error("Error adding background image:", err);
                }
              }}
              className="p-6 rounded-2xl bg-[#131d25] border border-[#e0a96d]/30 space-y-4 shadow-xl"
            >
              <h4 className="text-sm font-bold text-[#e0a96d] uppercase tracking-wider">Add Wallpaper URL</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8a9aa8] font-semibold block mb-1">Wallpaper Title / Label</label>
                  <input
                    type="text"
                    value={bgTitle}
                    onChange={(e) => setBgTitle(e.target.value)}
                    placeholder="e.g. Kanpur Central Railway Station at Dusk"
                    className="w-full bg-[#0c1319] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#e0a96d]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8a9aa8] font-semibold block mb-1">Direct Image URL (JPG/PNG/WebP)</label>
                  <input
                    type="url"
                    value={bgUrl}
                    onChange={(e) => setBgUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#0c1319] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#f5eedc] focus:outline-none focus:border-[#e0a96d]"
                    required
                  />
                </div>
              </div>

              {/* Live Image Preview */}
              {bgUrl.trim() && (
                <div className="mt-2">
                  <span className="text-[10px] text-[#8a9aa8] uppercase font-mono block mb-1">Live Image Preview:</span>
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src={bgUrl.trim()}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1920&auto=format&fit=crop';
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                        {bgTitle.trim() || 'Kanpuriya Wallpaper Preview'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBg(false)}
                  className="px-4 py-2 rounded-full border border-white/10 text-xs text-[#8a9aa8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#e0a96d] text-[#0c1319] font-bold text-xs rounded-full hover:bg-[#d89753] transition-all shadow-md"
                >
                  Save Background Image
                </button>
              </div>
            </form>
          )}

          {/* Wallpapers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {backgroundImages.map((bg) => {
              const isSelected = currentBgImage?.id === bg.id || currentBgImage?.url === bg.url;
              return (
                <div
                  key={bg.id}
                  className={`group relative rounded-2xl overflow-hidden border transition-all ${
                    isSelected
                      ? 'border-[#e0a96d] shadow-[0_0_20px_rgba(224,169,109,0.3)] bg-[#17232d]'
                      : 'border-white/10 hover:border-white/25 bg-[#131d25]'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative w-full h-44 overflow-hidden bg-black/60">
                    <img
                      src={bg.url}
                      alt={bg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {isSelected && (
                      <span className="absolute top-3 left-3 bg-[#e0a96d] text-[#0c1319] font-bold text-[10px] uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Check className="w-3 h-3" /> Active Now
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <p className="text-xs font-bold text-[#f5eedc] truncate drop-shadow-md">
                        {bg.title}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Controls */}
                  <div className="p-3.5 flex items-center justify-between bg-[#131d25] border-t border-white/5 text-xs">
                    <button
                      onClick={() => onSetCurrentBgImage && onSetCurrentBgImage(bg)}
                      className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#e0a96d]/20 text-[#e0a96d] border border-[#e0a96d]/40'
                          : 'bg-[#1c2933] text-[#a8b5c0] hover:text-white hover:bg-[#253644]'
                      }`}
                    >
                      <Play className="w-3 h-3" />
                      <span>{isSelected ? 'Currently Selected' : 'Preview Live'}</span>
                    </button>

                    {onDeleteBackgroundImage && (
                      <button
                        onClick={async () => {
                          if (confirm(`Delete wallpaper "${bg.title}"?`)) {
                            await onDeleteBackgroundImage(bg.id);
                          }
                        }}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full transition-colors"
                        title="Delete wallpaper"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
