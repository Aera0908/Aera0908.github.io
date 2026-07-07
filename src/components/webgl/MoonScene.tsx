"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// Starfield background
function StarField({ count = 350 }) {
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 45 + Math.random() * 20; // far background boundary
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.15}
        color="#d1d5db"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

export function MoonScene() {
  const earthTexture = useLoader(THREE.TextureLoader, "/cyberpunk_earth.png");

  // Custom shader to key out the black background of the Earth texture
  const earthShader = useMemo(() => {
    return {
      uniforms: {
        uTexture: { value: earthTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main() {
          vec4 texColor = texture2D(uTexture, vUv);
          // Key out black pixels based on brightness
          float brightness = max(texColor.r, max(texColor.g, texColor.b));
          float alpha = smoothstep(0.015, 0.08, brightness);
          gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
        }
      `,
    };
  }, [earthTexture]);

  // Generate 2D moon surface crater details
  const craters = useMemo(() => {
    const list = [];
    for (let i = 0; i < 18; i++) {
      const x = (Math.random() - 0.5) * 60;
      const z = -15 + Math.random() * 30; // Z coordinates in front of Earth
      const scaleX = 1.0 + Math.random() * 2.0;
      const scaleZ = 0.5 + Math.random() * 1.0;
      list.push({ id: i, x, z, scaleX, scaleZ });
    }
    return list;
  }, []);

  return (
    <group>
      {/* Lighting for standard materials */}
      <ambientLight intensity={0.2} color="#141630" />
      <directionalLight position={[0, 15, 20]} intensity={1.5} color="#ffffff" />

      {/* 1. Starfield background */}
      <StarField count={350} />

      {/* 2. Flat 2D Earth Sprite (Z = -34) */}
      <mesh position={[0, 7.5, -34]}>
        <planeGeometry args={[25, 25]} />
        <shaderMaterial
          args={[earthShader]}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* 3. 2D Moon Surface Horizon and Craters */}
      <group position={[0, -6.0, 0]}>
        {/* Main horizontal moon surface plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 50]} />
          <meshStandardMaterial
            color="#222433"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>

        {/* Scattered 2D moon crater details (flat ellipses) */}
        {craters.map((c) => (
          <mesh
            key={c.id}
            position={[c.x, 0.01, c.z]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[c.scaleX, c.scaleZ, 1]}
          >
            <ringGeometry args={[0.8, 1.0, 16]} />
            <meshBasicMaterial color="#171822" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
