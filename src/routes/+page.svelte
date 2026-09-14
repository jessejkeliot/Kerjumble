<script lang="ts">
  import LinkCard from './LinkCard.svelte';
  import SketchCanvas from '$lib/components/SketchCanvas.svelte';
  import { sketches } from './sketches';

  let currentSketchIndex = $state(0);

  const currentSketch = $derived(sketches[currentSketchIndex]);

  function nextSketch() {
    currentSketchIndex = (currentSketchIndex + 1) % sketches.length;
  }

  function prevSketch() {
    currentSketchIndex = (currentSketchIndex - 1 + sketches.length) % sketches.length;
  }
</script>

<svelte:head>
  <title>Shiny Trinket</title>
  <meta name="description" content="Trinkets from Jesse" />
</svelte:head>

<div class="main">
  <div class="grid_container">
    <div class="p5-bg">
      <SketchCanvas sketch={currentSketch.sketch} />
    </div>

    <div class="content">
      <div class="title">
        <h1>Shiny Trinket</h1>
      </div>

      <div class="cards-container">
        <LinkCard title={"Kerjumble"} link={"/kerjumble"} index={0} />
        <LinkCard title={"Conumble"} link={"https://jessejkeliot.github.io/conumble"} index={1} />
        <LinkCard title={"Arithmetic"} link={"/arithmetic"} index={2} />
        <LinkCard title={"Palette Mapper"} link={"/palette-gradient"} index={3} />
        <LinkCard title={"Github"} link={"https://github.com/jessejkeliot/"} index={4} />
      </div>

      <div class="sketch-controls">
        <button class="control-btn" onclick={prevSketch} aria-label="Previous sketch">
          ‹
        </button>
        <button class="sketch-indicator" onclick={nextSketch} title="Click to cycle sketches">
          <span>{currentSketch.title} ({currentSketchIndex + 1}/{sketches.length})</span>
        </button>
        <button class="control-btn" onclick={nextSketch} aria-label="Next sketch">
          ›
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap");

  .main {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 100vh;
    width: 100%;
    font-family: Helvetica, sans-serif;
    font-weight: 700;
    box-sizing: border-box;
    padding: 1rem;
  }

  .grid_container {
    position: relative;
    aspect-ratio: 1 / 1;
    width: min(90vw, 85vh, 600px);
    height: auto;
    margin: auto;
    outline: 0.5rem solid #4f2673;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #111;
  }

  .p5-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .content {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.25rem 1rem 0.75rem 1rem;
    box-sizing: border-box;
    pointer-events: none;
  }

  .content > * {
    pointer-events: auto;
  }

  .title {
    color: #000;
    font-family: Helvetica;
    font-style: italic;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    margin-bottom: 0.5rem;
  }

  .title h1 {
    color: #fff0;
    text-shadow: 0 0 20px #fff;
    padding: 0;
    margin: 0;
    font-size: clamp(2.2rem, 7vw, 4.5rem);
    animation: fadeColorIn 1.2s ease 1s forwards;
    user-select: none;
    text-align: center;
  }

  @keyframes fadeColorIn {
    from {
      color: #fff0;
    }
    to {
      color: #fff9;
    }
  }

  .cards-container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    min-height: 0;
    gap: 0.25rem;
  }

  .sketch-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex: 0 0 auto;
    margin-top: 0.5rem;
  }

  .control-btn {
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: all 0.2s ease;
    user-select: none;
  }

  .control-btn:hover {
    background: rgba(79, 38, 115, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
    transform: scale(1.1);
  }

  .sketch-indicator {
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 1rem;
    padding: 0.5rem;
    font-size: 0.85rem;
    font-family: inherit;
    font-weight: 500;
    gap: 0.4rem;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: all 0.2s ease;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sketch-indicator:hover {
    background: rgba(79, 38, 115, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }

  .count {
    opacity: 0.65;
    font-size: 0.75rem;
  }

  @media (max-width: 600px) {
    .content {
      padding: 0.75rem 0.5rem 0.5rem 0.5rem;
    }
    .title h1 {
      font-size: clamp(1.8rem, 6.5vw, 3rem);
    }
  }
</style>
