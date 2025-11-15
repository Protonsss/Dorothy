import * as THREE from 'three';
import { EffectComposer, RenderPass, BloomEffect, EffectPass } from 'postprocessing';
import { AudioReactiveSystem } from './AudioReactiveSystem';
import { FerrofluidSimulation } from './FerrofluidSimulation';
import { PerformanceMonitor } from './PerformanceMonitor';
import { springInterpolate } from './OrbState';
import type { OrbVisualState } from './OrbState';

import volumetricVertexShader from '../shaders/volumetric.vert';
import volumetricFragmentShader from '../shaders/volumetric.frag';
import ferrofluidVertexShader from '../shaders/ferrofluid.vert';
import ferrofluidFragmentShader from '../shaders/ferrofluid.frag';

export class DorothyOrb {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private volumetricCore: THREE.Mesh;
  private ferrofluidParticles: THREE.Points;
  private audioSystem: AudioReactiveSystem;
  private ferrofluidSim: FerrofluidSimulation;
  private performanceMonitor: PerformanceMonitor;
  private animationFrameId: number | null;
  private clock: THREE.Clock;

  private uniforms: {
    iridescence: { value: number };
    subsurface: { value: number };
    audioLevel: { value: number };
    warmth: { value: number };
    time: { value: number };
    lightPosition: { value: THREE.Vector3 };
    audioFrequencyData: { value: THREE.Vector3 };
    magneticField: { value: THREE.Vector3 };
    particleSize: { value: number };
  };

  private velocities: {
    iridescence: number;
    subsurface: number;
    warmth: number;
    brightness: number;
  };

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.uniforms = {
      iridescence: { value: 0.7 },
      subsurface: { value: 0.9 },
      audioLevel: { value: 0.0 },
      warmth: { value: 0.85 },
      time: { value: 0.0 },
      lightPosition: { value: new THREE.Vector3(5, 5, 5) },
      audioFrequencyData: { value: new THREE.Vector3(0, 0, 0) },
      magneticField: { value: new THREE.Vector3(0, 1, 0) },
      particleSize: { value: 2.0 },
    };

    this.velocities = {
      iridescence: 0,
      subsurface: 0,
      warmth: 0,
      brightness: 0,
    };

    this.volumetricCore = this.createVolumetricCore();
    this.scene.add(this.volumetricCore);

    this.audioSystem = new AudioReactiveSystem(0.8);
    this.ferrofluidSim = new FerrofluidSimulation(50000, 0.98, 0.7);
    this.ferrofluidParticles = this.createFerrofluidLayer();
    this.scene.add(this.ferrofluidParticles);

    this.composer = new EffectComposer(this.renderer);
    this.setupPostProcessing();

    this.performanceMonitor = new PerformanceMonitor({
      targetFps: 60,
      maxMemory: 150 * 1024 * 1024,
      maxFrameTime: 16.67,
    });

    this.clock = new THREE.Clock();
    this.animationFrameId = null;

    this.setupLights();
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  private createVolumetricCore(): THREE.Mesh {
    const geometry = new THREE.IcosahedronGeometry(1, 4);
    const material = new THREE.ShaderMaterial({
      vertexShader: volumetricVertexShader,
      fragmentShader: volumetricFragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });

    return new THREE.Mesh(geometry, material);
  }

  private createFerrofluidLayer(): THREE.Points {
    const geometry = this.ferrofluidSim.getGeometry();
    const material = new THREE.ShaderMaterial({
      vertexShader: ferrofluidVertexShader,
      fragmentShader: ferrofluidFragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return new THREE.Points(geometry, material);
  }

  private setupPostProcessing(): void {
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomEffect = new BloomEffect({
      intensity: 1.5,
      luminanceThreshold: 0.6,
      luminanceSmoothing: 0.8,
    });
    const bloomPass = new EffectPass(this.camera, bloomEffect);
    this.composer.addPass(bloomPass);
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);
  }

  public async start(): Promise<void> {
    await this.audioSystem.initialize();
    this.animate();
  }

  public updateState(
    _state: OrbVisualState,
    targetValues: {
      iridescence: number;
      subsurface: number;
      warmth: number;
      brightness: number;
    }
  ): void {
    const result = springInterpolate(
      this.uniforms.iridescence.value,
      targetValues.iridescence,
      this.velocities.iridescence,
      this.clock.getDelta()
    );
    this.uniforms.iridescence.value = result.value;
    this.velocities.iridescence = result.velocity;
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    this.performanceMonitor.begin();

    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.uniforms.time.value += delta;

    const audioData = this.audioSystem.update();
    this.uniforms.audioLevel.value = audioData.average;
    this.uniforms.audioFrequencyData.value.set(
      audioData.low,
      audioData.mid,
      audioData.high
    );

    this.ferrofluidSim.update(delta, audioData);
    this.uniforms.magneticField.value = this.ferrofluidSim.getMagneticField();

    this.volumetricCore.rotation.y += delta * 0.1;
    this.ferrofluidParticles.rotation.y = this.volumetricCore.rotation.y;

    this.composer.render();

    this.performanceMonitor.end(this.renderer);
  }

  private handleResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.handleResize);

    this.audioSystem.dispose();
    this.ferrofluidSim.dispose();

    this.volumetricCore.geometry.dispose();
    if (this.volumetricCore.material instanceof THREE.Material) {
      this.volumetricCore.material.dispose();
    }

    this.ferrofluidParticles.geometry.dispose();
    if (this.ferrofluidParticles.material instanceof THREE.Material) {
      this.ferrofluidParticles.material.dispose();
    }

    this.renderer.dispose();
    this.composer.dispose();
  }

  public getPerformanceMetrics(): ReturnType<PerformanceMonitor['getMetrics']> {
    return this.performanceMonitor.getMetrics();
  }
}
