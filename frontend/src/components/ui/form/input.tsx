import React, { InputHTMLAttributes } from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: string; label?: string }
>(({ error, label, className = "", ...props }, ref) => (
  <div className="w-full">
    {label && <label className="mb-1 block text-sm font-medium">{label}</label>}
    <input
      ref={ref}
      className={`focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none ${
        error ? "border-red-500" : "border-gray-300"
      } ${className}`}
      {...props}
    />
    {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
  </div>
));

Input.displayName = "Input";
