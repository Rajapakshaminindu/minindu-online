/**
 * ScrollGeometry – A scroll-reactive abstract 3D shape built with
 * React-Three-Fiber + custom GLSL shaders.
 *
 * As the user scrolls the page:
 *   • The shape drifts vertically & horizontally
 *   • It rotates on all three axes
 *   • A subtle scale pulse breathes life into it
 *   • Colour palette shifts through the site's theme colours
 *   • Glow intensity peaks mid-page and fades at extremes
 *
 * The shape is an *icosahedron* whose vertices are displaced in the
 * vertex shader to create an organic, blobby silhouette – far from a
 * plain sphere or cube.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";

/* ────────────────────────────────────────────
   Hook: track how far the user has scrolled
   (0 = top, 1 = bottom)
   ──────────────────────────────────────────── */
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const raw = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setProgress(Math.min(Math.max(raw, 0), 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
};

/* ────────────────────────────────────────────
   Organic Blob – displaced icosahedron
   ──────────────────────────────────────────── */
const OrganicBlob = ({ scroll }: { scroll: number }) => {
  const mesh = useRef<THREE.Mesh>(null);

  /* Shader uniforms that update every frame */
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uGlow: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;

    // Push uniform values
    uniforms.uTime.value = t;
    uniforms.uScroll.value = scroll;
    // Glow peaks in the middle of the page
    uniforms.uGlow.value = 1.0 - Math.abs(scroll - 0.5) * 2;

    /* ── Scroll-driven transforms ── */

    // Rotation: gentle base spin + scroll acceleration
    mesh.current.rotation.x = t * 0.12 + scroll * Math.PI * 0.6;
    mesh.current.rotation.y = t * 0.18 + scroll * Math.PI * 1.2;
    mesh.current.rotation.z = Math.sin(t * 0.09) * 0.15 + scroll * 0.4;

    // Position: figure-eight drift on scroll
    mesh.current.position.x = Math.sin(scroll * Math.PI * 2) * 2.0;
    mesh.current.position.y =
      Math.cos(scroll * Math.PI * 1.5) * 1.2 + Math.sin(t * 0.25) * 0.15;

    // Scale: breathing pulse + slight grow on scroll
    const breathe = 1 + Math.sin(t * 0.5) * 0.03;
    const scrollScale = 1 + scroll * 0.15;
    mesh.current.scale.setScalar(breathe * scrollScale);
  });

  /* ── Vertex shader: displace surface to create organic blob ── */
  const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform float uScroll;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldNormal;
    varying vec2 vUv;
    varying float vDisplacement;

    //
    // Classic 3-D simplex noise (Stefan Gustavson)
    //
    vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
    vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
    vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g  = step(x0.yzx, x0.xyz);
      vec3 l  = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0*floor(p*ns.z*ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0*x_);

      vec4 x = x_*ns.x + ns.yyyy;
      vec4 y = y_*ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    void main(){
      vUv = uv;

      // Layer two noise frequencies for organic displacement
      float slow  = snoise(normal * 1.5 + uTime * 0.15 + uScroll * 1.5);
      float fast  = snoise(normal * 3.0 + uTime * 0.3) * 0.35;
      float displacement = (slow + fast) * 0.45;
      vDisplacement = displacement;

      // Push vertices outward along their normal
      vec3 newPos = position + normal * displacement;

      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(newPos, 1.0)).xyz;
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `;

  /* ── Fragment shader: iridescent gradient + glow ── */
  const fragmentShader = /* glsl */ `
    uniform float uTime;
    uniform float uScroll;
    uniform float uGlow;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldNormal;
    varying vec2 vUv;
    varying float vDisplacement;

    // Attempt a smooth colour palette (IQ palette trick)
    vec3 palette(float t){
      vec3 a = vec3(0.5);
      vec3 b = vec3(0.5);
      vec3 c = vec3(1.0);
      vec3 d = vec3(0.00, 0.33, 0.67);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main(){
      vec3 viewDir = normalize(-vPosition);

      // Fresnel rim
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

      // ── Theme colours that shift with scroll ──
      vec3 blue    = vec3(0.23, 0.48, 1.0);   // --primary
      vec3 violet  = vec3(0.52, 0.33, 0.82);  // --accent
      vec3 magenta = vec3(0.85, 0.20, 0.55);

      float phase = uScroll * 4.0;
      vec3 scrollCol = mix(blue, violet, clamp(phase, 0.0, 1.0));
      scrollCol = mix(scrollCol, magenta, clamp(phase - 1.0, 0.0, 1.0));
      scrollCol = mix(scrollCol, blue,    clamp(phase - 2.0, 0.0, 1.0));
      scrollCol = mix(scrollCol, violet,  clamp(phase - 3.0, 0.0, 1.0));

      // Iridescent tint driven by world normal angle + displacement
      float angle = atan(vWorldNormal.y, vWorldNormal.x);
      float iridescence = angle * 0.5 + vDisplacement * 3.0 + uTime * 0.12;
      vec3 iriCol = palette(iridescence);

      // Blend theme colour with iridescence
      float blend = sin(angle * 2.0 + uTime * 0.18) * 0.5 + 0.5;
      vec3 baseCol = mix(scrollCol, iriCol, blend * 0.35);
      baseCol = mix(baseCol, scrollCol * 1.4, fresnel);

      // ── Multi-light specular ──
      vec3 L1 = normalize(vec3( 2.0,  3.0,  4.0));
      vec3 L2 = normalize(vec3(-3.0, -1.0,  2.0));
      vec3 L3 = normalize(vec3( 0.0,  4.0, -3.0));

      float spec1 = pow(max(dot(vNormal, normalize(L1 + viewDir)), 0.0), 80.0);
      float spec2 = pow(max(dot(vNormal, normalize(L2 + viewDir)), 0.0), 40.0);
      float spec3 = pow(max(dot(vNormal, normalize(L3 + viewDir)), 0.0), 120.0);

      float diff = max(dot(vNormal, L1), 0.0) * 0.3
                 + max(dot(vNormal, L2), 0.0) * 0.12;

      vec3 color = baseCol * (0.12 + diff);
      color += vec3(1.0, 0.96, 0.92) * spec1 * 0.85;
      color += vec3(0.6, 0.7, 1.0)   * spec2 * 0.45;
      color += vec3(1.0)              * spec3 * 0.25;

      // Rim glow – intensity driven by scroll position
      color += scrollCol * fresnel * (0.4 + uGlow * 0.5);

      // Outer glow halo on displaced peaks
      float peakGlow = smoothstep(0.15, 0.45, vDisplacement) * fresnel;
      color += scrollCol * peakGlow * 0.6;

      // Overall opacity: slightly transparent + fade at top/bottom of page
      float edgeFade = smoothstep(0.0, 0.08, uScroll) * smoothstep(1.0, 0.92, uScroll);
      float alpha = mix(0.7, 0.95, edgeFade);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh ref={mesh} position={[0, 0.2, 0]}>
      {/* High-detail icosahedron – the vertex shader warps it into a blob */}
      <icosahedronGeometry args={[2.6, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

/* ────────────────────────────────────────────
   Orbiting particles – tiny dots that slowly
   rotate around the blob
   ──────────────────────────────────────────── */
const Particles = ({ scroll }: { scroll: number }) => {
  const points = useRef<THREE.Points>(null);
  const count = 180;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute on a hollow sphere shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 6 + Math.random() * 14;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y =
      state.clock.elapsedTime * 0.01 + scroll * 0.4;
    points.current.rotation.x = scroll * 0.2;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#6a8fff"
        transparent
        opacity={0.25}
        sizeAttenuation
      />
    </points>
  );
};

/* ────────────────────────────────────────────
   Scene wrapper
   ──────────────────────────────────────────── */
const Scene = ({ scroll }: { scroll: number }) => (
  <>
    <OrganicBlob scroll={scroll} />
    <Particles scroll={scroll} />
  </>
);

/* ────────────────────────────────────────────
   Root component – fixed fullscreen canvas
   ──────────────────────────────────────────── */
const Background3D = () => {
  const scroll = useScrollProgress();

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene scroll={scroll} />
      </Canvas>
    </div>
  );
};

export default Background3D;
