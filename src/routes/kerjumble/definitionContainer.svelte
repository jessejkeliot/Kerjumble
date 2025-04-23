<script>
    function handleEnter() {
    guessedWord = inputValue;
    console.log(guessedWord);
  }
  let shareButtonText = "Share";
  let shareButtonColor = "var(--primary-color)";
  function handleShare() {
    console.log("Share Clicked");
    // navigator.canShare() ? navigator.share() : navigator.clipboard.writeText("Ker");
    try {
      navigator.share({ text: "Kerjumble", title: "Kerjumble Results" });
    } catch (error) {
      navigator.clipboard.writeText("resultRepresentation");
    }
    shareButtonText = "Copied!";
  }
  function finished() {
    inputDisabled = true;
    document.getElementById("answerBox")?.blur();
    createShareText();
    finalHealth = health;
    health = 0;
  }
  function lost() {
    finished();
    inputValue = "loser";
    question.type = "noun";
    question.definitions[0] =
      "The person looking at the screen at this moment; you.";
    question.definitions[0] = "A person that does not win a game; you.";
    console.log("Lost ", day);
  }
  function win() {
    finished();
    console.log("Won ", day);
  }
  let guessedWord = "";
  question = getQuestionObject();

  $: if (won) {
    win();
  }
  $: if (health == 0 && !won) {
    lost();
  }
  $: saveState(health, day, inputValue, won);
  $: {
    if (guessedWord == question.word) {
      won = true;
      // runLoopWithDelay();
      //   inputValue = "yay!";
    } else if (guessedWord !== "") {
      health--;
      inputValue = "";
      // if (health == 0) {
      //   lost();
      // }
    }
  }
  //menus
  let tempGuess = "";
  // $: inputValue = helpOpen ? "Kerjumble" : tempGuess;
  $: if (helpOpen) {
    tempGuess = inputValue;
    inputValue = "Kerjumble";
    inputDisabled = true;
  } else if (inputValue == "Kerjumble") {
    inputValue = tempGuess;
    inputDisabled = false;

    tick().then(() => {
      focusAnswerBox();
    });
  }
  $: displayType = helpOpen ? "noun" : question.type;
  $: displayDefinition = helpOpen
    ? "A game where you have to guess a word from a jumbled definition: the bars above represent how many guesses you have left."
    : question.definitions[Math.max(0, health - 1)];
</script>

<div class="wordContainer">
  <input
    class="guessBox"
    id="answerBox"
    bind:value={inputValue}
    on:keydown={(e) => {
      if (e.key === "Enter") {
        handleEnter();
      }
    }}
    on:focus={() => {
      removePlaceholder();
    }}
    disabled={inputDisabled}
    type="text"
    maxlength="14"
    placeholder="guess"
    autocapitalize="on"
    spellcheck="false"
    autocomplete="off"
  />
  <!-- <div class="underline"></div> -->
  <div class="typeContainer">{displayType}</div>
  <div class="descriptionContainer">
    <p>{displayDefinition}</p>
  </div>
  {#if health == 0}
    <div class="shareButtonContainer">
      <!-- svelte-ignore a11y_mouse_events_have_key_events -->
      <button
        style="background-color: {shareButtonColor};"
        on:click={handleShare}
        transition:fade={{
          duration: 500,
          delay: 0,
        }}>{shareButtonText}</button
      >
      <button>Stats</button>
      <button>League</button>
    </div>
  {/if}
</div>
