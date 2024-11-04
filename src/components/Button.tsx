import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-xl font-semibold transition-all duration-200';
  const variants = {
    primary: 'bg-[#23395b] text-white hover:bg-white hover:text-[#23395b] hover:border-2 hover:border-[#23395b]',
    secondary: 'border-2 border-[#23395b] text-[#23395b] hover:bg-[#23395b] hover:text-white',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${
        isLoading ? 'opacity-75 cursor-not-allowed' : ''
      } ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}