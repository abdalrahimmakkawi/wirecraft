import React, { useEffect, useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface KiCadViewerProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function KiCadViewer({ isVisible, onToggleVisibility }: KiCadViewerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const kicanvasScriptLoaded = useRef(false);

  useEffect(() => {
    // Load kicanvas script from CDN
    if (!kicanvasScriptLoaded.current) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://kicanvas.org/kicanvas/kicanvas.js';
      script.onload = () => {
        kicanvasScriptLoaded.current = true;
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  useEffect(() => {
    // Cleanup blob URL when component unmounts or file changes
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.name.endsWith('.kicad_sch') || selectedFile.name.endsWith('.kicad_pcb')) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);
    } else {
      alert('Please upload a .kicad_sch or .kicad_pcb file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleClear = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFile(null);
    setFileUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isVisible) return null;

  return (
    <section className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              KiCad File Viewer
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded font-bold" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}>
              Premium
            </span>
          </div>
        </div>
        <button onClick={onToggleVisibility} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition">
          <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      <div className="p-5">
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              isDragOver ? 'border-blue-500 bg-blue-500/5' : ''
            }`}
            style={{ borderColor: 'var(--border-color)' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".kicad_sch,.kicad_pcb"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-accent)', opacity: 0.5 }} />
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Upload a KiCad file to view your design with full fidelity
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              Drag and drop or click to select .kicad_sch or .kicad_pcb files
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-medium rounded transition"
              style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}
            >
              Select File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {file.name}
                </span>
              </div>
              <button
                onClick={handleClear}
                className="px-3 py-1 text-xs border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Clear
              </button>
            </div>
            
            <div className="w-full h-[400px] rounded overflow-hidden" style={{ backgroundColor: '#000', border: '1px solid var(--border-color)' }}>
              {fileUrl && kicanvasScriptLoaded.current && (
                <kicanvas-display
                  src={fileUrl}
                  controls="full"
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
