<script lang="ts">
  import SketchCanvas from "$lib/components/SketchCanvas.svelte";
  import { fireSketch } from "./fire/fireSketch";
</script>

<div class="sketch-wrapper">
  <SketchCanvas sketch={fireSketch} />
</div>

<style>
  .sketch-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
</style>
