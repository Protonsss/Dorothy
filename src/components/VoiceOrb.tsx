import { useEffect, useRef, useCallback } from 'react';
import { DorothyOrb } from '../core/DorothyOrb';
import { useOrbStore, OrbVisualState } from '../core/OrbState';

interface VoiceOrbProps {
  className?: string;
  onInitialized?: () => void;
  onError?: (error: Error) => void;
}

export function VoiceOrb({
  className = '',
  onInitialized,
  onError,
}: VoiceOrbProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<DorothyOrb | null>(null);
  const { currentState, targetIridescence, targetSubsurface, targetWarmth,
    targetBrightness } = useOrbStore();

  const initializeOrb = useCallback(async (): Promise<void> => {
    if (!canvasRef.current || orbRef.current) return;

    try {
      const orb = new DorothyOrb(canvasRef.current);
      orbRef.current = orb;

      await orb.start();

      if (onInitialized) {
        onInitialized();
      }
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
      console.error('Failed to initialize Dorothy Orb:', error);
    }
  }, [onInitialized, onError]);

  useEffect(() => {
    void initializeOrb();

    return (): void => {
      if (orbRef.current) {
        orbRef.current.dispose();
        orbRef.current = null;
      }
    };
  }, [initializeOrb]);

  useEffect(() => {
    if (orbRef.current) {
      orbRef.current.updateState(currentState, {
        iridescence: targetIridescence,
        subsurface: targetSubsurface,
        warmth: targetWarmth,
        brightness: targetBrightness,
      });
    }
  }, [currentState, targetIridescence, targetSubsurface, targetWarmth,
    targetBrightness]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        touchAction: 'none',
      }}
    />
  );
}
