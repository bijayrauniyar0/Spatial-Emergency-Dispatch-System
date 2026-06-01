import {
  AlertCircle,
  Code,
  Download,
  FileEdit,
  FileIcon,
  FileText,
  Globe,
  Table,
  Trash2,
  UploadCloud,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { FlexRow } from "@/components/ui/layouts";
import { cn } from "@/utils/cn";
import {
  formatFileSize,
  getFileName,
  getFileType,
  isImage,
} from "@/utils/file-utils";
import { triggerDownload } from "@/utils/trigger-download";

interface FileUploaderProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // In MB
  className?: string;
}

interface FilePreviewProps {
  file: File | string;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileName = getFileName(file);
  const fileType = getFileType(file);
  const isLocal = file instanceof File;

  useEffect(() => {
    if (isLocal && isImage(file)) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof file === "string" && isImage(file)) {
      setPreviewUrl(file);
    }
  }, [file, isLocal]);

  const handleDownload = async () => {
    if (typeof file === "string") {
      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        triggerDownload(blob, fileName);
        return;
      } catch (error) {
        console.error("Download failed:", error);
        return;
      }
    } else {
      triggerDownload(file, file.name);
    }
  };

  const renderIcon = () => {
    if (previewUrl) {
      return (
        <img
          src={previewUrl}
          alt={fileName}
          className="h-10 w-10 rounded object-cover shadow-sm"
          onError={() => setPreviewUrl(null)}
        />
      );
    }

    const iconProps = { className: "w-6 h-6 text-gray-400" };

    if (fileType.includes("pdf")) return <FileText {...iconProps} />;
    if (fileType.includes("word") || fileType.includes("msword"))
      return <FileEdit {...iconProps} />;
    if (
      fileType.includes("excel") ||
      fileType.includes("sheet") ||
      fileType.includes("csv")
    )
      return <Table {...iconProps} />;
    if (fileType.includes("geo+json")) return <Globe {...iconProps} />;
    if (fileType.includes("json")) return <Code {...iconProps} />;

    return <FileIcon {...iconProps} />;
  };

  return (
    <div className="flex items-center gap-1">
      <Item variant="outline" size="sm">
        <>
          <ItemMedia>{renderIcon()}</ItemMedia>
          <ItemContent>
            <ItemTitle> {fileName}</ItemTitle>
            <ItemDescription>
              {isLocal ? formatFileSize(file.size) : "External File"}
            </ItemDescription>
          </ItemContent>
          <FlexRow className="items-center gap-2">
            <ItemActions className="group">
              <Download
                onClick={handleDownload}
                className="group-hover:text-primary size-5 transition-colors duration-150 ease-in"
              />
            </ItemActions>
            <ItemActions className="group">
              <Trash2
                onClick={onRemove}
                className="text-destructive-foreground group-hover:text-destructive size-5 transition-colors duration-150 ease-in"
              />
            </ItemActions>
          </FlexRow>
        </>
      </Item>
    </div>
  );
};

const FileUploader = <T extends FieldValues>({
  name,
  control,
  label,
  multiple = false,
  accept,
  maxSize,
  className,
}: FileUploaderProps<T>) => {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  let files: (File | string)[] = [];

  if (Array.isArray(value)) {
    files = value;
  } else if (value) {
    files = [value];
  }
  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB`;
    }

    if (accept) {
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileName.endsWith(type.toLowerCase());
        }
        if (type.endsWith("/*")) {
          return fileType.startsWith(type.replace("/*", ""));
        }
        return fileType === type;
      });

      if (!isAccepted) {
        return `File type not supported. Accepted: ${accept}`;
      }
    }
    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validNewFiles: File[] = [];
    let validationError: string | null = null;

    Array.from(newFiles).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        validationError = error;
      } else {
        validNewFiles.push(file);
      }
    });

    if (validationError) {
      // We could use RHF setError here if needed,
      // but for now let's just show local error or rely on validation
      alert(validationError); // Simple alert for now, can be improved
      return;
    }

    if (multiple) {
      onChange([...files, ...validNewFiles]);
    } else {
      onChange(validNewFiles[0] || null);
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, multiple, onChange],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(multiple ? updatedFiles : null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={handleClick}
        className={cn(
          "relative flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200",
          "hover:border-primary",
          isDragging
            ? "animate-pulse border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50/50",
          error ? "border-red-400 bg-red-50/30" : "border-dashed",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          onBlur={onBlur}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full border border-gray-100 bg-white p-3 shadow-sm">
            <UploadCloud
              className={cn(
                "h-6 w-6",
                isDragging ? "text-blue-500" : "text-gray-400",
              )}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {isDragging
                ? "Drop files here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {accept ? `Supported: ${accept}` : "Any file"}
              {maxSize ? ` (Max: ${maxSize}MB)` : ""}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="animate-in fade-in slide-in-from-top-1 mt-1 flex items-center gap-2 text-xs text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error.message}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3">
          {files.map((file, index) => (
            <FilePreview
              key={typeof file === "string" ? file : `${file.name}-${index}`}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { FilePreview, FileUploader };
