<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
	<!-- <Header /> -->

	<main>
		{@render children()}
	</main>

	<!-- <footer>
		<p>
			CC Jesse Eliot
		</p>
	</footer> -->
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		/* min-height: 99.5vh; */
		/* width: max-content; */
		background-color: var(--background-color);
		height: 100dvh;
		/* width: auto; */
		margin: 0;
		padding: 0;
		/* outline: 3px solid green; */
	}

	main {
		outline: 2px solid rgb(72, 14, 14);
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0;
		width: 100%;
		/* max-width: 70rem; */

		margin: 0 0;
		/* box-sizing: border-box; */
	}

	footer {
		outline: 1px solid lightblue;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0.2rem;
		margin: 0;
	}
	footer p{
		margin: 0;
		padding: 0;
	}

	/* footer a {
		font-weight: bold;
	} */

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
