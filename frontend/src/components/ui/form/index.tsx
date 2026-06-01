import React, { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
>(({ label, error, className = "", ...props }, ref) => (
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

export const Label = React.forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }
>(({ children, className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    {...props}
  >
    {children}
  </label>
));

Label.displayName = "Label";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string }
>(({ label, className = "", ...props }, ref) => (
  <div className="flex items-center">
    <input
      ref={ref}
      type="checkbox"
      className={`w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary ${className}`}
      {...props}
    />
    {label && (
      <label className="ml-2 block text-sm text-gray-700">{label}</label>
    )}
  </div>
));

Checkbox.displayName = "Checkbox";
