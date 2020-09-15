const maxTime = 20;
let timeLeft = maxTime+1;   // Offset by 1 so timer can start ticking right away

let timer;
let timeEl = document.querySelector("#timer");
let timerLabel = document.querySelector("#timerBar .barLabel");
let timerBar = document.querySelector("#timerBar .progress-bar");

let percentage = 0;
let progressBar = document.querySelector("#progressBar .progress-bar")

let questions = [];
let rightAnswer = 0;



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
    document.querySelector("#startPromptDiv").style.display = "none";
    document.querySelector("#quizQuestionDiv").style.display = "block";

    timer = setInterval(tickTimer, 1000);

    displayQuestion();

})

// Displays the question at the given index
let displayQuestion = (questionIndex=0)=>{
    if(questionIndex>questions.length){
        console.error("Question Index out of bounds! Cannot load the question at index "+questionIndex+", aborting.");
        return;
    }
    let thisQuestion = questions[questionIndex];
    console.log(thisQuestion);
    $("#questionHeading").text(thisQuestion.question);
    console.log(thisQuestion.options[0]);
    $("#answerA").find("label").text(thisQuestion.options[0]);
    $("#answerB").find("label").text(thisQuestion.options[1]);
    $("#answerC").find("label").text(thisQuestion.options[2]);
    $("#answerD").find("label").text(thisQuestion.options[3]);

    rightAnswer = thisQuestion.answer;
}

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
    
    if(questions.length==0){
        await loadQuestions();
    }
    
    document.querySelector("#startButton").disabled = false;
    document.querySelector("#loading").style.visibility = "hidden";
    console.log("Initialized!");
}

document.onload(()=>{
    initializeQuiz();
})