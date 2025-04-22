"use client";

import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload, X, File, CheckCircle2 } from "lucide-react";
import { Button } from "./button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Progress } from "./progress";

interface FileUploadStatus {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileDropperProps {
  onFileSelect: (files: File[]) => void;
  value?: File | File[];
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  className?: string;
  maxFiles?: number;
}

export function FileDropper({
  onFileSelect,
  value,
  accept = {},
  multiple = true,
  maxSize = 5242880, // 5MB
  maxFiles = 10,
  className,
}: FileDropperProps) {
  const [error, setError] = useState<string>("");
  const [fileStatuses, setFileStatuses] = useState<Map<string, FileUploadStatus>>(new Map());

  const files = useMemo(() => (Array.isArray(value) ? value : value ? [value] : []), [value]);

  const simulateUpload = (file: File) => {
    const fileId = `${file.name}-${file.size}`;
    setFileStatuses(prev => new Map(prev).set(fileId, { progress: 0, status: 'uploading' }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFileStatuses(prev => new Map(prev).set(fileId, { progress: 100, status: 'completed' }));
      } else {
        setFileStatuses(prev => new Map(prev).set(fileId, { progress, status: 'uploading' }));
      }
    }, 500);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError("");
      const newFiles = [...files, ...acceptedFiles];
      if (newFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      acceptedFiles.forEach(file => simulateUpload(file));
      onFileSelect(newFiles);
    },
    [files, onFileSelect, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error.code === "file-too-large") {
        setError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
      } else if (error.code === "file-invalid-type") {
        setError("Invalid file type");
      } else if (error.code === "too-many-files") {
        setError(`Maximum ${maxFiles} files allowed`);
      } else {
        setError("Error uploading file");
      }
    },
  });

  const [parent] = useAutoAnimate();

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    const fileId = `${fileToRemove.name}-${fileToRemove.size}`;
    const newFiles = files.filter((_, i) => i !== index);
    onFileSelect(newFiles);
    setError("");
    setFileStatuses(prev => {
      const newStatuses = new Map(prev);
      newStatuses.delete(fileId);
      return newStatuses;
    });
  };

  return (
    <div className={className} ref={parent}>
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors",
          isDragActive && "border-primary/50 bg-primary/5",
          files.length > 0 && "border-primary/50",
          "hover:border-primary/50 hover:bg-primary/5",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="rounded-full grid place-content-center size-10 bg-secondary">
            <Upload className="text-primary" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-semibold">
            {isDragActive ? "Drop the file here" : "Drag & Drop to upload your files"}
          </p>
          <p className="text-xs font-medium text-muted-foreground">Or click to select files</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-3" ref={parent}>
          {files.map((file, index) => {
            const fileId = `${file.name}-${file.size}`;
            const status = fileStatuses.get(fileId);

            return (
              <div
                key={`${file.name}-${index}`}
                className="rounded-md border bg-card px-4 py-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{file.name}</span>
                                      <span className="text-xs text-muted-foreground">
                      {file.size >= 1048576
                        ? `(${(file.size / 1048576).toFixed(2)} MB)`
                        : `(${(file.size / 1024).toFixed(1)} KB)`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {status?.status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {status && status.status !== 'completed' && (
                  <div className="space-y-2">
                    <Progress value={status.progress} className="h-1" />
                    <p className="text-xs text-muted-foreground">
                      {status.status === 'uploading' 
                        ? `Uploading... ${Math.round(status.progress)}%`
                        : status.error || 'Error uploading file'
                      }
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}