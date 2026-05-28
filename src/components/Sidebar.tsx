import { Plus, Folder, Info, CheckCircle, Trash2, Cpu } from 'lucide-react';
import { Project } from '../types';

interface SidebarProps {
  isOpen: boolean;
  projects: Project[];
  currentProject: Project | null;
  userSession: any;
  onCreateProject: () => void;
  onLoadProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onOpenAuth: () => void;
}

export function Sidebar({
  isOpen,
  projects,
  currentProject,
  userSession,
  onCreateProject,
  onLoadProject,
  onDeleteProject,
  onOpenAuth
}: SidebarProps) {
  return (
    <aside
      id="sidebar-panel"
      className="border-r flex flex-col backdrop-blur-sm shrink-0 transition-all duration-300"
      style={{
        width: isOpen ? '280px' : '0px',
        opacity: isOpen ? '1' : '0',
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-color)',
        overflow: isOpen ? 'auto' : 'hidden'
      }}
    >
      <div className="pt-4 pb-2 px-4">
        <button
          onClick={onCreateProject}
          className="w-full py-2 text-xs rounded font-medium transition flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Workspace Project</span>
        </button>
      </div>

      {!userSession && (
        <div className="mx-4 mb-3 p-2.5 rounded text-[11px] leading-relaxed" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          <Info className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
          Sign in to cloud-sync your workspace designs securely.
        </div>
      )}

      {userSession && (
        <div className="mx-4 mb-3 p-2.5 rounded text-[11px] leading-relaxed bg-emerald-950/20 text-emerald-400 border border-emerald-800/40">
          <CheckCircle className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
          Cloud Synced: {userSession.email} ({userSession.role})
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2 flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
            <span>Project Library</span>
            <Folder className="w-3 h-3 text-zinc-400 opacity-60" />
          </div>
          <div className="space-y-1">
            {projects.length === 0 ? (
              <div className="text-[11px] text-zinc-500 py-2 italic text-center">No projects in workspace</div>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-2 rounded cursor-pointer flex items-center justify-between text-xs transition ${
                    currentProject?.id === proj.id
                      ? 'border font-semibold'
                      : 'hover:bg-zinc-800'
                  }`}
                  style={{
                    borderColor: currentProject?.id === proj.id ? 'var(--color-accent)' : 'transparent',
                    color: 'var(--text-primary)'
                  }}
                >
                  <div
                    className="flex items-center space-x-2 truncate flex-1"
                    onClick={() => onLoadProject(proj.id)}
                  >
                    <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate">{proj.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(proj.id);
                    }}
                    className="p-0.5 text-zinc-500 hover:text-red-400 opacity-60 hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
            Version States
          </div>
          <div className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <div className="p-2 border rounded cursor-pointer transition flex items-center justify-between text-[11px] font-sans hover:bg-zinc-100 dark:hover:bg-zinc-800/40" style={{ borderColor: 'var(--border-color)' }}>
              <span className="font-medium" style={{ color: 'var(--color-accent)' }}>v1.0.0</span>
              <span className="opacity-75">Initial sketch</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded border space-y-1.5 text-[11px]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: 'var(--text-secondary)' }}>
            DRC Monitor
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            All circuits verified. 0 issues.
          </div>
        </div>
      </div>
    </aside>
  );
}
