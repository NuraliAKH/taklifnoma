import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // slow upward drift with a sideways sway, wrapped inside the box
    p.y = mod(p.y + uTime * (0.05 + aSeed * 0.08) + 4.0, 8.0) - 4.0;
    p.x += sin(uTime * 0.3 + aSeed * 6.2831) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // fake depth of field: specks far from the focus plane grow and fade
    float blur = clamp(abs(-mv.z - 9.0) / 5.0, 0.0, 1.0);
    vAlpha = mix(0.9, 0.18, blur) * (0.4 + 0.6 * fract(aSeed * 13.7));
    gl_PointSize = aSize * uPixelRatio * (1.0 + blur * 3.0) * (30.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vAlpha * uOpacity);
  }
`;

/** Sparse gold dust (instanced as points) + a few falling petals. */
export function Dust({ count, petals, isDark }: { count: number; petals: number; isDark: boolean }) {
  const petalRef = useRef<THREE.InstancedMesh>(null);

  const dust = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      size[i] = 0.6 + Math.random() * 1.6;
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColor: { value: new THREE.Color(isDark ? '#e2c27f' : '#c9a45c') },
        uOpacity: { value: isDark ? 1 : 0.55 },
      },
    });
    return { geo, mat };
  }, [count, isDark]);

  const petal = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.09);
    shape.quadraticCurveTo(0.07, 0, 0, 0.09);
    shape.quadraticCurveTo(-0.07, 0, 0, -0.09);
    const geo = new THREE.ShapeGeometry(shape, 6);
    const mat = new THREE.MeshStandardMaterial({ color: '#c98a8f', roughness: 0.6, side: THREE.DoubleSide });
    const seeds = Array.from({ length: petals }, () => ({
      x: (Math.random() - 0.5) * 10, y: Math.random() * 8 - 4, z: Math.random() * 3 - 2,
      speed: 0.12 + Math.random() * 0.12, spin: Math.random() * 6,
    }));
    return { geo, mat, seeds };
  }, [petals]);

  useEffect(
    () => () => {
      dust.geo.dispose();
      dust.mat.dispose();
      petal.geo.dispose();
      petal.mat.dispose();
    },
    [dust, petal],
  );

  const m = useMemo(() => new THREE.Object3D(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    dust.mat.uniforms.uTime.value = t;
    const inst = petalRef.current;
    if (!inst) return;
    petal.seeds.forEach((s, i) => {
      const y = ((s.y - t * s.speed + 4) % 8 + 8) % 8 - 4;
      m.position.set(s.x + Math.sin(t * 0.6 + s.spin) * 0.4, y, s.z);
      m.rotation.set(t * 0.7 + s.spin, t * 0.4 + s.spin, Math.sin(t + s.spin));
      m.updateMatrix();
      inst.setMatrixAt(i, m.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <points geometry={dust.geo} material={dust.mat} frustumCulled={false} />
      {petals > 0 && <instancedMesh ref={petalRef} args={[petal.geo, petal.mat, petals]} frustumCulled={false} />}
    </>
  );
}
