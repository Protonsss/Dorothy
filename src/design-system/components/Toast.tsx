import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  showToast: (config: Omit<ToastConfig, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = useCallback(
    (config: Omit<ToastConfig, 'id'>): void => {
      const id = Math.random().toString(36).substring(7);
      const toast: ToastConfig = {
        ...config,
        id,
        duration: config.duration ?? 5000,
      };

      setToasts(prev => [...prev, toast]);

      if (toast.duration) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, toast.duration);
      }
    },
    []
  );

  const dismissToast = useCallback((id: string): void => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {createPortal(
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

function Toast({
  id,
  type,
  message,
  description,
  action,
  onDismiss,
}: ToastConfig & { onDismiss: (id: string) => void }): JSX.Element {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-content">
        <div className="toast-message">{message}</div>
        {description && <div className="toast-description">{description}</div>}
      </div>
      {action && (
        <button className="toast-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      <button
        className="toast-close"
        onClick={(): void => onDismiss(id)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
