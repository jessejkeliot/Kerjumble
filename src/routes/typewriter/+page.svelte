<script lang="ts">
  import { browser } from "$app/environment";

  let text = "The quick brown fox jumped over the lazy chinese hamster.";

  function handleInput() {
    playSound("click9_kerjumble.mp3");
  }
  let currentAudio: HTMLAudioElement | null = null;

  export function playSound(filename: string) {
    if (!browser) return;

    // Stop the current audio if it's playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Create and play new audio
    currentAudio = new Audio("/sounds/" + filename);
    currentAudio.volume = 0.4;
    currentAudio.play();
  }
</script>

<textarea bind:value={text} on:input={handleInput}></textarea>

<style>
  textarea {
    margin: auto 10px;
    outline: 3px solid black;
    text-shadow: 0 0 5px gold;
    font-family:
      "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
    background: dodgerblue;
    width: 80%;
    max-width: 500px;
    height: 90vh;
    position: relative;
    display: block;
  }
</style>
