import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { scrollState } from '../scroll';
import { Envelope } from './Envelope';
import { Dust } from './Dust';

type Quality = 'high' | 'low';

function detectQuality(): Quality {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  return window.innerWidth < 768 || weak ? 'low' : 'high';
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** How visible the 3D layer should be for the current scroll position (0 = hidden, stop rendering). */
function layerOpacity() {
  const { open, final } = scrollState;
  if (final > 0.05) return clamp01((final - 0.12) / 0.23);
  return 1 - clamp01((open - 0.97) / 0.03);
}

function Lights({ isDark }: { isDark: boolean }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    // Studio reflections for the gold foil without downloading an .hdr
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = isDark ? 0.4 : 0.55;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
      room.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        (mesh.material as THREE.Material | undefined)?.dispose?.();
      });
    };
  }, [gl, scene, isDark]);

  return isDark ? (
    <>
      <ambientLight intensity={0.25} color="#b9c4ff" />
      <directionalLight position={[-3, 4, 5]} intensity={2.4} color="#ffd9a0" />
      <pointLight position={[3, -1.5, -2]} intensity={6} distance={12} color="#5a8bd6" />
    </>
  ) : (
    <>
      <ambientLight intensity={0.35} color="#fff7ea" />
      <directionalLight position={[-3, 5, 4]} intensity={1.8} color="#fff1da" />
      <pointLight position={[3, -1, -2]} intensity={2} distance={12} color="#9ec1ff" />
    </>
  );
}

export default function Scene({ isDark, onReady }: { isDark: boolean; onReady: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [quality] = useState<Quality>(detectQuality);
  const [dpr, setDpr] = useState(quality === 'high' ? 1.75 : 1);
  const [running, setRunning] = useState(true);

  // Fade the layer by scroll position and stop the render loop entirely while it is invisible.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const o = layerOpacity();
      if (wrap.current) wrap.current.style.opacity = String(o);
      setRunning(o > 0.001);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="lx-canvas" aria-hidden>
      <Canvas
        dpr={dpr}
        frameloop={running ? 'always' : 'never'}
        gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 35, position: [0, 0, 9], near: 0.1, far: 50 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = isDark ? 1.05 : 1;
          requestAnimationFrame(onReady);
        }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <Lights isDark={isDark} />
        <Envelope isDark={isDark} quality={quality} />
        <Dust count={quality === 'high' ? 280 : 80} petals={quality === 'high' ? 18 : 6} isDark={isDark} />
      </Canvas>
    </div>
  );
}
