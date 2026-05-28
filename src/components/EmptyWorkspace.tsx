import { Cpu, Loader2 } from 'lucide-react';

interface EmptyWorkspaceProps {
  isGenerating: boolean;
  onSelectPreset: (preset: string) => void;
}

export function EmptyWorkspace({ isGenerating, onSelectPreset }: EmptyWorkspaceProps) {
  if (isGenerating) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-6">
        <div className="inline-block animate-spin" style={{ color: 'var(--color-accent)' }}>
          <Loader2 className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Generating physical workspace matrix...
        </h3>
        <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          Routing copper PCB tracks &bull; Compiling manual assembly instructions
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto text-center py-20 space-y-6">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
        <Cpu className="w-6 h-6" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
          No project yet — describe one below
        </h2>
        <p className="text-[12.5px] max-w-sm mx-auto select-none leading-normal" style={{ color: 'var(--text-secondary)' }}>
          Enter component parameters or describe a hardware concept below to generate schematics, PCB copper layout files, and instructions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-6 max-w-lg mx-auto">
        <button
          onClick={() => onSelectPreset('Smart Hydroponics Garden')}
          className="pt-4 pb-3.5 px-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border transition text-left space-y-1 rounded"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <span className="font-medium block text-xs" style={{ color: 'var(--text-primary)' }}>🌿 Smart Hydroponics Garden</span>
          <span className="text-[11px] block leading-normal" style={{ color: 'var(--text-secondary)' }}>
            ESP32-based soil micro-feeder and light solenoids.
          </span>
        </button>
        <button
          onClick={() => onSelectPreset('Drone Quadcopter Controller')}
          className="pt-4 pb-3.5 px-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border transition text-left space-y-1 rounded"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <span className="font-medium block text-xs" style={{ color: 'var(--text-primary)' }}>🛸 Flight Controller</span>
          <span className="text-[11px] block leading-normal" style={{ color: 'var(--text-secondary)' }}>
            STM32 MCU with high-refresh IMU sensor and power bus.
          </span>
        </button>
        <button
          onClick={() => onSelectPreset('Handheld Retro Emulator')}
          className="pt-4 pb-3.5 px-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border transition text-left space-y-1 rounded"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <span className="font-medium block text-xs" style={{ color: 'var(--text-primary)' }}>🎮 Handheld Retro Console</span>
          <span className="text-[11px] block leading-normal" style={{ color: 'var(--text-secondary)' }}>
            Raspberry Pi CM4 design with analog thumb sticks.
          </span>
        </button>
        <button
          onClick={() => onSelectPreset('Biometric Fitness Track-Ring')}
          className="pt-4 pb-3.5 px-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border transition text-left space-y-1 rounded"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <span className="font-medium block text-xs" style={{ color: 'var(--text-primary)' }}>💍 Biometric Tracker Wearable</span>
          <span className="text-[11px] block leading-normal" style={{ color: 'var(--text-secondary)' }}>
            Ultra miniature BLE ring with optical heart rate system.
          </span>
        </button>
      </div>
    </div>
  );
}
