<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import MageImageAdd from "~icons/mage/image-plus";
  import CardImage from "./CardImage.svelte";
  import Number from "./Number.svelte";

  // Image files and previews

</script>

<div class="whole">
  <!-- <div class="title"><h4>Ollets</h4></div> -->
  <div class="middlebox">
    <div class="IOContainer">
      <!-- Palette Drop Zone -->
      <CardImage name="one"></CardImage>

      <!-- Canvas Drop Zone -->
      <CardImage name="two"></CardImage>
    </div>
  </div>
</div>
<!-- <Number prefix={"$"}></Number> -->
<!-- STYLES -->
<style>
  * {
    /* outline: 1px solid #0009 !important; */
  }
  .middlebox {
    display: flex;
    flex-direction: column;
    height: 70%;
    width: 90%;
    /* max-height: 700px;
    max-width: 1000px; */
    border-radius: 1rem;
    /* outline: 1px solid black; */
    align-items: center;
  }
  .settingsHolder {
    width: 66%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }

  .containedImage {
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .whole {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .title {
    font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-weight: 900;
    font-style: italic;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    text-decoration: underline;
    text-underline-offset: 20px;
    text-decoration-color: aqua;
  }

  .title h1 {
    color: #000;
    /* text-shadow: 0 0 24px #333d; */
    /* outline: 1px solid black; */
    font-size: 5rem;
    margin: 0;
    /* animation: fadeColorIn 1.2s ease 1s forwards; */
    user-select: none;
    font-weight: 100;
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
    max-width: 1000px;
    outline: 3px solid #e9e9e9;
  }

  @media (max-width: 700px) {
    .IOContainer {
      flex-direction: column;
    }
    .middlebox {
      height: 90%;
    }
    .imageHolder {
      width: 100%;
    }
    .title h1 {
      font-size: minmax(10vw, 5rem);
    }
  }

  .imageHolder {
    flex: 1;
    height: 100%;
    background-color: #f9f9f9;
    border-radius: 0.5rem;
    box-shadow: inset 0 0 10px #0003;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    outline: 1px solid hsl(0, 0%, 40.5%);
  }

  @keyframes fadeColorIn {
    from {
      color: #0000;
    }
    to {
      color: #0009;
    }
  }
  canvas {
    z-index: 20;
    position: absolute;
  }
</style>
