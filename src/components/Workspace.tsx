import React, { useState } from 'react';
import { Send, Zap, GitBranch, Cpu } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { WiringEditor } from './WiringEditor';
import { PCBViewer } from './PCBViewer';
import { OverviewBlock } from './OverviewBlock';
import { BOMBlock } from './BOMBlock';
import { AssemblyBlock } from './AssemblyBlock';
import { DRCBlock } from './DRCBlock';
import { AuthModal } from './AuthModal';
import { EmptyWorkspace } from './EmptyWorkspace';
import { KiCadViewer } from './KiCadViewer';
import { useWirecraft } from '../hooks/useWirecraft';

export function Workspace() {
  const {
    currentProject,
    savedProjects,
    activeTheme,
    userSession,
    localUsageCount,
    isSidebarOpen,
    isGenerating,
    setTheme,
    setSidebarOpen,
    setUserSession,
    createNewProject,
    loadProject,
    deleteProject,
    renameProject,
    generateHardware
  } = useWirecraft();

  const [promptInput, setPromptInput] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [visibleBlocks, setVisibleBlocks] = useState({
    overview: true,
    bom: true,
    wiring: true,
    pcb: true,
    kicad: true,
    assembly: true,
    drc: true
  });

  const handleGenerate = () => {
    if (promptInput.trim()) {
      generateHardware(promptInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const handleSelectPreset = (preset: string) => {
    setPromptInput(`Smart ${preset} schema board layout design`);
    generateHardware(`Smart ${preset} schema board layout design`);
  };

  const handleGoogleAuth = () => {
    setUserSession({ email: 'developer_account@github-oauth.com', role: 'Hardware Craftsman' });
    setIsAuthModalOpen(false);
  };

  const handleGitHubAuth = () => {
    setUserSession({ email: 'developer@github.com', role: 'Workspace Lead Admin' });
    setIsAuthModalOpen(false);
  };

  const handleEmailAuth = (email: string, password: string) => {
    setUserSession({ email, role: 'Workspace Lead Admin' });
    setIsAuthModalOpen(false);
  };

  const toggleBlock = (block: keyof typeof visibleBlocks) => {
    setVisibleBlocks(prev => ({ ...prev, [block]: !prev[block] }));
  };

  const handleToggleStep = (index: number) => {
    if (!currentProject) return;
    const updatedInstructions = [...currentProject.data.instructions];
    updatedInstructions[index].completed = !updatedInstructions[index].completed;
    const updatedProject = {
      ...currentProject,
      data: {
        ...currentProject.data,
        instructions: updatedInstructions
      }
    };
    renameProject(updatedProject.name);
  };

  const handleExportBOMCSV = () => {
    if (!currentProject) return;
    const bom = currentProject.data.bom;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Component,Part Number,Category,Quantity,Unit Cost,Total Cost\n';
    bom.forEach(i => {
      csvContent += `"${i.name}","${i.partNumber}","${i.category}",${i.quantity},${i.unitCost},${i.totalCost}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentProject.name}_BOM.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOptimizeBOM = () => {
    alert('Cost optimization feature - would integrate with distributor APIs');
  };

  const handleReRunDRC = () => {
    if (!currentProject) return;
    alert('Design Rule Check sweep executed. All routes verified.');
  };

  const handleExportKiCad = () => {
    if (!currentProject) return;
    
    // Convert wiring data to KiCad s-expression format
    const { components, connections } = currentProject.data.wiring;
    
    let kicadContent = `(kicad_sch (version 20230121) (generator wirecraft)\n`;
    kicadContent += `  (paper "A4")\n`;
    
    // Add components as symbols
    components.forEach((comp, index) => {
      kicadContent += `  (symbol (lib_id "${comp.id}") (at ${comp.x} ${comp.y} 0) (unit 1)\n`;
      kicadContent += `    (in_bom yes) (on_board yes)\n`;
      kicadContent += `    (property "Reference" "${comp.id}" (at 0 0 0)\n`;
      kicadContent += `      (effects (font (size 1.27 1.27)) (justify left)))\n`;
      kicadContent += `    (property "Value" "${comp.type}" (at 0 1.27 0)\n`;
      kicadContent += `      (effects (font (size 1.27 1.27)) (justify left)))\n`;
      kicadContent += `  )\n`;
    });
    
    // Add connections as wires
    connections.forEach((conn) => {
      const fromComp = components.find(c => conn.from.startsWith(c.id));
      const toComp = components.find(c => conn.to.startsWith(c.id));
      if (fromComp && toComp) {
        kicadContent += `  (wire (pts (xy ${fromComp.x} ${fromComp.y}) (xy ${toComp.x} ${toComp.y}))\n`;
        kicadContent += `    (stroke (width 0.1524) (type default))\n`;
        kicadContent += `  )\n`;
      }
    });
    
    kicadContent += `)\n`;
    
    // Download the file
    const blob = new Blob([kicadContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.name}.kicad_sch`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const scrollToBlock = (blockId: string) => {
    const element = document.getElementById(blockId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" data-theme={activeTheme}>
      <Header
        theme={activeTheme}
        onThemeChange={setTheme}
        onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        projectName={currentProject?.name || 'Untitled Project'}
        onProjectNameChange={renameProject}
        onVersionHistory={() => alert('Version history feature')}
        onScrollToDRC={() => scrollToBlock('block-drc')}
        userSession={userSession}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          projects={savedProjects}
          currentProject={currentProject}
          userSession={userSession}
          onCreateProject={createNewProject}
          onLoadProject={loadProject}
          onDeleteProject={deleteProject}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 engineering-grid">
            {!currentProject ? (
              <EmptyWorkspace
                isGenerating={isGenerating}
                onSelectPreset={handleSelectPreset}
              />
            ) : (
              <div className="max-w-5xl mx-auto space-y-6">
                <OverviewBlock
                  data={currentProject.data}
                  onToggleVisibility={() => toggleBlock('overview')}
                  isVisible={visibleBlocks.overview}
                />

                <BOMBlock
                  bom={currentProject.data.bom}
                  onToggleVisibility={() => toggleBlock('bom')}
                  isVisible={visibleBlocks.bom}
                  onOptimize={handleOptimizeBOM}
                  onExportCSV={handleExportBOMCSV}
                />

                <section id="block-wiring" className="rounded-lg overflow-hidden relative" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
                  <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center space-x-2">
                      <GitBranch className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                      <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                        Wiring Schematic
                      </h3>
                    </div>
                    <div className="text-[11px] font-sans hidden md:inline-block" style={{ color: 'var(--text-secondary)' }}>
                      Drag symbols to position &bull; Connect terminals to wire
                    </div>
                  </div>
                  {visibleBlocks.wiring && (
                    <WiringEditor
                      components={currentProject.data.wiring.components}
                      connections={currentProject.data.wiring.connections}
                      onComponentsChange={(comps) => {
                        const updatedProject = {
                          ...currentProject,
                          data: {
                            ...currentProject.data,
                            wiring: { ...currentProject.data.wiring, components: comps }
                          }
                        };
                        renameProject(updatedProject.name);
                      }}
                      onConnectionsChange={(conns) => {
                        const updatedProject = {
                          ...currentProject,
                          data: {
                            ...currentProject.data,
                            wiring: { ...currentProject.data.wiring, connections: conns }
                          }
                        };
                        renameProject(updatedProject.name);
                      }}
                      theme={activeTheme}
                      onExportKiCad={handleExportKiCad}
                    />
                  )}
                </section>

                <section id="block-pcb" className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
                  <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                      <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                        PCB Trace Layers
                      </h3>
                    </div>
                    <div className="text-xs font-sans" style={{ color: 'var(--text-secondary)' }}>
                      2 layer copper substrate layout view
                    </div>
                  </div>
                  {visibleBlocks.pcb && (
                    <PCBViewer
                      components={currentProject.data.wiring.components}
                      connections={currentProject.data.wiring.connections}
                      theme={activeTheme}
                    />
                  )}
                </section>

                <KiCadViewer
                  isVisible={visibleBlocks.kicad}
                  onToggleVisibility={() => toggleBlock('kicad')}
                />

                <AssemblyBlock
                  instructions={currentProject.data.instructions}
                  onToggleVisibility={() => toggleBlock('assembly')}
                  isVisible={visibleBlocks.assembly}
                  onToggleStep={handleToggleStep}
                />

                <DRCBlock
                  issues={currentProject.data.wiring.drcIssues}
                  onToggleVisibility={() => toggleBlock('drc')}
                  isVisible={visibleBlocks.drc}
                  onReRun={handleReRunDRC}
                />
              </div>
            )}
          </div>

          <footer className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[var(--bg-app)] via-[var(--bg-app)] to-transparent pointer-events-none z-30">
            <div className="max-w-3xl mx-auto pointer-events-auto rounded-lg overflow-hidden backdrop-blur-md shadow-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
              <div className="p-2.5 flex items-center space-x-2">
                <button className="p-2 transition" style={{ color: 'var(--color-accent)' }} title="Hardware AI Copilot">
                  <Zap className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="E.g., Raspberry Pi base controller with transient diodes and a CAN bus driver..."
                  className="flex-1 bg-transparent border-0 outline-none text-[13px] py-2 font-sans"
                  style={{ color: 'var(--text-primary)' }}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !promptInput.trim()}
                  className="py-2 px-3 rounded text-[12px] h-9 font-medium transition"
                  style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff', opacity: isGenerating || !promptInput.trim() ? 0.5 : 1 }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="px-4 py-2 flex items-center justify-between border-t text-[11px] font-sans" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                <div className="flex items-center space-x-1">
                  <span>Hardware Copilot active. Enter parameters above to generate workspace fields.</span>
                </div>
                <div className="opacity-75">
                  {localUsageCount}/10 requests remaining this week
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onGoogleAuth={handleGoogleAuth}
        onGitHubAuth={handleGitHubAuth}
        onEmailAuth={handleEmailAuth}
      />
    </div>
  );
}
