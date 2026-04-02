import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/* ── Iridescent Torus ── */
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
    mesh.current.rotation.x = t * 0.15;
    mesh.current.rotation.y = t * 0.25;
    mesh.current.rotation.z = t * 0.1;
    uniforms.uTime.value = t;
  });

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

      // iridescent color cycling
      float angle = atan(vNormal.y, vNormal.x) + uTime * 0.3;
      vec3 col1 = vec3(0.2, 0.5, 1.0);   // blue
      vec3 col2 = vec3(0.9, 0.3, 0.6);   // pink
      vec3 col3 = vec3(1.0, 0.6, 0.2);   // orange
      vec3 col4 = vec3(0.3, 0.8, 0.9);   // cyan

      float t = sin(angle * 1.5 + vUv.x * 3.14) * 0.5 + 0.5;
      float t2 = sin(angle * 2.0 + vUv.y * 2.0 + uTime * 0.2) * 0.5 + 0.5;

      vec3 baseColor = mix(mix(col1, col2, t), mix(col3, col4, t2), fresnel);

      // glossy specular highlights
      vec3 lightDir = normalize(vec3(1.0, 2.0, 3.0));
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0);
      
      vec3 lightDir2 = normalize(vec3(-2.0, -1.0, 2.0));
      vec3 halfDir2 = normalize(lightDir2 + viewDir);
      float spec2 = pow(max(dot(vNormal, halfDir2), 0.0), 32.0);

      float ambient = 0.15;
      float diffuse = max(dot(vNormal, lightDir), 0.0) * 0.4;
      
      vec3 finalColor = baseColor * (ambient + diffuse) + vec3(1.0) * spec * 0.8 + vec3(0.7, 0.8, 1.0) * spec2 * 0.4;
      finalColor += baseColor * fresnel * 0.6;

      gl_FragColor = vec4(finalColor, 0.92);
    }
  `;

  return (
    <mesh ref={mesh}>
      <torusGeometry args={[2.2, 0.85, 128, 256]} />
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

/* ── Ambient Particles ── */
const Particles = () => {
  const points = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.015;
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
        size={0.04}
        color="#6c8eff"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
};

const Background3D = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none">
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <GlossyTorus />
      <Particles />
    </Canvas>
  </div>
);

export default Background3D;
