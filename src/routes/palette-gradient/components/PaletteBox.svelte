<script lang="ts">
  import { createEventDispatcher, tick } from "svelte";
  import { fisherYates, interpolateColor } from "$lib/functions/functions";
  import type { colour, paletteState } from "$lib/types/types";
  import "../style.css";
  import { sortBy } from "$lib/functions/sorts";
  import { getLuma, getHue, getLightness, getSaturation, hexToColour } from "../../../lib/functions/colourfunctions";
  import { preventDefault } from "svelte/legacy";
    import { actionHistory } from "../shared.svelte";
  let { palette = $bindable(), name} = $props<{ palette: paletteState, name:string}>();
  //   let palette = $props();
  const map = new Map<string, number>();
  const paletteSorts = ["frequency", "luminance", "saturation", "hue"];
  let paletteSortMethodCounter = $state(0);
  let paletteSortMethodName = $derived(paletteSorts[paletteSortMethodCounter]);
  let paletteMixedStatus = false;
  let paletteFile: File | null = $state(null);
  //   let brightnessOfMiddleColours = $derived(getLuma(hexToColour(palette.colours.keys()[palette.colours.size/2])))

  let sortMethodDisplayFade = $state(false);
  let sortMethodDisplayTimer: ReturnType<typeof setTimeout> = setTimeout(()=> "", 0);
  

  //could have a check if the settings have changed before applying

  let inputElement: HTMLInputElement | null = $state(null);

  let gradientLineElement: HTMLDivElement | null = $state(null);

  let dispatch = createEventDispatcher();
  function handleMixPalette() {
    paletteMixedStatus = true;
    const shuffled = fisherYates<string>(Array.from(palette.colours.keys()));
    let newMap: Map<string, number> = new Map<string, number>();
    for (let i = 0; i < shuffled.length; i++) {
      //palette.colours.get(shuffled[i]) becuase shuffled is an array made from the keys of p.colours.
      newMap.set(shuffled[i], palette.colours.get(shuffled[i])!);
    }
    palette.colours = newMap;
  }
  function handleSortPalette() {
    if (!paletteMixedStatus) {
      paletteSortMethodCounter++;
      paletteSortMethodCounter %= paletteSorts.length;
    } else {
      paletteSortMethodCounter = 0; // sorting algorithm resets after you have been mixing
    }
    console.log("Sorting Palette by: ", paletteSortMethodName);
    palette.colours = sortPalette(palette.colours, paletteSortMethodName);
    paletteMixedStatus = false;
  }
  function handleReversePalette() {
    palette.colours = new Map([...palette.colours.entries()].reverse());
  }
  function sortPalette(colours: Map<string, number>, algorithm: string): Map<string, number> {
    if (sortMethodDisplayFade) {
      clearTimeout(sortMethodDisplayTimer)
    }
      sortMethodDisplayFade = true;
      sortMethodDisplayTimer = setTimeout(() => {
        sortMethodDisplayFade = false;
      }, 600);
    switch (algorithm) {
      case "frequency":
        return new Map([...colours.entries()].sort((a, b) => b[1] - a[1]));
      case "luminance":
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
  $effect(() => {
    if (palette && palette.colours.size > 1) {
      updateGradientLine();
    }
  });
  $effect(() => {
    if (paletteFile) {
    }
  });

  function updateGradientLine() {
    if (gradientLineElement) {
      gradientLineElement.style.background = `linear-gradient(to right, ${Array.from(palette.colours.keys()).join(", ")})`;
    }
  }

  function handleDragOver(event: DragEvent) {
    // make the palette a dropable area to import palettes
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
      let text: string = "";
      paletteFile = files[0];
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          // this will then display a text file
          console.log("starting palette load");
          if (typeof reader.result == "string") {
            text = reader.result;
            const colourMap = new Map<string, number>(Object.entries(JSON.parse(text)));
            palette.colours = colourMap;
            console.log("Successful");
          } else {
            console.log(typeof reader.result);
            console.error("Palette load failed");
          }
        },
        false
      );
      reader.readAsText(paletteFile);
    }
  }
  function handleColourClick(event: MouseEvent, colour: string) {
    event.preventDefault();
    if (event.shiftKey) {
      palette.colours.delete(colour);
      palette.colours = new Map(palette.colours);
    } else {
      navigator.clipboard.writeText(colour);
    }
  }
  //sorting palette. Need to add a UI Element with a little sorting icon
  //if we make the palette functions done outside of the palette component then we won't need a bind? It will just take it as a prop
</script>

<div class="paletteBox">
  <div class="palettePlusGradientBox" ondrop={handleDrop} ondragover={handleDragOver} role="region">
    <div class="paletteDisplay">
      <div class="sortMethodDisplay {sortMethodDisplayFade}">
        {paletteSortMethodName}
      </div>
      {palette.colours.size <= 0 ? "palette" : ""}
      {#each palette.colours.keys() as colour, i}
        <div class="colour">
          <button
            aria-label="colour copy"
            style="background-color: {colour}; color: {getLuma(hexToColour(colour)) < 0.3 ? 'white' : 'black'}"
            role="menuitem"
            tabindex={i}
            onclick={(event) => handleColourClick(event, colour)} title={colour}></button
          >
        </div>
      {/each}
    </div>
    <div class="gradientLine" bind:this={gradientLineElement}></div>
  </div>
  <div class="paletteOptions">
    <button onclick={handleMixPalette}>Mix</button>
    <button onclick={handleSortPalette}>Sort</button>
    <button onclick={handleReversePalette}>Reverse</button>
  </div>
</div>

<style>
  /* * {
    outline: 1px solid #0009 !important;
  } */
  .colourPreview {
    font-size: 0.6em;
    opacity: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .colourPreview:hover {
    overflow: visible;
    opacity: 1;
  }
  .sortMethodDisplay {
    position: absolute;
    opacity: 0;
    transition: opacity 0.5s;
  }
  .sortMethodDisplay.true {
    opacity: 1;
    transition: opacity 0.2s;
    user-select: text;
    z-index: 3;
  }
  .sortMethodDisplay.false {
    opacity: 0;
    user-select: none;
    z-index: 0;
  }
  .paletteBox {
    flex: 2;
    display: flex;
    flex-direction: row;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    gap: 0.35em;
    padding: 0.35em;
    background-color: var(--secondary-color);
  }
  @media (max-width: 480px) {
    .paletteBox {
      flex: 3;
    }
  }
  .paletteOptions {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  }
  .paletteOptions button {
    flex: 1;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.45em;
    font-size: 0.85em;
    font-weight: 500;
    color: var(--text-color);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 65%),
                var(--primary-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: filter 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  }
  .paletteOptions button:hover {
    filter: brightness(1.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }
  .paletteOptions button:active {
    transform: translateY(1px);
    filter: brightness(0.95);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  .palettePlusGradientBox {
    display: flex;
    flex-direction: column;
    flex: 7;
    border-radius: 0.5em;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  .gradientLine {
    flex: 1;
    width: 100%;
    background: var(--background-color);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  button {
    font-size: inherit;
  }
  .paletteDisplay {
    flex: 2;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 20;
    /* height: 10%; */
    background-color: var(--secondary-color);
    /* outline: 1px solid black; */
    width: 100%;
  }
  .colour {
    box-sizing: border-box;
    flex: 1;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    height: 100%;
    /* outline: 1px solid black; */
    border-radius: 0;
    padding: none;
  }
  .colour button {
    width: 100%;
    height: 100%;
    padding: none;
    border: none;
    border-radius: 0;
  }
</style>
