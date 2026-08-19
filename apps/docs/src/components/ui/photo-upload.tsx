// biome-ignore-all lint/style/useTemplate: Concatenation keeps this copied source safe to serialize in the registry.

"use client";

import type { HTMLAttributes } from "react";
import { useEffect, useState } from "react";
import {
  FileUpload,
  FileUploadDescription,
  FileUploadDropzone,
  FileUploadError,
  FileUploadIcon,
  FileUploadTitle,
  FileUploadTrigger,
} from "./file-upload";
import { Photo, PhotoFallback, PhotoImage } from "./photo";

export interface PhotoUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  accept?: string;
  alt?: string;
  capture?: "environment" | "user";
  crop?: "circle" | "rectangle" | "square";
  defaultFile?: File | null;
  disabled?: boolean;
  file?: File | null;
  maxSize?: number;
  onFileChange?: (file: File | null) => void;
  onRemove?: () => void;
  progress?: number;
  ratio?: number | string;
  src?: string;
}

export function PhotoUpload({
  accept = "image/jpeg,image/png,image/webp",
  alt = "Selected photo preview",
  capture,
  className = "",
  crop = "square",
  defaultFile = null,
  disabled = false,
  file: controlledFile,
  maxSize = 5 * 1024 * 1024,
  onFileChange,
  onRemove,
  progress,
  ratio = 4 / 3,
  src,
  ...props
}: PhotoUploadProps) {
  const [internalFile, setInternalFile] = useState<File | null>(defaultFile);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sourceRemoved, setSourceRemoved] = useState(false);
  const file = controlledFile === undefined ? internalFile : controlledFile;

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  useEffect(() => {
    setSourceRemoved(false);
  }, [src]);

  const commitFile = (nextFile: File | null) => {
    if (controlledFile === undefined) setInternalFile(nextFile);
    setSourceRemoved(nextFile === null);
    onFileChange?.(nextFile);
  };

  const removePhoto = () => {
    commitFile(null);
    onRemove?.();
  };

  const displaySrc = previewUrl ?? (sourceRemoved ? undefined : src);
  const hasProgress = typeof progress === "number";
  const clampedProgress = hasProgress ? Math.min(100, Math.max(0, progress)) : 0;

  return (
    <FileUpload
      accept={accept}
      className={className}
      disabled={disabled}
      files={file ? [file] : []}
      maxFiles={1}
      maxSize={maxSize}
      onFilesChange={(files) => commitFile(files[0] ?? null)}
      {...(capture ? { capture } : {})}
      {...props}
    >
      {displaySrc ? (
        <Photo
          className="group w-full"
          crop={crop}
          radius={crop === "circle" ? "full" : "md"}
          ratio={ratio}
          variant="surface"
        >
          <PhotoFallback>Photo preview unavailable</PhotoFallback>
          <PhotoImage alt={alt} src={displaySrc} />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 motion-safe:transition-opacity motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none"
          />
          <div className="absolute inset-x-3 bottom-3 grid gap-2">
            <div className="flex translate-y-1 items-center justify-end gap-2 opacity-100 motion-safe:transition-[opacity,transform] motion-safe:duration-[var(--brilliant-duration-fast)] sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 motion-reduce:transform-none motion-reduce:transition-none">
              <FileUploadTrigger className="border-transparent bg-background/92 shadow-sm backdrop-blur hover:bg-background">
                Replace
              </FileUploadTrigger>
              <button
                className="inline-flex h-8 items-center justify-center rounded-[0.25rem] bg-background/92 px-3 text-xs font-medium text-critical shadow-sm backdrop-blur hover:bg-background active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                disabled={disabled}
                onClick={removePhoto}
                type="button"
              >
                Remove
              </button>
            </div>
            {hasProgress ? (
              <span
                aria-label="Photo upload progress"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={clampedProgress}
                className="h-1 overflow-hidden rounded-full bg-background/35 backdrop-blur"
                role="progressbar"
              >
                <span
                  className="block h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-[var(--brilliant-duration-normal)] motion-reduce:transition-none"
                  style={{ width: clampedProgress + "%" }}
                />
              </span>
            ) : null}
          </div>
        </Photo>
      ) : (
        <FileUploadDropzone className="min-h-56">
          <span>
            <FileUploadIcon>
              <svg
                aria-hidden="true"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                viewBox="0 0 24 24"
              >
                <path d="M4 8.5h3l1.5-2h7l1.5 2h3v9.5H4V8.5Z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </FileUploadIcon>
            <FileUploadTitle>Drop a photo here or click to browse</FileUploadTitle>
            <FileUploadDescription>JPEG, PNG, or WebP up to 5 MB.</FileUploadDescription>
          </span>
        </FileUploadDropzone>
      )}
      <FileUploadError />
    </FileUpload>
  );
}
