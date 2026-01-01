import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import clsx from 'clsx';
import { CloudUpload, AlertCircle } from 'lucide-react';

interface UploadProps {
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect?: (file: File) => void;
  label?: string;
  error?: string;
  helperText?: string;
}

export function Upload({ accept = '*', maxSize = 5, onFileSelect, label, error, helperText }: UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return;
    }

    onFileSelect?.(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-base font-semibold text-gray-900 mb-2">{label}</label>
      )}

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={clsx(
          'border-2 border-dashed rounded-xl py-12 px-6 text-center cursor-pointer transition-all',
          error
            ? 'border-red-300 bg-red-50'
            : isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <div className={clsx(
            'w-14 h-14 rounded-full flex items-center justify-center mb-4',
            error ? 'bg-red-100' : 'bg-blue-100'
          )}>
            <CloudUpload className={clsx(
              'w-7 h-7',
              error ? 'text-red-600' : 'text-blue-600'
            )} />
          </div>

          <p className="text-sm text-gray-700 mb-1">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
