import React, { useRef, useState, useEffect } from 'react';
import { Subtitle } from './types';

interface TimelineProps {
  duration: number;
  playedSeconds: number;
  subtitles: Subtitle[];
  onSeek: (time: number) => void;
  onSubtitleChange: (index: number, newStart: string, newEnd: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ duration, playedSeconds, subtitles, onSeek, onSubtitleChange }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const SCALE = 100; // pixels per second
  const [dragging, setDragging] = useState<{
    type: 'move' | 'start' | 'end';
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
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  const handleMouseDown = (e: React.MouseEvent, index: number, type: 'move' | 'start' | 'end') => {
    e.stopPropagation();
    const subtitle = subtitles[index];
    setDragging({
      type,
      index,
      initialX: e.clientX,
      initialTime: type === 'end' ? parseTime(subtitle.end) : parseTime(subtitle.start),
    });
  };

  const checkOverlap = (index: number, start: number, end: number): boolean => {
    return subtitles.some((sub, i) => {
      if (i === index) return false; // Skip current subtitle
      const subStart = parseTime(sub.start);
      const subEnd = parseTime(sub.end);
      return (start < subEnd && end > subStart);
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
      case 'move':
        newStart = dragging.initialTime + deltaTime;
        newEnd = parseTime(subtitle.end) + deltaTime;
        break;
      case 'start':
        newStart = dragging.initialTime + deltaTime;
        break;
      case 'end':
        newEnd = dragging.initialTime + deltaTime;
        break;
    }

    // Ensure times are valid
    if (newStart < 0) newStart = 0;
    if (newEnd > duration) newEnd = duration;
    if (newEnd <= newStart) newEnd = newStart + 0.1;

    // Check for overlaps
    if (!checkOverlap(dragging.index, newStart, newEnd)) {
      onSubtitleChange(dragging.index, formatTime(newStart), formatTime(newEnd));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove as any);
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove as any);
      };
    }
  }, [dragging]);

  const handleClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    onSeek(clickX / SCALE);
  };

  return (
    <div className="w-full h-32 bg-neutral-900 rounded-lg shadow-lg p-4 overflow-x-auto">
      <div className="relative h-full" style={{ width: `${duration * SCALE}px` }}>
        {/* Time markers */}
        <div className="h-6 border-b border-neutral-700">
          {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
            <div key={i} className="absolute h-2 border-l border-neutral-600" style={{ left: `${i * SCALE}px` }}>
              <span className="absolute top-2 text-xs text-neutral-400 -translate-x-1/2">
                {`${Math.floor(i / 60)}:${String(i % 60).padStart(2, '0')}`}
              </span>
            </div>
          ))}
        </div>

        {/* Subtitle track */}
        <div ref={timelineRef} className="relative h-16 mt-2" onClick={handleClick}>
          {/* Playhead */}
          <div 
            className="absolute top-0 h-full w-0.5 bg-red-500 z-10"
            style={{ left: `${playedSeconds * SCALE}px` }}
          />

          {/* Subtitle blocks */}
          {subtitles.map((subtitle, index) => {
            const startTime = parseTime(subtitle.start);
            const endTime = parseTime(subtitle.end);
            const width = (endTime - startTime) * SCALE;

            return (
              <div
                key={index}
                className="absolute h-8 bg-blue-500 bg-opacity-50 rounded group"
                style={{
                  left: `${startTime * SCALE}px`,
                  width: `${width}px`,
                }}
                onMouseDown={(e) => handleMouseDown(e, index, 'move')}
              >
                <div
                  className="absolute left-0 w-2 h-full cursor-w-resize opacity-0 group-hover:opacity-100 bg-white bg-opacity-50"
                  onMouseDown={(e) => handleMouseDown(e, index, 'start')}
                />
                <div
                  className="absolute right-0 w-2 h-full cursor-e-resize opacity-0 group-hover:opacity-100 bg-white bg-opacity-50"
                  onMouseDown={(e) => handleMouseDown(e, index, 'end')}
                />
                <span className="text-xs truncate px-1">{subtitle.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
