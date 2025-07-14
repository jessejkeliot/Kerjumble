<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Operator, questionSetting } from "./+page";
  import { operators } from "./functions";
  let modes = $state(operators);
  let timeLimit = $state("120");
  $effect(() => {
    const addition = modes.find((m) => m.name === "Addition");
    const subtraction = modes.find((m) => m.name === "Subtraction");
    if (addition && subtraction) {
      addition.range = [...subtraction.range];
    }
  });
  $effect(() => {
    const multi = modes.find((m) => m.name === "Multiplication");
    const div = modes.find((m) => m.name === "Division");
    if (multi && div) {
      multi.range = [...div.range];
    }
  });
  function onsubmit(event: Event) {
    event.preventDefault();

    // Filter out disabled modes
    const activeModes = modes
      .filter((mode) => mode.on)
      .map((m) => ({ name: m.name, range: m.range }));

    // Format modes object into JSON string
    const modesParam = JSON.stringify(activeModes);
    const timeParam = JSON.stringify(timeLimit);

    // Create URLSearchParams
    const params = new URLSearchParams({ modes: modesParam, time: timeParam });
    // Redirect to game page with query string
    // window.location.href = `/game?${params.toString()}`;
    goto(`/arithmetic/game?${params.toString()}`);
  }
</script>

<svelte:head>
  <title>Arithmetic Game</title>
</svelte:head>
<div class="topbar">
  <h1 class="title">Speed Arithmetic</h1>
</div>
<form {onsubmit}>
  {#each modes as mode, i}
    <br />
    <div>
      <label for={mode.name}>{mode.name}:</label>
      <input
        type="checkbox"
        id={mode.name}
        name={mode.name}
        bind:checked={mode.on}
      />
    </div>
    {#if i % 2 == 1}
      <p>
        from<input
          type="number"
          name={mode.name}
          bind:value={mode.range[0]}
        />to<input type="number" name={mode.name} bind:value={mode.range[1]} />
        {mode.symbol}
        <!-- </div> -->
        <!-- <div> -->
        <input
          type="number"
          inputmode="numeric"
          name={mode.name}
          bind:value={mode.range[2]}
        />to<input type="number" name={mode.name} bind:value={mode.range[3]} />
        <!-- </div> -->
      </p>
    {/if}
  {/each}
  <br />
  <div>
    <label for="times">Time Limit: </label>
    <select id="times" name="Time Limit" class="shadow" bind:value={timeLimit}>
      <option selected value="120">120</option>
      <option value="60">60</option>
      <option value="30">30</option>
      <option value="15">15</option>
    </select>
  </div>
  <br />
  <button class="shadow">Start</button>
</form>

<style>
  select {
    min-width: 20px;
    margin: 5px 0;
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 75%;
    max-width: 600px;
  }
  .topbar h1 {
    margin: 0;
    padding: 0;
    font-size: min(2em, 10dvw);
  }
  input[type="number"] {
    min-width: 10px;
    max-width: 70px;
    width: 27%;
    margin: 0 5px;
  }
  input[type="submit"] {
    max-width: 180px;
    width: 50%;
    margin: 0 auto;
  }
  button {
    max-width: 180px;
    margin: 0 auto;
    width: 40%;
  }
  .shadow {
    box-shadow: inset 0 0 5px #444;
    border: 1px solid black;
    border-radius: 8px;
    background: linear-gradient(#ddd, #aab);
    padding: 4px 0;
  }

  .topbar {
    width: 100%;
    min-height: 2em;
    height: 10%;
    margin: 0 0 4% 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #2a7b9b;
    background: linear-gradient(
      90deg,
      rgba(42, 123, 155, 1) 0%,
      rgba(87, 199, 133, 1) 50%,
      rgba(237, 221, 83, 1) 100%
    );
  }
</style>
