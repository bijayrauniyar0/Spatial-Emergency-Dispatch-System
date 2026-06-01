import React, { InputHTMLAttributes } from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: string; label?: string }
>(({ error, label, className = "", ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium mb-1">{label}</label>}
    <input
      ref={ref}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
        error ? "border-red-500" : "border-gray-300"
      } ${className}`}
      {...props}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
));

Input.displayName = "Input";
