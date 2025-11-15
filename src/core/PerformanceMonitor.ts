import { trace } from '@opentelemetry/api';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
}

interface PerformanceThresholds {
  targetFps: number;
  maxMemory: number;
  maxFrameTime: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private thresholds: PerformanceThresholds;
  private frameCount: number;
  private lastTime: number;
  private fpsHistory: number[];
  private tracer;

  constructor(thresholds: Partial<PerformanceThresholds> = {}) {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      drawCalls: 0,
      triangles: 0,
    };

    this.thresholds = {
      targetFps: thresholds.targetFps ?? 60,
      maxMemory: thresholds.maxMemory ?? 150 * 1024 * 1024, // 150MB
      maxFrameTime: thresholds.maxFrameTime ?? 16.67, // ~60fps
    };

    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = new Array<number>(60).fill(60);
    this.tracer = trace.getTracer('dorothy-voice-orb');
  }

  public begin(): void {
    this.lastTime = performance.now();
  }

  public end(renderer: THREE.WebGLRenderer): void {
    const currentTime = performance.now();
    this.metrics.frameTime = currentTime - this.lastTime;

    this.frameCount++;

    if (this.frameCount % 10 === 0) {
      this.metrics.fps = 1000 / this.metrics.frameTime;
      this.fpsHistory.shift();
      this.fpsHistory.push(this.metrics.fps);
      this.updateMemoryUsage();
      this.updateRenderStats(renderer);
      this.checkThresholds();
    }
  }

  private updateMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as Performance & {
        memory: { usedJSHeapSize: number };
      }).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize;
    }
  }

  private updateRenderStats(renderer: THREE.WebGLRenderer): void {
    const info = renderer.info;
    this.metrics.drawCalls = info.render.calls;
    this.metrics.triangles = info.render.triangles;
  }

  private checkThresholds(): void {
    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) /
      this.fpsHistory.length;

    if (avgFps < this.thresholds.targetFps * 0.9) {
      console.warn(`Performance: FPS dropped to ${avgFps.toFixed(1)}`);
      this.tracer.startActiveSpan('performance-degradation', (span) => {
        span.setAttribute('fps', avgFps);
        span.setAttribute('threshold', this.thresholds.targetFps);
        span.end();
      });
    }

    if (this.metrics.memoryUsage > this.thresholds.maxMemory) {
      console.warn(`Memory usage: ${(this.metrics.memoryUsage / 1024 / 1024)
        .toFixed(2)}MB`);
    }
  }

  public getMetrics(): Readonly<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public getAverageFps(): number {
    return this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
  }
}
