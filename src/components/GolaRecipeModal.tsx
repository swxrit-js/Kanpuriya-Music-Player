import React from 'react';
import { GolaRecipe, GolaFlavour, GolaTopping, GolaContainer, GolaDecoration } from '../types';
import confetti from 'canvas-confetti';
import { Share2, Download, Copy, Check, Sparkles, Music, Heart } from 'lucide-react';

interface GolaRecipeModalProps {
  recipe: GolaRecipe;
  allFlavoursMap: Record<string, GolaFlavour>;
  allToppingsMap: Record<string, GolaTopping>;
  containers: GolaContainer[];
  decorations: GolaDecoration[];
  onClose: () => void;
  onRemix: (recipe: GolaRecipe) => void;
}

export const GolaRecipeModal: React.FC<GolaRecipeModalProps> = ({
  recipe,
  allFlavoursMap,
  allToppingsMap,
  containers,
  decorations,
  onClose,
  onRemix
}) => {
  const [copied, setCopied] = React.useState(false);

  const containerObj = containers.find(c => c.id === recipe.containerId);
  const decorationObj = decorations.find(d => d.id === recipe.decorationId);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleShareLink = () => {
    triggerConfetti();
    const shareText = `Check out my custom Barf Ka Gola: "${recipe.name}" created on Desi Barf Ka Gola! 🍧🎵`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/40 p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-[0_0_50px_rgba(245,158,11,0.3)] relative text-slate-100 animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 block">🍧</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
            Official Recipe Card
          </span>
          <h2 className="text-2xl font-black text-amber-300 mt-2 font-serif">
            {recipe.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Created by <span className="text-slate-200 font-bold">{recipe.createdByName}</span>
          </p>
        </div>

        {/* Recipe Details Breakdown */}
        <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-3 mb-6">
          {/* Base Ice */}
          <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 font-semibold">Ice Base:</span>
            <span className="text-amber-300 font-bold capitalize">{recipe.baseIce} Ice</span>
          </div>

          {/* Flavours */}
          <div className="border-b border-slate-800/80 pb-2">
            <span className="text-xs text-slate-400 font-semibold block mb-1.5">Selected Syrups:</span>
            <div className="flex flex-wrap gap-1.5">
              {recipe.flavours.map((item, idx) => {
                const fObj = allFlavoursMap[item.flavourId];
                return (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-950 flex items-center gap-1 shadow-sm"
                    style={{ backgroundColor: fObj?.color || '#EAB308' }}
                  >
                    <span>{fObj?.icon || '🍇'}</span>
                    <span>{fObj?.name || item.flavourId}</span>
                    <span className="opacity-80">({item.quantity}x)</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Toppings */}
          <div className="border-b border-slate-800/80 pb-2">
            <span className="text-xs text-slate-400 font-semibold block mb-1.5">Toppings & Candies:</span>
            <div className="flex flex-wrap gap-1.5">
              {recipe.toppings.map((tId, idx) => {
                const tObj = allToppingsMap[tId];
                return (
                  <span key={idx} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md text-[10px] font-medium border border-slate-700">
                    {tObj?.icon || '🍬'} {tObj?.name || tId}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Container & Decoration */}
          <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 font-semibold">Container:</span>
            <span className="text-cyan-300 font-bold">{containerObj?.name || 'Paper Cup'}</span>
          </div>

          {/* Song Played at Creation */}
          {recipe.songPlayedTitle && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-amber-400" /> Track Played:
              </span>
              <span className="text-amber-200 font-bold truncate max-w-[200px]">{recipe.songPlayedTitle}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShareLink}
            className="py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:brightness-110"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'LINK COPIED!' : 'SHARE RECIPE'}</span>
          </button>

          <button
            onClick={() => {
              onRemix(recipe);
              onClose();
            }}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>REMIX RECIPE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
