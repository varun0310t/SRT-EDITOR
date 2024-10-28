"use client";
import React, { useState } from "react";
import { srtToAST, loadAstFile } from "./srtAstParser";
import { astToSrt } from "./astToSrt";
import { FaTimes } from "react-icons/fa"; // Import the cross icon

interface Subtitle {
  start: string;
  end: string;
  text: string;
}

const SubtitleEditor: React.FC = () => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        console.error("Unsupported file format. Please upload an .srt or .ast file.");
      }
    }
  };

  const updateSubtitle = (index: number, field: string, value: string) => {
    if (field === "start") {
      subtitles.forEach((subtitle, i) => {
        if (i == index) {

        } else {
          if (subtitle.start < value && subtitle.end > value) {
            alert("Time overlaps with subtitle " + i);
            return;
            console.log("Time overlaps with subtitle " + i);
          }
        }


      });
    }
    if (field === "end") {
      subtitles.forEach((subtitle, i) => {
        if (i == index) {

        } else {
          if (subtitle.start < value && subtitle.end > value) {
            alert("Time overlaps with subtitle " + i);
            return;
            console.log("Time overlaps with subtitle " + i);
          }
        }


      });

    }


    setSubtitles((prevSubtitles) =>
      prevSubtitles.map((subtitle, i) =>
        i === index ? { ...subtitle, [field]: value } : subtitle
      )
    );
  };

  const removeSubtitle = (index: number) => {
    setSubtitles(subtitles.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 w-1/2 bg-neutral-800 rounded-lg shadow-lg  text-white">
      <h3 className="mb-4">Subtitle Editor (Supports .srt and .ast files)</h3>

      <div>
        <label htmlFor="file-upload" className="cursor-pointer p-2 bg-blue-600 rounded">
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
            <div key={index} className="relative flex items-start space-x-2 mb-2 group h-16">
              <div className="flex flex-col max-w-20 h-full justify-center">
                <input
                  type="text"
                  value={subtitles[index].start}
                  onChange={(e) => updateSubtitle(index, "start", e.target.value)}
                  className="w-20 p-1 bg-transparent focus:bg-neutral-700 rounded text-xs"
                  placeholder="Start Time"
                />
                <input
                  type="text"
                  value={subtitles[index].end}
                  onChange={(e) => updateSubtitle(index, "end", e.target.value)}
                  className="w-20 p-1 bg-transparent focus:bg-neutral-700 rounded text-xs "
                  placeholder="End Time"
                />
              </div>
              <textarea
                value={subtitle.text}
                onChange={(e) => updateSubtitle(index, "text", e.target.value)}
                className="p-2  bg-neutral-700 roundedtext-xs w-4/5 h-full resize-none text-center"
                placeholder="Subtitle Text"
              />
              <FaTimes
                onClick={() => removeSubtitle(index)}
                className="absolute w-7 h-7 top-[-13px] right-[-13px] p-1 text-red-600 cursor-pointer opacity-0 group-hover:opacity-100"
              />
            </div>
          ))}
          <button
            onClick={() =>
              setSubtitles([...subtitles, { start: "00:00:00,000", end: "00:00:05,000", text: "" }])
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
