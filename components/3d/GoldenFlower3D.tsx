/**
 * GoldenFlower3D Component - Elegant Metallic Gold Lotus/Rose
 * 
 * Premium 3D golden flower with:
 * - Smooth curved petals using LatheGeometry
 * - Metallic gold material (#D4AF37)
 * - 8-12 elegant petals in multiple layers
 * - Golden center sphere
 * - Deep green smooth stem
 * - 2-3 organic leaves
 * - Warm spotlight lighting
 * - Subtle rotation animation
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
const GOLD_DARK = 0xB8962E;
const STEM_GREEN = 0x2D5016;
const LEAF_GREEN = 0x3A6B1E;

// ============================================
// SMOOTH PETAL GEOMETRY - Using LatheGeometry
// ============================================

/**
 * Creates a smooth curved petal using custom geometry with organic curves
 */
function createSmoothPetal(
  layer: number,
  index: number,
  totalInLayer: number,
  config: { scale: number; openAngle: number; heightOffset: number; curvature: number }
): THREE.Mesh {
  // Create smooth petal profile using curves
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.15, 0.3, 0.05),
    new THREE.Vector3(0.12, 0.6, 0.1),
    new THREE.Vector3(0, 0.85, 0.08)
  );
  
  // Generate petal shape by extruding curve with width variation
  const points = curve.getPoints(20);
  const petalGeometry = new THREE.BufferGeometry();
  
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  
  // Create petal mesh with varying width
  const widthSegments = 12;
  const lengthSegments = points.length - 1;
  
  for (let i = 0; i <= lengthSegments; i++) {
    const t = i / lengthSegments;
    const point = points[i];
    
    // Width varies along the petal - wider in middle, narrower at ends
    const width = Math.sin(t * Math.PI) * 0.25 * (1 - t * 0.3);
    
    // Add curvature (bowl shape)
    const curveFactor = config.curvature * Math.sin(t * Math.PI);
    
    for (let j = 0; j <= widthSegments; j++) {
      const u = j / widthSegments;
      const angle = (u - 0.5) * Math.PI;
      
      const x = point.x + Math.sin(angle) * width;
      const y = point.y;
      const z = point.z + Math.cos(angle) * width * 0.3 + curveFactor * (1 - Math.abs(u - 0.5) * 2);
      
      vertices.push(x, y, z);
      uvs.push(u, t);
    }
  }
  
  // Create faces
  const indices: number[] = [];
  for (let i = 0; i < lengthSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const a = i * (widthSegments + 1) + j;
      const b = a + widthSegments + 1;
      const c = a + 1;
      const d = b + 1;
      
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }
  
  petalGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  petalGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  petalGeometry.setIndex(indices);
  petalGeometry.computeVertexNormals();
  
  // Premium metallic gold material
  const material = new THREE.MeshStandardMaterial({
    color: GOLD_PRIMARY,
    metalness: 0.8,
    roughness: 0.3,
    side: THREE.DoubleSide,
    envMapIntensity: 1.5,
  });

  const petal = new THREE.Mesh(petalGeometry, material);
  
  // Scale based on layer
  petal.scale.set(config.scale, config.scale, config.scale);
  
  // Position in circular arrangement
  const angle = (index / totalInLayer) * Math.PI * 2;
  petal.rotation.z = angle;
  petal.rotation.x = config.openAngle;
  petal.position.y = config.heightOffset;

  // Store animation data
  petal.userData = {
    type: 'petal',
    layer,
    index,
    baseRotationZ: angle,
    closedAngle: Math.PI / 2.2,
    openAngle: config.openAngle,
  };

  return petal;
}

/**
 * Creates an alternative smooth petal using LatheGeometry for more organic shape
 */
function createLathePetal(
  layer: number,
  index: number,
  totalInLayer: number,
  config: { scale: number; openAngle: number; heightOffset: number }
): THREE.Mesh {
  // Create petal profile for LatheGeometry
  const points: THREE.Vector2[] = [];
  const segments = 24;
  
  // Smooth lotus/rose petal profile
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Smooth teardrop curve - creates elegant petal shape
    const x = Math.sin(t * Math.PI) * 0.3 * Math.sqrt(1 - Math.pow(t - 0.5, 2) * 2);
    const y = t * 0.9;
    points.push(new THREE.Vector2(x, y));
  }
  
  // Create LatheGeometry with partial rotation for petal
  const geometry = new THREE.LatheGeometry(points, 16, 0, Math.PI * 0.35);
  
  // Add natural curl/curvature
  const posAttr = geometry.getAttribute('position');
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    
    // Smooth inward curl at top
    const curlFactor = Math.pow(y / 0.9, 2) * 0.12;
    posAttr.setZ(i, z - curlFactor);
    
    // Subtle wave at edges for organic feel
    const wave = Math.sin(y * Math.PI * 2.5) * 0.015 * (1 - y / 0.9);
    posAttr.setX(i, posAttr.getX(i) + wave);
  }
  geometry.computeVertexNormals();
  
  // Premium gold material with gradients via vertex colors
  const material = new THREE.MeshStandardMaterial({
    color: GOLD_PRIMARY,
    metalness: 0.8,
    roughness: 0.3,
    side: THREE.DoubleSide,
    envMapIntensity: 1.2,
  });

  const petal = new THREE.Mesh(geometry, material);
  petal.scale.set(config.scale, config.scale, config.scale);
  
  const angle = (index / totalInLayer) * Math.PI * 2;
  petal.rotation.z = angle;
  petal.rotation.x = config.openAngle;
  petal.position.y = config.heightOffset;

  petal.userData = {
    type: 'petal',
    layer,
    index,
    baseRotationZ: angle,
    closedAngle: Math.PI / 2.3,
    openAngle: config.openAngle,
  };

  return petal;
}

/**
 * Creates smooth golden center sphere with decorative elements
 */
function createGoldenCenter(): THREE.Group {
  const centerGroup = new THREE.Group();
  
  // Main golden center sphere
  const sphereGeom = new THREE.SphereGeometry(0.14, 32, 32);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: GOLD_PRIMARY,
    metalness: 0.9,
    roughness: 0.2,
  });
  const sphere = new THREE.Mesh(sphereGeom, sphereMat);
  sphere.position.y = 0.06;
  centerGroup.add(sphere);
  
  // Inner lighter golden core
  const coreGeom = new THREE.SphereGeometry(0.06, 24, 24);
  const coreMat = new THREE.MeshStandardMaterial({
    color: GOLD_LIGHT,
    metalness: 0.95,
    roughness: 0.15,
    emissive: GOLD_LIGHT,
    emissiveIntensity: 0.1,
  });
  const core = new THREE.Mesh(coreGeom, coreMat);
  core.position.y = 0.12;
  centerGroup.add(core);
  
  // Decorative golden stamens around center
  const stamenMat = new THREE.MeshStandardMaterial({
    color: GOLD_LIGHT,
    metalness: 0.85,
    roughness: 0.25,
  });
  
  for (let i = 0; i < 10; i++) {
    const stamenGeom = new THREE.SphereGeometry(0.02, 12, 12);
    const stamen = new THREE.Mesh(stamenGeom, stamenMat);
    
    const angle = (i / 10) * Math.PI * 2;
    const radius = 0.1;
    stamen.position.x = Math.cos(angle) * radius;
    stamen.position.z = Math.sin(angle) * radius;
    stamen.position.y = 0.1;
    
    centerGroup.add(stamen);
  }
  
  return centerGroup;
}

/**
 * Creates smooth curved stem with natural curves
 */
function createSmoothStem(): THREE.Group {
  const stemGroup = new THREE.Group();
  
  // Natural curved path for stem
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.015, -0.6, 0.01),
    new THREE.Vector3(-0.01, -1.2, -0.008),
    new THREE.Vector3(0.008, -1.8, 0.005),
    new THREE.Vector3(-0.005, -2.4, -0.003),
    new THREE.Vector3(0, -3.0, 0),
  ]);
  
  // Smooth tube geometry for stem
  const stemGeom = new THREE.TubeGeometry(curve, 50, 0.035, 16, false);
  const stemMat = new THREE.MeshStandardMaterial({
    color: STEM_GREEN,
    metalness: 0.1,
    roughness: 0.6,
  });
  
  const stem = new THREE.Mesh(stemGeom, stemMat);
  stemGroup.add(stem);
  
  stemGroup.userData = { type: 'stem' };
  return stemGroup;
}

/**
 * Creates smooth organic leaf with natural curves
 */
function createSmoothLeaf(size: number = 1): THREE.Mesh {
  // Elegant leaf shape using bezier curves
  const leafShape = new THREE.Shape();
  
  // Smooth organic leaf outline
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(0.12, 0.08, 0.2, 0.25, 0.18, 0.45);
  leafShape.bezierCurveTo(0.15, 0.58, 0.08, 0.7, 0, 0.75);
  leafShape.bezierCurveTo(-0.08, 0.7, -0.15, 0.58, -0.18, 0.45);
  leafShape.bezierCurveTo(-0.2, 0.25, -0.12, 0.08, 0, 0);
  
  const extrudeSettings = {
    steps: 2,
    depth: 0.015,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.015,
    bevelSegments: 4,
  };
  
  const leafGeom = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
  
  // Add natural curvature to leaf
  const posAttr = leafGeom.getAttribute('position');
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    const x = posAttr.getX(i);
    
    // Gentle curve along length
    const curve = Math.sin(y / 0.75 * Math.PI) * 0.08;
    posAttr.setZ(i, z + curve);
    
    // Slight fold along center
    const fold = Math.abs(x) * 0.15;
    posAttr.setZ(i, posAttr.getZ(i) - fold);
  }
  leafGeom.computeVertexNormals();
  
  const leafMat = new THREE.MeshStandardMaterial({
    color: LEAF_GREEN,
    metalness: 0.1,
    roughness: 0.55,
    side: THREE.DoubleSide,
  });
  
  const leaf = new THREE.Mesh(leafGeom, leafMat);
  leaf.scale.setScalar(size);
  leaf.userData = { type: 'leaf' };
  
  return leaf;
}

/**
 * Creates subtle floating golden particles
 */
function createGoldenParticles(): THREE.Points {
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = 1.2 + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 1.5;
    positions[i3 + 2] = radius * Math.cos(phi);
    
    sizes[i] = 0.015 + Math.random() * 0.02;
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const material = new THREE.PointsMaterial({
    size: 0.025,
    color: GOLD_PRIMARY,
    transparent: true,
    opacity: 0.5,
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
    camera.position.set(0, -0.5, 5.5);
    camera.lookAt(0, -1.2, 0);
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
    // CREATE ELEGANT GOLDEN FLOWER
    // ============================================
    
    const flowerGroup = new THREE.Group();
    flowerGroupRef.current = flowerGroup;

    // Flower head group
    const flowerHead = new THREE.Group();
    flowerHead.position.y = 0;

    // Petal layer configurations - elegant lotus/rose inspired
    const petalLayers = [
      { count: 5, scale: 0.45, openAngle: Math.PI / 2.1, heightOffset: 0.1, curvature: 0.15 },
      { count: 6, scale: 0.6, openAngle: Math.PI / 2.4, heightOffset: 0.06, curvature: 0.12 },
      { count: 8, scale: 0.8, openAngle: Math.PI / 2.7, heightOffset: 0.02, curvature: 0.1 },
      { count: 10, scale: 1.0, openAngle: Math.PI / 3.0, heightOffset: -0.02, curvature: 0.08 },
      { count: 12, scale: 1.2, openAngle: Math.PI / 3.5, heightOffset: -0.06, curvature: 0.06 },
    ];

    // Create smooth petals by layers - alternating geometry types
    petalLayers.forEach((config, layerIndex) => {
      for (let i = 0; i < config.count; i++) {
        const angleOffset = (layerIndex * Math.PI) / config.count;
        
        // Use LatheGeometry for inner layers, custom for outer (variation)
        const petal = layerIndex < 2 
          ? createLathePetal(layerIndex, i, config.count, config)
          : createSmoothPetal(layerIndex, i, config.count, config);
        
        petal.rotation.z += angleOffset;
        petal.userData.baseRotationZ += angleOffset;
        flowerHead.add(petal);
      }
    });

    // Golden center
    const center = createGoldenCenter();
    flowerHead.add(center);

    flowerGroup.add(flowerHead);

    // Smooth stem
    const stem = createSmoothStem();
    flowerGroup.add(stem);

    // Elegant leaves positioned along stem
    const leafPositions = [
      { y: -0.9, angle: Math.PI / 5, scale: 0.55 },
      { y: -1.6, angle: -Math.PI / 3.5, scale: 0.7 },
      { y: -2.3, angle: Math.PI / 2.5, scale: 0.6 },
    ];

    leafPositions.forEach(({ y, angle, scale }) => {
      const leaf = createSmoothLeaf(scale);
      leaf.position.y = y;
      leaf.position.x = Math.cos(angle) * 0.12;
      leaf.position.z = Math.sin(angle) * 0.12;
      leaf.rotation.y = angle;
      leaf.rotation.x = -Math.PI / 5;
      leaf.rotation.z = Math.PI / 10;
      flowerGroup.add(leaf);
    });

    // Position flower lower on screen as requested
    flowerGroup.position.y = -0.3;
    scene.add(flowerGroup);

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
      // SUBTLE ROTATION ANIMATION (slow spin)
      // ============================================
      // Slow continuous Y rotation + scroll-based rotation
      flowerGroupRef.current.rotation.y = time * 0.12 + progress * Math.PI * 2.5;
      
      // Gentle tilt for elegance
      flowerGroupRef.current.rotation.x = Math.sin(progress * Math.PI) * 0.12;
      flowerGroupRef.current.rotation.z = Math.cos(progress * Math.PI * 0.5) * 0.04;

      // ============================================
      // SCALE ANIMATION
      // ============================================
      const scaleProgress = Math.sin(progress * Math.PI);
      const scale = 0.9 + scaleProgress * 0.25;
      flowerGroupRef.current.scale.setScalar(scale);

      // ============================================
      // PETAL OPENING ANIMATION
      // ============================================
      flowerGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.type === 'petal') {
          const { layer, closedAngle, openAngle } = child.userData;
          
          // Progressive opening: outer layers open first
          const layerDelay = (4 - layer) * 0.1;
          const petalProgress = Math.max(0, Math.min(1, (progress - layerDelay) * 1.6));
          
          // Smooth interpolation
          const targetAngle = closedAngle - (closedAngle - openAngle) * petalProgress;
          child.rotation.x = THREE.MathUtils.lerp(child.rotation.x, targetAngle, 0.08);
          
          // Subtle organic movement
          const wobble = Math.sin(time * 1.5 + layer + child.userData.index * 0.4) * 0.012;
          child.rotation.z = child.userData.baseRotationZ + wobble;
        }
        
        // Leaf subtle movement
        if (child.userData.type === 'leaf') {
          child.rotation.z = Math.PI / 10 + Math.sin(time * 0.6) * 0.025;
        }
      });
    }

    // ============================================
    // PARTICLES ANIMATION
    // ============================================
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.04;
      particlesRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      const pMat = particlesRef.current.material as THREE.PointsMaterial;
      pMat.opacity = 0.25 + progress * 0.45;
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
