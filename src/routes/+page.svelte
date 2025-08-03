<script lang="ts">
  import LinkCard from './LinkCard.svelte';

  import type { coordinate } from "./types";

  let n = 12;
  let timing = 4400;
  // document.getElementsByClassName("main")[0].setAttribute("--n", n.toString());
  function itcc(index: number, gridsize: number): coordinate {
    //index to coordinate;
    const y = Math.floor(index / gridsize);
    const x = index % gridsize;
    return { x: x, y: y };
  }
  function dist(coordinate1: coordinate, coordinate2: coordinate): number {
    const dist1 = coordinate1.x - coordinate2.x;
    const dist2 = coordinate1.y - coordinate2.y;
    return Math.sqrt(dist1 * dist1 + dist2 * dist2);
  }
  function pythagoras_Corner_Timing(i: number, n: number) {
    return (
      (dist(itcc(i, n), {
        x: 0,
        y: 0,
      }) /
        (dist({ x: 0, y: 0 }, { x: n, y: n }) / 2)) *
      timing
    );
  }
  function index_Timing(i: number, n: number) {
    return ((itcc(i, n).x * itcc(i, n).y) / (n * n)) * timing;
  }
</script>

<svelte:head>
  <title>Shiny Trinket</title>
  <meta name="description" content="Trinkets from Jesse" />
</svelte:head>
<div class="main">
  <div class="grid_container">
    <div class="content">
      <div class="title">
        <h1>Jesse Eliot</h1>
      </div>
      <div class="cards-container">
        <LinkCard title={"Kerjumble"} link={"/kerjumble"}/>
		<LinkCard title={"Conumble"} link={"https://jessejkeliot.github.io/conumble"}/>
		<LinkCard title={"Arithmetic"} link={"/arithmetic"}/>
    <LinkCard title={"Palette Mapper"} link={"/palette-gradient"}/>
		<LinkCard title={"Github"} link={"https://github.com/jessejkeliot/"}/>
      </div>
    </div>
    {#each new Array(n * n) as item, i}
      <div class="coin-wrapper">
        <div
          class="coin"
          style="animation-delay: {pythagoras_Corner_Timing(
            i,
            n
          )}ms; animation-duration: {timing}ms"
        ></div>
        <!-- <div
          class="coin above"
          style="animation-delay: {(dist(itcc(i, n), {
            x: Math.floor(n / 2),
            y: Math.floor(n / 2),
          }) /
            (dist({ x: 0, y: 0 }, { x: n, y: n }) / 2)) *
            timing}ms; animation-duration: {timing}ms"
        ></div> -->
        <div
          class="coin below"
          style="animation-delay: {pythagoras_Corner_Timing(
            i,
            n
          )}ms; animation-duration: {timing}ms"
        ></div>
      </div>
    {/each}
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap");
  .content {
    z-index: 100;
    position: absolute;
    display: flex;
    flex-direction: row;
    height: 90vmin;
    aspect-ratio: 1/1;
  }
  .title {
    color: #000;
    font-family: Helvetica;
    font-style: italic;
    /* outline: 1px solid black; */
    display: flex;
    align-items: center;
    flex: 1;
  }
  .title h1 {
    color: #fff0;
    text-shadow: 0 0 20px #fff;
    padding: 0;
    margin: 0;
    font-size: 6rem;
    animation: fadeColorIn 1.2s ease 1s forwards;
	user-select: none;
  }
  h1 {
	padding: 0;
	margin: 0;
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
    flex: 1;
	display:flex;
	flex-direction: column;
	align-items: center;
	overflow-y: scroll;
	/* outline: 1px solid green; */
  }
  .card {
	width: 80%;
	height: 40px;
	padding: 0.5rem;
	margin: 0.5rem;
	outline: 2px solid #fffa;
	display: flex;
	align-items: center;
	justify-content: left;
	font-family:Helvetica;
	font-size: 1.5rem;
	color: #FFFA;
	border-radius: 0.5rem;
	backdrop-filter: blur(0);
	transition: backdrop-filter 0.3s ease;
	animation: fadeColorIn 1.2s ease 2s forwards;
	text-shadow: 0 0 5px #fff;
	box-shadow: inset 0 0 10px;
  }
  .card:hover{
	font-style: italic;
	backdrop-filter: blur(5px);
  }
  .main {
    --n: 12;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: Helvetica, sans-serif;
    font-weight: 700;
  }
  .grid_container {
    display: grid;
    grid-template-columns: repeat(var(--n), 1fr);
    aspect-ratio: 1 / 1;
    width: 90vmin; /* scales with viewport */
    height: auto;
    gap: 0.5rem;
    margin: auto;
    background: linear-gradient(0.125turn, #888, #555);
    padding: 0.5rem;
    outline: 0.5rem solid #4f2673;
  }
  .coin-wrapper {
    position: relative;
    aspect-ratio: 1 / 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .coin-wrapper div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .coin {
    /* margin: 0.5rem; */
    background: #888;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: max(10px, 1vw);
    outline: 1px solid black;
    outline: none;
    /* box-shadow: inset 0 0 3px #111; */
    animation: flip-diagonal cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
    user-select: none;
    border-radius: 0;
  }
  .coin.above {
    z-index: 2;
    background: linear-gradient(hsl(200, 70%, 30%), hsl(200, 50%, 50%));
    box-shadow: inset 0 0 10px hsl(200, 50%, 10%);
    outline: none;
    animation: disappear linear infinite;
    border-radius: 0;
  }
  .coin.below {
    position: relative;
    z-index: 0;
    background-color: #4f2673;
    animation: flip-diagonal-back linear infinite;
    width: 80%;
    height: 80%;
    outline: none;
  }
  @keyframes disappear {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes flip-diagonal {
    0% {
      transform: rotate3d(-1, 1, 0, 0deg);
    }
    50% {
      background: #555;
      transform: rotate3d(-1, 1, 0, 50deg);
    }
    100% {
      transform: rotate3d(-1, 1, 0, 0deg);
    }
  }
  @keyframes flip-diagonal-back {
    0% {
      transform: rotate3d(-1, 1, 0, 0deg);
    }
    50% {
      opacity: 0;
      transform: rotate3d(-1, 1, 0, 180deg);
    }
    100% {
      transform: rotate3d(-1, 1, 0, 0deg);
    }
  }
  section {
    background-image: repeating-radial-gradient(
      rgb(150, 30, 72),
      rgb(190, 10, 121)
    );
    font-family:
      "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  }
  .linkContainer {
    background-color: #cbb5;
    margin: 0.5rem 0;
    padding: 0.7rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    font-size: 2rem;
    backdrop-filter: blur(10px);
  }
  a {
    color: black;
    font-style: italic;
  }
</style>
