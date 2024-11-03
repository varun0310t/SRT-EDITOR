// srtAstParser.ts
import { Subtitle } from "./types";
import { v4 as uuidv4 } from "uuid"; // Import the UUID library

export const srtToAST = (srtContent: string): Subtitle[] => {
  const lines = srtContent.split("\n");
  const ast: Subtitle[] = [];
  let subtitle: Subtitle = {
    id: "",
    start: "",
    end: "",
    text: "",
    x: 50,
    y: 50,
  };

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

export function webVTTToAST(content: string): Subtitle[] {
  const lines = content.trim().split("\n");
  const subtitles: Subtitle[] = [];
  let currentSubtitle: Partial<Subtitle> = {};

  // Skip WEBVTT header
  let i = lines.findIndex((line) => line.trim() === "WEBVTT") + 1;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Check for timestamp line (e.g., "00:00:00.000 --> 00:00:04.000")
    if (line.includes("-->")) {
      const [start, end] = line.split("-->").map(
        (time) => time.trim().replace(".", ",") // Convert dots to commas for consistency
      );

      currentSubtitle = {
        id: uuidv4(),
        start,
        end,
        text: "",
        x: 550,
        y: 1750,
      };

      // Collect all text until next timestamp or empty line
      let textLines = [];
      i++;
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].includes("-->")
      ) {
        textLines.push(lines[i].trim());
        i++;
      }

      currentSubtitle.text = textLines.join("\n");
      subtitles.push(currentSubtitle as Subtitle);
    }
    i++;
  }

  return subtitles;
}

function convertSSATimeToSRT(ssaTime: string): string {
  // SSA format: H:MM:SS.cc (H can be more than 2 digits)
  const match = ssaTime.trim().match(/^(\d+):(\d{2}):(\d{2})\.(\d{2})$/);
  if (!match) return "00:00:00,000";
  
  const [_, hours, minutes, seconds, centiseconds] = match;
  // Pad hours to 2 digits, convert centiseconds to milliseconds
  const paddedHours = hours.padStart(2, '0');
  const milliseconds = (parseInt(centiseconds) * 10).toString().padStart(3, '0');
  
  return `${paddedHours}:${minutes}:${seconds},${milliseconds}`;
}

export function ssaToAst(content: string): Subtitle[] {
  const lines = content.trim().split('\n');
  const subtitles: Subtitle[] = [];

  for (const line of lines) {
    if (line.startsWith('Dialogue:')) {
      const parts = line.split(',');
      if (parts.length >= 10) {
        const start = convertSSATimeToSRT(parts[1]);
        const end = convertSSATimeToSRT(parts[2]);
        const text = parts.slice(9).join(',').trim().replace(/\\N/g, '\n');

        subtitles.push({
          id: uuidv4(),
          start,
          end,
          text,
          x: 550,
          y: 1750,
        });
      }
    }
  }

  return subtitles;
}
