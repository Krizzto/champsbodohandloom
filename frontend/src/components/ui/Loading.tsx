import React from 'react';

export interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading cultural archive...',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center">
      <div className={`${sizeClasses} border-stone-300 border-t-[#8B2635] rounded-full animate-spin`} />
      {message && <p className="text-xs text-stone-600 font-editorial tracking-wide">{message}</p>}
    </div>
  );
};
