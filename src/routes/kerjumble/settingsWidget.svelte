<script lang="ts">
  import { browser } from "$app/environment";
  // Define the settingState interface
  import { saveState, type settingState } from "./types";
  import { defaultSettingState } from "./types";
  import {themes} from "./types";
  // Default settings state

  // Prop for the settings state
  export let configurations: settingState = defaultSettingState;


  // List of available themes
  // const themes = ["light", "dark", "party", "ocean"];

  const difficulties = ["easy", "medium", "hard"];

  // Update handlers for each setting
  function toggleMusic() {
    configurations.music = !configurations.music;
    saveState("settingState", configurations);
  }

  function toggleSounds() {
    configurations.sound = !configurations.sound;
    saveState("settingState", configurations);
  }

  function changeTheme(event: Event) {
    const target = event.target as HTMLSelectElement;
    themes.forEach(element => {
      if(element.name == target.value){
        configurations.theme = element;
      }
    });
    configurations = {... configurations};
    saveState("settingState", configurations);
  }

  function changeWordset(event: Event) {
    const target = event.target as HTMLSelectElement;
    configurations.wordset = target.value;
    saveState("settingState", configurations);
  }
</script>

<div class="settings">
  <div class="switches">
    <!-- Music Setting -->
    <div class="setting">
      <span>Music:</span>
      <button on:click={toggleMusic}>
        {configurations.music ? "On" : "Off"}
      </button>
    </div>

    <!-- Sound Setting -->
    <div class="setting">
      <span>Sounds:</span>
      <button on:click={toggleSounds}>
        {configurations.sound ? "On" : "Off"}
      </button>
    </div>

    <!-- Theme Dropdown -->
    <div class="setting">
      <span>Theme:</span>
      <select bind:value={configurations.theme} on:change={changeTheme}>
        {#each themes as theme (theme.name)}
          <option value={theme}>{theme.name}</option>
        {/each}
      </select>
    </div>

    <!-- Wordset Dropdown -->
    <div class="setting">
      <span>Wordset:</span>
      <select bind:value={configurations.wordset} on:change={changeWordset}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  </div>
</div>

<style>
  div.switches {
    margin: var(--boxpaddingsmall);
  }
  div.settings {
    min-width: 10rem;
    max-width: 45rem;
    width: 100%;
    position: relative;
    margin: var(--boxpaddingmedium) 0 0 0;
    display: flex;
    flex-direction: column;
    outline: 2px solid var(--primary-color) !important;
    text-align: left;
  }
  .settings h1 {
    font-size: 4rem;
    margin: 0 0 var(--boxpaddingmedium) 0;
  }

  .setting {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    width: 100%;
  }

  .setting span {
    flex: 1;
    font-size: var(--small-text);
    color: #333;
  }

  button {
    padding: var(--boxpaddingxsmall) var(--boxpaddingsmall);
    background-color: var(--primary-color);
    border: none;
    color: var(--text-color);
    border-radius: var(--classic-border-radius);
    width: 30%;
    font-weight: bold;
    font-size: var(--xsmall-text);
    cursor: pointer;
  }

  select {
    padding: var(--boxpaddingxsmall);
    border-radius: var(--classic-border-radius);
    border: 1px solid var(--text-color);
    background-color: var(--primary-color);
    width: 30%;

    font-weight: bold;
    font-size: var(--xsmall-text);
  }
</style>
