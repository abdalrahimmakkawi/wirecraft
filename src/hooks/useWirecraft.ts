import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectData, Theme } from '../types';

const SYSTEM_PROMPT = `You are a professional robotic and industrial hardware circuit engineering generator. 
Always output clean, standard json with no conversational text, no markdown. 
BOM count is strictly 5-8 items. Wiring contains 3-6 logical components with relative (x,y) positioning on standard 0-100 schematic grid.

The output schema must strictly validate as:
{
  "info": { "title": "...", "description": "...", "difficulty": "Beginner|Intermediate|Advanced", "estimatedTime": "...", "totalCost": 0.00, "tags": [], "safetyNotes": "..." },
  "bom": [ { "id": "...", "name": "...", "partNumber": "...", "quantity": 1, "unitCost": 0.00, "totalCost": 0.00, "description": "...", "category": "MCU|Sensor|Actuator|Display|Power", "specifications": "...", "lcscLink": "...", "amazonLink": "...", "aliexpressLink": "..." } ],
  "wiring": {
    "components": [ { "id": "...", "name": "...", "type": "...", "pins": ["GND", "VCC", "SDA", "SCL"], "x": 10, "y": 20, "color": "#ff0000" } ],
    "connections": [ { "from": "compId.PIN", "to": "compId.PIN", "signal": "I2C SDA", "voltage": "3.3V", "color": "#00ff00" } ],
    "drcIssues": [ { "severity": "error|warning", "message": "...", "componentId": "..." } ]
  },
  "mech": { "components": [], "dimensions": "100mm x 62mm", "notes": "" },
  "instructions": [ { "id": "1", "stepNumber": 1, "title": "...", "description": "...", "details": "...", "tools": [], "warning": "...", "estimatedTime": "...", "completed": false } ],
  "model3d": { "type": "robot|drone|handheld|pcb|wearable|vehicle|enclosure", "primaryColor": "#ff0055", "accentColor": "#00d4ff" },
  "costOptimizations": [ { "componentId": "...", "suggestion": "Swap with generic variant", "savings": 1.50 } ]
}`;

export function useWirecraft() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme>('dark-steel');
  const [userSession, setUserSession] = useState<any>(null);
  const [localUsageCount, setLocalUsageCount] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const cachedTheme = localStorage.getItem('wc_theme') as Theme;
    if (cachedTheme) {
      setActiveTheme(cachedTheme);
    }

    const usage = localStorage.getItem('wc_usage_local');
    if (usage !== null) {
      setLocalUsageCount(parseInt(usage));
    } else {
      localStorage.setItem('wc_usage_local', '10');
    }

    const stored = localStorage.getItem('wc_projects_local');
    if (stored) {
      setSavedProjects(JSON.parse(stored));
    }
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setActiveTheme(theme);
    localStorage.setItem('wc_theme', theme);
  }, []);

  const createNewProject = useCallback(() => {
    const newProject: Project = {
      id: 'proj_' + Date.now(),
      name: 'Untitled Workspace Schema',
      data: {
        info: {
          title: 'Untitled Workspace Schema',
          description: 'Provide query parameters or hardware ideas in the bottom chat bar to orchestrate details.',
          difficulty: 'Beginner',
          estimatedTime: '4 Hours',
          totalCost: 12.00,
          tags: ['Custom', 'DIY'],
          safetyNotes: 'Observe correct lead placements and terminal ground loops.'
        },
        bom: [
          {
            id: 'u1',
            name: 'Atmega328P MCU',
            partNumber: 'ATMEGA328P-PU',
            quantity: 1,
            unitCost: 4.50,
            totalCost: 4.50,
            description: '8-bit microcontroller core',
            category: 'MCU',
            specifications: 'DIP-28, 5V, 20MHz',
            lcscLink: 'https://szlcsc.com',
            amazonLink: '#',
            aliexpressLink: '#'
          },
          {
            id: 'r1',
            name: 'Pull-up Resistor',
            partNumber: 'RC0603FR-0710KL',
            quantity: 2,
            unitCost: 0.15,
            totalCost: 0.30,
            description: '10k Ohm axial lead component',
            category: 'Actuator',
            specifications: '0.25W metal film',
            lcscLink: 'https://szlcsc.com',
            amazonLink: '#',
            aliexpressLink: '#'
          }
        ],
        wiring: {
          components: [
            {
              id: 'MCU_0',
              name: 'Main ATMega MCU',
              type: 'Atmega328P',
              pins: ['GND', 'VCC', 'RESET', 'SCK', 'MISO', 'MOSI'],
              x: 20,
              y: 35,
              color: '#f59e0b'
            },
            {
              id: 'LED_0',
              name: 'Indicator LED',
              type: 'LED Red 5mm',
              pins: ['ANODE', 'CATHODE'],
              x: 60,
              y: 55,
              color: '#ef4444'
            }
          ],
          connections: [
            {
              from: 'MCU_0.RESET',
              to: 'LED_0.ANODE',
              signal: 'RST LED',
              voltage: '5V',
              color: '#3b82f6'
            }
          ],
          drcIssues: [
            {
              severity: 'warning',
              message: 'Atmospheric decoupling capacitors omitted on core rails.',
              componentId: 'MCU_0'
            }
          ]
        },
        mech: {
          components: [],
          dimensions: '100mm x 62mm',
          notes: ''
        },
        instructions: [
          {
            id: '1',
            stepNumber: 1,
            title: 'Check workspace materials',
            description: 'Lay out all mechanical elements, microcontroller core modules, and resistor resistors.',
            details: 'Apply clean static precautions.',
            tools: ['Tweezers'],
            warning: 'ESD sensitive components!',
            estimatedTime: '15 mins',
            completed: false
          }
        ],
        model3d: {
          type: 'pcb',
          primaryColor: '#0a3f1d',
          accentColor: '#22c55e'
        },
        costOptimizations: []
      }
    };
    setCurrentProject(newProject);
    saveProject(newProject);
  }, []);

  const saveProject = useCallback((project: Project) => {
    setSavedProjects(prev => {
      const existIdx = prev.findIndex(p => p.id === project.id);
      let newProjects;
      if (existIdx !== -1) {
        newProjects = [...prev];
        newProjects[existIdx] = project;
      } else {
        newProjects = [...prev, project];
      }
      localStorage.setItem('wc_projects_local', JSON.stringify(newProjects));
      return newProjects;
    });
  }, []);

  const loadProject = useCallback((projectId: string) => {
    const found = savedProjects.find(p => p.id === projectId);
    if (found) {
      setCurrentProject(found);
    }
  }, [savedProjects]);

  const deleteProject = useCallback((projectId: string) => {
    setSavedProjects(prev => {
      const newProjects = prev.filter(p => p.id !== projectId);
      localStorage.setItem('wc_projects_local', JSON.stringify(newProjects));
      return newProjects;
    });
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  }, [currentProject]);

  const renameProject = useCallback((newName: string) => {
    if (currentProject) {
      const updated = { ...currentProject, name: newName || 'Untitled Project' };
      setCurrentProject(updated);
      saveProject(updated);
    }
  }, [currentProject, saveProject]);

  const generateHardware = useCallback(async (prompt: string) => {
    if (localUsageCount <= 0) {
      alert('You have reached your free generation limit of 10 requests for the current workspace.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt.substring(0, 500),
          systemPrompt: SYSTEM_PROMPT,
          plan: 'free'
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status HTTP ${response.status}`);
      }

      const resData = await response.json();
      if (!resData?.content?.[0]?.text) {
        throw new Error('Invalid response schema received from Server.');
      }

      const contentText = resData.content[0].text;
      const generatedData = extractJSON(contentText);

      const newProject: Project = {
        id: 'proj_' + Date.now(),
        name: generatedData.info.title || prompt,
        data: generatedData
      };

      setCurrentProject(newProject);
      saveProject(newProject);

      setLocalUsageCount(prev => {
        const newCount = Math.max(0, prev - 1);
        localStorage.setItem('wc_usage_local', newCount.toString());
        return newCount;
      });
    } catch (e) {
      console.error('AI Generation routing error, fallback loaded.', e);
      loadProceduralFallback(prompt);
    } finally {
      setIsGenerating(false);
    }
  }, [localUsageCount, saveProject]);

  const loadProceduralFallback = useCallback((prompt: string) => {
    const difficulty = prompt.toLowerCase().includes('advanced') ? 'Advanced' : 'Intermediate';
    const type = prompt.toLowerCase().includes('drone') ? 'drone' : 
                 prompt.toLowerCase().includes('wearable') ? 'wearable' : 'pcb';

    const payload: ProjectData = {
      info: {
        title: prompt,
        description: `Telemetry board for ${prompt}. Full multi-layer micro vias layout.`,
        difficulty,
        estimatedTime: '14 Hours',
        totalCost: 28.50,
        tags: ['ESP32', 'Prototype', 'IoT'],
        safetyNotes: 'Ensure matching common terminal logs grounding to avoid floating voltage loops.'
      },
      bom: [
        {
          id: 'u1',
          name: 'Microprocessor core',
          partNumber: 'ESP32-S3-WROOM-1',
          quantity: 1,
          unitCost: 3.80,
          totalCost: 3.80,
          description: 'Wi-Fi BLE SoC system core',
          category: 'MCU',
          specifications: '8MB flash, Dual core',
          lcscLink: '#',
          amazonLink: '#',
          aliexpressLink: '#'
        },
        {
          id: 's1',
          name: 'Precision Sensor chip',
          partNumber: 'MPU-6050-SMD',
          quantity: 1,
          unitCost: 4.20,
          totalCost: 4.20,
          description: '6-axis motion accel IMU tracker',
          category: 'Sensor',
          specifications: 'I2C interface, 1.8V-3.4V',
          lcscLink: '#',
          amazonLink: '#',
          aliexpressLink: '#'
        },
        {
          id: 'r1',
          name: 'Decoupling array',
          partNumber: 'CR0402-10K',
          quantity: 4,
          unitCost: 0.20,
          totalCost: 0.80,
          description: 'Thin film pullup passive set',
          category: 'Actuator',
          specifications: '0402 SMD packaging',
          lcscLink: '#',
          amazonLink: '#',
          aliexpressLink: '#'
        }
      ],
      wiring: {
        components: [
          {
            id: 'MCU_1',
            name: 'Core SoC Board',
            type: 'ESP32 IoT Node',
            pins: ['VCC', 'GND', 'SDA', 'SCL', 'TXD', 'RXD'],
            x: 15,
            y: 25,
            color: '#0284c7'
          },
          {
            id: 'IMU_1',
            name: 'Gyro IMU Module',
            type: 'Precision Sensor',
            pins: ['VCC', 'GND', 'SDA', 'SCL'],
            x: 65,
            y: 40,
            color: '#16a34a'
          },
          {
            id: 'PWR_1',
            name: 'LDO Regulator',
            type: '3.3V Power IC',
            pins: ['VIN', 'GND', 'VOUT'],
            x: 40,
            y: 75,
            color: '#dc2626'
          }
        ],
        connections: [
          {
            from: 'MCU_1.SDA',
            to: 'IMU_1.SDA',
            signal: 'I2C Data Bus',
            voltage: '3.3V',
            color: '#0ea5e9'
          },
          {
            from: 'MCU_1.SCL',
            to: 'IMU_1.SCL',
            signal: 'I2C Clock Bus',
            voltage: '3.3V',
            color: '#10b981'
          },
          {
            from: 'PWR_1.VOUT',
            to: 'MCU_1.VCC',
            signal: 'Power Feed',
            voltage: '3.3V',
            color: '#ef4444'
          }
        ],
        drcIssues: []
      },
      mech: {
        components: [],
        dimensions: '100mm x 62mm',
        notes: ''
      },
      instructions: [
        {
          id: '1',
          stepNumber: 1,
          title: 'Secure raw substrate assembly',
          description: 'Position LDO Regulator on clean solder pad matching standard flow rules.',
          details: 'Inspect footprints before heat treatment.',
          tools: ['Soldering Iron'],
          warning: 'LDO IC orientation is crucial.',
          estimatedTime: '10m',
          completed: false
        },
        {
          id: '2',
          stepNumber: 2,
          title: 'Set passive decoupling cap lines',
          description: 'Manually solder core 10K thin-film pullups securely in-place adjacent to IC stubs.',
          details: 'Check values under microscope loop.',
          tools: ['Tweezers', 'Flux Pen'],
          warning: 'Pre-tin the pads for clean flow.',
          estimatedTime: '20m',
          completed: false
        }
      ],
      model3d: {
        type,
        primaryColor: '#2563eb',
        accentColor: '#10b981'
      },
      costOptimizations: [
        {
          componentId: 'IMU_1',
          suggestion: 'Leverage alternate OEM IMU sensor assembly',
          savings: 1.20
        }
      ]
    };

    const newProject: Project = {
      id: 'proj_' + Date.now(),
      name: prompt,
      data: payload
    };

    setCurrentProject(newProject);
    saveProject(newProject);
  }, [saveProject]);

  return {
    currentProject,
    savedProjects,
    activeTheme,
    userSession,
    localUsageCount,
    isSidebarOpen,
    isGenerating,
    setTheme,
    setSidebarOpen: setIsSidebarOpen,
    setUserSession,
    createNewProject,
    saveProject,
    loadProject,
    deleteProject,
    renameProject,
    generateHardware
  };
}

function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch (e) {}

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    const candidate = text.substring(start, end + 1);
    try {
      return JSON.parse(candidate);
    } catch (e) {}

    for (let i = end; i > start + 5; i--) {
      try {
        return JSON.parse(text.substring(start, i + 1));
      } catch (e) {}
    }
  }
  throw new Error('Could not parse valid JSON');
}
