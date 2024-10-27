"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { DropzoneOptions ,Accept } from "react-dropzone";
interface CustomDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
}

const CustomDropzone: React.FC<CustomDropzoneProps> = ({ onDrop, accept, multiple = true }) => {
  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-4 rounded-md text-center cursor-pointer ${
        isDragActive ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag & drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default CustomDropzone;