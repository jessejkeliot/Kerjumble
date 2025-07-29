import { vector } from "@js-basics/vector";
import type { colour, paletteSettings } from "./types";
function processFile(file: File): string {
  return URL.createObjectURL(file);
}
export function getPaletteColours(
  image: ImageData,
  numberOfColours: number,
  differenceOfColour: number,
  algorithm: string
): Map<string, number> {
  if (!image || !image.data.length) {
    console.error("Invalid or empty image data");
    return new Map<string, number>();
  }
  // Placeholder for actual palette extraction logic
  const colours: string[] = [];
  // histogram or k-means clustering logic would go here
  if (algorithm === "k-means") {
    // Implement k-means clustering logic to extract colours
    // return kmeansClustering(image, numberOfColours);
  }
  if (algorithm === "histogram") {
    // Implement histogram-based colour extraction logic
    return histogramExtraction2(image, numberOfColours, differenceOfColour);
  }
  return new Map<string, number>();
}

export function fisherYates<T>(colours: T[]): T[] {
  for (let i = colours.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * i + 1);
    const temp = colours[j];
    colours[j] = colours[i];
    colours[i] = temp;
  }
  return colours;
}
function histogramExtraction2(
  image: ImageData,
  numberOfColours: number,
  differenceOfColour: number
): Map<string, number> {
  console.log("starting histogram extraction");
  // Placeholder for histogram extraction logic
  const freqMap = new Map<string, number>();

  for (let i = 0; i < image.data.length; i += 4) {
    const r = image.data[i];
    const g = image.data[i + 1];
    const b = image.data[i + 2];
    const a = image.data[i + 3];
    const hex = RGBValuesToHex(r, g, b, a);
    freqMap.has(hex)
      ? freqMap.set(hex, freqMap.get(hex)! + 1)
      : freqMap.set(hex, 1);
  }
  const sorted = Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1]);
  console.log("Frequency map:", freqMap);

  const colours = sorted.slice(0, numberOfColours).map((entry) => entry[0]);
  //finding colours that are too similar and removing them
  const selected: string[] = [];

  for (const [hex] of sorted) {
    const rgb = {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };

    const isTooSimilar = selected.some((selHex) => {
      const selRgb = {
        r: parseInt(selHex.slice(1, 3), 16),
        g: parseInt(selHex.slice(3, 5), 16),
        b: parseInt(selHex.slice(5, 7), 16),
      };
      const diff = Math.sqrt(
        Math.pow(rgb.r - selRgb.r, 2) +
          Math.pow(rgb.g - selRgb.g, 2) +
          Math.pow(rgb.b - selRgb.b, 2)
      );
      return diff < differenceOfColour;
    });

    if (!isTooSimilar) {
      selected.push(hex);
    }

    if (selected.length >= numberOfColours) break;
  }

  let newMap: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < selected.length; i++) {
    newMap.set(selected[i], freqMap.get(selected[i])!);
  }
  //make newMap from selected as keys and find their frequencies from the original frequencymap entries

  console.log("Extracted colours:", selected);
  return newMap;
}
function kmeansClustering(image: ImageData, numberOfColours: number): string[] {
  const colours: string[] = [];
  const freqMap = new Map<string, number>();
  const threedpositions = [];
  for (let i = 0; i < image.data.length; i += 4) {
    const r = image.data[i];
    const g = image.data[i + 1];
    const b = image.data[i + 2];
    threedpositions.push(vector(r, g, b));
  }
  const kmeanCentroids = [];
  for (let i = 0; i < numberOfColours; i++) {
    const randomIndex = Math.floor(Math.random() * threedpositions.length);
    kmeanCentroids.push(threedpositions[randomIndex]);
  }
  let finished = false;
  let iteration = 0;
  while (!finished) {
    iteration++;
    for (let i = 0; i < threedpositions.length; i++) {}
    if (iteration > 20) {
      finished = true;
    }
  }
  return ["a"];
}

function RGBValuesToHex(
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

type Colour = {
  red: number;
  green: number;
  blue: number;
};
export function interpolateColor(c1: Colour, c2: Colour, t: number): Colour {
  return {
    red: Math.round(c1.red + (c2.red - c1.red) * t),
    green: Math.round(c1.green + (c2.green - c1.green) * t),
    blue: Math.round(c1.blue + (c2.blue - c1.blue) * t),
  };
}

export function generatePalette(
  img: HTMLImageElement,
  settings: paletteSettings
): Map<string, number> | null {
  const offscreen = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
  const canvasContext = offscreen.getContext("2d");
  if (!canvasContext) {
    console.error("Failed to get canvas context");
    return null;
  }
  if (!img.complete) {
    console.error("Image not complete");
    return null;
  }
  console.log("Drawing Image to Offscreen Canvas");
  canvasContext.drawImage(img, 0, 0);
  const imageData = canvasContext?.getImageData(
    0,
    0,
    offscreen.width,
    offscreen.height
  );

  if (imageData) {
    return getPaletteColours(
      imageData,
      settings.numberOfColours,
      settings.differenceOfColour,
      settings.Algorithm
    );
  } else {
    console.error("No Imagedata received");
    return null;
  }
}
