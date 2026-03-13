/**
 * GoldenFlower3D Component - Golden Lotus Flower (Flor de Loto)
 * 
 * Clean approach: each petal is a 2D Shape extruded thin,
 * then curved via vertex bending. Produces smooth, wide,
 * rounded petals like a real lotus.
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GoldenFlower3DProps {
  readonly scrollContainerRef: React.RefObject<HTMLElement | null>;
  readonly className?: string;
}

// ============================================
// COLORS
// ============================================
const GOLD_PRIMARY = 0xD4AF37;
const GOLD_LIGHT = 0xF5E6A3;
const GOLD_WARM = 0xEDCE6E;
const GOLD_DEEP = 0xC5982A;
const GOLD_DARK = 0xB8860B;

// ============================================
// PETAL GEOMETRY – Shape extrude + vertex bend
// ============================================

/**
 * Creates a single lotus petal mesh.
 * The petal starts as a flat "teardrop" shape extruded thin,
 * then each vertex is bent upward and optionally outward
 * to create the characteristic lotus cup shape.
 *
 * @param width      Max width of petal
 * @param height     Length from base to tip
 * @param thickness  Extrude depth (thin)
 * @param leanAngle  How far the petal leans outward from vertical (radians)
 * @param curvature  How much the petal curves inward (bowl shape) 0-1
 * @param tipCurl    How much the tip curls back outward 0-1
 */
function createPetalMesh(
  width: number,
  height: number,
  thickness: number,
  leanAngle: number,
  curvature: number,
  tipCurl: number,
  material: THREE.Material
): THREE.Mesh {
  // 2D teardrop shape (flat on XY plane, Y = up)
  const shape = new THREE.Shape();
  const hw = width / 2;
  
  // Start at base center
  shape.moveTo(0, 0);
  // Left side curve – wide belly then taper to rounded tip
  shape.bezierCurveTo(
    -hw * 0.6, height * 0.15,   // CP1: start widening
    -hw,       height * 0.45,   // CP2: max width around 45%
    -hw * 0.7, height * 0.7     // End: start tapering
  );
  // Tip – rounded
  shape.bezierCurveTo(
    -hw * 0.35, height * 0.9,   // CP1: narrow toward tip
    0,          height * 1.02,  // CP2: slight overshoot for roundness
    0,          height           // Tip point
  );
  // Right side (mirror)
  shape.bezierCurveTo(
    0,          height * 1.02,
    hw * 0.35,  height * 0.9,
    hw * 0.7,   height * 0.7
  );
  shape.bezierCurveTo(
    hw,         height * 0.45,
    hw * 0.6,   height * 0.15,
    0,          0
  );

  // Extrude thin
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.3,
    bevelSize: thickness * 0.3,
    bevelSegments: 2,
    curveSegments: 12,
  });

  // Center the extrusion on Z
  geom.translate(0, 0, -thickness / 2);

  // ---- Bend vertices to create 3D petal shape ----
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    
    // Normalize y position (0 at base, 1 at tip)
    const t = Math.max(0, Math.min(1, y / height));

    // 1. Lean the petal outward: rotate around X axis based on height
    //    Bottom stays fixed, tip leans out by leanAngle
    const lean = t * leanAngle;
    const newY = y * Math.cos(lean) - z * Math.sin(lean);
    const newZ = y * Math.sin(lean) + z * Math.cos(lean);

    // 2. Bowl/concavity: push inner face (negative Z) inward
    //    proportional to cross-position and height
    const crossT = Math.abs(x) / (hw + 0.001);
    const bowlAmount = curvature * (1 - crossT) * Math.sin(t * Math.PI) * width * 0.3;

    // 3. Tip curl: bend the upper 30% back outward
    let tipBend = 0;
    if (t > 0.7) {
      const tipT = (t - 0.7) / 0.3;
      tipBend = tipCurl * tipT * tipT * height * 0.15;
    }

    pos.setXYZ(i, x, newY + bowlAmount * 0.2, newZ - bowlAmount + tipBend);
  }

  geom.computeVertexNormals();

  const mesh = new THREE.Mesh(geom, material);
  return mesh;
}

// ============================================
// LOTUS FLOWER ASSEMBLY
// ============================================

function createLotusFlower(): THREE.Group {
  const lotus = new THREE.Group();

  // ---- Materials ----
  const centerMat = new THREE.MeshStandardMaterial({
    color: GOLD_LIGHT,
    metalness: 0.95,
    roughness: 0.08,
    emissive: GOLD_LIGHT,
    emissiveIntensity: 0.25,
  });

  const innerMat = new THREE.MeshStandardMaterial({
    color: GOLD_WARM,
    metalness: 0.9,
    roughness: 0.12,
    side: THREE.DoubleSide,
  });

  const midMat = new THREE.MeshStandardMaterial({
    color: GOLD_PRIMARY,
    metalness: 0.92,
    roughness: 0.1,
    side: THREE.DoubleSide,
  });

  const outerMat = new THREE.MeshStandardMaterial({
    color: GOLD_DEEP,
    metalness: 0.9,
    roughness: 0.15,
    side: THREE.DoubleSide,
  });

  const baseMat = new THREE.MeshStandardMaterial({
    color: GOLD_DARK,
    metalness: 0.88,
    roughness: 0.18,
    side: THREE.DoubleSide,
  });

  // ---- CENTER (seed pod) – raised higher ----
  const podGeom = new THREE.SphereGeometry(0.08, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const pod = new THREE.Mesh(podGeom, centerMat);
  pod.position.y = 0.12;
  lotus.add(pod);

  // Small bumps on pod
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const bump = new THREE.Mesh(new THREE.SphereGeometry(0.012, 5, 5), centerMat);
    bump.position.set(Math.cos(a) * 0.04, 0.18, Math.sin(a) * 0.04);
    lotus.add(bump);
  }

  // ---- STAMENS – raised higher ----
  const stamenMat = new THREE.MeshStandardMaterial({
    color: GOLD_LIGHT, metalness: 0.85, roughness: 0.1,
    emissive: GOLD_PRIMARY, emissiveIntensity: 0.15,
  });
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const g = new THREE.Group();
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.002, 0.14, 4), stamenMat);
    rod.position.y = 0.07;
    g.add(rod);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.008, 4, 4), centerMat);
    tip.position.y = 0.14;
    g.add(tip);
    g.position.set(Math.cos(a) * 0.07, 0.13, Math.sin(a) * 0.07);
    // Tilt outward
    g.rotation.z = -Math.cos(a) * 0.3;
    g.rotation.x = Math.sin(a) * 0.3;
    lotus.add(g);
  }

  // ---- PETAL LAYERS ----
  // Config: [count, width, height, lean, curvature, tipCurl, material, yOffset, angleOffset]
  const layers: [number, number, number, number, number, number, THREE.Material, number, number][] = [
    // Inner: 5 petals, narrow, almost vertical, strong bowl
    [5,  0.1, 0.28, 0.25, 0.8, 0.1, innerMat, 0.01, 0],
    // Mid-inner: 7 petals, a bit wider and more open
    [7,  0.14, 0.34, 0.45, 0.6, 0.2, innerMat, 0, Math.PI / 7],
    // Middle: 8 petals, the main visible layer
    [8,  0.18, 0.4, 0.7, 0.5, 0.35, midMat, -0.01, Math.PI / 8],
    // Outer: 10 petals, wide open with tip curl
    [10, 0.22, 0.46, 1, 0.35, 0.5, outerMat, -0.03, Math.PI / 10],
    // Base: 7 wide petals, nearly horizontal
    [7,  0.25, 0.5, 1.25, 0.2, 0.6, baseMat, -0.05, Math.PI / 14],
  ];

  layers.forEach((cfg, layerIdx) => {
    const [count, w, h, lean, curv, curl, mat, yOff, aOff] = cfg;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + aOff;
      const petal = createPetalMesh(w, h, 0.006, lean, curv, curl, mat);
      petal.rotation.y = angle;
      petal.position.y = yOff;
      petal.userData = { type: 'petal', layer: layerIdx, index: i };
      lotus.add(petal);
    }
  });

  lotus.userData = { type: 'lotus' };
  return lotus;
}

// ============================================
// GOLDEN PARTICLES
// ============================================

function createGoldenParticles(): THREE.Points {
  const count = 160;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = 1.8 + Math.random() * 4.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 0.3;
    positions[i3 + 2] = radius * Math.cos(phi);

    sizes[i] = 0.015 + Math.random() * 0.035;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.045,
    color: GOLD_PRIMARY,
    transparent: true,
    opacity: 0.65,
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

    // Camera – elevated view looking down at the lotus
    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.2, 4.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xfff8e7, 2.5);
    spotLight.position.set(4, 6, 5);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.6;
    spotLight.decay = 1.2;
    spotLight.distance = 25;
    scene.add(spotLight);

    const warmLight = new THREE.DirectionalLight(0xffe4b5, 1.2);
    warmLight.position.set(-3, 4, 3);
    scene.add(warmLight);

    const rimLight = new THREE.PointLight(0xd4af37, 2, 12);
    rimLight.position.set(0, 2, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xfff5dc, 0.6, 10);
    fillLight.position.set(0, -5, 3);
    scene.add(fillLight);

    const accentLight = new THREE.PointLight(0xffecd2, 0.8, 8);
    accentLight.position.set(-4, 0, 2);
    scene.add(accentLight);

    // ============================================
    // CREATE GOLDEN LOTUS FLOWER
    // ============================================
    const lotus = createLotusFlower();
    flowerGroupRef.current = lotus;
    lotus.position.y = -0.3;
    lotus.scale.setScalar(2.5);
    scene.add(lotus);

    // Golden particles
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
      // ROTATION – slow auto-rotation + scroll-driven
      // ============================================
      flowerGroupRef.current.rotation.y = time * 0.04 + progress * Math.PI * 1.5;

      // Keep lotus upright with gentle sway
      flowerGroupRef.current.rotation.x = Math.sin(progress * Math.PI) * 0.06;
      flowerGroupRef.current.rotation.z = Math.cos(progress * Math.PI * 0.5) * 0.03;

      // ============================================
      // SCALE – gentle pulse with scroll
      // ============================================
      const scalePulse = Math.sin(progress * Math.PI) * 0.3;
      flowerGroupRef.current.scale.setScalar(2.5 + scalePulse);

      // ============================================
      // PETAL BREATHING – organic sway per layer
      // ============================================
      flowerGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.type === 'petal') {
          const { layer, index } = child.userData;

          const speed = 0.25 + layer * 0.08;
          const phase = index * 0.5 + layer * 1.5;
          const amplitude = 0.015 + layer * 0.008;

          // Gentle open/close breathing on local X axis
          child.rotation.x = Math.sin(time * speed + phase) * amplitude;
          // Subtle lateral sway
          child.rotation.z = Math.cos(time * speed * 0.7 + phase) * amplitude * 0.4;
        }
      });
    }

    // ============================================
    // PARTICLES – slow drift + scroll
    // ============================================
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02 + progress * Math.PI * 0.5;
      particlesRef.current.rotation.x =
        Math.sin(time * 0.15) * 0.08 + Math.sin(progress * Math.PI) * 0.15;

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

      const currentScrollContainer = scrollContainerRef.current;
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === currentScrollContainer) {
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
