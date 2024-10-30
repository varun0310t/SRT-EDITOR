"use client";
import { Subtitle } from "./components/types";
import React, { useState } from "react";
import CustomDropzone from "./components/Dropzone";
import VideoPlayerComponent from "./components/VideoPlayerComponent";
import SubtitleEditor from "./components/SubtitleEditor";
import Timeline from './components/Timeline';

export default function Page() {
  const [showUploadTab, setShowUploadTab] = useState(true);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const handleDrop = (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    if (acceptedFiles.length < 1) {
      return;
    }
    setCurrentFile(acceptedFiles[0]);
    setShowUploadTab(false); // Hide the upload tab after a file is uploaded
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (duration: number) => {
    setVideoDuration(duration);
  };

  const handleSubtitleTimeChange = (index: number, newStart: string, newEnd: string) => {
    setSubtitles(prev => prev.map((sub, i) => 
      i === index 
        ? { ...sub, start: newStart, end: newEnd }
        : sub
    ));
  };

  return (
    <>
      <div>
        <div className="relative p-4">
          {showUploadTab && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
              <div className="p-6 rounded-lg shadow-lg">
                <CustomDropzone
                  onDrop={handleDrop}
                  accept={{ "video/*": [], "audio/*": [] }}
                  multiple={false}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col w-full h-screen">
          <div className="flex flex-row w-full items-start h-4/5">
            <SubtitleEditor subtitles={subtitles} setSubtitles={setSubtitles} />
            {currentFile && (
              <VideoPlayerComponent
                setSubtitles={setSubtitles}
                subtitles={subtitles}
                file={currentFile}
                onTimeUpdate={setCurrentTime}
                onDurationChange={setVideoDuration}
              />
            )}
          </div>
          {currentFile && (
            <div className="mt-4">
              <Timeline
                duration={videoDuration}
                playedSeconds={currentTime}
                subtitles={subtitles}
                onSeek={(time) => {
                  // VideoPlayerComponent will handle this through its ref
                }}
                onSubtitleChange={handleSubtitleTimeChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
