import { Component } from 'solid-js';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  class?: string;
}

const LoadingSpinner: Component<LoadingSpinnerProps> = (props) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const size = props.size || 'md';

  return (
    <div class={`flex items-center justify-center gap-2 ${props.class || ''}`}>
      <div class={`${sizeClasses[size]} animate-spin`}>
        <svg class="w-full h-full text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle 
            class="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="4"
          />
          <path 
            class="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {props.text && (
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {props.text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
