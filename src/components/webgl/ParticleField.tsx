"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { hudState } from "@/lib/hud-state";

/* ------------------------------------------------------------------ */
/* GLSL — helpers + morph weights per kprverse-design-spec §3/§5       */
/*                                                                      */
/* Each particle carries four "homes":                                  */
/*   position  — hero swarm (flattened spherical cloud)                 */
/*   aCore     — condensed glowing core (Experience)                    */
/*   aVault    — floating panel grid at x≈-8 (Projects)                 */
/*   aUplink   — ascending column streams (Contact)                     */
/* The vertex shader blends between them with smoothstep bells          */
/* computed from the scrubbed scroll progress uProgress.                */
/* ------------------------------------------------------------------ */

const VERTEX = /* glsl */ `
  attribute float aSeed;     // 0..1 random per particle
  attribute vec3 aCore;
  attribute vec3 aVault;
  attribute vec3 aUplink;

  uniform float uTime;
  uniform float uProgress;   // master scroll progress 0..1
  uniform float uPixelRatio;
  uniform float uSize;

  varying float vIntensity;

  float hash21(vec2 p){
    vec3 q = fract(vec3(p.xyx) * .1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1,0)), f.x),
               mix(hash21(i + vec2(0,1)), hash21(i + vec2(1,1)), f.x), f.y);
  }

  void main() {
    /* ---- morph weights: bells over the scroll storyboard ---- */
    float p = uProgress;
    float wCore   = smoothstep(0.18, 0.36, p) * (1.0 - smoothstep(0.42, 0.58, p));
    float wVault  = smoothstep(0.46, 0.62, p) * (1.0 - smoothstep(0.74, 0.88, p));
    float wUplink = smoothstep(0.80, 0.96, p);
    float wSwarm  = clamp(1.0 - wCore - wVault - wUplink, 0.0, 1.0);

    /* uplink streams rise forever: scroll y through an 18-unit loop */
    vec3 uplink = aUplink;
    uplink.y = mod(uplink.y + uTime * (1.2 + aSeed * 1.6), 18.0) - 2.0;

    vec3 pos = position * wSwarm + aCore * wCore + aVault * wVault + uplink * wUplink;

    /* whole-swarm slow orbital drift (fades out when condensed) */
    float a = uTime * 0.02 * (wSwarm + 0.15);
    float ca = cos(a), sa = sin(a);
    pos.xz = mat2(ca, -sa, sa, ca) * pos.xz;

    /* noise drift — damped when particles are locked to a structure */
    float amp = mix(0.2, 0.9, wSwarm);
    float t = uTime * 0.06;
    pos.x += (vnoise(pos.yz * 0.35 + t) - 0.5) * amp;
    pos.y += (vnoise(pos.zx * 0.35 - t) - 0.5) * amp * 0.8;
    pos.z += (vnoise(pos.xy * 0.35 + t * 1.3) - 0.5) * amp;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    /* twinkle + brightness boost while forming the core */
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 40.0);
    vIntensity = twinkle * (1.0 + wCore * 0.7);

    /* size attenuation, clamped so close fly-bys don't blow out */
    float size = uSize * uPixelRatio * (0.6 + 0.7 * twinkle) * (14.0 / -mv.z);
    gl_PointSize = min(size, 24.0 * uPixelRatio);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  varying float vIntensity;

  // cyberpunk ramp: near-black -> electric yellow -> bone white (spec §5)
  vec3 irisRamp(float x){
    vec3 world = vec3(.039,.039,.047);   // #0a0a0c
    vec3 iris  = vec3(.910,.851,.047);   // #e8d90c
    vec3 peri  = vec3(.925,.918,.886);   // #eceae2
    vec3 c = mix(world, iris, smoothstep(0.0, 0.45, x));
    c = mix(c, peri, smoothstep(0.45, 0.8, x));
    return mix(c, vec3(1.0), smoothstep(0.85, 1.0, x));
  }

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0) discard;
    float alpha = pow(1.0 - d, 2.2);

    vec3 col = irisRamp(vIntensity * (1.0 - d * 0.6));
    gl_FragColor = vec4(col, alpha * 0.85);
  }
`;

/* ------------------------------------------------------------------ */

/** panel centers for the Projects "vault" formation (yz plane at x≈-8) */
const VAULT_PANELS: Array<[number, number]> = [
  // [y, z] — 2 rows × 3 columns of floating screens
  [1.9, -3.2],
  [1.9, 0],
  [1.9, 3.2],
  [-0.7, -3.2],
  [-0.7, 0],
  [-0.7, 3.2],
];

export function ParticleField({ count }: { count: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const gl = useThree((state) => state.gl);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const core = new Float32Array(count * 3);
    const vault = new Float32Array(count * 3);
    const uplink = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    const STREAMS = 28;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      /* hero swarm: shell-biased flattened sphere */
      const r = 4 + 5 * Math.pow(Math.random(), 0.7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.cos(phi) * 0.55;
      positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      /* core: dense sphere, most mass near the surface for a shell glow */
      const cr = 1.7 * Math.pow(Math.random(), 0.35);
      const cth = Math.random() * Math.PI * 2;
      const cph = Math.acos(2 * Math.random() - 1);
      core[i3] = cr * Math.sin(cph) * Math.cos(cth);
      core[i3 + 1] = cr * Math.cos(cph);
      core[i3 + 2] = cr * Math.sin(cph) * Math.sin(cth);

      /* vault: pick a panel; 35% of particles snap to its border frame */
      const [py, pz] = VAULT_PANELS[i % VAULT_PANELS.length];
      const w = 2.4; // panel width (z axis)
      const h = 1.5; // panel height (y axis)
      let ly: number;
      let lz: number;
      if (Math.random() < 0.35) {
        // perimeter: pick an edge, walk along it
        const edge = Math.floor(Math.random() * 4);
        const along = Math.random() - 0.5;
        if (edge === 0) [ly, lz] = [h / 2, along * w];
        else if (edge === 1) [ly, lz] = [-h / 2, along * w];
        else if (edge === 2) [ly, lz] = [along * h, w / 2];
        else [ly, lz] = [along * h, -w / 2];
      } else {
        ly = (Math.random() - 0.5) * h;
        lz = (Math.random() - 0.5) * w;
      }
      vault[i3] = -8 + (Math.random() - 0.5) * 0.08; // paper-thin depth
      vault[i3 + 1] = py + ly;
      vault[i3 + 2] = pz + lz;

      /* uplink: 28 vertical streams on a ring around the camera rise */
      const si = i % STREAMS;
      const sa = (si / STREAMS) * Math.PI * 2;
      const sr = 2.5 + ((si * 7919) % 100) / 100 * 3.5;
      uplink[i3] = Math.cos(sa) * sr + (Math.random() - 0.5) * 0.3;
      uplink[i3 + 1] = Math.random() * 18 - 2; // shader scrolls this in a loop
      uplink[i3 + 2] = Math.sin(sa) * sr + (Math.random() - 0.5) * 0.3;

      seeds[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aCore", new THREE.BufferAttribute(core, 3));
    geo.setAttribute("aVault", new THREE.BufferAttribute(vault, 3));
    geo.setAttribute("aUplink", new THREE.BufferAttribute(uplink, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: 2.2 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uPixelRatio.value = gl.getPixelRatio();
  }, [gl, uniforms]);

  // spec §7: explicit disposal on unmount
  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uProgress.value = hudState.scrollProgress;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
