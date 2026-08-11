import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GolaFlavour, GolaTopping, GolaContainer, GolaDecoration, SelectedFlavour, Song, GolaRecipe } from '../types';
import { GolaCanvasVisualizer } from './GolaCanvasVisualizer';
import { Sparkles, Play, Pause, SkipForward, Volume2, Save, RotateCcw, Share2, Check, Music } from 'lucide-react';

interface GolaCreatorProps {
  flavours: GolaFlavour[];
  toppings: GolaTopping[];
  containers: GolaContainer[];
  decorations: GolaDecoration[];
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextSong: () => void;
  onSaveGola: (recipe: Omit<GolaRecipe, 'id' | 'createdAt' | 'likes'>) => void;
}

export const GolaCreator: React.FC<GolaCreatorProps> = ({
  flavours,
  toppings,
  containers,
  decorations,
  currentSong,
  isPlaying,
  onTogglePlay,
  onNextSong,
  onSaveGola
}) => {
  // Gola State
  const [golaName, setGolaName] = useState('My Desi Special Gola');
  const [baseIce, setBaseIce] = useState<'crushed' | 'snow' | 'fine'>('crushed');
  const [selectedFlavours, setSelectedFlavours] = useState<SelectedFlavour[]>([
    { flavourId: 'kala_khatta', quantity: 2 },
    { flavourId: 'mango', quantity: 1 }
  ]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['tutti_frutti', 'sprinkles']);
  const [selectedContainerId, setSelectedContainerId] = useState<string>('paper_cup');
  const [selectedDecorationId, setSelectedDecorationId] = useState<string>('mini_umbrella');

  // Active customization tab
  const [activeSubTab, setActiveSubTab] = useState<'base' | 'flavours' | 'toppings' | 'container' | 'decoration'>('flavours');
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const selectedContainer = containers.find(c => c.id === selectedContainerId) || containers[0] || null;
  const selectedDecoration = decorations.find(d => d.id === selectedDecorationId) || null;

  // Derive music Framer Motion animation parameters from current song mood & playback state
  const currentMood = currentSong?.mood || 'desivibes';

  const moodConfig = React.useMemo(() => {
    if (!isPlaying) {
      return {
        animate: { rotate: 0, scale: 1, y: 0 },
        transition: { duration: 0.5, ease: 'easeOut' },
        glowColor: 'rgba(224, 169, 109, 0.15)',
        sparkles: ['✨', '🍧'],
        badgeText: '⏸️ Music Paused • Still',
      };
    }

    switch (currentMood) {
      case 'party':
      case 'workout':
        return {
          animate: {
            rotate: [-4, 4, -4, 3, -3],
            scale: [1, 1.07, 0.96, 1.05, 1],
            y: [0, -10, 0, -6, 0],
          },
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          glowColor: 'rgba(236, 72, 153, 0.5)',
          sparkles: ['✨', '⚡', '🌟', '💥', '🎶', '💖'],
          badgeText: '⚡ Party Wobble (128 BPM)',
        };
      case 'chill':
      case 'latenight':
      case 'nostalgia':
        return {
          animate: {
            rotate: [-2, 2, -2],
            scale: [1, 1.025, 1],
            y: [0, -6, 0],
          },
          transition: {
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          glowColor: 'rgba(20, 184, 166, 0.35)',
          sparkles: ['✨', '❄️', '💧', '🌙', '🌌'],
          badgeText: '🌙 Chill Sway (75 BPM)',
        };
      case 'romantic':
      case 'sad':
        return {
          animate: {
            rotate: [-1.5, 1.5, -1.5],
            scale: [1, 1.035, 0.99, 1],
            y: [0, -5, 0],
          },
          transition: {
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          glowColor: 'rgba(244, 63, 94, 0.4)',
          sparkles: ['✨', '🌸', '💖', '🍧', '💫'],
          badgeText: '🌸 Heartbeat Pulse (90 BPM)',
        };
      case 'desivibes':
      case 'roadtrip':
      default:
        return {
          animate: {
            rotate: [-3, 3, -3],
            scale: [1, 1.05, 0.98, 1],
            y: [0, -7, 0],
          },
          transition: {
            duration: 0.85,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          glowColor: 'rgba(245, 158, 11, 0.45)',
          sparkles: ['✨', '🌟', '🍧', '🎶', '🔥'],
          badgeText: '🔥 Desi Beat Bounce (108 BPM)',
        };
    }
  }, [isPlaying, currentMood]);

  // Flavour toggle & syrup slider
  const handleToggleFlavour = (flavourId: string) => {
    const existingIndex = selectedFlavours.findIndex(f => f.flavourId === flavourId);
    if (existingIndex >= 0) {
      // Remove
      setSelectedFlavours(selectedFlavours.filter(f => f.flavourId !== flavourId));
    } else {
      // Add with default quantity 2
      setSelectedFlavours([...selectedFlavours, { flavourId, quantity: 2 }]);
    }
  };

  const handleChangeFlavourQuantity = (flavourId: string, qty: number) => {
    setSelectedFlavours(
      selectedFlavours.map(f => f.flavourId === flavourId ? { ...f, quantity: qty } : f)
    );
  };

  // Topping toggle
  const handleToggleTopping = (toppingId: string) => {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter(id => id !== toppingId));
    } else {
      setSelectedToppings([...selectedToppings, toppingId]);
    }
  };

  // Save Gola Action
  const handleSave = () => {
    onSaveGola({
      name: golaName || 'Desi Delight Gola',
      baseIce,
      flavours: selectedFlavours,
      toppings: selectedToppings,
      containerId: selectedContainerId,
      decorationId: selectedDecorationId,
      songPlayedId: currentSong?.id,
      songPlayedTitle: currentSong?.title,
      createdBy: 'user_1',
      createdByName: 'Desi Music Lover'
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Quick Preset Golas
  const applyPreset = (preset: 'kala_khatta_special' | 'mango_berry' | 'blue_ocean') => {
    if (preset === 'kala_khatta_special') {
      setGolaName('Shahi Kala Khatta Punch');
      setSelectedFlavours([{ flavourId: 'kala_khatta', quantity: 3 }, { flavourId: 'rose', quantity: 1 }]);
      setSelectedToppings(['tutti_frutti', 'silver_varak', 'glazed_cherry']);
      setSelectedContainerId('glass');
      setSelectedDecorationId('mini_umbrella');
    } else if (preset === 'mango_berry') {
      setGolaName('Alphonso Berry Splash');
      setSelectedFlavours([{ flavourId: 'mango', quantity: 3 }, { flavourId: 'strawberry', quantity: 2 }]);
      setSelectedToppings(['jelly', 'sprinkles', 'coconut']);
      setSelectedContainerId('paper_cup');
      setSelectedDecorationId('mint_crown');
    } else if (preset === 'blue_ocean') {
      setGolaName('Electric Blue Lagoon');
      setSelectedFlavours([{ flavourId: 'blue_lagoon', quantity: 3 }, { flavourId: 'lemon', quantity: 1 }]);
      setSelectedToppings(['jelly', 'falooda']);
      setSelectedContainerId('stick_colourful');
      setSelectedDecorationId('spiral_straw');
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#0c1319] text-[#e5dfd3] p-3 sm:p-6 md:p-8 pb-36 md:pb-28 flex flex-col justify-between selection:bg-[#e0a96d] selection:text-[#0c1319]">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍧</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-normal text-[#f5eedc] font-hindi-display">
              लाइव बर्फ़ का गोला मेकर
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#8a9aa8] mt-1">
            Craft your custom shaved ice gola live while enjoying street music!
          </p>
        </div>

        {/* Preset Quick Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap pb-1 md:pb-0 text-xs">
          <span className="font-semibold text-[#8a9aa8] shrink-0">Popular Presets:</span>
          <button
            onClick={() => applyPreset('kala_khatta_special')}
            className="px-3 py-1 bg-[#18232c] hover:bg-[#202e3a] border border-white/10 text-[#e0a96d] font-medium rounded-full transition-all shrink-0"
          >
            🍇 Royal Kala Khatta
          </button>
          <button
            onClick={() => applyPreset('mango_berry')}
            className="px-3 py-1 bg-[#18232c] hover:bg-[#202e3a] border border-white/10 text-[#e0a96d] font-medium rounded-full transition-all shrink-0"
          >
            🥭 Alphonso Berry
          </button>
          <button
            onClick={() => applyPreset('blue_ocean')}
            className="px-3 py-1 bg-[#18232c] hover:bg-[#202e3a] border border-white/10 text-[#e0a96d] font-medium rounded-full transition-all shrink-0"
          >
            🌊 Blue Lagoon
          </button>
        </div>
      </div>

      {/* SPLIT LAYOUT: LEFT VISUALIZER & MUSIC, RIGHT CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 items-start">
        
        {/* LEFT COLUMN: REAL-TIME GOLA CANVAS & MUSIC PLAYER INTEGRATION */}
        <div className="lg:col-span-5 flex flex-col items-center bg-[#121c23] border border-[#e0a96d]/30 p-4 sm:p-6 rounded-3xl shadow-[0_0_40px_rgba(224,169,109,0.1)] relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#e0a96d]/5 via-transparent to-[#d9a05b]/5 pointer-events-none" />

          {/* Gola Name Input */}
          <div className="w-full mb-4 z-10 font-hindi-bold">
            <label className="text-xs md:text-sm text-[#e0a96d] font-bold uppercase tracking-wider block mb-1">
              अपने बर्फ़ गोले का नाम रखिए:
            </label>
            <input
              type="text"
              value={golaName}
              onChange={(e) => setGolaName(e.target.value)}
              placeholder="गोले का नाम लिखें..."
              className="w-full bg-[#0c1319] border border-[#e0a96d]/30 px-3 py-2 rounded-xl text-sm font-bold text-[#f5eedc] focus:outline-none focus:border-[#e0a96d] font-hindi-bold"
            />
          </div>

          {/* Music Reaction Badge */}
          <div className="z-10 mb-2">
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#18232c] border border-white/10 text-[#e0a96d] shadow-sm flex items-center gap-1.5">
              <span>{moodConfig.badgeText}</span>
            </span>
          </div>

          {/* Real-time Interactive Animated Gola Canvas */}
          <div className="my-2 z-10 relative flex items-center justify-center">
            {/* Dynamic Mood-based Backdrop Aura Glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
              animate={{
                scale: isPlaying ? [1, 1.25, 1] : 1,
                opacity: isPlaying ? [0.4, 0.75, 0.4] : 0.2,
              }}
              transition={{
                duration: moodConfig.transition.duration * 1.5,
                repeat: isPlaying ? Infinity : 0,
                ease: 'easeInOut',
              }}
              style={{ backgroundColor: moodConfig.glowColor }}
            />

            {/* Sparkles / Particles Floating around Gola */}
            {isPlaying && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {moodConfig.sparkles.map((emoji, idx) => {
                  const angle = (idx / moodConfig.sparkles.length) * Math.PI * 2;
                  const radius = 100;
                  const initialX = Math.cos(angle) * radius;
                  const initialY = Math.sin(angle) * radius;

                  return (
                    <motion.span
                      key={idx}
                      className="absolute text-lg select-none"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      animate={{
                        x: [initialX, initialX + (idx % 2 === 0 ? 12 : -12), initialX],
                        y: [initialY, initialY - 15, initialY],
                        scale: [0.8, 1.3, 0.8],
                        rotate: [0, 180, 360],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.2 + idx * 0.3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {emoji}
                    </motion.span>
                  );
                })}
              </div>
            )}

            {/* Wobbling Framer Motion Gola Container */}
            <motion.div
              className="cursor-pointer select-none"
              animate={moodConfig.animate}
              transition={moodConfig.transition}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95, rotate: 6 }}
            >
              <GolaCanvasVisualizer
                baseIce={baseIce}
                flavours={selectedFlavours}
                allFlavoursMap={flavoursMap}
                toppings={selectedToppings}
                allToppingsMap={toppingsMap}
                container={selectedContainer}
                decoration={selectedDecoration}
                isPlaying={isPlaying}
                size="lg"
              />
            </motion.div>
          </div>

          {/* Integrated Music Player Control Bar */}
          <div className="w-full mt-4 bg-[#0c1319] p-4 rounded-2xl border border-white/10 z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#e0a96d] text-[#0c1319] flex items-center justify-center font-bold text-base shrink-0 shadow-md">
                <Music className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#f5eedc] truncate">
                  {currentSong ? currentSong.title : 'Gola & Chai Highway'}
                </p>
                <p className="text-[10px] text-[#e0a96d] truncate">
                  {currentSong ? currentSong.artist : 'Raju & The Streetbeats'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePlay}
                className="w-9 h-9 rounded-full bg-[#e0a96d] text-[#0c1319] flex items-center justify-center hover:scale-110 transition-transform shadow-md font-bold"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                onClick={onNextSong}
                className="w-8 h-8 rounded-full bg-[#18232c] text-[#8a9aa8] hover:text-[#f5eedc] flex items-center justify-center transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            className="w-full mt-4 py-3 bg-[#e0a96d] hover:bg-[#d9a05b] text-[#0c1319] font-hindi-bold font-bold text-sm md:text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 z-10"
          >
            {savedSuccess ? <Check className="w-5 h-5 text-[#0c1319]" /> : <Save className="w-5 h-5" />}
            <span>{savedSuccess ? 'रेसिपी आपकी प्रोफ़ाइल में सेव हो गई!' : 'गोला रेसिपी सेव करें'}</span>
          </button>
        </div>

        {/* RIGHT COLUMN: CUSTOMIZATION CONTROLS PANEL */}
        <div className="lg:col-span-7 bg-[#121c23] border border-white/10 p-6 rounded-3xl flex flex-col justify-between">
          
          {/* Sub-Tab Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-white/10 mb-6 text-xs">
            {[
              { id: 'flavours', label: '1. Syrups & Flavours', icon: '🍇' },
              { id: 'toppings', label: '2. Toppings', icon: '🍬' },
              { id: 'base', label: '3. Ice Texture', icon: '🧊' },
              { id: 'container', label: '4. Container & Stick', icon: '🥤' },
              { id: 'decoration', label: '5. Decoration', icon: '☂️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeSubTab === tab.id
                    ? 'bg-[#e0a96d] text-[#0c1319] shadow-md font-bold'
                    : 'bg-[#18232c] text-[#a8b5c0] border border-white/10 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* SUB-TAB 1: SYRUPS & FLAVOURS */}
          {activeSubTab === 'flavours' && (
            <div className="space-y-4 font-hindi-bold">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm font-bold text-amber-300 uppercase tracking-wider">
                  स्वादिष्ट सिरप चुनें और मात्रा सेट करें:
                </p>
                <span className="text-xs text-slate-400 font-hindi-bold">
                  {selectedFlavours.length} चुने गए
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {flavours.map(f => {
                  const isSelected = selectedFlavours.some(sf => sf.flavourId === f.id);
                  const currentQty = selectedFlavours.find(sf => sf.flavourId === f.id)?.quantity || 1;

                  return (
                    <div
                      key={f.id}
                      className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-white/40 shrink-0"
                            style={{ backgroundColor: f.color }}
                          />
                          <span className="text-xs font-bold text-slate-100 truncate">
                            {f.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleFlavour(f.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isSelected ? '✓' : '+'}
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        {f.tasteNote}
                      </p>

                      {/* Quantity Slider if Selected */}
                      {isSelected && (
                        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[9px] text-amber-400 font-mono">
                            {currentQty === 1 ? 'Light' : currentQty === 2 ? 'Medium' : 'Extra'}
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3].map(q => (
                              <button
                                key={q}
                                onClick={() => handleChangeFlavourQuantity(f.id, q)}
                                className={`w-5 h-5 rounded text-[10px] font-bold ${
                                  currentQty === q ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: TOPPINGS */}
          {activeSubTab === 'toppings' && (
            <div className="space-y-4 font-hindi-bold">
              <p className="text-xs md:text-sm font-bold text-amber-300 uppercase tracking-wider">
                ऊपर से डालने वाली स्वादिष्ट टॉपिंग्स व कैंडीज चुनें:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {toppings.map(t => {
                  const isSelected = selectedToppings.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleToggleTopping(t.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl">{t.icon || '🍬'}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-100 truncate">{t.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{t.description}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isSelected ? '✓' : '+'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: ICE BASE */}
          {activeSubTab === 'base' && (
            <div className="space-y-4 font-hindi-bold">
              <p className="text-xs md:text-sm font-bold text-amber-300 uppercase tracking-wider">
                बर्फ़ पिसाई का प्रकार चुनें:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'crushed', title: 'पारंपरिक क्रश्ड आइस', desc: 'क्लासिक हाथ से पिसी बर्फ़ जिसमें असली क्रंच हो।', icon: '🧊' },
                  { id: 'snow', title: 'स्नो आइस (बर्फ़ खोया)', desc: 'नरम कॉटन जैसी मलाईदार बर्फ़ जो तुरंत पिघल जाए।', icon: '❄️' },
                  { id: 'fine', title: 'फाइन स्लश आइस', desc: 'महीन दानेदार बर्फ़ जो सारा सिरप सोख ले।', icon: '🍧' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBaseIce(b.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      baseIce === b.id
                        ? 'bg-slate-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-3xl mb-2">{b.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{b.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{b.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 4: CONTAINER */}
          {activeSubTab === 'container' && (
            <div className="space-y-4 font-hindi-bold">
              <p className="text-xs md:text-sm font-bold text-amber-300 uppercase tracking-wider">
                सर्विंग कप, गिलास या स्टिक चुनें:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto">
                {containers.map(c => {
                  const isSelected = selectedContainerId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedContainerId(c.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{c.icon || '🥤'}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{c.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{c.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB 5: DECORATION */}
          {activeSubTab === 'decoration' && (
            <div className="space-y-4 font-hindi-bold">
              <p className="text-xs md:text-sm font-bold text-amber-300 uppercase tracking-wider">
                सुंदर सजावट जोड़ें:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {decorations.map(d => {
                  const isSelected = selectedDecorationId === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDecorationId(d.id)}
                      className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-3xl">{d.icon || '☂️'}</span>
                      <span className="text-xs font-bold text-slate-200">{d.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
