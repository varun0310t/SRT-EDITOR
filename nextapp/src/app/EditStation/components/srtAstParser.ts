// srtAstParser.ts
import { Subtitle } from "./types";

export const srtToAST = (srtContent: string): Subtitle[] => {
  const lines = srtContent.split("\n");
  const ast: Subtitle[] = [];
  let subtitle: Subtitle = { start: "", end: "", text: "" };

  lines.forEach((line) => {
    const timeRegex = /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/;
    if (line.match(timeRegex)) {
      const [_, start, end] = line.match(timeRegex)!;
      subtitle.start = start;
      subtitle.end = end;
    } else if (line === "") {
      if (subtitle.text) {
        ast.push({ ...subtitle });
        subtitle = { start: "", end: "", text: "" };
      }
    } else if (!Number.isNaN(Number(line))) {
      // Ignore index number
    } else {
      subtitle.text += (subtitle.text ? "\n" : "") + line;
    }
  });
  return ast;
};

export const loadAstFile = (astContent: string): Subtitle[] => {
  try {
    return JSON.parse(astContent) as Subtitle[];
  } catch (error) {
    console.error("Invalid AST file");
    return [];
  }
};
