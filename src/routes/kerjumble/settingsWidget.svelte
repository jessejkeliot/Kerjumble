<script lang="ts">
  import { browser } from "$app/environment";
  // Define the settingState interface
  import { saveState, type settingState } from "./types";

  // Default settings state
  export const defaultSettingState: settingState = {
    sound: false,
    music: false,
    theme: "light",
    wordset: "easy",
  };

  // Prop for the settings state
  export let configurations: settingState = defaultSettingState;

  // List of available themes
  const themes = ["light", "dark", "forest", "ocean"];

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
    configurations.theme = target.value;
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
        {#each themes as theme}
          <option value={theme}>{theme}</option>
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
    padding: var(--boxpaddingxsmall);
    background-color: #007bff;
    border: none;
    color: white;
    border-radius: var(--classic-border-radius);
    font-weight: bold;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
  button:focus {
    background-color: #007bff;
  }

  select {
    padding: 5px;
    border-radius: var(--classic-border-radius);
    border: 1px solid #ccc;
    background-color: #f9f9f9;
  }
</style>
