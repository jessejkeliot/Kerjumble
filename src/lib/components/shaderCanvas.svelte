<script lang="ts">
  import { Canvas } from "@threlte/core";
  import ShaderScene from "./shaderScene.svelte";
  import type { shaderConfig } from "$lib/types/types";

  let { shaderCode, config } = $props();

  let width = $state(0);
  let height = $state(0);
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div class="canvas-container">
  <Canvas>
    <ShaderScene {shaderCode} {config} {width} {height} />
  </Canvas>
</div>

<style>
  .canvas-container { width: 100%; height: 100%; }
</style>