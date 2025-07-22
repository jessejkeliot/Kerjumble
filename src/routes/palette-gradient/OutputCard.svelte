<script lang="ts">
  import MageImageAdd from "~icons/mage/image-plus";
  import { getPaletteColours } from "./functions";

  // Image files and previews
  let canvasImage: File | null = $state(null);
  let canvasImageURL: string | null = $state(null);
  let canvasEl: HTMLCanvasElement | null = $state(null);
  let canvasHeight = $state(0);
  let canvasWidth = $state(0);

  // Create preview URLs when image files are set
  $effect(() => {
    if (canvasImage) {
      canvasImageURL = URL.createObjectURL(canvasImage);
    }
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
    console.log(input.id);
    const files = input.files;
    const id = input.id;

    loadFile(id, files);
  }
  function twoFiles() {}
  function loadFile(id: string, files: FileList | null | undefined) {
    if (!files || files.length === 0) return;

    if (files.length >= 2) {
      twoFiles();
    } else {
      canvasImage = files[0];
    }
  }
  //Get HTMLImageElement
  //use offscreen canvas to run palette algorithm
  //use another offscreen canvas to apply the palette algorithm
  function onImageLoad(event: Event) {
    console.log("Running ONimageload");
    const img = event.target as HTMLImageElement;

    const offscreen = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
    const canvasContext = offscreen.getContext("2d");

    const image = new Image();
    image.onload = function () {
      console.log("starting the onload");
      canvasContext?.drawImage(image, 0, 0);

      const imageData = canvasContext?.getImageData(
        0,
        0,
        offscreen.width,
        offscreen.height
      );

      if (imageData) {
        
      } else {
        console.log("No imageData after drawImage");
      }
    };

    if (canvasImageURL) {
      image.src = canvasImageURL;
    } else {
      console.log("No string in the image url yet.");
    }
  }

  function getDarkness(colour: string): number {
    const r = parseInt(colour.slice(1, 3), 16);
    const g = parseInt(colour.slice(3, 5), 16);
    const b = parseInt(colour.slice(5, 7), 16);
    return (r + g + b) / 3; // Average of RGB values
  }
</script>

<div class="data">
  <div
    class="imageHolder input"
    id="output imageHolder"
    ondrop={handleDrop}
    ondragover={handleDragOver}
    aria-hidden="true"
  >
    {#if canvasImageURL}
      <img
        src={canvasImageURL}
        alt="canvas preview"
        class="containedImage"
        onload={onImageLoad}
      />
    {/if}
    <label for="outputFileInput">
      <MageImageAdd style="font-size: 3rem" />
    </label>
    <input
      type="file"
      id="outputFileInput"
      accept="image/*"
      hidden
      onchange={handleFileInput}
    />
  </div>
</div>

<style>
  * {
    outline: 1px solid #0009 !important;
  }
  .data {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #c5c5c5;
    text-overflow: clip;
  }
  .paletteDisplay {
    display: flex;
    flex-direction: row;
    z-index: 20;
    /* height: 10%; */
    width: 100%;
    flex: 1;
  }
  .colour {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: none;
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
    flex: 9;
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
