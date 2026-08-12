import React, { useState } from 'react';
import { Song, Playlist, MusicLanguage, MusicMood } from '../types';
import { Play, Pause, Heart, Sparkles, Disc, Music, Flame } from 'lucide-react';

interface MusicDiscoveryProps {
  songs: Song[];
  playlists: Playlist[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  favorites: string[];
  onSelectPlaylist: (playlist: Playlist) => void;
}

export const MusicDiscovery: React.FC<MusicDiscoveryProps> = ({
  songs,
  playlists,
  currentSong,
  isPlaying,
  onPlaySong,
  onToggleFavorite,
  favorites,
  onSelectPlaylist
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedMood, setSelectedMood] = useState<string>('All');

  const languages: (MusicLanguage | 'All')[] = [
    'All', 'Hindi', 'Punjabi', 'Bhojpuri', 'Haryanvi', 'Rajasthani', 'Marathi', 'Bengali', 'Gujarati', 'Tamil', 'Telugu'
  ];

  const moods: (MusicMood | 'All')[] = [
    'All', 'chill', 'party', 'romantic', 'sad', 'workout', 'roadtrip', 'latenight', 'nostalgia', 'desivibes'
  ];

  // Filter songs
  const filteredSongs = songs.filter(s => {
    const langMatch = selectedLanguage === 'All' || s.language === selectedLanguage;
    const moodMatch = selectedMood === 'All' || s.mood === selectedMood;
    return langMatch && moodMatch;
  });

  const trendingSongs = songs.filter(s => s.trending);
  const featuredSongs = songs.filter(s => s.featured);

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 md:p-8 pb-36 md:pb-28">
      
      {/* HEADER BAR */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-normal text-[#f5eedc] font-hindi-display flex items-center gap-2">
            <span>🎵</span> देसी संगीत दुकान
          </h1>
          <p className="text-xs md:text-sm text-[#8a9aa8] mt-1">
            Discover regional street beats, trending tracks, and mood playlists.
          </p>
        </div>
      </div>

      {/* CATEGORY FILTERS: LANGUAGES & MOODS */}
      <div className="space-y-4 mb-8 text-xs">
        {/* Languages filter */}
        <div>
          <p className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider mb-2">
            Filter by Language:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap shrink-0 ${
                  selectedLanguage === lang
                    ? 'bg-[#e0a96d] text-[#0c1319] font-bold shadow-md'
                    : 'bg-[#18232c] text-[#a8b5c0] border border-white/10 hover:text-white'
                }`}
              >
                {lang === 'All' ? 'All Languages' : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Moods filter */}
        <div>
          <p className="text-xs font-semibold text-[#e0a96d] uppercase tracking-wider mb-2">
            Filter by Mood:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
            {moods.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMood(m)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap shrink-0 uppercase ${
                  selectedMood === m
                    ? 'bg-[#e0a96d] text-[#0c1319] font-bold shadow-md'
                    : 'bg-[#18232c] text-[#a8b5c0] border border-white/10 hover:text-white'
                }`}
              >
                {m === 'All' ? 'All Moods' : m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TRENDING NOW SECTION */}
      {trendingSongs.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-normal text-[#f5eedc] flex items-center gap-2 font-hindi-display">
              🔥 Trending Street Beats
            </h2>
            <span className="text-xs text-[#8a9aa8]">Popular tracks on the street</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingSongs.map(song => {
              const isSelected = currentSong?.id === song.id;
              const isFav = favorites.includes(song.id);

              return (
                <div
                  key={song.id}
                  className={`p-4 rounded-2xl bg-slate-900/90 border transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${
                    isSelected
                      ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Overlay Play button */}
                    <button
                      onClick={() => onPlaySong(song)}
                      className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                        {isSelected && isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </div>
                    </button>

                    <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-300 border border-amber-500/30 uppercase">
                      {song.mood}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-100 truncate">{song.title}</h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{song.artist}</p>
                    </div>

                    <button
                      onClick={() => onToggleFavorite(song.id)}
                      className={`p-1 rounded-full ${isFav ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FEATURED PLAYLISTS SECTION */}
      {playlists.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-normal text-[#f5eedc] flex items-center gap-2 font-hindi-display">
              ✨ Curated Street Playlists
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {playlists.map(pl => (
              <div
                key={pl.id}
                onClick={() => onSelectPlaylist(pl)}
                className="p-5 rounded-3xl bg-[#131d25] border border-white/10 hover:border-[#e0a96d]/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <img
                    src={pl.coverUrl}
                    alt={pl.title}
                    className="w-full h-40 object-cover rounded-2xl mb-4 group-hover:scale-[1.02] transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="text-base font-bold text-[#f5eedc] group-hover:text-[#e0a96d] transition-colors">
                    {pl.title}
                  </h3>
                  <p className="text-xs text-[#8a9aa8] mt-1 line-clamp-2">
                    {pl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#8a9aa8]">
                  <span>{pl.songs.length} Tracks</span>
                  <span className="text-[#e0a96d] font-semibold group-hover:underline">Listen Now &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ALL SONGS CATALOG (FILTERED) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-normal text-[#f5eedc] flex items-center gap-2 font-hindi-display">
            🎶 Song Catalog ({filteredSongs.length})
          </h2>
        </div>

        {filteredSongs.length === 0 ? (
          <div className="p-8 text-center bg-[#131d25] border border-white/10 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#e0a96d]/10 text-[#e0a96d] flex items-center justify-center mx-auto text-xl">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#f5eedc]">No Songs Added Yet</h3>
            <p className="text-xs text-[#8a9aa8] max-w-sm mx-auto">
              There are currently no songs in the store. Log in as Admin to upload your real audio tracks and albums!
            </p>
          </div>
        ) : (

        <div className="space-y-2">
          {filteredSongs.map((song, index) => {
            const isSelected = currentSong?.id === song.id;
            const isFav = favorites.includes(song.id);

            return (
              <div
                key={song.id}
                className={`p-3 rounded-2xl bg-slate-900/80 border flex items-center justify-between gap-4 transition-all hover:bg-slate-900 ${
                  isSelected ? 'border-amber-400 bg-slate-900' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs font-mono font-bold text-amber-400 w-5">{index + 1}</span>
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-slate-100 truncate">{song.title}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 truncate">{song.artist} • {song.language}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline-block text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-semibold uppercase">
                    {song.mood}
                  </span>

                  <button
                    onClick={() => onToggleFavorite(song.id)}
                    className={`p-1.5 rounded-full ${isFav ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => onPlaySong(song)}
                    className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isSelected && isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>
    </div>
  );
};
