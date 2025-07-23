<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import MageImageAdd from "~icons/mage/image-plus";
  import { generatePalette } from "./functions";
  import type { paletteSettings, paletteState } from "./types.ts";

  let { name } = $props();
  let defaultSettings: paletteSettings = {
    numberOfColours: 5,
    differenceOfColour: 30,
    Algorithm: "histogram",
    downsampleRate: 1,
  };

  let palette: paletteState = $state({
    colours: [],
    settings: { ...defaultSettings },
  });
  // Image files and previews
  let originalImageFile: File | null = $state(null);
  let imageFile: File | null = $state(null);
  let imageURL: string | null = $state(null);
  let imageElement: HTMLImageElement | null = $state(null);

  let dispatch = createEventDispatcher();

  // Create preview URLs when image files are set
  $effect(() => {
    if (imageFile) {
      imageURL = URL.createObjectURL(imageFile);
    } else {
      imageURL = null;
    }
  });
  $effect(() => {
    imageFile = originalImageFile;
  });
  $effect(() => {
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  });
  function handleDragOver(event: DragEvent) {
    event.preventDefault(); // Required for allowing drop
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
    console.log(input.id);

    loadFile(id, files);
  }
  function twoFiles() {}
  function loadFile(id: string, files: FileList | null | undefined) {
    if (!files || files.length === 0) return;

    if (files.length >= 2) {
      twoFiles();
    } else {
      originalImageFile = files[0];
    }
  }
  //Get HTMLImageElement
  //use offscreen canvas to run palette algorithm
  //use another offscreen canvas to apply the palette algorithm
  function onImageLoad(event: Event) {
    console.log("Running ONimageload");
    if (!(event.target instanceof HTMLImageElement)) {
      console.error("Event target is not an HTMLImageElement");
      return;
    }
    const img = event.target as HTMLImageElement;
    if (imageURL) {
      const p = generatePalette(img, { ...palette.settings });
      if (p) {
        palette.colours = p;
      }
    }
  }
  function applySettings() {
    if (imageElement && imageURL) {
      const p = generatePalette(imageElement, { ...palette.settings });
      if (p) {
        palette.colours = p;
      }
    } else {
      toast();
    }
  }
  function toast() {}
  function getDarkness(colour: string): number {
    const r = parseInt(colour.slice(1, 3), 16);
    const g = parseInt(colour.slice(3, 5), 16);
    const b = parseInt(colour.slice(5, 7), 16);
    return (r + g + b) / 3; // Average of RGB values
  }
  //image option buttons must be done.
</script>

<div class="data">
  <div class="Image Options">
    <button onclick={() => (imageFile = null)}>Clear Image</button>
    <button onclick={() => (imageFile = originalImageFile)}>Reset Image</button>
    <button onclick={() => (imageFile = null)}>Save Image</button>
    <button onclick={() => (imageFile = null)}>Save Palette</button>
  </div>
  <div
    class="imageHolder input"
    id="canvas{name}"
    ondrop={handleDrop}
    ondragover={handleDragOver}
    aria-hidden="true"
  >
    {#if imageURL}
      <img
        src={imageURL}
        alt="canvas preview"
        class="containedImage"
        onload={onImageLoad}
        bind:this={imageElement}
      />
    {/if}
    <label for="paletteFileInput{name}">
      <MageImageAdd style="font-size: 3rem" />
    </label>
    <input
      type="file"
      id="paletteFileInput{name}"
      accept="image/*"
      hidden
      onchange={handleFileInput}
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
          onclick={() => {
            navigator.clipboard.writeText(colour);
          }}
        ></button>
      </div>
    {/each}
  </div>
  <div class="configBox">
    <label for="algorithms"
      >Algo:
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
      downsample
      <select
        name="Algorithm"
        id="downsampling"
        bind:value={palette.settings.downsampleRate}
      >
        <option value="1">1x</option>
        <option value="2">2x</option>
        <option value="4" class="red">4x</option>
        <option value="8">8x</option>
        <option value="16">16x</option>
      </select>
    </label>
    <button onclick={applySettings}>Apply</button>
  </div>
</div>

<style>
  * {
    /* outline: 1px solid #0009 !important; */
  }
  .configBox {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 0.5rem;
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
  .data {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
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

  @media (max-width: 600px) {
    .imageHolder {
      width: 100%;
    }
    .data {
      width: 100%;
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
