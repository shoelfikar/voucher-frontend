import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description: string | ReactNode;
  onClose?: () => void;
}

export function Alert({ variant = 'info', title, description, onClose }: AlertProps) {
  const variants = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      titleText: 'text-green-800',
      descText: 'text-green-700',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      titleText: 'text-red-800',
      descText: 'text-red-700',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      titleText: 'text-yellow-800',
      descText: 'text-yellow-700',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      titleText: 'text-blue-800',
      descText: 'text-blue-700',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  };

  const { bg, border, titleText, descText, icon: Icon, iconColor } = variants[variant];

  return (
    <div className={clsx('border rounded-2xl p-6 flex items-start gap-4', bg, border)}>
      <Icon className={clsx('w-7 h-7 flex-shrink-0', iconColor)} />
      <div className="flex-1">
        <h4 className={clsx('text-lg font-semibold mb-1', titleText)}>{title}</h4>
        <p className={clsx('text-sm', descText)}>{description}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={clsx('flex-shrink-0 hover:opacity-75 transition-opacity', iconColor)}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
