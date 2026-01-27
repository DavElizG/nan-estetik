/**
 * Diamond3D Component - Elegant Crystal/Diamond
 * 
 * Premium 3D diamond with:
 * - Faceted geometry (Icosahedron/Octahedron)
 * - Glass-like transparency with refraction
 * - Sparkle lighting effects
 * - Slow elegant rotation
 * - Contained within parent element (not fixed)
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

interface Diamond3DProps {
  className?: string;
}

// ============================================
// COLORS
// ============================================
const GOLD_TINT = 0xFFD700;
const WARM_WHITE = 0xFFF8E7;

// ============================================
// SPARKLE PARTICLES
// ============================================

function createSparkles(): THREE.Points {
  const particleCount = 60;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = 1.2 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    sizes[i] = 0.02 + Math.random() * 0.03;
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const material = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xFFFFFF,
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

export function Diamond3D({ className = '' }: Diamond3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const diamondRef = useRef<THREE.Mesh | null>(null);
  const sparklesRef = useRef<THREE.Points | null>(null);
  const lightsRef = useRef<THREE.PointLight[]>([]);
  const animationIdRef = useRef<number>(0);
  const timeRef = useRef(0);

  const initScene = useCallback(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer with high quality settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    rendererRef.current = renderer;

    // ============================================
    // PREMIUM LIGHTING FOR DIAMOND SPARKLE
    // ============================================
    
    // Ambient light - base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Main spotlight from top for sparkle
    const spotLight = new THREE.SpotLight(0xffffff, 3);
    spotLight.position.set(0, 5, 2);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.decay = 1.5;
    scene.add(spotLight);

    // Point lights around diamond for refraction effects
    const lightPositions = [
      { pos: [2, 1, 2], color: 0xffffff, intensity: 1.5 },
      { pos: [-2, 1, 2], color: WARM_WHITE, intensity: 1.2 },
      { pos: [0, -2, 2], color: GOLD_TINT, intensity: 0.8 },
      { pos: [1, 2, -1], color: 0xffffff, intensity: 1 },
    ];

    lightPositions.forEach(({ pos, color, intensity }) => {
      const light = new THREE.PointLight(color, intensity, 10);
      light.position.set(pos[0], pos[1], pos[2]);
      scene.add(light);
      lightsRef.current.push(light);
    });

    // ============================================
    // CREATE DIAMOND
    // ============================================
    
    // Use Octahedron for classic diamond shape
    const diamondGeometry = new THREE.OctahedronGeometry(0.8, 0);
    
    // Stretch to make more diamond-like proportions
    diamondGeometry.scale(1, 1.3, 1);
    
    // Premium glass/crystal material
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.5,
      envMapIntensity: 2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      ior: 2.4, // Diamond refractive index
      reflectivity: 1,
      transparent: true,
      opacity: 0.95,
    });

    const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamondRef.current = diamond;
    scene.add(diamond);

    // Inner faceted core for extra sparkle
    const innerGeometry = new THREE.OctahedronGeometry(0.5, 1);
    innerGeometry.scale(1, 1.3, 1);
    
    const innerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFD700,
      metalness: 0.3,
      roughness: 0.1,
      transmission: 0.7,
      thickness: 0.3,
      emissive: 0xFFD700,
      emissiveIntensity: 0.05,
      transparent: true,
      opacity: 0.3,
    });

    const innerDiamond = new THREE.Mesh(innerGeometry, innerMaterial);
    diamond.add(innerDiamond);

    // Edge highlights using EdgesGeometry
    const edgesGeometry = new THREE.EdgesGeometry(diamondGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    diamond.add(edges);

    // Sparkle particles
    const sparkles = createSparkles();
    sparklesRef.current = sparkles;
    scene.add(sparkles);

    // Environment map for reflections (simple cube)
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);
    scene.add(cubeCamera);

  }, []);

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    timeRef.current += 0.016;
    const time = timeRef.current;

    if (diamondRef.current) {
      // ============================================
      // SLOW ELEGANT ROTATION
      // ============================================
      diamondRef.current.rotation.y += 0.005;
      diamondRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      
      // Gentle floating motion
      diamondRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }

    // ============================================
    // ANIMATE LIGHTS FOR SPARKLE EFFECT
    // ============================================
    lightsRef.current.forEach((light, i) => {
      const offset = i * Math.PI * 0.5;
      light.intensity = 1 + Math.sin(time * 2 + offset) * 0.5;
    });

    // ============================================
    // SPARKLES ANIMATION
    // ============================================
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y = time * 0.1;
      sparklesRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      const pMat = sparklesRef.current.material as THREE.PointsMaterial;
      pMat.opacity = 0.4 + Math.sin(time * 1.5) * 0.2;
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
    };
  }, [initScene, animate, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}
