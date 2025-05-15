import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  acceptedFileTypes = ".pdf,.docx,.doc,.txt",
  maxFileSizeMB = 10,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxFileSizeBytes) {
      setError(`File size exceeds the ${maxFileSizeMB}MB limit.`);
      return false;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.split(',').includes(fileExtension)) {
      setError(`Invalid file type. Accepted types: ${acceptedFileTypes}`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`
            relative flex min-h-[200px] flex-col items-center justify-center rounded-lg 
            border-2 border-dashed p-6 transition-colors
            ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 bg-neutral-50'}
            ${error ? 'border-red-500 bg-red-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleFileChange}
            accept={acceptedFileTypes}
          />
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-primary-100 p-3">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-neutral-700">
                <span className="text-primary-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-neutral-500">
                {acceptedFileTypes.replace(/\./g, '').toUpperCase()} (up to {maxFileSizeMB}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-md bg-primary-100 p-2">
                <File className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-800">{selectedFile.name}</p>
                <p className="text-xs text-neutral-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUploader;
