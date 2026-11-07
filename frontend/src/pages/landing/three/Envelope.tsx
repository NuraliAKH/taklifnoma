import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../scroll';
import { drawCardTexture, makeCardTexture, makePaperTextures, makeShadowTexture } from './textures';

const W = 3.2;
const H = 2.2;
const FLAP_DEPTH = 1.36;
const SEAL_Y = H / 2 - FLAP_DEPTH;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** smoothstep: eased 0..1 between a and b */
const ss = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = THREE.MathUtils.lerp;

/** Inset a simple CCW polygon by d (edge offset + adjacent-edge intersection). */
function insetPolygon(pts: THREE.Vector2[], d: number) {
  const n = pts.length;
  const lines = pts.map((p, i) => {
    const q = pts[(i + 1) % n];
    const dir = q.clone().sub(p).normalize();
    const normal = new THREE.Vector2(-dir.y, dir.x); // left normal = inward for CCW
    return { p: p.clone().addScaledVector(normal, d), dir };
  });
  return lines.map((l, i) => {
    const prev = lines[(i - 1 + n) % n];
    const cross = prev.dir.x * l.dir.y - prev.dir.y * l.dir.x;
    if (Math.abs(cross) < 1e-6) return l.p.clone();
    const diff = l.p.clone().sub(prev.p);
    const t = (diff.x * l.dir.y - diff.y * l.dir.x) / cross;
    return prev.p.clone().addScaledVector(prev.dir, t);
  });
}

/** A thin foil line that follows a polygon outline. */
function outlineGeometry(pts: THREE.Vector2[], inset: number, width: number) {
  const outer = insetPolygon(pts, inset);
  const inner = insetPolygon(pts, inset + width);
  const shape = new THREE.Shape(outer);
  shape.holes.push(new THREE.Path([...inner].reverse()));
  return new THREE.ShapeGeometry(shape);
}

/** Wax seal split into 3 pieces whose crack lines match, so they sit together until the seal breaks. */
function sealGeometries() {
  const R = 0.3;
  const radius = (a: number) => R * (1 + 0.05 * Math.sin(5 * a) + 0.03 * Math.sin(11 * a + 1));
  const crack = (a: number) => {
    const pts: THREE.Vector2[] = [];
    for (let k = 1; k < 5; k++) {
      const r = (k / 5) * radius(a);
      const jitter = (k % 2 ? 1 : -1) * 0.12;
      pts.push(new THREE.Vector2(Math.cos(a + jitter) * r, Math.sin(a + jitter) * r));
    }
    return pts;
  };
  const cuts = [0.3, 0.3 + (2 * Math.PI) / 3, 0.3 + (4 * Math.PI) / 3];
  return cuts.map((a0, i) => {
    const a1 = i === 2 ? cuts[0] + Math.PI * 2 : cuts[i + 1];
    const pts = [new THREE.Vector2(0, 0), ...crack(a0)];
    for (let k = 0; k <= 24; k++) {
      const a = a0 + ((a1 - a0) * k) / 24;
      pts.push(new THREE.Vector2(Math.cos(a) * radius(a), Math.sin(a) * radius(a)));
    }
    pts.push(...crack(a1).reverse());
    const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts), {
      depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 2, curveSegments: 4,
    });
    const mid = (a0 + a1) / 2;
    return { geo, dir: new THREE.Vector3(Math.cos(mid), Math.sin(mid), 0) };
  });
}

export function Envelope({ isDark, quality }: { isDark: boolean; quality: 'high' | 'low' }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const flap = useRef<THREE.Group>(null);
  const card = useRef<THREE.Mesh>(null);
  const seal = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const { size, viewport, camera } = useThree();

  const res = useMemo(() => {
    const paper = makePaperTextures(quality === 'high' ? 1024 : 512);
    const cardTex = makeCardTexture(quality === 'high' ? 1024 : 768);
    const shadowTex = makeShadowTexture();
    const logo = new THREE.TextureLoader().load('/logo_icon.webp');
    logo.colorSpace = THREE.SRGBColorSpace;

    const pocketPts = [
      new THREE.Vector2(-W / 2, -H / 2), new THREE.Vector2(W / 2, -H / 2), new THREE.Vector2(W / 2, H / 2),
      new THREE.Vector2(0, -0.05), new THREE.Vector2(-W / 2, H / 2),
    ];
    const flapPts = [new THREE.Vector2(-W / 2, 0), new THREE.Vector2(0, -FLAP_DEPTH), new THREE.Vector2(W / 2, 0)];

    // Same paper, three tints, so the pocket / flap / back read as separate folds
    const paperOpts = { map: paper.map, bumpMap: paper.bump, bumpScale: 2, roughness: 0.92, side: THREE.DoubleSide };
    const paperMat = new THREE.MeshStandardMaterial({ ...paperOpts, color: '#e6d9c0' });
    const flapMat = new THREE.MeshStandardMaterial({ ...paperOpts, color: '#efe5d1' });
    const backMat = new THREE.MeshStandardMaterial({ ...paperOpts, color: '#cdbd9f' });
    const liningMat = new THREE.MeshStandardMaterial({ color: '#1d3a6b', roughness: 0.8 }); // lapis lining
    const foilMat = new THREE.MeshPhysicalMaterial({
      color: '#d8b46a', metalness: 1, roughness: 0.3, anisotropy: 0.5, side: THREE.DoubleSide,
    });
    const waxMat = new THREE.MeshPhysicalMaterial({ color: '#4a0e12', roughness: 0.55, envMapIntensity: 0.25, clearcoat: 0.3, clearcoatRoughness: 0.4, transparent: true });
    const logoMat = new THREE.MeshStandardMaterial({ map: logo, transparent: true, color: '#e8c98a', metalness: 0.7, roughness: 0.35 });
    const cardMat = new THREE.MeshStandardMaterial({ map: cardTex, roughness: 0.85 });
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: isDark ? 0.55 : 0.28 });

    return {
      textures: [paper.map, paper.bump, cardTex, shadowTex, logo],
      materials: [paperMat, flapMat, backMat, liningMat, foilMat, waxMat, logoMat, cardMat, shadowMat],
      paperMat, flapMat, backMat, liningMat, foilMat, waxMat, logoMat, cardMat, shadowMat, cardTex,
      back: new THREE.BoxGeometry(W, H, 0.012),
      pocket: new THREE.ShapeGeometry(new THREE.Shape(pocketPts)),
      pocketFoil: outlineGeometry(pocketPts, 0.1, 0.014),
      flap: new THREE.ShapeGeometry(new THREE.Shape(flapPts)),
      flapFoil: outlineGeometry(flapPts, 0.09, 0.012),
      card: new THREE.BoxGeometry(W * 0.9, W * 0.9 * 0.68, 0.008),
      logo: new THREE.CircleGeometry(0.14, 32),
      shadowGeo: new THREE.PlaneGeometry(1, 1),
      seal: sealGeometries(),
    };
  }, [isDark, quality]);

  useEffect(() => {
    drawCardTexture(res.cardTex);
  }, [res.cardTex]);

  // Manual disposal: these resources are created outside JSX, so R3F won't free them on unmount.
  useEffect(
    () => () => {
      res.textures.forEach((t) => t.dispose());
      res.materials.forEach((m) => m.dispose());
      [res.back, res.pocket, res.pocketFoil, res.flap, res.flapFoil, res.card, res.logo, res.shadowGeo, ...res.seal.map((s) => s.geo)].forEach((g) => g.dispose());
    },
    [res],
  );

  useFrame((state, delta) => {
    const g = root.current;
    if (!g || !body.current || !flap.current || !card.current || !seal.current || !shadow.current) return;
    const { hero, open, final, pointerX, pointerY } = scrollState;
    const t = state.clock.elapsedTime;
    const desktop = size.width >= 1024;

    // Hero pose mirrors the SVG poster position so the crossfade is seamless.
    const posterW = desktop ? Math.min(size.width * 0.4, 600) : Math.min(size.width * 0.78, 420);
    const cx = desktop ? size.width * 0.96 - posterW / 2 : size.width / 2;
    const cy = desktop ? size.height / 2 : 84 + (posterW * 230) / 320 / 2;
    const vp = viewport.getCurrentViewport(camera, [0, 0, 0]);
    const heroScale = ((posterW * 300) / 320 / size.width) * vp.width / W;
    const heroX = (cx / size.width - 0.5) * vp.width;
    const heroY = (0.5 - cy / size.height) * vp.height;
    const openScale = Math.min(vp.width * (desktop ? 0.4 : 0.8), vp.height * 0.78) / W;

    let x: number, y: number, s: number;
    let flapA = 0, breakP = 0, rise = 0, leave = 0, stamp = 1, sealVis = 1;
    if (final > 0.05) {
      // Closing: envelope returns above the final CTA, flap closes, seal stamps down.
      x = 0;
      y = vp.height * (desktop ? 0.17 : 0.2) + scrollState.finalOut * vp.height;
      s = openScale * (desktop ? 0.62 : 0.8);
      flapA = 1 - ss(0.5, 0.78, final);
      stamp = ss(0.78, 0.95, final);
      sealVis = ss(0.76, 0.82, final);
      rise = -1;
    } else {
      const h = ss(0, 1, hero);
      x = lerp(heroX, desktop ? vp.width * 0.12 : 0, h);
      y = lerp(heroY, vp.height * (desktop ? -0.2 : 0.1), h);
      s = lerp(heroScale, openScale, h);
      breakP = ss(0.04, 0.24, open);
      flapA = ss(0.16, 0.5, open);
      rise = ss(0.45, 0.72, open);
      leave = ss(0.72, 0.98, open);
    }

    // Weighted parallax: slow lerp toward the pointer, plus a gentle idle float.
    const k = 1 - Math.exp(-delta * 3);
    // three-quarter turn in the hero so it reads as an object, flattening out as it opens
    const turn = final > 0.05 ? 0 : (1 - ss(0, 1, hero)) * (desktop ? -0.22 : -0.12);
    g.rotation.y = lerp(g.rotation.y, turn + pointerX * 0.07 + Math.sin(t * 0.5) * 0.04, k);
    g.rotation.x = lerp(g.rotation.x, pointerY * 0.05 - 0.06, k);
    g.position.set(x, y + Math.sin(t * 0.8) * 0.04 * s, 0);
    g.scale.setScalar(s);

    // Flap swings toward the camera and folds back past vertical (metal-like weight via smoothstep).
    flap.current.rotation.x = -flapA * Math.PI * 1.04;
    body.current.position.y = -leave * 3.2;

    // Card rises out of the pocket, then floats toward the camera for the hand-off to the phone.
    card.current.visible = rise >= 0;
    card.current.position.set(0, Math.max(0, rise) * 1.45 + leave * 0.3, 0.02 + leave * 1.6);
    card.current.rotation.x = -leave * 0.12;

    // Seal pieces fly apart and fall when it breaks; in the finale they stamp back down as one.
    const pieces = seal.current.children;
    res.seal.forEach((piece, i) => {
      const m = pieces[i];
      m.position.set(piece.dir.x * breakP * 0.5, piece.dir.y * breakP * 0.5 - breakP * breakP * 1.6, breakP * 0.5);
      m.rotation.set(breakP * (i - 1) * 1.4, breakP * 1.2, breakP * (i + 1) * 0.8);
    });
    seal.current.position.set(0, SEAL_Y, 0.07 + (1 - stamp) * 1.2);
    seal.current.scale.setScalar(1 + (1 - stamp) * 0.8);
    res.waxMat.opacity = sealVis * (1 - ss(0.55, 1, breakP));
    res.logoMat.opacity = res.waxMat.opacity * (1 - ss(0, 0.2, breakP));

    shadow.current.position.set(0, -H / 2 - 0.25 - leave * 3.2, -0.3);
    (shadow.current.material as THREE.MeshBasicMaterial).opacity = (isDark ? 0.55 : 0.28) * (1 - leave);
  });

  return (
    <group ref={root}>
      <mesh ref={shadow} geometry={res.shadowGeo} material={res.shadowMat} scale={[W * 1.3, 0.6, 1]} rotation={[-Math.PI / 2.4, 0, 0]} />
      <group ref={body}>
        <mesh geometry={res.back} material={[res.backMat, res.backMat, res.backMat, res.backMat, res.liningMat, res.backMat]} />
        <mesh geometry={res.pocket} material={res.paperMat} position={[0, 0, 0.04]} />
        <mesh geometry={res.pocketFoil} material={res.foilMat} position={[0, 0, 0.042]} />
        <group ref={flap} position={[0, H / 2, 0.048]}>
          <mesh geometry={res.flap} material={res.flapMat} />
          <mesh geometry={res.flapFoil} material={res.foilMat} position={[0, 0, 0.002]} />
        </group>
        <group ref={seal}>
          {res.seal.map((piece, i) => (
            <mesh key={i} geometry={piece.geo} material={res.waxMat} />
          ))}
          <mesh geometry={res.logo} material={res.logoMat} position={[0, 0, 0.075]} />
        </group>
      </group>
      <mesh ref={card} geometry={res.card} material={res.cardMat} />
    </group>
  );
}
