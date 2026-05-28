export interface Component {
  id: string;
  name: string;
  type: string;
  pins: string[];
  x: number;
  y: number;
  color: string;
}

export interface Connection {
  from: string;
  to: string;
  signal: string;
  voltage: string;
  color: string;
}

export interface DRCIssue {
  severity: 'error' | 'warning';
  message: string;
  componentId: string;
}

export interface WiringData {
  components: Component[];
  connections: Connection[];
  drcIssues: DRCIssue[];
}

export interface BOMItem {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  description: string;
  category: string;
  specifications: string;
  lcscLink: string;
  amazonLink: string;
  aliexpressLink: string;
}

export interface Instruction {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  details: string;
  tools: string[];
  warning: string;
  estimatedTime: string;
  completed: boolean;
}

export interface Model3D {
  type: 'robot' | 'drone' | 'handheld' | 'pcb' | 'wearable' | 'vehicle' | 'enclosure';
  primaryColor: string;
  accentColor: string;
}

export interface CostOptimization {
  componentId: string;
  suggestion: string;
  savings: number;
}

export interface ProjectData {
  info: {
    title: string;
    description: string;
    difficulty: string;
    estimatedTime: string;
    totalCost: number;
    tags: string[];
    safetyNotes: string;
  };
  bom: BOMItem[];
  wiring: WiringData;
  mech: {
    components: any[];
    dimensions: string;
    notes: string;
  };
  instructions: Instruction[];
  model3d: Model3D;
  costOptimizations: CostOptimization[];
}

export interface Project {
  id: string;
  name: string;
  data: ProjectData;
}

export type Theme = 'dark-steel' | 'engineering-paper' | 'midnight-pcb' | 'blueprint';
