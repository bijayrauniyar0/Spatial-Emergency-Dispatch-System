"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { InputHTMLAttributes, useState } from "react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium">{label}</label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`focus:ring-primary w-full rounded-md border px-3 py-2 pr-10 focus:ring-2 focus:outline-none ${
              error ? "border-red-500" : "border-gray-300"
            } ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2.5 right-3 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
