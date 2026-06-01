"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  debounce?: number;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  label,
  debounce = 150,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setInputValue(next);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(next), debounce);
  }

  const ariaLabel = label ?? placeholder;

  return (
    <div
      role="search"
      className={cn(
        "bg-muted flex items-center gap-2 rounded-lg px-3 py-2",
        "focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-1",
        className,
      )}
    >
      <Search
        size={16}
        className="text-foreground shrink-0"
        aria-hidden="true"
      />
      <input
        type="search"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm focus:outline-none"
      />
    </div>
  );
}
