import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

type RiskLevel = 'high' | 'medium' | 'low' | 'none';

interface RiskIndicatorProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const getConfig = () => {
    switch (level?.toLowerCase()) {
      case 'high':
        return {
          icon: <AlertCircle />,
          color: 'text-error-500',
          bgColor: 'bg-error-50',
          label: 'High Risk',
        };
      case 'medium':
        return {
          icon: <AlertTriangle />,
          color: 'text-warning-500',
          bgColor: 'bg-warning-50',
          label: 'Medium Risk',
        };
      case 'low':
        return {
          icon: <AlertTriangle />,
          color: 'text-secondary-500',
          bgColor: 'bg-secondary-50',
          label: 'Low Risk',
        };
      case 'none':
        return {
          icon: <CheckCircle />,
          color: 'text-success-500',
          bgColor: 'bg-success-50',
          label: 'No Risk',
        };
      default:
        return null;
    }
  };

  const config = getConfig();
  if (!config) return null;

  const { icon, color, bgColor, label } = config;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${bgColor} ${sizeClasses[size]} ${className}`}
    >
      <span className={`${color} ${iconSizes[size]}`}>{icon}</span>
      {showLabel && <span className={`font-medium ${color}`}>{label}</span>}
    </div>
  );
};

export default RiskIndicator;
