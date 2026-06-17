import React from 'react';
import { cn } from './Button';
import { motion } from 'framer-motion';

export function Card({ className, children, hover = false, ...props }) {
  return (
    <motion.div 
      className={cn(
        "bg-[#151516] rounded-3xl overflow-hidden",
        hover && "transition-transform duration-300 hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }) {
  return <h3 className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props}>{children}</h3>;
}

export function CardContent({ className, children, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>;
}
