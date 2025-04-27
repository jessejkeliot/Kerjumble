<script lang="ts">
  import "./style.css";
  import type { Definition, gameState, Question, settingState } from "./types";
  import Header from "./header.svelte";
  import { onDestroy, onMount, tick } from "svelte";
  import questionsJson from "$lib/images/Kerjumble/questions.json";
  import { getDaysDifferenceUTC, playSound } from "./types"; //functions
  import { browser } from "$app/environment";
  import HealthBar from "./healthBar.svelte";
  import InformationContainer from "./informationContainer.svelte";
  import SettingsWidget from "./settingsWidget.svelte";
  import { get } from "svelte/store";

  //   const savedStates = localStorage.getItem("");
  const startDate: string = "2025-04-13";
  const questions: Question[] = questionsJson as Question[];
  let question: Question;
  let day = getDaysDifferenceUTC(startDate);
  let checkInterval: number;
  // console.warn(questionsJson.length);
  let number = day % questionsJson.length;
  //input
  let inputDisabled = false;
  let inputValue: string = ""; //same as below
  //gameState
  const maxHealth = 5;
  let health = maxHealth; //later use the savedStates object;
  let finalHealth = maxHealth;
  let won = false;
  //settingState
  let configurations: settingState;

  //menus
  let helpOpen = false;
  let settingsOpen = false;
  //sounds
  const useCache: boolean = true;
  let ss_: settingState | null = getSettingState();
  if (useCache) {
    configurations = getSettingState();
  }
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
    helpOpen = true;
    saveGameState(health, number, inputValue, won);
  }
  //get the gameState with getState and then compare the number from
  //state and number above to see whether the local storage should be cleared or read from

  onMount(() => {
    if (window.innerWidth > 480) {
      focusAnswerBox();
    }
    checkInterval = setInterval(() => {
      const newDay = getDaysDifferenceUTC(startDate);
      if (newDay !== day) {
        // the day changed — reload the game state
        location.reload(); // OR update question manually
      }
    }, 60 * 1000); // check every minute
    // question = getQuestionObject();
  });
  onDestroy(() => {
    clearInterval(checkInterval);
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
  function handleShare() {
    console.log("Share Clicked");
    // navigator.canShare() ? navigator.share() : navigator.clipboard.writeText("Ker");
    try {
      navigator.share({ text: "Kerjumble", title: "Kerjumble Results" });
    } catch (error) {
      navigator.clipboard.writeText("resultRepresentation");
    }
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
  function saveState(
    name: string, object: any
  ) {
    // localStorage.clear();
    if (!browser) {
      return;
    }
    localStorage.setItem(name, JSON.stringify(object));
  }
  function getGameState() {
    return getItemFromLocalStorage("gameState");
  }
  function getItemFromLocalStorage(name: string) {
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
  $: saveState("settingState", configurations);
  $: saveGameState(health, day, inputValue, won);
  $: {
    if (guessedWord == question.word) {
      won = true;
      playSound("click4_kerjumble.mp3");
      // click3.play();
    } else if (guessedWord !== "") {
      // click4.play();
      health--;
      inputValue = "";
      health == 0
        ? playSound("click6_kerjumble.mp3")
        : playSound("click9_kerjumble.mp3");
      // if (health == 0) {
      //   lost();
      // }
    }
  }
  //menus
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


  function getSettingState(): settingState {
    // throw new Error("Function not implemented.");
    return getItemFromLocalStorage("settingState");
  }
</script>

<title>Kerjumble</title>
<Header number={day} bind:helpOpen bind:settingsOpen></Header>
<HealthBar bind:won bind:health></HealthBar>
<div class="MenuContainer">
  {#if settingsOpen}
    <SettingsWidget bind:configurations></SettingsWidget>
  {:else if helpOpen}
    <InformationContainer
      inputDisabled={true}
      inputValue="Kerjumble"
      display={{
        word: "Kerjumble",
        type: "noun",
        definition:
          "A game where you have to guess a word from a jumbled definition.",
      }}
      capitalise
    />
    <div class="hints"><li>There are no plurals.</li>
    <li>Words are generally short and simple.</li>
    <li>The bars above represent how many guesses you have left.</li>
    <li>A green bar at the top indicates you have won.</li>
    <li>press the &#9932 in the corner to begin</li>
    </div>
    <!-- <div class="helpCloseHintContainer">
      press the &#9932 in the corner to begin
    </div> -->
    <!-- lose -->
  {:else if health == 0 && !won}
    <InformationContainer
      inputDisabled={true}
      inputValue="loser"
      display={{
        word: "loser",
        type: "noun",
        definition: "A person that does not win a game; you.",
      }}
      showButtons
      on:shareButtonClicked={handleShare}
      showReveal
    />
    <!-- currently playing OR win -->
  {:else}
    <InformationContainer
      bind:inputDisabled
      bind:inputValue
      bind:display
      showButtons={won}
      on:shareButtonClicked={handleShare}
      on:wordEntered={handleReceiveEnter}
    ></InformationContainer>
  {/if}
</div>

<style>
  div.helpCloseHintContainer {
    margin: var(--boxpaddingsmall);
    padding: none;
    outline: 2px solid burlywood;
    font-size: var(--small-text);
  }
  div.hints {
    text-align: left;
    position: relative;
    width: auto;
    margin: var(--boxpaddingxsmall)0 0 0;
    padding: none;
    outline: 2px solid burlywood;
    font-size: var(--small-text);
  }
  div.MenuContainer {
    /* top: 20% */
    /* width: 20%; */
    max-height: 30rem;
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
    div.MenuContainer {
      /* outline: 4px solid blue; */
      justify-content: center;
      /* flex-direction: row; */
      /* padding: 5rem 0 ; */
    }
  }
</style>
