<script lang="ts">
	import SketchCanvas from "$lib/components/SketchCanvas.svelte";
	import { wavemakerSketch } from "./wavemakerSketch";
</script>

<div class="sketch-wrapper">
	<SketchCanvas sketch={wavemakerSketch} />
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
