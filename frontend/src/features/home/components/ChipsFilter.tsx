"use client";

import { Flame, Heart, Shield } from "lucide-react";

import { cn } from "@/lib/utils";

import { type StationCategory, useHomeStore } from "../store/homeStore";

const CHIP_OPTIONS: {
  label: string;
  value: StationCategory;
  icon: React.ReactNode;
}[] = [
  {
    label: "Police",
    value: "POLICE",
    icon: <Shield className="h-3.5 w-3.5" />,
  },
  {
    label: "Fire",
    value: "FIRE",
    icon: <Flame className="h-3.5 w-3.5" />,
  },
  {
    label: "Medical",
    value: "MEDICAL",
    icon: <Heart className="h-3.5 w-3.5" />,
  },
];

export const ChipsFilter: React.FC = () => {
  const { selectedCategories, toggleCategory } = useHomeStore();
  return (
    <div className="absolute top-4 left-1/2 z-50 flex -translate-x-1/2 flex-wrap gap-2">
      {CHIP_OPTIONS.map((option) => {
        const isSelected = selectedCategories.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => toggleCategory(option.value)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium shadow-lg",
              "transition-all",
              isSelected
                ? "border-primary text-primary bg-white"
                : "bg-white text-gray-700 hover:bg-gray-50",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
