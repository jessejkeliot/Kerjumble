<script lang="ts">
  import "./style.css";
  import type { Definition, gameState, Question, settingState } from "./types";
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
  let day = getDaysDifferenceUTC("2025-04-14");
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
  //sounds
  function playSound(filename: string) {
    if (!browser) return;
    const clickSound = new Audio("/sounds/" + filename);
    clickSound.volume = 0.4;
    clickSound.play();
  }

  const useCache: boolean = false;
  let ss_: settingState = getSettingState();
  let gs_: gameState | null = getGameState();
  if (gs_ && useCache) {
    if (number == gs_.number) {
      health = gs_.health;
      inputValue = gs_.currentInput;
      won = gs_.won;
    } else {
    }
  } else {
    console.log("First time playing!");
    saveGameState(health, number, inputValue, won);
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
  function saveGameState(
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
  function getGameState() {
    if (!browser) {
      return null;
    }
    const returnString = localStorage.getItem("gameState");
    if (returnString) {
      var returnvalue = JSON.parse(returnString);
    }
    return returnvalue;
  }
  function getState(name: string) {
    if (!browser) {
      return null;
    }
    const returnString = localStorage.getItem(name);
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
  $: saveGameState(health, day, inputValue, won);
  $: {
    if (guessedWord == question.word) {
      won = true;
      playSound("click3_kerjumble.mp3");
      // click3.play();
    } else if (guessedWord !== "") {
      // click4.play();
      health--;
      inputValue = "";
      health==0 ? playSound('click6_kerjumble.mp3') :
      playSound("click9_kerjumble.mp3");
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
      display={{
        word: "Kerjumble",
        type: "noun",
        definition:
          "A game where you have to guess a word from a jumbled definition: the bars above represent how many guesses you have left.",
      }}
    />
  {:else if health == 0 && !won}
    <InformationContainer
      {health}
      inputDisabled={true}
      inputValue="loser"
      display={{
        word: "loser",
        type: "noun",
        definition: "A person that does not win a game; you.",
      }}
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
</style>
