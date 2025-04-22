<script lang="ts">
  import "./style.css";
  import type { gameState, Question } from "./types";
  import Header from "./header.svelte";
  import { onMount } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import type { FocusEventHandler } from "svelte/elements";
  import questionsJson from "$lib/images/Kerjumble/questions.json";
  import { getDaysDifferenceUTC } from "./types";
  import { fade, fly } from "svelte/transition";
  import { browser } from "$app/environment";
  import HealthBar from "./healthBar.svelte";
  const questions: Question[] = questionsJson as Question[];
  //   const savedStates = localStorage.getItem("");
  let question: Question;
  let day = getDaysDifferenceUTC("2025-04-15");
  console.warn(questionsJson.length);
  let number = day % (questionsJson.length);
  let inputDisabled = false;
  let inputValue: string = ""; //same as below
  const maxHealth = 7;
  let health = maxHealth; //later use the savedStates object;
  let finalHealth = maxHealth;
  let won = false;
  const useCache: boolean = false;
  let gs: gameState | null = getState();
  if (gs && useCache) {
    if (number == gs.number) {
      health = gs.health;
      inputValue = gs.currentInput;
      won = gs.won;
    } else {
    }
  } else {
    saveState(health, number, inputValue, won);
  }
  //get the gameState with getState and then compare the number from
  //state and number above to see whether the local storage should be cleared or read from

  onMount(() => {
    if (window.innerWidth > 480) {
      focusAnswerBox();
    }
    // question = getQuestionObject();
  });
  function removePlaceholder() {
    // if (window.innerWidth < 480) {
    //   document.getElementById("answerBox")?.removeAttribute("placeholder");
    // }
  }
  function focusAnswerBox() {
    const input = document.getElementById("answerBox");
    if (input) {
      input.focus();
    } // Focus on the input
  }

  function getQuestionObject() {
    let q;
    q = questions[number];
    return q;
  }
  function handleEnter() {
    guessedWord = inputValue;
    console.log(guessedWord);
  }
  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function runLoopWithDelay() {
    for (let i = 0; i < health; i++) {
      // console.log(`Iteration ${i}`);
      health--;
      await delay(50); // wait 500ms before next iteration
    }
  }
  function saveState(
    health: number,
    number: number,
    inputValue: string,
    won: boolean
  ) {
    // localStorage.clear();
    if (!browser) {
      return;
    }
    const gs: gameState = {
      health: health,
      number: number,
      currentInput: inputValue,
      won: won,
    };
    localStorage.setItem("gameState", JSON.stringify(gs));
  }
  function getState() {
    if (!browser) {
      return null;
    }
    const returnString = localStorage.getItem("gameState");
    if (returnString) {
      var returnvalue = JSON.parse(returnString);
    }
    return returnvalue;
  }
  let shareButtonText = "Share";
  let shareButtonColor = "var(--primary-color)";
  function handleShare(){
    console.log("Share Clicked");
    // navigator.canShare() ? navigator.share() : navigator.clipboard.writeText("Ker");
    try {
      navigator.share({text: "Kerjumble", title: "Kerjumble Results"});
    } catch (error) {
      navigator.clipboard.writeText("resultRepresentation");
    }
    shareButtonText = "Copied!";
  }
  function handleShareMouseDown(){
    shareButtonColor = "var(--type-grey)";
  }
  function handleShareMouseUp(){
    shareButtonColor = "var(--primary-color)";
  }
  function createShareText() {

  }
  function finished() {
    inputDisabled = true;
    document.getElementById("answerBox")?.blur();
    createShareText();
    finalHealth = health;
    health = 0;
  }
  function lost() {
    finished();
    inputValue = "loser";
    question.type = "noun";
    question.definitions[0] =
      "The person looking at the screen at this moment; you.";
    question.definitions[0] = "A person that does not win a game; you.";
    console.log("Lost ", day);
  }
  function win() {
    finished();
    console.log("Won ", day);
  }
  let guessedWord = "";
  question = getQuestionObject();
  $: if (won) {
    win();
  }
  $: if (health == 0 && !won) {
    lost();
  }
  $: saveState(health, day, inputValue, won);
  $: {
    if (guessedWord == question.word) {
      won = true;
      // runLoopWithDelay();
      //   inputValue = "yay!";
    } else if (guessedWord !== "") {
      health--;
      inputValue = "";
      // if (health == 0) {
      //   lost();
      // }
    }
  }
  // transitions.ts
  export function shrinkFlex(node: Element, { duration = 700 } = {}) {
    const style = getComputedStyle(node);
    const initialFlex = parseFloat(style.flexGrow);

    return {
      duration,
      css: (t: number) => {
        const eased = cubicInOut(t);
        return `flex-grow: ${eased * initialFlex};`;
      },
    };
  }
</script>

<title>Kerjumble</title>
<Header number = {day}></Header>
<HealthBar bind:won bind:health></HealthBar>
<div class="questionContainer">
  <div class="wordContainer">
    <input
      class="guessBox"
      id="answerBox"
      bind:value={inputValue}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          handleEnter();
        }
      }}
      on:focus={() => {
        removePlaceholder();
      }}
      disabled={inputDisabled}
      type="text"
      maxlength="14"
      placeholder="guess"
      autocapitalize="off"
    />
    <!-- <div class="underline"></div> -->
    <div class="typeContainer">{question.type}</div>
    <div class="descriptionContainer">
      <p>{question.definitions[Math.max(0, health - 1)]}</p>
    </div>
    {#if health == 0}
      <div class="shareButtonContainer">
        <!-- svelte-ignore a11y_mouse_events_have_key_events -->
        <button
        style="background-color: {shareButtonColor};"
        on:click={handleShare}

          transition:fade={{
            duration: 500,
            delay:0
          }}>{shareButtonText}</button
        >
        <button>Stats</button>
        <button>League</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .shareButtonContainer {
    width: 100%;
    margin: var(--boxpaddingmedium) 0;
    outline: 1px solid blueviolet;
    display: flex;
    justify-content: space-between;
    gap: var(--boxpaddingxsmall);
    position: absolute;
  }
  .shareButtonContainer button {
    margin: 0;
    padding: var(--boxpaddingsmall);
    /* width: 50%; */
    width: calc(100% /3);
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

  div.questionContainer {
    /* top: 20% */
    /* width: 20%; */
    max-height: 25rem;
    /* min-width: 10rem; */
    /* margin-top: var(--boxmarginmedium); */
    /* max-width: 50rem; */
    padding: calc(var(--boxpaddingmedium) / 2) var(--boxpaddingmedium);
    position: relative;
    /* top: 30%; */
    width: auto;
    margin: 0 0;
    aspect-ratio: 1;
    /* height: fit-content; */
    background-color: var(--background-color);
    /* border: 3px solid var(--primary-color); */
    outline: 3px dotted deeppink;
    text-align: center;
    font-size: 3rem;
    display: flex;
    flex-direction: column;
    /* justify-items: center;  */
    align-items: center;
  }
  @media screen and (min-width: 480px) {
    div.questionContainer {
      flex-direction: row;
      padding: 0 var(--boxpaddingmedium);
    }
  }

  div.wordContainer {
    position: relative;
    width: auto;
    outline: 1px dashed salmon;
    min-width: 10rem;
    max-width: 45rem;
    margin: 0;
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
