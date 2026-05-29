import { Menu, Clock, ShieldCheck, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onToggleSidebar: () => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onVersionHistory: () => void;
  onScrollToDRC: () => void;
  userSession: any;
  onOpenAuth: () => void;
}

export function Header({
  theme,
  onThemeChange,
  onToggleSidebar,
  projectName,
  onProjectNameChange,
  onVersionHistory,
  onScrollToDRC,
  userSession,
  onOpenAuth
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b flex items-center justify-between px-5 z-40 backdrop-blur-md" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition duration-150"
          title="Toggle Sidebar"
        >
          <Menu className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 hover:opacity-80 transition duration-150"
          title="Back to Landing Page"
        >
          <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none">
            <path d="M20 80h60M30 80l10-30m10-5l25-15" stroke="var(--color-accent)" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="30" cy="80" r="5" fill="var(--color-accent)"/>
            <circle cx="40" cy="50" r="5" fill="var(--color-accent)"/>
            <circle cx="75" cy="30" r="5" fill="var(--text-primary)"/>
            <path d="M72 25l7 5-5 7" stroke="var(--color-accent)" strokeWidth="4"/>
          </svg>
          <span className="font-semibold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>Wirecraft</span>
        </button>

        <span className="text-zinc-600 dark:text-zinc-800">/</span>

        <div className="flex items-center">
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="bg-transparent font-medium text-xs border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-[var(--color-accent)] outline-none px-1 py-0.5 w-36 sm:w-56 transition duration-150"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 bg-zinc-100 dark:bg-zinc-900 border rounded-full p-1 z-50" style={{ borderColor: 'var(--border-color)' }} title="Switch Engineering Theme">
          <button
            onClick={() => onThemeChange('dark-steel')}
            className={`w-4 h-4 rounded-full bg-[#18181b] border border-zinc-700/50 transition cursor-pointer ${theme === 'dark-steel' ? 'ring-2 ring-blue-500 scale-110 opacity-100' : 'opacity-60 hover:opacity-100'}`}
            title="Dark Steel"
          />
          <button
            onClick={() => onThemeChange('engineering-paper')}
            className={`w-4 h-4 rounded-full bg-[#ffffff] border border-zinc-300/60 transition cursor-pointer ${theme === 'engineering-paper' ? 'ring-2 ring-blue-500 scale-110 opacity-100' : 'opacity-60 hover:opacity-100'}`}
            title="Engineering Paper"
          />
          <button
            onClick={() => onThemeChange('midnight-pcb')}
            className={`w-4 h-4 rounded-full bg-[#102016] border border-green-800/50 transition cursor-pointer ${theme === 'midnight-pcb' ? 'ring-2 ring-blue-500 scale-110 opacity-100' : 'opacity-60 hover:opacity-100'}`}
            title="Midnight PCB"
          />
          <button
            onClick={() => onThemeChange('blueprint')}
            className={`w-4 h-4 rounded-full bg-[#0a1c35] border border-cyan-800/50 transition cursor-pointer ${theme === 'blueprint' ? 'ring-2 ring-blue-500 scale-110 opacity-100' : 'opacity-60 hover:opacity-100'}`}
            title="Blueprint"
          />
        </div>

        <button onClick={onVersionHistory} className="px-2.5 py-1 text-xs border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          <Clock className="w-3.5 h-3.5 text-zinc-400 inline mr-1" />
          <span className="hidden sm:inline">Versions</span>
        </button>

        <button onClick={onScrollToDRC} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-medium transition hover:bg-emerald-500/15">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-medium">DRC: Safe</span>
        </button>

        <div>
          {userSession ? (
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase hidden sm:inline">PRO PLAN</span>
              <div className="w-8 h-8 rounded-full bg-cyan-800 text-white font-mono text-xs flex items-center justify-center font-bold tracking-tight border-2" style={{ borderColor: 'var(--color-accent)' }} title={userSession.email}>
                {userSession.email[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="px-3 py-1 text-xs rounded font-medium transition" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
