<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import MageImageAdd from "~icons/mage/image-plus";
  import CardImage from "./CardImage.svelte";
  import './style.css';

  // Image files and previews
  let cardARef: any;
  let cardBRef: any;

  function handleApplyToOtherA(event: CustomEvent) {
    const { palette, via } = event.detail;
    console.log("")
    cardBRef?.applyExternalMap(palette, via);
  }

  function handleApplyToOtherB(event: CustomEvent) {
    const { palette, via } = event.detail;
    cardARef?.applyExternalMap(palette, via);
  }
  let clientX = $state(0);
  let clientY = $state(0);

  
  function handleMouseMove(e: MouseEvent){
    clientX = e.clientX;
    clientY = e.clientY;

  }
</script>
<svelte:window on:mousemove={handleMouseMove}></svelte:window>
<div class="whole">
  <!-- <div class="title"><h4>Ollets</h4></div> -->
  <div class="middlebox">
    <div class="IOContainer">
      <!-- Palette Drop Zone -->
      <CardImage bind:this={cardARef} name="A" on:applyToOther={handleApplyToOtherA}></CardImage>
      <!-- Canvas Drop Zone -->
      <CardImage bind:this={cardBRef} name="B" on:applyToOther={handleApplyToOtherB}></CardImage>
    </div>
  </div>
</div>

<!-- <Number prefix={"$"}></Number> -->
<!-- STYLES -->
<style>
  .middlebox {
    display: flex;
    flex-direction: column;
    height: 90%;
    width: 90%;
    /* max-height: 700px;
    max-width: 1000px; */
    border-radius: 1rem;
    /* outline: 1px solid black; */
    align-items: center;
  }
  .whole {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-family:Arial, Helvetica, sans-serif;
  }

  .IOContainer {
    flex: 9;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    gap: 1em;
    width: 100%;
    height: 100%;
    max-width: 1600px;
    min-height: 500px;
    outline: 3px solid var(--secondary-color);
  }

  @media (max-width: 700px) {
    .IOContainer {
      flex-direction: column;
      height: 200%;
    }
    .middlebox {
      height: 90%;
    }
  }
</style>
