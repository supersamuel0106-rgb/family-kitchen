import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-full';
  
  const variants = {
    primary: 'bg-gradient-to-br from-primary to-primary-container text-white shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-white shadow-lg shadow-secondary/20',
    outline: 'border-2 border-primary text-primary bg-transparent',
    ghost: 'bg-surface-container-high text-on-surface'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
