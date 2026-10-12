<script>
  import { createEventDispatcher } from "svelte";
  import '../style.css';

  let options = $state({
    image: "this",
    via: "brightness",
  });
  let imageOpCounter = $state(0);
  const imageOpCounterStates = ["this", "other"];
  $effect(() => {
    options.image = imageOpCounterStates[imageOpCounter];
  });
  const dispatch = createEventDispatcher();
  function sendApply() {
    dispatch("applyMap", options); //will come through parent as event.detail
  }
</script>

<div class="options">
  <div class="choice">Map palette to</div>
  <div class="image choice">
    <button
      onclick={() =>
        imageOpCounter === 1 ? (imageOpCounter = 0) : (imageOpCounter = 1)}
      >{imageOpCounterStates[imageOpCounter]}</button
    >
  </div>
  <div class="choice">via</div>
  <div class="pattern choice">
    <select name="pattern" id="pattern" bind:value={options.via}>
      <option value="brightness">brightness</option>
      <option value="hue">hue</option>
      <option value="edge hue">edge hue</option>
      <option value="edge brightness">edge brightness</option>
      <option value="posterise">hue posterise</option>
      <option value="brightness posterise">brightness posterise</option>
    </select>
  </div>
  <div><button onclick={sendApply} class="apply">Go</button></div>
</div>

<style>
  .options {
    font-family: inherit;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.35em;
    padding: 0.35em;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background-color: var(--secondary-color);
  }
  @media (max-width: 480px) {
    .options {
      flex: 2;
    }
  }
  .apply {
    font-size: inherit;
    flex: 1;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .options div {
    height: 100%;
    flex: 1;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95em;
    color: var(--text-color);
  }
  .choice {
    font-weight: 500;
    opacity: 0.9;
    user-select: none;
  }
  button,
  select,
  input {
    border: 1px solid rgba(255, 255, 255, 0.14);
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 100%;
    width: 100%;
    text-align: center;
    font-size: inherit;
    font-weight: 500;
    color: var(--text-color);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 65%),
                var(--primary-color);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-radius: 0.45em;
    padding: 0.25em 0.5em;
    cursor: pointer;
    transition: filter 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  }
  button:hover,
  select:hover {
    filter: brightness(1.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }
  button:active {
    transform: translateY(1px);
    filter: brightness(0.95);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  select {
    cursor: pointer;
    text-align-last: center;
    padding-right: 0.7em;
    padding-left: 0.7em;
  }
  select option {
    background-color: var(--secondary-color);
    color: var(--text-color);
  }
</style>
