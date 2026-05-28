import { Wrench, ChevronDown, Check } from 'lucide-react';
import { Instruction } from '../types';

interface AssemblyBlockProps {
  instructions: Instruction[];
  onToggleVisibility: () => void;
  isVisible: boolean;
  onToggleStep: (index: number) => void;
}

export function AssemblyBlock({ instructions, onToggleVisibility, isVisible, onToggleStep }: AssemblyBlockProps) {
  const completedCount = instructions.filter(s => s.completed).length;
  const progress = instructions.length > 0 ? Math.round((completedCount / instructions.length) * 100) : 0;

  return (
    <section className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-2">
          <Wrench className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Manual Assembly Instructions
          </h3>
        </div>
        <button onClick={() => window.print()} className="px-2.5 py-1 text-[11px] h-8 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          Print Assembly Guide
        </button>
      </div>

      {isVisible && (
        <>
          <div className="px-5 py-3 border-b flex items-center justify-between text-xs" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <span className="font-medium">Assembly & soldering progress:</span>
            <div className="flex-1 mx-4 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
              <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: 'var(--color-accent)' }} />
            </div>
            <span className="font-semibold font-mono" style={{ color: 'var(--color-accent)' }}>{progress}% Completed</span>
          </div>

          <div className="p-5">
            <div className="space-y-3.5">
              {instructions.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 border rounded-lg transition-all duration-300 ${
                    step.completed
                      ? 'bg-emerald-950/10 border-emerald-900/60 pb-3'
                      : ''
                  }`}
                  style={{
                    backgroundColor: step.completed ? '' : 'var(--bg-card)',
                    borderColor: step.completed ? '' : 'var(--border-color)'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => onToggleStep(index)}
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition ${
                          step.completed
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : 'hover:border-zinc-500'
                        }`}
                        style={{ borderColor: step.completed ? '' : 'var(--border-color)' }}
                      >
                        {step.completed && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <h4
                          className={`text-xs font-bold uppercase tracking-wider ${
                            step.completed ? 'line-through opacity-50' : ''
                          }`}
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Step {step.stepNumber}: {step.title}
                        </h4>
                        <p
                          className={`text-[12px] mt-1 leading-relaxed ${
                            step.completed ? 'opacity-40' : ''
                          }`}
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {step.description}
                        </p>
                        <p className="text-[11px] italic mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {step.details}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-3">
                          <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                            Est: {step.estimatedTime}
                          </span>
                          {step.tools.map((tool, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                              style={{
                                backgroundColor: 'var(--bg-surface)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                        {step.warning && (
                          <div className="mt-2.5 p-2 rounded text-xs leading-relaxed bg-amber-950/20 text-amber-500 border border-amber-900/40">
                            <strong className="uppercase font-mono">WARNING:</strong> {step.warning}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
