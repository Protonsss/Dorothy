import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
}

interface PerformanceDisplayProps {
  getMetrics: () => PerformanceMetrics;
  show?: boolean;
}

export function PerformanceDisplay({
  getMetrics,
  show = false,
}: PerformanceDisplayProps): JSX.Element | null {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    drawCalls: 0,
    triangles: 0,
  });

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setMetrics(getMetrics());
    }, 100);

    return (): void => {
      clearInterval(interval);
    };
  }, [getMetrics, show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#00ff00',
        padding: '10px',
        fontFamily: 'monospace',
        fontSize: '12px',
        borderRadius: '4px',
        zIndex: 9999,
      }}
    >
      <div>FPS: {metrics.fps.toFixed(1)}</div>
      <div>Frame: {metrics.frameTime.toFixed(2)}ms</div>
      <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
      <div>Draw Calls: {metrics.drawCalls}</div>
      <div>Triangles: {metrics.triangles.toLocaleString()}</div>
    </div>
  );
}
