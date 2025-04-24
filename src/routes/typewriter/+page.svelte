<script lang="ts">
    import { browser } from "$app/environment";
  import { doc } from "prettier";
  
    let text = "The quick brown fox jumped over the lazy chinese hamster.";
    const POOL_SIZE = 5;
    let soundPool: HTMLAudioElement[] = [];
    let poolIndex = 0;
  
    if (browser) {
      // Pre-create multiple audio elements to avoid playback delay
      for (let i = 0; i < POOL_SIZE; i++) {
        const audio = new Audio("/sounds/click4_kerjumble.mp3");
        audio.volume = 0.4;
        soundPool.push(audio);
      }
    }
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener("mousemove", (event)=>{
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
  
    function playSound() {
      if (!browser || soundPool.length === 0) return;
  
      const audio = soundPool[poolIndex];
      audio.currentTime = 0;
      audio.play().catch((e) => console.warn("Play error", e));
  
      poolIndex = (poolIndex + 1) % POOL_SIZE;
    }
  
    function handleInput() {
      playSound();
    }
  </script>
  <div class="big">
    <h1>Typewriter</h1>
    <textarea id="box1" bind:value={text} on:input={handleInput}></textarea>
  </div>
  <div class="floater">{text.slice(0, Math.max(text.length -30, 0))}</div>
  <div class="imageHolder" style="top:{mouseY}px; left:{mouseX}px;">
  <img style={"top:;"} alt="daface" src="src/lib/images/Kerjumble/icons/noiseyFace.jpg">
</div>
  
  <style>
    .imageHolder {
        position: absolute;
    }
    img {
        position: relative;
        width: 120px;
        height: 120px;
        opacity: 1;
        filter: hue-rotate(3rad);
    }
    img:hover{
        filter: hue-rotate(0);
    }
    h1 {
        color: black;
        animation: blinkingColour 5s ease 1s infinite;
    }
    .floater {
        position: absolute;
        padding: 10px;
        top: 30vh;
        height: 30vh;
        width: 40vw;
        background:#9998;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        animation: blinking 3s ease-in 2s infinite;
    }

    @keyframes blinking {
        0% {
            height: 0.5vh;
        }
        50% {
            height: 30vh;
        }
        99%{
            height:0.5vh;
        }
    }
    @keyframes blinkingColour {
        0% {
            padding: 0 20px;
        }
        10% {
            background-color: cadetblue;
            color: rebeccapurple;
        }
        20% {
            background-color: rebeccapurple;
            color: black;
        }
        54%{
            background-color: black;
            color: cadetblue;
            padding: 0px;
        }
        100%{
            background-color: cadetblue;
            color: rgb(104, 8, 214);
        }
    }
    .big {
    margin: 10px;
    padding: 0;
    display: flex;
    flex-direction: column;    
    outline: 3px solid red;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 90vh;
    width: 80%;
    border-radius: 1px;
    background-image: url('src/lib/images/Kerjumble/icons/noiseyFace.jpg');
    background-repeat: repeat;
    background-size: 128px 128px;
    /* background: #3dd; */
    }
    h1 {
        color: white;
        margin: 0;
        padding: none;
    }
    textarea {
      margin: 10px;
      border: 3px solid black;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      font-family:
        "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
      background: dodgerblue;
      color: transparent;
      width: 80%;
      max-width: 500px;
      height: 80%;
      position: relative;
      display: block;
      padding: 1rem;
      font-size: 1.2rem;
      line-height: 1.6;
    }
  </style>
  