"use client";
import React, { useState } from "react";
import CustomDropzone from "./components/Dropzone";

export default function Page() {
    const [showUploadTab, setShowUploadTab] = useState(true);
    const [currentfile, currentsetFile] = useState<File | null>(null);
    const handleDrop = (acceptedFiles: File[]) => {
        console.log(acceptedFiles);
        if (acceptedFiles.length < 1) {
            return;
        }
        currentsetFile(acceptedFiles[0]);
        setShowUploadTab(false); // Hide the upload tab after a file is uploaded
    };

    return (
        <div className="relative p-4">
            {showUploadTab && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className=" p-6 rounded-lg shadow-lg">
                        <CustomDropzone onDrop={handleDrop} accept={{ "video/*": [], "audio/*": [] }} multiple={false} />
                    </div>
                </div>
            )}
            {!showUploadTab && <p>File uploaded successfully!</p>}
        </div>
    );
}