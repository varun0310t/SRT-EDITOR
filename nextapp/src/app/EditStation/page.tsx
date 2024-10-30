"use client";
import { Subtitle } from "./components/types";
import React, { useState, useRef } from "react";
import CustomDropzone from "./components/Dropzone";
import VideoPlayerComponent from "./components/VideoPlayerComponent";
import SubtitleEditor from "./components/SubtitleEditor";
import Timeline from './components/Timeline';
import ReactPlayer from 'react-player';

export default function Page() {
  const [showUploadTab, setShowUploadTab] = useState(true);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const playerRefpage = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleSeek = (time: number) => {
    if (playerRefpage.current) {
      playerRefpage.current.seekTo(time, 'seconds');
    }
  };

  const preventScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="relative">
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
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row w-full items-start flex-1 overflow-hidden">
          <SubtitleEditor subtitles={subtitles} setSubtitles={setSubtitles} />
          {currentFile && (
            <VideoPlayerComponent
              playerRef={playerRefpage}  // Pass the ref directly as a prop
              setSubtitles={setSubtitles}
              subtitles={subtitles}
              file={currentFile}
              onTimeUpdate={setCurrentTime}
              onDurationChange={setVideoDuration}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          )}
        </div>
        {currentFile && (
          <div 
            className="flex-shrink-0" 
            onWheel={preventScroll}
          >
            <Timeline
              duration={videoDuration}
              playedSeconds={currentTime}
              subtitles={subtitles}
              onSeek={handleSeek}
              onSubtitleChange={handleSubtitleTimeChange}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>
        )}
      </div>
    </div>
  );
}
