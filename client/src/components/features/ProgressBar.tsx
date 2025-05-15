import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showValue = false,
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  // Ensure value is within bounds
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };
  
  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };
  
  return (
    <div className={className}>
      <div className={`overflow-hidden rounded-full bg-neutral-200 ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} h-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <p className="mt-1 text-xs text-neutral-600">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
};

export default ProgressBar;