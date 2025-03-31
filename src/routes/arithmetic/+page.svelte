<script>
  import { doOperator } from "./functions";
let count = 0;
const operators = ["+", "-"];
const max = 100;
let num1 = 0;
let num2 = 0;
let opnum = 0;
let operator = "+";
let currentAnswer = 0;
randomiseQuestion();
let userInput = "";
function randomiseQuestion(){
    do {
    num1 = Math.floor(Math.random() * (max+1));
    num2 = Math.floor(Math.random() * (max+1));
    opnum = Math.floor(Math.random() * (2));
    if(opnum == 1){
        operator = "+";
    }
    if(opnum == 0){
        operator = "-";
    }
    } while (doOperator(num1, num2, operator) < 1);
    currentAnswer = doOperator(num1, num2, operator);
}

function checkifcorrect(){
    console.log("checking", userInput);
    console.log("Real answer is ", currentAnswer);
    if(parseInt(userInput, 10) == currentAnswer){
        randomiseQuestion();
        userInput = "";
        count++;
    }
}
</script>
<span id="time">Time Left: </span>
<span id="score">{count+1}</span>
<h1>Arithmetic Test</h1>
<!-- <h2>Question {count+1}</h2> -->
<div>
<h3>
{num1} {operator} {num2}
</h3>
<input bind:value={userInput} oninput={checkifcorrect} type="text" name="answerbox" id="ab1">
</div>
<style>
#time, #score{
    position: absolute;
}
#time{
    left: 20px;
}
#score{
    right: 20px;
}
</style>