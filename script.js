const maxTime = 20;
let timeLeft = maxTime+1;   // Offset by 1 so timer can start ticking right away

let timer;
let timeEl = document.querySelector("#timer");
let timerLabel = document.querySelector("#timerBar .barLabel");
let timerBar = document.querySelector("#timerBar .progress-bar");

let percentage = 0;
let progressBar = document.querySelector("#progressBar .progress-bar")

let questions = [];



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

const timesUp = ()=>{
    clearInterval(timer);
    console.log("Time's up!");
}

// Get questions from JSON file
let loadQuestions = async ()=>{
    try {
        const response = await fetch("questions.JSON");
        if (response.status !== 200) {
            console.error("There was an issue loading the question data. Status Code: " + response.status);
            return;
        }

        response.json().then((data) => {
            console.log(data);
            data.forEach(question => {
                questions.push(question);
            });
        });
    } catch (err) {
        console.error("Fetch Error :-S", err);
    }
}

// Handle start button press
document.querySelector("#startButton").addEventListener("click", event=>{
    console.log("click!");
    document.querySelector("#startPromptDiv").style.display = "none";
    document.querySelector("#quizQuestionDiv").style.display = "block";

    timer = setInterval(tickTimer, 1000);

})

// TODO: Display question

// TODO: Handle correct answer

// TODO: Handle wrong answer

// TODO: Handle initial input

// TODO: Handle high scores

// TODO: Handle restart

// TODO: Randomize right answer position

let initializeQuiz = async () => {
    document.querySelector("#startPromptDiv").style.display = "block";
    document.querySelector("#quizQuestionDiv").style.display = "none";
    document.querySelector("#enterScoreForm").style.display = "none";
    document.querySelector("#highScoreDiv").style.display = "none";

    document.querySelector("#startButton").disabled = true;
    document.querySelector("#loading").style.visibility = "visible";
    timeLeft = maxTime+1;
    
    if(questions.length==0)
    await loadQuestions();
    
    document.querySelector("#startButton").disabled = false;
    document.querySelector("#loading").style.visibility = "hidden";
    console.log("Initialized!");
}

initializeQuiz();