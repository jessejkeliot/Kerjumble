<script lang="ts">
  import "./style.css";
  import type { localStats, Question } from "./types";
  import { createEventDispatcher } from "svelte";
  import InformationContainer from "./informationContainer.svelte";
  const dispatch = createEventDispatcher();
  export let questions: Question[];
  export let fetchedLocalStats: localStats | undefined;
</script>

{#if fetchedLocalStats}
  <div class="statsFlexHolder">
    <div class="statsHolder">
      <p>Average: {fetchedLocalStats.meanAverageFinalHealth.toFixed(2)}</p>
      <div class="divider"></div>
      <p>Streak: {fetchedLocalStats.streak}</p>
    </div>
    <button
      class="Holder Icon"
      on:click={() => {
        dispatch("closeButtonClicked");
      }}
    >
      <img
        src="src/lib/images/Kerjumble/icons/x_icon_kerjumble.svg"
        alt="cross mark"
      />
    </button>
  </div>
  {#each [...fetchedLocalStats.games].reverse() as game (game.number)}
    <div class="divider"></div>
    <!-- <p class="dictionaryNumbering">{game.number}.</p> -->
    <div id="wc">
      <div class="gram">

    <InformationContainer
      inputDisabled
      inputValue={questions[game.number].word}
      display={{
        word: questions[game.number].word,
        type: questions[game.number].type,
        definition: questions[game.number].definitions[0],
      }}
    />
  </div>
  </div>
  {/each}
  <div class="divider invisible"></div>
{:else}
  <p>Can't fetch Stats</p>
{/if}

<style>
  .gram {
    /* background-color: aliceblue; */
    margin: auto 0;
    width: 70%;
    /* height: 50%; */
  }
  #wc {
    /* background-color: blue; */
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  p.dictionaryNumbering {
    font-size: var(--small-text);
    margin: var(--boxpaddingxsmall) 0;
    padding: 0;
    color: var(--text-color);
  }
  .divider.invisible {
    background-color: transparent;
  }
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
