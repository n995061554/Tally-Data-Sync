import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // duration in ms
}

interface ToastCardProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onClose }) => {
  const { id, type, title, message, duration = 5000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // Color mappings
  const typeStyles = {
    success: {
      border: 'border-emerald-500/30',
      bg: 'bg-slate-900/95 shadow-emerald-950/10',
      icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
      progressBar: 'bg-emerald-500',
      text: 'text-emerald-400',
    },
    error: {
      border: 'border-rose-500/30',
      bg: 'bg-slate-900/95 shadow-rose-950/10',
      icon: <AlertCircle className="h-5 w-5 text-rose-400" />,
      progressBar: 'bg-rose-500',
      text: 'text-rose-400',
    },
    warning: {
      border: 'border-amber-500/30',
      bg: 'bg-slate-900/95 shadow-amber-950/10',
      icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
      progressBar: 'bg-amber-500',
      text: 'text-amber-400',
    },
    info: {
      border: 'border-sky-500/30',
      bg: 'bg-slate-900/95 shadow-sky-950/10',
      icon: <Info className="h-5 w-5 text-sky-400" />,
      progressBar: 'bg-sky-500',
      text: 'text-sky-400',
    },
  };

  const style = typeStyles[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(3px)', transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative w-full max-w-sm overflow-hidden rounded-xl border ${style.border} ${style.bg} p-4 shadow-xl backdrop-blur-md`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
        <div className="flex-1 min-w-0 pr-2">
          <h5 className="text-sm font-semibold text-slate-100 tracking-tight leading-none mb-1">
            {title}
          </h5>
          <p className="text-xs text-slate-400 leading-relaxed break-words font-medium">
            {message}
          </p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors duration-150 focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {/* Progress timer bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-800">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-full ${style.progressBar}`}
        />
      </div>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0">
      <div className="flex flex-col gap-3 w-full pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onClose={onClose} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
