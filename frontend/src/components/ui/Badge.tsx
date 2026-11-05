import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'amber' | 'rose' | 'emerald' | 'cyan' | 'dark' | 'yellow';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-stone-100 text-stone-800 border-stone-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-200',
    rose: 'bg-rose-50 text-rose-900 border-rose-200',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    cyan: 'bg-cyan-50 text-cyan-900 border-cyan-200',
    dark: 'bg-[#171513] text-[#FAF8F5] border-[#171513]',
    yellow: 'bg-[#FFE600]/20 text-[#171513] border-[#FFE600]'
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border select-none ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
