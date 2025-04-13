<script lang="ts">
  import Meaning from "./meaning.svelte";
  import Header from "./header.svelte";
  import { onMount } from "svelte";
  import type { FocusEventHandler } from "svelte/elements";

  let question;
  onMount(() => {
    if (window.innerWidth > 480) {
      focusAnswerBox();
    }
    question = getQuestionObject();
  });
  function removePlaceholder() {
    if (window.innerWidth < 480) {
      document.getElementById("answerBox")?.removeAttribute("placeholder");
    }
  }
  function focusAnswerBox() {
    const input = document.getElementById("answerBox");
    if (input) {
      input.focus();
    } // Focus on the input
  }
  function getQuestionObject() {
    
  }

  let guessedWord: string;
  //   question = getQuestionObject();
  //   const answerWord = question.word;
  //   let won = false;
  //   $: {
  //     if(guessedWord == answerWord){
  //         won = true;
  //     }
  //   }
</script>

<Meaning></Meaning>
<Header></Header>
<title>Kerjumble</title>
<div class="questionContainer">
  <div class="wordContainer">
    <input
      bind:value={guessedWord}
      on:focus={() => {
        removePlaceholder();
      }}
      id="answerBox"
      class="guessBox"
      type="text"
      maxlength="14"
      placeholder="guess"
      autocapitalize="off"
    />
    <!-- <div class="underline"></div> -->
    <div class="typeContainer">noun</div>
    <div class="descriptionContainer">
      a set of wires, covered by plastic, that carries electricity, phone
      signals
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
    outline: 1px dotted black;
    width: 100%;
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
  .underline {
    position: relative;
    margin: 0;
    padding: 0;
    /* background-color: red; */
    font-size: var(--xsmall-text);
    /* margin-left: calc(var(--large-text) /2); */
    height: 0.2rem;
    width: calc(var(--large-text) / 2);
    animation: blink 1s ease infinite;
  }
  .guessBox::placeholder {
    color: #ddd;
    animation: blinkText 0.5s infinite alternate;
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
    0% {
      color: #fff;
    }

    100% {
      color: #ddd;
    }
  }

  div.questionContainer {
    /* top: 20% */
    /* width: 20%; */
    max-height: 25rem;
    /* min-width: 10rem; */
    /* margin-top: var(--boxmarginmedium); */
    /* max-width: 50rem; */
    padding: var(--boxpaddingmedium);
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
    }
  }

  div.wordContainer {
    position: relative;
    width: auto;
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
    color: #666;
  }
  div.descriptionContainer {
    font-size: var(--medium-text);
    margin: var(--boxpaddingxsmall) 0;
    text-wrap: pretty;
  }
</style>
