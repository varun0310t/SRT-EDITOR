// types.ts
export interface Subtitle {
  id: string; // Add this line
  start: string;
  end: string;
  text: string;
  x?: number;
  y?: number;
}
