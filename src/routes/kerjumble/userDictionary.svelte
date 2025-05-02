<script lang="ts">
  import InformationContainer from "./informationContainer.svelte";
  import type { gameState } from "./types";

  export let games: gameState[];
  export let questions;
</script>

{#each [...games].reverse() as game (game.number)}
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

<style>
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
</style>
