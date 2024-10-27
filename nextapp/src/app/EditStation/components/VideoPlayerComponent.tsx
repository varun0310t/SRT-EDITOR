import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  file: File;
}

const VideoPlayerComponent: React.FC<VideoPlayerProps> = ({ file }) => {
  const playerRef = useRef<ReactPlayer>(null);
  const videoUrl = useMemo(() => URL.createObjectURL(file), [file]); // Memoize the video URL

  const [volume, setVolume] = useState(0.8);
  const [playedSeconds, setPlayedSeconds] = useState(0);
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

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };

  const handleProgress = useCallback((state: { playedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds);
  }, []);

 

  return (
    <div className="video-player-wrapper">
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        playing={playing}
        volume={volume}
        height="100%"
        onProgress={handleProgress}
      />
      <div className="controls">
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={() => handleSeek(10)}>Seek to 10s</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
        <div>Current Time: {playedSeconds.toFixed(2)}s</div>
      </div>
    </div>
  );
};

export default VideoPlayerComponent;