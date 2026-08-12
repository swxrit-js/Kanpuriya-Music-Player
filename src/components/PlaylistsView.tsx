import React, { useState } from 'react';
import { Playlist, Song } from '../types';
import { Sparkles, Plus, Play, Trash2, Edit3, Music } from 'lucide-react';

interface PlaylistsViewProps {
  playlists: Playlist[];
  onCreatePlaylist: (title: string, description: string) => void;
  onPlaySong: (song: Song) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  playlists,
  onCreatePlaylist,
  onPlaySong,
  onSelectPlaylist
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreatePlaylist(title, desc);
    setTitle('');
    setDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#0c1319] text-[#e5dfd3] p-3 sm:p-6 md:p-8 pb-36 md:pb-28 font-sans">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-normal text-[#f5eedc] font-hindi-display flex items-center gap-2">
            <span>✨</span> स्ट्रीट प्लेलिस्ट्स
          </h1>
          <p className="text-xs md:text-sm text-[#8a9aa8] mt-1">
            Curated song collections for every mood, chai time, and gola break.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#e0a96d] text-[#0c1319] font-bold text-xs md:text-sm rounded-full shadow-md hover:brightness-110 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="p-10 text-center bg-[#131d25] border border-white/10 rounded-3xl space-y-4 max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-[#e0a96d]/10 text-[#e0a96d] flex items-center justify-center mx-auto text-2xl">
            <Music className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#f5eedc]">No Playlists Created Yet</h3>
          <p className="text-xs text-[#8a9aa8]">
            You haven't created any custom playlists. Click the <strong>"New Playlist"</strong> button above to start your first street music collection!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-[#e0a96d] text-[#0c1319] font-bold text-xs rounded-full shadow-md hover:brightness-110 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Playlist</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="w-full h-44 object-cover rounded-2xl mb-4 group-hover:scale-[1.02] transition-transform"
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-base font-bold text-[#f5eedc] group-hover:text-[#e0a96d] transition-colors">
                  {pl.title}
                </h3>
                <p className="text-xs text-[#8a9aa8] mt-1 line-clamp-2">{pl.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#8a9aa8]">
                <span>{pl.songs.length} Tracks</span>
                <span className="text-[#e0a96d] font-semibold group-hover:underline">Play Playlist &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE PLAYLIST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-[#070c10]/85 backdrop-blur-md flex items-center justify-center p-4 pb-24">
          <div className="bg-[#121c23] border border-white/15 p-6 rounded-3xl max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-normal text-[#f5eedc] mb-4 font-hindi-display">नयी स्ट्रीट प्लेलिस्ट बनाएं</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="text-xs text-[#8a9aa8] block mb-1">Playlist Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Late Night Street Beats"
                  className="w-full bg-[#0c1319] border border-white/10 px-3 py-2 rounded-xl text-xs text-[#f5eedc] focus:outline-none focus:border-[#e0a96d]"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-[#8a9aa8] block mb-1">Description</label>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Add a brief description..."
                  className="w-full bg-[#0c1319] border border-white/10 px-3 py-2 rounded-xl text-xs text-[#f5eedc] focus:outline-none focus:border-[#e0a96d] h-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#18232c] text-[#8a9aa8] rounded-full hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#e0a96d] text-[#0c1319] font-bold rounded-full shadow-md"
                >
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
