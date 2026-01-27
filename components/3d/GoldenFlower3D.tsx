/**
 * GoldenFlower3D Component - Mathematical 3D Rose/Flower
 * 
 * Premium 3D golden flower with:
 * - Mathematical petals using spherical coordinates
 * - Based on creative mathematical flower algorithm
 * - Metallic gold material (#D4AF37)
 * - Organic petal curves with physics-based hang down
 * - Golden floating particles
 * - Warm spotlight lighting
 * - Scroll-driven transformations
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GoldenFlower3DProps {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

// ============================================
// COLORS
// ============================================
const GOLD_PRIMARY = 0xD4AF37;
const GOLD_LIGHT = 0xF5E6A3;
const STEM_GREEN = 0x2d5016;
const LEAF_GREEN = 0x3a6b1e;

// ============================================
// ELEGANT GOLDEN RINGS - SIMPLE & AESTHETIC
// Premium concentric rings with central sphere
// ============================================

/**
 * Creates elegant golden rings sculpture
 * Simple, clean design perfect for aesthetic center
 */
function createGoldenRings(): THREE.Group {
  const sculpture = new THREE.Group();
  
  // Premium metallic gold material
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: GOLD_PRIMARY,
    metalness: 0.95,
    roughness: 0.15,
    side: THREE.DoubleSide,
  });
  
  // Central glowing sphere
  const sphereGeom = new THREE.SphereGeometry(0.3, 32, 32);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: GOLD_LIGHT,
    metalness: 0.98,
    roughness: 0.05,
    emissive: GOLD_LIGHT,
    emissiveIntensity: 0.3,
  });
  const sphere = new THREE.Mesh(sphereGeom, sphereMat);
  sculpture.add(sphere);
  
  // Create 3 elegant rings at different angles
  const ringConfigs = [
    { radius: 0.8, tube: 0.03, rotation: [0, 0, 0] },
    { radius: 1.0, tube: 0.025, rotation: [Math.PI / 2, 0, 0] },
    { radius: 1.2, tube: 0.02, rotation: [0, Math.PI / 2, Math.PI / 4] },
  ];
  
  ringConfigs.forEach((config, index) => {
    const ringGeom = new THREE.TorusGeometry(config.radius, config.tube, 24, 64);
    const ring = new THREE.Mesh(ringGeom, goldMaterial);
    ring.rotation.set(config.rotation[0], config.rotation[1], config.rotation[2]);
    ring.userData = { type: 'ring', index };
    sculpture.add(ring);
  });
  
  sculpture.userData = { type: 'sculpture' };
  
  return sculpture;
}

/**
 * Creates subtle floating golden particles
 */
function createGoldenParticles(): THREE.Points {
  const particleCount = 80;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = 2.5 + Math.random() * 3.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 0.5;
    positions[i3 + 2] = radius * Math.cos(phi);
    
    sizes[i] = 0.02 + Math.random() * 0.03;
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const material = new THREE.PointsMaterial({
    size: 0.04,
    color: GOLD_PRIMARY,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  
  return new THREE.Points(geometry, material);
}

// ============================================
// MAIN COMPONENT
// ============================================

export function GoldenFlower3D({ scrollContainerRef, className = '' }: GoldenFlower3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const flowerGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number>(0);
  const scrollProgressRef = useRef({ value: 0 });
  const timeRef = useRef(0);

  const initScene = useCallback(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera positioned to see full flower
    const camera = new THREE.PerspectiveCamera(
      50,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // High quality renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;

    // ============================================
    // PREMIUM WARM LIGHTING FOR METALLIC GOLD
    // ============================================
    
    // Soft ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    // Main warm spotlight - key light for gold
    const spotLight = new THREE.SpotLight(0xfff8e7, 2.5);
    spotLight.position.set(4, 6, 5);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.6;
    spotLight.decay = 1.2;
    spotLight.distance = 25;
    scene.add(spotLight);

    // Secondary warm directional light
    const warmLight = new THREE.DirectionalLight(0xffe4b5, 1.2);
    warmLight.position.set(-3, 4, 3);
    scene.add(warmLight);

    // Golden rim/back light for metallic glow
    const rimLight = new THREE.PointLight(0xd4af37, 2, 12);
    rimLight.position.set(0, 2, -4);
    scene.add(rimLight);

    // Bottom fill light - subtle warm
    const fillLight = new THREE.PointLight(0xfff5dc, 0.6, 10);
    fillLight.position.set(0, -5, 3);
    scene.add(fillLight);

    // Side accent light
    const accentLight = new THREE.PointLight(0xffecd2, 0.8, 8);
    accentLight.position.set(-4, 0, 2);
    scene.add(accentLight);

    // ============================================
    // CREATE ELEGANT GOLDEN RINGS SCULPTURE
    // ============================================
    
    const sculpture = createGoldenRings();
    flowerGroupRef.current = sculpture;

    // Position sculpture
    sculpture.position.y = 0;
    sculpture.scale.setScalar(2.0);
    scene.add(sculpture);

    // Golden particles for luxury feel
    const particles = createGoldenParticles();
    particlesRef.current = particles;
    scene.add(particles);

  }, []);

  const setupScrollAnimations = useCallback(() => {
    if (!scrollContainerRef.current) return;

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

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const progress = scrollProgressRef.current.value;
    timeRef.current += 0.016;
    const time = timeRef.current;

    if (flowerGroupRef.current) {
      // ============================================
      // ROTATION ANIMATION - MUY LENTA + SCROLL
      // ============================================
      // Rotación automática muy lenta + basada en scroll
      flowerGroupRef.current.rotation.y = time * 0.03 + progress * Math.PI * 2;
      
      // Gentle tilt for elegance
      flowerGroupRef.current.rotation.x = Math.sin(progress * Math.PI) * 0.2 + (Math.PI / 8);
      flowerGroupRef.current.rotation.z = Math.cos(progress * Math.PI * 0.5) * 0.08;

      // ============================================
      // SCALE ANIMATION
      // ============================================
      const scaleProgress = Math.sin(progress * Math.PI);
      const scale = 0.9 + scaleProgress * 0.25;
      flowerGroupRef.current.scale.setScalar(scale);

      // ============================================
      // RINGS INDEPENDENT ROTATION
      // ============================================
      flowerGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.type === 'ring') {
          const index = child.userData.index;
          // Each ring rotates at different speed for dynamic effect
          child.rotation.x += 0.003 * (index + 1);
          child.rotation.y += 0.002 * (index + 1);
        }
      });
    }

    // ============================================
    // PARTICLES ANIMATION - MUY LENTA + SCROLL
    // ============================================
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02 + progress * Math.PI * 0.5;
      particlesRef.current.rotation.x = Math.sin(time * 0.15) * 0.08 + Math.sin(progress * Math.PI) * 0.15;
      
      const pMat = particlesRef.current.material as THREE.PointsMaterial;
      pMat.opacity = 0.5 + progress * 0.3;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
  }, []);

  const handleResize = useCallback(() => {
    if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  useEffect(() => {
    initScene();
    setupScrollAnimations();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', handleResize);
      
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
      
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === scrollContainerRef.current) {
          st.kill();
        }
      });
    };
  }, [initScene, setupScrollAnimations, animate, handleResize, scrollContainerRef]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}

// Export as Rose3D for backward compatibility
export { GoldenFlower3D as Rose3D };
