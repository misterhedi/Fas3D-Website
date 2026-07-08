/**
 * PT FAS Technology Solutions - Interactive 3D Landing Page
 * Core Three.js Engine and Interactive Features
 */

// Global state and references
let scene, camera, renderer, controls;
let logoGroup, particleSystem, orbitRing;
let letterF, letterA, letterS;
let width = window.innerWidth;
let height = window.innerHeight;

// Theme state
let currentTheme = 'dark'; // 'dark' or 'light'

// Audio state (Web Audio API Synthesizer)
let audioCtx = null;
let synthOsc1, synthOsc2, filterNode, gainNode, lfoNode;
let isSoundPlaying = false;

// Loading Screen Simulation
function initLoader() {
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const loader = document.getElementById('loader');
  
  let progress = 0;
  const interval = setInterval(() => {
    // Accelerate loading progress
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('loaded');
        // Trigger entrance animations via class trigger
        document.querySelector('.hero-title').style.opacity = 1;
      }, 500);
    }
    progressBar.style.width = progress + '%';
    progressText.innerText = progress + '%';
  }, 100);
}

// 1. INITIALIZE THREE.JS SCENE
function init3D() {
  const canvas = document.getElementById('webgl');
  if (!canvas) return;

  // SCENE
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050b14, 0.015);

  // CAMERA
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 1.5, 8);

  // RENDERER
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // ORBIT CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 15;
  controls.minDistance = 3;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;
  // Disable pan to keep logo centered
  controls.enablePan = false;

  // LIGHTS
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x1e6bb8, 2.0); // Bright blue light
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xc9a84c, 1.5); // Warm gold light
  dirLight2.position.set(-5, -3, 2);
  scene.add(dirLight2);

  const pointLight = new THREE.PointLight(0xffffff, 2.0, 10);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  // CREATE OBJECTS
  createFASLogo();
  createParticles();
  createOrbitRing();

  // EVENTS
  window.addEventListener('resize', onWindowResize);
  setupScrollListener();
  setupThemeToggler();
  setupAudioToggler();
  setupCameraControls();

  // START LOOP
  animate();
}

// 2. CREATE ABSTRACT F, A, S LOGO
function createFASLogo() {
  logoGroup = new THREE.Group();

  // Materials with elegant emissive/glow properties
  const matF = new THREE.MeshStandardMaterial({
    color: 0x1e6bb8, // PT FAS Blue
    roughness: 0.2,
    metalness: 0.9,
    emissive: 0x0a2b4a,
    emissiveIntensity: 0.5,
    flatShading: false
  });

  const matA = new THREE.MeshStandardMaterial({
    color: 0xc9a84c, // PT FAS Gold
    roughness: 0.1,
    metalness: 0.8,
    emissive: 0x5a481c,
    emissiveIntensity: 0.6,
    flatShading: false
  });

  const matS = new THREE.MeshStandardMaterial({
    color: 0x06b6d4, // Cyan/Teal
    roughness: 0.3,
    metalness: 0.9,
    emissive: 0x01333f,
    emissiveIntensity: 0.4,
    flatShading: false
  });

  // A. ABSTRACT LETTER 'F' (Left)
  // Consists of a vertical pillar and two horizontal blocks
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
  letterF = groupF;

  // B. ABSTRACT LETTER 'A' (Center)
  // An elegant futuristic cone-pyramid interlinked with a ring
  const groupA = new THREE.Group();
  
  // Outer frame pyramid structure (cone with 4 radial segments)
  const pyramidA = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.8, 4), matA);
  pyramidA.rotation.y = Math.PI / 4; // rotate to look like pyramid
  groupA.add(pyramidA);

  // Horizontal crossing beam
  const barA = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 0.25), matA);
  barA.position.set(0, -0.2, 0);
  groupA.add(barA);

  groupA.position.set(0, 0.1, 0);
  logoGroup.add(groupA);
  letterA = groupA;

  // C. ABSTRACT LETTER 'S' (Right)
  // Built using curved double Torus geometry forming an abstract 'S' curve
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
  letterS = groupS;

  // Add all to scene
  scene.add(logoGroup);
}

// 3. CREATE PARTICLES STARFIELD
function createParticles() {
  const particleCount = 400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    // Distribute randomly in a sphere
    const r = 5 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    // Color mixing (blues and golds)
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

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle Material
  const material = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

// 4. CREATE GLOWING HALO RING
function createOrbitRing() {
  const ringGeom = new THREE.TorusGeometry(3.2, 0.05, 8, 100);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.7,
    roughness: 0.1,
    metalness: 0.9
  });

  orbitRing = new THREE.Mesh(ringGeom, ringMat);
  orbitRing.rotation.x = Math.PI / 2.3; // tilted ring
  scene.add(orbitRing);
}

// 5. ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);

  // Keep auto-rotation running smoothly if OrbitControls damping is enabled
  controls.update();

  const time = Date.now() * 0.001;

  // Rotate Central logoGroup gently when no user interaction
  if (logoGroup) {
    logoGroup.rotation.y = Math.sin(time * 0.15) * 0.2;
    logoGroup.rotation.x = Math.cos(time * 0.1) * 0.1;

    // Subtle individual breathing movements
    letterF.position.y = Math.sin(time * 0.8) * 0.1;
    letterA.position.y = Math.cos(time * 1.1) * 0.1 + 0.1;
    letterS.position.y = Math.sin(time * 0.9 + 0.5) * 0.1;
  }

  // Rotate Orbiting Halo Ring
  if (orbitRing) {
    orbitRing.rotation.z = time * 0.12;
  }

  // Animate Particles slowly
  if (particleSystem) {
    particleSystem.rotation.y = time * 0.015;
    particleSystem.rotation.x = Math.sin(time * 0.005) * 0.1;
  }

  renderer.render(scene, camera);
}

// 6. RESIZE HANDLER
function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// 7. SCROLL-TRIGGERED 3D CAMERA MOTIONS (IMPROVED IMMERSIVE UX)
function setupScrollListener() {
  const sections = document.querySelectorAll('.overlay-section');
  const navItems = document.querySelectorAll('.nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  // Simple scroll spy to highlight nav and trigger 3D camera animations
  window.addEventListener('scroll', () => {
    let currentSectionId = 'hero';
    let scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 300;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
        section.classList.add('active-section');
      } else {
        section.classList.remove('active-section');
      }
    });

    // Sync Desktop Navbar Highlights
    navItems.forEach(item => {
      if (item.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Move 3D camera slightly in response to scrolling for immersive parallax
    if (controls) {
      // Temporarily disable autoRotate during scroll to avoid jumpiness
      controls.autoRotate = false;
      
      const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);

      // Animate Camera position depending on current section ID
      switch (currentSectionId) {
        case 'hero':
          gsap.to(camera.position, { x: 0, y: 1.5, z: 8, duration: 1.5, ease: 'power2.out' });
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.8;
          break;
        case 'about':
          // Fly closer and pan down
          gsap.to(camera.position, { x: -2.5, y: 1.8, z: 5.5, duration: 1.5, ease: 'power2.out' });
          controls.autoRotate = false;
          break;
        case 'products':
          // Showcase Orbit Ring focus
          gsap.to(camera.position, { x: 2.5, y: -0.5, z: 6.0, duration: 1.8, ease: 'power2.out' });
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.3;
          break;
        case 'legal':
          // High view angle
          gsap.to(camera.position, { x: 0, y: 3.5, z: 6.5, duration: 1.5, ease: 'power2.out' });
          controls.autoRotate = true;
          controls.autoRotateSpeed = 1.2;
          break;
        case 'contact':
          // Focused closeup view
          gsap.to(camera.position, { x: 1.2, y: 0.8, z: 4.8, duration: 1.5, ease: 'power2.out' });
          controls.autoRotate = false;
          break;
      }
    }
  });
}

// 8. AUDIO SYNTHESIZER (WEB AUDIO API - AMBIENT SOUNDSCAPE)
function setupAudioToggler() {
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');

  soundBtn.addEventListener('click', () => {
    if (!isSoundPlaying) {
      startAmbientSynth();
      soundIcon.setAttribute('data-lucide', 'volume-2');
      soundBtn.classList.add('active-btn');
      soundBtn.setAttribute('title', 'Matikan Musik Latar');
      isSoundPlaying = true;
    } else {
      stopAmbientSynth();
      soundIcon.setAttribute('data-lucide', 'volume-x');
      soundBtn.classList.remove('active-btn');
      soundBtn.setAttribute('title', 'Nyalakan Musik Latar');
      isSoundPlaying = false;
    }
    lucide.createIcons();
  });
}

function startAmbientSynth() {
  try {
    // Create audio context if not present
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Oscillator 1 - Deep bass drone (C2 = 65.41Hz)
    synthOsc1 = audioCtx.createOscillator();
    synthOsc1.type = 'sawtooth';
    synthOsc1.frequency.setValueAtTime(65.41, audioCtx.currentTime);

    // Oscillator 2 - Warm fifth interval drone (G2 = 98.00Hz)
    synthOsc2 = audioCtx.createOscillator();
    synthOsc2.type = 'triangle';
    synthOsc2.frequency.setValueAtTime(98.00, audioCtx.currentTime);

    // Lowpass Filter for spacey/warm synth feel
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(250, audioCtx.currentTime);
    filterNode.Q.setValueAtTime(1.0, audioCtx.currentTime);

    // LFO (Low Frequency Oscillator) to modulate Filter for organic breathing
    lfoNode = audioCtx.createOscillator();
    lfoNode.type = 'sine';
    lfoNode.frequency.setValueAtTime(0.12, audioCtx.currentTime); // very slow 0.12Hz
    
    // Modulation depth
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(100, audioCtx.currentTime);

    // Connect LFO to Filter frequency
    lfoNode.connect(lfoGain);
    lfoGain.connect(filterNode.frequency);

    // Gain node for volume control (keep it very quiet and ambient)
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    // Smooth fade in
    gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 3.0);

    // Connect synth modules
    synthOsc1.connect(filterNode);
    synthOsc2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start oscillators
    synthOsc1.start();
    synthOsc2.start();
    lfoNode.start();

  } catch (error) {
    console.error("Gagal menjalankan Audio Synth:", error);
  }
}

function stopAmbientSynth() {
  if (gainNode && audioCtx) {
    // Smooth fade out before stopping
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);
    setTimeout(() => {
      try {
        if (synthOsc1) synthOsc1.stop();
        if (synthOsc2) synthOsc2.stop();
        if (lfoNode) lfoNode.stop();
      } catch (err) {}
    }, 1000);
  }
}

// 9. THEME TRANSITIONS
function setupThemeToggler() {
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = document.getElementById('theme-icon');
  const body = document.body;

  themeBtn.addEventListener('click', () => {
    if (currentTheme === 'dark') {
      currentTheme = 'light';
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      themeIcon.setAttribute('data-lucide', 'moon');
      
      // Update Three.js scene colors
      if (scene) {
        scene.fog.color.setHex(0xe2e8f0);
        // Soft white ambient background
        renderer.setClearColor(0xe2e8f0, 1.0);
      }
    } else {
      currentTheme = 'dark';
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      themeIcon.setAttribute('data-lucide', 'sun');
      
      // Update Three.js scene colors
      if (scene) {
        scene.fog.color.setHex(0x050b14);
        renderer.setClearColor(0x050b14, 0.0); // transparent dark background
      }
    }
    lucide.createIcons();
  });
}

// 10. PRESETS PANEL CONTROLLER
function setupCameraControls() {
  const presetButtons = document.querySelectorAll('.cam-preset-btn');
  const resetBtn = document.getElementById('reset-cam-btn');

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (!camera || !controls) return;

      // Stop autoRotate for user-triggered focuses
      controls.autoRotate = false;

      switch (view) {
        case 'front':
          gsap.to(camera.position, { x: 0, y: 0.5, z: 6.5, duration: 1.5, ease: 'power2.inOut' });
          break;
        case 'top':
          gsap.to(camera.position, { x: 0, y: 6.0, z: 2.0, duration: 1.8, ease: 'power2.inOut' });
          break;
        case 'particles':
          gsap.to(camera.position, { x: -4.0, y: -2.0, z: 8.0, duration: 2.0, ease: 'power2.inOut' });
          break;
      }
    });
  });

  resetBtn.addEventListener('click', () => {
    if (!camera || !controls) return;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    gsap.to(camera.position, { x: 0, y: 1.5, z: 8, duration: 1.5, ease: 'power2.inOut' });
  });
}

// 11. MOBILE DRAWER AND DETAILED PRODUCT MODAL INTERACTION
document.addEventListener('DOMContentLoaded', () => {
  // Mobile drawer trigger
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });

    // Close drawer when clicking any mobile link
    const mobileLinks = document.querySelectorAll('.mobile-nav-item');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });
  }

  // Product detail modals
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const detailButtons = document.querySelectorAll('.btn-product-detail');
  const details = document.querySelectorAll('.modal-detail-content');

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      // Hide all details
      details.forEach(det => {
        det.classList.remove('active-detail');
      });

      // Show targeted detail
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.classList.add('active-detail');
      }

      // Activate Modal Overlay
      modal.classList.add('active');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Close modal when clicking outside the card
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});

// Run Init scripts
initLoader();
init3D();
