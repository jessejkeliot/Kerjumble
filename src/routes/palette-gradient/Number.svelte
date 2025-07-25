<script>
  let { prefix } = $props();
</script>

<div>
  <p>{prefix}1</p>
</div>

<style>
  div {
    perspective: 800px;
    /* transform-style: preserve-3d; */
    transform-origin: bottom middle;
    background-color: rgb(222, 195, 42);
    margin-bottom: 5rem;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    aspect-ratio: 1/1;
    /* border-radius: 5rem; */
    outline: 3px solid gold;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    user-select: none;
    animation: flip 2s linear forwards infinite;
    animation: flirt 2s ease-out forwards infinite;
    transition: box-shadow 0.3s ease;
    box-shadow: 0 10px 15px #000a;
    transform-origin: middle middle;
  }
  div:hover {
    box-shadow: 0 3px 15px #000f;
  }
  @keyframes flirt {
    0% {
        transform:rotateY(0deg);
    }
    25% {
        transform:rotateY(-40deg);
    }
    50% {
        transform:rotateY(0);
    }
    75% {
        transform:rotateY(40deg);
    }
    100% {
        transform:rotateY(0deg);
    }
  }
  @keyframes flip {
    0% {
      transform: rotate3d(0, 0, 0, 0deg);
    }
    25% {
      color: black;
    }
    26% {
      color: transparent;
    }
    75% {
      color: transparent;
    }
    76% {
      color: black;
    }
    100% {
      transform: rotate3d(0, 1, 0, 360deg);
      /* color: transparent; */
    }
  }
</style>
