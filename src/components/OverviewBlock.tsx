import { Layout, ChevronDown } from 'lucide-react';
import { Model3DViewer } from './Model3DViewer';
import { ProjectData } from '../types';

interface OverviewBlockProps {
  data: ProjectData;
  onToggleVisibility: () => void;
  isVisible: boolean;
}

export function OverviewBlock({ data, onToggleVisibility, isVisible }: OverviewBlockProps) {
  return (
    <section className="rounded-lg overflow-hidden relative" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-2">
          <Layout className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Overview & Physical Model
          </h3>
        </div>
        <button onClick={onToggleVisibility} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition">
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {isVisible && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded flex items-center justify-center p-4 min-h-[280px]" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <Model3DViewer model3d={data.model3d} />
          </div>

          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <h4 className="text-lg font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {data.info.title}
              </h4>
              <p className="text-xs leading-normal" style={{ color: 'var(--text-secondary)' }}>
                {data.info.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {data.info.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-full border font-mono"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3">
              <div className="pt-3 pb-2.5 px-3 border rounded text-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                <span className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Difficulty
                </span>
                <span className="text-xs font-semibold text-emerald-500 font-sans">{data.info.difficulty}</span>
              </div>
              <div className="pt-3 pb-2.5 px-3 border rounded text-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                <span className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Assembly Time
                </span>
                <span className="text-xs font-semibold text-blue-500 font-mono">{data.info.estimatedTime}</span>
              </div>
              <div className="pt-3 pb-2.5 px-3 border rounded text-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                <span className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Est. Cost
                </span>
                <span className="text-xs font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
                  ${data.info.totalCost.toFixed(2)}
                </span>
              </div>
              <div className="pt-3 pb-2.5 px-3 border rounded text-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                <span className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Parts Count
                </span>
                <span className="text-xs font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
                  {data.bom.length} parts
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
