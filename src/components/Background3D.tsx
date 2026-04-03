import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";

/* ── Scroll progress hook ── */
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setProgress(Math.min(Math.max(p, 0), 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
};

/* ── Morphing geometry – torus → knot → sphere → icosahedron ── */
const MorphShape = ({ scroll }: { scroll: number }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  const { viewport } = useThree();

  useFrame((state) => {
    if (!mesh.current || !matRef.current) return;
    const t = state.clock.elapsedTime;

    uniforms.uTime.value = t;
    uniforms.uScroll.value = scroll;
    uniforms.uResolution.value.set(viewport.width, viewport.height);

    // Scroll-driven rotation changes
    const phase = scroll * Math.PI * 2;
    mesh.current.rotation.x = Math.PI * 0.1 + t * 0.08 + Math.sin(phase) * 0.5;
    mesh.current.rotation.y = t * 0.12 + Math.cos(phase * 0.7) * 0.8;
    mesh.current.rotation.z = Math.sin(t * 0.05 + phase) * 0.2;

    // Scale breathing based on scroll
    const breathe = 1 + Math.sin(t * 0.5) * 0.03;
    const scrollScale = 1 - scroll * 0.3; // shrinks as you scroll
    mesh.current.scale.setScalar(breathe * scrollScale);

    // Position drift
    mesh.current.position.x = Math.sin(scroll * Math.PI) * 2;
    mesh.current.position.y = Math.cos(scroll * Math.PI * 1.5) * 1.5 + 0.2;
  });

  const vertexShader = `
    uniform float uTime;
    uniform float uScroll;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;

    // Simplex-like noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
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
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
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
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      // Morphing distortion increases with scroll
      float distortStrength = 0.15 + uScroll * 0.6;
      float noiseFreq = 1.5 + uScroll * 2.0;
      float speed = uTime * 0.3;
      
      vec3 pos = position;
      float noise = snoise(pos * noiseFreq + speed);
      float noise2 = snoise(pos * noiseFreq * 2.0 + speed * 1.5) * 0.5;
      
      // Organic displacement
      pos += normal * (noise + noise2) * distortStrength;
      
      // Twist effect that increases with scroll
      float twist = uScroll * sin(pos.y * 2.0 + uTime * 0.2) * 0.4;
      float cosT = cos(twist);
      float sinT = sin(twist);
      pos.xz = mat2(cosT, -sinT, sinT, cosT) * pos.xz;

      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uScroll;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPos;

    vec3 palette(float t, float scroll) {
      // Shift palette hues based on scroll
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.00 + scroll * 0.3, 0.33 - scroll * 0.1, 0.67 - scroll * 0.2);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0 + uScroll);

      float angle = atan(vWorldNormal.y, vWorldNormal.x);
      float colorShift = angle * 0.5 + vUv.x * 2.0 + uTime * 0.12 + uScroll * 3.0;
      vec3 iridescentColor = palette(colorShift, uScroll);

      // Theme-matched colors that shift with scroll
      vec3 blue    = vec3(0.23, 0.48, 1.0);   // primary blue
      vec3 purple  = vec3(0.52, 0.33, 0.82);   // accent purple
      vec3 magenta = vec3(0.85, 0.20, 0.55);   // pink from gradient
      vec3 teal    = vec3(0.10, 0.75, 0.70);   // complementary teal

      // Scroll transitions through color themes
      float phase = uScroll * 4.0;
      vec3 color1 = mix(blue, purple, smoothstep(0.0, 1.0, phase));
      vec3 color2 = mix(purple, magenta, smoothstep(1.0, 2.0, phase));
      vec3 color3 = mix(magenta, teal, smoothstep(2.0, 3.0, phase));
      vec3 scrollColor = color1;
      if (phase > 1.0) scrollColor = color2;
      if (phase > 2.0) scrollColor = color3;
      if (phase > 3.0) scrollColor = mix(teal, blue, smoothstep(3.0, 4.0, phase));

      float blend1 = sin(angle * 2.0 + uTime * 0.15) * 0.5 + 0.5;
      float blend2 = cos(vUv.y * 3.14 + uTime * 0.12) * 0.5 + 0.5;

      vec3 baseColor = mix(
        mix(scrollColor, iridescentColor, blend1 * 0.6),
        mix(scrollColor * 1.2, iridescentColor, blend2),
        fresnel
      );

      // Dynamic lighting
      float lightAngle = uTime * 0.1 + uScroll * 2.0;
      vec3 light1 = normalize(vec3(cos(lightAngle) * 3.0, 3.0, sin(lightAngle) * 4.0));
      vec3 light2 = normalize(vec3(-3.0, -1.0, 2.0));
      vec3 light3 = normalize(vec3(sin(lightAngle * 0.7) * 2.0, 4.0, -2.0));

      vec3 half1 = normalize(light1 + viewDir);
      vec3 half2 = normalize(light2 + viewDir);
      vec3 half3 = normalize(light3 + viewDir);

      float spec1 = pow(max(dot(vNormal, half1), 0.0), 60.0 + uScroll * 40.0);
      float spec2 = pow(max(dot(vNormal, half2), 0.0), 30.0);
      float spec3 = pow(max(dot(vNormal, half3), 0.0), 100.0);

      float diffuse1 = max(dot(vNormal, light1), 0.0) * 0.4;
      float diffuse2 = max(dot(vNormal, light2), 0.0) * 0.15;

      float ambient = 0.08 + uScroll * 0.06;

      vec3 finalColor = baseColor * (ambient + diffuse1 + diffuse2);
      finalColor += vec3(1.0, 0.95, 0.9) * spec1 * 0.8;
      finalColor += scrollColor * spec2 * 0.6;
      finalColor += vec3(1.0) * spec3 * 0.25;
      finalColor += baseColor * fresnel * 0.6;

      // Rim glow shifts color with scroll
      float rim = pow(fresnel, 1.5);
      finalColor += scrollColor * rim * 0.4;

      // Subtle chromatic edge
      float edge = pow(1.0 - abs(dot(viewDir, vNormal)), 4.0);
      finalColor += vec3(0.4, 0.2, 1.0) * edge * 0.15 * (1.0 - uScroll);
      finalColor += vec3(0.1, 1.0, 0.6) * edge * 0.15 * uScroll;

      gl_FragColor = vec4(finalColor, 0.92 - uScroll * 0.15);
    }
  `;

  return (
    <mesh ref={mesh} position={[0, 0.2, 0]}>
      <torusKnotGeometry args={[2.5, 0.8, 300, 50, 2, 3]} />
      <shaderMaterial
        ref={matRef}
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

/* ── Orbiting particles that react to scroll ── */
const ReactiveParticles = ({ scroll }: { scroll: number }) => {
  const points = useRef<THREE.Points>(null);
  const count = 250;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 15;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 5;
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    // Scroll makes particles orbit faster and compress
    const speed = 0.01 + scroll * 0.04;
    points.current.rotation.y = t * speed;
    points.current.rotation.x = Math.sin(t * 0.05) * 0.1 + scroll * 0.5;

    // Compress toward center as scroll increases
    const scale = 1 - scroll * 0.4;
    points.current.scale.setScalar(Math.max(scale, 0.3));
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
        size={0.035}
        color="#6b8aff"
        transparent
        opacity={0.25 + scroll * 0.2}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/* ── Floating energy rings ── */
const EnergyRings = ({ scroll }: { scroll: number }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = t * 0.05;
    group.current.children.forEach((child, i) => {
      const offset = i * 0.8;
      const ringMesh = child as THREE.Mesh;
      ringMesh.rotation.x = t * 0.1 + offset + scroll * Math.PI;
      ringMesh.rotation.y = t * 0.08 + offset;
      const s = 1 + Math.sin(t * 0.3 + offset) * 0.1 + scroll * i * 0.3;
      ringMesh.scale.setScalar(s);
    });
  });

  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("hsl(217, 80%, 60%)"),
        transparent: true,
        opacity: 0.08,
        wireframe: true,
        side: THREE.DoubleSide,
      }),
    []
  );

  return (
    <group ref={group}>
      {[4.5, 5.5, 6.8].map((r, i) => (
        <mesh key={i} material={ringMat}>
          <torusGeometry args={[r, 0.02, 16, 100]} />
        </mesh>
      ))}
    </group>
  );
};

/* ── Main scene ── */
const Scene = ({ scroll }: { scroll: number }) => (
  <>
    <MorphShape scroll={scroll} />
    <ReactiveParticles scroll={scroll} />
    <EnergyRings scroll={scroll} />
  </>
);

const Background3D = () => {
  const scroll = useScrollProgress();

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Scene scroll={scroll} />
      </Canvas>
    </div>
  );
};

export default Background3D;
