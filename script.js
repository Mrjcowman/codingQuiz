// TODO: refactor to use jQuery throughout whole code for consistency
// TODO: reorganize for easier readability
// Sorry grader ^^;

const maxTime = 50;
const tick = 0.05;
let timeLeft = maxTime+tick;   // Offset by 1 tick so timer can start ticking right away

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
    timeLeft-=tick;
    if(timeLeft<=0){
        timesUp();
    }
    timerLabel.textContent = Math.round(timeLeft).toString().padStart(2,'0');

    timerBar.style.width = ((timeLeft-tick)/maxTime*100)+"%"
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

    timer = setInterval(tickTimer, 1000*tick);
    tickTimer();

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

$("#answerA").find("button").on("click", event=>{event.target.blur(); checkAnswer(0)});
$("#answerB").find("button").on("click", event=>{event.target.blur(); checkAnswer(1)});
$("#answerC").find("button").on("click", event=>{event.target.blur(); checkAnswer(2)});
$("#answerD").find("button").on("click", event=>{event.target.blur(); checkAnswer(3)});

// Handle initial input
$("form button").on("click", event=>{
    event.preventDefault();
    let initialInputVal = $("#initialInput").val();

    if(initialInputVal.trim()){
        addScore(initialInputVal, timeLeft);
    }else{
        console.log("No initials input!");
    }

    displayHighScores();
})

// High Score Processes:

let addScore = (initials, score=0)=>{
    let scoresArr = JSON.parse(localStorage.getItem("scores"));
    let thisScoreData = {"initials": initials.toUpperCase(), "score": score};

    if(scoresArr){
        scoresArr.push(thisScoreData);
        scoresArr.sort((a, b) => {
            return b.score - a.score;
        })
    }else{
        scoresArr=[thisScoreData];
    }

    localStorage.setItem("scores", JSON.stringify(scoresArr));
}

let displayHighScores = ()=>{    
    let scoresArr = JSON.parse(localStorage.getItem("scores"));
    $("#highScoreDiv ol").html("");

    if(scoresArr) {
        scoresArr.forEach((score, index) =>{
            if(index>=5) return; // Only display the top 5 scores
            
            let place = index+1;
            let paddedInitials = score.initials.padStart(3,"\xa0");
            let paddedScore = score.score.toString().padStart(2, "0");
            let text = place+". "+paddedInitials+" - "+paddedScore;

            let thisLi = $("<li>").addClass("list-group-item");
            thisLi.text(text);
            
            $("#highScoreDiv ol").append(thisLi);
        })
    }

    $("#startPromptDiv") .css({"display":"none"});
    $("#quizQuestionDiv").css({"display":"none"});
    $("#enterScoreForm") .css({"display":"none"});
    $("#highScoreDiv")   .css({"display":"block"});

}

$("nav a").on("click", function(){
    initializeQuiz();
    displayHighScores();
})

// Handle high score clear
$("#clearButton").on("click", event=>{
    localStorage.clear();
    displayHighScores();
})


// Handle restart
$("#returnButton").on("click", event=>{
    initializeQuiz();
})

// TODO: Randomize right answer position

let initializeQuiz = async () => {
    document.querySelector("#startPromptDiv").style.display = "block";
    document.querySelector("#quizQuestionDiv").style.display = "none";
    document.querySelector("#enterScoreForm").style.display = "none";
    document.querySelector("#highScoreDiv").style.display = "none";

    $("#answerStatus").text("");

    document.querySelector("#startButton").disabled = true;
    document.querySelector("#loading").style.visibility = "visible";
    timeLeft = maxTime+tick;
    currentQuestion = 0;
    
    if(questions.length==0){
        await loadQuestions();
    }
    
    document.querySelector("#startButton").disabled = false;
    document.querySelector("#loading").style.visibility = "hidden";
    console.log("Initialized!");

    localStorage.setItem("test", "Hello");
}

let gameOver = win=>{
    clearInterval(timer);
    timeLeft = Math.round(timeLeft);

    $("#startPromptDiv") .css({"display":"none"});
    $("#quizQuestionDiv").css({"display":"none"});
    $("#enterScoreForm") .css({"display":"block"});
    $("#highScoreDiv")   .css({"display":"none"});

    $("#initialInput").val("");


    if(win){
        $("form h2").text("You did it!");
        $(".yourScore").text('Your score is: '+timeLeft);
    } else {
        $("form h2").text("You ran out of time...");
        $(".yourScore").text("Your score is: 0");
        
    }
}

initializeQuiz();