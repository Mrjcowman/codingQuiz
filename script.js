const maxTime = 20;
let timeLeft = maxTime+1;   // Offset by 1 so timer can start ticking right away

let timeEl = document.querySelector("#timer");
let timerLabel = document.querySelector("#timerBar .barLabel");
let timerBar = document.querySelector("#timerBar .progress-bar");

let percentage = 0;
let progressBar = document.querySelector("#progressBar .progress-bar")



// Countdown timer
const tickTimer = ()=>{
    timeLeft--;
    if(timeLeft<=0){
        timesUp();
    }

    timeEl.textContent = "Time: "+ (timeLeft.toString().padStart(2,'0'));
    timerLabel.textContent = timeLeft.toString().padStart(2,'0');

    timerBar.style.width = ((timeLeft-1)/maxTime*100)+"%"
};

const timer = setInterval(tickTimer, 1000);

const timesUp = ()=>{
    clearInterval(timer);
    console.log("Time's up!");
}

tickTimer();
