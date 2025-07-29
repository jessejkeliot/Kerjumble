<script>
  import { createEventDispatcher } from "svelte";

    let options = {
        image: "this",
        via: "brightness"
    }
    const dispatch = createEventDispatcher();
    function sendApply() {
        dispatch("applyMap", options); //will come through parent as event.detail
    }
</script>

<div class="options">
  <div><button onclick={sendApply}>Map</button> this palette to</div>
  <div class="image choice">
    <select name="pattern" id="pattern" bind:value={options.image}>
      <option value="this">This Image</option>
      <option value="other">Other Image</option>
    </select>
  </div>
  <div class="pattern choice">
    <label for="pattern">Via</label>
    <select name="pattern" id="pattern" bind:value={options.via}>
      <option value="brightness">brightness</option>
      <option value="similarity">similarity</option>
      <option value="hue">hue</option>
      <option value="posterise">posterise</option>
      <option value="brightness posterise">brightness posterise</option>
    </select>
  </div>
</div>

<style>
  .options {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .choice {
    background-color: blanchedalmond;
  }
</style>
