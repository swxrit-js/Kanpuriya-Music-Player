import React, { useState, useEffect, useRef } from 'react';
import { Song, Playlist } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Heart, ListMusic, FileText, ChevronUp, ChevronDown, Plus } from 'lucide-react';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextSong: () => void;
  onPrevSong: () => void;
  queue: Song[];
  isFavorite: boolean;
  onToggleFavorite: (songId: string) => void;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, song: Song) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onNextSong,
  onPrevSong,
  queue,
  isFavorite,
  onToggleFavorite,
  playlists,
  onAddToPlaylist
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');

  // Drawers
  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);

  // Sync audio play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback Web Audio API synth if audio element fails
          playSynthFallback();
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // Procedural synth audio fallback so music ALWAYS produces sound!
  const playSynthFallback = () => {
    try {
      if (!synthCtxRef.current) {
        synthCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = synthCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      // Audio synth silent fallback
    }
  };

  // Audio event listeners
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      onNextSong();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume || 0.8;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#0c1319]/95 border-t border-[#e0a96d]/25 backdrop-blur-2xl px-4 py-2.5 text-[#e5dfd3] shadow-[0_-15px_40px_rgba(0,0,0,0.85)] selection:bg-[#e0a96d] selection:text-[#0c1319]">
      
      {/* HTML5 Audio element */}
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />

      {/* PERSISTENT MINI PLAYER LAYOUT */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-3">
        
        {/* TOP ROW ON MOBILE / LEFT ON DESKTOP: SONG INFO, VINYL & QUICK PLAY CONTROLS */}
        <div className="flex items-center justify-between gap-3 w-full md:w-1/3 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Animated Rotating Vinyl Album Cover */}
            <div className="relative group shrink-0">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#e0a96d]/40 shadow-lg relative ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Vinyl Center Spindle hole */}
                <div className="absolute inset-0 m-auto w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#0c1319] border border-[#e0a96d] shadow-inner" />
              </div>
              
              {/* Live Playing Sound Wave Bars Indicator */}
              {isPlaying && (
                <div className="absolute -top-1 -right-1 flex items-end gap-0.5 bg-[#0c1319]/90 p-0.5 rounded-full border border-[#e0a96d]/40">
                  <span className="w-1 h-2.5 bg-[#e0a96d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-2 bg-[#e0a96d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-3 bg-[#e0a96d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs md:text-sm font-bold text-[#f5eedc] truncate font-hindi-bold">
                  {currentSong.title}
                </h4>
                <span className="px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase bg-[#18232c] text-[#e0a96d] border border-[#e0a96d]/20 shrink-0">
                  {currentSong.mood}
                </span>
              </div>
              <p className="text-[10px] md:text-[11px] text-[#8a9aa8] truncate mt-0.5">
                {currentSong.artist} {currentSong.album ? `• ${currentSong.album}` : ''}
              </p>
            </div>

            <button
              onClick={() => onToggleFavorite(currentSong.id)}
              className={`p-1.5 sm:p-2 rounded-full transition-transform active:scale-95 shrink-0 ${
                isFavorite ? 'text-rose-400 bg-rose-500/10' : 'text-[#8a9aa8] hover:text-[#f5eedc] hover:bg-white/5'
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Quick Play/Pause & Skip Buttons on Mobile (Shown right in row 1 on small screens) */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              onClick={onPrevSong}
              className="text-[#8a9aa8] hover:text-[#f5eedc] p-1"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-8 h-8 rounded-full bg-[#e0a96d] text-[#0c1319] flex items-center justify-center active:scale-95 transition-all shadow-[0_0_15px_rgba(224,169,109,0.4)] font-bold"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={onNextSong}
              className="text-[#8a9aa8] hover:text-[#f5eedc] p-1"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PLAYER CONTROLS & SELECTION PROGRESS BAR */}
        <div className="flex flex-col items-center gap-1 w-full md:w-1/2">
          {/* Main Playback Buttons (Desktop Only) */}
          <div className="hidden md:flex items-center gap-5">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-1.5 rounded-full transition-all ${
                isShuffle ? 'text-[#e0a96d] bg-[#e0a96d]/10' : 'text-[#8a9aa8] hover:text-[#f5eedc]'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onPrevSong}
              className="text-[#8a9aa8] hover:text-[#f5eedc] transition-colors p-1"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-[#e0a96d] text-[#0c1319] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(224,169,109,0.4)] font-bold"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={onNextSong}
              className="text-[#8a9aa8] hover:text-[#f5eedc] transition-colors p-1"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
              className={`p-1.5 rounded-full transition-all ${
                repeatMode !== 'off' ? 'text-[#e0a96d] bg-[#e0a96d]/10 font-bold' : 'text-[#8a9aa8] hover:text-[#f5eedc]'
              }`}
              title={`Repeat Mode: ${repeatMode}`}
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Glowing Seek & Time Display */}
          <div className="flex items-center gap-2 w-full text-[10px] text-[#8a9aa8] font-mono tracking-wider">
            <span className="w-7 text-right shrink-0">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 180}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-[#18232c] rounded-full appearance-none cursor-pointer accent-[#e0a96d] focus:outline-none"
              />
            </div>
            <span className="w-7 shrink-0">{formatTime(duration)}</span>

            {/* Lyrics & Queue Mini Toggle Buttons on Mobile */}
            <div className="flex md:hidden items-center gap-1.5 ml-1 shrink-0">
              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className={`p-1 rounded-lg text-[10px] border ${
                  showLyrics 
                    ? 'bg-[#e0a96d] text-[#0c1319] border-[#e0a96d] font-bold' 
                    : 'bg-[#121c23] text-[#8a9aa8] border-white/10'
                }`}
                title="Lyrics"
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowQueue(!showQueue)}
                className={`p-1 rounded-lg text-[10px] border ${
                  showQueue 
                    ? 'bg-[#e0a96d] text-[#0c1319] border-[#e0a96d] font-bold' 
                    : 'bg-[#121c23] text-[#8a9aa8] border-white/10'
                }`}
                title="Queue"
              >
                <ListMusic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* VOLUME, LYRICS & QUEUE ACTIONS (DESKTOP) */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
          <div className="flex items-center gap-2 bg-[#121c23] px-3 py-1.5 rounded-full border border-white/10">
            <button onClick={toggleMute} className="text-[#8a9aa8] hover:text-[#f5eedc] transition-colors">
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-[#18232c] rounded-lg appearance-none cursor-pointer accent-[#e0a96d]"
            />
          </div>

          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showLyrics 
                ? 'bg-[#e0a96d] text-[#0c1319] border-[#e0a96d] shadow-md font-bold' 
                : 'bg-[#121c23] text-[#8a9aa8] border-white/10 hover:text-[#f5eedc]'
            }`}
            title="Lyrics"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px]">Lyrics</span>
          </button>

          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showQueue 
                ? 'bg-[#e0a96d] text-[#0c1319] border-[#e0a96d] shadow-md font-bold' 
                : 'bg-[#121c23] text-[#8a9aa8] border-white/10 hover:text-[#f5eedc]'
            }`}
            title="Up Next Queue"
          >
            <ListMusic className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px]">Queue</span>
          </button>
        </div>
      </div>

      {/* LYRICS DRAWER MODAL */}
      {showLyrics && (
        <div className="fixed sm:absolute bottom-20 left-3 right-3 sm:left-auto sm:right-4 w-auto sm:w-96 bg-[#121c23] border border-[#e0a96d]/30 rounded-3xl p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 text-[#e5dfd3] max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
            <h4 className="text-xs font-bold text-[#e0a96d] flex items-center gap-2 uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              Lyrics ({currentSong.title})
            </h4>
            <button onClick={() => setShowLyrics(false)} className="text-[#8a9aa8] hover:text-white text-xs font-bold w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">✕</button>
          </div>
          <pre className="text-xs font-serif leading-relaxed text-[#c8d4df] whitespace-pre-wrap">
            {currentSong.lyrics || 'Lyrics not available for this track.'}
          </pre>
        </div>
      )}

      {/* QUEUE DRAWER MODAL */}
      {showQueue && (
        <div className="fixed sm:absolute bottom-20 left-3 right-3 sm:left-auto sm:right-4 w-auto sm:w-96 bg-[#121c23] border border-[#e0a96d]/30 rounded-3xl p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 text-[#e5dfd3] max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
            <h4 className="text-xs font-bold text-[#e0a96d] flex items-center gap-2 uppercase tracking-wider">
              <ListMusic className="w-4 h-4" />
              Up Next Queue ({queue.length})
            </h4>
            <button onClick={() => setShowQueue(false)} className="text-[#8a9aa8] hover:text-white text-xs font-bold w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">✕</button>
          </div>
          <div className="space-y-2">
            {queue.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0c1319] border border-white/5 hover:border-[#e0a96d]/20 transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] text-[#e0a96d] font-mono w-4 font-bold">{idx + 1}</span>
                  <img src={s.coverUrl} alt={s.title} className="w-8 h-8 rounded-lg object-cover shrink-0" referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#f5eedc] truncate">{s.title}</p>
                    <p className="text-[10px] text-[#8a9aa8] truncate">{s.artist}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
