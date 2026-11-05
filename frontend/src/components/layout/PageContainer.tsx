import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  fullWidth = false
}) => {
  return (
    <div className={`w-full ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} ${className}`}>
      {children}
    </div>
  );
};
