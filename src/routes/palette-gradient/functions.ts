import { vector } from "@js-basics/vector";
import type { colour, paletteSettings } from "./types";
import { getLuma, hexToColour, RGBValuesToHex } from "./colourfunctions";
function processFile(file: File): string {
  return URL.createObjectURL(file);
}
export function getPaletteColours(
  image: ImageData,
  numberOfColours: number,
  differenceOfColour: number,
  algorithm: string,
  pixelationLevel: number
): Map<string, number> {
  if (!image || !image.data.length) {
    console.error("Invalid or empty image data");
    return new Map<string, number>();
  }
  const colours: string[] = [];
  // histogram or k-means clustering
  if (algorithm === "k-means") {
    // return kmeansClustering(image, numberOfColours);
  }
  if (algorithm === "histogram") {
    // Implement histogram-based colour extraction logic
    return histogramExtraction(
      image,
      numberOfColours,
      differenceOfColour,
      pixelationLevel
    );
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
function histogramExtraction(
  image: ImageData,
  numberOfColours: number,
  differenceOfColour: number,
  pixelationLevel: number | undefined
): Map<string, number> {
  console.log("starting histogram extraction");
  // Placeholder for histogram extraction logic
  const freqMap = new Map<string, number>();
  if (pixelationLevel && pixelationLevel > 1) {
    image = pixelateDownsampled(image, pixelationLevel);
  }
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

export function interpolateColor(c1: colour, c2: colour, t: number): colour {
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
      settings.Algorithm,
      settings.downsampleRate
    );
  } else {
    console.error("No Imagedata received");
    return null;
  }
}

//for loop y incremented by pixelation level,
//for loop x incrememented by pixelation level,
//average colour = {0, 0 , 0 }
//for loop y1 incremented 1 starting at y ending at x + pixelation level,
//for loop x1 incrememented by 1 starting x ending at x + pixelation level,
//get pixel at x1, y1, add it to the average colour

//out of for loop divide colour by the pixelation level squared on each colour channel. Then
//set pixel at getPixelIndex(x, y) to be the average on the newData imageData.

export function pixelateDownsampled(
  imageData: ImageData,
  blockSize: number
): ImageData {
  console.log("Downsampling Imagedata by ", blockSize, "x");
  const srcWidth = imageData.width;
  const srcHeight = imageData.height;
  const input = imageData.data;

  const outWidth = Math.floor(srcWidth / blockSize);
  const outHeight = Math.floor(srcHeight / blockSize);
  const output = new ImageData(outWidth, outHeight);
  const outputData = output.data;

  function getSrcIndex(x: number, y: number): number {
    return (y * srcWidth + x) * 4;
  }

  function getDstIndex(x: number, y: number): number {
    return (y * outWidth + x) * 4;
  }

  for (let by = 0; by < outHeight; by++) {
    for (let bx = 0; bx < outWidth; bx++) {
      let rSum = 0,
        gSum = 0,
        bSum = 0,
        aSum = 0;
      let count = 0;

      for (let dy = 0; dy < blockSize; dy++) {
        for (let dx = 0; dx < blockSize; dx++) {
          const sx = bx * blockSize + dx;
          const sy = by * blockSize + dy;

          const i = getSrcIndex(sx, sy);
          rSum += input[i];
          gSum += input[i + 1];
          bSum += input[i + 2];
          aSum += input[i + 3];
          count++;
        }
      }

      const dstIndex = getDstIndex(bx, by);
      outputData[dstIndex] = Math.round(rSum / count);
      outputData[dstIndex + 1] = Math.round(gSum / count);
      outputData[dstIndex + 2] = Math.round(bSum / count);
      outputData[dstIndex + 3] = Math.round(aSum / count);
    }
  }

  return output;
}

export function getPixelIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4;
}

export function getColourAt(
  x: number,
  y: number,
  width: number,
  originalData: Uint8ClampedArray
): colour {
  const index = getPixelIndex(x, y, width);
  return {
    red: originalData[index],
    green: originalData[index + 1],
    blue: originalData[index + 2],
  };
}

export function hueSimilarity(c1: colour, c2: colour): number {
  // Euclidean distance between RGB, normalized
  const dr = c1.red - c2.red;
  const dg = c1.green - c2.green;
  const db = c1.blue - c2.blue;
  const dist = Math.sqrt(dr * dr + dg * dg + db * db);
  return 1 - dist / (Math.sqrt(3) * 255); // normalize to [0,1]
}
export function brightnessSimilarity(c1: colour, c2: colour): number {
  const average1 = getLuma(c1);
  const average2 = getLuma(c2);
  return Math.abs(average1 - average2);
}
export function mapToObject(map: Map<string, number>): Record<string, number> {
  const obj: Record<string, number> = {};
  for (const [key, value] of map.entries()) {
    obj[key] = value;
  }
  return obj;
}
