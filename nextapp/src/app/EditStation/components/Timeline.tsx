import React, { useRef, useState, useEffect } from "react";
import { Subtitle } from "./types";

interface TimelineProps {
  duration: number;
  playedSeconds: number;
  subtitles: Subtitle[];
  onSeek: (time: number) => void;
  onSubtitleChange: (index: number, newStart: string, newEnd: string) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  duration,
  playedSeconds,
  subtitles,
  onSeek,
  onSubtitleChange,
  isPlaying,
  setIsPlaying,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const SCALE = 100; // pixels per second
  const [dragging, setDragging] = useState<{
    type: "move" | "start" | "end";
    index: number;
    initialX: number;
    initialTime: number;
  } | null>(null);

  const parseTime = (time: string): number => {
    const [hours, minutes, seconds] = time.split(":");
    const [secs, millis] = seconds.split(",");
    return (
      parseInt(hours) * 3600 +
      parseInt(minutes) * 60 +
      parseInt(secs) +
      parseInt(millis) / 1000
    );
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms
      .toString()
      .padStart(3, "0")}`;
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    index: number,
    type: "move" | "start" | "end"
  ) => {
    e.stopPropagation();
    const subtitle = subtitles[index];
    setDragging({
      type,
      index,
      initialX: e.clientX,
      initialTime:
        type === "end" ? parseTime(subtitle.end) : parseTime(subtitle.start),
    });
  };

  const checkOverlap = (index: number, start: number, end: number): boolean => {
    return subtitles.some((sub, i) => {
      if (i === index) return false; // Skip current subtitle
      const subStart = parseTime(sub.start);
      const subEnd = parseTime(sub.end);
      return start < subEnd && end > subStart;
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragging.initialX;
    const deltaTime = deltaX / SCALE;
    const subtitle = subtitles[dragging.index];

    let newStart = parseTime(subtitle.start);
    let newEnd = parseTime(subtitle.end);

    switch (dragging.type) {
      case "move":
        newStart = dragging.initialTime + deltaTime;
        newEnd = parseTime(subtitle.end) + deltaTime;
        break;
      case "start":
        newStart = dragging.initialTime + deltaTime;
        break;
      case "end":
        newEnd = dragging.initialTime + deltaTime;
        break;
    }

    // Ensure times are valid
    if (newStart < 0) newStart = 0;
    if (newEnd > duration) newEnd = duration;
    if (newEnd <= newStart) newEnd = newStart + 0.1;

    // Check for overlaps
    if (!checkOverlap(dragging.index, newStart, newEnd)) {
      onSubtitleChange(
        dragging.index,
        formatTime(newStart),
        formatTime(newEnd)
      );
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleMouseMove as any);
      return () => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove as any);
      };
    }
  }, [dragging]);

  const lastManualSeekTime = useRef<number>(0);
  const SEEK_THRESHOLD = 150; // ms

  // Modify the scroll handler to update video position only when manually scrolling
  const handleTimelineScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    // Only update if the scroll was triggered by user interaction (wheel or drag)
    if (e.type === "scroll" && !isPlaying) {
      const now = Date.now();
      if (now - lastManualSeekTime.current < SEEK_THRESHOLD) return;

      lastManualSeekTime.current = now;
      const centerX =
        containerRef.current.scrollLeft + containerRef.current.clientWidth / 2;
      const newTime = centerX / SCALE;

      if (Math.abs(newTime - playedSeconds) > 0.1) {
        onSeek(newTime);
      }
    }
  };

  // Modify the wheel handler to handle zooming or horizontal scrolling
  const handleTimelineWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!containerRef.current) return;

    const scrollAmount = e.deltaY;
    containerRef.current.scrollLeft += scrollAmount;

    if (!isPlaying) {
      const now = Date.now();
      if (now - lastManualSeekTime.current < SEEK_THRESHOLD) return;

      lastManualSeekTime.current = now;
      const centerX =
        containerRef.current.scrollLeft + containerRef.current.clientWidth / 2;
      const newTime = centerX / SCALE;

      if (Math.abs(newTime - playedSeconds) > 0.1) {
        onSeek(newTime);
      }
    }
  };

  // This effect will keep the timeline centered on the current playback position
  useEffect(() => {
    if (!containerRef.current) return;

    // Calculate the scroll position to center the playhead
    const scrollPosition =
      playedSeconds * SCALE - containerRef.current.clientWidth / 2;
    containerRef.current.scrollLeft = scrollPosition;
  }, [playedSeconds, SCALE]);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickTime = clickX / SCALE;
    setIsPlaying(false);
    onSeek(clickTime);
  }

  return (
    <div
      className="w-full h-32 bg-neutral-900 rounded-lg shadow-lg p-4"
      onWheel={handleTimelineWheel}
    >
      <div className="relative">
        {/* Fixed centered playhead with time display */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="text-xs text-white mb-1">
            {new Date(playedSeconds * 1000).toISOString().substr(11, 8)}
          </div>
          <div className="w-0.5 h-32 bg-red-500" />
        </div>

        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="overflow-x-auto relative scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
          style={{ height: "8rem" }}
          onScroll={handleTimelineScroll}
        >
          <div
            className="relative h-full"
            style={{ width: `${(duration * SCALE)+100}px` }}
          >
            {/* Time markers */}
            <div className="h-6 border-b border-neutral-700">
              {/* Add redundant frames before 0 */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`pre-${i}`}
                  className="absolute h-2 border-l border-neutral-600"
                  style={{ left: `${-1 * (10-i) * SCALE}px` }}
                >
                  <span className="absolute top-2 text-xs text-neutral-400 -translate-x-1/2">
                    {`pre-${i}`}
                  </span>
                </div>
              ))}
              
              {/* Original timeline markers */}
              {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-2 border-l border-neutral-600"
                  style={{ left: `${(i * SCALE)}px` }}
                >
                  <span className="absolute top-2 text-xs text-neutral-400 -translate-x-1/2">
                    {`${Math.floor(i / 60)}:${String(i % 60).padStart(2, "0")}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtitle track */}
            <div
              ref={timelineRef}
              className="relative h-16 mt-2 flex items-center "
              onClick={handleClick}
            >
              {/* Subtitle blocks */}
              {subtitles.map((subtitle, index) => {
                const startTime = parseTime(subtitle.start);
                const endTime = parseTime(subtitle.end);
                const width = (endTime - startTime) * SCALE;

                return (
                  <div
                    key={index}
                    className="absolute h-4/5 bg-blue-500 bg-opacity-50 rounded group flex items-center justify-center cursor-move"
                    style={{
                      left: `${startTime * SCALE}px`,
                      width: `${width}px`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, index, "move")}
                  >
                    <div
                      className="absolute left-0 w-2 h-full cursor-w-resize opacity-0 group-hover:opacity-100 bg-white bg-opacity-50"
                      onMouseDown={(e) => handleMouseDown(e, index, "start")}
                    />
                    <div
                      className="absolute right-0 w-2 h-full cursor-e-resize opacity-0 group-hover:opacity-100 bg-white bg-opacity-50"
                      onMouseDown={(e) => handleMouseDown(e, index, "end")}
                    />
                    <span className="text-xs w-full truncate px-1 text-nowrap text-ellipsis text-center">
                      {subtitle.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
