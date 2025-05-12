<script lang="ts">
  import StatsPage from "./statsPage.svelte";
  import "./style.css";
  import type {
    Definition,
    gameState,
    localStats,
    Question,
    settingState,
  } from "./types";
  import Header from "./header.svelte";
  import { onDestroy, onMount } from "svelte";
  import questionsJson from "$lib/images/Kerjumble/questionsEdited.json";
  import {
    defaultSettingState,
    getDaysDifferenceUTC,
    playSound,
    setTheme,
    saveState,
    getItemFromLocalStorage,
  } from "./types"; //functions
  import { browser } from "$app/environment";
  import HealthBar from "./healthBar.svelte";
  import InformationContainer from "./informationContainer.svelte";
  import SettingsWidget from "./settingsWidget.svelte";
  import EndGameButtons from "./endGameButtons.svelte";

  //   const savedStates = localStorage.getItem("");
  const startDate: string = "2025-05-07";
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
  //sharing
  let shareText = "Nully";
  //reveal
  let showReveal = true;
  //settingState
  let configurations: settingState = defaultSettingState;
  let fetchedLocalStats: localStats | undefined = getLocalStats();
  //menus
  let helpOpen = false;
  let settingsOpen = false;
  let statsOpen = false;
  //sounds
  const useCache: boolean = true;
  if (browser && useCache) {
    const loadedSettings = getSettingState();
    if (loadedSettings) {
      configurations = loadedSettings;
    } else {
      // no settings saved yet
      saveState("settingState", configurations);
    }
  }
  $: setTheme(configurations.theme);
  // let ss_: settingState | null = getSettingState();
  let gs_: gameState | undefined = getGameState();
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
    // fetchedLocalStats = getLocalStats();
    guessedWord = inputValue;
    if (guessedWord == question.word) {
      win();
      playSound("click4_kerjumble.mp3", configurations.sound);
      // click3.play();
    } else if (guessedWord !== "") {
      // click4.play();
      health--;
      inputValue = "";
      health == 0
        ? playSound("click6_kerjumble.mp3", configurations.sound)
        : playSound("click9_kerjumble.mp3", configurations.sound);
      if (health == 0) {
        saveGameState(health, day, inputValue, won);
        finished();
      }
    }
    console.log(guessedWord);
  }
  async function handleShare() {
    console.log("Share Clicked");
    //shareText is made pre-emptively when the game is finished to avoid lag.
    // navigator.canShare() ? navigator.share() : navigator.clipboard.writeText("Ker");
    try {
      navigator.share({ text: shareText, title: "Kerjumble Results" });
    } catch (error) {
      console.log(shareText);
      navigator.clipboard.writeText(shareText);
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
    gs_ = gs;
  }
  function getGameState() {
    return getItemFromLocalStorage("gameState");
  }
  function saveGameToStats2(fsg: gameState) {
  if (!browser) return;

  const existing = getItemFromLocalStorage("localStats");

  let oldsave: localStats;
  if (!existing) {
    // No stats saved yet — first time
    const firstSave: localStats = {
      games: [fsg],
      meanAverageFinalHealth: fsg.health,
      streak: 1,
    };
    localStorage.setItem("localStats", JSON.stringify(firstSave));
    return;
  }

  try {
    oldsave = JSON.parse(existing);
  } catch (e) {
    console.error("Failed to parse localStats from localStorage:", e);
    return;
  }

  // Prevent duplicate saves for the same game
  const alreadySaved = oldsave.games.some((g) => g.number === fsg.number);
  if (alreadySaved) return;

  oldsave.games.push(fsg);

  // Recalculate average final health
  const totalHealth = oldsave.games.reduce((total, game) => total + game.health, 0);
  oldsave.meanAverageFinalHealth = totalHealth / oldsave.games.length;

  // Recalculate streak
  const sorted = [...oldsave.games].sort((a, b) => b.number - a.number);
  oldsave.streak = getStreak(sorted.map((g) => g.number));

  localStorage.setItem("localStats", JSON.stringify(oldsave));
}
  function getStreak(ns: number[]) : number{
    ns.reverse();
    let count = 1;
    let found = false;
    while (!found) {
      if(ns[count] !== ns[count-1]){
        found = true;
      }
      else{
        count++;
      }
    }
    return count;
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  function createShareText(gs: gameState): string {
    //  3⭐️ Kerjumble No.5 jjke.uk/kerjumble
    // Kerjumble 5 3*
    // Kerjumble 5, ✅, 3*
    let temp = "Kerjumble No." + gs.number + ": " + health + "⭐️\n";
    return temp;
  }
  function finished() {
    inputDisabled = true;
    document.getElementById("answerBox")?.blur();
    console.log("finished");
    shareText = createShareText(getGameState());
    if(gs_){
    saveGameToStats2(gs_);}
    fetchedLocalStats = getLocalStats();
    finalHealth = health;
    health = 0;
  }
  function win() {
    won = true;
    saveGameState(health, day, inputValue, won);
    finished();
    console.log("Won ", day, question.word);
  }

  let guessedWord = "";
  question = getQuestionObject();
  let display: Definition = {
    word: inputValue,
    type: question.type,
    definition: question.definitions[health - 1],
  };

  $: saveGameState(health, day, inputValue, won);
  // $: setTheme(configurations.theme);
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
  function getLocalStats(): localStats {
    return getItemFromLocalStorage("localStats");
  }

  function getSettingState(): settingState {
    // throw new Error("Function not implemented.");
    return getItemFromLocalStorage("settingState");
  }
</script>

<title>Kerjumble</title>
{#if statsOpen}
  <Header number={"stats"} bind:helpOpen bind:settingsOpen></Header>
{:else}
  <Header number={day} bind:helpOpen bind:settingsOpen></Header>
{/if}
<HealthBar bind:won bind:health></HealthBar>
<div class="MenuContainer">
  <div class="wordContainer">
    {#if settingsOpen}
      <!-- <SettingsWidget bind:configurations></SettingsWidget> -->
      <InformationContainer
        inputDisabled={true}
        inputValue="Settings"
        display={{
          word: "Settings",
          type: "noun",
          definition: "A place to customise and configure an experience.",
        }}
        capitalise
      />
      <SettingsWidget bind:configurations></SettingsWidget>
    {:else if helpOpen}
      <InformationContainer
        inputDisabled={true}
        inputValue="Kerjumble"
        display={{
          word: "Kerjumble",
          type: "noun",
          definition:
            "A game where you have five attemps to guess the day's word from a shuffled definition.",
        }}
        capitalise
      />
      <div class="helpCloseHintContainer">
        <button
          aria-label="Exit help"
          class="Holder Icon"
          on:click={() => {
            helpOpen = !helpOpen;
          }}
        >
          <svg
            class="icon-svg"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="4096.00"
            height="4096.00"
            viewBox="0 0 4096.0 4096.0"
          >
            <g
              id="document"
              transform="scale(1.0 1.0) translate(2048.0 2048.0)"
            >
              <g>
                <path
                  d="M-896.939,-1356.4 L-1356.4,-896.939 L896.939,1356.4 L1356.4,896.939 L-896.939,-1356.4 Z "
                  fill-opacity="1.00"
                />
                <path
                  d="M896.939,-1356.4 L1356.4,-896.939 L-896.939,1356.4 L-1356.4,896.939 L896.939,-1356.4 Z "
                  fill-opacity="1.00"
                />
              </g>
            </g>
          </svg>
        </button>
      </div>
    {:else if statsOpen}
      <StatsPage
        {fetchedLocalStats}
        {questions}
        on:closeButtonClicked={() => {
          statsOpen = false;
        }}
      ></StatsPage>
    {:else if health == 0 && !won}
      {#if showReveal}
        <InformationContainer
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
          inputDisabled={true}
          inputValue={question.word}
          display={{
            word: question.word,
            type: question.type,
            definition: question.definitions[0],
          }}
        />
      {/if}
      <EndGameButtons
        bind:showReveal
        on:shareButtonClicked={handleShare}
        on:statsClicked={() => {
          statsOpen = true;
        }}
      />
      <!-- won -->
    {:else if won}
      <InformationContainer
        inputDisabled={true}
        bind:inputValue
        display={{
          word: display.word,
          type: display.type,
          definition: question.definitions[0],
        }}
      ></InformationContainer>
      <EndGameButtons
        on:shareButtonClicked={handleShare}
        on:statsClicked={() => {
          statsOpen = true;
        }}
      ></EndGameButtons>
      <!-- still playing -->
    {:else if !won}
      <InformationContainer
        bind:inputDisabled
        bind:inputValue
        bind:display
        on:wordEntered={handleReceiveEnter}
      ></InformationContainer>
    {/if}
  </div>
</div>

<style>
  div.wordContainer {
    position: relative;
    width: 100%;
    outline: 1px dashed salmon;
    color: var(--text-color);
    min-width: 10rem;
    max-width: 45rem;
    margin: 0;
    padding: none;
    /* display: block; */
    text-align: left;
  }
  div.helpCloseHintContainer {
    margin: var(--boxpaddingmedium) 0 0 0;
    /* height: 100px; */
    padding: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    outline: 2px solid burlywood;
    font-size: var(--small-text);
  }
  div.MenuContainer {
    /* top: 20% */
    /* width: 20%; */

    /* margin-top: var(--boxmarginmedium); */
    /* max-width: 50rem; */
    padding: calc(var(--boxpaddingmedium) / 2) var(--boxpaddingmedium);
    position: relative;
    /* top: 30%; */
    width: auto;
    max-height: 30rem;
    max-width: 30rem;
    min-width: none;
    margin: 0 0;
    aspect-ratio: 1;
    /* height: fit-content; */
    background-color: var(--background-color);
    /* border: 3px solid var(--primary-color); */
    outline: 3px dotted rgb(148, 64, 109);
    text-align: center;
    font-size: 3rem;
    display: flex;
    flex-direction: column;
    /* justify-items: center;  */
    align-items: center;
  }
  @media screen and (min-width: 485px) {
    div.MenuContainer {
      /* top: 100%; */
      vertical-align: middle;
      margin: auto 0;
    }
  }
  img {
    display: block;
    height: var(--medium-text);
    height: 80%;
    outline: 3px dashed teal;
    /* margin: 3px; */
    /* padding: 3px; */
  }
  button {
    border: none;
    border-radius: var(--classic-border-radius);
    background: var(--secondary-color);
    background: none;
  }
  .Holder {
    /* justify-content: center;
    align-items: center; */
    margin: 0 0;
    outline: 2px solid purple;
    padding: none;
  }
  .Holder.Icon {
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--medium-text);
    width: 100%;
    min-width: var(--medium-text);
    min-height: var(--medium-text);
    font-family: inherit;
    font-size: var(--medium-text);
    max-width: 2.5rem;
    padding: 0;
    background-color: var(--secondary-color);
  }
</style>
