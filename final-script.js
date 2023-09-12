function Question(questionText, answerOptions, correctAnswer) {
  this.questionText = questionText;
  this.answerOptions = answerOptions;
  this.correctAnswer = correctAnswer;
}

Question.prototype.checkAnswer = function (answer) {
  return answer === this.correctAnswer;
};

let questions = [
  new Question(
    "1. Which one is a JavaScript package management application?",
    { a: "Node.js", b: "TypeScript", c: "npm", d: "NuGet" },
    "c"
  ),
  new Question(
    "2. Which one is considered within the scope of front-end development?",
    { a: "CSS", b: "HTML", c: "JavaScript", d: "SQL" },
    "d"
  ),
  new Question(
    "3. Which one is considered within the scope of back-end development?",
    { a: "Node.js", b: "TypeScript", c: "Angular", d: "React" },
    "a"
  ),
  new Question(
    "4. Which one does not use the JavaScript programming language?",
    { a: "React", b: "Angular", c: "Vue.js", d: "ASP.NET" },
    "d"
  ),
];

function Quiz(questions) {
  this.questions = questions;
  this.questionIndex = 0;
  this.correctAnswerCount = 0;
}

Quiz.prototype.getQuestion = function () {
  return this.questions[this.questionIndex];
};

const quiz = new Quiz(questions);

// Start button
document.querySelector(".btn_start").addEventListener("click", function () {
  document.querySelector(".quiz_box").classList.add("active");
  startTimer(10);
  startTimerLine();
  showQuestion(quiz.getQuestion());
  showQuestionNumber(quiz.questionIndex + 1, quiz.questions.length);
  document.querySelector(".next_btn").classList.remove("show");
});

// Next button
document.querySelector(".next_btn").addEventListener("click", function () {
  if (quiz.questions.length !== quiz.questionIndex + 1) {
    document.querySelector(".next_btn").classList.remove("show");
    quiz.questionIndex += 1;
    clearInterval(counterLine);
    clearInterval(counter);
    startTimer(10);
    startTimerLine();
    showQuestion(quiz.getQuestion());
    showQuestionNumber(quiz.questionIndex + 1, quiz.questions.length);
  } else {
    clearInterval(counterLine);
    clearInterval(counter);
    showScore(quiz.questions.length, quiz.correctAnswerCount);
    document.querySelector(".quiz_box").classList.remove("active");
    document.querySelector(".score_box").classList.add("active");
  }
});

// Replay button
document.querySelector(".btn_replay").addEventListener("click", function () {
  quiz.questionIndex = 0;
  quiz.correctAnswerCount = 0;
  document.querySelector(".score_box").classList.remove("active");
  document.querySelector(".btn_start").click();
});

// Quit button
document.querySelector(".btn_quit").addEventListener("click", function () {
  window.location.reload();
});

const optionList = document.querySelector(".option_list");
const correctIcon = '<div class="icon"><i class="fas fa-check"></i></div>';
const incorrectIcon = '<div class="icon"><i class="fas fa-times"></i></div>';

function showQuestion(question) {
  let questionText = `<span>${question.questionText}</span>`;
  let options = ``;
  for (let answer in question.answerOptions) {
    options += `
      <div class="option">
      <span><b>${answer}</b>: ${question.answerOptions[answer]}</span>
      </div>
      `;
  }
  document.querySelector(".question_text").innerHTML = questionText;
  optionList.innerHTML = options;
  const option = optionList.querySelectorAll(".option");

  for (let opt of option) {
    opt.setAttribute("onclick", "optionSelected(this)");
  }
}

function optionSelected(option) {
  clearInterval(counter);
  clearInterval(counterLine);
  let answer = option.querySelector("span b").textContent;
  let question = quiz.getQuestion();
  if (question.checkAnswer(answer)) {
    quiz.correctAnswerCount += 1;
    option.classList.add("correct");
    option.insertAdjacentHTML("beforeend", correctIcon);
  } else {
    option.classList.add("incorrect");
    option.insertAdjacentHTML("beforeend", incorrectIcon);
  }

  for (let i = 0; i < optionList.children.length; i++) {
    optionList.children[i].classList.add("disabled");
  }
  document.querySelector(".next_btn").classList.add("show");
}

function showQuestionNumber(questionNumber, totalQuestions) {
  let tag = `<span class="badge bg-warning"> ${questionNumber} / ${totalQuestions}</span>`;
  document.querySelector(".quiz_box .question_index").innerHTML = tag;
}

function showScore(totalQuestions, correctAnswerCount) {
  let tag = `You answered ${correctAnswerCount} out of ${totalQuestions} questions correctly.`;
  document.querySelector(".score_box .score_text").innerHTML = tag;
}

let counter;
function startTimer(time) {
  clearInterval(counter);
  counter = setInterval(timer, 1000);

  function timer() {
    document.querySelector(".time_second").textContent = time;
    time--;
    if (time < 0) {
      document.querySelector(".time_text").textContent = "Time's up!";
      let answer = quiz.getQuestion().correctAnswer;
      for (let option of document.querySelector(".option_list").children) {
        if (option.querySelector("span b").textContent == answer) {
          option.classList.add("correct");
          option.insertAdjacentHTML("beforeend", correctIcon);
        }
        option.classList.add("disabled");
      }
      document.querySelector(".next_btn").classList.add("show");
      clearInterval(counter);
    }
  }
}

let counterLine;
function startTimerLine() {
  let lineWidth = 0;
  counterLine = setInterval(timer, 100);

  function timer() {
    lineWidth += 5;
    document.querySelector(".time_line").style.width = lineWidth + "px";
    if (lineWidth > 549) {
      clearInterval(counterLine);
    }
  }
}
