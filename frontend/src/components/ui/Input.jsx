import React from 'react';
import { cn } from './Button';

export const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-2 text-sm text-white transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-gray-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2997ff]/50 focus-visible:border-[#2997ff]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500/50 focus-visible:border-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";

export const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <select
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-2 text-sm text-white transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2997ff]/50 focus-visible:border-[#2997ff]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500/50 focus-visible:border-red-500",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    </div>
  );
});
Select.displayName = "Select";

export const Label = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block text-gray-400", className)}
      {...props}
    >
      {children}
    </label>
  );
});
Label.displayName = "Label";
