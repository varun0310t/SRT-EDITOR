import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
  use,
} from "react";
import ReactPlayer from "react-player";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdOutlineForward5 } from "react-icons/md"; // Import the forward icon
import { Slider } from "@/components/ui/slider";
import { Subtitle } from "./types";
import Draggable from "react-draggable"; // Import Draggable
import { Button, buttonVariants } from "@/components/ui/button";
import { set } from "mongoose";
import { Input } from "@/components/ui/input";

// Import SubtitleOctopus as any type
const SubtitleOctopus: any = require("@/../JavascriptSubtitlesOctopus/dist/js/subtitles-octopus");

interface VideoPlayerProps {
  file: File;
  subtitles: Subtitle[];
  setSubtitles: React.Dispatch<React.SetStateAction<Subtitle[]>>;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
}

const VideoPlayerComponent: React.FC<VideoPlayerProps> = ({
  file,
  subtitles,
  setSubtitles,
  onTimeUpdate,
  onDurationChange,
}) => {
  const playerRef = useRef<ReactPlayer>(null);
  const videoUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const [volume, setVolume] = useState(0.8);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [subtitleUrl, setSubtitleUrl] = useState<string | null>(null);
  const [px, setpx] = useState<number>(100);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number>(0);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [buttontype, setbuttontype] = useState<"default" | "destructive">(
    "default"
  );
  const currentSubtitleIndexRef = useRef<number>(-1);
  const isButtonPressedRef = useRef<boolean>(false);
  const pxref = useRef<number>(100);
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
    onTimeUpdate?.(state.playedSeconds);
  }, [onTimeUpdate]);

  const handleDuration = (duration: number) => {
    setDuration(duration);
    onDurationChange?.(duration);
  };

  const handlePlaybackChange = (value: number) => {
    const newPlayedSeconds = (duration * value) / 100;
    setPlayedSeconds(newPlayedSeconds);
    handleSeek(newPlayedSeconds);
  };

  // Function to convert subtitles to ASS format
  const convertSubtitlesToAss = (subtitles: Subtitle[]): string => {
    const assHeader = `
[Script Info]
Title: Example
ScriptType: v4.00+
Collisions: Normal
PlayDepth: 0
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,120,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,1,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    const assBody = subtitles
      .map((subtitle, index) => {
        const { start, end, text, x, y } = subtitle;
        const formattedStart = start.replace(",", ".").slice(1, -1); // Convert to 0:00:00.00 format
        const formattedEnd = end.replace(",", ".").slice(1, -1); // Convert to 0:00:00.00 format
        return `Dialogue: 0,${formattedStart},${formattedEnd},Default,,0,0,0,,{\\pos(${x},${y})}${text}`;
      })
      .join("\n");

    return assHeader + assBody;
  };

  // Function to generate a new URL for the ASS file
  const generateAssUrl = (subtitles: Subtitle[]): string => {
    const assContent = convertSubtitlesToAss(subtitles); // Convert AST to ASS format
    const blob = new Blob([assContent], { type: "application/octet-stream" });
    return URL.createObjectURL(blob);
  };

  // Update the subtitle URL whenever subtitles change
  useEffect(() => {
    const newUrl = generateAssUrl(subtitles);
    setSubtitleUrl(newUrl);

    // Clean up the previous URL object
    return () => {
      if (subtitleUrl) {
        URL.revokeObjectURL(subtitleUrl);
      }
    };
  }, [subtitles]);

  // Initialize SubtitleOctopus with the new URL
  useEffect(() => {
    if (playerRef.current && subtitleUrl) {
      const videoElement = playerRef.current.getInternalPlayer();

      if (videoElement) {
        const subtitleOctopus = new SubtitleOctopus({
          video: videoElement,
          subUrl: subtitleUrl,
          fonts: [],
          workerUrl: "/js/subtitles-octopus-worker.js",
          legacyWorkerUrl: "/js/subtitles-octopus-worker-legacy.js",
        });

        subtitleOctopus.onError = (error: any) => {
          console.error("SubtitleOctopus Worker Error:", error);
        };

        subtitleOctopus.worker.onerror = (event: ErrorEvent) => {
          console.error(
            "Worker Error Event:",
            event.message,
            event.filename,
            event.lineno,
            event.colno,
            event.error
          );
        };

        return () => {
          if (subtitleOctopus.worker) {
            subtitleOctopus.dispose();
          } else {
            console.warn("SubtitleOctopus worker is already null.");
          }
        };
      }
    }
  }, [subtitleUrl]);
  //convert String to time in seconds
  const parseTime = (time: string): number => {
    const [hours, minutes, seconds] = time.split(":");
    const [secs, millis] = seconds.split(",");
    return (
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseInt(secs, 10) +
      parseInt(millis, 10) / 1000
    );
  };

  useEffect(() => {
    if (
      currentSubtitle &&
      parseTime(currentSubtitle.start) < playedSeconds &&
      parseTime(currentSubtitle.end) >= playedSeconds
    ) {
      // current subtitle has not changed
    } else {
      const newSubtitleIndex = subtitles.findIndex(
        (subtitle) =>
          parseTime(subtitle.start) < playedSeconds &&
          parseTime(subtitle.end) >= playedSeconds
      );

      if (newSubtitleIndex !== -1) {
        console.log("New subtitle index:", currentSubtitleIndex);
        setCurrentSubtitle(subtitles[newSubtitleIndex]);
        currentSubtitleIndexRef.current = newSubtitleIndex; // Update ref instead of state
        setCurrentSubtitleIndex(newSubtitleIndex);
      } else {
        setCurrentSubtitle(null);
        currentSubtitleIndexRef.current = -1;
        setCurrentSubtitleIndex(-1);
      }
    }
  }, [playedSeconds]);

  const handleKeyDown = (event: KeyboardEvent) => {
    console.log("Key pressed:", pxref.current);
    if (currentSubtitleIndexRef.current === -1 || !subtitles.length) return;
    if (isButtonPressedRef.current) return;

    const currentSubtitle = subtitles[currentSubtitleIndexRef.current];
    console.log("Current subtitle:", currentSubtitle);
    if (!currentSubtitle) return;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        setSubtitles((prevSubtitles) =>
          prevSubtitles.map((subtitle, index) =>
            index === currentSubtitleIndexRef.current
              ? { ...subtitle, y: (subtitle.y || 0) - pxref.current }
              : subtitle
          )
        );
        handleSeek(parseTime(currentSubtitle.start) + 0.5);
        break;
      case "ArrowDown":
        event.preventDefault();
        setSubtitles((prevSubtitles) =>
          prevSubtitles.map((subtitle, index) =>
            index === currentSubtitleIndexRef.current
              ? { ...subtitle, y: (subtitle.y || 0) + pxref.current }
              : subtitle
          )
        );
        handleSeek(parseTime(currentSubtitle.start) + 0.5);
        break;
      case "ArrowLeft":
        event.preventDefault();
        setSubtitles((prevSubtitles) =>
          prevSubtitles.map((subtitle, index) =>
            index === currentSubtitleIndexRef.current
              ? { ...subtitle, x: (subtitle.x || 0) - pxref.current }
              : subtitle
          )
        );
        handleSeek(parseTime(currentSubtitle.start) + 0.5);
        break;
      case "ArrowRight":
        event.preventDefault();
        setSubtitles((prevSubtitles) =>
          prevSubtitles.map((subtitle, index) =>
            index === currentSubtitleIndexRef.current
              ? { ...subtitle, x: (subtitle.x || 0) + pxref.current }
              : subtitle
          )
        );
        handleSeek(parseTime(currentSubtitle.start) + 0.5);
        break;
    }
  };
  // Add subtitles to dependencies

  const handlebuttonpress = (e: any) => {
    e.preventDefault();
    setIsButtonPressed(!isButtonPressed);
    isButtonPressedRef.current = isButtonPressed;
    if (!isButtonPressed) {
      console.log("Button is pressed");
      setbuttontype("destructive");
      document.addEventListener("keydown", handleKeyDown);
    } else {
      console.log("Button is not pressed");
      setbuttontype("default");
      document.removeEventListener("keydown", handleKeyDown);
    }
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

      <div className="flex items-center justify-between  space-x-4 mt-4 w-full px-2">
        <div className="flex">
          <Button variant={buttontype} onClick={handlebuttonpress}>
            Move
          </Button>
          <Input
            value={px}
            className=" w-14"
            onChange={(e: any) => {
              console.log(e.target.value);
              setpx((prev) => e.target.value);
              pxref.current = parseInt(e.target.value);
            }}
          ></Input>
        </div>
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
