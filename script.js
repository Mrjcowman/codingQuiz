const maxTime = 50;
let timeLeft = maxTime+1;   // Offset by 1 so timer can start ticking right away

let timer;
let timerLabel = document.querySelector("#timerBar .barLabel");
let timerBar = document.querySelector("#timerBar .progress-bar");

let progressBar = document.querySelector("#progressBar .progress-bar");
let progressBarLabel = document.querySelector("#progressBar .barLabel");

let questions = [];
let rightAnswer = 0;
let currentQuestion = 0;



// Countdown timer
const tickTimer = ()=>{
    timeLeft--;
    if(timeLeft<=0){
        timesUp();
    }
    timerLabel.textContent = timeLeft.toString().padStart(2,'0');

    timerBar.style.width = ((timeLeft-1)/maxTime*100)+"%"
};

const timesUp = ()=>{
    clearInterval(timer);
    console.log("Time's up!");
    gameOver(false);
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

    displayQuestion(currentQuestion);

})

// Displays the question at the given index
let displayQuestion = (questionIndex=0)=>{
    if(questionIndex>=questions.length){
        console.error("Question Index out of bounds! Cannot load the question at index "+questionIndex+", aborting.");
        return;
    }
    let thisQuestion = questions[questionIndex];
    $("#questionHeading").text(thisQuestion.question);

    $("#answerA").find("label").text(thisQuestion.options[0]);
    $("#answerB").find("label").text(thisQuestion.options[1]);
    $("#answerC").find("label").text(thisQuestion.options[2]);
    $("#answerD").find("label").text(thisQuestion.options[3]);

    progressBarLabel.textContent = questionIndex+"/"+questions.length;
    progressBar.style.width = (questionIndex/questions.length*100)+"%";

    rightAnswer = thisQuestion.answer;
}


// Handles the answer selected. Only progresses if the answer is correct
let checkAnswer = index => {
    if(index==rightAnswer){
        // Correct!
        currentQuestion++;
        if(currentQuestion<questions.length){
            displayQuestion(currentQuestion);
            $("#answerStatus").text("Correct!");
        }else{
            console.log("Game over!");
            gameOver(true);
        }
    } else {
        // Wrong!
        timeLeft -= 5;
        $("#answerStatus").text("Wrong! -5 seconds");
    }
}

$("#answerA").find("button").on("click", ()=>{checkAnswer(0)});
$("#answerB").find("button").on("click", ()=>{checkAnswer(1)});
$("#answerC").find("button").on("click", ()=>{checkAnswer(2)});
$("#answerD").find("button").on("click", ()=>{checkAnswer(3)});

// TODO: Handle initial input

// TODO: Handle high scores

// TODO: Handle restart

// TODO: Randomize right answer position

let initializeQuiz = async () => {
    document.querySelector("#startPromptDiv").style.display = "block";
    document.querySelector("#quizQuestionDiv").style.display = "none";
    document.querySelector("#enterScoreForm").style.display = "none";
    document.querySelector("#highScoreDiv").style.display = "none";

    $("#answerStatus").text("");

    document.querySelector("#startButton").disabled = true;
    document.querySelector("#loading").style.visibility = "visible";
    timeLeft = maxTime+1;
    currentQuestion = 0;
    
    if(questions.length==0){
        await loadQuestions();
    }
    
    document.querySelector("#startButton").disabled = false;
    document.querySelector("#loading").style.visibility = "hidden";
    console.log("Initialized!");
}

let gameOver = win=>{
    clearInterval(timer);

    $("#startPromptDiv") .css({"display":"none"});
    $("#quizQuestionDiv").css({"display":"none"});
    $("#enterScoreForm") .css({"display":"block"});
    $("#highScoreDiv")   .css({"display":"none"});

    $("#initialInput").attr("value", "");


    if(win){
        $("form h2").text("You did it!");
        $(".yourScore").text('Your score is: '+timeLeft);
    } else {
        $("form h2").text("You ran out of time...");
        $(".yourScore").text("Your score is: 0");
        
    }
}

initializeQuiz();