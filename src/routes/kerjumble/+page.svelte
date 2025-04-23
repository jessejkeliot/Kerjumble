<script lang="ts">
  import "./style.css";
  import type { Definition, gameState, Question } from "./types";
  import Header from "./header.svelte";
  import { onMount, tick } from "svelte";
  import questionsJson from "$lib/images/Kerjumble/questions.json";
  import { getDaysDifferenceUTC } from "./types";
  import { browser } from "$app/environment";
  import HealthBar from "./healthBar.svelte";
  import InformationContainer from "./informationContainer.svelte";
  import SettingsWidget from "./settingsWidget.svelte";
  //   const savedStates = localStorage.getItem("");
  const questions: Question[] = questionsJson as Question[];
  let question: Question;
  let day = getDaysDifferenceUTC("2025-04-15");
  // console.warn(questionsJson.length);
  let number = day % questionsJson.length;
  //input
  let inputDisabled = false;
  let inputValue: string = ""; //same as below
  //gameState
  const maxHealth = 7;
  let health = maxHealth; //later use the savedStates object;
  let finalHealth = maxHealth;
  let won = false;
  //menus
  let helpOpen = false;
  let settingsOpen = false;

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
    console.log("First time playing!");
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
  function handleReceiveEnter() {
    guessedWord = inputValue;
    console.log(guessedWord);
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
  function createShareText() {}
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
  let display: Definition = {
    word: inputValue,
    type: question.type,
    definition: question.definitions[health - 1],
  };

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
  //menus
  let tempGuess = "";
  // $: inputValue = helpOpen ? "Kerjumble" : tempGuess;
  // $: if (helpOpen) {
  //   tempGuess = inputValue;
  //   inputValue = "Kerjumble";
  //   inputDisabled = true;
  // } else if (inputValue == "Kerjumble") {
  //   inputValue = tempGuess;
  //   inputDisabled = false;

  //   tick().then(() => {
  //     focusAnswerBox();
  //   });
  // }
  $: display.type = question.type;
  $: display.definition = question.definitions[Math.max(0, health - 1)];
</script>

<title>Kerjumble</title>
<Header number={day} bind:helpOpen bind:settingsOpen></Header>
<HealthBar bind:won bind:health></HealthBar>
<div class="questionContainer">
  {#if settingsOpen}
    <SettingsWidget></SettingsWidget>
  {:else if helpOpen}
    <InformationContainer
      bind:health
      inputDisabled={true}
      inputValue="Kerjumble"
      display={{word: "Kerjumble", type: "noun", definition:"A game where you have to guess a word from a jumbled definition: the bars above represent how many guesses you have left."}}
    />
  {:else}
    <InformationContainer
      bind:health
      bind:inputDisabled
      bind:inputValue
      bind:display
      on:wordEntered={handleReceiveEnter}
    ></InformationContainer>
  {/if}
</div>

<style>
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
    width: 100%;
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
</style>
