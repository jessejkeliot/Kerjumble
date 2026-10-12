<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { paletteSettings, paletteState } from "$lib/types/types";
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
    <button onclick={() => (display = !display)} title="Toggle Palette Extraction Options">{display ? "hide" : "show"}</button>
  </div>
  {#if display}
    <div class="rest">
      <div>
        <button onclick={() => (paletteAlgorithmCounter === 1 ? (paletteAlgorithmCounter = 0) : (paletteAlgorithmCounter = 1))}
          >{paletteAlgorithms[paletteAlgorithmCounter]}</button
        >
      </div>
      <div>
        n=
        <input type="number" name="paletteSize" id="paletteSize" min="2" max="50" bind:value={settings.numberOfColours} />
      </div>
      <div>
        diff=
        <input type="number" name="colourdiff" id="colourDifference" min="2" max="120" bind:value={settings.differenceOfColour} />
      </div>
      <div>
        dsample:
        <select name="Algorithm" id="downsampling" bind:value={settings.downsampleRate}>
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
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .showhide {
    width: clamp(55px, 14%, 75px);
  }
  .rest {
    flex: 7;
    display: flex;
    gap: 0.35em;
  }
  .rest div {
    flex: 1;
    color: var(--text-color);
    font-size: 0.9em;
    gap: 0.2em;
    user-select: none;
  }
  .get {
    font-size: inherit;
    width: clamp(45px, 10%, 65px);
  }
  .configBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    z-index: 22;
    gap: 0.35em;
    padding: 0.35em;
    box-sizing: border-box;
    background: rgba(40, 40, 40, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    height: clamp(24px, 8%, 38px);
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }
  @media (max-width: 480px) {
    .configBox {
      height: clamp(28px, 13%, 42px);
    }
  }
  .configBox div {
    z-index: 26;
    height: 100%;
    font-family: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button,
  input,
  select {
    font-size: inherit;
    font-weight: 500;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0.2em 0.4em;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 0.45em;
    color: var(--text-color);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 65%),
                var(--primary-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: filter 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  }
  button:hover,
  select:hover {
    filter: brightness(1.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }
  button:active {
    transform: translateY(1px);
    filter: brightness(0.95);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  input {
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.05) 100%),
                var(--primary-color);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
    cursor: text;
    text-align: center;
  }
  input:focus,
  select:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.15);
  }
  select {
    text-align-last: center;
  }
  select option {
    background-color: var(--secondary-color);
    color: var(--text-color);
  }
</style>
