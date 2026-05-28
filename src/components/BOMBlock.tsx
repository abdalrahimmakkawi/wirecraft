import { Package, ChevronDown } from 'lucide-react';
import { BOMItem } from '../types';

interface BOMBlockProps {
  bom: BOMItem[];
  onToggleVisibility: () => void;
  isVisible: boolean;
  onOptimize: () => void;
  onExportCSV: () => void;
}

export function BOMBlock({ bom, onToggleVisibility, isVisible, onOptimize, onExportCSV }: BOMBlockProps) {
  const grandTotal = bom.reduce((sum, item) => sum + item.totalCost, 0);

  return (
    <section className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Bill of Materials
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onOptimize} className="px-2.5 py-1 text-[11px] h-8 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            Optimize BOM Links
          </button>
          <button onClick={onExportCSV} className="px-2.5 py-1 text-[11px] h-8 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            Export CSV
          </button>
        </div>
      </div>

      {isVisible && (
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-left text-[12.5px] min-w-[700px]" style={{ color: 'var(--text-secondary)' }}>
            <thead>
              <tr className="border-b text-[10px] uppercase tracking-wider font-semibold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <th className="pb-2.5">Component</th>
                <th className="pb-2.5">Part Number</th>
                <th className="pb-2.5">Category</th>
                <th className="pb-2.5 text-center">Qty</th>
                <th className="pb-2.5 text-right">Unit Cost</th>
                <th className="pb-2.5 text-right">Total</th>
                <th className="pb-2.5 text-center">Procure Links</th>
              </tr>
            </thead>
            <tbody className="divide-y font-sans" style={{ borderColor: 'var(--border-color)' }}>
              {bom.map((item) => (
                <tr key={item.id} className="border-b hover:bg-zinc-900/40 transition duration-150" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                  <td className="py-3 text-[11px] text-zinc-400">{item.partNumber}</td>
                  <td className="py-3 text-[11px] text-zinc-500">{item.category}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">${item.unitCost.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium" style={{ color: 'var(--color-accent)' }}>${item.totalCost.toFixed(2)}</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <a
                        href={`https://www.lcsc.com/search?q=${encodeURIComponent(item.partNumber)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-1.5 py-0.5 bg-blue-950/45 text-blue-400 border border-blue-900/60 rounded text-[9px] font-bold"
                      >
                        LCSC
                      </a>
                      <a
                        href={`https://www.amazon.com/s?k=${encodeURIComponent(item.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-1.5 py-0.5 bg-amber-950/45 text-amber-500 border border-amber-900/60 rounded text-[9px] font-bold"
                      >
                        AMZ
                      </a>
                      <a
                        href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(item.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-1.5 py-0.5 bg-red-950/45 text-red-400 border border-red-900/60 rounded text-[9px] font-bold"
                      >
                        ALI
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 pt-3.5 flex items-center justify-between border-t" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Sourcing optimized based on current distributor pricing APIs.
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Total Project Sourcing: <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>${grandTotal.toFixed(2)}</span>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
