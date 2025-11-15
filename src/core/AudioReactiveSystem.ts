export interface AudioFrequencyData {
  low: number;
  mid: number;
  high: number;
  average: number;
}

export class AudioReactiveSystem {
  private audioContext: AudioContext | null;
  private analyser: AnalyserNode | null;
  private dataArray: Uint8Array | null;
  private frequencyData: AudioFrequencyData;
  private smoothingFactor: number;
  private previousLevel: number;

  constructor(smoothingFactor = 0.8) {
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.smoothingFactor = smoothingFactor;
    this.previousLevel = 0;
    this.frequencyData = { low: 0, mid: 0, high: 0, average: 0 };
  }

  public async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength) as Uint8Array;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          sampleRate: 48000,
        }
      });

      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  public update(): AudioFrequencyData {
    if (!this.analyser || !this.dataArray) {
      return this.frequencyData;
    }

    this.analyser.getByteFrequencyData(this.dataArray as Uint8Array<ArrayBuffer>);

    const length = this.dataArray.length;
    const lowEnd = Math.floor(length * 0.1);
    const midEnd = Math.floor(length * 0.4);

    let low = 0;
    let mid = 0;
    let high = 0;
    let total = 0;

    for (let i = 0; i < length; i++) {
      const value = (this.dataArray[i] ?? 0) / 255;
      total += value;

      if (i < lowEnd) {
        low += value;
      } else if (i < midEnd) {
        mid += value;
      } else {
        high += value;
      }
    }

    this.frequencyData.low = low / lowEnd;
    this.frequencyData.mid = mid / (midEnd - lowEnd);
    this.frequencyData.high = high / (length - midEnd);

    const currentLevel = total / length;
    this.frequencyData.average = this.previousLevel * this.smoothingFactor +
      currentLevel * (1 - this.smoothingFactor);
    this.previousLevel = this.frequencyData.average;

    return { ...this.frequencyData };
  }

  public getAudioLevel(): number {
    return this.frequencyData.average;
  }

  public dispose(): void {
    if (this.audioContext) {
      void this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.dataArray = null;
  }
}
