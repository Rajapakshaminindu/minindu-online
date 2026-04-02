import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const FloatingSphere = ({ position, size, speed, distort, color }: {
  position: [number, number, number];
  size: number;
  speed: number;
  distort: number;
  color: string;
}) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    mesh.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5}>
      <mesh ref={mesh} position={position}>
        <icosahedronGeometry args={[size, 1]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          distort={distort}
          speed={2}
          roughness={0.5}
        />
      </mesh>
    </Float>
  );
};

const FloatingRing = ({ position, size, speed, color }: {
  position: [number, number, number];
  size: number;
  speed: number;
  color: string;
}) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
    mesh.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
  });

  return (
    <Float speed={speed * 0.8} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={mesh} position={position}>
        <torusGeometry args={[size, size * 0.15, 16, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </Float>
  );
};

const Particles = () => {
  const points = useRef<THREE.Points>(null);
  const count = 120;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.02;
    points.current.rotation.x = state.clock.elapsedTime * 0.01;
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
      <pointsMaterial size={0.03} color="#4a8eff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

const Scene = () => (
  <>
    <ambientLight intensity={0.5} />
    <directionalLight position={[5, 5, 5]} intensity={0.3} />

    <FloatingSphere position={[-4, 2, -3]} size={1.2} speed={1.2} distort={0.4} color="#4a8eff" />
    <FloatingSphere position={[4, -1, -4]} size={0.9} speed={0.8} distort={0.3} color="#6c63ff" />
    <FloatingSphere position={[0, 3, -5]} size={1.5} speed={0.6} distort={0.5} color="#4a8eff" />
    <FloatingSphere position={[-3, -3, -2]} size={0.7} speed={1} distort={0.35} color="#8b7bff" />

    <FloatingRing position={[3, 2, -3]} size={1} speed={0.7} color="#4a8eff" />
    <FloatingRing position={[-2, -1, -4]} size={1.3} speed={0.5} color="#6c63ff" />

    <Particles />
  </>
);

const Background3D = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none">
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  </div>
);

export default Background3D;
