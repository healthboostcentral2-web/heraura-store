import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-4 rounded-2xl font-sans text-sm font-bold tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-50";
  
  const variants = {
    primary: "bg-stone-900 text-white shadow-lg shadow-stone-200 hover:bg-stone-800",
    secondary: "bg-rose-100 text-stone-900 hover:bg-rose-200",
    outline: "border-2 border-stone-200 text-stone-900 hover:border-stone-900 bg-transparent",
    ghost: "bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};