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

  const [audioError, setAudioError] = useState<string | null>(null);

  const loadedSongIdRef = useRef<string>('');

  // Sync audio play/pause state and handle song change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    setAudioError(null);

    // Only set src and load if song ID or audio URL changed
    const songKey = `${currentSong.id}_${currentSong.audioUrl}`;
    if (loadedSongIdRef.current !== songKey) {
      loadedSongIdRef.current = songKey;
      audio.src = currentSong.audioUrl || '';
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio play error:", err);
          if (err.name === 'NotAllowedError') {
            setAudioError("Click ▶ Play on bottom player to enable audio.");
          } else {
            setAudioError("Unable to play audio stream.");
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

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

  if (!currentSong) {
    return (
      <div className="fixed bottom-3 inset-x-0 z-50 px-3 sm:px-4 pointer-events-none flex justify-center">
        <div className="pointer-events-auto bg-[#141e26]/95 border border-[#e0a96d]/30 px-5 py-3 rounded-full backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.85)] max-w-xl w-full flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#18232c] border border-[#e0a96d]/40 flex items-center justify-center text-sm shadow-inner shrink-0 text-[#e0a96d]">
              🎵
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#f5eedc] font-hindi-bold">Kanpuriya Street Player</h4>
              <p className="text-[10px] text-[#8a9aa8]">No track playing • Upload or select a song from catalog</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 inset-x-0 z-50 px-3 sm:px-4 pointer-events-none flex justify-center">
      {/* HTML5 Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
        onError={() => {
          const src = audioRef.current?.src || '';
          console.warn("Audio element failed to load src:", src);
          setAudioError("Audio file unavailable. Please re-upload in Admin Panel.");
        }}
      />

      {/* FLOATING PILL PLAYER CONTAINER */}
      <div className="pointer-events-auto bg-[#141e26]/95 border border-[#e0a96d]/35 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] max-w-3xl w-full flex items-center justify-between gap-2.5 sm:gap-4 text-xs">
        
        {/* LEFT: VINYL COVER & TRACK METADATA */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 sm:flex-initial">
          {/* Animated Rotating Vinyl Album Cover */}
          <div className="relative group shrink-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#e0a96d]/50 shadow-md relative ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Vinyl Spindle hole */}
              <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-[#0c1319] border border-[#e0a96d] shadow-inner" />
            </div>
            
            {/* Live Playing Bars */}
            {isPlaying && (
              <div className="absolute -top-1 -right-1 flex items-end gap-0.5 bg-[#0c1319]/90 p-0.5 rounded-full border border-[#e0a96d]/40">
                <span className="w-0.5 h-2 bg-[#e0a96d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 h-1.5 bg-[#e0a96d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 h-2.5 bg-[#e0a96d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-bold text-[#f5eedc] truncate font-hindi-bold leading-tight">
              {currentSong.title}
            </p>
            <p className="text-[10px] text-[#8a9aa8] truncate mt-0.5">
              {currentSong.artist}
            </p>
          </div>

          <button
            onClick={() => onToggleFavorite(currentSong.id)}
            className={`p-1 rounded-full transition-transform active:scale-95 shrink-0 sm:ml-1 ${
              isFavorite ? 'text-rose-400' : 'text-[#8a9aa8] hover:text-[#f5eedc]'
            }`}
            title={isFavorite ? "Remove Favorite" : "Add Favorite"}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* CENTER: PLAYBACK CONTROLS & SEEK BAR */}
        <div className="flex flex-col items-center gap-0.5 flex-1 max-w-xs min-w-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`hidden sm:block p-1 rounded-full transition-all ${
                isShuffle ? 'text-[#e0a96d]' : 'text-[#8a9aa8] hover:text-[#f5eedc]'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-3 h-3" />
            </button>

            <button
              onClick={onPrevSong}
              className="text-[#8a9aa8] hover:text-[#f5eedc] transition-colors p-1"
              title="Previous Track"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-8 h-8 rounded-full bg-[#e0a96d] text-[#0c1319] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(224,169,109,0.5)] font-bold shrink-0"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={onNextSong}
              className="text-[#8a9aa8] hover:text-[#f5eedc] transition-colors p-1"
              title="Next Track"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
              className={`hidden sm:block p-1 rounded-full transition-all ${
                repeatMode !== 'off' ? 'text-[#e0a96d] font-bold' : 'text-[#8a9aa8] hover:text-[#f5eedc]'
              }`}
              title={`Repeat Mode: ${repeatMode}`}
            >
              <Repeat className="w-3 h-3" />
            </button>
          </div>

          {/* Mini Seek Slider */}
          <div className="flex items-center gap-1.5 w-full text-[9px] text-[#8a9aa8] font-mono">
            <span className="w-6 text-right shrink-0">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 180}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-[#18232c] rounded-full appearance-none cursor-pointer accent-[#e0a96d] focus:outline-none"
            />
            <span className="w-6 shrink-0">{formatTime(duration)}</span>
          </div>
        </div>

        {/* RIGHT: VOLUME, LYRICS & QUEUE BUTTONS */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="hidden md:flex items-center gap-1 bg-[#0c1319]/80 px-2 py-1 rounded-full border border-white/10">
            <button onClick={toggleMute} className="text-[#8a9aa8] hover:text-[#f5eedc]">
              {isMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-12 h-1 bg-[#18232c] rounded-lg appearance-none cursor-pointer accent-[#e0a96d]"
            />
          </div>

          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={`p-1.5 rounded-full text-xs font-semibold transition-all border ${
              showLyrics 
                ? 'bg-[#e0a96d] text-[#0c1319] border-[#e0a96d] font-bold' 
                : 'bg-[#0c1319]/80 text-[#8a9aa8] border-white/10 hover:text-[#f5eedc]'
            }`}
            title="Lyrics"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`p-1.5 rounded-full text-xs font-semibold transition-all border ${
              showQueue 
                ? 'bg-[#e0a96d] text-[#0c1319] border-[#e0a96d] font-bold' 
                : 'bg-[#0c1319]/80 text-[#8a9aa8] border-white/10 hover:text-[#f5eedc]'
            }`}
            title="Up Next Queue"
          >
            <ListMusic className="w-3.5 h-3.5" />
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
