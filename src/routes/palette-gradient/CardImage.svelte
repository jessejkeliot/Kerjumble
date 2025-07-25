<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import MageImageAdd from "~icons/mage/image-plus";
  import { getPaletteColours } from "./functions";
  import type { paletteSettings, paletteState } from "./types";

  let { name } = $props();
  let defaultSettings: paletteSettings = {
    numberOfColours: 5,
    differenceOfColour: 60,
    Algorithm: "histogram",
    downsampleRate: "1",
  };

  let palette: paletteState = $state({
    colours: [],
    settings: { ...defaultSettings },
  });
  let imageFile: File | null = $state(null);
  let imageURL: string | null = $state(null);
  let canvasEl: HTMLCanvasElement | null = $state(null);
  let canvasWidth: number = $state(0);
  let canvasHeight: number = $state(0);

  //could have a check if the settings have changed before applying

  let inputElement: HTMLInputElement | null = $state(null);

  let gradientLineElement: HTMLDivElement | null = $state(null);

  let dispatch = createEventDispatcher();

  // Handle image loading and canvas drawing
  async function loadImageAndProcess(file: File) {
    const url = URL.createObjectURL(file);
    imageURL = url; // Update state so the template can show the canvas

    const image = new Image();

    try {
      // Wait for the image to load using a Promise
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = url; // Start loading
      });

      if (!canvasEl) return;

      const w = image.naturalWidth;
      const h = image.naturalHeight;
      canvasWidth = w;
      canvasHeight = h;

      const context = canvasEl.getContext("2d", { willReadFrequently: true });
      if (!context) return;

      // Ensure canvas is ready for drawing
      await new Promise(requestAnimationFrame);

      context.drawImage(image, 0, 0, w, h);
      if (palette.colours.length === 0) {
        const imageData = context.getImageData(0, 0, w, h);
        const colours = getPaletteColours(
          imageData,
          palette.settings.numberOfColours,
          palette.settings.differenceOfColour,
          palette.settings.Algorithm
        );
        palette.colours = colours;
      }
    } catch (error) {
      console.error("Failed to load or process image", error);
      imageURL = null; // Clear the URL on error
    }
    // We don't revoke the URL here because the <img> tag might still need it.
    // The cleanup in $effect will handle it.
  }
  $effect(() => {
    // This effect now ONLY reacts to changes in imageFile.
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
    if (palette && palette.colours.length > 1) {
      updateGradientLine();
    }
  });

  function updateGradientLine() {
    if (gradientLineElement) {
      gradientLineElement.style.background = `linear-gradient(to right, ${palette.colours.join(", ")})`;
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
      palette.settings.Algorithm
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

  function getDarkness(colour: string): number {
    const r = parseInt(colour.slice(1, 3), 16);
    const g = parseInt(colour.slice(3, 5), 16);
    const b = parseInt(colour.slice(5, 7), 16);
    return (r + g + b) / 3;
  }

  function savePalette() {
    if (palette.colours.length === 0) {
      console.error("No palette to save");
      return;
    }
    const data = JSON.stringify(palette.colours);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.json";
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="data">
  <div class="Image Options">
    <button onclick={clearImage}>Clear Image</button>
    <button onclick={resetImage}>Reset Image</button>
    <button onclick={() => (imageFile = null)}>Save Image</button>
    <button onclick={savePalette}>Save Palette</button>
  </div>
  <div
    class="imageHolder input"
    id="canvas{name}"
    ondrop={handleDrop}
    ondragover={handleDragOver}
    aria-hidden="true"
  >
    {#if imageURL}
      <canvas
        bind:this={canvasEl}
        width={canvasWidth}
        height={canvasHeight}
        class="containedImage"
      ></canvas>
    {/if}
    <label for="paletteFileInput{name}">
      <MageImageAdd style="font-size: 3em" />
    </label>
    <input
      type="file"
      id="paletteFileInput{name}"
      accept="image/*"
      hidden
      onchange={handleFileInput}
      bind:this={inputElement}
    />
  </div>
  <div class="paletteDisplay">
    {palette.colours.length <= 0 ? "palette" : ""}
    {#each palette.colours as colour, i}
      <div class="colour">
        <button
          aria-label="colour copy"
          style="background-color: {colour}; color: {getDarkness(colour) < 70
            ? 'white'
            : 'black'}"
          role="cell"
          tabindex={i}
          onclick={() => navigator.clipboard.writeText(colour)}
        ></button>
      </div>
    {/each}
  </div>
  <div class="gradientLine" bind:this={gradientLineElement}></div>
  <div class="configBox">
    <label for="algorithms">
      Algo:
      <select
        name="Algorithm"
        id="algorithms"
        bind:value={palette.settings.Algorithm}
      >
        <option value="histogram">Histogram</option>
        <option value="k-means">K-means</option>
      </select>
    </label>
    <label for="paletteSize">
      n:
      <input
        type="number"
        name="paletteSize"
        id="paletteSize"
        min="2"
        max="50"
        bind:value={palette.settings.numberOfColours}
      />
    </label>
    <label for="colourDifference">
      diff:
      <input
        type="number"
        name="colourdiff"
        id="colourDifference"
        min="2"
        max="120"
        bind:value={palette.settings.differenceOfColour}
      />
    </label>
    <label for="downsampling">
      reduce:
      <select
        name="Algorithm"
        id="downsampling"
        bind:value={palette.settings.downsampleRate}
      >
        <option value="1" selected>1x</option>
        <option value="2">2x</option>
        <option value="4">4x</option>
        <option value="8">8x</option>
        <option value="16">16x</option>
      </select>
    </label>
    <button class="apply" onclick={applySettings}>Apply</button>
  </div>
</div>

<style>
  /* * {
    outline: 1px solid #0009 !important;
  } */
  .apply {
    font-size: inherit;
  }
  .gradientLine {
    height: 3%;
    width: 100%;
    background: #000;
    outline: 1px solid #000;
  }
  .configBox {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 0.5em;
    padding: 0 0.5em;
    margin-top: 1rem;
  }
  .Options {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: #c5c5c5;
    outline: 1px solid black;
    gap: 0.25em;
    padding: 0.25em;
  }
  .Options button {
    flex: 1;
  }
  button,
  input,
  select {
    font-size: inherit;
  }
  .data {
    flex: 1;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    text-overflow: clip;
  }
  .paletteDisplay {
    flex: 2;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 20;
    /* height: 10%; */
    background-color: #c5c5c5;
    outline: 1px solid black;
    width: 100%;
  }
  .colour {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: none;
    height: 100%;
    outline: 1px solid black;
  }
  .colour button {
    width: 100%;
    height: 100%;
    border: none;
  }

  .containedImage {
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
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
  }

  .imageHolder {
    flex: 15;
    background-color: #f9f9f9;
    box-shadow: inset 0 0 10px #0003;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    outline: 1px solid hsl(0, 0%, 40.5%);
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
    z-index: 20;
    position: absolute;
  }
  input {
    z-index: 5;
  }
</style>
