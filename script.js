function displayQuestion() {
  questionDisplay.innerText += questions.question;
  for (let i = 0; i < questions.option.length; i++) {
    radioBtn[i].value = questions.option[i]
    optionDisplays[i].innerHTML = questions.option[i];
  }
}

function checkAnswer() {
  choosenAnswer = document.querySelector("input[name='flexRadioDefault']:checked");
  if (choosenAnswer.value === questions.answer) {
    console.log("correct");
  } else {
    console.log("wrong");
  }
}

async function fetchQuestions() {
  try {
  const response = await fetch("https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple");
  const data = await response.json();
    if (data.response_code === 0) {
      console.log("Success: Returned results successfully.");

      questions = data.results.map(item => {
        return {
          question : item.question,
          answer : item.correct_answer,
          options : [...item.incorrect_answers, item.correct_answer],
        }
      });

      console.log(questions);
    } 
    // handle error according to API documentation for response_code
    else if (data.response_code === 1) {
      console.error("Error: No Results. Could not return results. The API doesn't have enough questions for your query.");
    } else if (data.response_code === 2) {
      console.error("Error: Invalid Parameter. Contains an invalid parameter. Arguments passed in aren't valid.");
    } else if (data.response_code === 3) {
      console.error("Error: Token Not Found. Session Token does not exist.");
    } else if (data.response_code === 4) {
      console.error("Error: Token Empty. Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.");
    } else if (data.response_code === 5) {
      console.error("Error: Rate Limit. Too many requests have occurred. Each IP can only access the API once every 5 seconds.");
    } else {
      // for any unexpected error
      console.error("Error: Unknown Error.");
    }
  } catch (error) {
    // for any other network error
    console.error("Error: Network Error:", error.message);
  }
}
  

let questions = [];

const questionDisplay = document.getElementById("question");
const radioBtn = document.querySelectorAll(".form-check-input");
const optionDisplays = document.querySelectorAll(".form-check-label");

fetchQuestions();

//https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple
