import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  
  const variants = {
    primary: "bg-[var(--color-apple-blue)] text-white hover:bg-[var(--color-apple-blue-hover)] shadow-soft",
    secondary: "bg-[#1c1c1e] text-white hover:bg-[#2c2c2e] border border-white/10 shadow-sm",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-soft",
    ghost: "hover:bg-white/10 hover:text-white text-gray-400",
    link: "bg-transparent text-[var(--color-apple-blue)] hover:text-[var(--color-apple-blue-hover)] p-0 h-auto font-medium"
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-lg",
    lg: "h-11 px-8 rounded-2xl",
    link: "p-0"
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
});
Button.displayName = "Button";
