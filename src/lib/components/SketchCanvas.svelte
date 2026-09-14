<script lang="ts">
	import { onDestroy } from "svelte";
	import type p5 from "p5";

	let { sketch, class: className = "" }: { sketch: (p: p5) => void; class?: string } = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let p5Instance: p5 | null = $state(null);
	let resizeObserver: ResizeObserver | null = $state(null);

	function startSketch() {
		const currentSketch = sketch;
		const container = containerEl;
		if (!container || !currentSketch) return;

		let activeInstance: p5 | null = null;
		let disposed = false;

		import("p5").then(({ default: P5Class }) => {
			if (disposed) return;

			// Remove any previous running instance before creating the next
			if (p5Instance) {
				try {
					p5Instance.remove();
				} catch (e) {
					console.error("Error removing previous p5 instance:", e);
				}
				p5Instance = null;
			}
			container.innerHTML = "";

			activeInstance = new P5Class((p: p5) => {
				if (disposed) return;
				currentSketch(p);
			}, container);

			p5Instance = activeInstance;

			// Observe container size changes so the canvas resizes even when
			// the browser window doesn't (e.g. sidebar toggle, responsive layout)
			resizeObserver = new ResizeObserver(() => {
				if (!disposed && p5Instance && container) {
					const w = container.clientWidth;
					const h = container.clientHeight;
					if (w > 0 && h > 0) {
						p5Instance.resizeCanvas(w, h);
					}
				}
			});
			resizeObserver.observe(container);
		});

		return () => {
			disposed = true;
			if (resizeObserver) {
				resizeObserver.disconnect();
				resizeObserver = null;
			}
			if (activeInstance) {
				try {
					activeInstance.remove();
				} catch (e) {
					console.error("Error cleaning up p5 instance:", e);
				}
				activeInstance = null;
			}
			if (p5Instance === activeInstance) {
				p5Instance = null;
			}
			if (container) {
				container.innerHTML = "";
			}
		};
	}

	$effect(() => {
		const cleanup = startSketch();
		return cleanup;
	});

	onDestroy(() => {
		if (resizeObserver) {
			resizeObserver.disconnect();
			resizeObserver = null;
		}
		if (p5Instance) {
			try {
				p5Instance.remove();
			} catch (e) {
				console.error("Error destroying p5 instance:", e);
			}
			p5Instance = null;
		}
		if (containerEl) {
			containerEl.innerHTML = "";
		}
	});
</script>

<div class="sketch-canvas-container {className}" bind:this={containerEl}></div>

<style>
	.sketch-canvas-container {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.sketch-canvas-container canvas) {
		display: block;
		width: 100% !important;
		height: 100% !important;
		object-fit: cover;
	}
</style>
