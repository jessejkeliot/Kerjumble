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
      aria-label="Close Stats Button"
      on:click={() => {
        dispatch("closeButtonClicked");
      }}
    >
    <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="4096.00" height="4096.00" viewBox="0 0 4096.0 4096.0">		<g id="document" transform="scale(1.0 1.0) translate(2048.0 2048.0)">			<g>				<path d="M-896.939,-1356.4 L-1356.4,-896.939 L896.939,1356.4 L1356.4,896.939 L-896.939,-1356.4 Z "  fill-opacity="1.00" />				<path d="M896.939,-1356.4 L1356.4,-896.939 L-896.939,1356.4 L-1356.4,896.939 L896.939,-1356.4 Z "  fill-opacity="1.00" />			</g>		</g>	</svg>
  </button>
  </div>
  <div id=defsContainer>
  {#each [...fetchedLocalStats.games].reverse() as game (game.number)}
    <div class="divider"></div>
    <p class="dictionaryNumbering">{game.number}.</p>

    <InformationContainer
      inputDisabled
      inputValue={questions[game.number].word}
      display={{
        word: questions[game.number].word,
        type: questions[game.number].type,
        definition: questions[game.number].definitions[0],
      }}
    />

  {/each}
  <div class="divider invisible"></div>
</div>
{:else}
  <p>Can't fetch Stats</p>
{/if}

<style>
  #defsContainer {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 70%;
    outline: 1px solid red;
  }
  p.dictionaryNumbering {
    font-size: var(--small-text);
    margin: var(--boxpaddingxsmall) 0;
    padding: 0;
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
