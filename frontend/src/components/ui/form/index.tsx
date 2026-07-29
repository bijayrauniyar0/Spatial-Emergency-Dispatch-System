import React, {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
>(({ label, error, className = "", ...props }, ref) => (
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

export const Label = React.forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }
>(({ children, className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={`mb-1 block text-sm font-medium text-gray-700 ${className}`}
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
      className={`text-primary focus:ring-primary h-4 w-4 rounded border-gray-300 ${className}`}
      {...props}
    />
    {label && (
      <label className="ml-2 block text-sm text-gray-700">{label}</label>
    )}
  </div>
));

Checkbox.displayName = "Checkbox";
