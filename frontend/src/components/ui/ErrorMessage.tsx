import React from "react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  if (!message) return null;

  return (
    <p className={`text-red-500 text-sm font-medium ${className}`}>
      {message}
    </p>
  );
};

export default ErrorMessage;
