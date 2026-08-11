import React from 'react';
import { MusicMood, ActiveTab, Song, BackgroundImage } from '../types';
import { Play, Pause, Music, Sparkles, Disc, ShoppingBag, Search, Heart, User, ShieldCheck, MessageSquarePlus, ChevronUp, SkipForward, ArrowLeft, Image as ImageIcon, Shuffle } from 'lucide-react';

interface StreetEnvironmentProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentMood: MusicMood;
  registeredUsersCount?: number;
  onGoBack?: () => void;
  canGoBack?: boolean;
  currentBgImage?: BackgroundImage | null;
  onShuffleBgImage?: () => void;
}

export const StreetEnvironment: React.FC<StreetEnvironmentProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  activeTab,
  onSelectTab,
  currentMood,
  registeredUsersCount = 1,
  onGoBack,
  canGoBack = false,
  currentBgImage,
  onShuffleBgImage
}) => {
  const [time, setTime] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeFormatted = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  const dateFormatted = time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#0c1319] text-[#e5dfd3] select-none flex flex-col justify-between font-sans">
      
      {/* FULL-SCREEN FLEXIBLE BACKGROUND IMAGE (COVERS WHOLE SCREEN) */}
      {currentBgImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={currentBgImage.url}
            alt={currentBgImage.title || "Kanpuriya Street Background"}
            className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ease-in-out"
            referrerPolicy="no-referrer"
          />
          {/* Atmospheric gradient & dark overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c1319]/85 via-[#0c1319]/70 to-[#070c10]/95 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* FALLBACK ATMOSPHERIC BACKGROUND NIGHT GRADIENT */}
      {!currentBgImage && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#101921] via-[#0c1319] to-[#070c10]" />
      )}
      
      {/* WARM INTERIOR GLOW SPOTLIGHT FROM SHOP */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* OVERHEAD CABLE WIRES & BULBS */}
      <div className="absolute top-0 left-0 w-full h-24 pointer-events-none z-10 opacity-60">
        <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,15 Q300,65 600,20 T1200,25" fill="none" stroke="#24323d" strokeWidth="1.5" />
          <path d="M0,35 Q400,75 800,30 T1200,40" fill="none" stroke="#18232c" strokeWidth="1.2" />
          {[120, 320, 520, 720, 920, 1100].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={30 + (i % 2) * 8} r="3" fill="#e2a865" />
              <circle cx={x} cy={30 + (i % 2) * 8} r="8" fill="rgba(226,168,101,0.25)" />
            </g>
          ))}
        </svg>
      </div>

      {/* TOP BAR: CLOCK, TUNED IN STATUS, SHUFFLE BG & NAV PILLS */}
      <header className="relative z-20 pt-3 md:pt-4 px-3 md:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 text-xs tracking-wide">
        {/* Top Row on Mobile: Time, Users & Shuffle Button */}
        <div className="flex items-center justify-between gap-2 text-[#a8b5c0] w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            {canGoBack && onGoBack && (
              <button
                onClick={onGoBack}
                className="flex items-center gap-1 px-3 py-1 bg-[#18242f] hover:bg-[#223240] text-[#e0a96d] border border-[#e0a96d]/30 rounded-full text-xs font-bold transition-all shadow-md group shrink-0"
                title="Go back"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
              </button>
            )}
            <div className="font-mono text-xs sm:text-sm tracking-wider font-semibold text-[#f0e6d2]">
              {timeFormatted} <span className="text-[10px] text-[#8a9aa8] font-normal uppercase ml-0.5 sm:ml-1">{dateFormatted} · IST</span>
            </div>
          </div>

          {/* Random Background Quick Change Button */}
          {onShuffleBgImage && currentBgImage && (
            <button
              onClick={onShuffleBgImage}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#18242f]/90 hover:bg-[#223240] text-[#e0a96d] border border-[#e0a96d]/30 rounded-full text-[11px] sm:text-xs transition-all shadow-md shrink-0"
              title="Change background image randomly"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="truncate max-w-[100px] sm:max-w-[140px]">{currentBgImage.title}</span>
              <Shuffle className="w-3 h-3 ml-0.5 opacity-80" />
            </button>
          )}

          {/* Real Live Community Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#131d24]/80 border border-white/10 rounded-full text-[#c8d4df]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-xs">{registeredUsersCount} {registeredUsersCount === 1 ? 'user registered' : 'users registered'}</span>
          </div>
        </div>

        {/* Navigation Pills Bar (Horizontally Scrollable on Mobile) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-[#121c23]/95 border border-white/10 p-1 rounded-full backdrop-blur-md shadow-xl overflow-x-auto max-w-full scrollbar-none whitespace-nowrap">
          {[
            { id: 'home', label: 'Street', icon: Disc },
            { id: 'music', label: 'Songs', icon: Music },
            { id: 'gola', label: 'Gola Mode', icon: ShoppingBag },
            { id: 'playlists', label: 'Playlists', icon: Sparkles },
            { id: 'favorites', label: 'Favorites', icon: Heart },
            { id: 'search', label: 'Search', icon: Search },
            { id: 'feedback', label: 'Chai Stall', icon: MessageSquarePlus },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'admin', label: 'Admin', icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[#e2a865] text-[#0c1319] font-bold shadow-md'
                    : 'text-[#a4b3c0] hover:text-[#f3ebd9] hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] sm:text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* MAIN CENTER SHOP SCENE (DE LUXE BARF KA GOLA) */}
      <div className="relative z-10 w-full flex-1 max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-36 md:pb-28 flex flex-col items-center justify-center">
        
        {/* Main Shop Facade Frame */}
        <div className="relative w-full max-w-2xl bg-[#121b22]/90 border border-[#d9a05b]/30 rounded-3xl p-4 sm:p-6 md:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.8)] text-center flex flex-col items-center">
          
          {/* Circular Shop Crest Badge */}
          <div className="w-14 h-14 rounded-full bg-[#1c2832] border-2 border-[#d9a05b]/60 flex items-center justify-center text-2xl shadow-xl mb-4 relative">
            <span className="absolute -inset-1 rounded-full border border-amber-500/20 animate-pulse" />
            🍧
          </div>

          {/* MAIN HINDI TITLE */}
          <h1 className="text-4xl md:text-5xl font-normal tracking-wide text-[#f5eedc] font-hindi-display mb-1 drop-shadow-md">
            कानपुरिया
          </h1>
          <h2 className="text-3xl md:text-4xl font-normal tracking-wider text-[#e0a96d] font-hindi-display mb-2">
            बर्फ़ का गोला
          </h2>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8e9fae] font-sans font-semibold mb-6">
            KANPURIYA DESI GOLA & STREET BEATS
          </p>

          {/* NOW PLAYING BADGE */}
          <div 
            onClick={() => onSelectTab('music')}
            className="cursor-pointer group flex items-center gap-3 px-5 py-2.5 bg-[#18242f] border border-white/10 hover:border-[#e0a96d]/50 rounded-full transition-all shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-[#e0a96d] animate-ping" />
            <span className="text-xs font-medium text-[#a8b7c4] uppercase tracking-wider">
              NOW PLAYING &bull; <strong className="text-[#f5eedc] font-semibold">{currentSong ? currentSong.title : 'HIGHWAY RAAT'}</strong>
            </span>
          </div>

          {/* Interactive Street Hotspots Row */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-left">
            {/* Gola Stall Hotspot */}
            <div 
              onClick={() => onSelectTab('gola')}
              className="p-4 rounded-2xl bg-[#17232d]/80 border border-white/10 hover:border-[#e0a96d]/40 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider">Raju's Gola Stall</span>
                <span className="text-[10px] text-[#8e9fae]">Customize &rarr;</span>
              </div>
              <p className="text-xs text-[#c8d4df] font-light">Fresh crushed shaved ice with Kala Khatta, Mango, & Rose syrup.</p>
            </div>

            {/* Music Discovery Hotspot */}
            <div 
              onClick={() => onSelectTab('music')}
              className="p-4 rounded-2xl bg-[#17232d]/80 border border-white/10 hover:border-[#e0a96d]/40 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider">Street Beats</span>
                <span className="text-[10px] text-[#8e9fae]">Listen &rarr;</span>
              </div>
              <p className="text-xs text-[#c8d4df] font-light">Curated regional tracks, street jams, and lofi mood playlists.</p>
            </div>

            {/* Chai Stall Hotspot */}
            <div 
              onClick={() => onSelectTab('feedback')}
              className="p-4 rounded-2xl bg-[#17232d]/80 border border-white/10 hover:border-[#e0a96d]/40 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider">Chai Stall</span>
                <span className="text-[10px] text-[#8e9fae]">Review &rarr;</span>
              </div>
              <p className="text-xs text-[#c8d4df] font-light">Leave song requests, review flavours, and chat over cutting chai.</p>
            </div>
          </div>

        </div>

      </div>

      {/* FLOATING BOTTOM MUSIC PLAYER BAR */}
      <div className="relative z-30 pb-4 px-4 flex justify-center">
        <div className="bg-[#141e26]/95 border border-white/15 px-6 py-2.5 rounded-full backdrop-blur-md shadow-2xl flex items-center gap-4 text-xs max-w-xl w-full justify-between">
          <button 
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-white text-[#0c1319] flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <div className="flex-1 min-w-0 text-center">
            <p className="text-[#f5eedc] font-medium truncate font-hindi-display text-sm">
              {currentSong ? currentSong.title : 'गली में आज चाँद निकला'}
            </p>
            <p className="text-[10px] text-[#8a9aa8] truncate">
              {currentSong ? `${currentSong.artist} • ${currentSong.language}` : 'Alka Yagnik • Classic Mood'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[#a8b5c0]">
            <button onClick={onTogglePlay} className="p-1 hover:text-white transition-colors" title="Next Song">
              <SkipForward className="w-4 h-4" />
            </button>
            <button onClick={() => onSelectTab('music')} className="p-1 hover:text-white transition-colors" title="Expand Music View">
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER CONTACT LINE */}
      <footer className="py-2 text-center text-[11px] text-[#6b7b8a] border-t border-white/5">
        contact: barfkagola.space@gmail.com
      </footer>

    </div>
  );
};
