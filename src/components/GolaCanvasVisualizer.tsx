import React, { useRef, useEffect } from 'react';
import { GolaFlavour, GolaTopping, GolaContainer, GolaDecoration, SelectedFlavour } from '../types';

interface GolaCanvasVisualizerProps {
  baseIce: 'crushed' | 'snow' | 'fine';
  flavours: SelectedFlavour[];
  allFlavoursMap: Record<string, GolaFlavour>;
  toppings: string[];
  allToppingsMap: Record<string, GolaTopping>;
  container: GolaContainer | null;
  decoration: GolaDecoration | null;
  isPlaying?: boolean;
  audioFrequency?: number; // 0 to 1 for music reactivity
  size?: 'sm' | 'md' | 'lg';
}

export const GolaCanvasVisualizer: React.FC<GolaCanvasVisualizerProps> = ({
  baseIce,
  flavours,
  allFlavoursMap,
  toppings,
  allToppingsMap,
  container,
  decoration,
  isPlaying = false,
  audioFrequency = 0.5,
  size = 'md'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    // Drip particles state
    const drips: { x: number; y: number; speed: number; color: string; size: number }[] = [];
    for (let i = 0; i < 8; i++) {
      drips.push({
        x: (Math.random() - 0.5) * 80,
        y: Math.random() * 120,
        speed: 0.3 + Math.random() * 0.6,
        color: '#3B0764',
        size: 2 + Math.random() * 3
      });
    }

    const render = () => {
      tick += 1;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2 + 30;

      ctx.clearRect(0, 0, width, height);

      // Subtle shadow under container
      const shadowGradient = ctx.createRadialGradient(centerX, centerY + 130, 10, centerX, centerY + 130, 110);
      shadowGradient.addColorStop(0, 'rgba(0,0,0,0.6)');
      shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 130, 110, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Audio reactivity pulse
      const pulseScale = isPlaying ? 1 + Math.sin(tick * 0.08) * 0.02 * audioFrequency : 1;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(pulseScale, pulseScale);

      // 1. DRAW CONTAINER BACK / STICK
      const containerType = container?.type || 'stick_traditional';

      if (containerType.startsWith('stick')) {
        // Draw Wooden / Traditional / Colourful Stick
        const stickColor = containerType === 'stick_colourful' ? '#EC4899' : containerType === 'stick_wooden' ? '#854D0E' : '#B45309';
        ctx.fillStyle = stickColor;
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = 3;

        // Stick body extending down
        ctx.beginPath();
        ctx.roundRect(-8, -80, 16, 210, 6);
        ctx.fill();
        ctx.stroke();

        // Wood grain lines
        if (containerType !== 'stick_colourful') {
          ctx.strokeStyle = 'rgba(0,0,0,0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-4, -60); ctx.lineTo(-4, 110);
          ctx.moveTo(3, -40); ctx.lineTo(3, 120);
          ctx.stroke();
        }
      } else if (containerType === 'glass') {
        // Draw glass back
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-50, -20);
        ctx.lineTo(50, -20);
        ctx.lineTo(35, 120);
        ctx.lineTo(-35, 120);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (containerType === 'steel_bowl') {
        // Draw steel katori
        const steelGrad = ctx.createLinearGradient(-70, 0, 70, 0);
        steelGrad.addColorStop(0, '#64748B');
        steelGrad.addColorStop(0.5, '#F1F5F9');
        steelGrad.addColorStop(1, '#475569');
        ctx.fillStyle = steelGrad;
        ctx.beginPath();
        ctx.arc(0, 30, 75, 0, Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 4;
        ctx.stroke();
      } else if (containerType === 'paper_cup') {
        // Draw paper cup
        const cupGrad = ctx.createLinearGradient(-50, 0, 50, 0);
        cupGrad.addColorStop(0, '#FEF08A');
        cupGrad.addColorStop(1, '#FDE047');
        ctx.fillStyle = cupGrad;
        ctx.beginPath();
        ctx.moveTo(-55, -20);
        ctx.lineTo(55, -20);
        ctx.lineTo(40, 110);
        ctx.lineTo(-40, 110);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#CA8A04';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Desi cup motif pattern
        ctx.fillStyle = '#EAB308';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★ DESI GOLA ★', 0, 50);
      }

      // 2. DRAW ICE MOUNT (MOUND)
      const iceRadiusX = containerType === 'steel_bowl' ? 85 : 70;
      const iceRadiusY = containerType === 'steel_bowl' ? 95 : 125;

      // Base Ice Shape Path
      ctx.beginPath();
      if (containerType.startsWith('stick')) {
        // Oval Gola shape on stick
        ctx.ellipse(0, -50, iceRadiusX, iceRadiusY, 0, 0, Math.PI * 2);
      } else {
        // Dome ice sitting on top of bowl/cup/glass
        ctx.ellipse(0, -20, iceRadiusX, iceRadiusY, 0, Math.PI, Math.PI * 2);
      }

      // Base Ice Shading
      const iceGrad = ctx.createRadialGradient(-20, -70, 10, 0, -40, 120);
      if (baseIce === 'snow') {
        iceGrad.addColorStop(0, '#FFFFFF');
        iceGrad.addColorStop(1, '#E2E8F0');
      } else if (baseIce === 'fine') {
        iceGrad.addColorStop(0, '#F8FAFC');
        iceGrad.addColorStop(1, '#CBD5E1');
      } else {
        // Crushed ice
        iceGrad.addColorStop(0, '#FFFFFF');
        iceGrad.addColorStop(1, '#94A3B8');
      }
      ctx.fillStyle = iceGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. DRAW SYRUP FLAVOUR LAYERS (CLIPPED TO ICE MOUND)
      ctx.save();
      ctx.beginPath();
      if (containerType.startsWith('stick')) {
        ctx.ellipse(0, -50, iceRadiusX, iceRadiusY, 0, 0, Math.PI * 2);
      } else {
        ctx.ellipse(0, -20, iceRadiusX, iceRadiusY, 0, Math.PI, Math.PI * 2);
      }
      ctx.clip();

      if (flavours.length > 0) {
        // Draw each flavour as a vertical or radial gradient splash
        const angleStep = (Math.PI * 2) / flavours.length;

        flavours.forEach((item, index) => {
          const flavourObj = allFlavoursMap[item.flavourId];
          if (!flavourObj) return;

          const color = flavourObj.color;
          const qty = item.quantity; // 1, 2, or 3
          const opacity = Math.min(1, 0.4 + qty * 0.22);

          ctx.save();
          ctx.globalAlpha = opacity;

          if (flavours.length === 1) {
            // Full coverage with gradient
            const sGrad = ctx.createLinearGradient(0, -160, 0, 60);
            sGrad.addColorStop(0, color);
            sGrad.addColorStop(1, flavourObj.secondaryColor || color);
            ctx.fillStyle = sGrad;
            ctx.fillRect(-120, -200, 240, 300);
          } else {
            // Sector / Layered pour
            const startAngle = index * angleStep - Math.PI / 2;
            const endAngle = startAngle + angleStep;

            ctx.beginPath();
            ctx.moveTo(0, -40);
            ctx.arc(0, -40, 150, startAngle, endAngle);
            ctx.closePath();

            const sectorGrad = ctx.createRadialGradient(0, -40, 10, 0, -40, 130);
            sectorGrad.addColorStop(0, color);
            sectorGrad.addColorStop(1, flavourObj.secondaryColor || color);
            ctx.fillStyle = sectorGrad;
            ctx.fill();
          }

          ctx.restore();
        });
      }

      // Ice Texture Overlays (Sparkles & Crushed Crystals)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < 40; i++) {
        const px = (Math.sin(i * 12.3 + tick * 0.02) * 0.8) * (iceRadiusX - 10);
        const py = -50 + (Math.cos(i * 7.1) * 0.8) * (iceRadiusY - 10);
        const pSize = 1 + (i % 3);
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // end ice clip

      // 4. DRAW SYRUP DRIPS (ANIMATED)
      if (flavours.length > 0) {
        const primaryColor = allFlavoursMap[flavours[0].flavourId]?.color || '#3B0764';
        drips.forEach((drip) => {
          drip.color = primaryColor;
          drip.y += drip.speed;
          if (drip.y > 60) {
            drip.y = -60 + Math.random() * 20;
            drip.x = (Math.random() - 0.5) * (iceRadiusX * 1.2);
          }
          ctx.fillStyle = drip.color;
          ctx.beginPath();
          ctx.ellipse(drip.x, drip.y, drip.size, drip.size * 1.5, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 5. DRAW CONTAINER FRONT / SHINE (GLASS / STEEL / CUP REFINEMENTS)
      if (containerType === 'glass') {
        // Front glass reflections & condensation drops
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.moveTo(-45, -20); ctx.lineTo(-30, 115); ctx.lineTo(-20, 115); ctx.lineTo(-35, -20);
        ctx.fill();

        // Water condensation drops
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath(); ctx.arc(-20, 30, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(15, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-10, 85, 2.5, 0, Math.PI * 2); ctx.fill();
      }

      // 6. DRAW TOPPINGS ON TOP OF ICE
      toppings.forEach((topId, idx) => {
        const toppingObj = allToppingsMap[topId];
        if (!toppingObj) return;

        const count = 12;
        ctx.fillStyle = toppingObj.color;

        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + idx * 0.5;
          const dist = 15 + (i % 4) * 15;
          const tx = Math.cos(angle) * dist;
          const ty = -70 + Math.sin(angle) * (dist * 0.6);

          if (toppingObj.type === 'jelly') {
            // Jelly cube
            ctx.beginPath();
            ctx.roundRect(tx - 6, ty - 6, 12, 12, 3);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
          } else if (toppingObj.type === 'candy') {
            // Tutti frutti piece
            ctx.fillRect(tx - 4, ty - 4, 8, 8);
          } else if (toppingObj.type === 'crunch') {
            // Sprinkles/Choco chips
            ctx.save();
            ctx.translate(tx, ty);
            ctx.rotate(i * 0.8);
            ctx.fillRect(-2, -6, 4, 12);
            ctx.restore();
          } else if (toppingObj.type === 'fruit') {
            // Mint leaf / cherry bits
            ctx.beginPath();
            ctx.arc(tx, ty, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // 7. DRAW DECORATION (UMBRELLA / CHERRY / MINT / FLAG)
      if (decoration) {
        if (decoration.type === 'umbrella') {
          // Cocktail Umbrella
          ctx.save();
          ctx.translate(35, -120);
          ctx.rotate(0.2);

          // Umbrella stick
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 0); ctx.lineTo(-10, 70);
          ctx.stroke();

          // Canopy
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.moveTo(-35, 0);
          ctx.quadraticCurveTo(0, -35, 35, 0);
          ctx.lineTo(25, -5);
          ctx.lineTo(10, 0);
          ctx.lineTo(0, -5);
          ctx.lineTo(-10, 0);
          ctx.lineTo(-25, -5);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();
        } else if (decoration.type === 'cherry') {
          // Cherry on top
          ctx.save();
          ctx.translate(0, -140);
          // Cherry body
          ctx.fillStyle = '#DC2626';
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();
          // Shine
          ctx.fillStyle = '#FFA1A1';
          ctx.beginPath(); ctx.arc(-4, -4, 4, 0, Math.PI * 2); ctx.fill();
          // Stem
          ctx.strokeStyle = '#15803D';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -12);
          ctx.quadraticCurveTo(15, -30, 20, -20);
          ctx.stroke();
          ctx.restore();
        } else if (decoration.type === 'mint') {
          // Mint crown
          ctx.save();
          ctx.translate(-20, -135);
          ctx.fillStyle = '#22C55E';
          ctx.beginPath();
          ctx.ellipse(-8, 0, 16, 8, -0.4, 0, Math.PI * 2);
          ctx.ellipse(8, -4, 16, 8, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (decoration.type === 'candy_flag') {
          // Tricolour flag
          ctx.save();
          ctx.translate(-35, -120);
          ctx.strokeStyle = '#78350F'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke();
          // Flag cloth
          ctx.fillStyle = '#F97316'; ctx.fillRect(0, 0, 30, 8);
          ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 8, 30, 8);
          ctx.fillStyle = '#22C55E'; ctx.fillRect(0, 16, 30, 8);
          ctx.restore();
        }
      }

      ctx.restore(); // Restore center matrix

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [baseIce, flavours, toppings, container, decoration, isPlaying, audioFrequency, allFlavoursMap, allToppingsMap]);

  const canvasWidth = size === 'lg' ? 420 : size === 'md' ? 320 : 220;
  const canvasHeight = size === 'lg' ? 480 : size === 'md' ? 380 : 260;

  return (
    <div className="relative flex items-center justify-center filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="max-w-full h-auto cursor-pointer transition-transform hover:scale-105 duration-300"
      />
    </div>
  );
};
