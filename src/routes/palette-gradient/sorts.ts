import type { colour } from "./types";

export function sortBy(
  colours: Map<string, number>,
  func: (c: colour) => number
): Map<string, number> {
  return new Map(
    [...colours.entries()].sort((a, b) => {
      return func(hexToColour(a[0])) - func(hexToColour(b[0]));
    })
  );
}

export function hexToColour(hex: string): colour {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { red: r, green: g, blue: b };
}

export function getLuma(c: colour): number {
  return (c.red + c.green + c.blue) / (3*255); // Average of RGB values
}

export function getLightness(colour: colour): number {
  const c = Object.values(colour).map((value) => value / 255);
  const l = (Math.max(...c) + Math.min(...c)) / 2;
  return l;
}
export function getSaturation(colour:colour): number {
  const { red, green, blue } = colour;
  let r = red / 255;
  let g = green / 255;
  let b = blue / 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let d = max - min;
  let h;
  if (d === 0) h = 0;
  else if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else if (max === b) h = (r - g) / d + 4;
  let l = (min + max) / 2;
  let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return s;
}

export function getHue(colour: colour): number {
  const { red, green, blue } = colour;
  let r = red / 255;
  let g = green / 255;
  let b = blue / 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let d = max - min;
  let h = 0;
  if (d === 0) h = 0;
  else if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else if (max === b) h = (r - g) / d + 4;
  return h;
}
