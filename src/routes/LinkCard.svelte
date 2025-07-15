<script lang="ts">
  import { fade } from "svelte/transition";

  export let title: string;
  export let index: number = 0;
  export let svg: string = "$lib/images/github.svg"; // default to a symbol id
  export let link: string = "/";
</script>
<div
  class="card"
  aria-label={`link card to ${title}`}
  aria-roledescription="link"
  in:fade={{ duration: 300, delay: index * 200 }}
>
  <a href={link}>{title}</a>
  <svg viewBox="0 0 24 24" class="icon">
    <use href={svg} />
  </svg>
</div>

<style>
  @keyframes fadeColorIn {
    from {
      color: #fff0;
    }
    to {
      color: #fff9;
    }
  }
  .card {
    width: 80%;
    height: 40px;
    padding: 0.5rem;
    margin: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: left;
    font-family: Helvetica;
    font-size: 1.5rem;
    color: #fffa;
    border-radius: 0.5rem;
    backdrop-filter: blur(0);
    transition: backdrop-filter 0.3s ease;
    text-shadow: 0 0 5px #fff;
    box-shadow: inset 0 0 10px;
    outline: 2px solid #000a;
    /* box-sizing: border-box; */
    cursor: pointer;
  }
  a {
    text-decoration: inherit;
    color: inherit;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card:hover {
    font-style: italic;
    backdrop-filter: blur(12px);
  }
  @keyframes disappear {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes flip-diagonal {
    0% {
      transform: rotate3d(-1, 1, 0, 0deg);
    }
    50% {
      background: #555;
      transform: rotate3d(-1, 1, 0, 50deg);
    }
    100% {
      transform: rotate3d(-1, 1, 0, 0deg);
    }
  }
  @keyframes flip-diagonal-back {
    0% {
      transform: rotate3d(-1, 1, 0, 0deg);
    }
    50% {
      opacity: 0;
      transform: rotate3d(-1, 1, 0, 180deg);
    }
    100% {
      transform: rotate3d(-1, 1, 0, 0deg);
    }
  }
</style>
