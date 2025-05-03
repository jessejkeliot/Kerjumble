<script lang="ts">
  import "./style.css";
  import type {
    Definition,
    gameState,
    localStats,
    Question,
    settingState,
    theme,
  } from "./types";
  import Header from "./header.svelte";
  import { onDestroy, onMount, tick } from "svelte";
  import questionsJson from "$lib/images/Kerjumble/questions.json";
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
  const startDate: string = "2025-03-15";
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
  const useCache: boolean = false;
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
  function handleShare() {
    console.log("Share Clicked");
    //shareText is made pre-emptively when the game is finished to avoid lag.
    // navigator.canShare() ? navigator.share() : navigator.clipboard.writeText("Ker");
    try {
      navigator.share({ text: shareText, title: "Kerjumble Results" });
    } catch (error) {
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

  function saveGameToStats() {
    const saves: localStats | undefined = getItemFromLocalStorage("localStats");
    console.log("save Game to local Stats");
    if (saves == undefined) {
      console.log("stats was undefined in local storage");
      //if first game ever.
      if (gs_) {
        console.log("first Game save");
        const firstSave: localStats = {
          games: [gs_],
          meanAverageFinalHealth: health,
          streak: 0,
        };
        localStorage.setItem("localStats", JSON.stringify(firstSave));
      }
    } else {
      //add to the gamestate list and update the mean final health
      //go through games to see if already saved one today.
      const alreadySaved = saves.games.some((g) => g.number === number);
      if (alreadySaved) return;
      if (gs_) {
        const newGsList: gameState[] = [...saves.games, gs_];
        const newAverage =
          newGsList.reduce((total, num) => {
            return total + num.health;
          }, 0) / newGsList.length;
        //streaks
        let newStreak = 0;
        if (gs_.won) {
          let foundFail = false;
          newStreak = 1;
          while (!foundFail) {
            const current = saves.games[saves.games.length - newStreak];
            if (current.won && current.number == gs_.number - newStreak) {
              newStreak++;
            } else {
              foundFail = true;
            }
          }
        }
        newStreak = newStreak >= 2 ? newStreak : 0;
        const tempSave: localStats = {
          games: newGsList,
          meanAverageFinalHealth: newAverage,
          streak: newStreak,
        };
        localStorage.setItem("localStats", JSON.stringify(tempSave));
      }
    }
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
    saveGameToStats();
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

{#if fetchedLocalStats}
  <div class="statsFlexHolder">
    <div class="statsHolder">
      <p>Average: {fetchedLocalStats.meanAverageFinalHealth.toFixed(2)}</p>
      <div class="divider"></div>
      <p>Streak: {fetchedLocalStats.streak}</p>
    </div>
    <button
      class="Holder Icon"
      on:click={() => {
        statsOpen = !statsOpen;
      }}
    >
      <img
        src="src/lib/images/Kerjumble/icons/{statsOpen
          ? 'x_icon_kerjumble.svg'
          : 'question_icon_kerjumble.svg'}"
        alt="cross mark"
      />
    </button>
  </div>
  {#each [...fetchedLocalStats.games].reverse() as game (game.number)}
    <div class="divider"></div>
    <p class="dictionaryNumbering">{game.number}.</p>
    <InformationContainer
      inputDisabled
      inputValue={questions[game.number].word}
      display={{
        word: questions[game.number].word,
        type: questions[game.number].type,
        definition: questions[game.number].definitions[0],
      }}
    />
  {/each}
  <div class="divider invisible"></div>
  {:else}
  <p>Can't fetch Stats</p>
{/if}

<style>
  p.dictionaryNumbering {
    font-size: var(--small-text);
    margin: var(--boxpaddingxsmall) 0;
    padding: 0;
  }
  .divider.invisible {
    background-color: transparent;
  }
  div.divider {
    position: relative;
    width: 100%;
    margin: var(--boxpaddingxsmall) 0;
    background-color: var(--primary-color);
    height: var(--border-width);
  }
  div.statsFlexHolder {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  div.statsHolder {
    width: 50%;
    text-align: center;
    font-size: var(--medium-text);
    background: var(--secondary-color);
    padding: var(--boxpaddingmedium);
    border-radius: var(--classic-border-radius);
    margin-bottom: var(--boxpaddingxsmall);
  }
  div.statsHolder p {
    padding: 0;
    margin: 0;
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
