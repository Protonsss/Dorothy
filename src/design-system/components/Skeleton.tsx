import './Skeleton.css';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}: SkeletonProps): JSX.Element {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`skeleton skeleton-${variant} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  ));

  return <>{skeletons}</>;
}

// Preset skeleton layouts
export function SkeletonCard(): JSX.Element {
  return (
    <div className="skeleton-card">
      <Skeleton variant="rectangular" width="100%" height={200} />
      <div className="skeleton-card-content">
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="90%" height={16} count={2} />
        <div className="skeleton-card-footer">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={120} height={16} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }): JSX.Element {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table-header">
        <Skeleton variant="text" width="100%" height={20} />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton-table-row">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="30%" height={16} />
          <Skeleton variant="text" width="20%" height={16} />
          <Skeleton variant="text" width="15%" height={16} />
          <Skeleton variant="text" width="10%" height={16} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard(): JSX.Element {
  return (
    <div className="skeleton-dashboard">
      <div className="skeleton-stats">
        <Skeleton variant="rounded" width="100%" height={120} count={4} />
      </div>
      <div className="skeleton-main">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
