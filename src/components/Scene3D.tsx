import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface Scene3DProps {
  cameraView: string;
  theme: "dark" | "light";
}

export default function Scene3D({ cameraView, theme }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Keep refs for animated elements
  const logoGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const orbitRingRef = useRef<THREE.Mesh | null>(null);
  const letterFRef = useRef<THREE.Group | null>(null);
  const letterARef = useRef<THREE.Group | null>(null);
  const letterSRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. SCENE CREATION
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Set initial fog/clear color based on theme
    const clearColor = theme === "dark" ? 0x050b14 : 0xf1f5f9;
    scene.background = new THREE.Color(clearColor);
    scene.fog = new THREE.FogExp2(clearColor, 0.015);

    // 2. CAMERA CREATION
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 8);
    cameraRef.current = camera;

    // 3. RENDERER CREATION
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    // Clear any previous canvas
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 15;
    controls.minDistance = 3;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.enablePan = false;
    controlsRef.current = controls;

    // 5. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, theme === "dark" ? 0.3 : 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x1e6bb8, 2.0); // FAS Blue
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xc9a84c, 1.5); // FAS Gold
    dirLight2.position.set(-5, -3, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 2.0, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 6. BUILD ABSTRACT F-A-S LOGO GROUP
    const logoGroup = new THREE.Group();
    logoGroupRef.current = logoGroup;

    // High quality materials with custom colors and emissions matching "Sophisticated Dark"
    const matF = new THREE.MeshStandardMaterial({
      color: 0x1e6bb8,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x0a2b4a,
      emissiveIntensity: 0.5,
    });

    const matA = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x5a481c,
      emissiveIntensity: 0.6,
    });

    const matS = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.3,
      metalness: 0.9,
      emissive: 0x01333f,
      emissiveIntensity: 0.4,
    });

    // F - Left Shape
    const groupF = new THREE.Group();
    const verticalF = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.0, 0.3), matF);
    groupF.add(verticalF);
    
    const topF = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.3), matF);
    topF.position.set(0.25, 0.85, 0);
    groupF.add(topF);
    
    const midF = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.3), matF);
    midF.position.set(0.15, 0.1, 0);
    groupF.add(midF);
    
    groupF.position.set(-1.8, 0, 0);
    logoGroup.add(groupF);
    letterFRef.current = groupF;

    // A - Center Pyramid Shape
    const groupA = new THREE.Group();
    const pyramidA = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.8, 4), matA);
    pyramidA.rotation.y = Math.PI / 4;
    groupA.add(pyramidA);

    const barA = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 0.25), matA);
    barA.position.set(0, -0.2, 0);
    groupA.add(barA);

    groupA.position.set(0, 0.1, 0);
    logoGroup.add(groupA);
    letterARef.current = groupA;

    // S - Right Torus Shape
    const groupS = new THREE.Group();
    const topLoopS = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.15, 16, 100, Math.PI * 1.5), matS);
    topLoopS.rotation.z = Math.PI / 2;
    topLoopS.position.set(0, 0.45, 0);
    groupS.add(topLoopS);

    const bottomLoopS = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.15, 16, 100, Math.PI * 1.5), matS);
    bottomLoopS.rotation.z = -Math.PI / 2;
    bottomLoopS.position.set(0, -0.45, 0);
    groupS.add(bottomLoopS);

    groupS.position.set(1.8, 0, 0);
    logoGroup.add(groupS);
    letterSRef.current = groupS;

    scene.add(logoGroup);

    // 7. PARTICLES STARFIELD BACKGROUND
    const particleCount = 400;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const r = 5 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const mixRatio = Math.random();
      if (mixRatio < 0.5) {
        colors[i * 3] = 0.11; // R (blueish)
        colors[i * 3 + 1] = 0.42; // G
        colors[i * 3 + 2] = 0.72; // B
      } else {
        colors[i * 3] = 0.79; // R (goldish)
        colors[i * 3 + 1] = 0.66; // G
        colors[i * 3 + 2] = 0.3; // B
      }
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: theme === "dark" ? 0.8 : 0.4,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 8. GLOWING ORBIT RING
    const ringGeom = new THREE.TorusGeometry(3.2, 0.04, 8, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      emissive: 0xc9a84c,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: theme === "dark" ? 0.7 : 0.3,
      roughness: 0.1,
      metalness: 0.9,
    });
    const orbitRing = new THREE.Mesh(ringGeom, ringMat);
    orbitRing.rotation.x = Math.PI / 2.3;
    scene.add(orbitRing);
    orbitRingRef.current = orbitRing;

    // 9. ANIMATE FUNCTION
    let animationFrameId: number;
    const startTime = Date.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      const elapsed = (Date.now() - startTime) * 0.001;

      // Rotate central logo group
      if (logoGroup) {
        logoGroup.rotation.y = Math.sin(elapsed * 0.15) * 0.2;
        logoGroup.rotation.x = Math.cos(elapsed * 0.1) * 0.1;

        // Micro-breathing individual floating
        if (letterFRef.current) {
          letterFRef.current.position.y = Math.sin(elapsed * 0.8) * 0.1;
        }
        if (letterARef.current) {
          letterARef.current.position.y = Math.cos(elapsed * 1.1) * 0.1 + 0.1;
        }
        if (letterSRef.current) {
          letterSRef.current.position.y = Math.sin(elapsed * 0.9 + 0.5) * 0.1;
        }
      }

      // Rotate Orbit Ring
      if (orbitRing) {
        orbitRing.rotation.z = elapsed * 0.12;
      }

      // Rotate particles starfield
      if (particles) {
        particles.rotation.y = elapsed * 0.012;
        particles.rotation.x = Math.sin(elapsed * 0.005) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. RESIZE LISTENER
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, [theme]);

  // Handle camera view prop animations dynamically
  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    controls.autoRotate = false;

    // Perform smooth visual updates based on selected view
    switch (cameraView) {
      case "hero":
        smoothMoveCamera(0, 1.5, 8);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        break;
      case "about":
        smoothMoveCamera(-2.5, 1.8, 5.5);
        break;
      case "products":
        smoothMoveCamera(2.5, -0.5, 6.0);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        break;
      case "legal":
        smoothMoveCamera(0, 3.5, 6.5);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.2;
        break;
      case "contact":
        smoothMoveCamera(1.2, 0.8, 4.8);
        break;
      case "front":
        smoothMoveCamera(0, 0.5, 6.5);
        break;
      case "top":
        smoothMoveCamera(0, 6.0, 2.0);
        break;
      case "particles":
        smoothMoveCamera(-4.0, -2.0, 8.0);
        break;
    }
  }, [cameraView]);

  // Smooth movement helper using linear interpolation in ticks
  const smoothMoveCamera = (targetX: number, targetY: number, targetZ: number) => {
    const camera = cameraRef.current;
    if (!camera) return;

    let tick = 0;
    const totalTicks = 60;
    const startX = camera.position.x;
    const startY = camera.position.y;
    const startZ = camera.position.z;

    const lerpTick = () => {
      if (tick >= totalTicks) return;
      tick++;
      const ratio = easeOutCubic(tick / totalTicks);
      camera.position.x = startX + (targetX - startX) * ratio;
      camera.position.y = startY + (targetY - startY) * ratio;
      camera.position.z = startZ + (targetZ - startZ) * ratio;
      requestAnimationFrame(lerpTick);
    };
    
    lerpTick();
  };

  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full select-none"
      style={{ zIndex: 1 }}
    />
  );
}
