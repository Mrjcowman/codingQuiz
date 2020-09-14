let timeLeft = 20;
let timeEl = document.querySelector("#timer");

let percentage = 0;
let progressBar = document.querySelector(".progress-bar")

// Countdown timer
let timer = setInterval(()=>{
    timeLeft--;
    if(timeLeft<=0){
        clearInterval(timer);
        console.log("Time's up!");
    }

    timeEl.textContent = "Time: "+ (timeLeft.toString().padStart(2,'0'));
}, 1000);

