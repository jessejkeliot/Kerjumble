<script lang="ts">
  import { onMount, tick } from "svelte";
  import { doOperator } from "../functions";
  import { page } from "$app/state";
  import type { Operator, Question, questionSetting } from "../+page";
  import { operators } from "../functions";
  let count = 0;
  let timeLeft: number = 120;
  const title = "Arithmetic";
  //get URL Search Params
  //stats features like. a projected score graph over time, a seconds per answer, input delay, worst sums;
  //intersect operators with urlsearchparams
  let ops: Operator[] = [];
  let question: Question;
  let startTime: number;
  const max = 100;
  let opSymbol = "";
  let opnum = 0;
  let currentAnswer = 0;
  let userInput = "";
  let isActive = false;
  let finished = false;

  let answerInput: HTMLInputElement;

  function checkifcorrect() {
    console.log("checking", userInput);
    console.log("Real answer is ", question.answer);
    if (parseInt(userInput, 10) == question.answer) {
      randomiseQuestion2();
      userInput = "";
      count++;
    }
  }
  function randomiseQuestion2() {
    const randomOperatorIndex = Math.floor(Math.random() * ops.length);
    const operator = ops[randomOperatorIndex];
    let operationValue;
    let num1;
    let num2;
    let pass = false;
    do {
      num1 = Math.floor(Math.random() * operator.range[1] + operator.range[0]);
      num2 = Math.floor(Math.random() * operator.range[3] + operator.range[2]);
      operationValue = operator.process(num1, num2);
      if (operationValue < 1 && operator.symbol === "-") {
        const temp = num1;
        num1 = num2;
        num2 = temp;
      } else if (operator.symbol === "÷" && !Number.isInteger(operationValue)) {
        const temp = num1; //answer = num1 / num2
        num1 = temp * num2;
        operationValue = temp;
      }
      if (Number.isInteger(operationValue) && operationValue > 1) {
        pass = true;
      }
    } while (!pass);
    question = {
      num1: num1,
      num2: num2,
      answer: operationValue,
      symbol: operator.symbol,
    };
  }
  function setGameParameters() {}
  onMount(() => {
    const searchParams = page.url.searchParams;
    const modesParams = searchParams.get("modes");
    const timeParam = searchParams.get("time")?.replaceAll("\"", "");
    if (modesParams) {
      try {
        //setting game parameters
        let slimOperatorsURL = JSON.parse(modesParams) as Pick<
          Operator,
          "name" | "range"
        >[];
        if (slimOperatorsURL) {
          //filter to only ones that are in the url params
          ops = operators.filter((m) =>
            slimOperatorsURL.map((v) => v.name).includes(m.name)
          );
          console.log(ops);
          // set range of each operator to the range specified in the url params
          ops.forEach((m) => {
            const found = slimOperatorsURL.find((n) => n.name == m.name);
            if (found) {
              m.range = found.range;
            }
          });
          console.log(ops);
        }
        startTime = Number(timeParam);
        timeLeft = startTime;
        randomiseQuestion2();
        console.log("Received modes:", ops);
      } catch (e) {
        console.error("Failed to parse modes:", e);
      }
    }
    isActive = true;
    const interval = setInterval(() => {
      if(timeLeft > 0)
      timeLeft--;
    }, 1000);
    return () => clearInterval(interval);
  });
  $: if (isActive && answerInput) {
    tick().then(() => {
      answerInput.focus();
    });
  }
  $: finished = timeLeft <= 0;
</script>

{#if isActive}
  <div id="game">
    {#if !finished}
      <div class="gameStats">
        <span id="time">Time Left: {timeLeft}</span>
        <span id="score">{count}</span>
      </div>
      <div class="titleContainer">
        <div class="waveOverlay" aria-hidden="true">
          {#each title.split("") as letter, i}
            {#if letter === " "}
              <span class="waveLetter space">&nbsp;</span>
            {:else}
              <span class="waveLetter" style="animation-delay: {i * 125}ms">
                {letter}
              </span>
            {/if}
          {/each}
        </div>
      </div>

      <!-- <h2>Question {count+1}</h2> -->
      <div class="question">
        <h3>
          {question.num1}
          {question.symbol}
          {question.num2} =
          <input
            bind:value={userInput}
            oninput={checkifcorrect}
            type="number"
            name="answerbox"
            id="ab1"
            bind:this={answerInput}
          />
        </h3>
      </div>
    {:else}
      <div class="question middle">
      <h2>Score: {count}</h2>
      <button onkeydown={(e: KeyboardEvent) => { if (e.key === "Enter") location.reload(); }} onclick={() => location.reload()} aria-label="retry button">Click me to retry!</button>
      </div>
    {/if}
  </div>
{:else}
  <h1>Loading</h1>
{/if}

<style>
  .middle {
    margin: 50% 0;
  }
  .title {
    font-size: 3rem;
  }
  * {
    /* outline: 1px solid green; */
  }
  .gameStats {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* padding: 0 50px; */
    width: 100%;
    font-weight: 500;
    outline: 1px solid green;
    margin: 0 10px;
  }
  .gameStats span {
    padding: 0 25px;
    outline: 2px solid black;
  }
  input {
    width: 20%;
    box-shadow: #211b47 0px 0px 10px;
  }
  div.question {
    background-color: #afafaf;
    margin: 0;
    padding: 10px 0;
    text-align: center;
    width: 30%;
    outline: 2px solid #7e7e7e;
    border-radius: min(2vw, 14px);
    box-shadow: #111 0px 5px 10px;
  }
  #game {
    min-height: 300px;
    height: 100%;
    width: 100%;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fafafa;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    /* justify-content: center; */
    /* background: #444; */
  }
  .titleContainer {
    position: relative;
    display: inline-block;
  }

  .titleText {
    font-size: 3rem;
    position: relative;
    z-index: 1;
  }

  .waveOverlay {
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;

    z-index: 2;
    margin: 10% 0;
    font-weight: 600;
    perspective-origin: 1em;
  }

  .waveLetter {
    display: inline-block;
    animation: wave 0.4s ease;
    user-select: none;
  }

  @keyframes wave {
    0% {
      transform: rotateZ(0) translateY(0);
    }
    50% {
      transform: rotateZ(-6deg) translateY(0.1em);
    }
    100% {
      transform: rotateZ(0deg) translateY(0);
    }
  }
</style>
