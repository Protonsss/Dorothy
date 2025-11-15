import * as THREE from 'three';
import type { AudioFrequencyData } from './AudioReactiveSystem';

interface InstancedParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
}

export class InstancedParticleSystem {
  private particles: InstancedParticle[];
  private particleCount: number;
  private instancedMesh: THREE.InstancedMesh;
  private viscosity: number;
  private surfaceTension: number;
  private magneticField: THREE.Vector3;
  private dummy: THREE.Object3D;

  constructor(
    particleCount = 10000,
    viscosity = 0.98,
    surfaceTension = 0.7
  ) {
    this.particleCount = particleCount;
    this.viscosity = viscosity;
    this.surfaceTension = surfaceTension;
    this.magneticField = new THREE.Vector3(0, 1, 0);
    this.dummy = new THREE.Object3D();
    this.particles = [];

    const geometry = new THREE.SphereGeometry(1, 8, 8);
    const material = new THREE.MeshBasicMaterial();

    this.instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      particleCount
    );

    this.initializeParticles();
    this.updateInstancedMesh();
  }

  private initializeParticles(): void {
    for (let i = 0; i < this.particleCount; i++) {
      const radius = 0.8 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const particle: InstancedParticle = {
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
        scale: 0.8 + Math.random() * 0.4,
      };

      this.particles.push(particle);
    }
  }

  private updateInstancedMesh(): void {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = this.particles[i];
      if (!particle) continue;

      this.dummy.position.copy(particle.position);
      this.dummy.scale.setScalar(particle.scale);
      this.dummy.updateMatrix();

      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
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

      const acceleration = new THREE.Vector3(0, 0, 0);

      const toCenter = particle.position.clone().negate();
      const distToCenter = particle.position.length();
      const centerForce = toCenter.multiplyScalar(
        this.surfaceTension * (distToCenter - 1.0)
      );
      acceleration.add(centerForce);

      const magneticForce = this.magneticField.clone()
        .multiplyScalar(audioData.average * 0.15);
      acceleration.add(magneticForce);

      particle.velocity.add(acceleration.multiplyScalar(deltaTime));
      particle.velocity.multiplyScalar(this.viscosity);

      particle.position.add(
        particle.velocity.clone().multiplyScalar(deltaTime)
      );
    }

    this.updateInstancedMesh();
  }

  public getMesh(): THREE.InstancedMesh {
    return this.instancedMesh;
  }

  public getMagneticField(): THREE.Vector3 {
    return this.magneticField.clone();
  }

  public dispose(): void {
    this.instancedMesh.geometry.dispose();
    if (this.instancedMesh.material instanceof THREE.Material) {
      this.instancedMesh.material.dispose();
    }
    this.particles = [];
  }
}
