"use client";

import { Pencil, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { cn } from "@/utils/cn";

interface AvatarUploadProps {
  value?: string | File | null;
  onChange?: (file: File | null) => void;
  className?: string;
}

export function UserImageUpload({
  value,
  onChange,
  className,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === "string") {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onChange) {
      onChange(file);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("relative flex flex-col items-center gap-4", className)}>
      <div className="group relative">
        <div
          className="flex size-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-50 transition-colors hover:border-slate-300"
          onClick={onButtonClick}
        >
          <Avatar className="size-full object-contain">
            <AvatarImage src={preview ?? undefined} alt="Profile preview" />
            <AvatarFallback>
              <User className="size-16 text-slate-300" />
            </AvatarFallback>
            <AvatarBadge>
              <Pencil />
            </AvatarBadge>
          </Avatar>
        </div>

        <button
          type="button"
          onClick={onButtonClick}
          className="absolute right-1 bottom-1 flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-sm transition-colors hover:bg-slate-800"
          aria-label="Upload image"
        >
          <Pencil className="size-4" />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <p className="text-xs font-medium text-slate-500">
        Click to update profile photo
      </p>
    </div>
  );
}
