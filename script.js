let timeLeft = 21;
const maxTime = 20;
let timeEl = document.querySelector("#timer");
let timerLabel = document.querySelector("#timerBar .barLabel");
let timerBar = document.querySelector("#timerBar .progress-bar");

let percentage = 0;
let progressBar = document.querySelector("#progressBar .progress-bar")

// Countdown timer
let timer = setInterval(()=>{
    timeLeft--;
    if(timeLeft<=0){
        clearInterval(timer);
        console.log("Time's up!");
    }

    timeEl.textContent = "Time: "+ (timeLeft.toString().padStart(2,'0'));
    timerLabel.textContent = timeLeft.toString().padStart(2,'0');

    timerBar.style.width = ((timeLeft-1)/maxTime*100)+"%"
}, 1000);

