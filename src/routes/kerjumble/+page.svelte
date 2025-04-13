<script lang="ts">
  import type { Question } from "./types";
  import Header from "./header.svelte";
  import { onMount } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import type { FocusEventHandler } from "svelte/elements";
  import questionsJson from "$lib/images/Kerjumble/questions.json";
  import { getDaysDifferenceUTC } from "./types";
  import { fade } from "svelte/transition";
  const questions: Question[] = questionsJson as Question[];
  //   const savedStates = localStorage.getItem("");
  let question: Question;
  let number = getDaysDifferenceUTC("2025-04-13");
  let inputDisabled = false;
  let inputValue = ""; //same as below
  let health = 7; //later use the savedStates object;
  const maxHealth = 7;
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

  let guessedWord = "";
  question = getQuestionObject();
  let won = false;
  $: {
    if (guessedWord == question.word) {
      won = true;
      // runLoopWithDelay();
      health = 0;
      console.log("Finiiiii");
      inputDisabled = true; //change the styling of disabled button
      //   inputValue = "yay!";
    } else if (guessedWord !== "") {
      health--;
      inputValue = "";
      if(health==0){
        inputValue="better luck next time";
        inputDisabled = true;
      }
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
<div class="health-bar" style="background-color:{won ? 'green' : '#d00'}">
  {#each Array.from({ length: health }) as _, index}
    <div
      transition:shrinkFlex
      class="bar"
      style="flex: {index < health ? 1 : 0};
        background-color: {health == 1 ? 'darkred' : 'var(--primary-color)'}"
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
  :root {
    --boxmarginmedium: 3rem;
    --boxmarginsmall: 0.8rem;
    --boxpaddingmedium: 2rem;
    --boxpaddingsmall: 0.8rem;
    --boxpaddingxsmall: 0.5rem;

    --border-width: 0.2rem;

    --text-color: #001;
    --primary-color: #001;
    --mid-grey: #ddd;
    --tertiary-color: #29b;
    --background-color: #fff;

    --xsmall-text: 0.8rem;
    --small-text: 1.3rem;
    --medium-text: 1.7rem;
    --large-text: 3rem;

    box-sizing: border-box;

    font-family: var(--font-body);
    font-family: Georgia, "Times New Roman", Times, serif;
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
    /* outline: 1px dotted black; */
    outline: none;
    width: 100%;
    transition: font-weight 0.2s ease;
    /* border-bottom: 0.2rem solid black; */
    /* animation: blink 1s ease infinite; */
  }
  @keyframes blink {
    0% {
      background-color: transparent;
    }
    50% {
      background-color: transparent;
    }
    51% {
      background-color: black;
    }
    100% {
      background-color: black;
    }
  }
  div.health-bar {
    margin: 0 0 0 0;
    padding: 0px;
    display: flex;
    flex-wrap: wrap;
    /* gap: 10px; */
    height: calc(var(--boxpaddingmedium) / 2);
    width: 100%;
    background-color: #d00;
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
      color: #ddd;
    }

    50% {
      color: #fff;
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
    color: #666;
  }
  div.descriptionContainer {
    font-size: var(--medium-text);
    margin: var(--boxpaddingxsmall) 0;
    text-wrap: pretty;
  }
</style>
