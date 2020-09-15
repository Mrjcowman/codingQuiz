const maxTime = 20;
let timeLeft = maxTime+1;   // Offset by 1 so timer can start ticking right away

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

// const timer = setInterval(tickTimer, 1000);

const timesUp = ()=>{
    clearInterval(timer);
    console.log("Time's up!");
}

// TODO: Display question

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

// TODO: Handle start button press

// TODO: Handle correct answer

// TODO: Handle wrong answer

// TODO: Handle initial input

// TODO: Handle high scores

// TODO: Handle restart

// TODO: Randomize right answer position

let initializeQuiz = () => {
    document.querySelector("#startPromptDiv").style.visibility = "visible";
    document.querySelector("#quizQuestionDiv").style.visibility = "hidden";
    document.querySelector("#enterScoreForm").style.visibility = "hidden";
    document.querySelector("#highScoreDiv").style.visibility = "hidden";

    document.querySelector("#startButton").disabled = true;
    timeLeft = maxTime+1;

    if(questions.length==0)
        await loadQuestions();
    
    document.querySelector("#startButton").disabled = false;
    console.log("Initialized!");
}

initializeQuiz();