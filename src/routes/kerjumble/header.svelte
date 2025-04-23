<script lang="ts">
  import { onMount } from "svelte";
  export let text = "Kerjumble";
  export let number = 102;

  let display = text;
  let interval: ReturnType<typeof setInterval> | undefined;
  const letters = "abcdefghijklmnopqrstuvwxyz";
  //   const letters = "[}{]';:%^*()+=_#!~.></";]
  export let settingsOpen = false;
  function toggleSettings(){
    helpOpen = false;
    settingsOpen = !settingsOpen;

  }
  export let helpOpen = false;
  function toggleHelp(){
    settingsOpen = false;
    helpOpen = !helpOpen;
  }

  function jumble() {
    let iterations = 0;
    clearInterval(interval);

    interval = setInterval(() => {
      display = text
        .split("")
        .map((char, i) => {
          if (i < iterations) return text[i];
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      iterations += 1 / 3 - iterations / 30;
      if (iterations >= text.length) {
        clearInterval(interval);
        display = text;
      }
    }, 50);
  }

  function reset() {
    clearInterval(interval);
    display = text;
  }
  function reloadKeyPress(k: KeyboardEvent) {
    console.log(k.key);
    if (k.key == "Enter") {
      location.reload();
    }
  }
  onMount(() => {
    jumble();
  });
</script>

<div class="header">
  <div class="itemContainer">
  <button class="Holder Icon" on:click={toggleHelp}>
    <!-- ? -->
  <img src="src/lib/images/Kerjumble/icons/{helpOpen ? "x_icon_kerjumble.svg" : "question_icon_kerjumble.svg"}" alt="question mark">
</button>
  <div class="Holder">
  <span
    class="jumble"
    data-word="Kerjumble"
    role="button"
    tabindex="0"
    on:mouseenter={jumble}
    on:click={() => {
      location.reload();
    }}
    on:keydown={(k) => {
      reloadKeyPress(k);
    }}
  >
    <span class="sup-placeholder" aria-hidden="true">{number}</span>
    {display}
    <sup class="sup">{number}</sup>
    <!-- <span class="day">{number}</span> -->
  </span>
</div>
<button class="Holder Icon" on:click={toggleSettings}>
  <!-- ⚙ -->
  <img src="src/lib/images/Kerjumble/icons/{settingsOpen ? "x_icon_kerjumble.svg" : "settings_icon_kerjumble.svg"}" alt="question mark">
</button>
  </div>
  <div class="divider"></div>
</div>

<style>
  img {
    display: block;
    height: var(--medium-text);
    height: 80%;
    outline: 3px dashed teal;
    /* margin: 3px; */
    /* padding: 3px; */
  }
  button{
    border: none;
    border-radius: var(--classic-border-radius);
    background: var(--mid-grey);
    background: none;
  }
  .Holder{
    /* justify-content: center;
    align-items: center; */
    margin: 0 0;
    outline: 2px solid purple ;
    padding: none;
  }
  .Holder.Icon{
    aspect-ratio: 1;
    margin: auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--medium-text);
    width: 10%;
    min-width: var(--medium-text);
    min-height: var(--medium-text);
    font-family: inherit;
    font-size: var(--medium-text);
    max-width: 2.5rem;
    padding:0;
  }
  .jumble {
    cursor: crosshair;
    font-size: inherit;
    user-select: none;
    nav-index: 0;
    padding: var(--boxpaddingxsmall) 0;
    height: fit-content;
    display: inline-flex;
    flex-direction: row;
    outline: 2px solid green;
    gap: 0.1em;
  }
  .jumble:focus-visible {
    outline: 3px solid black;
  }
  /* for desktop */
  @media screen and (min-width: 480px) {
    .jumble {
      font-size: var(--large-text);
    }
    .Holder.Icon {
      min-width: var(--large-text);
      /* margin: auto auto; */
    }
    /* img {
      height: var(--large-text);
    } */

  }
  .day {
    font-family: serif;
    font-size: var(--small-text);
    margin: 0;
    padding: none;
  }
  .sup-placeholder {
    visibility: hidden;
    font-size: 0.6em;
    vertical-align: super;
    font-family: serif;
  }

  /* Visible superscript */
  .sup {
    font-size: 0.6em;
    vertical-align: super;
    font-family: serif;
  }
  p {
    margin:0;
    padding: 0;
    
  }
  .itemContainer{
    width: auto;
    height: min-content;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 var(--boxpaddingsmall);
    outline: 2px solid red;
  }

  div.header {
    width: 100%;
    /* text-align: center; */
    font-style: italic;
    z-index: 5;
    /* margin: var(--boxmarginsmall) 0; */
    outline: 1px solid blue;
    padding: 0;
    font-size: var(--medium-text);
    background-color: var(--background-color);
    /* border-bottom: var(--border-width) solid var(--primary-color); */
  }
  div.divider {
    position: relative;
    width: 100%;
    background-color: var(--primary-color);
    height: var(--border-width);
  }
</style>
