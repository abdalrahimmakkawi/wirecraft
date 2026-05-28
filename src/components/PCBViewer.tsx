import { useEffect, useRef, useState } from 'react';
import { Component, Connection } from '../types';

interface PCBViewerProps {
  components: Component[];
  connections: Connection[];
  theme: string;
}

export function PCBViewer({ components, connections, theme }: PCBViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layers, setLayers] = useState({
    comp: true,
    fcu: true,
    bcu: true,
    silk: true,
    drill: true
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 900;
    canvas.height = 560;

    // Determine colors based on theme
    let substrateFill = '#04120a';
    let substrateStroke = '#22c55e';
    let compBoxFill = '#0a1a0c';

    if (theme === 'dark-steel') {
      substrateFill = '#121214';
      substrateStroke = '#3f3f46';
      compBoxFill = '#1c1c1e';
    } else if (theme === 'engineering-paper') {
      substrateFill = '#faf8f5';
      substrateStroke = '#d4d4d8';
      compBoxFill = '#ffffff';
    } else if (theme === 'blueprint') {
      substrateFill = '#07162c';
      substrateStroke = '#0ea5e9';
      compBoxFill = '#0b2447';
    } else {
      substrateFill = '#030d07';
      substrateStroke = '#10b981';
      compBoxFill = '#08170c';
    }

    // Clear canvas
    ctx.fillStyle = substrateFill;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board outline
    ctx.strokeStyle = substrateStroke;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(20, 20, 860, 520, 12);
    ctx.stroke();

    // Draw mounting holes
    const mountingSpots = [
      { x: 45, y: 45 }, { x: 855, y: 45 },
      { x: 45, y: 515 }, { x: 855, y: 515 }
    ];

    mountingSpots.forEach(pt => {
      // Silver rim
      ctx.strokeStyle = '#a1a1aa';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Core hole
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw grid dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    for (let x = 60; x < 850; x += 40) {
      for (let y = 60; y < 510; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw traces
    connections.forEach((conn, index) => {
      const comp1 = components.find(c => conn.from.startsWith(c.id));
      const comp2 = components.find(c => conn.to.startsWith(c.id));
      
      if (comp1 && comp2) {
        const x1 = 100 + (comp1.x * 7.5 - 100) * 1.05;
        const y1 = 100 + (comp1.y * 5 - 100) * 0.82;
        const x2 = 100 + (comp2.x * 7.5 - 100) * 1.05;
        const y2 = 100 + (comp2.y * 5 - 100) * 0.82;

        const isTopLayer = index % 2 === 0;

        if (isTopLayer && layers.fcu) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
        } else if (!isTopLayer && layers.bcu) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 4]);
        } else {
          ctx.setLineDash([]);
          return;
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + (x2 - x1) / 2, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Draw components
    components.forEach(comp => {
      if (!layers.comp) return;

      const tx = 50 + comp.x * 7.5;
      const ty = 50 + comp.y * 4.2;
      const width = 140;
      const height = 90;

      // Courtyard
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(tx - 8, ty - 8, width + 16, height + 16);
      ctx.setLineDash([]);

      // Component box
      ctx.fillStyle = compBoxFill;
      ctx.strokeStyle = comp.color || '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tx, ty, width, height, 4);
      ctx.fill();
      ctx.stroke();

      // Silkscreen label
      if (layers.silk) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(comp.id, tx + width / 2, ty + height / 2 + 2);
      }

      // Solder pads
      const padXSpots = [tx + 20, tx + 50, tx + 80, tx + 110];
      padXSpots.forEach(padX => {
        [ty, ty + height].forEach(padY => {
          // Pad
          ctx.fillStyle = '#fbbf24';
          ctx.strokeStyle = '#a16207';
          ctx.lineWidth = 1;
          ctx.fillRect(padX - 4, padY - 6, 8, 12);
          ctx.strokeRect(padX - 4, padY - 6, 8, 12);

          // Drill
          if (layers.drill) {
            ctx.fillStyle = '#05140b';
            ctx.beginPath();
            ctx.arc(padX, padY, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });
    });

  }, [components, connections, theme, layers]);

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="space-y-4">
      <div className="px-5 py-2.5 flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="text-[10px] font-semibold uppercase tracking-wider">Layer Filters:</span>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.comp}
              onChange={() => toggleLayer('comp')}
              className="rounded"
            />
            <span>Composite</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.fcu}
              onChange={() => toggleLayer('fcu')}
              className="rounded text-red-500"
            />
            <span className="text-rose-500 font-medium">F.Cu (Top)</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.bcu}
              onChange={() => toggleLayer('bcu')}
              className="rounded text-blue-500"
            />
            <span className="text-blue-500 font-medium">B.Cu (Bottom)</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.silk}
              onChange={() => toggleLayer('silk')}
              className="rounded"
            />
            <span className="text-zinc-600 dark:text-zinc-400">Silkscreen</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.drill}
              onChange={() => toggleLayer('drill')}
              className="rounded text-amber-500"
            />
            <span className="text-amber-500 font-medium">Drills</span>
          </label>
        </div>
        <div className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
          100mm × 62mm
        </div>
      </div>

      <div className="p-4 flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="w-full max-w-4xl relative overflow-hidden rounded-lg border flex items-center justify-center p-2" style={{ borderColor: 'var(--border-color)', backgroundColor: '#05140b' }}>
          <canvas
            ref={canvasRef}
            className="w-full h-auto"
            style={{ aspectRatio: '16/10' }}
          />
        </div>
      </div>
    </div>
  );
}
