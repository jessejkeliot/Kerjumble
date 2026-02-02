<script lang="ts">
  import ShaderCanvas from "$lib/components/shaderCanvas.svelte";
  import { shaderRegistry } from "$lib/shaders/shader_registry";
  import type { shaderConfig } from "$lib/types/types";
  import { page } from "$app/state";

  // 1. Explicitly type the glob to avoid 'any' errors
  const allShaders = import.meta.glob('$lib/shaders/fragment/*.frag', { 
    as: 'raw', 
    eager: true 
  }) as Record<string, string>;

  // 2. Use Svelte 5 Runes for reactivity instead of onMount
  // This ensures that when the URL changes, the shader updates immediately.
  let date = $derived(page.params.date);
  
  // 3. Derived values based on the date
  let shaderCode = $derived(allShaders[`/src/lib/shaders/fragment/${date}.frag`]);
  
  // 4. Fallback to an empty object but typed as shaderConfig
  let config = $derived((shaderRegistry[date] as shaderConfig) || { title: "Untitled" });
</script>

<main>
  {#if shaderCode}
     <ShaderCanvas {shaderCode} {config} />
  {:else}
     <div class="error">
       <p>Shader for <strong>{date}</strong> not found!</p>
       <small>Check if /src/lib/shaders/{date}.frag exists.</small>
     </div>
  {/if}
</main>

<style>
  main { width: 100vw; height: 100vh; background: black; color: white; display: grid; place-items: center; }
  .error { text-align: center; font-family: sans-serif; }
</style>