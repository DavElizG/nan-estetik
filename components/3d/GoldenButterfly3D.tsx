/**
 * GoldenButterfly3D Component - Elegant Stylized Butterfly
 * 
 * Premium 3D butterfly with:
 * - Symmetrical wings with golden to rose gold gradient
 * - Art deco inspired minimalist geometry
 * - Gentle wing flapping animation
 * - Metallic gold body with antennae
 * - Luxury jewelry aesthetic
 * - Scroll-driven transformations
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GoldenButterfly3DProps {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

// ============================================
// COLORS
// ============================================
const GOLD_PRIMARY = 0xD4AF37;
const ROSE_GOLD = 0xB76E79;
const GOLD_LIGHT = 0xF5E6A3;
const GOLD_DARK = 0xAA8C2C;

// ============================================
// WING GEOMETRY - Art Deco Style
// ============================================

/**
 * Creates an elegant upper wing shape
 */
function createUpperWing(isRight: boolean): THREE.Mesh {
  const shape = new THREE.Shape();
  
  // Art deco inspired wing shape - elegant curves
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.1, 0.3, 0.4, 0.6, 0.7, 0.8);
  shape.bezierCurveTo(0.9, 0.9, 1.1, 0.85, 1.2, 0.7);
  shape.bezierCurveTo(1.35, 0.5, 1.4, 0.25, 1.3, 0);
  shape.bezierCurveTo(1.2, -0.15, 0.8, -0.1, 0.5, -0.05);
  shape.bezierCurveTo(0.25, 0, 0.1, -0.02, 0, 0);
  
  const geometry = new THREE.ShapeGeometry(shape, 32);
  
  // Add subtle curvature to make it more 3D
  const posAttr = geometry.getAttribute('position');
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    
    // Gentle dome curve
    const distFromCenter = Math.sqrt(x * x + y * y);
    const z = Math.sin(distFromCenter * 0.8) * 0.08;
    posAttr.setZ(i, z);
  }
  geometry.computeVertexNormals();
  
  // Create gradient material using vertex colors
  const colors = new Float32Array(posAttr.count * 3);
  const goldColor = new THREE.Color(GOLD_PRIMARY);
  const roseColor = new THREE.Color(ROSE_GOLD);
  
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const t = Math.min(1, x / 1.3); // Gradient along wing
    const color = goldColor.clone().lerp(roseColor, t);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.7,
    roughness: 0.35,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });

  const wing = new THREE.Mesh(geometry, material);
  
  if (!isRight) {
    wing.scale.x = -1;
  }
  
  wing.userData = { type: 'upperWing', isRight };
  return wing;
}

/**
 * Creates an elegant lower wing shape
 */
function createLowerWing(isRight: boolean): THREE.Mesh {
  const shape = new THREE.Shape();
  
  // Smaller, more rounded lower wing
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.15, -0.1, 0.4, -0.3, 0.6, -0.45);
  shape.bezierCurveTo(0.75, -0.55, 0.85, -0.5, 0.9, -0.4);
  shape.bezierCurveTo(0.95, -0.25, 0.85, -0.1, 0.7, 0);
  shape.bezierCurveTo(0.5, 0.05, 0.25, 0.02, 0, 0);
  
  const geometry = new THREE.ShapeGeometry(shape, 24);
  
  // Add curvature
  const posAttr = geometry.getAttribute('position');
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const distFromCenter = Math.sqrt(x * x + y * y);
    const z = Math.sin(distFromCenter * 0.9) * 0.06;
    posAttr.setZ(i, z);
  }
  geometry.computeVertexNormals();
  
  // Gradient colors
  const colors = new Float32Array(posAttr.count * 3);
  const goldColor = new THREE.Color(GOLD_PRIMARY);
  const roseColor = new THREE.Color(ROSE_GOLD);
  
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const t = Math.min(1, x / 0.9);
    const color = goldColor.clone().lerp(roseColor, t * 0.8);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.7,
    roughness: 0.35,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });

  const wing = new THREE.Mesh(geometry, material);
  
  if (!isRight) {
    wing.scale.x = -1;
  }
  
  wing.userData = { type: 'lowerWing', isRight };
  return wing;
}

/**
 * Creates wing outline/border for elegance
 */
function createWingOutline(isUpper: boolean, isRight: boolean): THREE.Line {
  const points: THREE.Vector3[] = [];
  
  if (isUpper) {
    // Upper wing outline
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 0.01),
      new THREE.Vector3(0.4, 0.6, 0.01),
      new THREE.Vector3(1.1, 0.85, 0.01),
      new THREE.Vector3(1.2, 0.7, 0.01)
    );
    points.push(...curve.getPoints(20));
    
    const curve2 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(1.2, 0.7, 0.01),
      new THREE.Vector3(1.4, 0.25, 0.01),
      new THREE.Vector3(1.2, -0.15, 0.01),
      new THREE.Vector3(0, 0, 0.01)
    );
    points.push(...curve2.getPoints(20));
  } else {
    // Lower wing outline
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 0.01),
      new THREE.Vector3(0.4, -0.3, 0.01),
      new THREE.Vector3(0.85, -0.55, 0.01),
      new THREE.Vector3(0.9, -0.4, 0.01)
    );
    points.push(...curve.getPoints(15));
    
    const curve2 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.9, -0.4, 0.01),
      new THREE.Vector3(0.85, -0.1, 0.01),
      new THREE.Vector3(0.25, 0.02, 0.01),
      new THREE.Vector3(0, 0, 0.01)
    );
    points.push(...curve2.getPoints(15));
  }
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: GOLD_LIGHT,
    transparent: true,
    opacity: 0.6,
  });
  
  const line = new THREE.Line(geometry, material);
  
  if (!isRight) {
    line.scale.x = -1;
  }
  
  return line;
}

/**
 * Creates the butterfly body
 */
function createBody(): THREE.Group {
  const bodyGroup = new THREE.Group();
  
  // Main body - elongated ellipsoid
  const bodyGeom = new THREE.SphereGeometry(0.08, 24, 16);
  bodyGeom.scale(1, 2.5, 0.8);
  
  const bodyMat = new THREE.MeshStandardMaterial({
    color: GOLD_PRIMARY,
    metalness: 0.85,
    roughness: 0.25,
  });
  
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = 0;
  bodyGroup.add(body);
  
  // Head - small sphere
  const headGeom = new THREE.SphereGeometry(0.05, 20, 16);
  const headMat = new THREE.MeshStandardMaterial({
    color: GOLD_PRIMARY,
    metalness: 0.85,
    roughness: 0.25,
  });
  
  const head = new THREE.Mesh(headGeom, headMat);
  head.position.y = 0.25;
  bodyGroup.add(head);
  
  // Antennae
  const antennaMat = new THREE.MeshStandardMaterial({
    color: GOLD_DARK,
    metalness: 0.7,
    roughness: 0.4,
  });
  
  // Create curved antennae
  for (let side = -1; side <= 1; side += 2) {
    const antennaCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.02, 0.28, 0),
      new THREE.Vector3(side * 0.08, 0.35, 0.02),
      new THREE.Vector3(side * 0.15, 0.45, 0),
      new THREE.Vector3(side * 0.18, 0.5, -0.02)
    );
    
    const antennaGeom = new THREE.TubeGeometry(antennaCurve, 12, 0.008, 6, false);
    const antenna = new THREE.Mesh(antennaGeom, antennaMat);
    bodyGroup.add(antenna);
    
    // Antenna tip
    const tipGeom = new THREE.SphereGeometry(0.015, 8, 8);
    const tip = new THREE.Mesh(tipGeom, antennaMat);
    tip.position.set(side * 0.18, 0.5, -0.02);
    bodyGroup.add(tip);
  }
  
  // Body segments (subtle lines)
  const segmentMat = new THREE.MeshStandardMaterial({
    color: GOLD_DARK,
    metalness: 0.6,
    roughness: 0.5,
  });
  
  for (let i = 0; i < 4; i++) {
    const segmentGeom = new THREE.TorusGeometry(0.06, 0.005, 6, 16, Math.PI);
    const segment = new THREE.Mesh(segmentGeom, segmentMat);
    segment.position.y = -0.08 + i * 0.05;
    segment.rotation.x = Math.PI / 2;
    segment.rotation.z = Math.PI;
    bodyGroup.add(segment);
  }
  
  return bodyGroup;
}

/**
 * Creates decorative wing patterns (art deco style)
 */
function createWingPattern(isUpper: boolean, isRight: boolean): THREE.Group {
  const patternGroup = new THREE.Group();
  
  const lineMat = new THREE.LineBasicMaterial({
    color: GOLD_LIGHT,
    transparent: true,
    opacity: 0.4,
  });
  
  if (isUpper) {
    // Art deco lines on upper wing
    for (let i = 1; i <= 3; i++) {
      const points = [
        new THREE.Vector3(0.1, 0.1 * i, 0.02),
        new THREE.Vector3(0.3 + i * 0.2, 0.15 + i * 0.15, 0.02),
      ];
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geom, lineMat);
      patternGroup.add(line);
    }
    
    // Decorative dot
    const dotGeom = new THREE.CircleGeometry(0.04, 16);
    const dotMat = new THREE.MeshStandardMaterial({
      color: ROSE_GOLD,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.7,
    });
    const dot = new THREE.Mesh(dotGeom, dotMat);
    dot.position.set(0.7, 0.4, 0.02);
    patternGroup.add(dot);
  } else {
    // Art deco pattern on lower wing
    const dotGeom = new THREE.CircleGeometry(0.03, 12);
    const dotMat = new THREE.MeshStandardMaterial({
      color: ROSE_GOLD,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.6,
    });
    const dot = new THREE.Mesh(dotGeom, dotMat);
    dot.position.set(0.45, -0.25, 0.02);
    patternGroup.add(dot);
  }
  
  if (!isRight) {
    patternGroup.scale.x = -1;
  }
  
  return patternGroup;
}

/**
 * Creates subtle golden particles
 */
function createGoldenParticles(): THREE.Points {
  const particleCount = 40;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = 1.5 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 0.5;
    positions[i3 + 2] = radius * Math.cos(phi);
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: GOLD_PRIMARY,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  });
  
  return new THREE.Points(geometry, material);
}

// ============================================
// MAIN COMPONENT
// ============================================

export function GoldenButterfly3D({ scrollContainerRef, className = '' }: GoldenButterfly3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const butterflyGroupRef = useRef<THREE.Group | null>(null);
  const wingsRef = useRef<{ right: THREE.Group; left: THREE.Group } | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number>(0);
  const scrollProgressRef = useRef({ value: 0 });
  const timeRef = useRef(0);

  const initScene = useCallback(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4);
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
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // ============================================
    // WARM LIGHTING FOR METALLIC GOLD
    // ============================================
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Main warm spotlight
    const spotLight = new THREE.SpotLight(0xfff8e7, 2);
    spotLight.position.set(3, 4, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    // Secondary warm light
    const warmLight = new THREE.DirectionalLight(0xffe4b5, 1);
    warmLight.position.set(-2, 3, 2);
    scene.add(warmLight);

    // Rim light for golden glow
    const rimLight = new THREE.PointLight(0xd4af37, 1.5, 10);
    rimLight.position.set(0, 1, -3);
    scene.add(rimLight);

    // Rose gold accent light
    const accentLight = new THREE.PointLight(0xb76e79, 0.8, 8);
    accentLight.position.set(2, -1, 2);
    scene.add(accentLight);

    // ============================================
    // CREATE BUTTERFLY
    // ============================================
    
    const butterflyGroup = new THREE.Group();
    butterflyGroupRef.current = butterflyGroup;

    // Create wing groups for animation
    const rightWingGroup = new THREE.Group();
    const leftWingGroup = new THREE.Group();
    
    // Right wings
    const rightUpperWing = createUpperWing(true);
    const rightLowerWing = createLowerWing(true);
    const rightUpperOutline = createWingOutline(true, true);
    const rightLowerOutline = createWingOutline(false, true);
    const rightUpperPattern = createWingPattern(true, true);
    const rightLowerPattern = createWingPattern(false, true);
    
    rightWingGroup.add(rightUpperWing);
    rightWingGroup.add(rightLowerWing);
    rightWingGroup.add(rightUpperOutline);
    rightWingGroup.add(rightLowerOutline);
    rightWingGroup.add(rightUpperPattern);
    rightWingGroup.add(rightLowerPattern);
    
    // Left wings
    const leftUpperWing = createUpperWing(false);
    const leftLowerWing = createLowerWing(false);
    const leftUpperOutline = createWingOutline(true, false);
    const leftLowerOutline = createWingOutline(false, false);
    const leftUpperPattern = createWingPattern(true, false);
    const leftLowerPattern = createWingPattern(false, false);
    
    leftWingGroup.add(leftUpperWing);
    leftWingGroup.add(leftLowerWing);
    leftWingGroup.add(leftUpperOutline);
    leftWingGroup.add(leftLowerOutline);
    leftWingGroup.add(leftUpperPattern);
    leftWingGroup.add(leftLowerPattern);
    
    // Store wing refs for animation
    wingsRef.current = { right: rightWingGroup, left: leftWingGroup };
    
    butterflyGroup.add(rightWingGroup);
    butterflyGroup.add(leftWingGroup);
    
    // Body
    const body = createBody();
    butterflyGroup.add(body);

    // Position butterfly slightly lower and centered
    butterflyGroup.position.y = -0.3;
    butterflyGroup.rotation.x = 0.1; // Slight tilt for elegance
    scene.add(butterflyGroup);

    // Particles
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

    if (butterflyGroupRef.current && wingsRef.current) {
      // ============================================
      // GENTLE WING FLAPPING
      // ============================================
      const flapSpeed = 2.5;
      const flapAmount = 0.25 + progress * 0.15; // Flap more as scroll progresses
      const flapAngle = Math.sin(time * flapSpeed) * flapAmount;
      
      // Right wing flaps up
      wingsRef.current.right.rotation.y = flapAngle;
      // Left wing flaps up (mirrored)
      wingsRef.current.left.rotation.y = -flapAngle;
      
      // ============================================
      // SLOW ROTATION
      // ============================================
      butterflyGroupRef.current.rotation.y = time * 0.1 + progress * Math.PI * 2;
      
      // Gentle bobbing motion
      butterflyGroupRef.current.position.y = -0.3 + Math.sin(time * 0.8) * 0.05;
      
      // Slight tilt based on scroll
      butterflyGroupRef.current.rotation.x = 0.1 + Math.sin(progress * Math.PI) * 0.15;
      butterflyGroupRef.current.rotation.z = Math.cos(time * 0.5) * 0.03;

      // ============================================
      // SCALE ANIMATION
      // ============================================
      const scaleProgress = Math.sin(progress * Math.PI);
      const scale = 0.9 + scaleProgress * 0.2;
      butterflyGroupRef.current.scale.setScalar(scale);
    }

    // ============================================
    // PARTICLES
    // ============================================
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.03;
      const pMat = particlesRef.current.material as THREE.PointsMaterial;
      pMat.opacity = 0.2 + progress * 0.4;
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

// Export alias for compatibility
export { GoldenButterfly3D as Rose3D };
