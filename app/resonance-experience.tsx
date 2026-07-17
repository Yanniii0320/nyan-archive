"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

type Organism = {
  group: THREE.Group;
  material: THREE.ShaderMaterial;
  seed: number;
  phrase: string;
  wake: number;
  targetWake: number;
  screenDistance: number;
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWake;
  uniform float uSeed;
  varying vec3 vNormalW;
  varying vec3 vView;
  varying vec2 vUv;
  varying float vPulse;

  void main() {
    vUv = uv;
    float breath = sin(uTime * (0.72 + uSeed * .06) + position.y * 2.6 + uSeed) * .5 + .5;
    float micro = sin(position.x * 6.0 + uTime) * sin(position.y * 5.0 - uTime * .7) * .018;
    vec3 breathingPosition = position + normal * (micro + breath * (.025 + uWake * .09));
    vec4 world = modelMatrix * vec4(breathingPosition, 1.0);
    vec4 mvPosition = viewMatrix * world;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - world.xyz);
    vPulse = breath;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uSecondary;
  uniform float uTime;
  uniform float uWake;
  uniform float uSeed;
  varying vec3 vNormalW;
  varying vec3 vView;
  varying vec2 vUv;
  varying float vPulse;

  void main() {
    float fresnel = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vView))), 2.35);
    float membrane = sin(vUv.y * 18.0 + uTime * .52 + uSeed * 3.0) * .5 + .5;
    float pearl = sin(fresnel * 9.0 + uTime * .21 + uSeed) * .5 + .5;
    vec3 spectrum = mix(uColor, uSecondary, clamp(fresnel * .8 + pearl * .22, 0.0, 1.0));
    spectrum += vec3(.12, .16, .24) * membrane * fresnel;
    float core = .055 + uWake * (.16 + vPulse * .11);
    float alpha = .17 + fresnel * .48 + uWake * .14;
    gl_FragColor = vec4(spectrum * (core + fresnel * (1.0 + uWake * 2.2)), alpha);
  }
`;

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uTravel;
  attribute float aSize;
  attribute float aPhase;
  varying float vLife;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * .13 + aPhase) * (0.4 + aSize * .08);
    p.y += cos(uTime * .1 + aPhase * 1.7) * .35;
    p.z += sin(uTime * .06 + aPhase) * .22;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (105.0 / max(1.0, -mv.z));
    vLife = .35 + .65 * (sin(uTime * .22 + aPhase * 2.0) * .5 + .5);
    gl_Position = projectionMatrix * mv;
  }
`;

const particleFragment = /* glsl */ `
  precision mediump float;
  varying float vLife;
  void main() {
    vec2 d = gl_PointCoord - .5;
    float halo = smoothstep(.5, 0.0, length(d));
    float core = smoothstep(.17, 0.0, length(d));
    gl_FragColor = vec4(vec3(.58, .72, 1.0) * halo + vec3(.9, .78, 1.0) * core, halo * vLife * .42);
  }
`;

const organismPalette = [
  [0xb7d6ff, 0xffaee8],
  [0xded5ff, 0x9dffe5],
  [0xffd8ae, 0xc3a9ff],
  [0x9ee8ff, 0xffcadf],
  [0xe4ffcc, 0xafa8ff],
  [0xffc1f2, 0xa8efff],
];

const organismData = [
  { position: [-4.3, 1.6, -8], kind: 0, scale: 1.15, phrase: "a memory opening without a name" },
  { position: [4.8, -1.1, -22], kind: 1, scale: 1.35, phrase: "the warmth left behind by another body" },
  { position: [-5.7, -1.4, -37], kind: 2, scale: 1.05, phrase: "something fragile learning to remain" },
  { position: [2.8, 2.5, -49], kind: 3, scale: 1.2, phrase: "light passing through a private sorrow" },
  { position: [7.2, -2.6, -66], kind: 4, scale: 1.32, phrase: "an unfinished tenderness" },
  { position: [-3.2, 1.2, -82], kind: 5, scale: 1.5, phrase: "the silence after being understood" },
  { position: [3.8, -0.4, -99], kind: 0, scale: 1.0, phrase: "a feeling returning in another form" },
];

function makeMaterial(index: number) {
  const [a, b] = organismPalette[index % organismPalette.length];
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uWake: { value: 0 },
      uSeed: { value: index * 0.73 + 0.4 },
      uColor: { value: new THREE.Color(a) },
      uSecondary: { value: new THREE.Color(b) },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

function createOrganism(index: number, kind: number, scale: number, phrase: string): Organism {
  const group = new THREE.Group();
  const material = makeMaterial(index);
  const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.53, 42, 30), material);
  group.add(pearl);

  if (kind === 0) {
    const petalGeometry = new THREE.SphereGeometry(0.48, 28, 18);
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeometry, material);
      petal.position.set(Math.cos(angle) * 0.72, Math.sin(angle) * 0.72, -0.05);
      petal.scale.set(0.58, 1.18, 0.22);
      petal.rotation.z = angle - Math.PI / 2;
      group.add(petal);
    }
  } else if (kind === 1) {
    pearl.scale.set(1.18, 0.82, 1.18);
    pearl.position.y = 0.5;
    for (let i = 0; i < 6; i++) {
      const points = [];
      for (let j = 0; j < 7; j++) {
        points.push(new THREE.Vector3((i - 2.5) * 0.15 + Math.sin(j * 0.8 + i) * 0.08, 0.2 - j * 0.23, Math.cos(i * 1.9) * 0.17));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.018, 5, false), material));
    }
  } else if (kind === 2) {
    group.remove(pearl);
    group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.76, 3), material));
    for (let i = 0; i < 5; i++) {
      const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.13 + i * 0.018, 0), material);
      shard.position.set(Math.cos(i * 2.1) * 1.0, Math.sin(i * 1.7) * 0.72, Math.sin(i) * 0.5);
      group.add(shard);
    }
  } else if (kind === 3) {
    pearl.scale.set(0.42, 1.42, 0.35);
    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.SphereGeometry(0.58, 30, 20), material);
      wing.position.x = side * 0.47;
      wing.scale.set(0.9, 1.25, 0.18);
      wing.rotation.z = side * 0.42;
      group.add(wing);
    }
  } else if (kind === 4) {
    pearl.scale.set(0.68, 1.34, 0.68);
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8 + i * 0.18, 0.018, 7, 64), material);
      ring.rotation.set(i * 0.8, i * 0.56, i * 1.1);
      group.add(ring);
    }
  } else {
    pearl.scale.set(1.24, 1.24, 0.48);
    for (let i = 0; i < 9; i++) {
      const bud = new THREE.Mesh(new THREE.SphereGeometry(0.19, 18, 12), material);
      const angle = (i / 9) * Math.PI * 2;
      bud.position.set(Math.cos(angle) * 0.82, Math.sin(angle) * 0.82, Math.sin(i * 1.7) * 0.3);
      bud.scale.set(0.7, 1.45, 0.7);
      bud.rotation.z = angle;
      group.add(bud);
    }
  }

  group.scale.setScalar(scale);
  return { group, material, seed: index * 1.41, phrase, wake: 0, targetWake: 0, screenDistance: 10 };
}

class ResonanceAudio {
  context: AudioContext | null = null;
  master: GainNode | null = null;
  voices: { gain: GainNode; pan: StereoPannerNode }[] = [];

  start() {
    if (this.context) {
      void this.context.resume();
      return;
    }
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioCtor();
    this.context = context;
    const master = context.createGain();
    master.gain.value = 0.62;
    master.connect(context.destination);
    this.master = master;

    const notes = [110, 146.83, 174.61, 220, 261.63, 329.63, 392];
    notes.forEach((frequency, index) => {
      const gain = context.createGain();
      const pan = context.createStereoPanner();
      const filter = context.createBiquadFilter();
      gain.gain.value = 0;
      filter.type = "lowpass";
      filter.frequency.value = 520 + index * 85;
      filter.Q.value = 2.2;
      gain.connect(filter).connect(pan).connect(master);

      [0.5, 1, 2.004].forEach((ratio, layer) => {
        const oscillator = context.createOscillator();
        const partial = context.createGain();
        oscillator.type = layer === 1 ? "sine" : "triangle";
        oscillator.frequency.value = frequency * ratio;
        oscillator.detune.value = (index - 3) * 2.4 + layer * 1.8;
        partial.gain.value = layer === 1 ? 0.56 : 0.16;
        oscillator.connect(partial).connect(gain);
        oscillator.start();
      });
      this.voices.push({ gain, pan });
    });
  }

  update(index: number, wake: number, panValue: number) {
    if (!this.context || !this.voices[index]) return;
    const now = this.context.currentTime;
    const shaped = Math.pow(Math.max(0, wake - 0.12) / 0.88, 2.1) * 0.047;
    this.voices[index].gain.gain.setTargetAtTime(shaped, now, 0.58);
    this.voices[index].pan.pan.setTargetAtTime(THREE.MathUtils.clamp(panValue, -0.82, 0.82), now, 0.7);
  }
}

export default function ResonanceExperience() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [awakePhrase, setAwakePhrase] = useState("");
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02030a);
    scene.fog = new THREE.FogExp2(0x060917, 0.019);

    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 180);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    mount.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.18, 0.74, 0.08);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const organisms: Organism[] = organismData.map((data, index) => {
      const organism = createOrganism(index, data.kind, data.scale, data.phrase);
      organism.group.position.set(data.position[0], data.position[1], data.position[2]);
      scene.add(organism.group);
      return organism;
    });

    const particleCount = 1700;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particlePhases = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 30;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 19;
      particlePositions[i * 3 + 2] = 8 - Math.random() * 122;
      particleSizes[i] = 0.55 + Math.random() * 2.6;
      particlePhases[i] = Math.random() * Math.PI * 2;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("aSize", new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute("aPhase", new THREE.BufferAttribute(particlePhases, 1));
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: { uTime: { value: 0 }, uTravel: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(particleGeometry, particleMaterial));

    const sporeGeometry = new THREE.IcosahedronGeometry(0.035, 1);
    const sporeMaterial = new THREE.MeshBasicMaterial({ color: 0x93c9ff, transparent: true, opacity: 0.38 });
    const spores = new THREE.InstancedMesh(sporeGeometry, sporeMaterial, 620);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 620; i++) {
      dummy.position.set((Math.random() - 0.5) * 28, (Math.random() - 0.5) * 18, 7 - Math.random() * 120);
      const s = 0.35 + Math.random() * 2.15;
      dummy.scale.setScalar(s);
      dummy.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      dummy.updateMatrix();
      spores.setMatrixAt(i, dummy.matrix);
    }
    spores.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    scene.add(spores);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const cameraTarget = new THREE.Vector3();
    const projected = new THREE.Vector3();
    const clock = new THREE.Clock();
    const audio = new ResonanceAudio();
    let travel = 0;
    let targetTravel = 0;
    let activeIndex = -1;
    let lastPhrase = "";
    let animationFrame = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = mount.parentElement;

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
      root?.style.setProperty("--cursor-x", `${event.clientX}px`);
      root?.style.setProperty("--cursor-y", `${event.clientY}px`);
      if (event.pointerType === "touch") setIsTouch(true);
    };
    const onPointerDown = () => audio.start();
    const onWheel = (event: WheelEvent) => {
      targetTravel = THREE.MathUtils.clamp(targetTravel + event.deltaY * 0.018, 0, 108);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "s", "d"].includes(event.key)) targetTravel = Math.min(108, targetTravel + 5);
      if (["ArrowUp", "ArrowLeft", "w", "a"].includes(event.key)) targetTravel = Math.max(0, targetTravel - 5);
      if (event.key === "Enter" || event.key === " ") audio.start();
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      pointer.lerp(pointerTarget, 0.035);

      if (!reducedMotion) {
        const edgeCurrent = Math.max(0, Math.abs(pointer.x) - 0.78) * 0.25;
        targetTravel = Math.min(108, targetTravel + delta * (0.22 + edgeCurrent));
      }
      travel = THREE.MathUtils.lerp(travel, targetTravel, 0.025);
      cameraTarget.set(pointer.x * 3.1, pointer.y * 1.8, 12 - travel);
      camera.position.lerp(cameraTarget, 0.032);
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, -pointer.x * 0.012, 0.035);
      camera.lookAt(pointer.x * 0.58, pointer.y * 0.36, camera.position.z - 13);

      let nearest = -1;
      let nearestWake = 0;
      organisms.forEach((organism, index) => {
        projected.copy(organism.group.position).project(camera);
        const visible = projected.z > -1 && projected.z < 1;
        const dx = projected.x - pointer.x;
        const dy = projected.y - pointer.y;
        const screenDistance = Math.sqrt(dx * dx + dy * dy);
        organism.screenDistance = screenDistance;
        const depthDistance = Math.abs(organism.group.position.z - camera.position.z);
        const screenWake = visible ? 1 - THREE.MathUtils.smoothstep(screenDistance, 0.08, 0.55) : 0;
        const depthWake = 1 - THREE.MathUtils.smoothstep(depthDistance, 5, 24);
        organism.targetWake = Math.max(0, screenWake * (0.42 + depthWake * 0.76));
        organism.wake = THREE.MathUtils.lerp(organism.wake, organism.targetWake, 0.035);
        organism.material.uniforms.uTime.value = elapsed;
        organism.material.uniforms.uWake.value = organism.wake;
        organism.group.scale.setScalar(organismData[index].scale * (1 + organism.wake * 0.16));
        organism.group.rotation.y = Math.sin(elapsed * 0.14 + organism.seed) * 0.34;
        organism.group.rotation.x = Math.cos(elapsed * 0.11 + organism.seed) * 0.13;
        organism.group.position.y = organismData[index].position[1] + Math.sin(elapsed * 0.3 + organism.seed) * 0.26;
        audio.update(index, organism.wake, projected.x);
        if (organism.wake > nearestWake) {
          nearestWake = organism.wake;
          nearest = index;
        }
      });

      activeIndex = nearestWake > 0.38 ? nearest : -1;
      const nextPhrase = activeIndex >= 0 ? organisms[activeIndex].phrase : "";
      if (nextPhrase !== lastPhrase) {
        lastPhrase = nextPhrase;
        setAwakePhrase(nextPhrase);
      }
      root?.style.setProperty("--cursor-scale", `${1 + nearestWake * 1.9}`);

      particleMaterial.uniforms.uTime.value = elapsed;
      particleMaterial.uniforms.uTravel.value = travel;
      spores.rotation.z = Math.sin(elapsed * 0.04) * 0.025;
      bloom.strength = 0.95 + nearestWake * 0.72;
      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      organisms.forEach((organism) => organism.material.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
      sporeGeometry.dispose();
      sporeMaterial.dispose();
      if (audio.context) void audio.context.close();
      reducedMotion = true;
    };
  }, []);

  return (
    <main className={`resonance${isTouch ? " is-touch" : ""}`} aria-label="RESONANCE, an explorable listening environment">
      <div ref={mountRef} className="resonance__canvas" aria-hidden="true" />
      <div className="resonance__caustics" aria-hidden="true" />
      <div className="resonance__veil" aria-hidden="true" />
      <div className="resonance__grain" aria-hidden="true" />

      <p className="archive-mark">NÝAN.ARCHIVE <span>03</span></p>

      <section className="threshold" aria-label="RESONANCE">
        <p className="threshold__index">WORLD 03</p>
        <h1>RESONANCE</h1>
        <p className="threshold__thought">listening is entering someone else&apos;s emotional space</p>
      </section>

      <p className={`contact-echo${awakePhrase ? " is-awake" : ""}`} aria-live="polite">
        {awakePhrase || "silence has a shape"}
      </p>
      <div className="cursor-aura" aria-hidden="true" />
    </main>
  );
}
