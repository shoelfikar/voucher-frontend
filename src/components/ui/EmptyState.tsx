import type { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon ? (
        <div className="mb-4 text-text-muted">{icon}</div>
      ) : (
        <svg
          className="w-16 h-16 mb-4 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )}

      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-text-secondary mb-4 max-w-sm">{description}</p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" size="medium" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
