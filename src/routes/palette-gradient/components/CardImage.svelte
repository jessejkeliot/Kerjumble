<script lang="ts">
  import PaletteExtractionOptions from "./PaletteExtractionOptions.svelte";
  import "./style.css";
  import PaletteBox from "./PaletteBox.svelte";

  import { createEventDispatcher } from "svelte";
  import MageImageAdd from "~icons/mage/image-plus";
  import MageReset from "~icons/mage/reload-reverse";
  import MageX from "~icons/mage/folder-cross";
  import MageFileDownload from "~icons/mage/file-download";
  import MageImageDownload from "~icons/mage/image-download";
  import MageColorSwatch from "~icons/mage/color-swatch";
  import MageSort from "~icons/mage/chart-up-fill";
  import { getPaletteColours, getColourAt, hueSimilarity, getPixelIndex, brightnessSimilarity, mapToObject } from "$lib/functions/functions";
  import type { colour, paletteSettings, paletteState } from "$lib/types/types";
  import { sortBy } from "$lib/functions/sorts";
  import {
    getLuma,
    getHue,
    getLightness,
    getSaturation,
    hexToColour,
    calculateAvColour,
    divideColours,
    averageColours,
    gradientFromPalette,
    colourFromPalette,
  } from "../../../lib/functions/colourfunctions";
  import ApplyGMapOptions from "./ApplyGMapOptions.svelte";

  let { name } = $props();
  let showPEO = $state(false);
  let defaultSettings: paletteSettings = {
    numberOfColours: 5,
    differenceOfColour: 60,
    Algorithm: "histogram",
    downsampleRate: 8,
  };
  const map = new Map<string, number>();
  let palette: paletteState = $state({
    colours: map,
    settings: { ...defaultSettings },
  });
  const paletteAlgorithms = ["histogram", "k-means"];
  let paletteAlgorithmCounter = $state(0);
  $effect(() => {
    palette.settings.Algorithm = paletteAlgorithms[paletteAlgorithmCounter];
  });
  const paletteSorts = ["frequency", "naive luminance", "saturation", "hue"];
  let paletteSortMethodCounter = $state(0);
  let paletteSortMethodName = $derived(paletteSorts[paletteSortMethodCounter]);
  let paletteMixedStatus = false;
  let imageFile: File | null = $state(null);
  let imageURL: string | null = $state(null);
  let canvasEl: HTMLCanvasElement | null = $state(null);
  let canvasWidth: number = $state(0);
  let canvasHeight: number = $state(0);

  //could have a check if the settings have changed before applying

  let inputElement: HTMLInputElement | null = $state(null);

  let gradientLineElement: HTMLDivElement | null = $state(null);

  let dispatch = createEventDispatcher();
  function handleApplyMap(event: CustomEvent) {
    const options = event.detail;
    console.log("Received options: ", options);
    //is canvasEl real?
    switch (options.image) {
      case "this":
        if (canvasEl && canvasEl.height > 0 && canvasEl.width > 0) {
          applyMap(Array.from(palette.colours.keys()), canvasEl, options.via);
        }
        break;
      case "other":
        dispatch("applyToOther", {
          palette: Array.from(palette.colours.keys()),
          via: options.via,
        });
        break;
      default:
        break;
    }
  }
  export function applyExternalMap(palette: string[], via: string) {
    if (!canvasEl) {
      console.error("No canvas to apply map to");
      return;
    }
    applyMap(palette, canvasEl, via);
  }
  function applyMap(palette: string[], canvas: HTMLCanvasElement, via: string) {
    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Failed to get 2D context");
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    console.log("Colorspace:", imageData.colorSpace);

    const originalData = new Uint8ClampedArray(data);
    let totalAverage: colour = { red: 0, green: 0, blue: 0 };
    if (via.includes("average")) {
      totalAverage = calculateAvColour(imageData, 1);
      console.log("totalAverage", totalAverage);
    }

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = getPixelIndex(x, y, width);
        const r = originalData[i];
        const g = originalData[i + 1];
        const b = originalData[i + 2];
        const currentColour = { red: r, green: g, blue: b };
        let newColour: colour = currentColour;

        switch (via) {
          case "brightness":
            newColour = gradientFromPalette(getLuma(currentColour), palette);
            break;

          case "hue":
            const hue = getHue(currentColour) / 6;
            newColour = gradientFromPalette(hue, palette);
            break;

          case "posterise":
            const posterhue = getHue(currentColour) / 6;
            newColour = colourFromPalette(posterhue, palette);
            break;

          case "brightness posterise":
            newColour = colourFromPalette(getLuma(currentColour), palette);
            break;
          case "edge brightness":
            //first calculate the average similarity;
            let sum1 = 0;
            let count1 = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue; // skip self
                const neighbor = getColourAt(x + dx, y + dy, width, originalData);
                sum1 += brightnessSimilarity(currentColour, neighbor);
                count1++;
              }
            }
            const avgSim1 = sum1 / count1;

            const boosted1 = Math.pow(avgSim1, 1.2);
            newColour = gradientFromPalette(boosted1, palette);
            break;
          case "edge hue":
            let sum = 0;
            let count = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue; // skip self
                const neighbor = getColourAt(x + dx, y + dy, width, originalData);
                sum += hueSimilarity(currentColour, neighbor);
                count++;
              }
            }
            const avgSim = sum / count;

            const boosted = Math.pow(avgSim, 1.2);
            newColour = gradientFromPalette(boosted, palette);
            break;

          default:
            console.error("Via: ", via, " not implemented");
            break;
        }
        imageData.data[i] = newColour.red;
        imageData.data[i + 1] = newColour.green;
        imageData.data[i + 2] = newColour.blue;
      }
    }

    context.putImageData(imageData, 0, 0);
  }
  function gradientFromPaletteMap(palette: Map<string, number>) {}
  function sortPalette(colours: Map<string, number>, algorithm: string): Map<string, number> {
    switch (algorithm) {
      case "frequency":
        return new Map([...colours.entries()].sort((a, b) => b[1] - a[1]));
      case "naive luminance":
        return sortBy(colours, getLuma);
      case "lightness":
        return sortBy(colours, getLightness);
      case "saturation":
        return sortBy(colours, getSaturation);
      case "hue":
        return sortBy(colours, getHue);
      default:
        console.error("Sorting Algorithm Chosen has not yet been implemented");
        return colours;
    }
  }
  // Handle image loading and canvas drawing
  async function loadImageAndProcess(file: File) {
    const url = URL.createObjectURL(file);
    imageURL = url;

    const image = new Image();

    try {
      // Wait for the image to load
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = url; 
      });

      if (!canvasEl) return;

      const w = image.naturalWidth;
      const h = image.naturalHeight;
      canvasWidth = w;
      canvasHeight = h;

      const context = canvasEl.getContext("2d", { willReadFrequently: true });
      if (!context) return;

      await new Promise(requestAnimationFrame);

      context.drawImage(image, 0, 0, w, h);
      if (palette.colours.size === 0) {
        const imageData = context.getImageData(0, 0, w, h);
        const colours = getPaletteColours(
          imageData,
          palette.settings.numberOfColours,
          palette.settings.differenceOfColour,
          palette.settings.Algorithm,
          palette.settings.downsampleRate
        );
        palette.colours = colours;
      }
    } catch (error) {
      console.error("Failed to load or process image", error);
      imageURL = null; // Clear the URL on error
    }
  }
  $effect(() => {
    if (imageFile) {
      loadImageAndProcess(imageFile);
    }
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  });
  $effect(() => {
    if (palette && palette.colours.size > 1) {
      updateGradientLine();
    }
  });

  function updateGradientLine() {
    if (gradientLineElement) {
      gradientLineElement.style.background = `linear-gradient(to right, ${Array.from(palette.colours.keys()).join(", ")})`;
    }
  }

  function clearImage() {
    imageFile = null;
    imageURL = null;
    if (inputElement) {
      console.log("2 file bug stopper");
      inputElement.value = ""; //This stops the 2 of the same file in a row not registering problem.
    }
    canvasWidth = 0;
    canvasHeight = 0;
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    const id = target.id;
    const files = event.dataTransfer?.files;
    loadFile(id, files);
  }

  function handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    const id = input.id;
    loadFile(id, files);
  }

  function twoFiles() {
    console.error("Please drop only one file");
  }

  function loadFile(id: string, files: FileList | null | undefined) {
    if (!files || files.length === 0) return;
    if (files.length >= 2) {
      twoFiles();
    } else {
      imageFile = files[0];
    }
  }
  function applySettings() {
    if (!canvasEl || canvasWidth === 0 || canvasHeight === 0) {
      console.error("No image loaded to apply settings");
      return;
    }
    paletteMixedStatus = false;
    paletteSortMethodCounter = 0;
    const context = canvasEl.getContext("2d", { willReadFrequently: true });
    if (!context) {
      console.error("Failed to get canvas context");
      console.error("Failed to get canvas context");
      return;
    }
    const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    const colours = getPaletteColours(
      imageData,
      palette.settings.numberOfColours,
      palette.settings.differenceOfColour,
      palette.settings.Algorithm,
      palette.settings.downsampleRate
    );
    palette.colours = colours;
    dispatch("paletteUpdated", { colours: palette.colours });
  }

  function resetImage() {
    if (!imageFile) {
      console.error("No image file loaded to reset");
      return;
    }
    if (!imageURL || !canvasEl) {
      console.error("No image loaded to reset");
      return;
    }
    const context = canvasEl.getContext("2d", { willReadFrequently: true });
    if (!context) {
      console.error("Failed to get canvas context");
      return;
    }
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    const image = new Image();
    image.src = imageURL;
    image.onload = () => {
      console.log("Resetting image on canvas");
      context.drawImage(image, 0, 0);
    };
  }

  function savePalette() {
    if (palette.colours.size === 0) {
      console.error("No palette to save");
      return;
    }
    // const data = JSON.stringify(Array.from(palette.colours.entries()));
    const paletteObject = mapToObject(palette.colours);
    const data = JSON.stringify(paletteObject, null, 2); // nicely formatted
    console.log(data);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const name = imageFile ? (imageFile.name.length < 12 ? imageFile.name : imageFile.name.slice(0, 11)) : "your";
    a.download = name + "-palette.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  async function saveImage() {
    // convert canvas content to a Blob
    const nameFile = imageFile?.name + "-gradient-mapped.png";
    if (canvasEl) {
      canvasEl.toBlob(async (blob) => {
        if (!blob) {
          console.error("Failed to create image blob.", "error");
          return;
        }

        if (navigator.share) {
          try {
            // create a file object from the Blob

            const file = new File([blob], nameFile, {
              type: "image/png",
            });

            // use navigator.share to share the image
            await navigator.share({
              files: [file],
              title: "Gradient Mapping",
              text: "Check out my drawing from the web app!",
            });
            console.error("Image shared successfully!", "success");
          } catch (error) {

            console.error("Image sharing cancelled.", "error");
            console.error("Error sharing image:", error);
          }
        } else {
          // Fallback
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = nameFile;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a); //clean up
          URL.revokeObjectURL(url);
          console.log("Image downloaded successfully!", "success");
        }
      }, "image/png");
    }
    if (!canvasEl) {
      console.error("No canvas!");
    }
  }
  //sorting palette. Need to add a UI Element with a little sorting icon
</script>

<div class="data">
  <div class="Image Options">
    <div class="optionIconHolder">
      <button onclick={clearImage} title="Remove Image"><MageX style="font-size: 1.2rem" /></button>
      <button onclick={resetImage} title="Reset Image"><MageReset style="font-size: 1.2rem" /></button>
      <button onclick={saveImage} title="Save Image"><MageFileDownload style="font-size: 1.2rem" /></button>
      <button onclick={savePalette} title="Save Palette"><MageColorSwatch style="font-size: 1.2rem" /></button>
    </div>
    <!-- <div class="optionIconHolder"></div> -->
  </div>
  <div class="imageHolder input" id="canvas{name}" ondrop={handleDrop} ondragover={handleDragOver} aria-hidden="true">
    <PaletteExtractionOptions on:applySettings={applySettings} bind:settings={palette.settings} bind:display={showPEO} />
    {#if imageURL}
      <canvas bind:this={canvasEl} width={canvasWidth} height={canvasHeight} class="containedImage"></canvas>
    {/if}
    <label for="paletteFileInput{name}">
      <MageImageAdd style="font-size: 3em" />
    </label>
    <input type="file" id="paletteFileInput{name}" accept="image/*" hidden onchange={handleFileInput} bind:this={inputElement} />
  </div>
  <PaletteBox bind:palette />
  <ApplyGMapOptions on:applyMap={handleApplyMap} />
</div>

<style>
  /* * {
    outline: 1px solid #0009 !important;
  } */
  .Options {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: var(--secondary-color);
    gap: 0.25em;
    padding: 0.25em;
  }
  .Options button,
  input {
    flex: 1;
    border: none;
    appearance: none;
    background-color: var(--primary-color);
    transition: box-shadow 0.3s;
    &:hover {
      box-shadow: inset 0 0 0.2em #000;
    }
  }
  button,
  input,
  select {
    font-size: inherit;
  }
  .Options button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .data {
    flex: 1;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    text-overflow: clip;
    outline: 1px solid black;
    background-color: var(--secondary-color);
    box-shadow: 0 3px 10px #333;
  }
  .containedImage {
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .optionIconHolder {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 0.25em;
  }
  @media (max-width: 850px) {
    .imageHolder {
      width: 100%;
    }
    .data {
      font-size: 0.8rem;
    }
    .data {
      width: 100%;
    }
  }
  @media (max-width: 480px) {
    .data {
      font-size: 0.6rem;
    }
    .Options {
      flex: 2;
    }
    .abs {
      height: 50%;
    }
  }

  .imageHolder {
    flex: 15;
    background-color: var(--background-color);
    box-shadow: inset 0 0 10px #0003;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* outline: 1px solid hsl(0, 0%, 40.5%); */
  }
  button,
  input {
    border: none;
    appearance: none;
  }

  @keyframes fadeColorIn {
    from {
      color: #0000;
    }
    to {
      color: #0009;
    }
  }
  canvas {
    z-index: 6;
    position: absolute;
  }
  input {
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
</style>
