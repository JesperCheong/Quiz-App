// "Fisher-Yates" for shuffling options
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
// decorder for special character from API
function decodeEntities(encodedString) {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = encodedString;
  return tempElement.textContent || tempElement.innerText;
}

async function fetchQuestions() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10&category=18");
    const data = await response.json();
    if (data.response_code === 0) {
      console.log("Success: Returned results successfully.");
      //remove loading spinner
      const loading = document.getElementById("loading-spinner");
      loading.remove();
      //organize data without cleaning up special char
      const tempQuestions = data.results.map(item => {
        //shuffle options
        const tempOptions = [...item.incorrect_answers, item.correct_answer]
        const randomizedOptions = shuffleArray(tempOptions);
        //assign key value pair
        return {
          question: item.question,
          answer: item.correct_answer,
          options: randomizedOptions,
        }
      });
      //decode special char
      questions = tempQuestions.map(questionObj => ({
        question: decodeEntities(questionObj.question),
        answer: decodeEntities(questionObj.answer),
        options: questionObj.options.map(option => decodeEntities(option))
      }));
    }
    // handle error according to API documentation for response_code
    else if (data.response_code === 1) {
      alert("Error: No Results. Could not return results. The API doesn't have enough questions for your query.");
    } else if (data.response_code === 2) {
      alert("Error: Invalid Parameter. Contains an invalid parameter. Arguments passed in aren't valid.");
    } else if (data.response_code === 3) {
      alert("Error: Token Not Found. Session Token does not exist.");
    } else if (data.response_code === 4) {
      alert("Error: Token Empty. Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.");
    } else if (data.response_code === 5) {
      alert("Error: Rate Limit. Too many requests have occurred. Each IP can only access the API once every 5 seconds.");
    } else {
      // for any unexpected error
      alert("Error: Unknown Error.");
    }
  } catch (error) {
    // for any other network error
    alert("Error: Network Error:", error.message);
  }
}
async function initialRender() {
  await fetchQuestions();
  renderQuestions();
}

function checkAnswer() {
  //store user answers in an object
  choosenAnswers = {};
  for (i = 1; i <= questions.length; i++) {
    choosenAnswer = document.querySelector(`input[name='question${i}']:checked`);
    if (choosenAnswer) {
      choosenAnswers[`question${i}`] = choosenAnswer.value;
    } else {
      choosenAnswers[`question${i}`] = "";
    }
  }
  console.log(choosenAnswers);

  //comparing user answers with correct answers
  for (i = 1; i <= questions.length; i++) {
    currentAnswer = choosenAnswers[`question${i}`]

    if (currentAnswer === "") {
      questionNode = document.getElementById(`questionCounter${i}`);
      questionNode.textContent += " 😥";
    } else if (typeof (currentAnswer) === "string") {
      choosenAnswerLabel = document.querySelector(`input[name='question${i}']:checked`).nextElementSibling;
      if (currentAnswer === questions[i - 1].answer) {
        choosenAnswerLabel.textContent += " 😀";
        score++;
      } else if (!(currentAnswer === questions[i - 1].answer)) {
        choosenAnswerLabel.textContent += " 😥";
      }
    } else {
      alert("An error occurred. Please contact dev.")
    }
  }

  //disable all option after submitted answer
  allOptions = document.querySelectorAll("input[type='radio']");
  allOptions.forEach(option => {
    option.disabled = true;
  });
  //render score & message
  renderScore();
  renderMsg();



  //render reset button
  submitBtn = document.getElementById("submitBtn")
  submitBtn.remove();
  renderResetBtn();



}
function reset() {
  score = 0;
  while (questionsSection.firstChild) {
    questionsSection.removeChild(questionsSection.firstChild);
  }
  //remove reset button
  resetBtn = document.getElementById("resetBtn")
  resetBtn.remove();
  //re-render questions
  renderQuestions();
}

function renderQuestions() {
  if (questions) {
    questions.forEach((question, index) => {
      //create wrapper
      const questionWrapper = document.createElement("div");
      questionWrapper.className = "col-md-6 p-3 p-xxl-5";
      //create question number
      const questionCounter = document.createElement("h5");
      questionCounter.classList = "border-0 rounded-3 bg-primary text-white p-2"
      questionCounter.id = `questionCounter${index + 1}`
      questionCounter.textContent = `Question ${index + 1}`;
      questionWrapper.appendChild(questionCounter);
      //create question text
      const questionText = document.createElement("div");
      questionText.className = "pb-3 ps-4";
      questionText.textContent = question.question;
      questionWrapper.appendChild(questionText);
      //craete options
      question.options.forEach((option) => {
        const form = document.createElement("div");
        form.className = "form-check";
        //create input
        const input = document.createElement("input");
        input.className = "form-check-input opacity-100";
        input.type = "radio";
        input.value = option;
        input.name = `question${index + 1}`;
        form.appendChild(input);
        //create label
        const label = document.createElement("label");
        label.className = "form-check-label opacity-100";
        label.textContent = option;
        form.appendChild(label);
        questionWrapper.appendChild(form);
      });
      questionsSection.appendChild(questionWrapper);
    });
    renderSubmitBtn();
  }
}
function renderSubmitBtn() {
  const buttonWrapper = document.getElementById("buttonWrapper");
  const submitBtn = document.createElement("button");
  submitBtn.setAttribute("onclick", "checkAnswer()");
  submitBtn.id = "submitBtn";
  submitBtn.className = "btn btn-primary fw-bold fs-5";
  submitBtn.textContent = "Check Answer";
  buttonWrapper.appendChild(submitBtn);
}
function renderResetBtn() {
  const buttonWrapper = document.getElementById("buttonWrapper");
  const resetBtn = document.createElement("button");
  resetBtn.setAttribute("onclick", "reset()");
  resetBtn.id = "resetBtn";
  resetBtn.className = "btn btn-primary fw-bold fs-5";
  resetBtn.textContent = "Reset";
  buttonWrapper.appendChild(resetBtn);
}
function renderScore() {
  const scoreWrapper = document.createElement("div");
  scoreWrapper.className = "text-center pt-3";
  scoreWrapper.textContent = `Score: ${score} /${questions.length}`;
  questionsSection.appendChild(scoreWrapper);
}
function renderMsg() {
  const msgWrapper = document.createElement("div");
  msgWrapper.className = "text-center";
  if (score <=3) {
    msgWrapper.textContent = "Oops! Looks like there's room for improvement. Keep practicing!";
  } else if (score <= 6) {
    msgWrapper.textContent = "Not bad! You're getting there. Keep up the good work!"
  } else if (score <= 8 ) {
    msgWrapper.textContent = "Great job! You're almost there. Keep pushing yourself!"
  } else if (score === 9 ) {
    msgWrapper.textContent = "Wow! Impressive! Just a little more to go!"
  } else if (score === 10) {
    msgWrapper.textContent = "Perfect score! You're a quiz master! Congratulations!"
  }
  questionsSection.appendChild(msgWrapper);
}


let questions;
let score = 0; //counter for score
const questionsSection = document.getElementById("questions");
initialRender();


