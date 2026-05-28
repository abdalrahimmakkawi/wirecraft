import { ShieldCheck, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { DRCIssue } from '../types';

interface DRCBlockProps {
  issues: DRCIssue[];
  onToggleVisibility: () => void;
  isVisible: boolean;
  onReRun: () => void;
}

export function DRCBlock({ issues, onToggleVisibility, isVisible, onReRun }: DRCBlockProps) {
  return (
    <section className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Design Rule Checker
          </h3>
        </div>
        <button onClick={onReRun} className="px-2.5 py-1 text-[11px] h-8 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          Re-Run DRC Scan
        </button>
      </div>

      {isVisible && (
        <div className="p-5">
          {issues.length === 0 ? (
            <div className="p-4 rounded-lg flex items-start space-x-3 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
              <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider">Scan Result: Safe</h4>
                <p className="text-[12.5px] opacity-90 leading-normal mt-1">
                  No routing overlaps, open stubs, or electrical design rule violations detected. Schematic is ready for fabrication.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-lg flex items-start space-x-3 bg-amber-950/20 text-amber-500 border border-amber-900/40">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Engine Diagnostics Blocked: {issues.length} Issues Flagged</h4>
                  <p className="text-xs opacity-80 leading-relaxed mt-0.5">
                    Resolve warnings to safely fabricate copper layers or optimize core power paths.
                  </p>
                </div>
              </div>
              <div className="space-y-3.5 mt-4">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-3.5 border rounded-lg flex items-center justify-between text-xs font-mono cursor-pointer transition ${
                      issue.severity === 'error'
                        ? 'bg-red-950/20 border-red-900/40 text-red-400'
                        : 'bg-amber-950/20 border-amber-900/40 text-amber-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          issue.severity === 'error' ? 'bg-red-800 text-white' : 'bg-amber-800 text-white'
                        }`}
                      >
                        {issue.severity}
                      </span>
                      <span>
                        {issue.message} (Component: <strong>{issue.componentId}</strong>)
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
