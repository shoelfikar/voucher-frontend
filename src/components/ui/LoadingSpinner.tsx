import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton' | 'dots';
}

export function LoadingSpinner({ size = 'md', variant = 'spinner' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (variant === 'spinner') {
    return (
      <svg
        className={clsx('animate-spin text-primary', sizes[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex space-x-2">
        <div className={clsx('rounded-full bg-primary animate-bounce', sizes[size])} style={{ animationDelay: '0ms' }} />
        <div className={clsx('rounded-full bg-primary animate-bounce', sizes[size])} style={{ animationDelay: '150ms' }} />
        <div className={clsx('rounded-full bg-primary animate-bounce', sizes[size])} style={{ animationDelay: '300ms' }} />
      </div>
    );
  }

  // Skeleton
  return (
    <div className="space-y-3">
      <div className="h-4 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
      <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
    </div>
  );
}
