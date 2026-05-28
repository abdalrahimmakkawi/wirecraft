import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Model3D } from '../types';

interface Model3DViewerProps {
  model3d: Model3D;
}

export function Model3DViewer({ model3d }: Model3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;
    camera.position.x = 2;
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create 3D model based on type
    const group = new THREE.Group();
    const primaryColor = new THREE.Color(model3d.primaryColor || '#0ea5e9');
    const accentColor = new THREE.Color(model3d.accentColor || '#10b981');

    if (model3d.type === 'pcb') {
      // PCB substrate
      const substrateGeometry = new THREE.BoxGeometry(3, 0.1, 2);
      const substrateMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x061a0e,
        roughness: 0.7,
        metalness: 0.3
      });
      const substrate = new THREE.Mesh(substrateGeometry, substrateMaterial);
      group.add(substrate);

      // Copper traces
      const traceMaterial = new THREE.MeshStandardMaterial({ 
        color: accentColor,
        roughness: 0.5,
        metalness: 0.8
      });
      
      for (let i = 0; i < 5; i++) {
        const traceGeometry = new THREE.BoxGeometry(0.05, 0.02, 0.5);
        const trace = new THREE.Mesh(traceGeometry, traceMaterial);
        trace.position.set(-1 + i * 0.5, 0.06, 0);
        group.add(trace);
      }

      // Components
      const compMaterial = new THREE.MeshStandardMaterial({ 
        color: primaryColor,
        roughness: 0.4,
        metalness: 0.6
      });
      
      for (let i = 0; i < 3; i++) {
        const compGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.4);
        const comp = new THREE.Mesh(compGeometry, compMaterial);
        comp.position.set(-0.5 + i * 0.5, 0.12, 0);
        group.add(comp);
      }
    } else if (model3d.type === 'robot' || model3d.type === 'drone') {
      // Base
      const baseGeometry = new THREE.CylinderGeometry(1, 1.2, 0.3, 32);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2d3748,
        roughness: 0.6,
        metalness: 0.4
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      group.add(base);

      // Arm
      const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
      const armMaterial = new THREE.MeshStandardMaterial({ 
        color: primaryColor,
        roughness: 0.4,
        metalness: 0.6
      });
      const arm = new THREE.Mesh(armGeometry, armMaterial);
      arm.position.y = 1.15;
      group.add(arm);

      // Joint
      const jointGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const jointMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe2e8f0,
        roughness: 0.3,
        metalness: 0.7
      });
      const joint = new THREE.Mesh(jointGeometry, jointMaterial);
      joint.position.y = 2.15;
      group.add(joint);

      // Gripper
      const gripperGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.1);
      const gripperMaterial = new THREE.MeshStandardMaterial({ 
        color: accentColor,
        roughness: 0.4,
        metalness: 0.6
      });
      const gripper = new THREE.Mesh(gripperGeometry, gripperMaterial);
      gripper.position.set(0.3, 2.3, 0);
      group.add(gripper);
    } else {
      // Generic enclosure/device
      const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 1.2);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1e293b,
        roughness: 0.5,
        metalness: 0.5
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);

      // Screen
      const screenGeometry = new THREE.PlaneGeometry(1.2, 0.6);
      const screenMaterial = new THREE.MeshStandardMaterial({ 
        color: primaryColor,
        emissive: primaryColor,
        emissiveIntensity: 0.3,
        roughness: 0.2,
        metalness: 0.8
      });
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.set(0, 0.1, 0.61);
      group.add(screen);

      // Control dial
      const dialGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
      const dialMaterial = new THREE.MeshStandardMaterial({ 
        color: accentColor,
        roughness: 0.3,
        metalness: 0.7
      });
      const dial = new THREE.Mesh(dialGeometry, dialMaterial);
      dial.position.set(0.5, 0.45, 0.61);
      dial.rotation.x = Math.PI / 2;
      group.add(dial);
    }

    scene.add(group);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      group.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [model3d]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[280px] flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px' }}
    />
  );
}
