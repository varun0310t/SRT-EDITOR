// srtAstParser.ts
import { Subtitle } from "./types";
import { v4 as uuidv4 } from "uuid"; // Import the UUID library

export const srtToAST = (srtContent: string): Subtitle[] => {
  const lines = srtContent.split("\n");
  const ast: Subtitle[] = [];
  let subtitle: Subtitle = { id: "", start: "", end: "", text: "", x: 50, y: 50 };

  lines.forEach((line) => {
    const timeRegex = /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/;
    if (line.match(timeRegex)) {
      const [_, start, end] = line.match(timeRegex)!;
      subtitle.start = start;
      subtitle.end = end;
    } else if (line === "") {
      if (subtitle.text) {
        subtitle.id = uuidv4(); // Assign a unique ID
        ast.push({ ...subtitle });
        subtitle = { id: "", start: "", end: "", text: "", x: 550, y: 1750 };
      }
    } else if (!Number.isNaN(Number(line))) {
      // Ignore index numbers
    } else {
      subtitle.text += (subtitle.text ? "\n" : "") + line;
    }
  });
  
  // Handle the last subtitle if not followed by a blank line
  if (subtitle.text) {
    subtitle.id = uuidv4();
    ast.push({ ...subtitle });
  }

  return ast;
};

export const loadAstFile = (astContent: string): Subtitle[] => {
  try {
    const parsedSubtitles = JSON.parse(astContent) as Subtitle[];
    return parsedSubtitles.map((subtitle) => ({
      ...subtitle,
      id: subtitle.id || uuidv4(), // Ensure each subtitle has an ID
    }));
  } catch (error) {
    console.error("Invalid AST file");
    return [];
  }
};
