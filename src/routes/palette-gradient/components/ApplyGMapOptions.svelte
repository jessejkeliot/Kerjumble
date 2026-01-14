<script>
  import { createEventDispatcher } from "svelte";
  import './style.css';

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
    gap: 0.25em;
    padding: 0.25em;
  }
  @media (max-width: 480px) {
    .options{
      flex:2;
    }
  }
  .apply {
    font-size: inherit;
    flex: 1;
  }
  .options div {
    height: 100%;
    flex: 1;
    background-color: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
  }
  button,
  select,
  input {
    border: none;
    appearance: none;
    height: 100%;
    width: 100%;
    text-align: center;
    font-size: inherit;
    background-color: var(--primary-color);
    transition: box-shadow;
    &:hover {
      box-shadow: inset 0 0 2px #000;
    }
  }
</style>
