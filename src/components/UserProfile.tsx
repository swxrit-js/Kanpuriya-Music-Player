import React from 'react';
import { User, GolaRecipe, Song, GolaFlavour, GolaTopping } from '../types';
import { User as UserIcon, LogOut, Heart, Music, ShoppingBag, ShieldCheck, History } from 'lucide-react';

interface UserProfileProps {
  user: User | null;
  onLogout: () => void;
  savedGolas: GolaRecipe[];
  favoriteSongs: Song[];
  allFlavoursMap: Record<string, GolaFlavour>;
  allToppingsMap: Record<string, GolaTopping>;
  onPlaySong: (song: Song) => void;
  onOpenAuth: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onLogout,
  savedGolas,
  favoriteSongs,
  allFlavoursMap,
  allToppingsMap,
  onPlaySong,
  onOpenAuth
}) => {
  if (!user) {
    return (
      <div className="w-full h-full min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-center font-hindi-bold">
        <div className="bg-slate-900 border border-amber-500/30 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto mb-4 border border-amber-500/30">
            👤
          </div>
          <h2 className="text-xl md:text-2xl font-black text-amber-300 font-hindi-display">स्ट्रीट प्रोफ़ाइल में लॉगिन करें</h2>
          <p className="text-xs md:text-sm text-amber-200/90 mt-2 mb-6 font-hindi-bold">
            अपनी सेव की हुई बर्फ़ गोला रेसिपी, पसंदीदा गाने और पर्सनल स्टेट्स देखने के लिए लॉगिन करें।
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full py-3 bg-amber-500 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-lg hover:brightness-110 font-hindi-bold"
          >
            लॉगिन / साइन अप करें
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 md:p-8 pb-36 md:pb-28 font-hindi-bold">
      
      {/* PROFILE HEADER CARD */}
      <div className="bg-slate-900/90 border border-amber-500/30 p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-amber-300 font-hindi-display">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 font-hindi-bold">
                  <ShieldCheck className="w-3 h-3" /> एडमिन
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-hindi-body">{user.email}</p>
            <span className="inline-block mt-2 text-xs bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/20 font-hindi-bold">
              🍧 देसी बर्फ़ गोला एक्सपर्ट
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 font-hindi-bold"
        >
          <LogOut className="w-4 h-4" />
          <span>लॉगआउट</span>
        </button>
      </div>

      {/* SAVED GOLA RECIPES */}
      <section className="mb-10 font-hindi-bold">
        <h2 className="text-lg md:text-xl font-black text-amber-300 mb-4 flex items-center gap-2 font-hindi-display">
          🍧 सेव की हुई बर्फ़ गोला रेसिपी ({savedGolas.length})
        </h2>

        {savedGolas.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-300 text-xs md:text-sm font-hindi-bold">
            "अरे भाई! अभी तक कोई गोला नहीं बनाया? गोला मेकर में जाओ और अपना पहला गोला बनाओ!"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedGolas.map(gola => (
              <div key={gola.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm md:text-base font-bold text-amber-300 font-hindi-bold">{gola.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">{gola.createdAt}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {gola.flavours.map((item, idx) => {
                    const fObj = allFlavoursMap[item.flavourId];
                    return (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded text-slate-950 font-bold font-hindi-bold" style={{ backgroundColor: fObj?.color || '#EAB308' }}>
                        {fObj?.name || item.flavourId}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FAVORITE SONGS */}
      <section className="font-hindi-bold">
        <h2 className="text-lg md:text-xl font-black text-rose-300 mb-4 flex items-center gap-2 font-hindi-display">
          ❤️ पसंदीदा गाने ({favoriteSongs.length})
        </h2>

        {favoriteSongs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-300 text-xs md:text-sm font-hindi-bold">
            अभी कोई पसंदीदा गाना सेव नहीं किया गया। किसी भी गाने पर दिल वाले बटन को दबाकर सेव करें!
          </div>
        ) : (
          <div className="space-y-2">
            {favoriteSongs.map(song => (
              <div key={song.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-slate-100 truncate font-hindi-bold">{song.title}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 truncate font-hindi-body">{song.artist}</p>
                  </div>
                </div>
                <button
                  onClick={() => onPlaySong(song)}
                  className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-lg font-hindi-bold"
                >
                  बजाएं
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
