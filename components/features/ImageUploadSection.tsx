"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ImageUploadSectionProps {
  label: string;
  onFileUpload: (file: File) => void;
  acceptedFileTypes?: string;
  placeholderText?: string;
  className?: string;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  label,
  onFileUpload,
  acceptedFileTypes = "image/*",
  placeholderText = "قم بتنزيل الصورة هنا",
  className = "",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      onFileUpload(file);
      setFileName(file.name);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setPreview(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
        {label}
      </label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : preview
            ? "border-gray-300 bg-white"
            : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <Image
                src={preview}
                alt="Preview"
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600">{fileName}</p>
            <p className="text-xs text-gray-500">انقر لتغيير الصورة</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-blue-600 font-medium">{placeholderText}</p>
              <p className="text-sm text-gray-500 mt-1">
                اسحب وأفلت الصورة هنا أو انقر للاختيار
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
