import { Button } from './Button';
import './EmptyState.css';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'default' | 'search' | 'inbox' | 'error';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  illustration = 'default',
}: EmptyStateProps): JSX.Element {
  const illustrations = {
    default: (
      <div className="empty-illustration">
        <div className="empty-circle">
          <div className="empty-circle-inner"></div>
        </div>
      </div>
    ),
    search: (
      <div className="empty-illustration">
        <div className="empty-search">
          <div className="search-icon">🔍</div>
        </div>
      </div>
    ),
    inbox: (
      <div className="empty-illustration">
        <div className="empty-inbox">
          <div className="inbox-icon">📭</div>
        </div>
      </div>
    ),
    error: (
      <div className="empty-illustration">
        <div className="empty-error">
          <div className="error-icon">⚠️</div>
        </div>
      </div>
    ),
  };

  return (
    <div className="empty-state">
      {icon ? (
        <div className="empty-icon">{icon}</div>
      ) : (
        illustrations[illustration]
      )}

      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>

      {action && (
        <div className="empty-action">
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
