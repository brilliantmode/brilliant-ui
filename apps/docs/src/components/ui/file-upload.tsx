// biome-ignore-all lint/style/useTemplate: Concatenation keeps this copied source safe to serialize in the registry.

"use client";

import type { ButtonHTMLAttributes, ChangeEvent, DragEvent, HTMLAttributes } from "react";
import { createContext, useContext, useId, useRef, useState } from "react";

type ProgressByName = Readonly<Record<string, number>>;

interface FileUploadContextValue {
  disabled: boolean;
  error: string | null;
  files: readonly File[];
  inputId: string;
  openPicker: () => void;
  progress: ProgressByName;
  removeFile: (file: File) => void;
  selectFiles: (files: FileList | readonly File[]) => void;
}

const FileUploadContext = createContext<FileUploadContextValue | null>(null);

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useFileUpload() {
  const context = useContext(FileUploadContext);
  if (!context) throw new Error("File Upload parts must be rendered inside <FileUpload>.");
  return context;
}

function fileKey(file: File) {
  return [file.name, file.size, file.lastModified].join("-");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(",").some((rawType) => {
    const type = rawType.trim().toLowerCase();
    if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
    if (type.endsWith("/*")) return file.type.startsWith(type.slice(0, -1));
    return file.type === type;
  });
}

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  accept?: string;
  capture?: "environment" | "user";
  defaultFiles?: readonly File[];
  disabled?: boolean;
  files?: readonly File[];
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  name?: string;
  onFilesChange?: (files: readonly File[]) => void;
  progress?: ProgressByName;
}

export function FileUpload({
  accept,
  capture,
  children,
  className = "",
  defaultFiles = [],
  disabled = false,
  files: controlledFiles,
  maxFiles = 1,
  maxSize = Number.POSITIVE_INFINITY,
  multiple = false,
  name,
  onFilesChange,
  progress = {},
  ...props
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = useState<readonly File[]>(defaultFiles);
  const [error, setError] = useState<string | null>(null);
  const files = controlledFiles ?? internalFiles;

  const commitFiles = (nextFiles: readonly File[]) => {
    if (controlledFiles === undefined) setInternalFiles(nextFiles);
    onFilesChange?.(nextFiles);
  };

  const selectFiles = (incoming: FileList | readonly File[]) => {
    if (disabled) return;
    const candidates = Array.from(incoming);
    const invalidType = candidates.find((file) => !matchesAccept(file, accept));
    const oversized = candidates.find((file) => file.size > maxSize);

    if (invalidType) {
      setError(invalidType.name + " is not an accepted file type.");
      return;
    }
    if (oversized) {
      setError(oversized.name + " exceeds the " + formatBytes(maxSize) + " limit.");
      return;
    }

    const merged = multiple ? [...files, ...candidates] : candidates.slice(0, 1);
    const unique = merged.filter(
      (file, index, allFiles) =>
        allFiles.findIndex((item) => fileKey(item) === fileKey(file)) === index,
    );

    if (unique.length > maxFiles) {
      setError("Choose no more than " + maxFiles + " " + (maxFiles === 1 ? "file" : "files") + ".");
      return;
    }

    setError(null);
    commitFiles(unique);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (file: File) => {
    setError(null);
    commitFiles(files.filter((item) => fileKey(item) !== fileKey(file)));
  };

  return (
    <FileUploadContext.Provider
      value={{
        disabled,
        error,
        files,
        inputId,
        openPicker: () => inputRef.current?.click(),
        progress,
        removeFile,
        selectFiles,
      }}
    >
      <div className={cx("grid gap-3", className)} data-disabled={disabled || undefined} {...props}>
        <input
          accept={accept}
          capture={capture}
          className="sr-only"
          disabled={disabled}
          id={inputId}
          multiple={multiple}
          name={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) selectFiles(event.target.files);
            event.target.value = "";
          }}
          ref={inputRef}
          type="file"
        />
        {children}
      </div>
    </FileUploadContext.Provider>
  );
}

export function FileUploadDropzone({
  className = "",
  disabled: disabledProp = false,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { disabled, openPicker, selectFiles } = useFileUpload();
  const [dragging, setDragging] = useState(false);
  const isDisabled = disabled || disabledProp;

  return (
    <button
      className={cx(
        "group grid min-h-40 w-full place-items-center rounded-[0.5rem] border border-dashed border-border bg-surface px-6 py-8 text-center",
        "hover:border-foreground/35 hover:bg-muted/45 active:scale-[0.997] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5 data-[dragging=true]:shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--brilliant-primary)_22%,transparent)]",
        "motion-safe:transition-[background-color,border-color,box-shadow,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      data-dragging={dragging}
      disabled={isDisabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) openPicker();
      }}
      onDragEnter={(event: DragEvent<HTMLButtonElement>) => {
        onDragEnter?.(event);
        if (!event.defaultPrevented) setDragging(true);
      }}
      onDragLeave={(event: DragEvent<HTMLButtonElement>) => {
        onDragLeave?.(event);
        if (!event.defaultPrevented && !event.currentTarget.contains(event.relatedTarget as Node)) {
          setDragging(false);
        }
      }}
      onDragOver={(event: DragEvent<HTMLButtonElement>) => {
        onDragOver?.(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }
      }}
      onDrop={(event: DragEvent<HTMLButtonElement>) => {
        onDrop?.(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          setDragging(false);
          selectFiles(event.dataTransfer.files);
        }
      }}
      type={type}
      {...props}
    />
  );
}

export function FileUploadIcon({
  children = "↑",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "mb-3 grid size-10 place-items-center rounded-full bg-primary/10 text-lg font-medium text-primary",
        "group-data-[dragging=true]:-translate-y-0.5 group-data-[dragging=true]:scale-105 motion-safe:transition-transform motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transform-none motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function FileUploadTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("text-sm font-medium text-foreground", className)} {...props} />;
}

export function FileUploadDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("mt-1 text-xs leading-5 text-muted-foreground", className)} {...props} />;
}

export function FileUploadTrigger({
  className = "",
  disabled: disabledProp = false,
  onClick,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { disabled, openPicker } = useFileUpload();
  const isDisabled = disabled || disabledProp;
  return (
    <button
      className={cx(
        "inline-flex h-8 items-center justify-center rounded-[0.25rem] border border-border bg-surface px-3 text-xs font-medium text-foreground shadow-sm",
        "hover:bg-muted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        "motion-safe:transition-[background-color,transform] motion-safe:duration-[var(--brilliant-duration-fast)] motion-reduce:transition-none",
        className,
      )}
      disabled={isDisabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) openPicker();
      }}
      type={type}
      {...props}
    />
  );
}

export function FileUploadList({ className = "", ...props }: HTMLAttributes<HTMLUListElement>) {
  const { disabled, files, progress, removeFile } = useFileUpload();
  if (files.length === 0) return null;

  return (
    <ul aria-label="Selected files" className={cx("grid gap-2", className)} {...props}>
      {files.map((file) => {
        const value = progress[file.name];
        const hasProgress = typeof value === "number";
        const clampedProgress = hasProgress ? Math.min(100, Math.max(0, value)) : 0;

        return (
          <li
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-[0.375rem] border border-border bg-surface px-3 py-2.5 motion-safe:animate-enter motion-reduce:animate-none"
            key={fileKey(file)}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">
                {file.name}
              </span>
              <span className="block text-xs text-muted-foreground">{formatBytes(file.size)}</span>
            </span>
            <button
              aria-label={"Remove " + file.name}
              className="grid size-8 place-items-center rounded-[0.25rem] text-muted-foreground hover:bg-muted hover:text-foreground active:scale-[0.96] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              disabled={disabled}
              onClick={() => removeFile(file)}
              type="button"
            >
              ×
            </button>
            {hasProgress ? (
              <span
                aria-label={file.name + " upload progress"}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={clampedProgress}
                className="col-span-2 h-1 overflow-hidden rounded-full bg-muted"
                role="progressbar"
              >
                <span
                  className="block h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-[var(--brilliant-duration-normal)] motion-reduce:transition-none"
                  style={{ width: clampedProgress + "%" }}
                />
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function FileUploadError({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  const { error } = useFileUpload();
  if (!error) return null;
  return (
    <p className={cx("text-xs font-medium text-critical", className)} role="alert" {...props}>
      {error}
    </p>
  );
}
