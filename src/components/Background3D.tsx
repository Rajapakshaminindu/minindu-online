import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/* ── Iridescent Torus (large, centered, dramatic) ── */
const GlossyTorus = () => {
  const mesh = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = Math.PI * 0.15 + t * 0.12;
    mesh.current.rotation.y = t * 0.18;
    mesh.current.rotation.z = Math.sin(t * 0.1) * 0.15;
    uniforms.uTime.value = t;
  });

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldNormal;

    vec3 palette(float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.00, 0.33, 0.67);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.5);

      // Rich iridescent color from angle + time
      float angle = atan(vWorldNormal.y, vWorldNormal.x);
      float colorShift = angle * 0.5 + vUv.x * 2.0 + uTime * 0.15;
      vec3 iridescentColor = palette(colorShift);

      // Warm accent blending
      vec3 warmAccent = vec3(1.0, 0.4, 0.2);  // orange
      vec3 coolAccent = vec3(0.15, 0.5, 1.0);  // blue
      vec3 pinkAccent = vec3(0.95, 0.25, 0.55); // pink/magenta

      float blend1 = sin(angle * 2.0 + uTime * 0.2) * 0.5 + 0.5;
      float blend2 = cos(vUv.y * 3.14 + uTime * 0.15) * 0.5 + 0.5;

      vec3 baseColor = mix(
        mix(coolAccent, pinkAccent, blend1),
        mix(warmAccent, iridescentColor, blend2),
        fresnel
      );

      // Multiple specular highlights for glossy look
      vec3 light1 = normalize(vec3(2.0, 3.0, 4.0));
      vec3 light2 = normalize(vec3(-3.0, -1.0, 2.0));
      vec3 light3 = normalize(vec3(0.0, 4.0, -2.0));

      vec3 half1 = normalize(light1 + viewDir);
      vec3 half2 = normalize(light2 + viewDir);
      vec3 half3 = normalize(light3 + viewDir);

      float spec1 = pow(max(dot(vNormal, half1), 0.0), 80.0);
      float spec2 = pow(max(dot(vNormal, half2), 0.0), 40.0);
      float spec3 = pow(max(dot(vNormal, half3), 0.0), 120.0);

      float diffuse1 = max(dot(vNormal, light1), 0.0) * 0.35;
      float diffuse2 = max(dot(vNormal, light2), 0.0) * 0.15;

      float ambient = 0.12;

      vec3 finalColor = baseColor * (ambient + diffuse1 + diffuse2);
      finalColor += vec3(1.0, 0.95, 0.9) * spec1 * 0.9;
      finalColor += vec3(0.6, 0.7, 1.0) * spec2 * 0.5;
      finalColor += vec3(1.0) * spec3 * 0.3;
      finalColor += baseColor * fresnel * 0.7;

      // Subtle rim glow
      float rim = pow(fresnel, 1.5);
      finalColor += vec3(0.3, 0.5, 1.0) * rim * 0.3;

      gl_FragColor = vec4(finalColor, 0.95);
    }
  `;

  return (
    <mesh ref={mesh} position={[0, 0.2, 0]}>
      <torusGeometry args={[3.0, 1.1, 256, 512]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/* ── Subtle star-like particles ── */
const Particles = () => {
  const points = useRef<THREE.Points>(null);
  const count = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.008;
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
        size={0.025}
        color="#4a7fff"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
};

const Background3D = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none">
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <GlossyTorus />
      <Particles />
    </Canvas>
  </div>
);

export default Background3D;
