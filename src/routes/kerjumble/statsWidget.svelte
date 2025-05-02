<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { localStats } from "./types";
  const dispatch = createEventDispatcher();
  export let fetchedLocalStats: localStats = {
    games: [],
    meanAverageFinalHealth: 0,
    streak: 0,
  };
</script>

<div class="statsFlexHolder">
  <div class="statsHolder">
    <p>Average: {fetchedLocalStats.meanAverageFinalHealth.toFixed(2)}</p>
    <div class="divider"></div>
    <p>Streak: {fetchedLocalStats.streak}</p>
  </div>
  <button
    class="Holder Icon"
    on:click={() => {
      dispatch("statsExitClicked");
    }}
  >
    <img
      src="src/lib/images/Kerjumble/icons/x_icon_kerjumble.svg"
      alt="cross mark"
    />
  </button>
</div>
<style>
    div.divider {
    position: relative;
    width: 100%;
    margin: var(--boxpaddingxsmall) 0;
    background-color: var(--primary-color);
    height: var(--border-width);
  }
  div.statsFlexHolder {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  div.statsHolder {
    width: 50%;
    text-align: center;
    font-size: var(--medium-text);
    background: var(--secondary-color);
    padding: var(--boxpaddingmedium);
    border-radius: var(--classic-border-radius);
    margin-bottom: var(--boxpaddingxsmall);
    outline: 2px solid var(--primary-color) !important;
  }
  div.statsHolder p {
    padding: 0;
    margin: 0;
  }
  img {
    display: block;
    height: var(--medium-text);
    height: 80%;
    outline: 3px dashed teal;
    /* margin: 3px; */
    /* padding: 3px; */
  }
  button {
    border: none;
    border-radius: var(--classic-border-radius);
    background: var(--secondary-color);
    background: none;
  }
  .Holder {
    /* justify-content: center;
    align-items: center; */
    margin: 0 0;
    outline: 2px solid purple;
    padding: none;
  }
  .Holder.Icon {
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--medium-text);
    width: 100%;
    min-width: var(--medium-text);
    min-height: var(--medium-text);
    font-family: inherit;
    font-size: var(--medium-text);
    max-width: 2.5rem;
    padding: 0;
    background-color: var(--secondary-color);
  }
</style>
