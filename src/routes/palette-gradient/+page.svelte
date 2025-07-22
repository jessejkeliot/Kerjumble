<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import MageImageAdd from "~icons/mage/image-plus";
  import CardImage from "./CardImage.svelte";
  import { settings } from "./shared.svelte";
  import OutputCard from "./OutputCard.svelte";

  // Image files and previews
  let paletteImage: File | null = $state(null);
  let paletteImageURL: string | null = $state(null);
  let paletteEl: HTMLCanvasElement | null = $state(null);
  let paletteHeight = $state(0);
  let paletteWidth = $state(0);
  let canvasImage: File | null = $state(null);
  let canvasImageURL: string | null = $state(null);

  // Create preview URLs when image files are set
  $effect(() => {
    if (paletteImage) {
      paletteImageURL = URL.createObjectURL(paletteImage);
    }
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
    const files = input.files;
    const id = input.id;

    loadFile(id, files);
  }
  function loadFile(id: string, files: FileList | null | undefined) {
    if (!files || files.length === 0) return;

    if (files.length >= 2) {
      paletteImage = files[0];
      canvasImage = files[1];
    } else {
      const file = files[0];
      if (id.startsWith("palette")) {
        paletteImage = file;
      } else if (id.startsWith("canvas")) {
        canvasImage = file;
      }
    }
  }
  function onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    paletteWidth = img.naturalWidth;
    paletteHeight = img.naturalHeight;
    if (!paletteEl) return;
    paletteEl.width = paletteWidth;
    paletteEl.height = paletteHeight;
    const ctx = paletteEl.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    // MAIN PIXEL LOOP:
    const imageData = ctx.getImageData(0, 0, paletteWidth, paletteHeight);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Example: invert colors
      data[i] = 255 - data[i]; // R
      data[i + 1] = 255 - data[i + 1]; // G
      data[i + 2] = 255 - data[i + 2]; // B
      // Alpha unchanged (data[i + 3])
    }
    ctx.putImageData(imageData, 0, 0);
  }
</script>

<div class="whole">
  <div class="title"><h1>Palette Generator</h1></div>
  <div class="middlebox">
    <div class="IOContainer">
      <!-- Palette Drop Zone -->
      <CardImage></CardImage>

      <!-- Canvas Drop Zone -->
      <OutputCard></OutputCard>
    </div>
    <div class="settingsHolder">
      <label for="algorithms"
        >Algorithm:
        <select name="Algorithm" id="algorithms" bind:value={settings.Algorithm}>
          <option value="histogram">Histogram</option>
          <option value="k-means">K-means</option>
        </select>
      </label>
      <label for="paletteSize">
        n:
        <input type="range" name="paletteSize" id="paletteSize" bind:value={settings.numberOfColours}>
      </label>
      <label for="colourDifference">
        diff:
        <input type="range" name="colourdiff" id="colourDifference" min="2" max="50" bind:value={settings.differenceOfColour}>
      </label>
      <button type="button">Apply</button>
    </div>
  </div>
</div>

<!-- STYLES -->
<style>
  * {
    /* outline: 1px solid #0009 !important; */
  }
  input[type="range"]{
    accent-color: green;
    min-width: none;
    width: 50%;
  }
  .middlebox {
    display: flex;
    flex-direction: column;
    height: 70%;
    width: 75%;
    border-radius: 1rem;
    align-items: center;
  }
  .settingsHolder {
    width: 66%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }

  .containedImage {
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .whole {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .title {
    font-family: Helvetica;
    font-style: italic;
    display: flex;
    align-items: center;
  }

  .title h1 {
    color: #fff0;
    text-shadow: 0 0 20px #222;
    font-size: 5rem;
    margin: 0;
    animation: fadeColorIn 1.2s ease 1s forwards;
    user-select: none;
  }

  .IOContainer {
    flex: 9;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    gap: 1rem;
    width: 100%;
    max-width: 1000px;
    outline: 3px solid #e9e9e9;
  }

  @media (max-width: 600px) {
    .IOContainer {
      flex-direction: column;
    }
    .imageHolder {
      width: 100%;
    }
    .title h1 {
      font-size: minmax(10vw, 5rem);
    }
  }

  .imageHolder {
    flex: 1;
    height: 100%;
    background-color: #f9f9f9;
    border-radius: 0.5rem;
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
</style>
