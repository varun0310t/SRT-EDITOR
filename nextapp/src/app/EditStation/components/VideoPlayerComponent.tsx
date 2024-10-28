import React, { useRef, useState, useCallback, useMemo } from "react";
import ReactPlayer from "react-player";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdOutlineForward5 } from "react-icons/md"; // Import the forward icon
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  file: File;
}

const VideoPlayerComponent: React.FC<VideoPlayerProps> = ({ file }) => {
  const playerRef = useRef<ReactPlayer>(null);
  const videoUrl = useMemo(() => URL.createObjectURL(file), [file]);

  const [volume, setVolume] = useState(0.8);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleSeek = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  const handleProgress = useCallback((state: { playedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds);
  }, []);

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handlePlaybackChange = (value: number) => {
    const newPlayedSeconds = (duration * value) / 100;
    setPlayedSeconds(newPlayedSeconds);
    handleSeek(newPlayedSeconds);
  };

  return (
    <div className="w-full h-full max-w-4xl max-h-[80vh] mx-auto p-4 bg-neutral-900 rounded-lg shadow-lg flex flex-col items-center">
      <div className="w-full h-full relative rounded overflow-hidden">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          volume={volume}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
          onError={(e) => console.error("Error loading video:", e)}
        />
      </div>

      {/* Playback Slider */}
      <div className="mt-4 w-full px-2">
        <Slider
          min={0}
          max={100}
          step={0.1}
          value={[(playedSeconds / duration) * 100]}
          onValueChange={([val]) => handlePlaybackChange(val)}
          className="w-full text-white"
        />
      </div>

      <div className="flex items-center justify-center space-x-4 mt-4 w-full px-2">
        <button
          onClick={playing ? handlePause : handlePlay}
          className="text-white text-2xl hover:text-gray-400"
        >
          {playing ? <FaPause /> : <FaPlay />}
        </button>

        <button
          onClick={() => handleSeek(playedSeconds - 5)}
          className="text-white text-2xl transform hover:text-gray-400 scale-x-[-1]"
        >
          <MdOutlineForward5 />
        </button>
        <button
          onClick={() => handleSeek(playedSeconds + 5)}
          className="text-white text-2xl hover:text-gray-400"
        >
          <MdOutlineForward5 />
        </button>

        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[volume]}
          onValueChange={([val]) => handleVolumeChange(val)}
          className="w-1/3 text-white"
        />

        <div className="text-white text-sm ml-4">
          {playedSeconds.toFixed(2)}s / {duration.toFixed(2)}s
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerComponent;
