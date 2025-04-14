<script lang="ts">
  import './style.css';
  import type { gameState, Question } from "./types";
  import Header from "./header.svelte";
  import { onMount } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import type { FocusEventHandler } from "svelte/elements";
  import questionsJson from "$lib/images/Kerjumble/questions.json";
  import { getDaysDifferenceUTC } from "./types";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  const questions: Question[] = questionsJson as Question[];
  //   const savedStates = localStorage.getItem("");
  let question: Question;
  let number = getDaysDifferenceUTC("2025-04-13");
  let inputDisabled = false;
  let inputValue: string = ""; //same as below
  const maxHealth = 7;
  let health = maxHealth; //later use the savedStates object;
  let won = false;
  const useCache : boolean = true;
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
  function lost(){
    inputValue = "loser";
    inputDisabled = true;
  }
  let guessedWord = "";
  question = getQuestionObject();
  $: if (won) {
    health = 0;
    console.log("Finiiiii");
    inputDisabled = true; //change the styling of disabled button
  }
  $: if(health==0 && !won){
    lost();
  }
  $: saveState(health, number, inputValue, won);
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
<Header {number}></Header>
<div class="health-bar" style="background-color:{won ? 'var(--win-green)' : '#d00'}">
  {#each Array.from({ length: health }) as _, index}
    <div
      transition:shrinkFlex
      class="bar"
      style="flex: {index < health ? 1 : 0};
        background-color: {health == 1 ? 'var(--mid-red)' : 'var(--primary-color)'}"
    ></div>
  {/each}
</div>
<div class="questionContainer">
  <div class="wordContainer">
    <input
      bind:value={inputValue}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          handleEnter();
        }
      }}
      on:focus={() => {
        removePlaceholder();
      }}
      id="answerBox"
      disabled={inputDisabled}
      class="guessBox"
      type="text"
      maxlength="14"
      placeholder="guess"
      autocapitalize="off"
      
    />
    <!-- <div class="underline"></div> -->
    <div class="typeContainer">{question.type}</div>
    <div class="descriptionContainer">
      {question.definition}
    </div>
  </div>
</div>

<style>

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
    /* outline: 1px dotted black; */
    outline: none;
    width: 100%;
    transition: font-weight 0.2s ease;
    /* border-bottom: 0.2rem solid black; */
    /* animation: blink 1s ease infinite; */
  }
  div.health-bar {
    margin: 0 0 0 0;
    padding: 0px;
    display: flex;
    flex-wrap: wrap;
    /* gap: 10px; */
    height: calc(var(--boxpaddingmedium) / 2);
    width: 100%;
    background-color: var(--lose-red);
  }

  .bar {
    /* margin: inherit;
    padding: inherit; */
    /* margin: 0 1px; */
    flex: 1;
    padding: inherit;
    background-color: var(--primary-color);
    background-color: var(--mid-grey);
    outline: 2px solid var(--background-color);
    transition:
      flex 0.5s ease,
      background-color 1s ease;
  }
  .health-bar:first-child {
    margin-left: 0;
  }
  .health-bar:last-child {
    margin-right: 0;
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
    /* outline: 3px dotted deeppink; */
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
    /* outline: 1px dashed salmon; */
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
    margin: var(--boxpaddingxsmall) 0;
    text-wrap: pretty;
  }
</style>
