import React, { useState } from "react";
import { FaTimes } from "react-icons/fa"; // Import the cross icon
import { srtToAST } from "./srtAstParser";
import{ loadAstFile } from "./srtAstParser";
interface Subtitle {
  start: string;
  end: string;
  text: string;
}

const SubtitleEditor: React.FC = () => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [tempValues, setTempValues] = useState<{ [key: string]: string }>({});

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
    if (field === "start" || field === "end") {
      for (let i = 0; i < subtitles.length; i++) {
        if (i !== index) {
          const subtitle = subtitles[i];
          if (
            (field === "start" && subtitle.start < value && subtitle.end > value) ||
            (field === "end" && subtitle.start < value && subtitle.end > value)
          ) {
            alert(`Time overlaps with subtitle ${i + 1}`);
            // Revert to original value
            setTempValues((prevTempValues) => ({
              ...prevTempValues,
              [`${index}-${field}`]: subtitles[index][field],
            }));
            return;
          }
        }
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: string) => {
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
            <div key={index} className="relative flex items-start space-x-2 mb-2 group">
              <div className="flex flex-col w-20 h-full justify-center">
                <input
                  type="text"
                  value={tempValues[`${index}-start`] || subtitle.start}
                  onChange={(e) => handleInputChange(index, "start", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index, "start")}
                  onBlur={() => handleBlur(index, "start")}
                  className="w-20 p-1 bg-transparent focus:bg-neutral-700 rounded text-xs"
                  placeholder="Start Time"
                />
                <input
                  type="text"
                  value={tempValues[`${index}-end`] || subtitle.end}
                  onChange={(e) => handleInputChange(index, "end", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index, "end")}
                  onBlur={() => handleBlur(index, "end")}
                  className="w-20 p-1 bg-transparent focus:bg-neutral-700 rounded text-xs"
                  placeholder="End Time"
                />
              </div>
              <textarea
                value={tempValues[`${index}-text`] || subtitle.text}
                onChange={(e) => handleInputChange(index, "text", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index, "text")}
                onBlur={() => handleBlur(index, "text")}
                className="flex-grow p-2 bg-neutral-700 rounded text-center text-lg h-full resize-none"
                placeholder="Subtitle Text"
              />
              <FaTimes
                onClick={() => removeSubtitle(index)}
                className="absolute w-6 h-6 top-[-3px] right-[-10px] transform -translate-y-1/2 p-1 text-red-600 cursor-pointer opacity-0 group-hover:opacity-100"
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