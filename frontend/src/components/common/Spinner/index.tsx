import { Loader2 } from "lucide-react";
import React from "react";

const Spinner = ({ className = "w-6 h-6" }: { className?: string }) => {
  return (
    <div
      className={`absolute flex h-full w-full items-center justify-center ${className}`}
    >
      <Loader2 className="size-5 animate-spin text-gray-500" />
    </div>
  );
};

export default Spinner;
