<script lang="ts">
  import { fade } from "svelte/transition";

	let { duration = 4000, color = 'gold' } = $props();

	let visible = $state(false);
	let container = $state<HTMLDivElement | null>(null);

	let confettiCount = 150;

	$effect(() => {
		visible = true;

		const timeout = setTimeout(() => {
			visible = false;
		}, duration);

		return () => clearTimeout(timeout);
	});
</script>

{#if visible}
	<div class="confetti-container" bind:this={container} out:fade>
		{#each Array(confettiCount) as _, i}
			<div
				class="confetti"
				style="
					left: {Math.random() * 100}%;
					animation-delay: {Math.random() * (duration/1000 -2)}s;
					width: {Math.random() * 6 + 4}px;
					height: {Math.random() * 6 + 4}px;
				"
			></div>
		{/each}
	</div>
{/if}

<style>
	.confetti-container {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		pointer-events: none;
		z-index: 9999;
	}

	.confetti {
        background-color: var(--primary-color);
		position: absolute;
		top: -10px;
		border-radius: 50%;
		opacity: 0.8;
		animation: fall 3s linear;
	}

	@keyframes fall {
		0% {
			transform: translateY(0) rotate(0deg);
		}
		100% {
			transform: translateY(100vh) rotate(720deg);
		}
	}
</style>
