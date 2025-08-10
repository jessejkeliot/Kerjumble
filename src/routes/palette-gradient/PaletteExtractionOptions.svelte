<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { paletteSettings, paletteState } from "./types";
  const map = new Map<string, number>();
  let { settings = $bindable(), display = $bindable() } = $props();
  const paletteAlgorithms = ["histogram", "k-means"];
  let paletteAlgorithmCounter = $state(0);
  $effect(() => {
    settings.Algorithm = paletteAlgorithms[paletteAlgorithmCounter];
  });
  const paletteSorts = ["frequency", "naive luminance", "saturation", "hue"];
  let paletteSortMethodCounter = $state(0);

  //could have a check if the settings have changed before applying

  let dispatch = createEventDispatcher();
  // Handle image loading and canvas drawing

  //sorting palette. Need to add a UI Element with a little sorting icon
</script>

<div class="configBox {display}" class:available={display}>
  <div class="showhide">
    <button onclick={() => (display = !display)} title="Toggle Palette Extraction Options"
      >{display ? "hide" : "show"}</button
    >
  </div>
  {#if display}
    <div class="rest">
      <div>
        <button
          onclick={() =>
            paletteAlgorithmCounter === 1
              ? (paletteAlgorithmCounter = 0)
              : (paletteAlgorithmCounter = 1)}
          >{paletteAlgorithms[paletteAlgorithmCounter]}</button
        >
      </div>
      <div>
        n=
        <input
          type="number"
          name="paletteSize"
          id="paletteSize"
          min="2"
          max="50"
          bind:value={settings.numberOfColours}
        />
      </div>
      <div>
        diff=
        <input
          type="number"
          name="colourdiff"
          id="colourDifference"
          min="2"
          max="120"
          bind:value={settings.differenceOfColour}
        />
      </div>
      <div>
        dsample:
        <select
          name="Algorithm"
          id="downsampling"
          bind:value={settings.downsampleRate}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="8" selected>8</option>
          <option value="16">16</option>
        </select>
      </div>
    </div>
    <div class="get">
      <button onclick={() => dispatch("applySettings")}>Get</button>
    </div>
  {/if}
</div>

<style>
  .configBox.available {
    background-color: var(--secondary-color);
  }
  .showhide {
    width: 10%;
  }
  .rest {
    flex: 7;
  }
  .rest div {
    width: 100%;
  }
  .get {
    font-size: inherit;
    flex: 1;
  }
  .configBox {
    position: relative;
    flex: 2;
    display: flex;
    align-items: center;
    z-index: 25;
    gap: 0.25em;
    padding: 0.25em;
    background-color: transparent;
  }
  .configBox div {
    z-index: 8;
    height: 100%;
    font-family: inherit;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  button,
  input,
  select {
    font-size: inherit;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    appearance: none;
    border: none;
    background-color: var(--primary-color);
    transition: box-shadow 0.2s;
    &:hover {
      box-shadow: inset 0 0 2px #000;
    }
  }

  button,
  select,
  input {
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
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
</style>
