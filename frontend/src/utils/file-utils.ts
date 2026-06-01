export const getFileExtension = (file: File | string): string => {
  if (typeof file === "string") {
    return file.split(".").pop()?.toLowerCase() || "";
  }
  return file.name.split(".").pop()?.toLowerCase() || "";
};

export const getFileType = (file: File | string): string => {
  if (file instanceof File) {
    return file.type;
  }
  const ext = getFileExtension(file);
  const mimeMap: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    csv: "text/csv",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    json: "application/json",
    geojson: "application/geo+json",
  };
  return mimeMap[ext] || "";
};

export const isImage = (file: File | string): boolean => {
  const type = getFileType(file);
  return type.startsWith("image/");
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileName = (file: File | string): string => {
  if (typeof file === "string") {
    return file.split("/").pop() || file;
  }
  return file.name;
};
