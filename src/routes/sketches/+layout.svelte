<script lang="ts">
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { sketches } from "./index";

  let { children } = $props();

  const rootroute = "/sketches";

  const examples = $derived(
    sketches.map((s) => ({
      title: s.title,
      route: s.route
    }))
  );
</script>

<div class="sketches-layout">
  <Sidebar header="Sketches" elements={examples} {rootroute} />
  <div class="sketch-viewport">
    {@render children()}
  </div>
</div>

<style>
  .sketches-layout {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background: #000;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  .sketch-viewport {
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0d0b14;
  }
</style>
