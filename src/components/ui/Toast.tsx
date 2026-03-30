'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType, duration: number = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type, duration };
    
    setToasts((prev) => {
      const updated = [...prev, newToast];
      return updated.slice(-maxToasts);
    });
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, [maxToasts]);

  const success = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  const styles = {
    success: 'bg-success-50 text-success-900 border-success-200',
    error: 'bg-danger-50 text-danger-900 border-danger-200',
    warning: 'bg-warning-50 text-warning-900 border-warning-200',
    info: 'bg-info-50 text-info-900 border-info-200',
  };

  const iconColors = {
    success: 'text-success-600',
    error: 'text-danger-600',
    warning: 'text-warning-600',
    info: 'text-info-600',
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div className={`fixed ${positions[position]} z-50 space-y-2 min-w-[320px] max-w-md`}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-medium backdrop-blur-sm animate-slide-in-right ${styles[toast.type]}`}
          >
            <span className={`flex-shrink-0 ${iconColors[toast.type]}`}>
              {icons[toast.type]}
            </span>
            <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
