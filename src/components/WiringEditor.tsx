import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Component, Connection as WireConnection } from '../types';

interface WiringEditorProps {
  components: Component[];
  connections: WireConnection[];
  onComponentsChange: (components: Component[]) => void;
  onConnectionsChange: (connections: WireConnection[]) => void;
  theme: string;
  onExportKiCad?: () => void;
}

const nodeTypes = {};

export function WiringEditor({
  components,
  connections,
  onComponentsChange,
  onConnectionsChange,
  theme,
  onExportKiCad
}: WiringEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert components to ReactFlow nodes
  useEffect(() => {
    const flowNodes: Node[] = components.map((comp) => ({
      id: comp.id,
      type: 'default',
      position: { x: comp.x * 10, y: comp.y * 10 },
      data: {
        label: (
          <div className="p-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            <div className="font-bold text-xs">{comp.id}</div>
            <div className="text-[10px] opacity-75">{comp.name}</div>
            <div className="text-[9px] mt-1 font-mono">{comp.type}</div>
          </div>
        ),
        ...comp
      },
      style: {
        backgroundColor: comp.color || 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderWidth: 2,
        borderRadius: 8
      }
    }));
    setNodes(flowNodes);
  }, [components, setNodes]);

  // Convert connections to ReactFlow edges
  useEffect(() => {
    const flowEdges: Edge[] = connections.map((conn, index) => ({
      id: `edge-${index}`,
      source: conn.from.split('.')[0],
      target: conn.to.split('.')[0],
      label: conn.signal,
      labelStyle: { fontSize: 10, fill: 'var(--text-secondary)' },
      style: {
        stroke: conn.color || 'var(--color-accent)',
        strokeWidth: 2
      },
      animated: true
    }));
    setEdges(flowEdges);
  }, [connections, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newConnection: WireConnection = {
        from: `${params.source}.${params.sourceHandle || 'OUT'}`,
        to: `${params.target}.${params.targetHandle || 'IN'}`,
        signal: 'SIGNAL',
        voltage: '3.3V',
        color: 'var(--color-accent)'
      };
      onConnectionsChange([...connections, newConnection]);
    },
    [connections, onConnectionsChange]
  );

  const addComponent = useCallback((type: string) => {
    const pins = type === 'MCU' ? ['VCC', 'GND', 'SDA', 'SCL', 'TX', 'RX'] : ['VCC', 'GND', 'OUT'];
    const newComponent: Component = {
      id: `${type}_${Date.now().toString().slice(-4)}`,
      name: `Added ${type}`,
      type: `${type} generic module`,
      pins,
      x: 40,
      y: 40,
      color: type === 'MCU' ? '#3b82f6' : '#22c55e'
    };
    onComponentsChange([...components, newComponent]);
  }, [components, onComponentsChange]);

  return (
    <div className="w-full h-[520px] rounded-lg overflow-hidden relative" style={{ backgroundColor: 'var(--bg-app)' }}>
      <div className="px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider mr-2" style={{ color: 'var(--text-secondary)' }}>
            Components:
          </span>
          <button
            onClick={() => addComponent('MCU')}
            className="px-2.5 py-1 text-[11px] h-7 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            + MCU
          </button>
          <button
            onClick={() => addComponent('Sensor')}
            className="px-2.5 py-1 text-[11px] h-7 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            + Sensor
          </button>
          <button
            onClick={() => addComponent('LED')}
            className="px-2.5 py-1 text-[11px] h-7 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            + LED
          </button>
          <button
            onClick={() => addComponent('Resistor')}
            className="px-2.5 py-1 text-[11px] h-7 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            + R / C
          </button>
          <button
            onClick={() => addComponent('Power')}
            className="px-2.5 py-1 text-[11px] h-7 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            + Power
          </button>
        </div>
        {onExportKiCad && (
          <button
            onClick={onExportKiCad}
            className="px-2.5 py-1 text-[11px] h-7 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Export .kicad_sch
          </button>
        )}
      </div>

      <div className="h-[calc(100%-52px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={{ backgroundColor: 'var(--bg-app)' }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border-color)" />
          <Controls />
          <MiniMap 
            style={{ 
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)'
            }}
            nodeColor={(node) => (node.data as Component).color || 'var(--color-accent)'}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
