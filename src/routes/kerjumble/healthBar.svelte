<script lang="ts">
  import { cubicInOut, cubicOut } from "svelte/easing";
  import { shrinkFlex } from "./types";

  export let health = 0;
  export let won = false;
  
</script>

<div
  class="health-bar won{won} {"health" + health}"
>
  {#each Array.from({ length: health }) as _, index}
    <div
      transition:shrinkFlex
      class="bar"
      style="
        background-color: {health == 1
        ? 'var(--mid-red)'
        : 'var(--primary-color)'}"
    ></div>
  {/each}
</div>


<style>
  div.health-bar {
    margin: 0 0 1px 0;
    padding: 0px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* gap: 10px; */
    height: calc(var(--boxpaddingmedium) / 2);
    width: 100%;
    background-color: transparent;
    /* transition: background-color 0.5s; */
  }
  div.health-bar.wontrue {
    background-color: var(--win-green);
  }
  div.health-bar.wonfalse.health0 {
    background-color: var(--lose-red);
  }

  .bar {
    /* margin: inherit;
    padding: inherit; */
    /* margin: 0 1px; */
    flex: 1;
    padding: inherit;
    background-color: var(--primary-color);
    background-color: var(--secondary-color);
    outline: 2px solid var(--background-color) !important;
    /* border: 0px solid white; */
    border-width: 0 2px;
    transition: outline-color 0.5s;
    fill-opacity: 1;
    /* transition:
      flex 0.5s ease,
      background-color 1s ease; */
  }
</style>
