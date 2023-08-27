// Select Element
let questionsCount = document.querySelector(".quiz-info .count span");
let bulletContainer = document.querySelector(".bullets");
let bulletsSpans = document.querySelector(".bullets .spans");
let quiz_area = document.querySelector(".quiz-area");
let answers_area = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let box_result = document.querySelector(".box-result");
let results = document.querySelector(".box-result .results");
let countdownTimer = document.querySelector(".countdown");
// Set Options
let currentIndex = 0;
let theRight_Answer = 0;
let countDownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest(); // Old way .... Just For learning
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let quizObject = JSON.parse(this.responseText);
      let quizCount = quizObject.length;
      // Create Bullets And Set Questions Count
      createBullet(quizObject);
      // Add Question Data
      addQuestions(quizObject[currentIndex], quizCount);
      // Start COuntDown
      countDown(160, quizCount);
      // Click On Submit
      submitBtn.onclick = () => {
        // Get Right Answer
        let rightAnswer = quizObject[currentIndex]["right_answer"];
        // Increase Current Index
        currentIndex++;
        // Check The Answer
        checkAnswer(rightAnswer, quizCount);
        // Remove Previous Question
        quiz_area.innerHTML = "";
        answers_area.innerHTML = "";
        // Add Question Data
        addQuestions(quizObject[currentIndex], quizCount);
        // Handle Bullets Class
        handleBullets();
        // Show Result
        showResult(quizCount);
        // Start COuntDown
        clearInterval(countDownInterval);
        countDown(160, quizCount);
      };
    }
  };
  myRequest.open("GET", "./questions.json", true);
  myRequest.send();
}
getQuestions();
function createBullet(quizNum) {
  questionsCount.innerHTML = quizNum.length;
  // Loop For Create Span (Bullets)
  for (let i = 0; i < quizNum.length; i++) {
    // Crate Bullets
    let spanBullet = document.createElement("span");
    // Check If Its First Span
    if (i === 0) {
      spanBullet.classList.add("on");
    }
    // Append Bullets To Main Bullets Container
    bulletsSpans.appendChild(spanBullet);
  }
}
function addQuestions(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");
    // Create Content The Title
    let questionTitleText = document.createTextNode(obj["title"]);
    // Append (questionTitleText) To The Question Title
    questionTitle.appendChild(questionTitleText);
    // Add Question Title To Quiz Area
    quiz_area.appendChild(questionTitle);
    // Loop For Create The Answers
    for (let k = 1; k <= 4; k++) {
      // Create Main Div Answer
      let boxAnswer = document.createElement("div");
      // Add Class To Main Div
      boxAnswer.className = "answer";
      // Create Radio Input
      let radioInput = document.createElement("input");
      /*
          Add Attributes To Input Radio
          01 - Attribute = type
          02 - Attribute = id
          03 - Attribute = questions
          04 - Attribute = dataset
          05 - Attribute = checked
      */
      radioInput.type = "radio";
      radioInput.setAttribute("id", `answer_${k}`);
      radioInput.name = "questions";
      radioInput.dataset.answer = obj[`answer_${k}`];
      // Make First Option Selected
      k === 1 ? (radioInput.checked = true) : false;
      // Create The Label
      let labelInput = document.createElement("label");
      // Content The Label
      let labelInputText = document.createTextNode(obj[`answer_${k}`]);
      // Add (For) Attribute To Label
      labelInput.htmlFor = `answer_${k}`;
      // Add The Text To Label
      labelInput.appendChild(labelInputText);
      // Add The Input And Label To Main Div
      boxAnswer.appendChild(radioInput);
      boxAnswer.appendChild(labelInput);
      // Append The Main Div To Answers Area
      answers_area.appendChild(boxAnswer);
    }
  }
}
function checkAnswer(right_Answer, count) {
  let answers = document.getElementsByName("questions");
  let chooseAnswer;
  answers.forEach((ele) => {
    if (ele.checked) {
      chooseAnswer = ele.dataset.answer;
      if (right_Answer === chooseAnswer) {
        theRight_Answer += 1;
      } else {
      }
    }
  });
}
function handleBullets() {
  let bullets = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bullets);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add("on");
    }
  });
}
function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    quiz_area.remove(),
      answers_area.remove(),
      submitBtn.remove(),
      bulletContainer.remove();
    box_result.style.display = "block";
    document.querySelector(".quiz-app").style.height = "60vh";
    let icon = document.createElement("i");
    let spanResults = document.createElement("span");
    let spanResultsText = document.createTextNode(
      `${theRight_Answer} From  ${count}`
    );
    let spanStatus = document.createElement("span");
    spanResults.appendChild(spanResultsText);
    spanResults.prepend(spanStatus);
    results.appendChild(icon);
    results.appendChild(spanResults);
    if (theRight_Answer < count && theRight_Answer > count / 2) {
      icon.innerHTML = `<i class="fa-solid fa-face-grin-stars"></i> <br>`;
      spanStatus.innerHTML = "Good";
      spanStatus.className = "good";
      document.querySelector("./sounds/win.mp3").play();
    } else if (theRight_Answer === count) {
      icon.innerHTML = `<i class="fa-solid fa-face-grin-hearts"></i> <br>`;
      spanStatus.innerHTML = "perfect";
      spanStatus.className = "perfect";
      document.querySelector("./sounds/win.mp3").play();
    } else {
      icon.innerHTML = `<i class="fa-solid fa-poo"></i> <br>`;
      spanStatus.innerHTML = "bad";
      spanStatus.className = "bad";
      document.querySelector("./sounds/loos.mp3").play();
    }
  }
}
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownTimer.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
