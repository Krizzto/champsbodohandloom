import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  }[size];

  const variantStyles = {
    primary: 'bg-[#171513] text-[#FAF8F5] hover:bg-[#2C2825] focus:ring-[#171513] shadow-xs',
    secondary: 'bg-[#F4EFE6] text-[#171513] hover:bg-[#EAE2D5] focus:ring-[#8B2635] border border-[#171513]/10',
    outline: 'bg-transparent text-[#171513] hover:bg-[#FAF8F5] border border-stone-300 focus:ring-[#171513]',
    ghost: 'bg-transparent text-stone-700 hover:bg-stone-100 hover:text-black focus:ring-stone-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-xs',
    accent: 'bg-[#FFE600] text-[#171513] hover:bg-[#FFF04D] focus:ring-[#FFE600] font-bold shadow-sm'
  }[variant];

  const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'active:scale-98';

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
