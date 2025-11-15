import * as THREE from 'three';
import type { AudioFrequencyData } from './AudioReactiveSystem';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  mass: number;
}

export class FerrofluidSimulation {
  private particles: Particle[];
  private particleCount: number;
  private geometry: THREE.BufferGeometry;
  private positions: Float32Array;
  private velocities: Float32Array;
  private particleIds: Float32Array;
  private viscosity: number;
  private surfaceTension: number;
  private magneticField: THREE.Vector3;

  constructor(particleCount = 50000, viscosity = 0.98, surfaceTension = 0.7) {
    this.particleCount = particleCount;
    this.viscosity = viscosity;
    this.surfaceTension = surfaceTension;
    this.particles = [];
    this.magneticField = new THREE.Vector3(0, 1, 0);

    this.positions = new Float32Array(particleCount * 3);
    this.velocities = new Float32Array(particleCount * 3);
    this.particleIds = new Float32Array(particleCount);

    this.geometry = new THREE.BufferGeometry();

    this.initializeParticles();
    this.setupGeometry();
  }

  private initializeParticles(): void {
    for (let i = 0; i < this.particleCount; i++) {
      const radius = 0.8 + Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const particle: Particle = {
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        acceleration: new THREE.Vector3(0, 0, 0),
        mass: 1.0,
      };

      this.particles.push(particle);
      this.particleIds[i] = i;
    }
  }

  private setupGeometry(): void {
    this.updateBuffers();

    this.geometry.setAttribute('position',
      new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('velocity',
      new THREE.BufferAttribute(this.velocities, 3));
    this.geometry.setAttribute('particleId',
      new THREE.BufferAttribute(this.particleIds, 1));
  }

  private updateBuffers(): void {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = this.particles[i];
      if (!particle) continue;

      this.positions[i * 3] = particle.position.x;
      this.positions[i * 3 + 1] = particle.position.y;
      this.positions[i * 3 + 2] = particle.position.z;

      this.velocities[i * 3] = particle.velocity.x;
      this.velocities[i * 3 + 1] = particle.velocity.y;
      this.velocities[i * 3 + 2] = particle.velocity.z;
    }
  }

  public update(
    deltaTime: number,
    audioData: AudioFrequencyData
  ): void {
    this.magneticField.set(
      Math.sin(Date.now() * 0.001) * audioData.low,
      Math.cos(Date.now() * 0.0015) * audioData.mid,
      Math.sin(Date.now() * 0.0008) * audioData.high
    );

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      if (!particle) continue;

      particle.acceleration.set(0, 0, 0);

      const toCenter = particle.position.clone().negate();
      const distToCenter = particle.position.length();
      const centerForce = toCenter.multiplyScalar(
        this.surfaceTension * (distToCenter - 1.0)
      );
      particle.acceleration.add(centerForce);

      const magneticForce = this.magneticField.clone()
        .multiplyScalar(audioData.average * 0.1);
      particle.acceleration.add(magneticForce);

      particle.velocity.add(
        particle.acceleration.multiplyScalar(deltaTime)
      );
      particle.velocity.multiplyScalar(this.viscosity);

      particle.position.add(
        particle.velocity.clone().multiplyScalar(deltaTime)
      );
    }

    this.updateBuffers();

    const posAttr = this.geometry.getAttribute('position');
    posAttr.needsUpdate = true;

    const velAttr = this.geometry.getAttribute('velocity');
    velAttr.needsUpdate = true;
  }

  public getGeometry(): THREE.BufferGeometry {
    return this.geometry;
  }

  public getMagneticField(): THREE.Vector3 {
    return this.magneticField.clone();
  }

  public dispose(): void {
    this.geometry.dispose();
    this.particles = [];
  }
}
