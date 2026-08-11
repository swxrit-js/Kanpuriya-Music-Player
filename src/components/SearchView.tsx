import React, { useState } from 'react';
import { Song, Playlist, GolaRecipe } from '../types';
import { Search, Play, Heart, Music, ShoppingBag } from 'lucide-react';

interface SearchViewProps {
  songs: Song[];
  playlists: Playlist[];
  golas: GolaRecipe[];
  onPlaySong: (song: Song) => void;
  favorites: string[];
  onToggleFavorite: (songId: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  songs,
  playlists,
  golas,
  onPlaySong,
  favorites,
  onToggleFavorite
}) => {
  const [query, setQuery] = useState('');

  const matchingSongs = songs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase()) ||
    s.language.toLowerCase().includes(query.toLowerCase()) ||
    s.mood.toLowerCase().includes(query.toLowerCase())
  );

  const matchingPlaylists = playlists.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  const matchingGolas = golas.filter(g =>
    g.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 md:p-8 pb-36 md:pb-28">
      
      {/* SEARCH INPUT BAR */}
      <div className="max-w-2xl mx-auto mb-8 font-hindi-bold">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-amber-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="गाना, कलाकार, मूड, भाषा या गोला खोजें..."
            className="w-full bg-slate-900 border-2 border-amber-500/40 pl-12 pr-4 py-3.5 rounded-2xl text-sm font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] font-hindi-bold"
          />
        </div>
      </div>

      {/* RESULTS OR EMPTY STATE */}
      {query.trim() === '' ? (
        <div className="text-center py-16 text-slate-400 font-hindi-bold">
          <span className="text-4xl mb-3 block">🔎</span>
          <p className="text-sm font-hindi-display text-amber-200">
            "किसी गाने का नाम, भाषा (जैसे 'पंजाबी') या मूड लिखकर खोजें..."
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 font-hindi-bold">
          
          {/* SONGS RESULTS */}
          <div>
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2 font-hindi-display">
              <Music className="w-4 h-4" /> मिलते-जुलते गाने ({matchingSongs.length})
            </h3>

            {matchingSongs.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3 bg-slate-900/40 rounded-xl font-hindi-bold">
                अरे भाई! कोई गाना नहीं मिला। कुछ और लिखकर खोजें!
              </p>
            ) : (
              <div className="space-y-2">
                {matchingSongs.map(song => {
                  const isFav = favorites.includes(song.id);
                  return (
                    <div key={song.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div className="min-w-0">
                          <h4 className="text-xs md:text-sm font-bold text-slate-100 truncate font-hindi-bold">{song.title}</h4>
                          <p className="text-[10px] md:text-xs text-slate-400 truncate font-hindi-body">{song.artist} • {song.language}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleFavorite(song.id)} className={`p-1.5 ${isFav ? 'text-red-500' : 'text-slate-500'}`}>
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                        <button onClick={() => onPlaySong(song)} className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-lg font-hindi-bold">
                          बजाएं
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PLAYLISTS RESULTS */}
          {matchingPlaylists.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-3 font-hindi-display">
                मिलती-जुलती प्लेलिस्ट्स ({matchingPlaylists.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchingPlaylists.map(pl => (
                  <div key={pl.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <img src={pl.coverUrl} alt={pl.title} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-slate-100 font-hindi-bold">{pl.title}</h4>
                      <p className="text-[10px] md:text-xs text-slate-400 line-clamp-1 font-hindi-body">{pl.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
