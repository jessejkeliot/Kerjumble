<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import type { Definition } from "./types";
  const dispatch = createEventDispatcher();

  export let health = 0;
  export let display: Definition;
  export let inputDisabled: boolean;
  export let inputValue: string;
  let shareButtonText = "Share";

  //whether to show buttons
  function handleShare() {
    console.log("Share Clicked");
    // navigator.canShare() ? navigator.share() : navigator.clipboard.writeText("Ker");
    try {
      navigator.share({ text: "Kerjumble", title: "Kerjumble Results" });
    } catch (error) {
      navigator.clipboard.writeText("resultRepresentation");
    }
    shareButtonText = "Copied!";
  }
  function handleSendEnter(){
    dispatch("wordEntered", {word: inputValue});
  }
  onMount(() => {
    if (window.innerWidth > 480) {
      focusAnswerBox();
    }
    
    // question = getQuestionObject();
  });
  export function focusAnswerBox() {
    const input = document.getElementById("answerBox");
    if (input) {
      input.focus();
    } // Focus on the input
  }
//   focusAnswerBox();
</script>

<div class="wordContainer">
  <input
    class="guessBox"
    id="answerBox"
    bind:value={inputValue}
    on:keydown={(e) => {
      if (e.key === "Enter") {
        handleSendEnter();
      }
    }}
    disabled={inputDisabled}
    type="text"
    maxlength="14"
    placeholder="guess"
    autocapitalize="on"
    spellcheck="false"
    autocomplete="off"
  />
  <!-- <div class="underline"></div> -->
  <div class="typeContainer">{display.type}</div>
  <div class="descriptionContainer">
    <p>{health==0 ? display.definition : display.definition.toLowerCase()}</p>
  </div>
  {#if health == 0}
    <div class="shareButtonContainer">
      <!-- svelte-ignore a11y_mouse_events_have_key_events -->
      <button
        style="background-color: var(--primary-color);"
        on:click={handleShare}
        transition:fade={{
          duration: 500,
          delay: 0,
        }}>{shareButtonText}</button
      >
      <button>Stats</button>
      <button>League</button>
    </div>
  {/if}
</div>

<style>
    .shareButtonContainer {
      width: 100%;
      margin: var(--boxpaddingmedium) 0;
      outline: 1px solid blueviolet;
      display: flex;
      justify-content: space-between;
      gap: var(--boxpaddingxsmall);
      position: relative;
    }
    .shareButtonContainer button {
      margin: 0;
      padding: var(--boxpaddingsmall);
      /* width: 50%; */
      width: calc(100% / 3);
      background-color: var(--primary-color);
      color: var(--background-color);
      border-radius: var(--classic-border-radius);
      border: none;
      font-family: Helvetica, sans-serif;
      font-size: var(--small-text);
      font-style: italic;
      transition: background-color 0.3s 0.1s;
    }
    .guessBox {
      margin: 0;
      padding: 0;
      border: none;
      height: calc(var(--large-text) + 0.2em);
      overflow: visible;
      text-transform: lowercase;
      font-size: var(--large-text);
      font-family: inherit;
      font-weight: lighter;
      caret-color: #000;
      outline: 1px dotted black;
      outline: none;
      width: 100%;
      transition: font-weight 0.2s ease;
      /* border-bottom: 0.2rem solid black; */
      /* animation: blink 1s ease infinite; */
    }
    .guessBox::placeholder {
      color: var(--mid-grey);
      animation: blinkText 2.5s infinite reverse;
      animation-delay: 2.5s;
    }
    .guessBox:disabled {
      background-color: inherit;
      /* font-weight: bold; */
      color: var(--text-color);
      opacity: 1;
      -webkit-text-fill-color: var(--text-color);
    }
    .descriptionContainer p {
      margin: 0;
      padding: 0;
    }
  
    /* @media screen and (max-width: 480px) {
    .guessBox:focus::placeholder{
      color:transparent;
      animation: none;
    }
  } */
    /* .guessBox:focus{
      outline: none;
    } */
    /* .guessBox:focus-visible {
      outline: 3px solid black;
    } */
    @keyframes blinkText {
      0%,
      100% {
        color: var(--mid-grey);
      }
  
      50% {
        color: var(--background-color);
      }
    }
    div.wordContainer {
    position: relative;
    width: 80%;
    outline: 1px dashed salmon;
    min-width: 10rem;
    max-width: 45rem;
    margin: 0 auto;
    /* display: block; */
    text-align: left;
  }
  div.typeContainer {
    font-size: var(--medium-text);
    font-style: italic;
    margin: var(--boxpaddingxsmall) 0;
    color: var(--type-grey);
  }
  div.descriptionContainer {
    font-size: var(--medium-text);
    margin: var(--boxpaddingxsmall) 0 0 0;
    text-wrap: stable;
    /* outline: 1px solid black */
  }
    
</style>
