"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { FlexColumn } from "@/components/ui/layouts";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  placeholder: string;
  value: string;
  options?: DropdownOption[];
  disabled?: boolean;
  onValueChange: (value: string) => void;
}

export default function Dropdown({
  label,
  placeholder,
  value,
  options = [],
  disabled = false,
  onValueChange,
}: DropdownProps) {
  return (
    <FlexColumn className="gap-1.5">
      <p className="text-xs text-gray-700">{label}</p>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-60" position="popper">
          {options.map((option) => (
            <SelectItem key={option.value} className="p-2" value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FlexColumn>
  );
}
