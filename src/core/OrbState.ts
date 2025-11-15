import { create } from 'zustand';

export enum OrbVisualState {
  AMBIENT = 'ambient',
  LISTENING = 'listening',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
  ALERT = 'alert',
}

interface OrbStateStore {
  currentState: OrbVisualState;
  targetIridescence: number;
  targetSubsurface: number;
  targetWarmth: number;
  targetBrightness: number;
  transitionProgress: number;
  setState: (state: OrbVisualState) => void;
  updateTransition: (delta: number) => void;
}

const STATE_CONFIGS: Record<OrbVisualState, {
  iridescence: number;
  subsurface: number;
  warmth: number;
  brightness: number;
}> = {
  [OrbVisualState.AMBIENT]: {
    iridescence: 0.7,
    subsurface: 0.9,
    warmth: 0.85,
    brightness: 1.0,
  },
  [OrbVisualState.LISTENING]: {
    iridescence: 0.9,
    subsurface: 0.95,
    warmth: 0.75,
    brightness: 1.4,
  },
  [OrbVisualState.THINKING]: {
    iridescence: 0.6,
    subsurface: 0.85,
    warmth: 0.65,
    brightness: 1.2,
  },
  [OrbVisualState.SPEAKING]: {
    iridescence: 0.8,
    subsurface: 0.92,
    warmth: 0.88,
    brightness: 1.3,
  },
  [OrbVisualState.ALERT]: {
    iridescence: 0.5,
    subsurface: 0.7,
    warmth: 0.4,
    brightness: 1.6,
  },
};

export const useOrbStore = create<OrbStateStore>((set, get) => ({
  currentState: OrbVisualState.AMBIENT,
  targetIridescence: STATE_CONFIGS[OrbVisualState.AMBIENT].iridescence,
  targetSubsurface: STATE_CONFIGS[OrbVisualState.AMBIENT].subsurface,
  targetWarmth: STATE_CONFIGS[OrbVisualState.AMBIENT].warmth,
  targetBrightness: STATE_CONFIGS[OrbVisualState.AMBIENT].brightness,
  transitionProgress: 1.0,

  setState: (state: OrbVisualState): void => {
    const config = STATE_CONFIGS[state];
    set({
      currentState: state,
      targetIridescence: config.iridescence,
      targetSubsurface: config.subsurface,
      targetWarmth: config.warmth,
      targetBrightness: config.brightness,
      transitionProgress: 0.0,
    });
  },

  updateTransition: (delta: number): void => {
    const { transitionProgress } = get();
    if (transitionProgress < 1.0) {
      set({
        transitionProgress: Math.min(1.0, transitionProgress + delta * 2.0),
      });
    }
  },
}));

export function springInterpolate(
  current: number,
  target: number,
  velocity: number,
  delta: number
): { value: number; velocity: number } {
  const stiffness = 170;
  const damping = 26;

  const force = (target - current) * stiffness;
  const dampingForce = velocity * damping;
  const acceleration = (force - dampingForce) / 1;

  const newVelocity = velocity + acceleration * delta;
  const newValue = current + newVelocity * delta;

  return { value: newValue, velocity: newVelocity };
}
