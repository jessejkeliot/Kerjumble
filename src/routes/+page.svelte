<script lang="ts">
</script>

<svelte:head>
	<title>Jesse's Portfolio Site</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<div class="welcome">
			GET ONTO SHIT
		</div>

		to your new<br /> app
	</h1>
	<a href="/kerjumble">Kerjumble</a>

	<h2>
		Real Portfolio Page Now! <strong>Jesse Get To Work</strong>
		<a href="/arithmetic">Zetamac</a>
	</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		font-family: 'Times New Roman', Times, serif;
		font-size: 20vh;
		outline: dashed;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
