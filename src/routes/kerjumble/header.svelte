<script lang="ts">
  import { onMount } from "svelte";
  export let text = "Kerjumble";
  export let number: number | string = 102;

  import helpIcon from "$lib/images/Kerjumble/icons/question_icon_kerjumble.svg";
  import xIcon from "$lib/images/Kerjumble/icons/x_icon_kerjumble.svg";
  import settingsIcon from "$lib/images/Kerjumble/icons/settings_icon_kerjumble.svg"

  let display = text;
  let interval: ReturnType<typeof setInterval> | undefined;
  const letters = "abcdefghijklmnopqrstuvwxyz";
  //   const letters = "[}{]';:%^*()+=_#!~.></";]
  export let settingsOpen = false;
  function toggleSettings() {
    helpOpen = false;
    settingsOpen = !settingsOpen;
  }
  export let helpOpen = false;
  function toggleHelp() {
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
      <!-- <img src={helpOpen ? xIcon : helpIcon} alt="Help icon" /> -->
      {#if helpOpen}
      <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="4096.00" height="4096.00" viewBox="0 0 4096.0 4096.0">		<g id="document" transform="scale(1.0 1.0) translate(2048.0 2048.0)">			<g>				<path d="M-896.939,-1356.4 L-1356.4,-896.939 L896.939,1356.4 L1356.4,896.939 L-896.939,-1356.4 Z "  fill-opacity="1.00" />				<path d="M896.939,-1356.4 L1356.4,-896.939 L-896.939,1356.4 L-1356.4,896.939 L896.939,-1356.4 Z "  fill-opacity="1.00" />			</g>		</g>	</svg>
      {:else}
      <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="4096.00" height="4096.00" viewBox="0 0 4096.0 4096.0">		<g id="document" transform="scale(1.0 1.0) translate(2048.0 2048.0)">			<path d="M-44.7813,1836.86 C199.705,1837.39 398.049,1639.89 398.575,1395.41 C399.101,1150.92 201.608,952.578 -42.8782,952.052 C-287.365,951.526 -485.708,1149.02 -486.234,1393.5 C-486.76,1637.99 -289.268,1836.33 -44.7813,1836.86 Z "  fill-opacity="1.00" />			<path d="M-185.445,707.846 C241.081,767.063 1056.12,-450.088 1115.34,-876.614 C1174.56,-1303.14 877.212,-1696.36 450.686,-1755.58 L-185.445,707.846 Z "  fill-opacity="1.00" />			<path d="M409.349,-1453.44 L470.806,-1751.27 C-351.213,-1920.9 -792.916,-1538.6 -962.54,-716.582 L-664.707,-655.124 C-528.885,-1313.34 -248.862,-1589.26 409.349,-1453.44 Z "  fill-opacity="1.00" />			<path d="M-665.517,-655.765 C-408.71,-603.871 -158.81,-769.752 -106.915,-1026.56 C-55.0207,-1283.36 -220.902,-1533.27 -477.708,-1585.16 L-665.517,-655.765 Z "  fill-opacity="1.00" />		</g>	</svg>
      {/if}
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
      <!-- <img src={settingsOpen ? xIcon : settingsIcon} alt="Settings icon" /> -->
      {#if settingsOpen}
      <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="4096.00" height="4096.00" viewBox="0 0 4096.0 4096.0">		<g id="document" transform="scale(1.0 1.0) translate(2048.0 2048.0)">			<g>				<path d="M-896.939,-1356.4 L-1356.4,-896.939 L896.939,1356.4 L1356.4,896.939 L-896.939,-1356.4 Z "  fill-opacity="1.00" />				<path d="M896.939,-1356.4 L1356.4,-896.939 L-896.939,1356.4 L-1356.4,896.939 L896.939,-1356.4 Z "  fill-opacity="1.00" />			</g>		</g>	</svg>
      {:else}
      <svg class="icon-svg" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="4096.00" height="4096.00" viewBox="0 0 4096.0 4096.0">		<g id="document" transform="scale(1.0 1.0) translate(2048.0 2048.0)">			<path d="M-1738.07,-1010.65 C-1738.07,-871.682 -1624.37,-757.984 -1485.41,-757.985 L1485.41,-757.985 C1624.37,-757.985 1738.07,-871.682 1738.07,-1010.65 C1738.07,-1149.61 1624.37,-1263.31 1485.41,-1263.31 L-1485.41,-1263.31 C-1624.37,-1263.31 -1738.07,-1149.61 -1738.07,-1010.65 Z " fill-opacity="1.00" />			<path d="M-1485.41,252.662 L1485.41,252.661 C1624.37,252.661 1738.07,138.964 1738.07,-7.59735e-05 C1738.07,-138.964 1624.37,-252.662 1485.41,-252.662 L-1485.41,-252.661 C-1624.37,-252.661 -1738.07,-138.964 -1738.07,7.59735e-05 C-1738.07,138.964 -1624.37,252.662 -1485.41,252.662 Z " fill-opacity="1.00" />			<path d="M-1485.41,1263.31 L1485.41,1263.31 C1624.37,1263.31 1738.07,1149.61 1738.07,1010.65 C1738.07,871.682 1624.37,757.984 1485.41,757.985 L-1485.41,757.985 C-1624.37,757.985 -1738.07,871.682 -1738.07,1010.65 C-1738.07,1149.61 -1624.37,1263.31 -1485.41,1263.31 Z "  fill-opacity="1.00" />			<path d="M-1277.23,-549.805 C-1022.56,-549.805 -816.39,-755.971 -816.39,-1010.65 C-816.39,-1265.32 -1022.56,-1471.49 -1277.23,-1471.49 C-1531.91,-1471.49 -1738.07,-1265.32 -1738.07,-1010.65 C-1738.07,-755.971 -1531.91,-549.805 -1277.23,-549.805 Z "  fill-opacity="1.00" />			<path d="M3.37779e-05,460.841 C254.675,460.841 460.841,254.675 460.841,-2.0144e-05 C460.841,-254.675 254.675,-460.841 -6.51006e-06,-460.841 C-254.675,-460.841 -460.841,-254.675 -460.841,2.0144e-05 C-460.841,254.675 -254.675,460.841 3.37779e-05,460.841 Z "  fill-opacity="1.00" />			<path d="M1277.23,1471.49 C1531.91,1471.49 1738.07,1265.32 1738.07,1010.65 C1738.07,755.971 1531.91,549.805 1277.23,549.805 C1022.56,549.805 816.39,755.971 816.39,1010.65 C816.39,1265.32 1022.56,1471.49 1277.23,1471.49 Z "  fill-opacity="1.00" />		</g>	</svg>
      {/if}
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
    padding: 0;
    background-color: var(--secondary-color);
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
    color: var(--text-color);
    gap: 0.1em;
  }
  .jumble:focus-visible {
    outline: 3px solid black;
  }
  /* for desktop */
  @media screen and (min-width: 590px) {
    .jumble {
      font-size: var(--large-text);
    }
    .Holder.Icon {
      min-width: var(--large-text);
      margin: auto 2rem;
      outline: 1px solid red;
    }
    /* img {
      height: var(--large-text);
    } */
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
  .itemContainer {
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
