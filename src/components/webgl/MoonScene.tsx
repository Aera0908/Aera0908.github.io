"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// Starfield foreground details
function StarField({ count = 500 }) {
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 45 + Math.random() * 10;
      
      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.cos(phi);
      // Project all stars strictly behind the furthest 2D layer (Earth is at Z = -28)
      const pz = -35 - Math.abs(r * Math.sin(phi) * Math.sin(theta)) * 0.4;
      
      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.18}
        color="#eceae2"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

import { hudState } from "@/lib/hud-state";

export function MoonScene() {
  const spaceMaterialRef = useRef<THREE.ShaderMaterial>(null);
  // THREE.Clock is deprecated — drive shader time from a Timer we own
  const timer = useMemo(() => new THREE.Timer(), []);

  const earthRef = useRef<THREE.Mesh>(null);
  const oldMoonRef = useRef<THREE.Mesh>(null);
  const facilityRef = useRef<THREE.Mesh>(null);
  const newMoonRef = useRef<THREE.Mesh>(null);
  
  // Load the user's flat assets from public folder
  const earthTexture = useLoader(THREE.TextureLoader, "/bg-assets/earth-no-bg.png");
  const moonTexture = useLoader(THREE.TextureLoader, "/bg-assets/moon-surface-hero-section.png");
  const facilityTexture = useLoader(THREE.TextureLoader, "/bg-assets/facility-bg-parallax.png");
  const moonParallaxTexture = useLoader(THREE.TextureLoader, "/bg-assets/moon-surface-parallax.png");

  // Procedural WebGL Space Skybox Shader
  const spaceShader = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vWorldPosition;

        float hash(vec3 p) {
          p = fract(p * vec3(443.8975, 397.2973, 491.1871));
          p += dot(p.xyz, p.yzx + 19.19);
          return fract(p.x * p.y * p.z);
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }

        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          vec3 shift = vec3(100.0);
          for (int i = 0; i < 4; ++i) {
            v += a * noise(p);
            p = p * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 dir = normalize(vWorldPosition);
          
          // 1. Procedural Nebula Gas Clouds (Subtle, black space base)
          float n = fbm(dir * 3.2 + vec3(0.0, uTime * 0.012, 0.0));
          vec3 spaceBg = vec3(0.0, 0.0, 0.0); // pure black space background
          vec3 nebulaColor1 = vec3(0.02, 0.015, 0.04); // very faint cosmic purple dust
          vec3 nebulaColor2 = vec3(0.01, 0.01, 0.015); // faint cosmic charcoal haze
          
          vec3 color = mix(spaceBg, nebulaColor1, smoothstep(0.18, 0.7, n));
          color = mix(color, nebulaColor2, smoothstep(0.35, 0.95, n * 1.15));
          
          // 2. High-frequency procedural starry points
          float starThreshold = 0.940;
          float starNoise = hash(floor(dir * 280.0));
          if (starNoise > starThreshold) {
            float intensity = smoothstep(starThreshold, 1.0, starNoise);
            float twinkle = 0.55 + 0.45 * sin(uTime * 3.5 * starNoise);
            color += vec3(intensity * twinkle * 1.50);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    };
  }, []);

  // Update shader time uniform & mesh coordinates every frame from mutable hudState
  useFrame(() => {
    timer.update();
    if (spaceMaterialRef.current) {
      spaceMaterialRef.current.uniforms.uTime.value = timer.getElapsed();
    }
    
    // Animate positions in R3F loop to keep rendering performant & un-react-rendered
    if (earthRef.current) {
      earthRef.current.position.y = hudState.earthY;
      const mat = earthRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = hudState.earthOpacity;
    }
    if (oldMoonRef.current) {
      oldMoonRef.current.position.y = hudState.oldMoonY;
      const mat = oldMoonRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = hudState.oldMoonOpacity;
    }
    if (facilityRef.current) {
      facilityRef.current.position.y = hudState.facilityY;
      facilityRef.current.position.x = hudState.facilityX;
      const mat = facilityRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = hudState.facilityOpacity;
    }
    if (newMoonRef.current) {
      newMoonRef.current.position.y = hudState.moonParallaxY;
      newMoonRef.current.position.x = hudState.moonParallaxX;
      const mat = newMoonRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = hudState.moonParallaxOpacity;
    }
  });

  return (
    <group>
      {/* 1. Procedural 3D Space Background Skybox Sphere (inverted) */}
      <mesh scale={[-55, -55, -55]}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          ref={spaceMaterialRef}
          args={[spaceShader]}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Starfield Foreground Detail Layer */}
      <StarField count={3000} />

      {/* 3. Flat 2D Earth Plane (Z = -28) */}
      <mesh ref={earthRef} position={[0, hudState.earthY, -28]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial
          map={earthTexture}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* 4. Flat 2D Moon Horizon Ridge (Z = -8) (matching 6336x2688 aspect ratio, zoomed to cover width) */}
      <mesh ref={oldMoonRef} position={[0, hudState.oldMoonY, -8]}>
        <planeGeometry args={[46, 19.5]} />
        <meshBasicMaterial
          map={moonTexture}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* 5. Flat 2D Facility Parallax Plane (Z = -16) — slightly wider than the
          7862x3072 source aspect so its edges stay covered at the end of the
          ±5 pan even on ultrawide viewports with mouse-parallax offset */}
      <mesh ref={facilityRef} position={[0, hudState.facilityY, -16]}>
        <planeGeometry args={[88, 30]} />
        <meshBasicMaterial
          map={facilityTexture}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* 6. Flat 2D New Moon Parallax Plane (Z = -6) (matching 3110x768 aspect ratio) */}
      <mesh ref={newMoonRef} position={[0, hudState.moonParallaxY, -6]}>
        <planeGeometry args={[114, 28.1]} />
        <meshBasicMaterial
          map={moonParallaxTexture}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
