import React, { useState } from "react";
import { FaTimes } from "react-icons/fa"; // Import the cross icon
import { srtToAST } from "./srtAstParser";
import { loadAstFile } from "./srtAstParser";
import { Subtitle } from "./types";
import { AiOutlineSplitCells } from "react-icons/ai";
import { CgArrowsMergeAltV } from "react-icons/cg";
interface SubtitleEditorProps {
  subtitles: Subtitle[];
  setSubtitles: React.Dispatch<React.SetStateAction<Subtitle[]>>;
}
const SubtitleEditor: React.FC<SubtitleEditorProps> = ({
  subtitles,
  setSubtitles,
}) => {
  const [tempValues, setTempValues] = useState<{ [key: string]: string }>({});

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileContent = await file.text();
      if (file.name.endsWith(".srt")) {
        // If .srt file, parse to AST format
        const parsedSubtitles = srtToAST(fileContent);
        setSubtitles(parsedSubtitles);
      } else if (file.name.endsWith(".ast")) {
        // If .ast file, load AST directly
        const parsedSubtitles = loadAstFile(fileContent);
        setSubtitles(parsedSubtitles);
      } else {
        console.error(
          "Unsupported file format. Please upload an .srt or .ast file."
        );
      }
    }
  };

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

  const checkOverlap = (index: number, start: string, end: string): boolean => {
    const startTime = parseTime(start);
    const endTime = parseTime(end);

    return subtitles.some((sub, i) => {
      if (i === index) return false;
      const subStart = parseTime(sub.start);
      const subEnd = parseTime(sub.end);
      return startTime < subEnd && endTime > subStart;
    });
  };
  const splitSubtitle = (index: number) => {
    setSubtitles((prevSubtitles) => {
      const subtitle = prevSubtitles[index];
      const startTime = parseTime(subtitle.start);
      const endTime = parseTime(subtitle.end);
      const splitTime = (startTime + endTime) / 2;
  
      // Create the first half subtitle - keep x, y coordinates if they exist
      const splitedSubtitle = {
        ...subtitle, // Keep all original properties including x, y
        start: formatTime(startTime),
        end: formatTime(splitTime),
        text: subtitle.text,
      };
  
      // Create the second half subtitle - keep x, y coordinates if they exist
      const updatedSubtitle = {
        ...subtitle, // Keep all original properties including x, y
        start: formatTime(splitTime),
        end: formatTime(endTime),
        text: "", // Empty text for the second half
      };
  
      // Create new array with both parts
      const newSubtitles = [
        ...prevSubtitles.slice(0, index),
        splitedSubtitle,
        updatedSubtitle,
        ...prevSubtitles.slice(index + 1),
      ];
  
      return newSubtitles;
    });
  };
  
  const mergeSubtitle = (index: number) => {
    setSubtitles((prevSubtitles) => {
      // Check if there's a next subtitle to merge with
      if (index >= prevSubtitles.length - 1) return prevSubtitles;
  
      const firstSubtitle = prevSubtitles[index];
      const secondSubtitle = prevSubtitles[index + 1];
  
      // Create a new merged subtitle object
      const mergedSubtitle = {
        ...firstSubtitle,
        end: secondSubtitle.end,
        text: firstSubtitle.text + " " + secondSubtitle.text,
      };
  
      // Create new array with the merged subtitle
      const newSubtitles = [
        ...prevSubtitles.slice(0, index),
        mergedSubtitle,
        ...prevSubtitles.slice(index + 2),
      ];
  
      return newSubtitles;
    });
  };
  
  const updateSubtitle = (index: number, field: string, value: string) => {
    if (value === "") return;

    if (field === "start" || field === "end") {
      const subtitle = subtitles[index];
      const newStart = field === "start" ? value : subtitle.start;
      const newEnd = field === "end" ? value : subtitle.end;

      if (checkOverlap(index, newStart, newEnd)) {
        alert(`Time overlaps with another subtitle`);
        // Revert to original value
        setTempValues((prevTempValues) => ({
          ...prevTempValues,
          [`${index}-${field}`]: subtitle[field],
        }));
        return;
      }
    }

    setSubtitles((prevSubtitles) =>
      prevSubtitles.map((subtitle, i) =>
        i === index ? { ...subtitle, [field]: value } : subtitle
      )
    );
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    setTempValues((prevTempValues) => ({
      ...prevTempValues,
      [`${index}-${field}`]: value,
    }));
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: string
  ) => {
    if (event.key === "Enter") {
      updateSubtitle(index, field, tempValues[`${index}-${field}`] || "");
    }
  };

  const handleBlur = (index: number, field: string) => {
    updateSubtitle(index, field, tempValues[`${index}-${field}`] || "");
  };

  const removeSubtitle = (index: number) => {
    setSubtitles(subtitles.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 w-full h-full overflow-auto bg-neutral-800 rounded-lg shadow-lg text-white">
      <h3 className="mb-4">Subtitle Editor (Supports .srt and .ast files)</h3>

      <div>
        <label
          htmlFor="file-upload"
          className="cursor-pointer p-2 bg-blue-600 rounded"
        >
          Upload SRT or AST File
        </label>
        <input
          type="file"
          id="file-upload"
          accept=".srt,.ast"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {subtitles.length > 0 && (
        <div className="mt-4">
          {subtitles.map((subtitle, index) => (
            <div
              key={`subtitle-${index}`}
              className="relative flex items-start space-x-2 mb-2 group"
            >
              <div className="flex flex-col w-20 h-full justify-center">
                <input
                  type="text"
                  value={tempValues[`${index}-start`] || subtitle.start}
                  onChange={(e) =>
                    handleInputChange(index, "start", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "start")}
                  onBlur={() => handleBlur(index, "start")}
                  className="w-20 p-1 bg-transparent focus:bg-neutral-700 rounded text-xs"
                  placeholder="Start Time"
                />
                <input
                  type="text"
                  value={tempValues[`${index}-end`] || subtitle.end}
                  onChange={(e) =>
                    handleInputChange(index, "end", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "end")}
                  onBlur={() => handleBlur(index, "end")}
                  className="w-20 p-1 bg-transparent focus:bg-neutral-700 rounded text-xs"
                  placeholder="End Time"
                />
              </div>
              <textarea
                value={tempValues[`${index}-text`] || subtitle.text}
                onChange={(e) =>
                  handleInputChange(index, "text", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, index, "text")}
                onBlur={() => handleBlur(index, "text")}
                className="flex-grow p-2 bg-neutral-700 rounded text-center text-lg h-full resize-none"
                placeholder="Subtitle Text"
              />
              <FaTimes
                onClick={() => removeSubtitle(index)}
                className="absolute w-6 h-6 top-[-3px] right-[-10px] transform -translate-y-1/2 p-1 text-gray-300 cursor-pointer opacity-0 group-hover:opacity-100"
              />
              <AiOutlineSplitCells
                onClick={() => {
                  splitSubtitle(index);
                }}
                className="absolute w-7 h-7 bottom-[-25px] right-[20px] transform -translate-y-1/2 p-1 text-gray-300 cursor-pointer opacity-0 group-hover:opacity-100"
              />
              <CgArrowsMergeAltV
                onClick={() => {
                  console.log("merge");
                  mergeSubtitle(index);
                }}
                className="absolute w-7 h-7 bottom-[-25px] right-[50px] transform -translate-y-1/2 p-1 text-gray-300 cursor-pointer opacity-0 group-hover:opacity-100"
              />
            </div>
          ))}
          <button
            onClick={() =>
              setSubtitles([
                ...subtitles,
                { start: "00:00:00,000", end: "00:00:05,000", text: "" },
              ])
            }
            className="mt-4 p-2 bg-green-600 rounded text-xs"
          >
            Add Subtitle
          </button>
        </div>
      )}
    </div>
  );
};

export default SubtitleEditor;
