import { pixelateDownsampled } from "./functions";
import type { colour } from "./types";
export function hexToColour(hex: string): colour {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { red: r, green: g, blue: b };
}

export function RGBValuesToHex(
  r: number,
  g: number,
  b: number,
  a: number | undefined
): string {
  let colour = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  if (a) {
    colour += `${a.toString(16).padStart(2, "0")}`;
  }
  return colour;
}

export function getLuma(c: colour): number {
  return (c.red + c.green + c.blue) / (3 * 255); // Average of RGB values
}

export function getLightness(colour: colour): number {
  const c = Object.values(colour).map((value) => value / 255);
  const l = (Math.max(...c) + Math.min(...c)) / 2;
  return l;
}
export function getSaturation(colour: colour): number {
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

export function calculateAvColour(imageData: ImageData, downsampleRate: number): colour {
    let totalc: colour = {red: 0, green:0, blue:0};
    const newImageData = pixelateDownsampled(imageData, downsampleRate)
    const l = newImageData.data.length;
    for(let i=0; i< l;i+=4){
        totalc.red += newImageData.data[i+0];
        totalc.green += newImageData.data[i+1];
        totalc.blue += newImageData.data[i+2];
    }
    return {red: totalc.red / l, green: totalc.green / l, blue: totalc.blue /l};
}

export function divideColours(c1: colour, c2: colour){
    return {
        red: c1.red / c2.red,
        green: c1.green / c2.green,
        blue: c1.blue / c2.blue,
    };
}

export function averageColours(c: colour){
    return (c.red + c.green + c.blue) / (3);
}
