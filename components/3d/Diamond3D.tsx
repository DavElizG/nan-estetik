/**
 * Diamond3D Component - Realistic Diamond with Waypoint Animation
 * 
 * Diamante 3D realista con:
 * - MeshRefractionMaterial para refracción real
 * - Sistema de waypoints con GSAP Flip + ScrollTrigger
 * - El diamante se mueve entre marcadores mientras se hace scroll
 * - Sin rotación automática, solo controlado por scroll
 */

'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  CubeCamera,
  Environment,
  MeshRefractionMaterial,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { RGBELoader } from 'three-stdlib';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Diamond3DProps {
  className?: string;
}

// ============================================
// DIAMOND GEOMETRY - Classic Brilliant Cut
// ============================================

function createClassicDiamond(): THREE.BufferGeometry {
  // Use octahedron as base, modify for diamond proportions
  const geometry = new THREE.OctahedronGeometry(1, 2);
  
  const positions = geometry.getAttribute('position');
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    const x = positions.getX(i);
    const z = positions.getZ(i);
    
    if (y > 0) {
      // Crown - flatter top (table)
      positions.setY(i, y * 0.35);
      positions.setX(i, x * 1.15);
      positions.setZ(i, z * 1.15);
    } else {
      // Pavilion - pointed bottom
      positions.setY(i, y * 1.3);
      positions.setX(i, x * 0.95);
      positions.setZ(i, z * 0.95);
    }
  }
  
  geometry.computeVertexNormals();
  return geometry;
}

// ============================================
// SCROLL ROTATION STATE (shared between components)
// ============================================

interface RotationState {
  rotationY: number;
  rotationX: number;
  scale: number;
}

const rotationState: RotationState = {
  rotationY: 0,
  rotationX: 0.7,
  scale: 1.2,
};

// ============================================
// DIAMOND MESH COMPONENT
// ============================================

function DiamondMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  // Load HDR environment texture
  useEffect(() => {
    const loader = new RGBELoader();
    loader.load(
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr',
      (hdrTexture) => {
        hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
        setTexture(hdrTexture);
      }
    );
  }, []);
  
  // Create diamond geometry once
  const geometry = useRef(createClassicDiamond()).current;
  
  // Animation - only scroll-driven, no auto rotation
  useFrame(() => {
    if (meshRef.current) {
      // Smooth interpolation to target rotation
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        rotationState.rotationY,
        0.08
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        rotationState.rotationX,
        0.08
      );
      
      // Scale
      const currentScale = meshRef.current.scale.x;
      const targetScale = rotationState.scale;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08);
      meshRef.current.scale.setScalar(newScale);
    }
  });
  
  if (!texture) {
    return (
      <mesh geometry={geometry} rotation={[0.7, 0, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    );
  }
  
  return (
    <CubeCamera resolution={256} frames={1} envMap={texture}>
      {(envMap) => (
        <mesh
          ref={meshRef}
          geometry={geometry}
          rotation={[0.7, 0, 0]}
          castShadow
        >
          <MeshRefractionMaterial
            envMap={envMap}
            bounces={4}
            aberrationStrength={0.01}
            ior={2.417}
            fresnel={1}
            color="white"
            toneMapped={false}
          />
        </mesh>
      )}
    </CubeCamera>
  );
}

// ============================================
// SCENE COMPONENT
// ============================================

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <spotLight
        position={[5, 5, -10]}
        angle={0.15}
        penumbra={1}
        intensity={2.5}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#ffd700" />
      <directionalLight position={[0, 10, 5]} intensity={1} />
      
      {/* Diamond */}
      <DiamondMesh />
      
      {/* Environment for reflections */}
      <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr"
        background={false}
      />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.8}
          intensity={0.6}
          levels={9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ============================================
// LOADING FALLBACK
// ============================================

function LoadingFallback() {
  return (
    <mesh rotation={[0.7, 0, 0]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  );
}

// ============================================
// MAIN COMPONENT WITH WAYPOINT SYSTEM
// ============================================

export function Diamond3D({ className = '' }: Diamond3DProps) {
  useEffect(() => {
    // Setup scroll-driven rotation
    const st = ScrollTrigger.create({
      trigger: '#nosotros',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        rotationState.rotationY = self.progress * Math.PI * 4;
        rotationState.rotationX = 0.5 + Math.sin(self.progress * Math.PI * 2) * 0.3;
        rotationState.scale = 1.4 + Math.sin(self.progress * Math.PI) * 0.2;
      },
    });
    
    return () => {
      st.kill();
    };
  }, []);
  
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
        }}
        style={{ 
          background: 'transparent',
          pointerEvents: 'none'
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Remove the DiamondMarker component (no longer needed)
