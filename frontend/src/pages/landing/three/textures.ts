import * as THREE from 'three';

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
};

/** Seeded RNG so the paper looks the same on every load (and in screenshots). */
function rng(seed = 7) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

/** Cotton paper colour map + girih emboss bump map, generated on the fly (no image downloads). */
export function makePaperTextures(size: number) {
  const rand = rng();
  const [mc, m] = canvas(size, size);
  m.fillStyle = '#efe6d4';
  m.fillRect(0, 0, size, size);
  for (let i = 0; i < size * 3; i++) {
    m.strokeStyle = rand() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(120,96,60,0.05)';
    m.lineWidth = rand() * 1.2;
    const x = rand() * size, y = rand() * size, a = rand() * Math.PI, l = 3 + rand() * 10;
    m.beginPath();
    m.moveTo(x, y);
    m.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    m.stroke();
  }

  const [bc, b] = canvas(size, size);
  b.fillStyle = '#808080';
  b.fillRect(0, 0, size, size);
  b.strokeStyle = '#b4b4b4';
  b.lineWidth = Math.max(1, size / 512);
  const cell = size / 6;
  const star = (cx: number, cy: number, r: number) => {
    // 8-point girih star: two overlapping squares
    for (const rot of [0, Math.PI / 4]) {
      b.beginPath();
      for (let k = 0; k < 4; k++) {
        const a = rot + (k * Math.PI) / 2;
        const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
        if (k === 0) b.moveTo(px, py); else b.lineTo(px, py);
      }
      b.closePath();
      b.stroke();
    }
  };
  for (let y = 0; y <= 6; y++) for (let x = 0; x <= 6; x++) star(x * cell, y * cell, cell * 0.36);
  for (let i = 0; i < size * 4; i++) {
    b.fillStyle = `rgba(${rand() > 0.5 ? '255,255,255' : '0,0,0'},0.06)`;
    b.fillRect(rand() * size, rand() * size, 1.5, 1.5);
  }

  const map = new THREE.CanvasTexture(mc);
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(bc);
  for (const t of [map, bump]) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return { map, bump };
}

/** The invitation card that rises from the envelope. Waits for the webfonts so names render in Great Vibes. */
export async function drawCardTexture(texture: THREE.CanvasTexture) {
  const c = texture.image as HTMLCanvasElement;
  const g = c.getContext('2d')!;
  const W = c.width, H = c.height;
  try {
    await Promise.all([
      document.fonts.load(`${W / 9}px "Great Vibes"`),
      document.fonts.load(`500 ${W / 18}px "Cormorant Garamond"`),
    ]);
  } catch { /* fall back to system fonts */ }
  const grad = g.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#fbf6ec');
  grad.addColorStop(1, '#efe5d1');
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = '#b38b45';
  g.lineWidth = W / 400;
  g.strokeRect(W * 0.04, H * 0.06, W * 0.92, H * 0.88);
  g.lineWidth = W / 900;
  g.strokeRect(W * 0.055, H * 0.08, W * 0.89, H * 0.84);
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#6f7180';
  g.font = `600 ${W / 48}px Inter, sans-serif`;
  g.letterSpacing = `${W / 160}px`;
  g.fillText('TAKLIFNOMA', W / 2, H * 0.24);
  g.letterSpacing = '0px';
  g.fillStyle = '#8a6a2b';
  g.font = `${W / 9.5}px "Great Vibes", cursive`;
  g.fillText('Malika & Ulugʻbek', W / 2, H * 0.47);
  g.fillStyle = '#141a33';
  g.font = `500 ${W / 18}px "Cormorant Garamond", serif`;
  g.fillText('14 · 06 · 2027', W / 2, H * 0.68);
  g.fillStyle = '#4a4f63';
  g.font = `italic 500 ${W / 30}px "Cormorant Garamond", serif`;
  g.fillText('Toshkent', W / 2, H * 0.79);
  texture.needsUpdate = true;
}

export function makeCardTexture(width: number) {
  const [c] = canvas(width, Math.round(width * 0.68));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Soft baked contact shadow (cheaper than a real-time shadow map). */
export function makeShadowTexture() {
  const [c, g] = canvas(128, 128);
  const r = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  r.addColorStop(0, 'rgba(0,0,0,0.9)');
  r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
