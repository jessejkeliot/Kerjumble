<script>
  import { doOperator } from "./functions";
let count = 0;
const operators = ["+", "-"];
const max = 100;
let num1 = 1;
let num2 = 2;
let opnum = 0;
let operator = "+";
let userAnswer = "";
function randomiseQuestion(){
    num1 = Math.floor(Math.random() * (max+1));
    num2 = Math.floor(Math.random() * (max+1));
    opnum = Math.floor(Math.random() * (2));
    if(opnum == 1){
        operator = "+";
    }
    if(opnum == 0){
        operator = "-";
    }
}

function checkifcorrect(){
    console.log("checking", userAnswer);
    console.log("Real answer is ", doOperator(num1, num2, operator));
    if(parseInt(userAnswer, 10) == doOperator(num1, num2, operator)){
        randomiseQuestion();
        userAnswer = "";
        count++;
    }
}
</script>
<h2>Question {count+1}</h2>
<h3>
{num1} {operator} {num2}
</h3>
<input bind:value={userAnswer} oninput={checkifcorrect} type="text" name="answerbox" id="ab1">

<style>

</style>