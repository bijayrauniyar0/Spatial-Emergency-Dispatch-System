import { ChangeEvent, useEffect, useState } from "react";

interface UseDebouncedInputOptions {
  init?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  ms?: number;
}

export default function useDebouncedInput({
  init = "",
  onChange,
  ms = 500,
}: UseDebouncedInputOptions = {}) {
  const [value, setValue] = useState(init);
  const [debouncedValue, setDebouncedValue] = useState(init);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, ms);

    return () => clearTimeout(handler);
  }, [value, ms]);

  const handleDebouncedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  return [debouncedValue, handleDebouncedChange, setValue] as const;
}
