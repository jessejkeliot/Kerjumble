<script lang="ts">
</script>

<svelte:head>
  <title>Shiny Trinket</title>
  <meta name="description" content="Trinkets from Jesse" />
</svelte:head>

<section>
  <h1>
    <div class="welcome">Jesse Eliot</div>
  </h1>
  {#snippet linkBlock(name: string, link: string)}
    <div class="linkContainer">
        <a href={link}>{name}</a>
    </div>
  {/snippet}
  {@render linkBlock('Kerjumble', '/kerjumble')}
  {@render linkBlock('Typewriter', '/typewriter')}

  <h2>
    Portfolio Page
	<strong>Hire Jesse. Make him work.</strong>
    <a href="/arithmetic">Zetamac</a>
  </h2>
</section>

<style>
	section {
		background-image: repeating-radial-gradient(rgb(150, 30, 72), rgb(190, 10, 121));
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
	}
	.linkContainer {
		background-color: #CBB5;
		margin: 0.5rem 0;
		padding: 0.7rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 5px;
		font-size: 2rem;
		backdrop-filter: blur(10px);
	}
	a {
		color: black;
		font-style: italic;
	}
</style>