"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

function MonolithMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y += 0.002;

    if (!prefersReducedMotion) {
      const { x, y } = state.pointer;
      targetRotation.current.x = y * 0.25;
      targetRotation.current.y = x * 0.35;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotation.current.x,
        0.05
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -targetRotation.current.y * 0.15,
        0.05
      );
    }

    meshRef.current.position.y = Math.sin(t * 0.5) * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={meshRef} scale={1.6}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#1e293b"
          emissive="#0ea5e9"
          emissiveIntensity={0.15}
          metalness={0.9}
          roughness={0.15}
          distort={0.35}
          speed={1.5}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh scale={1.62}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["transparent"]} />
      <fog attach="fog" args={["#08080a", 4, 12]} />
      <ambientLight intensity={0.15} color="#1e293b" />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.2}
        color="#e2e8f0"
      />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.4}
        color="#6366f1"
      />
      <pointLight position={[0, -2, -4]} intensity={0.8} color="#38bdf8" />
      <pointLight position={[3, 0, 2]} intensity={0.3} color="#22d3ee" />
      <MonolithMesh />
    </>
  );
}

export function InterrogationMonolith() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
