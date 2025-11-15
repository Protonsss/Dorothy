import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});

// Mock Web Audio API
global.AudioContext = class AudioContext {
  createAnalyser(): AnalyserNode {
    return {
      fftSize: 2048,
      frequencyBinCount: 1024,
      smoothingTimeConstant: 0.8,
      getByteFrequencyData: (): void => {},
      connect: (): void => {},
    } as unknown as AnalyserNode;
  }

  createMediaStreamSource(): MediaStreamAudioSourceNode {
    return {
      connect: (): void => {},
    } as unknown as MediaStreamAudioSourceNode;
  }

  close(): Promise<void> {
    return Promise.resolve();
  }
} as unknown as typeof AudioContext;

// Mock WebGL
HTMLCanvasElement.prototype.getContext = function (contextId: string):
  RenderingContext | null {
  if (contextId === 'webgl2' || contextId === 'webgl') {
    return {} as WebGLRenderingContext;
  }
  return null;
};

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: (): Promise<MediaStream> => {
      return Promise.resolve({} as MediaStream);
    },
  },
  writable: true,
});

// Mock performance.memory
Object.defineProperty(performance, 'memory', {
  value: {
    usedJSHeapSize: 50000000,
    totalJSHeapSize: 100000000,
    jsHeapSizeLimit: 200000000,
  },
  writable: true,
});
