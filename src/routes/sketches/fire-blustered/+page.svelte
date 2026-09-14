<script lang="ts">
	import SketchCanvas from "$lib/components/SketchCanvas.svelte";
	import { fireBlusteredSketch } from "./fireBlusteredSketch";
</script>

<div class="sketch-wrapper">
	<SketchCanvas sketch={fireBlusteredSketch} />
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
