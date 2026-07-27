import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroThreeCanvasProps {
  isDark?: boolean;
}

export const HeroThreeCanvas: React.FC<HeroThreeCanvasProps> = ({ isDark = true }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const fogColor = isDark ? 0x090d16 : 0xf8fafc;
    scene.fog = new THREE.FogExp2(fogColor, 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(isDark ? 0xffdf9e : 0xffffff, isDark ? 0.8 : 1.2);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(isDark ? 0xf59e0b : 0xd97706, 5, 25);
    goldPointLight.position.set(2, 3, 5);
    scene.add(goldPointLight);

    const mouseLight = new THREE.PointLight(isDark ? 0xd4af37 : 0x2563eb, 6, 20);
    mouseLight.position.set(0, 0, 4);
    scene.add(mouseLight);

    // 3. Interactive Golden/Celestial Constellation Particles & Lines (NO 3D shape/mesh)
    const particleCount = 750;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(isDark ? 0xf59e0b : 0xd97706);
    const color2 = new THREE.Color(isDark ? 0xd4af37 : 0x2563eb);
    const color3 = new THREE.Color(isDark ? 0x34d399 : 0x059669);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 45;
      positions[idx + 1] = (Math.random() - 0.5) * 35;
      positions[idx + 2] = (Math.random() - 0.5) * 20;

      const pickColor = Math.random() > 0.3 ? (Math.random() > 0.5 ? color1 : color2) : color3;
      colors[idx] = pickColor.r;
      colors[idx + 1] = pickColor.g;
      colors[idx + 2] = pickColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isDark ? 0.12 : 0.14,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.85 : 0.7,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Constellation lines geometry
    const maxLineConnections = 350;
    const linePositions = new Float32Array(maxLineConnections * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: isDark ? 0xf59e0b : 0xd97706,
      transparent: true,
      opacity: isDark ? 0.15 : 0.12,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    // 4. Mouse tracking variables
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - (rect.left || 0);
      const y = e.clientY - (rect.top || 0);
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;
      targetMouseX = (x / w) * 2 - 1;
      targetMouseY = -(y / h) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation (lerp)
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Move mouse light in 3D space
      mouseLight.position.x = mouseX * 12;
      mouseLight.position.y = mouseY * 8;
      mouseLight.position.z = 4 + Math.sin(elapsedTime * 2) * 0.5;

      // Subtle camera tilt
      camera.position.x = mouseX * 1.5;
      camera.position.y = mouseY * 1.5;
      camera.lookAt(0, 0, 0);

      // Rotate particle system slowly
      particleSystem.rotation.y = elapsedTime * 0.03 + mouseX * 0.1;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      // Update dynamic constellation lines near mouse
      const posArr = particleGeo.attributes.position.array as Float32Array;
      let lineIndex = 0;
      const connectionDistance = 4.0;

      for (let i = 0; i < particleCount && lineIndex < maxLineConnections * 6; i += 3) {
        const px = posArr[i * 3];
        const py = posArr[i * 3 + 1];
        const pz = posArr[i * 3 + 2];

        // Distance to mouse light
        const dx = px - mouseLight.position.x;
        const dy = py - mouseLight.position.y;
        const dz = pz - mouseLight.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectionDistance) {
          linePositions[lineIndex++] = px;
          linePositions[lineIndex++] = py;
          linePositions[lineIndex++] = pz;

          linePositions[lineIndex++] = mouseLight.position.x;
          linePositions[lineIndex++] = mouseLight.position.y;
          linePositions[lineIndex++] = mouseLight.position.z;
        }
      }

      lineGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-90 transition-opacity duration-500"
    />
  );
};
