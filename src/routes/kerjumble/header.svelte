<script lang="ts">
  import { onMount } from "svelte";

  export let text = "Kerjumble";
  export let number = 102;

  let display = text;
  let interval: ReturnType<typeof setInterval> | undefined;
  const letters = "abcdefghijklmnopqrstuvwxyz";
  //   const letters = "[}{]';:%^*()+=_#!~.></";

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

      iterations += 1 / 3 - iterations/30;
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
    if (k.key=="Enter") {
        location.reload();
    }
  }
  onMount(()=> {jumble();})
</script>

<div class="header">
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

<style>
  .jumble {
    cursor: crosshair;
    font-size: var(--medium-text);
    user-select: none;
    nav-index: 0;
    padding: 0 var(--boxpaddingsmall);
    display: inline-flex;
    /* outline: 3px solid green; */
    gap: 0.1em;

  }
  .jumble:focus-visible{
    outline: 3px solid black;
  }
  .day{
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

  div.header {
    width: 100%;
    text-align: center;
    font-style: italic;
    /* margin: var(--boxmarginsmall) 0; */
    padding: var(--boxpaddingsmall) 0;
    font-size: 1.5rem;
    background-color: var(--background-color);
    border-bottom: var(--border-width) solid var(--primary-color);
  }
</style>
