<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  const dispatch = createEventDispatcher();
    export let showReveal = false;
  let shareButtonText = "Share";

  //whether to show buttons
  function handleSendShare() {
    dispatch("shareButtonClicked");
    shareButtonText = "Copied!";
  }
  function handleSendReveal() {
    dispatch("revealButtonClicked");
    showReveal = false;
  }
</script>

<div class="buttonContainer" in:fade={{delay: 300}}>
  <!-- svelte-ignore a11y_mouse_events_have_key_events -->
  <button id="share" on:click={handleSendShare}
    >{shareButtonText}</button
  >
  <button id="statistics" >Stats</button>
  

  {#if showReveal}
    <button  id="reveal" on:click={handleSendReveal}>Reveal</button>
  {/if}
</div>

<style>
    div.revealHolder {
        margin: 0;
        padding: 0;
        flex: 1;
        display: flex;
    }
  .buttonContainer {
    width: 100%;
    margin: var(--boxpaddingmedium) 0;
    outline: 1px solid blueviolet;
    display: flex;
    /* justify-content: space-between; */
    flex-direction: row;
    gap: var(--boxpaddingxsmall);
    position: relative;
  }
  .buttonContainer button {
    flex: 0.5;
    margin: 0;
    padding: var(--boxpaddingsmall);
    /* width: 50%; */
    /* width: calc(100% / 3); */
    background-color: var(--primary-color);
    color: var(--background-color);
    background-color: var(--secondary-color);
    color: var(--text-color);
    border-radius: var(--classic-border-radius);
    border: none;
    font-family: Helvetica, sans-serif;
    font-size: var(--small-text);
    font-style: italic;
    transition: background-color 0.3s 0.1s;
  }
  #reveal {
    flex: 1;
    height: 100%;
  }
</style>
