// astToSrt.ts
import { Subtitle } from "./types";

export const astToSrt = (ast: Subtitle[]): string => {
  return ast
    .map((subtitle, index) => {
      const { start, end, text } = subtitle;
      return `${index + 1}\n${start} --> ${end}\n${text}\n`;
    })
    .join("\n");
};
