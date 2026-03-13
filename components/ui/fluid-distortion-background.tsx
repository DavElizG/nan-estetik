"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";

export function FluidDistortionBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // On mobile, render a simple gradient instead of the heavy Three.js canvas
  if (isMobile) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          background: "radial-gradient(ellipse at 30% 50%, #0f0a1a 0%, #070410 70%)",
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        filter: "sepia(1) hue-rotate(10deg) saturate(4) brightness(1.2)",
      }}
    >
      <Canvas
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        gl={{ antialias: false, alpha: false }}
      >
        <EffectComposer>
          <Fluid
            intensity={3}
            force={2}
            distortion={0.5}
            curl={3}
            swirl={5}
            velocityDissipation={0.99}
            densityDissipation={0.95}
            pressure={0.8}
            radius={0.3}
            showBackground
            backgroundColor="#070410"
            blend={5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
