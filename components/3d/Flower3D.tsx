/**
 * Flower3D Component
 * 
 * Modelo 3D de flor/pétalos orgánicos procedurales usando Three.js
 * - Geometría procedural con pétalos elegantes
 * - Integración con GSAP ScrollTrigger para animaciones scroll-driven
 * - Iluminación suave y materiales premium
 * - Optimizado para rendimiento
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Flower3DProps {
  /** Referencia al contenedor padre para ScrollTrigger */
  scrollContainerRef: React.RefObject<HTMLElement | null>;
  /** Clase CSS adicional para el canvas */
  className?: string;
}

/**
 * Crea un pétalo individual con geometría curva y elegante
 */
function createPetal(index: number, totalPetals: number): THREE.Mesh {
  // Geometría del pétalo usando forma de bezier extruida
  const shape = new THREE.Shape();
  
  // Dibujar forma de pétalo orgánico
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.3, 0.3, 0.5, 0.8, 0.2, 1.2);
  shape.bezierCurveTo(0, 1.4, -0.2, 1.4, -0.2, 1.2);
  shape.bezierCurveTo(-0.5, 0.8, -0.3, 0.3, 0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.02,
    bevelSegments: 3,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  
  // Material con efecto de vidrio/cristal dorado elegante
  const hue = 0.12 + (index / totalPetals) * 0.05; // Variación sutil de dorado
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color().setHSL(hue, 0.6, 0.55),
    metalness: 0.3,
    roughness: 0.2,
    transmission: 0.3,
    thickness: 0.5,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
  });

  const mesh = new THREE.Mesh(geometry, material);
  
  // Posicionar en círculo
  const angle = (index / totalPetals) * Math.PI * 2;
  mesh.rotation.z = angle;
  mesh.rotation.x = Math.PI / 6; // Inclinación para efecto 3D
  
  // Datos personalizados para animación
  mesh.userData = {
    baseRotationZ: angle,
    baseRotationX: Math.PI / 6,
    index,
    openOffset: 0,
  };

  return mesh;
}

/**
 * Crea el centro de la flor
 */
function createCenter(): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(0.15, 32, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#d4af37'),
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });
  
  return new THREE.Mesh(geometry, material);
}

/**
 * Crea partículas flotantes decorativas
 */
function createParticles(): THREE.Points {
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const goldenColor = new THREE.Color('#d4af37');
  const creamColor = new THREE.Color('#f5f5dc');
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Distribución esférica alrededor de la flor
    const radius = 2 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    // Color aleatorio entre dorado y crema
    const mixColor = Math.random() > 0.5 ? goldenColor : creamColor;
    colors[i3] = mixColor.r;
    colors[i3 + 1] = mixColor.g;
    colors[i3 + 2] = mixColor.b;
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });
  
  return new THREE.Points(geometry, material);
}

export function Flower3D({ scrollContainerRef, className = '' }: Flower3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const flowerGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number>(0);
  const scrollProgressRef = useRef({ value: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  /**
   * Inicializa la escena de Three.js
   */
  const initScene = useCallback(() => {
    if (!canvasRef.current) return;

    // Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Cámara
    const camera = new THREE.PerspectiveCamera(
      60,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.z = 4;
    cameraRef.current = camera;

    // Renderer con transparencia
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Iluminación elegante
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0xd4af37, 0.5);
    backLight.position.set(-5, -2, -5);
    scene.add(backLight);

    const rimLight = new THREE.PointLight(0xf5f5dc, 0.8, 10);
    rimLight.position.set(0, 3, 2);
    scene.add(rimLight);

    // Grupo de la flor
    const flowerGroup = new THREE.Group();
    flowerGroupRef.current = flowerGroup;

    // Crear pétalos (8 pétalos principales)
    const petalCount = 8;
    for (let i = 0; i < petalCount; i++) {
      const petal = createPetal(i, petalCount);
      flowerGroup.add(petal);
    }

    // Capa interna de pétalos más pequeños
    for (let i = 0; i < 6; i++) {
      const innerPetal = createPetal(i, 6);
      innerPetal.scale.set(0.6, 0.6, 0.6);
      innerPetal.rotation.z += Math.PI / 6; // Offset para entrelazar
      innerPetal.userData.isInner = true;
      flowerGroup.add(innerPetal);
    }

    // Centro de la flor
    const center = createCenter();
    flowerGroup.add(center);

    scene.add(flowerGroup);

    // Partículas
    const particles = createParticles();
    particlesRef.current = particles;
    scene.add(particles);

    // Estado inicial: flor cerrada
    flowerGroup.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.userData.baseRotationX !== undefined) {
        child.rotation.x = Math.PI / 2.5; // Más cerrada inicialmente
      }
    });

  }, []);

  /**
   * Configura las animaciones de ScrollTrigger
   */
  const setupScrollAnimations = useCallback(() => {
    if (!scrollContainerRef.current || !flowerGroupRef.current) return;

    // Animación principal basada en scroll
    ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        scrollProgressRef.current.value = self.progress;
      },
    });

  }, [scrollContainerRef]);

  /**
   * Loop de animación
   */
  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const progress = scrollProgressRef.current.value;
    const time = performance.now() * 0.001;

    if (flowerGroupRef.current) {
      // Rotación base + rotación por scroll
      flowerGroupRef.current.rotation.y = progress * Math.PI * 2 + time * 0.1;
      flowerGroupRef.current.rotation.x = Math.sin(progress * Math.PI) * 0.3;

      // Escala basada en scroll (crece y se expande)
      const scale = 1 + Math.sin(progress * Math.PI) * 0.3;
      flowerGroupRef.current.scale.setScalar(scale);

      // Animar apertura de pétalos
      flowerGroupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.baseRotationX !== undefined) {
          const isInner = child.userData.isInner;
          const openFactor = isInner ? 0.7 : 1;
          
          // Apertura progresiva de pétalos
          const targetRotationX = Math.PI / 6 - progress * (Math.PI / 4) * openFactor;
          child.rotation.x = THREE.MathUtils.lerp(
            child.rotation.x,
            targetRotationX,
            0.1
          );

          // Pequeña oscilación orgánica
          const idx = child.userData.index || 0;
          child.rotation.z = child.userData.baseRotationZ + 
            Math.sin(time + idx) * 0.05 * (1 - progress * 0.5);
        }
      });

      // Efecto de mouse parallax sutil
      flowerGroupRef.current.rotation.x += mouseRef.current.y * 0.1;
      flowerGroupRef.current.rotation.y += mouseRef.current.x * 0.1;
    }

    // Animar partículas
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05;
      particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      
      // Opacidad de partículas según progreso
      const particleMaterial = particlesRef.current.material as THREE.PointsMaterial;
      particleMaterial.opacity = 0.3 + progress * 0.5;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
  }, []);

  /**
   * Maneja el redimensionamiento
   */
  const handleResize = useCallback(() => {
    if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  /**
   * Maneja el movimiento del mouse para parallax sutil
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    gsap.to(mouseRef.current, {
      x: x * 0.05,
      y: y * 0.05,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);

  // Inicialización
  useEffect(() => {
    initScene();
    setupScrollAnimations();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      // Cleanup
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      // Dispose de recursos Three.js
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            }
          }
        });
      }
      
      // Limpiar ScrollTrigger
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === scrollContainerRef.current) {
          st.kill();
        }
      });
    };
  }, [initScene, setupScrollAnimations, animate, handleResize, handleMouseMove, scrollContainerRef]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}
